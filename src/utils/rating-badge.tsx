const getBackgroundColor = (rating: number) => {
    if(rating > 0 && rating < 250) return { backgroundColor: 'rgba(107, 227, 156, 0.15)', fontColor: '#6BE39C' };
    if(rating >= 250 && rating < 400) return { backgroundColor: 'rgba(255, 199, 91, 0.15)', fontColor: '#FFC75B' };
    if(rating >= 400 && rating < 550) return { backgroundColor: 'rgba(255, 127, 80, 0.15)', fontColor: '#FF7F50' };
    if(rating >= 550 && rating < 700) return { backgroundColor: 'rgba(108, 160, 220, 0.15)', fontColor: '#6CA0DC' };
    if(rating >= 700 && rating < 850) return { backgroundColor: 'rgba(156, 106, 222, 0.15)', fontColor: '#9C6ADE' };
    if(rating >= 850) return { backgroundColor: 'rgba(181, 101, 29, 0.15)', fontColor: '#B5651D' };
    return { backgroundColor: 'rgba(0, 0, 0, 0.15)', fontColor: '#4B5563' };
}

export const RatingBadge: React.FC<{ rating: number, playerRating?: boolean }> = ({ rating, playerRating = false }) => {
    return (
         playerRating ? <div className="flex flex-row gap-1 items-center rounded-md p-1" style={{backgroundColor: getBackgroundColor(rating).backgroundColor}}>
            <div className="px-2 rounded-md text-white text-sm font-bold" style={{backgroundColor: getBackgroundColor(rating).fontColor}}>
                {rating ? `⭐️ ${(rating / 100)}${playerRating ? '' : '+'}`: 'Open'}
            </div>
            <div className="text-sm text-black">
                {rating ? 'ZBR' : 'ZBR'}
            </div>
        </div>
        :
        <div className="flex flex-row gap-1 items-center rounded-md p-1" style={{ backgroundColor: getBackgroundColor(rating).backgroundColor }}>
            {rating ? (<div className="text-sm text-white font-bold rounded-md px-1" style={{backgroundColor: getBackgroundColor(rating).fontColor}}>
                ⭐️ {(rating / 100)}+
            </div>) : <div className="text-sm rounded-md" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)', color: '#4B5563' }}>
                <span className="px-1 rounded-md text-white font-bold">Open</span></div>}
            <div className="text-sm">
                {rating ? 'ZBR Required' : 'All levels'}
            </div>
        </div>
    )
}

export default RatingBadge;