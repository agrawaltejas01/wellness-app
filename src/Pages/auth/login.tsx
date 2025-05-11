import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { Button, Flex } from "antd";
import colors from "../../constants/colours";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  addUser,
  checkUserPhoneAndSendOtp,
  checkUserPhoneAndSendOtplessMagicLink,
} from "../../apis/auth/login";
import useAuthRedirect from "./redirect-hook";
import { Mixpanel } from "../../mixpanel/init";

import "./style.css";
import MetaPixel from "../../components/meta-pixel";

interface ILoginProps extends RouteComponentProps {}
const Login: React.FC<ILoginProps> = () => {
  const submitClicked = useRef(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [input, setInput] = useState({
    phone: "",
    name: "",
  });

  const { signup } = useLocation().state as { signup?: boolean } || { signup: false };
  useAuthRedirect();

  function setValue(e: React.ChangeEvent<HTMLInputElement>) {
    var toSet = { ...input };
    //@ts-ignore
    toSet[e.target.name as keyof object] = e.target.value;

    setInput(toSet);
  }

  const { mutate: _checkUserPhoneAndSendOtp } = useMutation({
    mutationFn: checkUserPhoneAndSendOtp,
    onError: (response) => {
      setMagicLinkSent(false);
      submitClicked.current = false;

      Mixpanel.track("login_otp_send_error", {
        phone: input.phone,
      });
    },
    onSuccess: (response) => {
      setMagicLinkSent(true);
      Mixpanel.track("login_otp_send_success", {
        phone: input.phone,
      });
      navigate("/verify", {
        state: {
          phoneNumber: input.phone,
          otpLessOrderId: response.orderId,
        },
        replace: true
      });
    },
  });

  const { mutate: _checkUserPhoneAndSendOtplessMagicLink } = useMutation({
    mutationFn: checkUserPhoneAndSendOtplessMagicLink,
    onError: (response) => {
      setMagicLinkSent(false);
      submitClicked.current = false;

      Mixpanel.track("login_link_send_error", {
        phone: input.phone,
      });
    },
    onSuccess: () => {
      setMagicLinkSent(true);
      Mixpanel.track("login_link_send_success", {
        phone: input.phone,
      });
    },
  });

  const { mutate: _createUser } = useMutation({
    mutationFn: addUser,
    onError: (response) => {
      Mixpanel.track("user_creation_error", {
        phone: input.phone,
        name: input.name,
        error: response.message,
      });
    },
    onSuccess: () => {
      Mixpanel.track("user_creation_success", {
        phone: input.phone,
        name: input.name,
      });
    },
    onSettled: () => {
      // _checkUserPhoneAndSendOtplessMagicLink(input.phone);
      _checkUserPhoneAndSendOtp(input.phone);
    },
  });

  useEffect(() => {
    Mixpanel.track("open_login_page");
  }, []);

  function submitButton() {
    submitClicked.current = true;

    _createUser({ name: input.name, phone: input.phone, noOfBookings: 0 });
  }

  const buttonDisabled = () => {
    if (submitClicked.current) return true;

    return Boolean(input.phone.length !== 10 || !input.name);
  };

  const shareAndBack = () => {
    return (
      <div className="shareAndBack">
        <span className="Btn" onClick={() => navigate(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15.8327 10.0003H4.16602M4.16602 10.0003L9.99935 15.8337M4.16602 10.0003L9.99935 4.16699"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    );
  };

  return (
    <>
      <MetaPixel />
    <Flex flex={1} style={{ minHeight: "40vh" }} vertical justify="center">
      <Flex
        flex={1}
        vertical
        style={{
          paddingTop: "24px",
          paddingBottom: "24px",
          borderBottomRightRadius: "24px",
          borderBottomLeftRadius: "24px",
          // padding: "0px",
        }}
        className="login-banner"
      >
        {shareAndBack()}

        <span
          style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}
        >
          {" "}
          {/* Welcome To ZenfitX!{" "} */}
          {signup ? "Welcome To ZenfitX!" : "One step to go!"}
        </span>
        {/* <span
          style={{
            fontSize: "14px",
            marginTop: "4px",
          }}
        >
          Discover & book fitness activities near you.
        </span> */}
      </Flex>

      <Flex flex={1} style={{ padding: "24px" }} vertical>
        <Flex flex={1}>
          <span
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginTop: "16px",
              color: colors.secondary,
            }}
          >
            Login with your mobile number
          </span>
        </Flex>

        <Flex
          flex={1}
          style={{ marginTop: "16px" }}
          vertical
          // align="center"
          justify="center"
        >
          <Flex
            flex={1}
            vertical
            style={{
              justifySelf: "stretch",
              alignSelf: "stretch",
            }}
          >
            <span>Enter Name</span>
            <span style={{ marginTop: "8px" }}>
              <input
                name="name"
                value={input.name}
                onChange={setValue}
                style={{
                  padding: "10px",
                  width: "95%",
                  borderRadius: "5px",
                  height: "35px",
                  border: "1px solid #D9D9D9",
                  marginBottom: "15px",
                }}
                type="text"
                required
              />{" "}
            </span>
          </Flex>

          <Flex
            flex={1}
            vertical
            style={{
              justifySelf: "stretch",
              alignSelf: "stretch",
              marginTop: "16px",
            }}
          >
            <span>Mobile Number</span>
            <span style={{ marginTop: "8px" }}>
              <input
                  style={{
                  border: "1px solid #D9D9D9",
                  width: "95%",
                  height: "35px",
                  borderRadius: "5px",
                  padding: "10px",
                  
                }}
                  type="tel"
                  
                onChange={setValue}
                name="phone"
                value={input.phone}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
              />{" "}
            </span>
          </Flex>
        </Flex>

        <Flex
          flex={1}
          vertical
          align="flex-start"
          justify="center"
          style={{ marginTop: "32px" }}
        >
          {magicLinkSent ? (
            <Flex
              flex={1}
              align="center"
              justify="center"
              style={{
                justifySelf: "center",
                alignSelf: "center",
                marginBottom: "4px",
                color: colors.secondary,
                fontSize: "12px",
              }}
            >
              We have sent a link on your whatsapp to verify that its you!
            </Flex>
          ) : null}

          <Button
            disabled={buttonDisabled()}
            onClick={() => {
              submitButton();
            }}
            style={{
              flex: 1,
              backgroundColor: buttonDisabled() ? colors.secondary : "black",
              color: "white",
              height: "20%",
              width: "100%",

              justifySelf: "center",
              paddingTop: "16px",
              paddingBottom: "16px",
              borderRadius: "5px",
              fontWeight: "bolder",
            }}
          >
            Get OTP
          </Button>
        </Flex>
      </Flex>
    </Flex>
    </>
  );
};

export default Login;
