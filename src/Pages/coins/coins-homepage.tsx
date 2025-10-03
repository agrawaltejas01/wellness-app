import { useEffect, useState } from "react";
import { getCoins, getCoinsPackages } from "../../apis/coins/coins";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import Circle from "../../components/circle";
import { Rs } from "../../constants/symbols";
import { navigate } from "@reach/router";
import { Mixpanel } from "../../mixpanel/init";
import {ReactComponent as Coins} from "../../images/home/coins.svg"
import {ReactComponent as RightArrow} from "../../images/home/right-arrow.svg"



    


const CoinCapsule = () => {
    return (
        <div className="flex flex-row rounded-xl bg-coins text-black shadow-lg mt-2 gap-2 justify-between w-full">
            <div className="flex flex-row gap-2 p-2">   
                <div className="flex flex-col p-2 items-center justify-center">       
                    <Coins />
                </div>
                <div className="flex flex-col gap-1 p-1 justify-left">
                    <p className="text-sm italic cursive font-light">Buy </p>
                    <p className="text-sm font-bold">ZenfitX Coins</p>
                    <p className="text-xs font-light">Get upto 25% off on every booking</p> 
                </div>
            </div>
            <div className="flex flex-col p-2 items-center justify-center pr-4">
                <RightArrow />
            </div>
        </div>
    );
};


const CoinsHomepage: React.FC = () => {

    const [coins, setCoins] = useState(0);
    const [loading, setLoading] = useState(true);

    const userId = window.localStorage["zenfitx-user-details"]
          ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
          : null;

    return (    
        <div className="cursor-pointer" onClick={() => {
            navigate("/coins");
            Mixpanel.track("clicked_coins_section_on_homepage", {
                userId: userId,
            });
        }}>
           <CoinCapsule />
        </div>
    );
};

export default CoinsHomepage;