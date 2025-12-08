import { InfoCircleOutlined } from "@ant-design/icons";

const getBackgroundColor = (rating: number) => {
    if(rating > 0 && rating < 250) return { backgroundColor: 'rgba(107, 227, 156, 0.15)', fontColor: '#6BE39C' };
    if(rating >= 250 && rating < 400) return { backgroundColor: 'rgba(255, 199, 91, 0.15)', fontColor: '#FFC75B' };
    if(rating >= 400 && rating < 550) return { backgroundColor: 'rgba(255, 127, 80, 0.15)', fontColor: '#FF7F50' };
    if(rating >= 550 && rating < 700) return { backgroundColor: 'rgba(108, 160, 220, 0.15)', fontColor: '#6CA0DC' };
    if(rating >= 700 && rating < 850) return { backgroundColor: 'rgba(156, 106, 222, 0.15)', fontColor: '#9C6ADE' };
    if(rating >= 850) return { backgroundColor: 'rgba(181, 101, 29, 0.15)', fontColor: '#B5651D' };
    return { backgroundColor: 'rgba(0, 0, 0, 0.15)', fontColor: '#4B5563' };
}

export const RatingBadgeHomeScreen: React.FC<{ rating: number}> = ({ rating }) => {
    return (
        <div className="flex flex-row items-center gap-1 rounded-full py-2 justify-between pl-4 px-3" style={{backgroundColor: getBackgroundColor(rating).backgroundColor}}>
            <div className="flex flex-col text-black" style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: '10px',letterSpacing: '0.15em' }}>
                <span className="font-bold text-xs">ZBR <InfoCircleOutlined className="w-2 h-2 self-center" /> </span> 
                <span className="text-light">RATING</span>
            </div>
            <div className="px-2 py-1 rounded-full text-white font-bold" style={{backgroundColor: getBackgroundColor(rating).fontColor, fontSize: '16px'}}>
              {(rating / 100)} ⭐️ 
            </div>
            
        </div>
    )
}

export default RatingBadgeHomeScreen;