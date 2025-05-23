import { ReactComponent as CancellationSuccessTick } from "../../images/utils/cancellation-success-tick.svg";
interface CancellationSuccessProps {
    isOpen: boolean;
    onClose: () => void;
}

const CancellationSuccess: React.FC<CancellationSuccessProps> = ({ isOpen, onClose }) => {
    return (
        <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-row justify-center items-center w-1/2 mx-auto">
                <CancellationSuccessTick />
            </div>
            <div className="text-sm font-normal text-black">Your booking has been cancelled successfully</div>
            <div className="flex flex-row justify-between gap-5 mb-6">
                <div className="w-full bg-yellow-300 rounded-lg px-4 py-3" onClick={onClose}>
                    <div className="flex flex-row justify-center text-black text-sm font-bold">Done</div>
                </div>
            </div>
        </div>
    )
}

export default CancellationSuccess; 