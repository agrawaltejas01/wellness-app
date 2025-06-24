import { EOfferType, IBatch, IGymDetails, ParticipantDetail } from "../../types/gyms";

import { useMutation } from "@tanstack/react-query";
import { getActivityById, getPastAppBookings } from "../../apis/gym/activities";
import { errorToast } from "../../components/Toast";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as BackButtonCheckout } from "../../images/utils/back-button-checkout.svg";
import { getGymById } from "../../apis/gym/activities";
import SkillCapsule, { SkillLevel } from "../../components/skill-capsule";
import SpotsLeft from "./spots-left";
import Circle from "../../components/circle";
import SkillLevelInput from "./skill-input";
import { navigate, RouteComponentProps, useLocation } from "@reach/router";
import Loader from "../../components/Loader";
import IncrementDecrementButton from "../../components/increment-decrement-button";
import SpotsLeftCheckout from "./spots-left-checkout";
import BookNowFooter from "./book-now-footer";
import { EBookNowComingFromPage } from "../../types/checkout";
import { ECheckoutType } from "../../types/checkout";
import { getUserSkillLevel } from "../../apis/user/userDetails";
import { userDetailsAtom } from "../../atoms/atom";
import { useAtom } from "jotai";
import { saveNotificationToken } from "../../apis/notifications/notifications";
import { Mixpanel } from "../../mixpanel/init";
import { Rs } from "../../constants/symbols";
import { ACTIVITY_NAME_TO_ID_MAP, COPLAYER_CARD_ENABLED } from "../../constants/activities";
import { formatDate, formatTimeIntToAmPm } from "../../utils/date";
import { capitalizeFirstLetter } from "../../utils/functions/utils";
import { getCoins } from "../../apis/coins/coins";
import { ReactComponent as ToggleButtonOff } from "../../images/utils/toggle-off.svg";
import { ReactComponent as ToggleButtonOn } from "../../images/utils/toggle-on.svg";
import { ReactComponent as Wallet } from "../../images/utils/wallet.svg";
import Checkbox from "antd/es/checkbox/Checkbox";
// Function to convert 24-hour time to 12-hour format
const convert24HourTo12Hour = (timeStr: string): { formattedTime: string; error: string | null } => {
    // Handle empty input
    if (!timeStr || timeStr.trim() === '') {
      return { formattedTime: '', error: 'Please enter a time' };
    }
  
    // Validate input length
    if (timeStr.length < 3 || timeStr.length > 4) {
      return { formattedTime: '', error: `Invalid time format: ${timeStr}` };
    }
  
    let hourStr: string, minuteStr: string;
    
    // Parse hour and minute parts
    if (timeStr.length === 3) {
      hourStr = timeStr.substring(0, 1);
      minuteStr = timeStr.substring(1);
    } else { // length === 4
      hourStr = timeStr.substring(0, 2);
      minuteStr = timeStr.substring(2);
    }
    // comment
    // Convert to numbers
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    // Validate hour and minute
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return { formattedTime: '', error: `Invalid time: ${hour}:${minute}` };
    }
    
    // Convert to 12-hour format
    const period = hour >= 12 ? 'PM' : 'AM';
    // Calculate 12-hour format hour
    let twelveHour = hour % 12;
    if (twelveHour === 0) {
      twelveHour = 12;
    }
    
    // Format the time as a string
    const formattedTime = `${twelveHour}:${minute.toString().padStart(2, '0')} ${period}`;
    return { formattedTime, error: null };
  };

interface IClassCheckout extends RouteComponentProps {
    skillLevel: string;
}

const CheckoutV3: React.FC<IClassCheckout> = ({skillLevel}) => {
    const batchId = window.location.pathname.split("/")[3];
    const [batchDetails, setBatchDetails] = useState<IBatch>();
    const [gymDetails, setGymDetails] = useState<IGymDetails>();
    // const [skillLevel, setSkillLevel] = useState<string>();
    const [spotsLeft, setSpotsLeft] = useState<number>(0);
    const [spotsTotal, setSpotsTotal] = useState<number>(0);
    const [showSkillInput, setShowSkillInput] = useState<boolean>(false);
    const [showSkillLevel, setShowSkillLevel] = useState<boolean>(false);
    const [activityId, setActivityId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [count, setCount] = useState<number>(1);
    const [kidName, setKidName] = useState<string>("");
    const [kidAge, setKidAge] = useState<number>(0); 
    const [kidGender, setKidGender] = useState<string>("");
    const [kidJerseySize, setKidJerseySize] = useState<string>("");
    const [coinsAvailable, setCoinsAvailable] = useState<number>(0);
    const [coinsUsed, setCoinsUsed] = useState<number>(0);


    const [totalAmount, setTotalAmount] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);
    let [baseAmount, setBaseAmount] = useState(0);
    let [noOfGuests, setNoOfGuests] = useState(1);
    const [showDiscount, setShowDiscount] = useState(false);
    const [participantErrors, setParticipantErrors] = useState<{
        [key: string]: string;
    }>({});
    const [gym, setGym] = useState<IGymDetails | null>(null);

    const [userDetails] = useAtom(userDetailsAtom);
    const [pastAppBookings, setPastAppBookings] = useState<PastAppBookingObject>(
        {},
    );
    const [isFromApp, setIsFromApp] = useState(false);
    const [gotPastBookings, setGotPastAppBookings] = useState(false);
    const [selectedRides, setSelectedRides] = useState<number[]>([]);
    const offerStrip = useRef("");


    const { mutate: _getActivityById } = useMutation({
        mutationFn: getActivityById,
        onSuccess: (result) => {
            setBatchDetails(result.batch);
        },
        onError: (error) => {
            errorToast("Error in getting batch details");
        },
    });


    const { mutate: _getCoinsAvailable } = useMutation({
        mutationFn: getCoins,
        onSuccess: (result) => {
            setCoinsAvailable(result.coins);
            if(result.coins > 0) {
              setCoinsUsed(1);
            }
        },
    });

    const { mutate: _getGymById } = useMutation({
        mutationFn: getGymById,
        onSuccess: (result) => {
            setGym(result.gym);
        },
        onError: (error) => {
            errorToast("Error in getting gym details");
        },
    });


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

    // const { mutate: _getUserSkillLevel } = useMutation({
    //     mutationFn: getUserSkillLevel,
    //     onSuccess: (result) => {
    //         setSkillLevel(result.skillLevel);
    //         if(result.skillLevel == 'UNKNOWN') {
    //             setShowSkillInput(true);
    //         } else {
    //             setShowSkillInput(false);
    //             setSkillLevel(result.skillLevel);
    //         }
    //     },
    //     onError: (error) => {
    //         errorToast("Error in getting user skill level");
    //     },
    // });

    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    // const edit = queryParams.get('edit') || 'false';

    // useEffect(() => {
    //     if(edit == 'true') {
    //         setShowSkillInput(true);
    //     } else {
    //         setShowSkillInput(false);
    //     }
    // }, [location.search]);

    useEffect(() => {
        const userSource = window?.platformInfo?.platform || "web";
        const appFlag = userSource !== "web" ? true : false;
        setIsFromApp(appFlag);
        window.isFromApp = appFlag;
        const userId = window.localStorage["zenfitx-user-details"]
          ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
          : null;
        if (userId) {
          _getPastAppBookings(userId);
          const firebaseToken = window.localStorage["token"];
          const tokenPermission = window.localStorage["notificationPermission"];
          if (firebaseToken)
            _saveNotificationToken({ userId, token: firebaseToken });
          if(tokenPermission == "false") {
            Mixpanel.track("notification_permission_denied", {
              userId
            });
          }
        } else {
          setGotPastAppBookings(true);
        }
        _getCoinsAvailable(userId);
    }, []);

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
          if (!isFromApp) {
            setShowDiscount(false);
          } else if (batchDetails.offerPercentage === 0) {
            setShowDiscount(false);
          } else if (!userDetails) {
            setShowDiscount(true);
          } else if (pastAppBookings?.[batchDetails.gymId]) {
            setShowDiscount(false);
          } else {
            setShowDiscount(true);
          }
        }
    }, [batchDetails, pastAppBookings]);


    useEffect(() => {
        _getActivityById(batchId);
    }, [batchId]);


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
            finalPrice = Math.floor(price * noOfGuests - totalDiscount);
            batchDetails.offerType = EOfferType.BATCH_WITH_GUESTS;
          } else if (batchDetails.discountType == "PERCENTAGE") {
            finalPrice =
              price * noOfGuests - maxDiscount >
              price * noOfGuests - (price * noOfGuests * offerPercentage) / 100
                ? price * noOfGuests - maxDiscount
                : price * noOfGuests - (price * noOfGuests * offerPercentage) / 100;
            finalPrice = Math.floor(finalPrice);  
            batchDetails.offerType = EOfferType.APP;
          } else if (batchDetails.discountType == "FLAT") {
            finalPrice =
              price * noOfGuests - (price * noOfGuests * offerPercentage) / 100;
            batchDetails.offerType = EOfferType.APP;
            finalPrice = Math.floor(finalPrice);
          } else {
            finalPrice = Math.floor(finalPrice);
          }
          let newTotalAmount = finalPrice;
          let discount = price * noOfGuests - finalPrice;
    
          setTotalAmount(newTotalAmount);
          setTotalSavings(discount);
        //   if (batchDetails.discountType == "PERCENTAGE") {
        //     batchDetails.offerPercentage = (discount * 100) / (price * noOfGuests);
        //   }
        } else if (!showDiscount) {
          let finalPrice = (batchDetails?.price as number) * noOfGuests;
          let discount = 0;
          setTotalAmount(finalPrice);
          setTotalSavings(discount);
        }
    }, [showDiscount, batchDetails, pastAppBookings, noOfGuests]);

    // useEffect(() => {
    //         const skill = localStorage?.getItem(`skillLevel-${ACTIVITY_NAME_TO_ID_MAP[`${batchDetails?.activity}` as keyof typeof ACTIVITY_NAME_TO_ID_MAP]}`);
    //         if(skill != null && skill != "UNKNOWN") {
    //             setSkillLevel(skill);
    //         } else {
    //             const userId = window.localStorage["zenfitx-user-details"]
    //                             ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
    //                             : null;

    //             if(userId == null) { 
    //                 setShowSkillInput(false);
    //             } else {
    //                 if(userId && batchId) {
    //                     _getUserSkillLevel({userId, batchId: Number(batchId)});
    //                 } else if(showSkillInput){ 
    //                     navigate(`/checkout/batch/${batchId}/booking?edit=true`);
    //                 } else {
    //                     setSkillLevel("UNKNOWN");
    //                     navigate(`/checkout/batch/${batchId}/booking`);
    //                 }
    //             } 
    //         } 
    //         setLoading(false);
    // }, [batchDetails, location.search]);

    useEffect(() => {
        setSpotsLeft(batchDetails?.slots ? batchDetails?.slots - batchDetails?.slotsBooked : 0);
        setSpotsTotal(batchDetails?.slots ? batchDetails?.slots : 0);
    }, [batchDetails]);

    // const manageGuests = (increment: boolean) => {
    //     if(increment && count < spotsLeft) {
    //         setCount(count + 1);
    //     } else if(!increment && count > 1) {
    //         setCount(count - 1);
    //     }
    // }


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
              participantAge: 0,
              participantGender: "",
              jerseySize: "",
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

    const manageGuests = (increment: boolean) => {
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
              finalAmount = Math.floor(finalAmount);
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

    const isCoplayerCardEnabled = COPLAYER_CARD_ENABLED.includes(batchDetails?.activity?.toUpperCase() || "");


    if (!gym || !batchDetails || !gotPastBookings) return <Loader />;

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center pl-4 py-3">
                <BackButtonCheckout onClick={() => navigate(`/checkout/batch/${batchId}`)} />
                <div className="flex flex-col font-jakarta ml-4">
                    <div className="flex flex-row font-jakarta font-bold text-sm">
                        <p className="text-sm font-bold"> { capitalizeFirstLetter(batchDetails?.activity)} | </p>
                        {/* <p className="dot"></p> */}
                        {!gym?.isOnlyWeekend && <p className="text-sm pl-1"> { batchDetails?.date ? formatDate(batchDetails.date)["date suffix"] : "Date not available"} </p>}
                        {!gym?.isOnlyWeekend && <p className="dotBlack"></p>}
                        {batchDetails?.isDayPass ? <p className="text-sm pl-1">All Day</p> : 
                        <>
                            <p className="text-sm pl-1"> {formatTimeIntToAmPm(batchDetails?.startTime || 0)}</p>
                            <p className="dotBlack"></p>
                            <p className="text-sm pl-1"> {batchDetails?.DurationMin} mins</p>
                        </>
                        }
                    </div>
                    <p className="text-xs font-normal text-activity-name-checkout-page pt-1">{batchDetails?.activityName} at {gym?.name}</p>
                </div>
            </div>
            {isCoplayerCardEnabled && <div className="flex flex-row px-4 pt-4">
                 <div className="flex flex-row justify-between w-full bg-white shadow-gray rounded-xl p-4 items-center">
                    <div className="flex flex-col">
                        <p className="text-sm font-bold font-sm">You</p>
                        {/* <p className="text-sm text-gray font-xs">No games yet</p> */}
                    </div>
                    <div className="flex flex-col" onClick={() => { navigate(`/checkout/batch/${batchId}/booking?edit=true`, {replace: true}) }}>
                        {skillLevel != "" && (batchDetails?.slots && (batchDetails?.slots <= 6 || batchDetails?.activity?.toUpperCase() == "PICKLEBALL")) && <SkillCapsule level={skillLevel as SkillLevel} editable={true} />}
                    </div>
                </div>
            </div>}
            {isCoplayerCardEnabled && <div className="flex flex-row px-4 pt-4">
                <div className="flex flex-col justify-between w-full bg-white shadow-gray rounded-xl">
                    <SpotsLeftCheckout spotsLeft={spotsLeft} spotsTotal={spotsTotal} noOfGuests={noOfGuests} />
                    {batchDetails?.guestsAllowed && <div className="flex flex-row justify-between px-4">
                        <div className="flex flex-col pb-4">

                            <p className="text-sm font-sm">Book Spots</p>
                            {/* <p className="text-xs text-gray pt-1 pb-4">{Rs}{batchDetails?.price} per slot</p> */}
                        </div>
                        <div className="flex flex-row justify-between items-center pb-4">
                            <IncrementDecrementButton radius={12} borderColor="#212121" borderStyle="solid" backgroundColor="#FFFFFF" character="-" fontColor="#000000" disabled={noOfGuests === 1} onClick={() => manageGuests(false)}  />
                            <p className="text-sm font-bold font-sm px-4">{noOfGuests}</p>
                            <IncrementDecrementButton radius={12} borderColor="#212121" borderStyle="solid" backgroundColor="#FFFFFF" character="+" fontColor="#000000" disabled={noOfGuests === spotsLeft} onClick={() => manageGuests(true)}  />
                        </div>
                    </div>}
                </div>
            </div>}
            <div className="flex flex-row px-4 pt-4">
                <div className="flex flex-col justify-between w-full bg-white shadow-gray rounded-xl">
                    <div className={`flex flex-row justify-between px-4 pt-4 ${totalSavings > 0 ? "" : "pb-2"}`}>
                        <p className="text-sm font-bold">To pay</p>
                        <p className="text-sm font-bold">{Rs}{gym?.gymId == 41 ? totalAmount + 500 : totalAmount}</p>
                    </div>
                    <div className={`flex flex-row justify-between px-4 ${totalSavings > 0 ? "pt-2 pb-4" : " "}`}>
                        {totalSavings > 0 && <p className="text-xs text-gray font-sm">Total saved {Rs}{totalSavings}</p>}
                    </div>
                    <hr className="border-1 border-separate mx-4 border-gray border-spacing-16" />
                    <div className="flex flex-row justify-between px-4 pt-4 pb-6">
                        {isCoplayerCardEnabled ? <p className="text-sm font-sm"> Spots ({noOfGuests})</p> : <p className="text-sm font-sm">Session Price</p>}
                        <div className="flex flex-row justify-between gap-2">
                            {totalSavings > 0 && <p className="text-sm line-through ml-1 self-end text-gray">{Rs}{totalAmount + totalSavings} </p>}
                            <p className="text-sm font-sm">{Rs}{totalAmount} </p>
                        </div>
                    </div>
                    {gym?.gymId == 41 && <div className="flex flex-row justify-between px-4 pb-6">
                          <p className="text-sm font-sm">One Time Registration Fee</p>
                          <p className="text-sm font-sm">{Rs}500</p>
                        </div>}
                    {coinsAvailable > 0 && <div className="flex flex-row justify-between px-4 pb-2">
                        <div className="flex flex-row items-center gap-2">
                            <Checkbox
                                checked={coinsUsed > 0}
                                onChange={() => setCoinsUsed(coinsUsed > 0 ? 0 : 1)}
                            />
                            <p className="text-sm font-sm">Pay with ZenfitX Coins</p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-sm font-sm">{Rs}{totalAmount <= coinsAvailable ? totalAmount : coinsAvailable}</p>
                        </div>
                    </div>}
                    {coinsAvailable > 0 && <div className="flex flex-row justify-between px-4 pb-6">
                        <div className="flex flex-row items-center">
                            <p className="text-xs font-light">ZenfitX Coins Balance: {coinsAvailable}</p>
                        </div>
                      </div>}
                </div>
            </div>
            {gym?.gymId == 41 && <div className="flex flex-col mt-4 mx-4 px-4 pt-4 rounded-xl bg-white shadow-gray">
                <div className="flex flex-col justify-between w-full">
                    <p className="text-sm font-sm font-bold">Enter Kid's Details</p>
                </div>
                <hr className="border-1 border-separate mt-2 border-gray border-spacing-16" />
                <div className="flex flex-col justify-between w-full mt-4 mb-2">
                    <input 
                        type="text" 
                        className={`w-full border-1 ${!kidName.trim() ? 'border-red-500' : 'border-gray'} rounded-lg p-1`}
                        placeholder="Name" 
                        value={kidName} 
                        onChange={(e) => {
                            setKidName(e.target.value);
                            if (kidJerseySize.trim() && kidGender.trim() && kidAge >= 5 && kidAge <= 18) {
                                const participant = {
                                    participantName: e.target.value,
                                    participantAge: kidAge,
                                    participantGender: kidGender,
                                    jerseySize: kidJerseySize,
                                };
                                setParticipants([participant]);
                            }
                        }}
                    />
                    {!kidName.trim() && <p className="text-xs text-red-500 mt-1 px-1">Please enter kid's name</p>}
                </div>
                <div className="flex flex-col justify-between w-full mb-4">
                    <input 
                        type="number" 
                        className={`w-full border-1 ${(kidAge <= 0 || kidAge > 18) ? 'border-red-500' : 'border-gray'} rounded-lg p-1`}
                        placeholder="Age" 
                        value={kidAge || ""} 
                        onChange={(e) => {
                            const age = Number(e.target.value);
                            setKidAge(age);
                            if (kidJerseySize.trim() && kidGender.trim() && kidName.trim()) {
                                const participant = {
                                    participantName: kidName,
                                    participantAge: age,
                                    participantGender: kidGender,
                                    jerseySize: kidJerseySize,
                                };
                                setParticipants([participant]);
                            }
                        }}
                    />
                    {(kidAge < 5 || kidAge > 18) && <p className="text-xs text-red-500 mt-1 px-1">Age must be between 5 and 18</p>}
                </div>
                <div className="flex flex-col justify-between w-full mb-4">
                    <select
                        className={`w-full border-1 border-gray rounded-lg p-1`}
                        value={kidGender}
                        onChange={(e) => {
                            setKidGender(e.target.value);
                            if (kidJerseySize.trim() && kidName.trim() && kidAge >= 5 && kidAge <= 18) {
                                const participant = {
                                    participantName: kidName,
                                    participantAge: kidAge,
                                    participantGender: e.target.value,
                                    jerseySize: kidJerseySize,
                                };
                                setParticipants([participant]);
                            }
                        }}
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>
                <div className="flex flex-col justify-between w-full mb-4">
                    <select
                        className={`w-full border-1 border-gray rounded-lg p-1`}
                        value={kidJerseySize}
                        onChange={(e) => {
                            setKidJerseySize(e.target.value);
                            if (kidGender.trim() && kidName.trim() && kidAge >= 5 && kidAge <= 18) {
                                const participant = {
                                    participantName: kidName,
                                    participantAge: kidAge,
                                    participantGender: kidGender,
                                    jerseySize: e.target.value, 
                                };
                                setParticipants([participant]);
                            }
                        }}
                    >
                        <option value="" disabled>Select T-Shirt Size</option>
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                        <option value="XL">Extra Large</option>
                    </select>
                </div>
            </div>}
            <div className="flex flex-row px-4 pt-4">
                {offerStrip.current && <p className="text-xs text-center text-white rounded-lg p-2 bg-discountStrip w-full">{offerStrip.current}</p>}
            </div>
            {/* {coinsAvailable > 0 && <div className="flex flex-row px-4 items-center">
              <div className="flex flex-row justify-between w-full bg-white shadow-gray rounded-xl items-center">
                <div className="flex flex-row gap-4 items-center p-4">
                  <div className="flex flex-row gap-2 items-center justify-center" style={{width: "30px", height: "30px"}}>
                      <Wallet />
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <div className="flex flex-col">
                      <p className="text-sm font-sm">Pay with ZenfitX Cash</p>
                      <p className="text-xs text-gray">Balance: {coinsAvailable}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center p-2">
                  {coinsUsed > 0 ? <ToggleButtonOn onClick={() => setCoinsUsed(0)} /> : <ToggleButtonOff onClick={() => setCoinsUsed(1)} />}
                </div>
              </div>
            </div>} */}
            <BookNowFooter
                batchDetails={batchDetails}
                gymData={gym}
                batchId={Number(batchId)}
                checkoutType={ECheckoutType.BATCH}
                totalAmount={gym?.gymId == 41 ? totalAmount + 500 : totalAmount || batchDetails?.price || 0}
                comingFrom={EBookNowComingFromPage.BATCH_CHECKOUT_BOOKING_PAGE}
                totalGuests={noOfGuests}
                totalSavings={totalSavings}
                isFromApp={isFromApp}
                pastAppBookings={pastAppBookings}
                coinsAvailable={coinsAvailable}
                coinsUsed={coinsUsed}
                disabled={
                  (selectedRides.length !== noOfGuests && batchDetails?.isRideActivity) ||
                  (gym?.gymId == 41 && (!kidName.trim() || kidAge <= 0 || kidAge > 18 || !kidGender.trim() || !kidJerseySize.trim()))
                }
            />
        </div>
    )
}   

export default CheckoutV3;