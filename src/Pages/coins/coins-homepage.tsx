import { useEffect, useState } from "react";
import { getCoins, getCoinsPackages } from "../../apis/coins/coins";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import Circle from "../../components/circle";
import { Rs } from "../../constants/symbols";
import {ReactComponent as RightArrow} from "../../images/utils/right-arrow.svg";
import { navigate } from "@reach/router";





const CoinCapsule = ({ coins, loading }: { coins: number, loading: boolean }) => {
    return (
        <div className={`flex flex-col rounded-full bg-mint-green text-black shadow-lg px-8 py-2 mt-4 mx-4 ${loading ? "animate-pulse" : ""}`}>
            <div className="flex flex-col">
                {coins != 0 && !loading && <div className="flex flex-row gap-2 justify-between">
                    <div className="flex flex-row gap-2 justify-between">
                        <p className="text-md font-bold">Available ZenfitX Coins: </p>
                        <p className="text-md font-bold">{coins}</p>
                    </div>
                    <RightArrow />
                </div>}
                {coins == 0 && !loading && 
                <div className="flex flex-row gap-2 justify-between items-center">
                    <p className="text-xs font-bold">Get upto 20% off on buying ZenfitX coins</p>
                    <RightArrow />
                </div>
                }
            </div>
        </div>
    );
};


const CoinsHomepage: React.FC = () => {

    const [coins, setCoins] = useState(0);
    const [loading, setLoading] = useState(true);

    const { mutate: _getCoins } = useMutation({
        mutationFn: getCoins,
        onSuccess: (result) => {
            setCoins(result.coins);
            setLoading(false);
            // setCoins(10);
        }
    });

    const userId = window.localStorage["zenfitx-user-details"]
          ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
          : null;

    useEffect(() => {
        if (userId) {
            _getCoins(userId);
        }
    }, [coins]);

    return (    
        <div className="cursor-pointer" onClick={() => {
            navigate("/coins");
        }}>
           <CoinCapsule coins={coins} loading={loading} />
        </div>
    );
};

export default CoinsHomepage;