import { navigate, RouteComponentProps } from "@reach/router";
import {ReactComponent as BackArrow} from "../../images/utils/back-button-checkout.svg";
import { useState } from "react";
import { userDetailsAtom } from "../../atoms/atom";
import { useAtom } from "jotai";
import { errorToast } from "../../components/Toast";
import { useMutation } from "@tanstack/react-query";
import logo from "../../logo.svg";
import { buyCoins } from "../../apis/coins/coins";
import Loader from "../../components/Loader";
import { Mixpanel } from "../../mixpanel/init";

interface ICoinsCheckout extends RouteComponentProps {
    coinPackage: CoinsPackage;
    setShowCoinsCheckout: (showCoinsCheckout: boolean) => void;
}

interface CoinsPackage {
    Id: number;
    Name: string;
    CoinValue: number;
    SellingPrice: number;
    ValidityDays: number;
}

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

const CoinsCheckout: React.FC<ICoinsCheckout> = ({coinPackage, setShowCoinsCheckout}) => {


    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState('idle');
    const [userDetails] = useAtom(userDetailsAtom);

    const userId = window.localStorage["zenfitx-user-details"]
          ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
          : null;


        const { mutate: _buyCoins } = useMutation({
            mutationFn: (packageId: number) => buyCoins(packageId, userId),
            onSuccess: (result) => {
                console.log(result);
                Mixpanel.track("coins_purchased_success", {
                    userId: userId,
                    coinsPackage: coinPackage,
                });
                return result;
            },
            onError: (error) => {
                Mixpanel.track("coins_purchased_failed", {
                    userId: userId,
                    coinsPackage: coinPackage,
                });
                errorToast("Error in buying coins");
            }
        });


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
                navigate("/");       
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
        <div className="flex flex-col">
            {coinPackage.CoinValue < 10000 && <div className="flex flex-row justify-between rounded-md bg-white text-black shadow-lg px-4 py-4 mt-4 mx-4">
                <div className="flex flex-row">Valid for</div>
                <div className="flex flex-row font-bold">{coinPackage.ValidityDays} days</div>
            </div>}
            <div className="flex flex-col rounded-md bg-white text-black shadow-lg px-4 py-4 mt-4 mx-4 mb-4"> 
                <div className="flex flex-row justify-between font-bold text-sm">
                    <div className="flex flex-row">To Pay</div>
                    <div className="flex flex-row">₹{coinPackage.SellingPrice}</div>
                </div>
                {coinPackage.CoinValue > coinPackage.SellingPrice && <div className="flex flex-row justify-between">
                    <div className="flex flex-row text-xs font-light text-gray-500">Total Saved ₹{coinPackage.CoinValue - coinPackage.SellingPrice}</div>
                </div>}
                <hr className="border-1 border-separate mt-4 border-gray border-spacing-16" />
                <div className="flex flex-row justify-end font-bold text-sm mt-2">
                    {coinPackage.CoinValue > coinPackage.SellingPrice && <div className="flex flex-row line-through text-gray-500"> ₹{coinPackage.CoinValue}</div>}
                    <div className="flex flex-row ml-2"> ₹{coinPackage.SellingPrice}</div>
                </div>
            </div>
            <div className="flex flex-row justify-between font-bold text-sm mb-4 mx-4">
                <button className="w-full font-bold text-black text-lg rounded-lg px-4 py-4" style={{background: 'linear-gradient(135deg, rgba(254, 213, 44, 0.24) 0%, rgba(254, 213, 44, 0.4) 100%)'}} onClick={() => {
                    handleBuyNow(coinPackage.Id, setLoading);
                    Mixpanel.track("clicked_buy_coins_button", {
                        userId: userId,
                        coinsPackage: coinPackage,
                    });
                }}>Buy</button>
            </div>
        </div>
    )
}

export default CoinsCheckout;