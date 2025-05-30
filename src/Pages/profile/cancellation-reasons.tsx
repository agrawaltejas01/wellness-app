import colors from "../../constants/colours";
import { Button, Checkbox, message } from "antd";
import { Flex } from "antd";
import { BottomUpModal } from "./half-page-modal";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { cancelBooking } from "../../apis/cancel/cancel";
import { navigate } from "@reach/router";
import Circle from "../../components/circle";
import { SkillLevel } from "../../components/skill-capsule";
import { ReactComponent as TickMarkCircle } from "../../images/checkout/tick-mark-circle.svg";
import { errorToast } from "../../components/Toast";
import { ReactComponent as Loading } from "../../images/utils/loading.svg";
import { Mixpanel } from "../../mixpanel/init";

export const CancellationReasons = ({ bookingId, selectedReason, setSelectedReason, setShowCancelReasonModal, setShowSuccessModal, setShowErrorModal }: {bookingId: string, selectedReason: string, setSelectedReason: (reason: string) => void, setShowCancelReasonModal: (show: boolean) => void, setShowSuccessModal: (show: boolean) => void, setShowErrorModal: (show: boolean) => void }) => {
    const reasons = {
        "🌀 Plans changed, life happened": "Change of plans",
        "🚗 Traffic was on demon mode": "Too much traffic",
        "😴 Too lazy to move today": "I am feeling lazy",
        "💊 Not feelin’ it — health’s off": "I am not feeling well",
        "🌧️ Weather’s just not it": "Weather condition is not suitable",
        "📝 Something else": "Other"
    }

    const userId = window.localStorage["zenfitx-user-details"]
          ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
          : null;

  const reasonsArray = Object.keys(reasons);

  const [isLoading, setIsLoading] = useState(false);

  const { mutate: _cancelBooking} = useMutation({
    mutationFn: cancelBooking, 
    onSuccess: (result) => {
        setShowCancelReasonModal(false);
        setShowSuccessModal(true);
        Mixpanel.track("cancel_booking_success", {
            userId: userId,
            bookingId: bookingId
        });
    },
    onError: (error) => {
        setShowCancelReasonModal(false);
        setShowErrorModal(true);
        Mixpanel.track("cancel_booking_error", {
            userId: userId,
            bookingId: bookingId
        });
    },
});


  return (
    <div className="flex flex-col">
        <div className="flex flex-col">
            {reasonsArray.map((_, index) => (
                <div key={index} className="flex flex-col">
                <div key={index} className="flex flex-row justify-between px-4 py-3 rounded-lg"
                     style={{ backgroundColor: reasons[reasonsArray[index] as keyof typeof reasons] === selectedReason ? "white" : "transparent" }}
                     onClick={() => setSelectedReason(reasons[reasonsArray[index] as keyof typeof reasons])}>
                    <div style={{ fontSize: '15px', color: 'black' }} className="flex flex-col">
                        <p className="font-light"> {reasonsArray[index]}</p>
                    </div>
                    {selectedReason === reasons[reasonsArray[index] as keyof typeof reasons] ? (
                        <TickMarkCircle />
                    ) : (
                        <Circle
                        radius={10}
                        borderColor= "#C4CDD2"
                        borderStyle="solid"
                        backgroundColor= "white"
                        character=''
                    />
                    )}
                </div>
                <hr className={`${index === reasonsArray.length - 1 ? "mx-4 border-b-1 border-white pb-2" : "mx-4 border-t-1 border-gray-200"}`} />
                </div>
                ))}
    </div>
    <div className={`flex flex-col font-semibold text-m rounded-lg justify-center items-center py-3 mx-4 mb-8 
                     ${selectedReason == ""  ? "text-gray bg-gray-200 pointer-events-none" : "text-white bg-black"}`} 
                     onClick={() => {
                        setIsLoading(true);
                        Mixpanel.track("cancel_booking_button_clicked", {
                            userId: userId,
                            bookingId: bookingId,
                            reason: selectedReason
                        });
                      _cancelBooking({bookingId, reason: selectedReason});
                      }}>
        {isLoading ? (
          <div className="flex flex-row items-center justify-center">
            <Loading className="animate-spin w-5 h-5 mr-2" /> Cancelling...
          </div>
        ) : "Cancel Booking"}
    </div>
    </div>
  );
};  