const LeaderboardInfo = () => {
    return (
        <div className="flex flex-col gap-2 text-xs mt-2">
            <ul>
            <li className="py-1">⏰ <span className="pl-2 font-bold"> Refresh:</span> updated <span className="font-bold">daily</span></li>
            <li className="py-1">🎯 <span className="pl-2 font-bold"> What's rank: </span> your doubles' rating (1.00 - 10.00)</li>
            <li className="py-1">🔍 <span className="pl-2 font-bold"> How it works:</span> we sort by current rating
                <ul className="list-disc pl-6">    
                    <li> <span className="font-bold">Tie?</span> the higher behind-the-scenes score edges it</li>
                    <li> <span className="font-bold">Still tied?</span> the more reliable player ranks higher</li>
                    <li> <span className="font-bold">Still tied?</span> the most recently active player ranks higher</li>
                </ul>
            </li>
            <li className="py-1">🧑‍🤝‍🧑 <span className="pl-2 font-bold">Who appears:</span> anyone with a rating (after your first recorded match)</li>
            </ul>
        </div>
    )
}

export default LeaderboardInfo;