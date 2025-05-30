import { ReactComponent as CancellationSuccessTick } from "../../images/utils/cancellation-success-tick.svg";
import { useEffect, useState } from "react";    
import { navigate } from "@reach/router";
import { IBookings } from "../../types/user";
interface CancellationSuccessProps {
    booking: IBookings;
    isOpen: boolean;
    onClose: () => void;
}

const CancellationSuccess: React.FC<CancellationSuccessProps> = ({ booking, isOpen, onClose }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            if(countdown > 1) {
                setCountdown(countdown - 1);
            } else {
                onClose();
                navigate("/");
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [countdown]);


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
        <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-row justify-center items-center w-1/2 mx-auto">
                <CancellationSuccessTick />
            </div>
            <div className="w-full text-sm font-bold text-black text-center">Your booking has been cancelled successfully</div>
            <div className="flex flex-row justify-center items-center text-xs font-normal text-black">
                    {calculateRefundAmount(booking) > 0 ? `₹${calculateRefundAmount(booking)} will be credited to your source account.` : "Thanks for informing us."}
            </div>
            <div className="flex flex-row justify-between gap-5 mb-6">
                {/* <div className="w-full bg-yellow-300 rounded-lg px-4 py-3" onClick={onClose}>
                    <div className="flex flex-row justify-center text-black text-sm font-bold">Done</div>
                </div> */}
                <div className="w-full px-4 py-3 text-xs font-normal text-black text-center" >
                    Redirecting to Home Page in {countdown} seconds...
                </div>
            </div>
        </div>
    )
}

export default CancellationSuccess; 