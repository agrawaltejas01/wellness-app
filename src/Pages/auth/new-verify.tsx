import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai/react";
import OtpInput from "react-otp-input";
import {
  checkUserPhoneAndResendOtp,
  checkUserPhoneAndSendOtp,
  verifyOtplessOtp,
} from "../../apis/auth/login";
import { errorToast } from "../../components/Toast";
import {
  accessTokenAtom,
  afterLoginRedirectAtom,
  userDetailsAtom,
} from "../../atoms/atom";
import { Mixpanel } from "../../mixpanel/init";
import { setUserProfile, trackEvent } from "../../firebase/config";
import logo from "../../images/utils/zenfitx-logo.jpeg";

interface INewVerifyProps extends RouteComponentProps {
  otpLessOrderId?: string;
  phoneNumber?: string;
  isNewUser?: boolean;
}

const NewVerify: React.FC<INewVerifyProps> = ({
  otpLessOrderId,
  phoneNumber,
  isNewUser,
}) => {
  const locationStates = useLocation().state;
  const phoneNumberFromState = locationStates
    ? (locationStates as any).phoneNumber
    : null;
  const otpLessOrderIdFromState = locationStates
    ? (locationStates as any).otpLessOrderId
    : null;
  const isNewUserFromState = locationStates
    ? (locationStates as any).isNewUser
    : false;

  otpLessOrderId = otpLessOrderId || otpLessOrderIdFromState;
  phoneNumber = phoneNumber || phoneNumberFromState;
  isNewUser = isNewUser || isNewUserFromState;

  const [, setAccessTokenAtom] = useAtom(accessTokenAtom);
  const [, setUserDetailsAtom] = useAtom(userDetailsAtom);
  const [afterLoginRedirectProps] = useAtom(afterLoginRedirectAtom);

  const [otp, setOtp] = useState("");
  const [otpOrderId, setOtpOrderId] = useState(otpLessOrderId);
  const [isLoading, setIsLoading] = useState(false);
  const [wrongOtp, setWrongOtp] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");
  const resendTimer = useRef<NodeJS.Timeout | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Start resend timer with countdown
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      resendTimer.current = timer;
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  function setUserAnalytics(user: any) {
    Mixpanel.identify(user.phone);
    Mixpanel.track("Successful login", {
      phone: user.phone,
    });
    Mixpanel.people.set({
      $name: user.name,
      $phone: user.phone,
    });

    setUserProfile({
      user_id: user.phone,
      phone_number: user.phone,
      name: user.name,
    });

    trackEvent("user_login", {
      method: "otp",
      user_id: user.phone,
      last_login: new Date().toISOString(),
    });
  }

  function onSuccessfulLogin(res: any) {
    setAccessTokenAtom(res.accessToken);
    const userWithBookings = {
      ...res.user,
      noOfBookings: res.user.noOfBookings ?? 0,
    };
    setUserDetailsAtom(userWithBookings);
    setUserAnalytics(userWithBookings);

    // Check if user profile is incomplete
    const user = res.user;
    const isProfileIncomplete = !user.name || !user.gender || !user.dob;

    if (isProfileIncomplete) {
      navigate("/profile-completion", {
        replace: true,
        state: { 
          user: userWithBookings,
          afterLoginRedirectProps 
        },
      });
    } else {
      navigate(afterLoginRedirectProps?.afterLoginUrl || "/", {
        replace: true,
        state: { ...afterLoginRedirectProps },
      });
    }
  }

  const { mutate: verifyOtp } = useMutation({
    mutationFn: verifyOtplessOtp,
    onSuccess: onSuccessfulLogin,
    onError: () => {
      setIsLoading(false);
      setWrongOtp(true);
      errorToast("Invalid OTP. Please try again.");
    },
  });

  const { mutate: resendOtp } = useMutation({
    mutationFn: checkUserPhoneAndSendOtp,
    onError: () => {
      setResendStatus("error");
      Mixpanel.track("login_otp_resend_error", {
        phone: phoneNumber,
      });
    },
    onSuccess: (response) => {
      setResendStatus("success");
      setOtpOrderId(response.orderId);
      setCanResend(false);
      setCountdown(60); // Reset countdown
      Mixpanel.track("login_otp_resend_success", {
        phone: phoneNumber,
      });
    },
  });

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setWrongOtp(false);
    setResendStatus("idle");
  };

  const handleVerifyOtp = () => {
    if (otp.length === 4 && !isLoading) {
      setIsLoading(true);
      verifyOtp({
        phone: phoneNumber as string,
        otp,
        orderId: otpOrderId as string,
      });
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      resendOtp({ phone: phoneNumber as string });
    }
  };

  const isButtonDisabled = otp.length !== 4 || isLoading;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.8327 10.0003H4.16602M4.16602 10.0003L9.99935 15.8337M4.16602 10.0003L9.99935 4.16699"
              stroke="#374151"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        <div className="max-w-md mx-auto w-full">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="flex flex-row justify-center">
                <img src={logo} alt="ZenfitX" className="w-24 h-24 rounded-xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-20">
              Enter OTP
            </h1>
            <p className="text-gray-600">
              We've sent a 4-digit code to{" "}
              <span className="font-semibold">+91 {phoneNumber}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              numInputs={4}
              renderSeparator={<span className="w-4"></span>}
              renderInput={(props: any) => (
                <input
                  {...props}
                  className="w-14 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-full focus:border-black focus:outline-none transition-colors flex items-center justify-center"
                  style={{ aspectRatio: '1/1' }}
                />
              )}
              inputType="number"
              containerStyle="flex justify-center gap-3 mb-4"
            />

            {wrongOtp && (
              <p className="text-red-600 text-sm text-center mt-2">
                Incorrect OTP. Please try again.
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={isButtonDisabled}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all mb-6 ${
              isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800 active:bg-gray-900"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </button>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
            
            {resendStatus === "success" && (
              <p className="text-green-600 text-sm mb-2">OTP sent successfully!</p>
            )}
            
            {resendStatus === "error" && (
              <p className="text-red-600 text-sm mb-2">Failed to resend. Try again.</p>
            )}

            <button
              onClick={handleResendOtp}
              disabled={!canResend}
              className={`font-semibold text-sm transition-colors ${
                canResend
                  ? "text-black hover:text-gray-700"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {canResend ? "Resend OTP" : `Resend in ${countdown}s`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVerify;
