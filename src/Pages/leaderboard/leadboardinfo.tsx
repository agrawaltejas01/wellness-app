const LeaderboardInfo = () => {
    return (
        <div className="flex flex-col gap-2 text-xs mt-2">
            <ul>
            <li className="py-1">⏰ <span className="pl-2 font-bold"> Refresh:</span> updated <span className="font-bold">daily</span></li>
            <li className="py-1">🔍 <span className="pl-2 font-bold"> How it works:</span> Ranks are based on current rating.
                <ul className="list-disc pl-6">    
                    <li> <span className="font-bold">Tie-breaker 1:</span> More games played</li>
                    <li> <span className="font-bold">Tie-breaker 2:</span> Most recent activity</li>
                </ul>
            </li>
            <li className="py-1">🧑‍🤝‍🧑 <span className="pl-2 font-bold">Who appears:</span> Anyone with a rating (you’ll appear after your first recorded match)</li>
            </ul>
        </div>
    )
}

export default LeaderboardInfo;