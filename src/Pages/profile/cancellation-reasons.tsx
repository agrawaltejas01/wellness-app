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

export const CancellationReasons = ({ bookingId, selectedReason, setSelectedReason, setShowCancelReasonModal, setShowSuccessModal, setShowErrorModal }: {bookingId: string, selectedReason: string, setSelectedReason: (reason: string) => void, setShowCancelReasonModal: (show: boolean) => void, setShowSuccessModal: (show: boolean) => void, setShowErrorModal: (show: boolean) => void }) => {
    const reasons = [
    "Change of plans",
    "Too much traffic",
    "I am feeling lazy",
    "I am not feeling well",
    "Weather condition is not suitable",
    "Other"
  ];


  const { mutate: _cancelBooking} = useMutation({
    mutationFn: cancelBooking, 
    onSuccess: (result) => {
        message.success("Booking cancelled successfully");
        // setShowCancelReasonModal(false);
        setShowSuccessModal(true);
    },
    onError: (error) => {
        errorToast("Error in cancelling booking");
        // setShowCancelReasonModal(false);
        setShowErrorModal(true);
    },
});


  return (
    <div className="flex flex-col">
        <div className="flex flex-col">
            {reasons.map((_, index) => (
                <div key={index} className="flex flex-col">
                <div key={index} className="flex flex-row justify-between px-4 py-3 rounded-lg"
                     style={{ backgroundColor: reasons[index] === selectedReason ? "white" : "transparent" }}
                     onClick={() => setSelectedReason(reasons[index])}>
                    <div style={{ fontSize: '15px', color: 'black' }} className="flex flex-col">
                        <p className="font-light"> {reasons[index]}</p>
                    </div>
                    {selectedReason === reasons[index] ? (
                        <TickMarkCircle />
                    ) : (
                        <Circle
                        radius={10}
                        borderColor= "black"
                        borderStyle="solid"
                        backgroundColor= "white"
                        character=''
                    />
                    )}
                </div>
                <hr className={`${index === reasons.length - 1 ? "mx-4 border-b-1 border-white pb-2" : "mx-4 border-t-1 border-gray-200"}`} />
                </div>
                ))}
    </div>
    <div className={`flex flex-col font-semibold text-m rounded-lg justify-center items-center py-3 mx-4 mb-8 ${selectedReason == ""  ? "text-gray bg-gray-200 pointer-events-none" : "text-white bg-black"}`} onClick={() => {_cancelBooking({bookingId, reason: selectedReason}); setShowCancelReasonModal(false);}}>
        Cancel Booking
    </div>
    </div>
  );
};  