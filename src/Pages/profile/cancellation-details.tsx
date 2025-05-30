import { Button } from "antd";
import { IBookings } from "../../types/user";
import { formatTimeIntToAmPm } from "../../utils/date";
import { formatDate } from "../../utils/date";
import { useState } from "react";
import info from "../../images/utils/info.svg";
import { Mixpanel } from "../../mixpanel/init";

const CancellationDetails: React.FC<{booking: IBookings, setShowCancelReasonModal: (show: boolean) => void, setShowCancelModal: (show: boolean) => void, setShowRefundInfoModal: (show: boolean) => void}> = ({booking, setShowCancelReasonModal, setShowCancelModal, setShowRefundInfoModal }) => {
   
    let refundDetailString = "No refund, fam! 😔";

    const userId = window.localStorage["zenfitx-user-details"]
          ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
          : null;

    const calculateRefundAmount = (booking: IBookings) => {
        
        const refundPolicy = JSON.parse(booking?.refundPolicy || "{}");

        if(!refundPolicy) { 
            return 0;
        }

        if(!refundPolicy.refund_applicable) {
            return 0;
        }

        if(refundPolicy.conditions.length === 0) {
            return 0;
        }


        const currentTime = new Date();
        const bookingTime = new Date(booking.date);
        const hours = Math.floor(booking.startTime / 100);
        const minutes = booking.startTime % 100;
        bookingTime.setHours(hours, minutes, 0, 0);
        const timeDifference = bookingTime.getTime() - currentTime.getTime();
        const timeDifferenceInMinutes = timeDifference / (1000 * 60);
        let refundAmount = 0;

        const refundConditions = refundPolicy.conditions;

        refundConditions.sort((a: any, b: any) => b.minutes_before - a.minutes_before);

        for(const condition of refundConditions) {
            if(condition.minutes_before < timeDifferenceInMinutes) {
                refundAmount = Math.round(booking.bookingPrice * (condition.refund_percentage / 100));
                
                if(condition.refund_percentage === 100) {
                    refundDetailString = `💯 Full refund on cancelling at least ${condition.minutes_before / 60} hours before`;
                } else {
                    refundDetailString = `😌 ${condition.refund_percentage}% refund on cancelling at least ${condition.minutes_before / 60} hours before`;
                }
                break;
            }
        }  

        if(refundDetailString === "No refund available") {
            refundDetailString = `No refund, fam! You missed the ${refundConditions[refundConditions.length - 1].minutes_before / 60} hours window 😔`;
        }
        
        return refundAmount;
    }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 bg-white px-6 py-4">
        <div className="text-m font-bold text-gray">Booking Details</div>
        <div className="flex flex-col">
            <ul className="list-disc list-inside">  
                <li className="text-sm px-2">{booking.activityName}</li>
                <li className="text-sm px-2">{formatDate(booking.date)["date suffix"]}, {formatTimeIntToAmPm(booking.startTime)}, {booking.durationMin} mins</li> 
                <li className="text-sm px-2">{booking.name}</li>
            </ul>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="w-full font-bold text-gray bg-gray-100 border-gray-200 h-3"></div>
        <div className="flex flex-row justify-between border-gray-200 rounded-lg p-4">
            <div className="text-m font-bold text-black">Total Price</div>
            <div className="text-m font-bold text-black">₹{booking.bookingPrice}</div>
        </div>
        <div className="flex flex-row justify-between border-gray-200 rounded-lg px-4">
            <div className="text-m font-bold text-black flex flex-row gap-2">
                <div className="flex flex-row gap-2">
                    Refund Amount
                </div>
                <div className="flex items-center cursor-pointer" onClick={() => {setShowRefundInfoModal(true)}}>
                    <img src={info} alt="info" className="w-4 h-4" />
                </div>
            </div>
            <div className="text-m font-bold text-black">₹{calculateRefundAmount(booking)}</div>
        </div>
        {/* <div className="text-m font-bold text-gray">Refund Details</div> */}
        <div className="text-xs font-normal text-gray px-4 pb-2">{refundDetailString}</div>
      </div>
      <div className="flex flex-col mx-4 mb-8 py-3 rounded-lg justify-center items-center bg-black text-m font-bold text-white" onClick={() => 
        {
            Mixpanel.track("cancel_button_clicked", {
                userId: userId,
                bookingId: booking.bookingId
            });
            setShowCancelReasonModal(true); 
            setShowCancelModal(false);
        }}>
        Cancel 
      </div>
    </div>
  );
};

export default CancellationDetails;
