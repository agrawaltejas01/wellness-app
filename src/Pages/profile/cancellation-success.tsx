import { ReactComponent as CancellationSuccessTick } from "../../images/utils/cancellation-success-tick.svg";
import { useEffect, useState } from "react";    
import { navigate } from "@reach/router";
interface CancellationSuccessProps {
    isOpen: boolean;
    onClose: () => void;
}

const CancellationSuccess: React.FC<CancellationSuccessProps> = ({ isOpen, onClose }) => {
    const [countdown, setCountdown] = useState(3);

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

    return (
        <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-row justify-center items-center w-1/2 mx-auto">
                <CancellationSuccessTick />
            </div>
            <div className="w-full text-sm font-bold text-black text-center">Your booking has been cancelled successfully</div>
            <div className="flex flex-row justify-between gap-5 mb-6">
                {/* <div className="w-full bg-yellow-300 rounded-lg px-4 py-3" onClick={onClose}>
                    <div className="flex flex-row justify-center text-black text-sm font-bold">Done</div>
                </div> */}
                <div className="w-full px-4 py-3 text-xs font-normal text-black text-center" >
                    Redirecting to home page in {countdown} seconds...
                </div>
            </div>
        </div>
    )
}

export default CancellationSuccess; 