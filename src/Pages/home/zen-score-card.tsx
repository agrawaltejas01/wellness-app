import vectorImg from "../../images/home/vector.png";
import { ReactComponent as InfoCircleOutlined } from "../../images/utils/info.svg";
const ZenScoreCard = ({zenScore, zenRank}: {zenScore: number, zenRank: number}) => {

    return (
        <div className="flex flex-col items-center p-2 rounded-3xl" style={{ backgroundColor: '#EBEBEB' }}>
            
            <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#505050', fontFamily: "Plus Jakarta Sans" }}>ZEN Rank</span>
            
            <span style={{ fontSize: '44px', fontWeight: 'bold', color: 'black', fontFamily: "Plus Jakarta Sans", margin: 0, padding: 0, lineHeight: 1 }}>{zenRank}</span>
            
            <span style={{ fontSize: '12px', fontStyle: 'italic', fontFamily: "Plus Jakarta Sans", fontWeight: 'normal', color: '#505050' }}>out of <b>200</b></span>
            
            <img src={vectorImg} alt="Vector" className="w-12 h-3 justify-right" style={{ transform: 'rotate(2deg) translate(10px, 0px)' }} />


            <div className="flex flex-row gap-2 rounded-3xl p-2 mt-4 items-center" style={{ background: 'linear-gradient(to right, white, #EBEBEB)' }}>            
                
                <span style={{ fontSize: '12px', fontStyle: 'italic', fontFamily: "Plus Jakarta Sans", fontWeight: 'normal', color: '#505050' }}>ZEN Score</span>
                
                <InfoCircleOutlined className="w-2 h-2 self-center" />
                
                <div className="relative inline-flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
                    <svg className="absolute top-0 left-0 transform -rotate-90" width="64" height="64" style={{ width: '64px', height: '64px' }}>
                        {/* Background circle */}
                        <circle
                            cx="32"
                            cy="32"
                            r="26"
                            fill="none"
                            stroke="#E5E5E5"
                            strokeWidth="4"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="32"
                            cy="32"
                            r="26"
                            fill="none"
                            stroke="#009605"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - Math.min(zenScore / 1000, 1))}`}
                            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                        />
                    </svg>
                    <span className="text-center bg-white p-2 relative z-10" style={{ fontSize: '20px', fontFamily: "Plus Jakarta Sans", fontWeight: 'bold', color: 'black', borderRadius: '50%' }}>{zenScore}</span>
                </div>
            </div>
        </div>
    );
}

export default ZenScoreCard;