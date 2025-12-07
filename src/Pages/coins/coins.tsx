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
import "./coins.css";
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
    const [showCoinsHomepage, setShowCoinsHomepage] = useState(false);

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
        },
        onSettled: () => {
            setShowCoinsHomepage(true);
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
                setShowConfetti(true);
                // navigate("/");       
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

    if (!showCoinsHomepage) return <Loader />;

    return (

        <div className="coins-page-container">   
            {/* Header */}
            <div className="coins-header sticky top-0 z-10 bg-white shadow-sm">
                <div className="coins-header-content">
                    <BackArrow className="cursor-pointer" onClick={() => {
                        navigate("/");
                    }} />
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg lg:text-2xl font-bold">ZenfitX Coins</h1>
                        <p className="text-xs lg:text-sm text-gray-600">1 Coin = ₹1</p>
                    </div>
                    <div className="w-6"></div>
                </div>
            </div>

            {/* Content */}
            <div className="coins-content">
                {/* Balance Card */}
                <div className="coins-balance-card">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs lg:text-sm opacity-70 uppercase tracking-wider">Your Balance</p>
                        <p className="text-4xl lg:text-5xl font-bold">{coins.toLocaleString()}</p>
                        <p className="text-sm lg:text-base opacity-80">ZenfitX Coins</p>
                    </div>
                </div>

                {/* Packages Grid */}
                <div className="coins-packages-grid">
                    { coinsPackages && coinsPackages.map((coinsPackage: any) => (
                        <div key={coinsPackage.Id} className="coins-package-card">
                            <div className="flex flex-col h-full gap-5">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-sm lg:text-base font-medium text-gray-600 mb-1">{coinsPackage.Name}</h3>
                                        <p className="text-2xl lg:text-3xl font-bold">{coinsPackage.CoinValue.toLocaleString()} <span className="text-lg lg:text-xl font-normal text-gray-500">Coins</span></p>
                                    </div>
                                    <span className="coins-discount-badge">
                                        {Math.floor(((coinsPackage.CoinValue - coinsPackage.SellingPrice) / coinsPackage.CoinValue) * 100)}% OFF
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl lg:text-4xl font-bold">₹{coinsPackage.SellingPrice.toLocaleString()}</span>
                                    <span className="text-lg text-gray-400 line-through">₹{coinsPackage.CoinValue.toLocaleString()}</span>
                                </div>

                                {/* Validity */}
                                {coinsPackage.CoinValue < 10000 && (
                                    <p className="text-sm text-gray-600">
                                        Valid for {coinsPackage.ValidityDays} days
                                    </p>
                                )}

                                {/* Buy Button */}
                                <button 
                                    className="coins-buy-button mt-auto"
                                    onClick={() => {
                                        setCoinPackage(coinsPackage);
                                        setShowCoinsCheckout(true);
                                        Mixpanel.track("clicked_buy_now_button_on_coins_page", {
                                            userId: userId,
                                            coinsPackage: coinsPackage,
                                        });
                                    }}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQs */}
                <Faqs />
            </div>

            {/* Modal */}
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
                </BottomUpModal>
            )}
        </div>
    );

}

export default Coins;

