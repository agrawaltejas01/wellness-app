import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import { useMutation } from "@tanstack/react-query";
import { checkUserPhoneAndSendOtp } from "../../apis/auth/login";
import { Mixpanel } from "../../mixpanel/init";
import MetaPixel from "../../components/meta-pixel";

interface INewLoginProps extends RouteComponentProps {}

const NewLogin: React.FC<INewLoginProps> = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const submitClicked = useRef(false);

  const { mutate: sendOtp } = useMutation({
    mutationFn: checkUserPhoneAndSendOtp,
    onError: (response) => {
      setIsLoading(false);
      submitClicked.current = false;
      Mixpanel.track("login_otp_send_error", {
        phone: phoneNumber,
      });
    },
    onSuccess: (response) => {
      setIsLoading(false);
      Mixpanel.track("login_otp_send_success", {
        phone: phoneNumber,
      });
      navigate("/verify-otp", {
        state: {
          phoneNumber: phoneNumber,
          otpLessOrderId: response.orderId,
          isNewUser: !response.userExists,
        },
        replace: true,
      });
    },
  });

  useEffect(() => {
    Mixpanel.track("open_new_login_page");
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10 && !submitClicked.current) {
      submitClicked.current = true;
      setIsLoading(true);
      sendOtp(phoneNumber);
    }
  };

  const isButtonDisabled = phoneNumber.length !== 10 || isLoading;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MetaPixel />
      
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to ZenfitX
            </h1>
            <p className="text-gray-600">
              Enter your mobile number to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">+91</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit mobile number"
                  className="block w-full pl-12 pr-3 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-lg"
                  maxLength={10}
                />
              </div>
              {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                <p className="mt-1 text-sm text-red-600">
                  Please enter a valid 10-digit mobile number
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 active:bg-gray-900"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                "Get OTP"
              )}
            </button>
          </form>

          {/* Footer Text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="/privacy" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLogin;
