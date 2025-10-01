import { navigate } from "@reach/router";

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

const LeaderboardHome = () => {

    const thisWeekChampions = [
        {
            name: "John Doe",
            points: 100
        },
        
        {
            name: "Jane Doe",
            points: 90
        },
        {
            name: "John Doe",
            points: 100
        },
        {
            name: "John Doe",
            points: 100
        },
        
    ]

    return (
        <div className="mx-4 mt-2 p-4 bg-white">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-xl font-bold font-sans">Leaderboard 🏆</h1>
                <div className="flex flex-row gap-2 text-sm font-sans text-green-700" onClick={()=>navigate('/leaderboard')}>View All</div>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-gray-100 px-4 py-4 mt-4">
                <div className="flex flex-row gap-2">
                    <span className="text-md font-sans font-bold">This Week's champions</span>
                </div>
                <div className="flex flex-col gap-4">
                    {thisWeekChampions.map((champion, index)=>(
                        <div className="flex flex-row gap-2 justify-between items-center">
                            <div className="flex flex-row gap-2 items-center">
                            <Circle radius={16} borderColor="white" borderStyle="solid" backgroundColor={index > 1 ? 'lightblue' : 'black'} character={index+1} fontColor={index > 1 ? 'black' : 'white'} />
                            <div className="flex flex-col">
                                <span className="text-sm font-sans font-bold">{champion.name}</span>
                                <span className="text-xs font-sans text-green-700">40 games</span>
                            </div>
                            </div>
                            <div className="flex flex-col justify-end">
                                <span className="text-sm font-sans font-bold text-right">{champion.points}</span>
                                <span className="text-xs font-sans text-right text-green-700">Rating</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeaderboardHome;