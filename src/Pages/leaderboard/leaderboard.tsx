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
import "./leaderboard.css";

interface LeaderboardPlayer {
    activity_id: number;
    gamesPlayedCount: number;
    name: string;
    profile_picture: string;
    rating: number;
    user_id: number;
    rank?: number;
    lastGamePlayedDate?: string;
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

    // Get player initials
    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    // Get podium colors based on rank
    const getPodiumColor = (rank: number) => {
        if (rank === 0) return 'bg-gradient-to-b from-green-300 to-green-400'; // 1st place - green
        if (rank === 1) return 'bg-gradient-to-b from-amber-300 to-amber-400'; // 2nd place - brownish/tan
        return 'bg-gradient-to-b from-yellow-200 to-yellow-300'; // 3rd place - light yellow
    };

    const getPodiumHeight = (rank: number) => {
        if (rank === 0) return 'h-32 sm:h-36 lg:h-44'; // 1st place tallest
        if (rank === 1) return 'h-24 sm:h-28 lg:h-32'; // 2nd place
        return 'h-20 sm:h-24 lg:h-28'; // 3rd place
    };

    const getAvatarColor = (rank: number) => {
        if (rank === 0) return 'bg-gradient-to-br from-purple-500 to-purple-600'; // 1st
        if (rank === 1) return 'bg-gradient-to-br from-amber-600 to-amber-700'; // 2nd
        return 'bg-gradient-to-br from-purple-500 to-purple-600'; // 3rd
    };

    return (
        <div className="leaderboard-container">
            {/* Header */}
            <div className="leaderboard-header">
                <div className="leaderboard-header-content">
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
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Leaderboard 🏆</h1>
                            <span className="text-xs lg:text-sm text-gray-500 font-normal">Last updated: Nov 19th, 12 PM</span>
                        </div>
                    </div>
                    <button 
                        className="flex items-center gap-1 cursor-pointer" 
                        onClick={()=>{setIsLeaderboardInfoModalOpen(true); Mixpanel.track('leaderboard_info_modal_open', {user_id: userDetails?.id})}}
                    >
                        <InfoCircleOutlined className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                </div>
            </div>

            <div className="leaderboard-content">
                {/* Top 3 Podium */}
                {leaderboardData.length >= 3 && (
                    <div className="top-champions-card mb-6">
                        <h2 className="champions-title text-base lg:text-xl font-bold text-gray-900 mb-6 lg:mb-8">Top Champions</h2>
                        <div className="flex justify-center items-end gap-2 sm:gap-3 lg:gap-4 mb-6 px-2 mt-10 sm:mt-12 lg:mt-16">
                            {/* Arrange in 2-1-3 order */}
                            {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((player, displayIndex) => {
                                const actualRank = displayIndex === 0 ? 1 : displayIndex === 1 ? 0 : 2;
                                const rankNumber = actualRank + 1;
                                
                                return (
                                    <div key={player.user_id} className="flex-1 flex flex-col items-center">
                                        {/* Rank badge */}
                                        <div className={`relative mb-2 sm:mb-3 fade-in-delay-${displayIndex + 1}`}>
                                            {/* Rank number behind avatar */}
                                            <div 
                                                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-0 text-4xl sm:text-5xl lg:text-6xl"
                                                style={{
                                                    lineHeight: '1',
                                                    fontFamily: '"Hedvig Letters Serif", serif',
                                                    fontWeight: '600',
                                                    color: 'rgba(156, 163, 175, 0.4)',
                                                    pointerEvents: 'none'
                                                }}
                                            >
                                                {rankNumber}
                                            </div>
                                            
                                            {/* Verified checkmark badge */}
                                            <div 
                                                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-20"
                                            >
                                                {/* Green circle with checkmark */}
                                                <div 
                                                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500 flex items-center justify-center shadow-md"
                                                >
                                                    <svg 
                                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="3"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            {/* Avatar circle */}
                                            <div 
                                                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center relative z-10"
                                            >
                                                <div 
                                                    className={`${getAvatarColor(actualRank)} w-full h-full rounded-full flex items-center justify-center shadow-lg overflow-hidden`}
                                                >
                                                    {player.profile_picture ? (
                                                        <img 
                                                            src={player.profile_picture} 
                                                            alt={player.name}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-white font-bold text-xl sm:text-2xl lg:text-3xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                                            {getInitials(player.name)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Player info */}
                                        <div className="text-center mb-2 px-1">
                                            <p 
                                                className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 truncate max-w-full"
                                                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                                            >
                                                {player.name}
                                            </p>
                                            <p 
                                                className="text-xs sm:text-sm text-gray-500"
                                                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                                            >
                                                {(player.rating / 100).toFixed(0)} zen score
                                            </p>
                                        </div>

                                        {/* Podium bar */}
                                        <div 
                                            className={`${getPodiumColor(actualRank)} ${getPodiumHeight(actualRank)} w-full rounded-t-xl transition-all duration-300 hover:scale-105`}
                                        ></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* User's Own Rating */}
                {userDetails && (
                    <div className="user-performance-card">
                        <div className="flex flex-row gap-2 mb-2">
                            <h2 className="user-performance-title text-sm lg:text-lg font-bold text-gray-900">Your Performance</h2>
                            <InfoCircleOutlined className="w-3 h-3 lg:w-4 lg:h-4 self-center cursor-pointer" onClick={()=>{setIsUserRatingInfoModalOpen(true); Mixpanel.track('user_rating_info_modal_open', {user_id: userDetails?.id})}} />
                        </div>
                        {isUserRatingLoading ? (
                            <div className="flex items-center justify-center py-2">
                                <div className="animate-spin rounded-full h-3 w-3 lg:h-4 lg:w-4 border-b-2 border-blue-500"></div>
                                <span className="ml-2 text-xs lg:text-sm text-gray-600">Loading...</span>
                            </div>
                        ) : userRating ? (
                            <div>
                                <div className="user-performance-content bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 lg:p-4 border border-blue-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-500 rounded-full p-1 lg:p-2">
                                            <svg className="w-3 h-3 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <span className="font-bold text-xs lg:text-base text-gray-900">{userDetails.name}</span>
                                        <span className="text-xs lg:text-sm text-gray-500">•</span>
                                        <span className="text-xs lg:text-sm text-gray-600">{userRating.gamesPlayed} games</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm lg:text-lg font-bold text-blue-600">{ userRating.rating ? userRating.rating/100 : "-"}</span>
                                        <span className="text-xs lg:text-sm text-gray-600">Rating</span>
                                    </div>
                                </div>
                                {userRating.gamesPlayed === 0 && (
                                    <div className="mt-2 p-2 lg:p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
                                        <p className="text-xs lg:text-sm text-yellow-800">
                                            🎯 Play your first game to get ranked!
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-2">
                                <p className="text-xs lg:text-sm text-gray-600">Unable to load rating data</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Full Rankings */}
                <div className="all-rankings-card">
                    <div className="rankings-header p-4 lg:p-6 border-b border-gray-200">
                        <h2 className="rankings-title text-lg lg:text-xl font-bold text-gray-900">All Rankings</h2>
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
                                    className={`ranking-item p-4 lg:p-6 ${rankStyle.bg}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <div className="flex items-center gap-2">
                                                <span 
                                                    className="text-sm lg:text-base font-bold"
                                                    style={{ 
                                                        color: circleProps.fontColor,
                                                        minWidth: '24px',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {player.rank || 0}
                                                </span>
                                                <div 
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        border: `1px solid ${circleProps.borderColor}`,
                                                        backgroundColor: circleProps.backgroundColor,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {player.profile_picture ? (
                                                        <img 
                                                            src={player.profile_picture} 
                                                            alt={player.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span 
                                                            style={{
                                                                fontSize: '14px',
                                                                fontWeight: 'bold',
                                                                fontFamily: 'Plus Jakarta Sans',
                                                                color: circleProps.fontColor
                                                            }}
                                                        >
                                                            {getInitials(player.name)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold  text-gray-900">{player.name}</span>
                                                <span className="text-xs text-green-700">{player.gamesPlayedCount} games</span>
                                                <span className="text-green-700" style={{fontSize: '11px'}}>
                                                    {player.lastGamePlayedDate
                                                        ? (() => {
                                                            const lastPlayed = new Date(player.lastGamePlayedDate);
                                                            const today = new Date();
                                                            // Reset both dates to midnight to ignore time
                                                            lastPlayed.setHours(0,0,0,0);
                                                            today.setHours(0,0,0,0);
                                                            const diffTime = today.getTime() - lastPlayed.getTime();
                                                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                                            return `Last played ${diffDays == 0 ? ' today' : diffDays == 1 ? ' yesterday' : diffDays + ' days ago'}`;
                                                        })()
                                                        : ''
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="ranking-rating-value text-sm lg:text-lg font-bold text-gray-900">{player.rating/100}</span>
                                            <span className="ranking-rating-label text-xs lg:text-sm text-green-700">Rating</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                    <div className="flex justify-center py-4 lg:py-6">
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            <span className="text-sm lg:text-base text-gray-600">Loading more players...</span>
                        </div>
                    </div>
                )}
                
                {/* End of Results Indicator */}
                {!hasMoreData && leaderboardData.length > 0 && (
                    <div className="text-center py-4 lg:py-6">
                        <span className="text-sm lg:text-base text-gray-500">🏁 You've reached the end of the leaderboard!</span>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 lg:p-8 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-blue-500"></div>
                        <span className="text-sm lg:text-base text-gray-700">Loading leaderboard...</span>
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
