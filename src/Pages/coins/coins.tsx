import { useState } from "react";

import { useEffect } from "react";
import { buyCoins, getCoins, getCoinsPackages } from "../../apis/coins/coins";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import { navigate, RouteComponentProps } from "@reach/router";
import {ReactComponent as BackArrow} from "../../images/utils/back-button-checkout.svg";
import { userDetailsAtom } from "../../atoms/atom";
import { useAtom } from "jotai";
import logo from "../../logo.svg";
import Loader from "../../components/Loader";
import CoinsCheckout from "./coins-checkout";
import { BottomUpModal } from "../profile/half-page-modal";
import { toLetterCase } from "../../utils/string-operation";
import Faqs from "./faqs";
import { Mixpanel } from "../../mixpanel/init";
// import ConfettiSystem from "../../components/confetti-system";

function loadScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }


  interface CoinsPackage {
    Id: number;
    Name: string;
    CoinValue: number;
    SellingPrice: number;
    ValidityDays: number;
  }

const Coins: React.FC<RouteComponentProps> = () => {

    const [coins, setCoins] = useState(0);
    const [coinsPackages, setCoinsPackages] = useState([]);
    const [userDetails] = useAtom(userDetailsAtom);
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState('idle');
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCoinsCheckout, setShowCoinsCheckout] = useState(false);
    const [coinPackage, setCoinPackage] = useState<CoinsPackage | null>(null);

    const userId = window.localStorage["zenfitx-user-details"]
          ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
          : null;


    const { mutate: _getCoinsPackages } = useMutation({
        mutationFn: getCoinsPackages,
        onSuccess: (result) => {
            console.log(result);
            setCoinsPackages(result);
        },
        onError: (error) => {
            errorToast("Error in getting coins packages");
        }
    });

    const { mutate: _getCoins } = useMutation({
        mutationFn: getCoins,
        onSuccess: (result) => {
            setCoins(result.coins);
        },
        onError: (error) => {
            errorToast("Error in getting coins");
        }
    });

    const { mutate: _buyCoins } = useMutation({
        mutationFn: (packageId: number) => buyCoins(packageId, userId),
        onSuccess: (result) => {
            console.log(result);
            return result;
        },
        onError: (error) => {
            errorToast("Error in buying coins");
        }
    });

    useEffect(() => {
        if (userId) {
            _getCoins(userId);
        }
        _getCoinsPackages();
    }, []);

    const handleConfettiComplete = () => {
        setShowConfetti(false);
        // Optional: Reset order status or redirect user
        setTimeout(() => {
          setOrderStatus('idle');
        }, 2000);
      };

    const handleBuyNow = async (packageId: number, setLoading: (loading: boolean) => void) => {

        setLoading(true);
        setOrderStatus('loading');
        const result = await buyCoins(packageId, userId);

        const orderId = result.id;

        const options = {
            key: process.env.REACT_APP_RZP_CLIENT_KEY,
            amount: result.amount,
            currency: "INR",
            name: "ZenfitX",
            description: `Checkout for coins package - ${packageId}`,
            image: { logo },
            order_id: orderId,
            prefill: {
              name: userDetails?.name as string,
              email: `${userDetails?.name as string}@example.com`,
              contact: userDetails?.phone as string,
            },
            theme: {
              color: "#1a1a1a",
            },
            webview_intent: true,
            method: {
              upi: true,
            },
            handler: (response: any) => {
              if (response.razorpay_payment_id) {
                setOrderStatus('success');
                // setShowConfetti(true);
                navigate("/", { replace: true });       
              }
            },
          };


          setLoading(false);
          const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
          if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
          }
          //@ts-ignore
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
    
        }

    if (loading) return <Loader />;

    return (

        <div>   
            <div className="flex flex-col items-center justify-center shadow-md">
                <div className="flex gap-2 mt-4 items-center justify-center">
                    <BackArrow className="cursor-pointer absolute left-4" onClick={() => {
                        navigate("/");
                    }} />
                    <p className="text-xl font-bold">ZenfitX Coins (1 Coin = ₹1)</p>
                </div>
                <hr className="w-full mt-4"/>
            </div>
            <div className="flex flex-col items-center justify-center rounded-full bg-mint-green text-black shadow-lg px-8 py-4 mt-4  mx-4"> 
                <p className="text-md font-bold">Available ZenfitX Coins: {coins}</p>
            </div>
            <div className="flex flex-col w-full text-sm mt-4"> 
                { coinsPackages && coinsPackages.map((coinsPackage: any) => (
                    <div className="flex flex-row rounded-lg bg-gray-100 text-black shadow-md px-8 py-4 mt-4 mx-4 items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <p className="text-md ">{coinsPackage.Name}</p>
                            <p className="text-md">{coinsPackage.CoinValue} Coins</p>
                            <div className="flex flex-row gap-2">
                                <p className="text-md line-through">₹{coinsPackage.CoinValue}</p>
                                <p className="text-md font-bold">₹{coinsPackage.SellingPrice}</p>
                            </div>
                            <p className="text-md">{Math.floor(((coinsPackage.CoinValue - coinsPackage.SellingPrice) / coinsPackage.CoinValue) * 100)}% Off</p>
                            <p className="text-md">Validity: {coinsPackage.ValidityDays} days</p>
                        </div>
                        <button className="bg-black text-white rounded-lg px-4 py-2" onClick={() => {
                            setCoinPackage(coinsPackage);
                            setShowCoinsCheckout(true);
                            Mixpanel.track("clicked_buy_coins_button", {
                                userId: userId,
                                coinsPackage: coinsPackage,
                            });
                            // handleBuyNow(coinsPackage.Id, setLoading);
                        }}>Buy Now</button>
                    </div>
                ))}
            </div>
            <Faqs />
            {/* Success Message */}
            {/* {orderStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-center">
                    🎉 Watch the SVG confetti celebration!
                    </p>
                </div>
            )} */}
            {showCoinsCheckout && (
                <BottomUpModal 
                isOpen={showCoinsCheckout} 
                onClose={() => {setShowCoinsCheckout(false);}} 
                title={toLetterCase(coinPackage?.Name as string)}
                subtitle="Pay using coins instead of cash on next booking. (1 Coin = ₹1)"
                showCloseButton={false}
                borderBottom={true}
                >
                <CoinsCheckout coinPackage={coinPackage as CoinsPackage} setShowCoinsCheckout={setShowCoinsCheckout} />
                {/* <Button type="primary" onClick={() => {setShowCancelReasonModal(true); setShowCancelModal(false)}}>Cancel Booking</Button> */}
                </BottomUpModal>
            )}
        </div>
    );

}

export default Coins;

