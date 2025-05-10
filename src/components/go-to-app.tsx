import { Button } from "antd";
import {ReactComponent as Chrome} from "../images/utils/chrome.svg";
import logo from "../images/utils/zenfitx-logo.jpeg";
import { useEffect, useState } from "react";

interface GoToAppProps {
    onVisibilityChange?: (isVisible: boolean) => void;
}

const GoToApp: React.FC<GoToAppProps> = ({ onVisibilityChange }) => {
    // Check sessionStorage when component mounts
    const [continueToBrowser, setContinueToBrowser] = useState(() => {
        return sessionStorage.getItem('continueToBrowser') === 'true';
    });

    const [appStoreUrl, setAppStoreUrl] = useState("https://play.google.com/store/apps/details?id=com.zenfitx.zenfitxapp");

    useEffect(() => {
        if(window.platformInfo?.platform == "ios" || window.platformInfo?.platform == "android") {
            setContinueToBrowser(true);
        }
        if(/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            setAppStoreUrl("https://apps.apple.com/in/app/zenfitx/id6736351969");
        }
    }, []);
    
    // Update parent about visibility changes
    useEffect(() => {
        if (onVisibilityChange) {
            onVisibilityChange(!continueToBrowser);
        }
    }, [continueToBrowser, onVisibilityChange]);
    
    // Function to handle continue click
    const handleContinueClick = () => {
        sessionStorage.setItem('continueToBrowser', 'true');
        setContinueToBrowser(true);
    };

    // If banner is hidden in this session, don't render anything
    if (continueToBrowser) return null;
    
    return (
        <div className="flex flex-col items-center rounded-t-2xl border-1 fixed bottom-0 w-full bg-white shadow-upper-shadow px-4 pb-10 pt-6 z-10">
            <div className="flex flex-row justify-between w-full px-4 pb-4">
                <p className="text-sm font-bold">Download the app to get upto 80% off on 1st booking</p>
            </div>
            <hr className="w-full border-t border-gray-300 pb-4" />
            <div className="flex flex-row justify-between w-full px-4">
                <div className="flex flex-row items-center justify-between gap-3">
                    <img src={logo} style={{width: "40px", height: "40px", borderRadius: "50%"}}/>
                    <div className="flex flex-col justify-left">
                        <div className="flex text-xs font-bold  justify-left">ZenfitX App</div>
                        <div className="flex text-xs font-thin text-gray justify-left">For smooth experience</div>
                    </div>
                </div>
                <Button
                    className="flex text-sm items-center bg-blue-600 text-white" 
                    style={{borderRadius: "20px", width: "100px", justifyContent: "center"}} 
                    onClick={() => window.open(appStoreUrl, "_blank")}
                >
                    Get
                </Button>
            </div>
            <div className="flex flex-row justify-between w-full px-4 pt-6">
                <div className="flex flex-row items-center justify-between gap-3">
                    <Chrome style={{width: "40px", height: "40px", borderRadius: "50%"}}/>
                    <div className="flex flex-col justify-left">
                        <div className="flex text-xs font-bold justify-left">Browser</div>
                    </div>
                </div>
                <Button 
                    className="flex text-sm items-center bg-white text-black border border-black" 
                    style={{borderRadius: "20px", width: "100px", justifyContent: "center"}} 
                    onClick={handleContinueClick}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default GoToApp;