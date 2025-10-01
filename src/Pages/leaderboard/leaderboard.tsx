import { navigate } from "@reach/router";
import { RouteComponentProps } from "@reach/router";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../../apis/leaderboard/leaderboard";
import { getRatings } from "../../apis/ratings/ratings";
import { getGamesPlayed } from "../../apis/games/games";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import { useAtom } from "jotai/react";
import { userDetailsAtom } from "../../atoms/atom";

interface LeaderboardPlayer {
    activity_id: number;
    gamesPlayedCount: number;
    name: string;
    rating: number;
    user_id: number;
    rank?: number;
}

interface UserRating {
    rating: number;
    gamesPlayed: number;
}

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
    const [userDetails] = useAtom(userDetailsAtom);

    const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
    const [userRating, setUserRating] = useState<UserRating | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserRatingLoading, setIsUserRatingLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);

    const { mutate: _getLeaderboard } = useMutation({
        mutationFn: getLeaderboard,
        onSuccess: (result) => {
            const playersWithRanks = result.leaderboard.map((player: LeaderboardPlayer, index: number) => ({
                ...player,
                rank: currentPage * pageSize + index + 1
            }));
            setLeaderboardData(playersWithRanks);
            setHasMoreData(result.leaderboard.length === pageSize);
            setIsLoading(false);
        },
        onError: (error) => {
            errorToast("Error in getting leaderboard");
            setIsLoading(false);
        }
    });

    const { mutate: _getUserRating } = useMutation({
        mutationFn: getRatings,
        onSuccess: (result) => {
            setUserRating(prev => ({ ...prev, rating: result.rating.rating || 0 } as UserRating));
        },
        onError: (error) => {
            console.error("Error getting user rating:", error);
        }
    });

    const { mutate: _getUserGamesPlayed } = useMutation({
        mutationFn: getGamesPlayed,
        onSuccess: (result) => {
            setUserRating(prev => ({ 
                rating: prev?.rating || 0, 
                gamesPlayed: result.gamesPlayedCount || 0 
            }));
            setIsUserRatingLoading(false);
        },
        onError: (error) => {
            console.error("Error getting user games played:", error);
            setIsUserRatingLoading(false);
        }
    });

    useEffect(() => {
        setIsLoading(true);
        _getLeaderboard({activityId: 1, pageSize, pageNumber: currentPage});
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (userDetails?.id) {
            setIsUserRatingLoading(true);
            _getUserRating(userDetails.id);
            _getUserGamesPlayed(userDetails.id);
        }
    }, [userDetails]); 

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (hasMoreData) {
            setCurrentPage(currentPage + 1);
        }
    };

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
            <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm p-4">
                <h2 className="text-base font-bold font-sans text-gray-900 mb-3">Top Champions</h2>
                <div className="flex justify-center items-end gap-3 mb-4">
                    {/* 2nd Place */}
                    {leaderboardData[1] && (
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-100 rounded-lg p-2 mb-1 min-h-[50px] flex flex-col justify-end">
                                <Circle 
                                    radius={16} 
                                    borderColor="#9ca3af" 
                                    borderStyle="solid" 
                                    backgroundColor="#9ca3af" 
                                    character="2" 
                                    fontColor="white" 
                                />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-xs font-sans">{leaderboardData[1].name}</p>
                                <p className="text-xs text-green-700 font-sans">{leaderboardData[1].rating}</p>
                            </div>
                        </div>
                    )}

                    {/* 1st Place */}
                    {leaderboardData[0] && (
                        <div className="flex flex-col items-center">
                            <div className="bg-yellow-100 rounded-lg p-2 mb-1 min-h-[60px] flex flex-col justify-end">
                                <Circle 
                                    radius={18} 
                                    borderColor="#fbbf24" 
                                    borderStyle="solid" 
                                    backgroundColor="#fbbf24" 
                                    character="1" 
                                    fontColor="white" 
                                />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-xs font-sans">{leaderboardData[0].name}</p>
                                <p className="text-xs text-green-700 font-sans">{leaderboardData[0].rating}</p>
                            </div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {leaderboardData[2] && (
                        <div className="flex flex-col items-center">
                            <div className="bg-orange-100 rounded-lg p-2 mb-1 min-h-[40px] flex flex-col justify-end">
                                <Circle 
                                    radius={14} 
                                    borderColor="#fb923c" 
                                    borderStyle="solid" 
                                    backgroundColor="#fb923c" 
                                    character="3" 
                                    fontColor="white" 
                                />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-xs font-sans">{leaderboardData[2].name}</p>
                                <p className="text-xs text-green-700 font-sans">{leaderboardData[2].rating}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User's Own Rating */}
            {userDetails && (
                <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm p-3">
                    <h2 className="text-sm font-bold font-sans text-gray-900 mb-2">Your Performance</h2>
                    {isUserRatingLoading ? (
                        <div className="flex items-center justify-center py-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-xs font-sans text-gray-600">Loading...</span>
                        </div>
                    ) : userRating ? (
                        <div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 border border-blue-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-500 rounded-full p-1">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-xs font-sans text-gray-900">{userDetails.name}</span>
                                    <span className="text-xs font-sans text-gray-500">•</span>
                                    <span className="text-xs font-sans text-gray-600">{userRating.gamesPlayed} games</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-bold font-sans text-blue-600">{userRating.rating}</span>
                                    <span className="text-xs font-sans text-gray-600">Rating</span>
                                </div>
                            </div>
                            {userRating.gamesPlayed === 0 && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
                                    <p className="text-xs font-sans text-yellow-800">
                                        🎯 Play your first game to get ranked!
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-xs font-sans text-gray-600">Unable to load rating data</p>
                        </div>
                    )}
                </div>
            )}

            {/* Full Rankings */}
            <div className="mx-4 mt-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold font-sans text-gray-900">All Rankings</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {leaderboardData.map((player, index) => {
                            const rankStyle = getRankStyle(player.rank || 0);
                            const circleProps = getCircleProps(player.rank || 0);
                            
                            return (
                                <div key={index} className={`p-4 hover:bg-gray-50 transition-colors ${rankStyle.bg}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Circle 
                                                radius={16} 
                                                borderColor={circleProps.borderColor}
                                                borderStyle="solid" 
                                                backgroundColor={circleProps.backgroundColor}
                                                character={player.rank || 0} 
                                                fontColor={circleProps.fontColor}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold font-sans text-gray-900">{player.name}</span>
                                                <span className="text-xs font-sans text-green-700">{player.gamesPlayedCount} games</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold font-sans text-gray-900">{player.rating}</span>
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
            {/* <div className="mx-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <h2 className="text-lg font-bold font-sans text-gray-900 mb-4">This Week's Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold font-sans text-gray-900">{leaderboardData.length}</p>
                            <p className="text-xs font-sans text-gray-600">Active Players</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold font-sans text-gray-900">{leaderboardData.reduce((sum, player) => sum + player.gamesPlayedCount, 0)}</p>
                            <p className="text-xs font-sans text-gray-600">Total Games</p>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Pagination Controls */}
            <div className="mx-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0 || isLoading}
                            className={`px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors ${
                                currentPage === 0 || isLoading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            Previous
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-sans text-gray-600">Page</span>
                            <span className="text-sm font-bold font-sans text-gray-900">{currentPage + 1}</span>
                        </div>
                        
                        <button 
                            onClick={handleNextPage}
                            disabled={!hasMoreData || isLoading}
                            className={`px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors ${
                                !hasMoreData || isLoading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="font-sans text-gray-700">Loading leaderboard...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
