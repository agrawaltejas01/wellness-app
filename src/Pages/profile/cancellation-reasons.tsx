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

export const CancellationReasons = ({ selectedReason, setSelectedReason, setShowCancelReasonModal, setShowCancelConfirmationModal }: {selectedReason: string, setSelectedReason: (reason: string) => void, setShowCancelReasonModal: (show: boolean) => void, setShowCancelConfirmationModal: (show: boolean) => void }) => {
  const reasons = [
    "I have another commitment",
    "I'm not feeling well",
    "Weather conditions are not suitable",
    "Transportation issues",
    "Other"
  ];


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
    <div className={`flex flex-col font-semibold text-m text-gray bg-gray-200 rounded-lg justify-center items-center py-3 mx-4 mb-8 ${selectedReason == ""  ? "opacity-50 pointer-events-none" : ""}`} onClick={() => {setShowCancelConfirmationModal(true); setShowCancelReasonModal(false)}}>
        Continue
    </div>
    </div>
  );
};  