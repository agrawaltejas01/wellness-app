import { Button } from "antd";
import {ReactComponent as Chrome} from "../images/utils/chrome.svg";
import { useState } from "react";

const GoToApp = () => {
    const [continueToBrowser, setContinueToBrowser] = useState(false);
    return (
        <div className={`flex flex-col items-center rounded-lg fixed bottom-0 w-full bg-white shadow-upper-shadow px-4 pb-10 pt-10 z-10 ${continueToBrowser ? "hidden" : ""}`}>
            <div className="flex flex-row justify-between w-full px-4">
                <div className="flex flex-row items-center justify-between gap-3">
                    <Chrome style={{width: "30px", height: "30px"}}/>
                    <div className="flex flex-col justify-left">
                        <div className="flex text-xs font-bold  justify-left">ZenfitX App</div>
                        <div className="flex text-xs font-thin justify-left">For offers and rewards</div>
                    </div>
                </div>
                <Button className="flex text-sm items-center bg-blue-600 text-white" style={{borderRadius: "20px", width: "100px", justifyContent: "center"}} onClick={() => window.open("https://play.google.com/store/apps/details?id=com.zenfitx.zenfitxapp", "_blank")}>Get</Button>
            </div>
            <div className="flex flex-row justify-between w-full px-4 pt-6">
                <div className="flex flex-row items-center justify-between gap-3">
                    <Chrome style={{width: "30px", height: "30px"}}/>
                    <div className="flex flex-col justify-left">
                        <div className="flex text-xs font-bold  justify-left">Browser</div>
                    </div>
                </div>
                <Button className="flex text-sm items-center bg-white text-black border border-black" style={{borderRadius: "20px", width: "100px", justifyContent: "center"}} onClick={() => setContinueToBrowser(true)}>Continue</Button>
            </div>
        </div>
    )
}   

export default GoToApp;