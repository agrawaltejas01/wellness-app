import { useMutation } from "@tanstack/react-query";
import { cancelBooking } from "../../apis/cancel/cancel";
import { Button, message } from "antd";
import { errorToast } from "../../components/Toast";

interface CancelConfirmationProps {
  bookingId: string;
  reason: string;
  setShowCancelConfirmationModal: (show: boolean) => void;
  setShowCancelReasonModal: (show: boolean) => void;
  setShowSuccessModal: (show: boolean) => void;
  setShowErrorModal: (show: boolean) => void;
}



const CancelConfirmation: React.FC<CancelConfirmationProps> = ({ bookingId, reason, setShowCancelConfirmationModal, setShowCancelReasonModal, setShowSuccessModal, setShowErrorModal }) => {

    const { mutate: _cancelBooking} = useMutation({
        mutationFn: cancelBooking, 
        onSuccess: (result) => {
            message.success("Booking cancelled successfully");
            setShowSuccessModal(true);
        },
        onError: (error) => {
            errorToast("Error in cancelling booking");
            setShowErrorModal(true);
        },
    });


    return (
        <div className="flex flex-col gap-4 px-4 pt-4">
            <div className="text-sm font-normal text-black">Are you sure you want to cancel the current booking?</div>
            <div className="flex flex-row justify-between gap-5 mb-6">
                <div className="w-1/2 bg-gray-300 rounded-lg px-4 py-3"  onClick={() => {_cancelBooking({bookingId, reason}); setShowSuccessModal(true); setShowCancelConfirmationModal(false)}}>
                    <div className="flex flex-row justify-center text-red-700 text-sm font-bold">Cancel Booking</div>
                </div>
                <div className="w-1/2 bg-yellow-400 rounded-lg px-4 py-3" onClick={() => {setShowCancelReasonModal(true); setShowCancelConfirmationModal(false)}}>
                    <div className="flex flex-row justify-center text-black text-sm font-bold">Go Back</div>
                </div>
            </div>
        </div>
    )
};

export default CancelConfirmation;
