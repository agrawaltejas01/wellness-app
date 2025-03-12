import { Flex } from "antd";
import { Rs } from "../../constants/symbols";
import logo from "../../logo.svg";
import {
  ICreateRzpOrder,
  createCfOrder,
  createRzpOrder,
} from "../../apis/payments/payments";
import { navigate, useLocation } from "@reach/router";
import { EOfferType, IBatch, IGymDetails } from "../../types/gyms";
import colors from "../../constants/colours";
import { EBookNowComingFromPage, ECheckoutType } from "../../types/checkout";
import { useAtom } from "jotai/react";
import { afterLoginRedirectAtom, userDetailsAtom } from "../../atoms/atom";
import IUser from "../../types/user";
import { Mixpanel } from "../../mixpanel/init";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { shouldShowDiscount } from "../../utils/offers";
import { trackEvent } from "../../firebase/config";
import { getPastAppBookings } from "../../apis/gym/activities";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";

interface RazorpayResponse {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  error?: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
  };
}

interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}
export interface IBookNowFooter {
  batchDetails?: IBatch;
  totalAmount: number;
  gymData?: IGymDetails;
  checkoutType: ECheckoutType;
  comingFrom: EBookNowComingFromPage;
  batchId: number;
  totalGuests?: number;
  forceBookNowCta?: boolean;
  totalSavings?: number;
  isFromApp?: boolean;
  pastAppBookings?: PastAppBookingObject;
  disabled?: boolean;
  onBeforeAction?: () => boolean;
}

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function createOrderPayload(props: IBookNowFooter, userDetails: IUser) {
  let payload: ICreateRzpOrder = {
    batchId: (props.batchDetails?.id || props.batchDetails?.batchId) as number,
    totalAmount: props.totalAmount,
    userId: userDetails.id as number,
    batchPrice: props.batchDetails?.price as number,
    platform: props.isFromApp ? "APP" : "WEB",
    offerPercentage: (props.totalSavings as number)
      ? (props.batchDetails?.offerPercentage as number)
      : 0,
    offerType: props.batchDetails?.offerType as EOfferType,
    noOfGuests: props.totalGuests as number,
    username: userDetails.name,
    batchName: props?.batchDetails?.activityName || "",
    batchDate: props?.batchDetails?.date || "",
    batchTime: props?.batchDetails?.startTime || 0,
    participants: props?.batchDetails?.participants || [],
  };

  Mixpanel.track("pay_now_button_clicked_on_checkout_page", {
    ...payload,
  });
  return payload;
}

function isVersionGreaterOrEqual(
  currentVersion: string,
  minVersion: string,
): boolean {
  if (!currentVersion) return false;

  const current = currentVersion.split(".").map(Number);
  const min = minVersion.split(".").map(Number);

  for (let i = 0; i < Math.max(current.length, min.length); i++) {
    const a = current[i] || 0;
    const b = min[i] || 0;
    if (a > b) return true;
    if (a < b) return false;
  }

  return true; // Versions are equal
}

async function displayRazorpay(
  props: IBookNowFooter,
  userDetails: IUser | null,
  setLoading: (loading: boolean) => void,
) {
  setLoading(true);

  let payload = createOrderPayload(props, userDetails as IUser);
  let orderResult;

  try {
    orderResult = await createRzpOrder(payload);
  } catch (error) {
    console.log({ error });
    setLoading(false);
    return;
  }

  if (!orderResult?.orderId) {
    alert(`Could not place order!`);
    setLoading(false);
    return;
  }

  let shouldEnableWebViewIntent = false;

  if (window.platformInfo?.platform === "ios") {
    shouldEnableWebViewIntent = false;
  } else if (window.platformInfo?.platform === "android") {
    shouldEnableWebViewIntent = true;
  }

  const options = {
    key: process.env.REACT_APP_RZP_CLIENT_KEY,
    amount: props.totalAmount * 100,
    currency: "INR",
    name: "ZenfitX",
    description: `Checkout for batch - ${props.batchId}`,
    image: { logo },
    order_id: orderResult.orderId,
    prefill: {
      name: userDetails?.name as string,
      email: `${userDetails?.name as string}@example.com`,
      contact: userDetails?.phone as string,
    },
    theme: {
      color: "#1a1a1a",
    },
    webview_intent: shouldEnableWebViewIntent,
    method: {
      upi: true,
    },
    handler: (response: any) => {
      if (response.razorpay_payment_id) {
        if (props.checkoutType == ECheckoutType.BATCH)
          navigate("/checkout/success", {
            state: {
              gymData: props.gymData,
              batchDetails: props.batchDetails,
            },
          });
        else if (props.checkoutType === ECheckoutType.PLUS) {
          navigate("/plus/success");
        }
        trackEvent("slot_purchase", {
          activity_name: props.batchDetails?.activityName,
          total_amount: props.totalAmount,
          guests: props.totalGuests,
          booking_at: new Date().toISOString(),
        });
      }
    },
  };

  setLoading(false);

  // Web flow remains the same
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }
  //@ts-ignore
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

async function displayCashfree(
  props: IBookNowFooter,
  userDetails: IUser | null,
  setLoading: (loading: boolean) => void,
) {
  setLoading(true);
  const res = await loadScript("https://sdk.cashfree.com/js/v3/cashfree.js");
  if (!res) {
    alert("CF SDK failed to load. Are you online?");
    return;
  }

  let payload = createOrderPayload(props, userDetails as IUser);
  const orderResult = await createCfOrder(payload);

  const options = {
    paymentSessionId: orderResult.paymentSessionId,
    redirectTarget: "_modal",
  };

  //@ts-ignore
  const cashfree = Cashfree({
    mode: process.env.REACT_APP_CF_ENV,
  });

  setLoading(false);
  cashfree.checkout(options).then((result: any) => {
    if (result.error) {
      // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
      console.log(
        "User has closed the popup or there is some payment error, Check for Payment Status",
      );
      console.log(result.error);
    }
    if (result.redirect) {
      // This will be true when the payment redirection page couldnt be opened in the same window
      // This is an exceptional case only when the page is opened inside an inAppBrowser
      // In this case the customer will be redirected to return url once payment is completed
      console.log("Payment will be redirected");
    }
    if (result.paymentDetails) {
      // This will be called whenever the payment is completed irrespective of transaction status
      console.log("Payment has been completed, Check for Payment Status");
      if (props.checkoutType == ECheckoutType.BATCH)
        navigate("/checkout/success", {
          state: {
            gymData: props.gymData,
            batchDetails: props.batchDetails,
          },
        });
      else if (props.checkoutType === ECheckoutType.PLUS) {
        navigate("/plus/success");
      }
    }
  });
}

function MixpanelBookNowFooterInit(
  props: IBookNowFooter,
  checkoutType: ECheckoutType,
) {
  Mixpanel.track("open_payment_page", {
    ...props,
    checkoutType: checkoutType === ECheckoutType.BATCH ? "BATCH" : "PLUS",
  });
}

const calculateFinalPrice = (
  basePrice: number,
  noOfGuests: number,
  discountType: string,
  offerPercentage: number,
  maxDiscount: number,
): number => {
  if (!basePrice || !noOfGuests) return 0;

  const totalPrice = basePrice * noOfGuests;

  if (discountType === "FLAT") {
    return Math.floor((totalPrice * (100 - offerPercentage)) / 100);
  }

  if (discountType === "PERCENTAGE") {
    const percentageDiscount = (totalPrice * offerPercentage) / 100;
    const discountAmount = Math.min(maxDiscount, percentageDiscount);
    return Math.floor(totalPrice - discountAmount);
  }

  return totalPrice;
};

const BookNowFooter: React.FC<IBookNowFooter> = (props) => {
  const [userDetails] = useAtom(userDetailsAtom);
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountedAmount, setDiscountedAmount] = useState(props.totalAmount);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setAfterLoginRedirect] = useAtom(afterLoginRedirectAtom);
  const [isFromApp, setIsFromApp] = useState(false);
  const [pastAppBookings, setPastAppBookings] = useState({});

  const BACKEND_URL = process.env.REACT_APP_BE_URL;
  const batchBookingUrl = `/checkout/batch/${props.batchId}/booking`;
  const {
    batchDetails,
    totalGuests = 1,
    comingFrom,
    disabled,
    gymData,
  } = props;

  const { mutate: _getPastAppBookings } = useMutation({
    mutationFn: getPastAppBookings,
    onError: () => {
      errorToast("Error in getting past app bookings");
    },
    onSuccess: (result) => {
      console.log("past app bookings - ", result);
      setPastAppBookings(result.bookings);
      window.pastAppBookings = result.bookings;
    },
  });

  useEffect(() => {
    if (gymData) {
      setShowDiscount(
        shouldShowDiscount(
          gymData,
          userDetails,
          Boolean(isFromApp),
          pastAppBookings,
        ),
      );
    }
  }, [gymData, isFromApp, pastAppBookings, comingFrom, userDetails]);

  useEffect(() => {
    const userSource = window?.platformInfo?.platform || "web";
    const appFlag = userSource != "web" ? true : false;
    setIsFromApp(appFlag);
    window.isFromApp = appFlag;
    const userId = window.localStorage["zenfitx-user-details"]
      ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
      : null;
    if (userId) {
      _getPastAppBookings(userId);
    }
  }, []);

  useEffect(() => {
    if (showDiscount && batchDetails) {
      const finalPrice = calculateFinalPrice(
        batchDetails.price || 0,
        totalGuests,
        batchDetails.discountType || "",
        batchDetails.offerPercentage || 0,
        batchDetails.maxDiscount || 0,
      );
      setDiscountedAmount(finalPrice);
    }
  }, [showDiscount, batchDetails, totalGuests]);

  const discountText =
    gymData?.discountType === "FLAT"
      ? `FLAT ${batchDetails?.offerPercentage}% off on 1st booking at this center`
      : gymData?.discountType === "PERCENTAGE"
        ? `${batchDetails?.offerPercentage}% off upto ${Rs}${batchDetails?.maxDiscount} on 1st booking at this center`
        : "";

  const handleBookNowClick = async () => {
    if (props.onBeforeAction && !props.onBeforeAction()) {
      return;
    }

    if (disabled) {
      setErrorMessage(
        `Please select ${totalGuests} ${totalGuests === 1 ? "bike" : "bikes"} to continue`,
      );
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    if (props.forceBookNowCta) {
      Mixpanel.track("open_batch_checkout_booking", { batchId: props.batchId });
      navigate(batchBookingUrl, {
        state: { isFromApp, pastAppBookings },
      });
      return;
    }

    if (!userDetails) {
      Mixpanel.track("open_batch_checkout_login_with_phone", {
        batchId: props.batchId,
      });
      setAfterLoginRedirect({ afterLoginUrl: window.location.pathname });
      navigate("/login", { replace: true });
      return;
    }

    if (
      comingFrom === EBookNowComingFromPage.BATCH_CHECKOUT_PAGE &&
      batchDetails?.guestsAllowed
    ) {
      Mixpanel.track("open_batch_checkout_booking", { batchId: props.batchId });
      navigate(batchBookingUrl, {
        state: { isFromApp, pastAppBookings },
      });
      return;
    }

    try {
      Mixpanel.track("open_batch_checkout_pay_now", {
        batchId: props.batchId,
        phone: userDetails.phone,
      });

      const batchDetailsResp = await fetch(
        `${BACKEND_URL}/gyms/batch/byBatchId?batchId=${props.batchId}`,
      );
      const response = await batchDetailsResp.json();

      if (response?.batch?.slotsBooked + totalGuests > response.batch.slots) {
        if (response.batch.slotsBooked === response.batch.slots) {
          alert(
            "Sorry, all spots are booked for this slot. Please choose the next available slot.",
          );
        } else {
          alert(
            `Sorry, only ${response.batch.slots - response.batch.slotsBooked} spots are available for this slot. Please choose the next available slot!`,
          );
        }
        window.location.reload();
        return;
      }

      if (
        window.platformInfo?.platform === "ios" ||
        window.platformInfo?.platform === "android"
      ) {
        await displayRazorpay(props, userDetails, setLoading);
      } else {
        await displayRazorpay(props, userDetails, setLoading);
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const showLoginCTA = !userDetails && !props.forceBookNowCta;
  return (
    <>
      <Flex
        flex={1}
        justify="stretch"
        style={{
          // maxHeight: "18vh",
          backgroundColor: "white",
          borderTopStyle: "solid",
          borderTopColor: colors.border,
          borderTopWidth: "1px",
          paddingTop: "12px",
          paddingBottom: "12px",
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
      >
        {showDiscount && <div className="discountLine">{discountText}</div>}
        {errorMessage && (
          <div className="text-sm text-red-600 text-center absolute -top-8 left-0 right-0">
            {errorMessage}
          </div>
        )}
        {showLoginCTA ? (
          <Flex
            flex={1}
            vertical
            style={{
              paddingRight: "24px",
              paddingLeft: "24px",
            }}
          >
            <Flex flex={1} style={{ fontWeight: "bolder", fontSize: "16px" }}>
              Almost There
            </Flex>
            <Flex
              flex={1}
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: colors.secondary,
              }}
            >
              Login quickly to finish the booking
            </Flex>
            <Flex
              onClick={async () => {
                await handleBookNowClick();
              }}
              flex={1}
              justify="center"
              align="center"
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                backgroundColor: "#05070B",
                borderRadius: "10px",
                marginTop: "16px",
                padding: "16px",
              }}
            >
              Proceed with Phone Number
            </Flex>
          </Flex>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingRight: "24px",
              paddingLeft: "24px",
            }}
          >
            <Flex
              flex={2}
              vertical
              justify="center"
              align="left"
              className={discountedAmount ? "discountedAmountWrap" : ""}
            >
              {showDiscount && (
                <span>
                  {Rs}
                  {discountedAmount}
                </span>
              )}
              &nbsp;&nbsp;
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  textDecorationLine: showDiscount ? "line-through" : "",
                  marginBottom: showDiscount ? "3px" : "",
                }}
                className={showDiscount ? "discountedAmount" : ""}
              >
                {Rs}
                {props.totalAmount}
              </span>
            </Flex>
            <button
              id={
                props.comingFrom ===
                EBookNowComingFromPage.BATCH_CHECKOUT_BOOKING_PAGE
                  ? "conversion-book-now"
                  : "book-now"
              }
              className={`
                text-white font-bold text-base
                rounded-lg px-6 py-3
                flex items-center
                ${
                  props.disabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#05070B] cursor-pointer"
                }
              `}
              onClick={handleBookNowClick}
              disabled={props.disabled}
            >
              <span>Book Now</span>
            </button>
          </div>
        )}
      </Flex>
    </>
  );
};

export default BookNowFooter;
