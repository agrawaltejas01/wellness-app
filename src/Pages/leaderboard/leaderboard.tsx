import { navigate } from "@reach/router";
import { RouteComponentProps } from "@reach/router";

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

interface LeaderboardProps extends RouteComponentProps {}

const Leaderboard = (props: LeaderboardProps) => {
    // Extended leaderboard data with more players
    const leaderboardData = [
        { name: "John Doe", points: 100, games: 45, rank: 1 },
        { name: "Jane Doe", points: 95, games: 42, rank: 2 },
        { name: "Mike Johnson", points: 88, games: 40, rank: 3 },
        { name: "Sarah Wilson", points: 85, games: 38, rank: 4 },
        { name: "Alex Brown", points: 82, games: 36, rank: 5 },
        { name: "Emily Davis", points: 78, games: 35, rank: 6 },
        { name: "Chris Miller", points: 75, games: 33, rank: 7 },
        { name: "Lisa Garcia", points: 72, games: 32, rank: 8 },
        { name: "David Rodriguez", points: 68, games: 30, rank: 9 },
        { name: "Jessica Martinez", points: 65, games: 28, rank: 10 },
        { name: "Ryan Anderson", points: 62, games: 27, rank: 11 },
        { name: "Amanda Taylor", points: 58, games: 25, rank: 12 },
        { name: "Kevin Thomas", points: 55, games: 24, rank: 13 },
        { name: "Nicole Jackson", points: 52, games: 22, rank: 14 },
        { name: "Brandon White", points: 48, games: 20, rank: 15 }
    ];

    const getRankStyle = (rank: number) => {
        if (rank === 1) return { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-800' };
        if (rank === 2) return { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-800' };
        if (rank === 3) return { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-800' };
        return { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-800' };
    };

    const getCircleProps = (rank: number) => {
        if (rank <= 3) {
            return {
                borderColor: rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : '#fb923c',
                backgroundColor: rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : '#fb923c',
                fontColor: 'white'
            };
        }
        return {
            borderColor: '#e5e7eb',
            backgroundColor: '#f9fafb',
            fontColor: '#374151'
        };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold font-sans text-gray-900">Leaderboard 🏆</h1>
                    </div>
                </div>
            </div>

            {/* Top 3 Podium */}
            <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold font-sans text-gray-900 mb-4">Top Champions</h2>
                <div className="flex justify-center items-end gap-4 mb-6">
                    {/* 2nd Place */}
                    {leaderboardData[1] && (
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-100 rounded-lg p-4 mb-2 min-h-[80px] flex flex-col justify-end">
                                <Circle 
                                    radius={20} 
                                    borderColor="#9ca3af" 
                                    borderStyle="solid" 
                                    backgroundColor="#9ca3af" 
                                    character="2" 
                                    fontColor="white" 
                                />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm font-sans">{leaderboardData[1].name}</p>
                                <p className="text-xs text-green-700 font-sans">{leaderboardData[1].points} pts</p>
                            </div>
                        </div>
                    )}

                    {/* 1st Place */}
                    {leaderboardData[0] && (
                        <div className="flex flex-col items-center">
                            <div className="bg-yellow-100 rounded-lg p-4 mb-2 min-h-[100px] flex flex-col justify-end">
                                <Circle 
                                    radius={24} 
                                    borderColor="#fbbf24" 
                                    borderStyle="solid" 
                                    backgroundColor="#fbbf24" 
                                    character="1" 
                                    fontColor="white" 
                                />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm font-sans">{leaderboardData[0].name}</p>
                                <p className="text-xs text-green-700 font-sans">{leaderboardData[0].points} pts</p>
                            </div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {leaderboardData[2] && (
                        <div className="flex flex-col items-center">
                            <div className="bg-orange-100 rounded-lg p-4 mb-2 min-h-[60px] flex flex-col justify-end">
                                <Circle 
                                    radius={18} 
                                    borderColor="#fb923c" 
                                    borderStyle="solid" 
                                    backgroundColor="#fb923c" 
                                    character="3" 
                                    fontColor="white" 
                                />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm font-sans">{leaderboardData[2].name}</p>
                                <p className="text-xs text-green-700 font-sans">{leaderboardData[2].points} pts</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Full Rankings */}
            <div className="mx-4 mt-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold font-sans text-gray-900">All Rankings</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {leaderboardData.map((player, index) => {
                            const rankStyle = getRankStyle(player.rank);
                            const circleProps = getCircleProps(player.rank);
                            
                            return (
                                <div key={index} className={`p-4 hover:bg-gray-50 transition-colors ${rankStyle.bg}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Circle 
                                                radius={16} 
                                                borderColor={circleProps.borderColor}
                                                borderStyle="solid" 
                                                backgroundColor={circleProps.backgroundColor}
                                                character={player.rank} 
                                                fontColor={circleProps.fontColor}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold font-sans text-gray-900">{player.name}</span>
                                                <span className="text-xs font-sans text-green-700">{player.games} games</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold font-sans text-gray-900">{player.points}</span>
                                            <span className="text-xs font-sans text-green-700">Rating</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="mx-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <h2 className="text-lg font-bold font-sans text-gray-900 mb-4">This Week's Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold font-sans text-gray-900">{leaderboardData.length}</p>
                            <p className="text-xs font-sans text-gray-600">Active Players</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold font-sans text-gray-900">{leaderboardData.reduce((sum, player) => sum + player.games, 0)}</p>
                            <p className="text-xs font-sans text-gray-600">Total Games</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
