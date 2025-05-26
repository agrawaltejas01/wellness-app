import { Button } from "antd";
import { IBookings } from "../../types/user";
import { formatTimeIntToAmPm } from "../../utils/date";
import { formatDate } from "../../utils/date";
import { useState } from "react";


const CancellationDetails: React.FC<{booking: IBookings, setShowCancelReasonModal: (show: boolean) => void, setShowCancelModal: (show: boolean) => void}> = ({booking, setShowCancelReasonModal, setShowCancelModal }) => {
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
                refundAmount = booking.bookingPrice * (condition.refund_percentage / 100);
                break;
            }
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
            <div className="text-m font-bold text-gray">Total Price</div>
            <div className="text-m font-bold text-black">₹{booking.bookingPrice}</div>
        </div>
        <div className="flex flex-row justify-between border-gray-200 rounded-lg p-4">
            <div className="text-m font-bold text-gray">Refund Amount</div>
            <div className="text-m font-bold text-black">₹{calculateRefundAmount(booking)}</div>
        </div>
      </div>
      <div className="flex flex-col mx-4 mb-8 py-3 rounded-lg justify-center items-center bg-gray-100 text-m font-bold text-red-700" onClick={() => {setShowCancelReasonModal(true); setShowCancelModal(false)}}>
        Cancel 
      </div>
    </div>
  );
};

export default CancellationDetails;
