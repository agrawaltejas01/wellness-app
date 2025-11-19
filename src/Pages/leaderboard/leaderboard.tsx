import { navigate } from "@reach/router";
import { RouteComponentProps } from "@reach/router";
import { useEffect, useState, useCallback, useRef } from "react";
import { getLeaderboard } from "../../apis/leaderboard/leaderboard";
import { getRatings } from "../../apis/ratings/ratings";
import { getGamesPlayed } from "../../apis/games/games";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import { useAtom } from "jotai/react";
import { userDetailsAtom } from "../../atoms/atom";
import { InfoCircleOutlined } from "@ant-design/icons";
import {CenterModal} from "../profile/center-modal";
import LeaderboardInfo from "./leadboardinfo";
import { Mixpanel } from "../../mixpanel/init";
import UserRatingInfo from "../home/rating-info";

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
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isUserRatingLoading, setIsUserRatingLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [hasMoreData, setHasMoreData] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useRef<HTMLDivElement | null>(null);
    const [isLeaderboardInfoModalOpen, setIsLeaderboardInfoModalOpen] = useState(false);
    const [isUserRatingInfoModalOpen, setIsUserRatingInfoModalOpen] = useState(false);
    // Utility function to sort players by rating, then by games played (higher games = better rank)
    const sortPlayersByRatingAndGames = (players: LeaderboardPlayer[]) => {
        return players.sort((a, b) => {
            // First sort by rating (higher rating = better rank)
            if (a.rating !== b.rating) {
                return b.rating - a.rating;
            }
            // If ratings are equal, sort by games played (higher games = better rank)
            return b.gamesPlayedCount - a.gamesPlayedCount;
        });
    };

    const { mutate: _getLeaderboard } = useMutation({
        mutationFn: getLeaderboard,
        onSuccess: (result) => {
            // Handle null or undefined response
            if (!result || !result.leaderboard || !Array.isArray(result.leaderboard)) {
                setHasMoreData(false);
                setIsLoading(false);
                setIsLoadingMore(false);
                return;
            }

            // Sort only the new players by rating and games played
            const sortedNewPlayers = sortPlayersByRatingAndGames([...result.leaderboard]);
            
            const playersWithRanks = sortedNewPlayers.map((player: LeaderboardPlayer, index: number) => ({
                ...player,
                rank: currentPage * pageSize + index + 1
            }));
            
            if (currentPage === 0) {
                // First load - replace data
                setLeaderboardData(playersWithRanks);
            } else {
                // Subsequent loads - append data (new players are already sorted)
                setLeaderboardData(prev => [...prev, ...playersWithRanks]);
            }
            
            // If we received fewer items than pageSize, we've reached the end
            setHasMoreData(result.leaderboard.length === pageSize);
            setIsLoading(false);
            setIsLoadingMore(false);
        },
        onError: (error) => {
            errorToast("Error in getting leaderboard");
            setHasMoreData(false); // Stop infinite loading on error
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    });

    const { mutate: _getUserRating } = useMutation({
        mutationFn: getRatings,
        onSuccess: (result) => {
            // Handle null or undefined response
            if (!result || !result.rating) {
                setUserRating(prev => ({ ...prev, rating: 0 } as UserRating));
                return;
            }
            setUserRating(prev => ({ ...prev, rating: result.rating.rating || 0 } as UserRating));
        },
        onError: (error) => {
            console.error("Error getting user rating:", error);
            // Set default rating on error to prevent undefined state
            setUserRating(prev => ({ ...prev, rating: 0 } as UserRating));
        }
    });

    const { mutate: _getUserGamesPlayed } = useMutation({
        mutationFn: getGamesPlayed,
        onSuccess: (result) => {
            // Handle null or undefined response
            if (!result) {
                setUserRating(prev => ({ 
                    rating: prev?.rating || 0, 
                    gamesPlayed: 0 
                }));
                setIsUserRatingLoading(false);
                return;
            }
            setUserRating(prev => ({ 
                rating: prev?.rating || 0, 
                gamesPlayed: result.gamesPlayedCount || 0 
            }));
            setIsUserRatingLoading(false);
        },
        onError: (error) => {
            console.error("Error getting user games played:", error);
            // Set default games played on error
            setUserRating(prev => ({ 
                rating: prev?.rating || 0, 
                gamesPlayed: 0 
            }));
            setIsUserRatingLoading(false);
        }
    });

    const loadMoreData = useCallback(() => {
        if (!isLoadingMore && hasMoreData) {
            setIsLoadingMore(true);
            setCurrentPage(prev => prev + 1);
        }
    }, [isLoadingMore, hasMoreData]);

    const lastElementRefCallback = useCallback((node: HTMLDivElement) => {
        if (isLoadingMore || !hasMoreData) return;
        if (observerRef.current) observerRef.current.disconnect();
        
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreData && !isLoadingMore) {
                loadMoreData();
            }
        }, {
            threshold: 1.0,
            rootMargin: '100px'
        });
        
        if (node) observerRef.current.observe(node);
        lastElementRef.current = node;
    }, [isLoadingMore, hasMoreData, loadMoreData]);

    useEffect(() => {
        if (currentPage === 0) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }
        _getLeaderboard({activityId: 1, pageSize, pageNumber: currentPage});
    }, [currentPage, pageSize]);

    // Reset pagination state on component mount
    useEffect(() => {
        setCurrentPage(0);
        setHasMoreData(true);
        setLeaderboardData([]);
    }, []);

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (userDetails?.id) {
            setIsUserRatingLoading(true);
            _getUserRating(userDetails.id);
            _getUserGamesPlayed(userDetails.id);
        }
    }, [userDetails]); 

    useEffect(() => {
        Mixpanel.track('leaderboard_page_viewed', {user_id: userDetails?.id});
    }, [userDetails]);


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
            <div className="flex flex-row justify-between bg-white shadow-sm">
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
                        <div className="flex flex-col">
                        <h1 className="text-2xl font-bold  text-gray-900">Leaderboard 🏆</h1>
                        <span className="text-xs text-gray-500 font-normal">Last updated: Oct 18th, 4 PM</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-1 pr-4" onClick={()=>{setIsLeaderboardInfoModalOpen(true); Mixpanel.track('leaderboard_info_modal_open', {user_id: userDetails?.id})}}>
                    <InfoCircleOutlined className="w-5 h-5 self-center" />
                </div>
            </div>

            {/* Top 3 Podium */}
            <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm p-4">
                <h2 className="text-base font-bold  text-gray-900 mb-3">Top Champions</h2>
                <div className="flex justify-center items-end gap-3 mb-4">
                    {/* 2nd Place */}
                    {leaderboardData[1] && (
                        <div className="flex flex-col items-center w-1/3">
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
                                <p className="font-bold text-xs ">{leaderboardData[1].name}</p>
                                <p className="text-xs text-green-700 ">{leaderboardData[1].rating/100}</p>
                            </div>
                        </div>
                    )}

                    {/* 1st Place */}
                    {leaderboardData[0] && (
                        <div className="flex flex-col items-center w-1/3">
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
                                <p className="font-bold text-xs ">{leaderboardData[0].name}</p>
                                <p className="text-xs text-green-700 ">{leaderboardData[0].rating/100}</p>
                            </div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {leaderboardData[2] && (
                        <div className="flex flex-col items-center w-1/3">
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
                                <p className="font-bold text-xs ">{leaderboardData[2].name}</p>
                                <p className="text-xs text-green-700 ">{leaderboardData[2].rating/100}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User's Own Rating */}
            {userDetails && (
                <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm p-3">
                    <div className="flex flex-row gap-2 mb-2">
                    <h2 className="text-sm font-bold  text-gray-900">Your Performance</h2>
                    <InfoCircleOutlined className="w-3 h-3 self-center" onClick={()=>{setIsUserRatingInfoModalOpen(true); Mixpanel.track('user_rating_info_modal_open', {user_id: userDetails?.id})}} />
                    </div>
                    {isUserRatingLoading ? (
                        <div className="flex items-center justify-center py-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-xs  text-gray-600">Loading...</span>
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
                                    <span className="font-bold text-xs  text-gray-900">{userDetails.name}</span>
                                    <span className="text-xs  text-gray-500">•</span>
                                    <span className="text-xs  text-gray-600">{userRating.gamesPlayed} games</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-bold  text-blue-600">{ userRating.rating ? userRating.rating/100 : "-"}</span>
                                    <span className="text-xs  text-gray-600">Rating</span>
                                </div>
                            </div>
                            {userRating.gamesPlayed === 0 && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
                                    <p className="text-xs  text-yellow-800">
                                        🎯 Play your first game to get ranked!
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-xs  text-gray-600">Unable to load rating data</p>
                        </div>
                    )}
                </div>
            )}

            {/* Full Rankings */}
            <div className="mx-4 mt-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold  text-gray-900">All Rankings</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {leaderboardData.map((player, index) => {
                            const rankStyle = getRankStyle(player.rank || 0);
                            const circleProps = getCircleProps(player.rank || 0);
                            const isLastElement = index === leaderboardData.length - 1;
                            
                            return (
                                <div 
                                    key={`${player.user_id}-${player.rank}`} 
                                    ref={isLastElement ? lastElementRefCallback : null}
                                    className={`p-4 ${rankStyle.bg}`}
                                >
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
                                                <span className="text-sm font-bold  text-gray-900">{player.name}</span>
                                                <span className="text-xs  text-green-700">{player.gamesPlayedCount} games</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold  text-gray-900">{player.rating/100}</span>
                                            <span className="text-xs  text-green-700">Rating</span>
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
                    <h2 className="text-lg font-bold  text-gray-900 mb-4">This Week's Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold  text-gray-900">{leaderboardData.length}</p>
                            <p className="text-xs  text-gray-600">Active Players</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold  text-gray-900">{leaderboardData.reduce((sum, player) => sum + player.gamesPlayedCount, 0)}</p>
                            <p className="text-xs  text-gray-600">Total Games</p>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Infinite Scroll Loading Indicator */}
            {isLoadingMore && (
                <div className="mx-4 mb-6 flex justify-center py-4">
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        <span className="text-sm  text-gray-600">Loading more players...</span>
                    </div>
                </div>
            )}
            
            {/* End of Results Indicator */}
            {!hasMoreData && leaderboardData.length > 0 && (
                <div className="mx-4 mb-6 text-center py-4">
                    <span className="text-sm  text-gray-500">🏁 You've reached the end of the leaderboard!</span>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className=" text-gray-700">Loading leaderboard...</span>
                    </div>
                </div>
            )}
            {isLeaderboardInfoModalOpen && (
                <CenterModal
                    isOpen={isLeaderboardInfoModalOpen}
                    onClose={()=>setIsLeaderboardInfoModalOpen(false)}
                    title="Leaderboard - Quick Guide"
                    children={<LeaderboardInfo />}
                />
            )}
            {isUserRatingInfoModalOpen && (
                <CenterModal
                    isOpen={isUserRatingInfoModalOpen}
                    onClose={()=>setIsUserRatingInfoModalOpen(false)}
                    title="User Rating (ZBR) - Quick Guide"
                    subtitle="ZenfitX Badminton Rating"
                    children={<UserRatingInfo />}
                />
            )}
        </div>
    );
};

export default Leaderboard;
