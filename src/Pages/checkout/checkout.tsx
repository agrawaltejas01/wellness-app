import { RouteComponentProps, navigate } from "@reach/router";
import { useEffect, useRef, useState } from "react";
import { Mixpanel } from "../../mixpanel/init";
import { Flex } from "antd";
import { formatDate, formatTimeIntToAmPm } from "../../utils/date";

import {
  EOfferType,
  IBatch,
  IGymDetails,
  ParticipantDetail,
} from "../../types/gyms";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";

import { Rs } from "../../constants/symbols";
import {
  getActivityById,
  getGymById,
  getPastAppBookings,
} from "../../apis/gym/activities";
import Loader from "../../components/Loader";
import "./style.css";
import { useAtom } from "jotai";
import { userDetailsAtom } from "../../atoms/atom";
import BookNowFooter from "./book-now-footer";
import { EBookNowComingFromPage, ECheckoutType } from "../../types/checkout";
import MetaPixel from "../../components/meta-pixel";
import { saveNotificationToken } from "../../apis/notifications/notifications";
import ParticipantDetailsForm from "./pariticipant-detail";
import RideSelector from "./ride-selector";

interface IClassCheckout extends RouteComponentProps {}

interface IClassCheckout {}

interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}

const BatchCheckoutBooking: React.FC<IClassCheckout> = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  let [baseAmount, setBaseAmount] = useState(0);
  let [noOfGuests, setNoOfGuests] = useState(1);
  const [showDiscount, setShowDiscount] = useState(false);

  const [batchDetails, setBatchDetails] = useState<IBatch>();
  const [participantErrors, setParticipantErrors] = useState<{
    [key: string]: string;
  }>({});

  const batchId = window.location.pathname.split("/")[3];

  const [gym, setGym] = useState<IGymDetails | null>(null);
  const offerStrip = useRef("");
  // const location = useLocation();
  // const data = JSON.stringify(location?.state);
  // const isFromApp = JSON.parse(data).isFromApp;
  // const pastAppBookings = JSON.parse(data).pastAppBookings

  const [userDetails] = useAtom(userDetailsAtom);
  const [pastAppBookings, setPastAppBookings] = useState<PastAppBookingObject>(
    {},
  );
  const [isFromApp, setIsFromApp] = useState(false);
  const [gotPastBookings, setGotPastAppBookings] = useState(false);
  const [selectedRides, setSelectedRides] = useState<number[]>([]);
  const slotsRemainingVisible = [6, 22, 24, 25, 27, 28, 31, 32];

  const { mutate: _getPastAppBookings } = useMutation({
    mutationFn: getPastAppBookings,
    onError: () => {
      errorToast("Error in getting past app bookings");
    },
    onSuccess: (result) => {
      console.log("past app bookings - ", result);
      setPastAppBookings(result.bookings);
      setGotPastAppBookings(true);
      window.pastAppBookings = result.bookings;
    },
  });

  const { mutate: _saveNotificationToken } = useMutation({
    mutationFn: saveNotificationToken,
    onError: () => {},
    onSuccess: (result) => {
      console.log("notification token stored successfully!");
    },
  });

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
      const firebaseToken = window.localStorage["token"];
      if (firebaseToken)
        _saveNotificationToken({ userId, token: firebaseToken });
    } else {
      setGotPastAppBookings(true);
    }
  }, []);

  const { mutate: _getActivityById } = useMutation({
    mutationFn: getActivityById,
    onSuccess: (result) => {
      console.log(result.batch);
      setBatchDetails(result.batch);
    },
    onError: (error) => {
      errorToast("Error in getting gym data");
    },
  });

  const { mutate: _getGymById } = useMutation({
    mutationFn: getGymById,
    onSuccess: (result) => {
      setGym(result.gym);
      //   MixpanelGymInit(result.gym);
    },
    onError: (error) => {
      errorToast("Error in getting gym data");
    },
  });

  const validateBooking = (): boolean => {
    if (batchDetails?.isRideActivity && selectedRides.length < noOfGuests) {
      errorToast(
        `Please select ${noOfGuests} ${noOfGuests === 1 ? "ride" : "rides"}`,
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (batchDetails) {
      if (!userDetails) {
        setShowDiscount(true);
      } else if (!isFromApp) {
        setShowDiscount(false);
      } else if (pastAppBookings?.[batchDetails.gymId]) {
        setShowDiscount(false);
      } else {
        setShowDiscount(true);
      }
    }
  }, [batchDetails, pastAppBookings]);

  useEffect(() => {
    _getActivityById(batchId);
  }, []);

  useEffect(() => {
    if (batchDetails?.gymId) {
      setBaseAmount(batchDetails.price);
      setTotalAmount(batchDetails.price);
      _getGymById(String(batchDetails.gymId));

      Mixpanel.track("open_checkout_page", {
        batchId,
        gym,
      });

      // offerStrip.current = "50% off on your 1st booking on ZenfitX";
      if (
        batchDetails.offerType == EOfferType.BATCH_WITH_GUESTS &&
        batchDetails.offerPercentage
      )
        offerStrip.current = `${batchDetails.offerPercentage}% off on booking for ${batchDetails.minGuestsForOffer} people (full court)`;
      else if (showDiscount) {
        if (batchDetails.discountType == "PERCENTAGE") {
          offerStrip.current = `${batchDetails.offerPercentage}% discount upto ${Rs}${batchDetails.maxDiscount} on 1st booking at this center`;
        } else if (batchDetails.discountType == "FLAT") {
          offerStrip.current = `FLAT ${batchDetails.offerPercentage}% off on 1st booking at this center`;
        }
      } else {
        offerStrip.current = "";
      }
      // else if ((!userDetails || (userDetails && userDetails.noOfBookings < 1)) && ![6, 21].includes(batchDetails.gymId)) {
      //   offerStrip.current = "50% off on your 1st booking on ZenfitX";
      // }
    }
  }, [batchDetails, showDiscount]);

  useEffect(() => {
    if (
      batchDetails != undefined &&
      // (!userDetails || (userDetails && userDetails.noOfBookings < 1)) &&
      // ![6, 21].includes(batchDetails.gymId) &&
      // batchDetails?.offerType !== EOfferType.BATCH_WITH_GUESTS
      (showDiscount ||
        (batchDetails?.offerType == EOfferType.BATCH_WITH_GUESTS &&
          batchDetails?.offerPercentage))
    ) {
      // const [newTotalAmount, discount] = deductPercentage(
      //   batchDetails?.price || 0,
      //   50
      // );
      let price = batchDetails?.price;
      let maxDiscount = batchDetails?.maxDiscount;
      let offerPercentage = batchDetails?.offerPercentage;
      let finalPrice = price * noOfGuests;
      if (
        batchDetails.offerType == EOfferType.BATCH_WITH_GUESTS &&
        (batchDetails.minGuestsForOffer || 100) <= noOfGuests
      ) {
        let totalDiscount = (price * noOfGuests * offerPercentage) / 100;
        finalPrice = Math.ceil(price * noOfGuests - totalDiscount);
        batchDetails.offerType = EOfferType.BATCH_WITH_GUESTS;
      } else if (batchDetails.discountType == "PERCENTAGE") {
        finalPrice =
          price * noOfGuests - maxDiscount >
          price * noOfGuests - (price * noOfGuests * offerPercentage) / 100
            ? price * noOfGuests - maxDiscount
            : price * noOfGuests - (price * noOfGuests * offerPercentage) / 100;
        finalPrice = Math.ceil(finalPrice);
        batchDetails.offerType = EOfferType.APP;
      } else if (batchDetails.discountType == "FLAT") {
        finalPrice =
          price * noOfGuests - (price * noOfGuests * offerPercentage) / 100;
        batchDetails.offerType = EOfferType.APP;
        finalPrice = Math.ceil(finalPrice);
      } else {
        finalPrice = Math.ceil(finalPrice);
      }
      let newTotalAmount = finalPrice;
      let discount = price * noOfGuests - finalPrice;

      setTotalAmount(newTotalAmount);
      setTotalSavings(discount);
      if (batchDetails.discountType == "PERCENTAGE") {
        batchDetails.offerPercentage = (discount * 100) / (price * noOfGuests);
      }
    } else if (!showDiscount) {
      let finalPrice = (batchDetails?.price as number) * noOfGuests;
      let discount = 0;
      setTotalAmount(finalPrice);
      setTotalSavings(discount);
    }
  }, [showDiscount, batchDetails, pastAppBookings, noOfGuests]);

  if (!gym || !batchDetails || !gotPastBookings) return <Loader />;
  const setParticipants = (participants: ParticipantDetail[]) => {
    if (batchDetails) {
      setBatchDetails({
        ...batchDetails,
        participants,
      });
    }
  };

  const updateParticipantsWithRides = (rides: number[]) => {
    if (batchDetails) {
      const updatedParticipants: ParticipantDetail[] = rides.map(
        (rideNumber) => ({
          participantName: "", // Empty string for participant name
          rideNumber: rideNumber, // Just the ride number
        }),
      );

      setBatchDetails({
        ...batchDetails,
        participants: updatedParticipants,
      });

      setSelectedRides(rides);
    }
  };

  const validateParticipants = (): boolean => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    batchDetails?.participants?.forEach((participant, index) => {
      if (!participant.participantName.trim()) {
        errors[`participant_${index}_name`] = "Participant name is required";
        isValid = false;
      }
      // if (!participant.jerseySize) {
      //   errors[`participant_${index}_size`] = 'Jersey size is required';
      //   isValid = false;
      // }
    });

    setParticipantErrors(errors);
    return isValid;
  };

  //   A function that adds totalAmount

  function manageGuests(increment: boolean) {
    if (noOfGuests === 1 && !increment) {
      return;
    }
    if (
      noOfGuests + (batchDetails?.slotsBooked || 0) >=
        (batchDetails?.slots || 0) &&
      increment
    ) {
      return;
    }
    let noOfGuestIncremented = increment ? noOfGuests + 1 : noOfGuests - 1;
    noOfGuests = noOfGuests || 1;
    let baseAmountAfterIncrement =
      (batchDetails?.price as number) * noOfGuestIncremented;

    // Reset selected rides when guest count changes
    setSelectedRides([]);
    if (batchDetails) {
      setBatchDetails({
        ...batchDetails,
        participants: [],
      });
    }

    setNoOfGuests(noOfGuestIncremented);
    setBaseAmount(baseAmountAfterIncrement);

    let finalAmount = baseAmountAfterIncrement;
    let discount = 0;
    let offerPercentage = batchDetails?.offerPercentage || 0;
    let maxDiscount = batchDetails?.maxDiscount || 0;
    if (showDiscount) {
      finalAmount =
        baseAmountAfterIncrement - maxDiscount >
        baseAmountAfterIncrement -
          (baseAmountAfterIncrement * offerPercentage) / 100
          ? baseAmountAfterIncrement - maxDiscount
          : baseAmountAfterIncrement -
            (baseAmountAfterIncrement * offerPercentage) / 100;
      if (batchDetails?.discountType == "FLAT") {
        finalAmount =
          baseAmountAfterIncrement -
          (baseAmountAfterIncrement * offerPercentage) / 100;
      }
      discount = baseAmountAfterIncrement - finalAmount;
    }

    setTotalAmount(finalAmount);
    setTotalSavings(discount);

    Mixpanel.track(`clicked_change_guest_on_checkout_page`, {
      add: increment,
      remove: increment,
      finalAmount,
      discount,
      baseAmount,
    });
  }

  const handleSwipeRight = async () => {
    navigate(`/checkout/batch/${batchId}`);
  };

  const backBtn = () => (
    <svg
      onClick={() => navigate(`/checkout/batch/${batchId}`)}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M15.8327 9.99935H4.16602M4.16602 9.99935L9.99935 15.8327M4.16602 9.99935L9.99935 4.16602"
        stroke="#212121"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  const guestIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M12.6673 14V10M10.6673 12H14.6673M8.00065 10H5.33398C4.09147 10 3.47022 10 2.98016 10.203C2.32675 10.4736 1.80762 10.9928 1.53697 11.6462C1.33398 12.1362 1.33398 12.7575 1.33398 14M10.334 2.19384C11.3113 2.58943 12.0007 3.54754 12.0007 4.66667C12.0007 5.78579 11.3113 6.7439 10.334 7.13949M9.00065 4.66667C9.00065 6.13943 7.80674 7.33333 6.33398 7.33333C4.86123 7.33333 3.66732 6.13943 3.66732 4.66667C3.66732 3.19391 4.86123 2 6.33398 2C7.80674 2 9.00065 3.19391 9.00065 4.66667Z"
        stroke="#05070B"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  const incIcon = () => (
    <svg
      className={
        noOfGuests + (batchDetails?.slotsBooked || 0) >=
        (batchDetails?.slots || 0)
          ? "disabled"
          : ""
      }
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M8.00065 3.33398V12.6673M3.33398 8.00065H12.6673"
        stroke="#06080C"
        stroke-width="0.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  const dscIcon = () => (
    <svg
      className={noOfGuests <= 1 ? "disabled" : ""}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3.33398 8H12.6673"
        stroke="#05070B"
        stroke-width="0.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  const discountIconGreen = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_1132_11447)">
          <path
            d="M6.13476 13.7346C6.35326 13.7057 6.57399 13.7649 6.74804 13.899L7.5502 14.5145C7.81536 14.7182 8.18422 14.7182 8.44864 14.5145L9.28117 13.8753C9.43671 13.756 9.63299 13.7035 9.82705 13.7294L10.8684 13.8664C11.1995 13.9101 11.5188 13.7257 11.6469 13.4168L12.0476 12.4479C12.1224 12.2665 12.2661 12.1228 12.4476 12.0479L13.4164 11.6472C13.7252 11.5198 13.9097 11.1998 13.866 10.8687L13.7341 9.86504C13.7052 9.64653 13.7645 9.4258 13.8986 9.25173L14.5141 8.44953C14.7178 8.18435 14.7178 7.81547 14.5141 7.55103L13.8749 6.71846C13.7556 6.56291 13.703 6.36662 13.7289 6.17255L13.866 5.1311C13.9097 4.8 13.7252 4.48075 13.4164 4.3526L12.4476 3.95187C12.2661 3.87706 12.1224 3.73336 12.0476 3.55189L11.6469 2.58302C11.5195 2.27414 11.1995 2.0897 10.8684 2.13341L9.82705 2.27044C9.63299 2.29711 9.43671 2.24451 9.28191 2.126L8.44938 1.48676C8.18422 1.28306 7.81536 1.28306 7.55094 1.48676L6.71842 2.126C6.56288 2.24451 6.3666 2.29711 6.17254 2.27192L5.13114 2.13489C4.80006 2.09119 4.48083 2.27563 4.35269 2.58451L3.95272 3.55337C3.87717 3.7341 3.73348 3.8778 3.55276 3.95336L2.58395 4.35335C2.27508 4.48149 2.09066 4.80074 2.13436 5.13184L2.27138 6.17329C2.29656 6.36736 2.24398 6.56365 2.12547 6.71846L1.48626 7.55103C1.28257 7.81621 1.28257 8.18509 1.48626 8.44953L2.12547 9.2821C2.24472 9.43765 2.2973 9.63394 2.27138 9.82801L2.13436 10.8695C2.09066 11.2006 2.27508 11.5198 2.58395 11.648L3.55276 12.0487C3.73422 12.1235 3.87791 12.2672 3.95272 12.4487L4.35343 13.4175C4.48083 13.7264 4.8008 13.9109 5.13188 13.8672L6.13476 13.7346Z"
            fill="#0B9C5D"
          />
          <path
            d="M6.3335 6.00065C6.3335 6.18475 6.18426 6.33398 6.00016 6.33398C5.81607 6.33398 5.66683 6.18475 5.66683 6.00065C5.66683 5.81656 5.81607 5.66732 6.00016 5.66732C6.18426 5.66732 6.3335 5.81656 6.3335 6.00065Z"
            fill="#0B9C5D"
          />
          <path
            d="M10.3335 10.0007C10.3335 10.1847 10.1843 10.334 10.0002 10.334C9.81607 10.334 9.66683 10.1847 9.66683 10.0007C9.66683 9.81656 9.81607 9.66732 10.0002 9.66732C10.1843 9.66732 10.3335 9.81656 10.3335 10.0007Z"
            fill="#0B9C5D"
          />
          <path
            d="M6.00016 6.00065H6.00683M10.0002 10.0007H10.0068M10.6668 5.33398L5.3335 10.6673M6.13476 13.7346C6.35326 13.7057 6.57399 13.7649 6.74805 13.899L7.5502 14.5145C7.81536 14.7182 8.18422 14.7182 8.44864 14.5145L9.28117 13.8753C9.43671 13.756 9.63299 13.7035 9.82705 13.7294L10.8684 13.8664C11.1995 13.9101 11.5188 13.7257 11.6469 13.4168L12.0476 12.4479C12.1224 12.2665 12.2661 12.1228 12.4476 12.0479L13.4164 11.6472C13.7252 11.5198 13.9097 11.1998 13.866 10.8687L13.7341 9.86504C13.7052 9.64653 13.7645 9.4258 13.8986 9.25173L14.5141 8.44953C14.7178 8.18435 14.7178 7.81547 14.5141 7.55103L13.8749 6.71846C13.7556 6.56291 13.703 6.36662 13.7289 6.17255L13.866 5.1311C13.9097 4.8 13.7252 4.48075 13.4164 4.3526L12.4476 3.95187C12.2661 3.87706 12.1224 3.73336 12.0476 3.55189L11.6469 2.58302C11.5195 2.27414 11.1995 2.0897 10.8684 2.13341L9.82705 2.27044C9.63299 2.29711 9.43671 2.24451 9.28191 2.126L8.44938 1.48676C8.18422 1.28306 7.81536 1.28306 7.55094 1.48676L6.71842 2.126C6.56288 2.24451 6.3666 2.29711 6.17254 2.27192L5.13114 2.13489C4.80006 2.09119 4.48083 2.27563 4.35269 2.58451L3.95272 3.55337C3.87717 3.7341 3.73348 3.8778 3.55276 3.95336L2.58395 4.35335C2.27508 4.48149 2.09066 4.80074 2.13436 5.13184L2.27138 6.17329C2.29656 6.36736 2.24398 6.56365 2.12547 6.71846L1.48626 7.55103C1.28257 7.81621 1.28257 8.18509 1.48626 8.44953L2.12547 9.2821C2.24472 9.43765 2.2973 9.63394 2.27138 9.82801L2.13436 10.8695C2.09066 11.2006 2.27508 11.5198 2.58395 11.648L3.55276 12.0487C3.73422 12.1235 3.87791 12.2672 3.95272 12.4487L4.35343 13.4175C4.48083 13.7264 4.8008 13.9109 5.13188 13.8672L6.13476 13.7346ZM6.3335 6.00065C6.3335 6.18475 6.18426 6.33398 6.00016 6.33398C5.81607 6.33398 5.66683 6.18475 5.66683 6.00065C5.66683 5.81656 5.81607 5.66732 6.00016 5.66732C6.18426 5.66732 6.3335 5.81656 6.3335 6.00065ZM10.3335 10.0007C10.3335 10.1847 10.1843 10.334 10.0002 10.334C9.81607 10.334 9.66683 10.1847 9.66683 10.0007C9.66683 9.81656 9.81607 9.66732 10.0002 9.66732C10.1843 9.66732 10.3335 9.81656 10.3335 10.0007Z"
            stroke="#EDF8F4"
            stroke-width="0.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1132_11447">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const discountIconGray = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M9.2019 20.6009C9.52965 20.5575 9.86073 20.6464 10.1218 20.8475L11.3251 21.7708C11.7228 22.0764 12.2761 22.0764 12.6727 21.7708L13.9215 20.812C14.1548 20.6331 14.4492 20.5542 14.7403 20.5931L16.3024 20.7986C16.799 20.8642 17.2779 20.5875 17.4701 20.1242L18.0712 18.6709C18.1834 18.3987 18.3989 18.1832 18.6711 18.0709L20.1243 17.4699C20.5876 17.2787 20.8643 16.7988 20.7987 16.3021L20.601 14.7966C20.5576 14.4688 20.6465 14.1377 20.8476 13.8766L21.7709 12.6733C22.0764 12.2755 22.0764 11.7222 21.7709 11.3256L20.812 10.0767C20.6332 9.84339 20.5543 9.54896 20.5932 9.25785L20.7987 7.69568C20.8643 7.19902 20.5876 6.72015 20.1243 6.52793L18.6711 5.92684C18.3989 5.81462 18.1834 5.59907 18.0712 5.32685L17.4701 3.87356C17.279 3.41024 16.799 3.13358 16.3024 3.19913L14.7403 3.40468C14.4492 3.44468 14.1548 3.3658 13.9226 3.18802L12.6738 2.22916C12.2761 1.92361 11.7228 1.92361 11.3262 2.22916L10.0774 3.18802C9.84407 3.3658 9.54965 3.44468 9.25856 3.40691L7.69647 3.20136C7.19984 3.1358 6.721 3.41246 6.52879 3.87578L5.92884 5.32907C5.81552 5.60018 5.59998 5.81573 5.32889 5.92906L3.87568 6.52904C3.41238 6.72126 3.13574 7.20013 3.20129 7.69679L3.40683 9.25897C3.4446 9.55007 3.36572 9.84451 3.18796 10.0767L2.22915 11.3256C1.92362 11.7233 1.92362 12.2767 2.22915 12.6733L3.18796 13.9222C3.36683 14.1555 3.44571 14.4499 3.40683 14.741L3.20129 16.3032C3.13574 16.7999 3.41238 17.2787 3.87568 17.471L5.32889 18.0721C5.60109 18.1843 5.81663 18.3998 5.92884 18.672L6.5299 20.1253C6.721 20.5887 7.20096 20.8653 7.69758 20.7998L9.2019 20.6009Z"
        fill="#7E7E7E"
      />
      <path
        d="M9.5 9C9.5 9.27614 9.27614 9.5 9 9.5C8.72386 9.5 8.5 9.27614 8.5 9C8.5 8.72386 8.72386 8.5 9 8.5C9.27614 8.5 9.5 8.72386 9.5 9Z"
        fill="#7E7E7E"
      />
      <path
        d="M15.5 15C15.5 15.2761 15.2761 15.5 15 15.5C14.7239 15.5 14.5 15.2761 14.5 15C14.5 14.7239 14.7239 14.5 15 14.5C15.2761 14.5 15.5 14.7239 15.5 15Z"
        fill="#7E7E7E"
      />
      <path
        d="M9 9H9.01M15 15H15.01M16 8L8 16M9.2019 20.6009C9.52965 20.5575 9.86073 20.6464 10.1218 20.8475L11.3251 21.7708C11.7228 22.0764 12.2761 22.0764 12.6727 21.7708L13.9215 20.812C14.1548 20.6331 14.4492 20.5542 14.7403 20.5931L16.3024 20.7986C16.799 20.8642 17.2779 20.5875 17.4701 20.1242L18.0712 18.6709C18.1834 18.3987 18.3989 18.1832 18.6711 18.0709L20.1243 17.4699C20.5876 17.2787 20.8643 16.7988 20.7987 16.3021L20.601 14.7966C20.5576 14.4688 20.6465 14.1377 20.8476 13.8766L21.7709 12.6733C22.0764 12.2755 22.0764 11.7222 21.7709 11.3256L20.812 10.0767C20.6332 9.84339 20.5543 9.54896 20.5932 9.25785L20.7987 7.69568C20.8643 7.19902 20.5876 6.72015 20.1243 6.52793L18.6711 5.92684C18.3989 5.81462 18.1834 5.59907 18.0712 5.32685L17.4701 3.87356C17.279 3.41024 16.799 3.13358 16.3024 3.19913L14.7403 3.40468C14.4492 3.44468 14.1548 3.3658 13.9226 3.18802L12.6738 2.22916C12.2761 1.92361 11.7228 1.92361 11.3262 2.22916L10.0774 3.18802C9.84407 3.3658 9.54965 3.44468 9.25856 3.40691L7.69647 3.20136C7.19984 3.1358 6.721 3.41246 6.52879 3.87578L5.92884 5.32907C5.81552 5.60018 5.59998 5.81573 5.32889 5.92906L3.87568 6.52904C3.41238 6.72126 3.13574 7.20013 3.20129 7.69679L3.40683 9.25897C3.4446 9.55007 3.36572 9.84451 3.18796 10.0767L2.22915 11.3256C1.92362 11.7233 1.92362 12.2767 2.22915 12.6733L3.18796 13.9222C3.36683 14.1555 3.44571 14.4499 3.40683 14.741L3.20129 16.3032C3.13574 16.7999 3.41238 17.2787 3.87568 17.471L5.32889 18.0721C5.60109 18.1843 5.81663 18.3998 5.92884 18.672L6.5299 20.1253C6.721 20.5887 7.20096 20.8653 7.69758 20.7998L9.2019 20.6009Z"
        stroke="#EDF8F4"
        stroke-width="0.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  // if(!gotPastBookings) return <Loader />

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        paddingBottom: "80px", // Prevent content from being hidden behind footer
      }}
    >
      <MetaPixel />
      {/* <SwipeHandler onSwipeRight={handleSwipeRight}> */}
      {/* <PullToRefresh onRefresh={handleRefresh}> */}
      <Flex
        flex={1}
        vertical
        style={{
          backgroundColor: "#F8F8F8",
          minHeight: "100vh",
        }}
      >
        <div className="checkWrapper">
          <div className="backBtn2">{backBtn()}</div>
          <div className="checkoutDetail">
            <span className="flex-shrink-0">
              <img
                src={batchDetails?.image}
                className="w-[90px] h-[90px] rounded-xl object-cover"
                alt={batchDetails?.activityName}
              />
            </span>
            <span className="actDetail">
              <div className="actName">
                {batchDetails?.activityName}
                {batchDetails?.trainer ? ` with ${batchDetails.trainer}` : null}
              </div>
              <div className="actGym"> {gym.name}</div>
              <div className="actLoc">{gym.area}</div>
              <div className="actTime">
                {" "}
                {batchDetails?.date &&
                  formatDate(batchDetails?.date)["date suffix"]}{" "}
                &bull;{" "}
                {batchDetails?.isDayPass ? (
                  <>All Day</>
                ) : (
                  <>
                    {batchDetails?.startTime && (
                      <>
                        {formatTimeIntToAmPm(batchDetails?.startTime)} &bull;{" "}
                        {batchDetails?.DurationMin} min
                      </>
                    )}
                  </>
                )}
              </div>
              {slotsRemainingVisible.includes(gym.gymId) &&
              batchDetails?.slots &&
              batchDetails.slotsBooked >= 0 &&
              batchDetails.slots != 1 ? (
                <div className="actTime">
                  <span style={{ color: "#C15700" }}>
                    {batchDetails.slots - batchDetails.slotsBooked} spot(s) left
                    out of {batchDetails.slots}
                  </span>
                </div>
              ) : null}
            </span>
          </div>
          <div className="actLine"></div>

          {/* Guest count section */}
          {batchDetails?.guestsAllowed && (
           <div className="flex items-center justify-between py-3">
           <span className="flex items-center gap-2">
             {guestIcon()} 
             <span className="text-sm text-gray-700">
               Guest{noOfGuests > 1 && "s"}
             </span>
           </span>
           
           <div className="flex">
             <button
               onClick={() => manageGuests(false)}
               className={`h-9 px-4 flex items-center justify-center transition-all
                 border-y border-l border-gray-300 rounded-l-lg
                 ${noOfGuests <= 1 
                   ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                   : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                 }`}
               disabled={noOfGuests <= 1}
             >
               −
             </button>
             
             <div className="h-9 min-w-[36px] flex items-center justify-center border-y border-gray-300 bg-white">
               <span className="text-base font-medium text-gray-900">
                 {noOfGuests}
               </span>
             </div>
             
             <button
               onClick={() => manageGuests(true)}
               className={`h-9 px-4 flex items-center justify-center transition-all
                 border-y border-r border-gray-300 rounded-r-lg
                 ${noOfGuests >= batchDetails.slots - batchDetails.slotsBooked
                   ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                   : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                 }`}
               disabled={noOfGuests >= batchDetails.slots - batchDetails.slotsBooked}
             >
               +
             </button>
           </div>
         </div>
          )}
          {batchDetails?.guestsAllowed && <div className="actLine"></div>}

          {/* Ride selector */}
          {batchDetails?.isRideActivity && (
            <>
              <RideSelector
                totalRides={batchDetails.rideDetails?.totalRides || 0}
                availableRides={batchDetails.rideDetails?.availableRides || []}
                selectedRides={selectedRides}
                onRideSelect={updateParticipantsWithRides}
                noOfGuests={noOfGuests}
              />
              <div className="actLine"></div>
            </>
          )}

          {!batchDetails?.guestsAllowed && (
            <div className="priceArea">
              <div className="priceHead">Total</div>
              <div className="flexy">
                <span className="checkDsc">Session price</span>
                <span className="checkAmt">₹{totalAmount}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flexy">
                  <span className="saveDsc">Saving ₹{totalSavings}</span>
                  <span className="saveAmt">₹{batchDetails?.price}</span>
                </div>
              )}
            </div>
          )}
          {batchDetails?.guestsAllowed && (
            <div className="guestArea">
              <div className="priceHead">Total</div>
              <span className="flexy">
                <span className="checkDsc">
                  {noOfGuests} {noOfGuests > 1 ? "guests" : "guest"}
                </span>
                <span className="checkAmt">₹{totalAmount}</span>
              </span>
              {totalSavings ? (
                <span className="flexy">
                  <span className="saveDsc">Saving ₹{totalSavings}</span>
                  <span className="saveAmt">₹{baseAmount}</span>
                </span>
              ) : null}
            </div>
          )}

          {/* Offer strip */}
          {offerStrip.current && (
            <div
              className={totalSavings ? "offer offerGreen" : "offer offerGray"}
            >
              {totalSavings ? discountIconGreen() : discountIconGray()}
              {offerStrip.current ? offerStrip.current : null}
            </div>
          )}
        </div>
      </Flex>
      <Flex>
        {batchDetails.noOfParticipants != undefined &&
          batchDetails.noOfParticipants > 0 && (
            <>
              <div style={{ margin: "0 -16px" }}>
                <ParticipantDetailsForm
                  noOfGuests={batchDetails?.noOfParticipants}
                  participants={batchDetails?.participants ?? []}
                  setParticipants={setParticipants}
                  participantErrors={participantErrors}
                />
              </div>
              <div className="actLine"></div>
            </>
          )}

        <BookNowFooter
          batchDetails={batchDetails}
          gymData={gym}
          batchId={Number(batchId)}
          checkoutType={ECheckoutType.BATCH}
          totalAmount={totalAmount || batchDetails?.price || 0}
          comingFrom={EBookNowComingFromPage.BATCH_CHECKOUT_BOOKING_PAGE}
          totalGuests={noOfGuests}
          totalSavings={totalSavings}
          isFromApp={isFromApp}
          pastAppBookings={pastAppBookings}
          disabled={
            selectedRides.length !== noOfGuests && batchDetails?.isRideActivity
          }
        />
      </Flex>
    </div>
  );
};

export default BatchCheckoutBooking;
