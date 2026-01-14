import { useState } from "react";
import vectorImg from "../../images/home/vector.png";
import { ReactComponent as InfoCircleOutlined } from "../../images/utils/info.svg";
import {CenterModal} from "../profile/center-modal";    

const ZenScoreInfo = () => {
    return (
        <div className="flex flex-col gap-2 text-xs mt-2 max-w-md">
            <span>🔥 Zen Score (Consistency & Skill factor):  A dynamic score that tracks your consistency and everyday performance from recorded matches on court.</span>
            <ul className="list-disc pl-3">
                <li>How it works: Play well & play often to boost it.</li>
                <li>The Catch: It has a Decay Factor. If you skip game days, your score drops.</li>
                <li>The Reward: Your Leaderboard Rank is based purely on this score.</li>
            </ul>
            <span>
                🏆 Leaderboard Rank: Your standing in the player community everyday. High Zen Score = Higher Rank.
            </span>
            <span>
                ⭐️ ZBR (Your Skill Level): ZenfitX Badminton Rating (1-10), this is your official skill level. 
                It updates only when your actual gameplay improves or degrades against rated opponents based on your recorded matches using ZenVision AI.
            </span>
            <ul className="list-disc pl-3">
                <li>The Utility: ZBR unlocks access to Verified Level Games (e.g., "Intermediate Only").</li>
            </ul>
        </div>
    )
}

const ZenScoreCard = ({zenScore, zenRank, totalRank, previousRank, previousZenScore}: {zenScore: number, zenRank: number, totalRank: number, previousRank: number, previousZenScore: number}) => {
    const clampedZenScore = Math.max(0, Math.min(zenScore, 1000));
    const size = 48;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressRatio = clampedZenScore / 1000;
    const dashOffset = circumference * (1 - progressRatio);
    const [isZenScoreInfoModalOpen, setIsZenScoreInfoModalOpen] = useState(false);

    // Calculate rank change (lower rank number is better, so previousRank - zenRank gives positive for improvement)
    const rankChange = previousRank > 0 ? previousRank - zenRank : 0;
    const hasImproved = rankChange > 0;
    const hasDeclined = rankChange < 0;

    // Calculate zen score change (higher score is better, so previousZenScore - zenScore gives positive for improvement)
    const zenScoreChange = previousZenScore > 0 ? zenScore - previousZenScore : 0;
    const hasImprovedZenScore = zenScoreChange > 0;
    const hasDeclinedZenScore = zenScoreChange < 0;

    return (
        <div className="relative flex flex-col items-center py-2 rounded-3xl" style={{ backgroundColor: '#EBEBEB' }}>
            <InfoCircleOutlined className="absolute top-2 right-2 w-3 h-3" onClick={()=>setIsZenScoreInfoModalOpen(true)} />
            
            <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#505050', fontFamily: "Plus Jakarta Sans" }}>Rank</span>
            
            <span style={{ fontSize: '44px', fontWeight: 'bold', color: 'black', fontFamily: "Plus Jakarta Sans", margin: 0, padding: 0, lineHeight: 1 }}>{zenRank}</span>

            {previousRank > 0 && rankChange !== 0 && (
                <div 
                    className="flex items-center justify-center px-2 py-1 rounded"
                    style={{ 
                        background: hasImproved
                            ? 'linear-gradient(90deg, #EBEBEB 0%, #B7E9B8 50%, #EBEBEB 100%)'
                            : 'linear-gradient(90deg, #EBEBEB 0%, #FFBDBD 50%, #EBEBEB 100%)',
                        marginTop: '4px',
                        marginBottom: '4px'
                    }}
                >
                    <span style={{ 
                        fontSize: '12px', 
                        fontFamily: "Plus Jakarta Sans", 
                        fontWeight: 'normal', 
                        color: hasImproved ? '#009605' : '#D32F2F'
                    }}>
                        <span style={{ fontWeight: 'bold' }}>{hasImproved ? '↑' : '↓'} {Math.abs(rankChange)}</span> from yesterday
                    </span>
                </div>
            )}
            
            <span style={{ fontSize: '12px', fontStyle: 'italic', fontFamily: "Plus Jakarta Sans", fontWeight: 'normal', color: '#505050' }}>out of <b>{totalRank}</b></span>
            
            <img src={vectorImg} alt="Vector" className="w-12 h-3 justify-right" style={{ transform: 'rotate(2deg) translate(10px, 0px)' }} />


            <div className="flex flex-row gap-2 rounded-xl p-2 mt-4 items-center" style={{ background: 'linear-gradient(to right, white, #EBEBEB)' }}>            
                
                <div className="flex flex-col items-start">
                <span style={{ fontSize: '12px', fontStyle: 'italic', fontFamily: "Plus Jakarta Sans", fontWeight: 'normal', color: '#505050' }}>ZEN Score</span>
                {previousZenScore > 0 && zenScoreChange !== 0 && (
                    <div
                        className="flex items-center justify-center px-1 py-1 rounded"
                        style={{
                            background: hasImprovedZenScore
                                ? 'linear-gradient(90deg, #B7E9B8 0%, #F3F3F3 100%)'
                                : 'linear-gradient(90deg, #FFBDBD 0%, #F3F3F3 100%)'
                        }}
                    >
                        <span style={{ fontSize: '6px', fontFamily: "Plus Jakarta Sans", fontWeight: 'normal', color: hasImprovedZenScore ? '#009605' : '#D32F2F' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '6px' }}>{hasImprovedZenScore ? '↑' : '↓'} {Math.abs(zenScoreChange)}</span> from yesterday
                        </span>
                    </div>
                )}
                </div>
                
                {/* <InfoCircleOutlined className="w-2 h-2 self-center" /> */}
                
                <div
                    className="relative rounded-full inline-flex items-center justify-center"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                    }}
                >
                    <svg
                        width={size}
                        height={size}
                        style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
                    >
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#E5E5E5"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#009605"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                        />
                    </svg>
                    <span
                        className="flex items-center justify-center text-center bg-white relative z-10"
                        style={{
                            fontSize: '20px',
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: 'bold',
                            color: 'black',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    >
                        {zenScore}
                    </span>
                </div>
            </div>
        {isZenScoreInfoModalOpen && (
            <CenterModal
                isOpen={isZenScoreInfoModalOpen}
                onClose={()=>setIsZenScoreInfoModalOpen(false)}
                title="How it works?"
                subtitle=""
                children={<ZenScoreInfo  />}
            />
        )}
        </div>
    );
}

export default ZenScoreCard;