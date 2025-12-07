import vectorImg from "../../images/home/vector.png";
import { ReactComponent as InfoCircleOutlined } from "../../images/utils/info.svg";
const ZenScoreCard = ({zenScore, zenRank, totalRank}: {zenScore: number, zenRank: number, totalRank: number}) => {
    const clampedZenScore = Math.max(0, Math.min(zenScore, 1000));
    const size = 56;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressRatio = clampedZenScore / 1000;
    const dashOffset = circumference * (1 - progressRatio);

    return (
        <div className="flex flex-col items-center p-2 rounded-3xl" style={{ backgroundColor: '#EBEBEB' }}>
            
            <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#505050', fontFamily: "Plus Jakarta Sans" }}>ZEN Rank</span>
            
            <span style={{ fontSize: '44px', fontWeight: 'bold', color: 'black', fontFamily: "Plus Jakarta Sans", margin: 0, padding: 0, lineHeight: 1 }}>{zenRank}</span>
            
            <span style={{ fontSize: '12px', fontStyle: 'italic', fontFamily: "Plus Jakarta Sans", fontWeight: 'normal', color: '#505050' }}>out of <b>{totalRank}</b></span>
            
            <img src={vectorImg} alt="Vector" className="w-12 h-3 justify-right" style={{ transform: 'rotate(2deg) translate(10px, 0px)' }} />


            <div className="flex flex-row gap-2 rounded-3xl p-2 mt-4 items-center" style={{ background: 'linear-gradient(to right, white, #EBEBEB)' }}>            
                
                <span style={{ fontSize: '10px', fontStyle: 'italic', fontFamily: "Plus Jakarta Sans", fontWeight: 'normal', color: '#505050' }}>ZEN Score</span>
                
                <InfoCircleOutlined className="w-2 h-2 self-center" />
                
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
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    >
                        {zenScore}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ZenScoreCard;