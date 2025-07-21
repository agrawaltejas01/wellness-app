import { navigate } from "@reach/router";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { useLocation } from "@reach/router";

interface IFeedbackThankyou extends RouteComponentProps {
    success?: boolean;
}

const FeedbackThankyou: React.FC<IFeedbackThankyou> = () => {
    const [countdown, setCountdown] = useState(3);
    const location = useLocation();
    const success = (location.state as any)?.success || false;

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(countdown - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [countdown]);
    useEffect(() => {
        if (countdown === 0) {
            navigate('/'); // TODO: Change to home page
        }
    }, [countdown]);
    return (
        <div className="flex flex-col items-center justify-center h-screen"> 
            {success ? (
                <>
                    <picture>
                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f970/512.gif" className="w-10 h-10" />
                    </picture> 
                    <p className="text-sm text-black font-bold">Thank you for your feedback!</p> 
                    <p className="text-sm text-black">We will use your feedback to improve our service.</p>
                </>
            ) : (
                <>
                    <picture>
                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f62d/512.gif" className="w-10 h-10" />
                    </picture> 
                    <p className="text-sm text-black font-bold">Something went wrong!</p>
                    <p className="text-sm text-black">Please try again later.</p>
                </>
            )}
        </div>      
    )
}

export default FeedbackThankyou;