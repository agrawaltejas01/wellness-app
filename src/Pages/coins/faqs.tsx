import { RouteComponentProps } from "@reach/router";
import { useState } from "react";
import { ReactComponent as ArrowDown } from "../../images/utils/arrow-down.svg";

const Faqs: React.FC<RouteComponentProps> = () => {
    const [open, setOpen] = useState<string | null>(null);
    const faqs = [
        {
            question: "What are ZenfitX Coins?",
            answer: "ZenfitX Coins are prepaid credits you can use to book any sports, fitness, or wellness session on the app. 1 Coin = ₹1. <br />These coins can be used on checkout page to book your spot without the hassle of daily payment"
        },
        {
            question: "How much is 1 ZenfitX Coin worth?",
            answer: "1 Coin = ₹1"
        },
        {
            question: "What’s the benefit of buying coins?",
            answer: "You save up to 25% — and book seamlessly without entering card or UPI details every time"
        },
        {
            question: "How many coins do I get in each plan?",
            answer: `2 Month Trial Plan: 600 Coins for ₹570<br />2 Month Plan: 3000 Coins for ₹2550<br />6 Month Plan: 10,000 Coins for ₹8200<br />12 Month Plan: 30,000 Coins for ₹22,500`,
        },
        {
            question: "Do ZenfitX Coins expire?",
            answer: "Yes, they’re valid only for the plan duration: <br />2 Months = 60 days <br />6 Months = 180 days <br />12 Months = 365 days"
        },
        {
            question: "Can I use coins instead of paying every time?",
            answer: "Yes! Coins work like cash on ZenfitX. At checkout, just tap 'Use ZenfitX Coins' to book instantly"
        },
        {
            question: "Can I get a refund on unused coins?",
            answer: "No — all plans are final and coins are non-refundable once bought."
        },
        {
            question: "What happens if I cancel a booking made using coins?",
            answer: "If your cancellation qualifies for a refund, the coins will be credited back to your balance."
        },
        {
            question: "Where can I use ZenfitX Coins?",
            answer: "You can redeem coins for any activity on the app — across sports, gyms, yoga, wellness, and more."
        },
        {
            question: "What if I run out of coins before my plan ends?",
            answer: "You can either top up with a new plan or switch to regular payment at checkout — no interruptions."
        },
        {
            question: "Are ZenfitX Coins transferable?",
            answer: "Nope — coins are linked to your account and can’t be shared or gifted (yet!)."
        }
    ];
    return (
        <div className="flex flex-col w-full mt-12 px-4 mb-12"> 
            <h3 className="text-md font-bold text-center">FAQs</h3>
            <div className="flex flex-col w-full">
                {faqs.map((faq) => (
                    <div className="flex flex-col mt-4 px-4">
                        <div className="flex flex-row justify-between" onClick={() => {
                            open === faq.question ? setOpen(null) : setOpen(faq.question);
                        }}>
                            <p className="text-sm font-bold text-left">{faq.question}</p>
                            <ArrowDown className={`w-4 h-4 ${open === faq.question ? "rotate-180" : ""}`} />
                        </div>
                        {open === faq.question && <p className="text-sm font-light text-left py-2" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>}
                        <hr className="border-gray-100 mt-2 " />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Faqs;