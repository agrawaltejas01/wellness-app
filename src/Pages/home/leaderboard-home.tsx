import { navigate } from "@reach/router";
import { useMutation } from "@tanstack/react-query";
import { getTop3Players, getLeaderboard } from "../../apis/leaderboard/leaderboard";
import { useEffect, useState } from "react";
import { Mixpanel } from "../../mixpanel/init";
import verifiedBadgeImg from "../../images/home/verified-badge-player.png";
import "./leaderboard-home.css";

const LeaderboardHome = ({activityId}: {activityId: number}) => {

    const [topPlayers, setTopPlayers] = useState<any[]>([]);
    const [totalPlayers, setTotalPlayers] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
    const userId = userDetails.id;

    // Utility function to sort players by rating, then by games played
    const sortPlayersByRatingAndGames = (players: any[]) => {
        return players.sort((a, b) => {
            if (a.rating !== b.rating) {
                return b.rating - a.rating;
            }
            return b.gamesPlayedCount - a.gamesPlayedCount;
        });
    };

    const { mutate: _getTop3Players } = useMutation({
        mutationFn: getTop3Players,
        onSuccess: (result) => {
            const players = result.leaderboard || [];
            // const sortedPlayers = sortPlayersByRatingAndGames([...players]);
            setTopPlayers(players.slice(0, 3));
            setTotalPlayers(result.totalCount || 0);
            setIsLoading(false);
        },
        onError: () => {
            setIsLoading(false);
        }
    });

    // Get total player count
    // const { mutate: _getTotalPlayers } = useMutation({
    //     mutationFn: getLeaderboard,
    //     onSuccess: (result) => {
    //         // You might want to get this from a different endpoint
    //         // For now using a placeholder
    //         setTotalPlayers(1123);
    //     },
    //     onError: () => {}
    // });

    useEffect(() => {
        _getTop3Players(activityId);
        // _getTotalPlayers({activityId, pageSize: 1, pageNumber: 0});
    }, [activityId]);

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
        if (rank === 0) return 'h-16 sm:h-36 lg:h-44'; // 1st place tallest
        if (rank === 1) return 'h-12 sm:h-28 lg:h-32'; // 2nd place
        return 'h-8 sm:h-24 lg:h-28'; // 3rd place
    };

    const getRankBadgeColor = (rank: number) => {
        if (rank === 0) return 'bg-yellow-400'; // Gold for 1st
        if (rank === 1) return 'bg-gray-400'; // Silver for 2nd  
        return 'bg-orange-400'; // Bronze for 3rd
    };

    const getAvatarColor = (rank: number) => {
        if (rank === 0) return 'bg-gradient-to-br from-purple-500 to-purple-600'; // 1st
        if (rank === 1) return 'bg-gradient-to-br from-amber-600 to-amber-700'; // 2nd
        return 'bg-gradient-to-br from-purple-500 to-purple-600'; // 3rd
    };

    if (topPlayers.length < 3 && !isLoading) return null;

    // Arrange players in 2-1-3 order for display
    const displayOrder = topPlayers.length >= 3 ? [topPlayers[1], topPlayers[0], topPlayers[2]] : [];

    return (
        <div className="leaderboard-home-container mx-4 mb-4 mt-6 sm:mx-4 lg:mx-auto lg:max-w-3xl">
            {/* Title */}
            <div className="flex items-center justify-center mb-10 sm:mb-12 lg:mb-16 fade-in">
                <div 
                    className="flex-1 h-0.5 max-w-[120px] sm:max-w-[180px]"
                    style={{ background: 'linear-gradient(to left, #e6e6e6, #ffffff)' }}
                ></div>
                <h2 
                    className="px-4 sm:px-6 text-sm sm:text-base tracking-[0.3em] sm:tracking-[0.4em] text-gray-400 font-semibold uppercase"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                    TOP RANKED PLAYERS
                </h2>
                <div 
                    className="flex-1 h-0.5 max-w-[120px] sm:max-w-[180px]"
                    style={{ background: 'linear-gradient(to right, #e6e6e6, #ffffff)' }}
                ></div>
            </div>

            {isLoading ? (
                // Loading skeleton
                <div className="flex justify-center items-end gap-4 mb-6 animate-pulse">
                    <div className="w-1/3 flex flex-col items-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full mb-2"></div>
                        <div className="h-24 w-full bg-gray-300 rounded-t-lg"></div>
                    </div>
                    <div className="w-1/3 flex flex-col items-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full mb-2"></div>
                        <div className="h-32 w-full bg-gray-300 rounded-t-lg"></div>
                    </div>
                    <div className="w-1/3 flex flex-col items-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full mb-2"></div>
                        <div className="h-20 w-full bg-gray-300 rounded-t-lg"></div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Podium Display */}
                    <div className="flex justify-center items-end gap-2 sm:gap-3 lg:gap-4 mb-6 px-2">
                        {displayOrder.map((player, displayIndex) => {
                            const actualRank = displayIndex === 0 ? 1 : displayIndex === 1 ? 0 : 2;
                            const rankNumber = actualRank + 1;
                            
                            return (
                                <div key={player.user_id} className="flex-1 flex flex-col items-center">
                                    {/* Rank badge with optional crown */}
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
                                            <img
                                                src={verifiedBadgeImg}
                                                alt="Verified player"
                                                className="w-6 h-6 sm:w-7 sm:h-7 verified-badge"
                                            />
                                        </div>
                                        
                                        {/* Avatar circle with green dashed border */}
                                        <div 
                                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center relative z-10"
                                            style={{
                                                padding: '6px'
                                            }}
                                        >
                                            {/* SVG dashed border */}
                                            <svg 
                                                className="absolute inset-0 w-full h-full"
                                                style={{ zIndex: 0 }}
                                            >
                                                <circle
                                                    cx="50%"
                                                    cy="50%"
                                                    r="calc(50% - 3px)"
                                                    fill="none"
                                                    stroke="#059669"
                                                    strokeWidth="3"
                                                    strokeDasharray="12 8"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div 
                                                className={`${getAvatarColor(actualRank)} w-full h-full rounded-full flex items-center justify-center shadow-lg relative z-10 overflow-hidden`}
                                            >
                                                {player.profile_picture ? (
                                                    <img 
                                                        src={player.profile_picture} 
                                                        alt={player.name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white font-bold text-xl sm:text-2xl lg:text-3xl relative z-10" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
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
                                            className="sm:text-sm text-gray-500"
                                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '10px' }}
                                        >
                                            {(player.zen_score || player.rating || 0).toFixed(0)} zen score
                                        </p>
                                </div>

                                    {/* Podium bar */}
                                    <div 
                                        className={`${getPodiumColor(actualRank)} ${getPodiumHeight(actualRank)} podium-glow-${rankNumber} w-full rounded-t-xl transition-all duration-300 hover:scale-105 podium-card`}
                                    ></div>
                                </div>
                            );
                        })}
                                </div>

                    {/* Footer with player count and view all button */}
                    <div 
                        className="flex justify-between items-center px-4 py-3 rounded-lg shadow-sm fade-in"
                        style={{ background: 'linear-gradient(to right, #e6e6e6, #ffffff)' }}
                    >
                        <span 
                            className="text-sm sm:text-base font-bold text-gray-700"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                        >
                            +{totalPlayers} Players
                        </span>
                        <button
                            onClick={() => {
                                navigate('/leaderboard');
                                Mixpanel.track('view_full_leaderboard_clicked', {user_id: userId});
                            }}
                            className="flex items-center gap-2 text-sm sm:text-base text-green-600 font-semibold hover:text-green-700 transition-colors cursor-pointer"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                        >
                            View full leaderboard
                            <svg 
                                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                            </div>
                </>
                    )}
        </div>
    )
}

export default LeaderboardHome;