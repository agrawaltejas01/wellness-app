import { navigate } from "@reach/router";
import { useMutation } from "@tanstack/react-query";
import { getTop3Players } from "../../apis/leaderboard/leaderboard";
import { useEffect, useState } from "react";

interface CircleProps {
    radius: number;
    borderColor: string;
    borderStyle: string;
    backgroundColor: string;
    character?: string | React.ReactNode;
    fontColor?: string;
}

const Circle = ({radius, borderColor, borderStyle, backgroundColor, character = '', fontColor = 'white'}: CircleProps) => {
    return (
        <div style={{width: `${radius * 2}px`, 
                    height: `${radius * 2}px`, 
                    borderRadius: '50%', 
                    border: `1px ${borderStyle} ${borderColor}`, 
                    backgroundColor, display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    fontSize: `14px`, 
                    fontWeight: 'bold', 
                    fontFamily: 'Plus Jakarta Sans', 
                    color: fontColor}}>
            {character}
        </div>
    )
}

const LeaderboardHome = ({activityId}: {activityId: number}) => {

    const [thisWeekChampions, setThisWeekChampions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { mutate: _getTop3Players } = useMutation({
        mutationFn: getTop3Players,
        onSuccess: (result) => {
            setThisWeekChampions(result.leaderboard);
            setIsLoading(false);
        },
        onError: () => {
            setIsLoading(false);
        }
    });

    useEffect(() => {
        _getTop3Players(activityId);
    }, [activityId]);

    return (
        thisWeekChampions.length < 4 && !isLoading ? null : (
        <div className="mx-3 mb-4 mt-2 bg-white">
            <div className="flex flex-row justify-between items-center p-2">
                <h1 className="text-xl font-bold font-sans">Leaderboard 🏆</h1>
                <div className="flex flex-row gap-2 text-sm font-sans text-green-700" onClick={()=>navigate('/leaderboard')}>View All</div>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-gray-100 px-4 py-4 mt-2 mx-2" onClick={()=>navigate('/leaderboard')}>
                <div className="flex flex-row gap-2">
                    <span className="text-md font-sans font-bold">This Week's Champions</span>
                </div>
                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        // Loading skeleton with pulse animation
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex flex-row gap-2 justify-between items-center animate-pulse">
                                <div className="flex flex-row gap-2 items-center">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                    <div className="flex flex-col gap-1">
                                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end gap-1">
                                    <div className="h-4 bg-gray-300 rounded w-12"></div>
                                    <div className="h-3 bg-gray-300 rounded w-10"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        thisWeekChampions.map((champion, index)=>(
                            <div key={index} className="flex flex-row gap-2 justify-between items-center">
                                <div className="flex flex-row gap-2 items-center">
                                <Circle radius={16} borderColor='white' borderStyle="solid" backgroundColor='white' character={index+1} fontColor='black' />
                                <div className="flex flex-col">
                                    <span className="text-sm font-sans font-bold">{champion.name}</span>
                                    <span className="text-xs font-sans text-green-700">{champion.gamesPlayedCount} {champion.gamesPlayedCount > 1 ? 'games' : 'game'}</span>
                                </div>
                                </div>
                                <div className="flex flex-col justify-end">
                                    <span className="text-sm font-sans font-bold text-right text-black">{champion.rating}</span>
                                    <span className="text-xs font-sans text-right text-green-700">Rating</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
        )
    )
}

export default LeaderboardHome;