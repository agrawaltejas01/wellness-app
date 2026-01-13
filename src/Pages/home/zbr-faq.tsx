import { RouteComponentProps, navigate } from "@reach/router";
import { useState, useEffect } from "react";
import { ReactComponent as ArrowDown } from "../../images/utils/arrow-down.svg";
import { ReactComponent as BackButton } from "../../images/utils/back-button.svg";
import "./zbr-faq.css";

const ZbrFaq: React.FC<RouteComponentProps> = () => {
    const [open, setOpen] = useState<string | null>(null);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        // ⭐ Highlight, Scoring & Ranking (ZBR vs. Zen Score)
        {
            question: "How to get my highlight?",
            answer: "Book your spot on ZenfitX app and your highlight will be ready within 24hrs–48hrs (after you have played your game). Only users booking using ZenfitX app will get their highlights. If you book more than 1 spot, we promise the highlight of the user who has made booking using their phone number. Kindly book your own spot to get your highlight."
        },
        {
            question: "Why did my Zen Score drop when I didn't play?",
            answer: "The Zen Score measures your \"Current Form\" and consistency. It has a built-in decay factor, meaning if you skip game days, the score cools down (just like your muscles would). Play regularly to keep your streak alive and your rank high."
        },
        {
            question: "My ZBR is 5.0, but my Zen Score is 600. Why different numbers?",
            answer: "ZBR (1–10) is your \"License\", it measures raw skill and only changes when you actually get better or worse. Zen Score is your \"Hustle\", it fluctuates daily based on activity. A lower-skilled player can beat a Pro on the Leaderboard just by playing more consistently!"
        },
        {
            question: "How accurate is the ZBR Rating?",
            answer: "More accurate than your friend's opinion 😉. The AI measures objective data—shot speed, court coverage, and unforced errors—rather than just \"who won.\" It's the fairest way to find your true level."
        },
        // 🤖 The Tech & Privacy
        {
            question: "How does ZenVision AI actually \"watch\" me?",
            answer: "Think of it like a smart referee. Our cameras track the shuttlecock and player movement in real-time. The AI analyzes the video feed to count shots, detect rallies, and create highlights, so you don't have to wear any sensors or setup tripods."
        },
        {
            question: "Do I need to record the video myself?",
            answer: "Nope. Just book a slot at a ZenfitX Smart Court. The cameras are already there. You show up, play, and the app delivers your highlights and stats automatically within next few hours."
        },
        {
            question: "Why do you need my selfie?",
            answer: "To make you the star. ZenVision uses facial recognition to identify you in the video footage. This ensures your highlights land in your profile, not your opponent's."
        },
        // 🏸 Gameplay, Booking & Cancellations
        {
            question: "Can I join any game I want?",
            answer: "It depends. Some games are \"Open\" (anyone can join), while others are \"Verified Level\" (e.g., ZBR 5+ only). This ensures competitive, balanced matches where everyone gets a good workout."
        },
        {
            question: "What is the cancellation policy?",
            answer: "We offer a full refund if you cancel at least 12 hours before the game. You get a 50% refund if cancelled 6–12 hours before. Cancellations within 6 hours of the start time are non-refundable."
        },
        {
            question: "What if I have a bad game? Will my ZBR tank?",
            answer: "Not instantly. ZBR looks at patterns over time. One bad hair day won't ruin your rating, but a consistent slump will lower it."
        },
        {
            question: "How do I get featured on the \"Top Highlights\"?",
            answer: "Play fearless! The AI automatically detects long rallies, smash winners, and high-intensity moments. If you pull off a crazy shot, chances are ZenVision caught it."
        },
        // 📞 Support & Feedback
        {
            question: "Still have questions about your stats, rank, or a refund?",
            answer: "We're here to sort it out. Whether it's a ZBR query or feedback on your experience, reach out to us directly.<br />Call us at 9002782111 or write to <a href=\"mailto:nikita@zenfitx.in\" class=\"text-blue-600 hover:text-blue-800\">nikita@zenfitx.in</a>"
        }
    ];

    return (
        <div className="zbr-faqs-section px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-50"
                >
                    <BackButton className="w-6 h-6" />
                </button>
            </div>

            <div className="mb-8 text-center">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Highlight, Scoring & Ranking
                </h2>
                <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                    Everything you need to know about your ZBR ratings, highlights, and how the Zen Score system works
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-[#9B205D] to-[#b8336a] rounded-full mx-auto mt-4"></div>
            </div>

            <div className="faqs-container">
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <button
                            className="faq-question group"
                            onClick={() => {
                                open === faq.question ? setOpen(null) : setOpen(faq.question);
                            }}
                        >
                            <span className="text-base lg:text-lg font-semibold text-left flex-1 text-gray-800 group-hover:text-gray-900 transition-colors">
                                {faq.question}
                            </span>
                            <ArrowDown className={`w-5 h-5 lg:w-6 lg:h-6 text-gray-500 arrow-transition ${open === faq.question ? "rotate-180" : ""}`} />
                        </button>
                        {open === faq.question && (
                            <div className="faq-answer">
                                <p className="text-base lg:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Still have questions? <a href="mailto:nikita@zenfitx.in" className="text-[#9B205D] hover:text-[#7a1a47] font-medium transition-colors">Contact our support team</a>
                </p>
            </div> */}
        </div>
    );
};

export default ZbrFaq;
