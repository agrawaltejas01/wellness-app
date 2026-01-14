import { useEffect, useState, useRef } from "react";
import IUser from "../../types/user";
import {ReactComponent as Growth} from "../../images/home/growth.svg"
import { navigate } from "@reach/router";
import { useMutation } from "@tanstack/react-query";
import { getRatings } from "../../apis/ratings/ratings";
import { getGamesPlayed } from "../../apis/games/games";
import {ReactComponent as Plus} from "../../images/utils/plus.svg"
import {ReactComponent as PlusWhite} from "../../images/utils/plus-white.svg"
import {ReactComponent as InfoCircleOutlined} from "../../images/utils/info.svg"
import RatingInfo from "./rating-info";
import { CenterModal } from "../profile/center-modal";
import { Mixpanel } from "../../mixpanel/init";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import videoImg from "../../images/home/video.png";
import video2Img from "../../images/home/video-2.png";
import verifiedBadgeImg from "../../images/home/verified-badge.png";
import playerImg from "../../images/home/player.png";
import RatingBadgeHomeScreen from "../../utils/rating-badge-homescreen";
import ZenScoreCard from "./zen-score-card";
import highlightImage from "../../images/home/highlight.jpeg";
import {ReactComponent as RightArrow} from "../../images/home/right-arrow.svg";
import { getHighlights } from "../../apis/highlights/highlights";
import Highlights from "./highlights";


const RatingLoadingSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 mt-4 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto">
            <div className="flex flex-row gap-4 md:gap-6 lg:gap-8">
                <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 w-full">
                    <div className="rounded-3xl bg-gray-200 h-48 animate-pulse" />
                    <div className="rounded-full bg-gray-200 h-16 animate-pulse" />
                </div>
                <div className="hidden md:block flex-1">
                    <div className="rounded-2xl bg-gray-200 h-full min-h-[260px] animate-pulse" />
                </div>
            </div>
        </div>
    );
};

const NoRating = ({games, isLoadingGames}: {games: number, isLoadingGames: boolean}) => {
    const [isRatingInfoModalOpen, setIsRatingInfoModalOpen] = useState(false);
    const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');

    return (
        <div className="flex flex-col items-center justify-center">
            {/* <Growth />
            <div className="flex flex-row gap-2 rounded-full bg-white p-2">
                <div className="flex flex-col text-black text-xs pl-4 pr-2 items-center" onClick={() => {setIsRatingInfoModalOpen(true); Mixpanel.track("open_rating_info_modal", {user_id: userDetails.id})}}>
                    <div className="text-2xl">🔒</div>
                    <div className="font-extralight">Rating</div>
                </div> 
                <div className="border-r border-gray-300" />
                <div className={`flex flex-col text-black text-xs pr-4 pl-2 items-center ${isLoadingGames ? 'animate-pulse-slow' : ''}`}>
                    <div className="text-2xl">{isLoadingGames ? '...' : games}</div>
                    <div className="font-extralight">Games</div>
                </div>
            </div>
            <div className="flex flex-col items-center"> 
                <div className="flex flex-row" >
                    <span className="font-bold text-base">Unlock your Zen Rating!</span>
                    <InfoCircleOutlined className="w-4 h-4 self-center ml-1" onClick={()=>setIsRatingInfoModalOpen(true)}/>
                </div>  
                <div className="flex flex-row ">
                    <span className="font-extralight text-sm">Track, Improve & Play smartly with ZenVision AI</span>
                </div>
            </div> */}
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <span className="italic" style={{ fontSize: '16px', color: '#4C4C4C' }}>Unlock the Pro Experience</span>
                    <div className="flex flex-row items-center">
                        <span className="italic" style={{ fontSize: '16px', color: '#4C4C4C' }}>with ZenVision AI</span>
                        <InfoCircleOutlined className="w-3.5 h-3.5 self-center ml-1" onClick={()=>setIsRatingInfoModalOpen(true)} />
                    </div>
                </div>
                <div className="flex flex-row">
                    <span className="font-bold" style={{ fontSize: '24px', color: '#4C4C4C' }}>Book your first game</span>
                </div>
            </div>
            <div className="mt-2 w-full">
                <style>{`
                    .rating-carousel .carousel .slide {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .rating-carousel .carousel .slider-wrapper {
                        margin: 0 !important;
                    }
                `}</style>
                
                {/* Mobile View - Carousel */}
                <div className="block md:hidden w-full flex justify-center py-2">
                    <div className="relative w-full mx-6 bg-white rounded-2xl shadow-[0_6px_18px_rgba(0,0,0,0.15)] flex flex-col justify-between min-h-[240px] overflow-hidden">
                        <Carousel
                            className="rating-carousel"
                            showArrows={false}
                            showIndicators={true}
                            showThumbs={false}
                            swipeable={true}
                            autoPlay={true}
                            interval={3000}
                            infiniteLoop={true}
                            renderIndicator={(onClickHandler, isSelected, index, label) => {
                                const defStyle = {
                                    display: "inline-block",
                                    borderRadius: "50%",
                                    background: isSelected ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.2)",
                                    width: "6px",
                                    height: "6px",
                                    marginLeft: "4px",
                                    cursor: "pointer",
                                    marginBottom: "6px"
                                };
                                return (
                                    <span
                                        style={defStyle}
                                        onClick={onClickHandler}
                                        onKeyDown={onClickHandler}
                                        key={index}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`${label} ${index + 1}`}
                                    />
                                );
                            }}
                        >
                            {[
                                {
                                    title: "Get your game highlights",
                                    subtitle: "Your best shots auto-captured",
                                    img: (
                                        <>
                                            <img 
                                                src={videoImg} 
                                                alt="Video" 
                                                className="w-32 h-32 object-contain"
                                            />
                                            <img 
                                                src={video2Img} 
                                                alt="Video 2" 
                                                className="absolute w-24 h-24 object-contain"
                                                style={{ bottom: 0, left: 0, transform: 'translate(-10%, -10%)' }}
                                            />
                                        </>
                                    )
                                },
                                {
                                    title: "Unlock your verified badge & ZBR",
                                    subtitle: "AI analyzes your game to rate you",
                                    img: (
                                        <img 
                                            src={verifiedBadgeImg} 
                                            alt="Verified Badge" 
                                            className="w-24 h-24 object-contain"
                                        />
                                    )
                                },
                                {
                                    title: "Track your game & improve",
                                    subtitle: "Insights by ZenVision AI coach",
                                    img: (
                                        <img 
                                            src={playerImg} 
                                            alt="Player" 
                                            className="w-40 h-40 object-contain"
                                        />
                                    )
                                }
                            ].map((card, index) => (
                                <div key={index} className="relative w-full min-h-[180px] text-left">
                                    <div className="absolute top-0 right-0">
                                        {card.img}
                                    </div>
                                    <div className="relative w-full pt-4 pr-4 pl-4 pb-2">
                                        <div className="flex flex-col items-start mt-2 w-2/3 text-left">
                                            <div className="text-black font-bold leading-tight mb-2" style={{ fontSize: '20px', fontFamily: "Plus Jakarta Sans" }}>
                                                {card.title}
                                            </div>
                                            <div className="text-gray-500 font-light" style={{ fontSize: '12px', fontFamily: "Plus Jakarta Sans" }}>
                                                {card.subtitle}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                        <div className="w-full z-10 p-4 pt-0 mt-auto">
                            <div 
                                className="rounded-full p-3 w-full flex items-center justify-center text-white bg-[#009605]" 
                                style={{ borderBottom: "2px solid #000000" }}
                                onClick={()=>{navigate('/badminton'); Mixpanel.track('book_badminton_clicked', {user_id: userDetails.id})}}
                            >
                                <div className="flex flex-row justify-center gap-2 items-center">
                                    <PlusWhite className="w-5 h-5"/>
                                    <span className="font-bold" style={{ fontSize: '16px' }}>Book Badminton</span>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>

                {/* Desktop View - 3 Cards */}
                <div className="hidden md:flex w-full justify-center gap-6 py-2">
                    {[
                        {
                            title: "Get your game highlights",
                            subtitle: "Best shots & rallies auto-captured",
                            img: (
                                <>
                                    <img 
                                        src={videoImg} 
                                        alt="Video" 
                                        className="w-32 h-32 object-contain"
                                        style={{ objectPosition: 'top right' }}
                                    />
                                    <img 
                                        src={video2Img} 
                                        alt="Video 2" 
                                        className="absolute w-24 h-24 object-contain"
                                        style={{ bottom: 0, left: 0, transform: 'translate(-10%, -20%)' }}
                                    />
                                </>
                            )
                        },
                        {
                            title: "Track your game & improve",
                            subtitle: "with ZenVision AI coach",
                            img: (
                                <img 
                                    src={playerImg} 
                                    alt="Player" 
                                    className="w-40 h-40 object-contain object-right"
                                />
                            )
                        },
                        {
                            title: "Unlock your verified badge & ZBR",
                            subtitle: "Join verified players community & compete on leaderboards",
                            img: (
                                <img 
                                    src={verifiedBadgeImg} 
                                    alt="Verified Badge" 
                                    className="w-24 h-24 object-contain"
                                />
                            )
                        }
                    ].map((card, index) => (
                        <div key={index} className="relative w-80 bg-white rounded-2xl shadow-[0_6px_18px_rgba(0,0,0,0.15)] flex flex-col justify-between min-h-[240px] overflow-hidden">
                            <div className="absolute top-0 right-0">
                                {card.img}
                            </div>
                            <div className="relative w-full flex-grow p-4">
                                <div className="flex flex-col items-start mt-8 w-2/3 text-left">
                                    <div className="text-black font-bold leading-tight mb-2" style={{ fontSize: '20px' }}>
                                        {card.title}
                                    </div>
                                    <div className="text-gray-500 text-xs font-light">
                                        {card.subtitle}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mt-4 z-10 p-4 pt-0">
                                <div 
                                    className="rounded-full p-3 w-full flex items-center justify-center text-white bg-[#009605]" 
                                    style={{ borderBottom: "2px solid #000000" }}
                                    onClick={()=>{navigate('/badminton'); Mixpanel.track('book_badminton_clicked', {user_id: userDetails.id})}}
                                >
                                    <div className="flex flex-row justify-center gap-2 items-center">
                                        <PlusWhite className="w-4 h-4"/>
                                        <span className="font-bold" style={{ fontSize: '16px' }}>Book Badminton</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className="w-full">
                <div className="rounded-full mt-2 p-2 w-full items-center justify-center text-black"style={{'background': 'white'}}  onClick={()=>{navigate('/badminton'); Mixpanel.track('book_badminton_clicked', {user_id: userDetails.id})}}>
                    <div className="flex flex-row justify-center gap-1">
                        <Plus />
                        Book Badminton
                    </div>
                </div>
            </div>   */}
            <CenterModal
                isOpen={isRatingInfoModalOpen}
                onClose={()=>setIsRatingInfoModalOpen(false)}
                title="How it works?"
                subtitle=""
                children={<RatingInfo />}
            />
        </div>
    )
}

const Rating = ({rating, zenScore, zenRank, games, totalCount, previousRank, previousZenScore, isLoadingRating, isLoadingGames}: {rating: number, zenScore: number, zenRank: number, games: number, totalCount: number, previousRank: number, previousZenScore: number, isLoadingRating: boolean, isLoadingGames: boolean}) => {
    const [isRatingInfoModalOpen, setIsRatingInfoModalOpen] = useState(false);
    const [leftComponentHeight, setLeftComponentHeight] = useState<number | null>(null);
    const zenScoreCardRef = useRef<HTMLDivElement>(null);
    const ratingBadgeRef = useRef<HTMLDivElement>(null);
    const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
    const [videoHighlights, setVideoHighlights] = useState<any[]>([]);

    const { mutate: _getHighlights } = useMutation({
        mutationFn: getHighlights,
        onSuccess: (result) => {
            if(result && result.length > 0) {
                setVideoHighlights(result);
            }
        },
    });
    
    useEffect(() => {
        _getHighlights(userDetails?.id as string);
    }, []);

    useEffect(() => {
        const updateHeight = () => {
            if (zenScoreCardRef.current && ratingBadgeRef.current) {
                const zenScoreHeight = zenScoreCardRef.current.offsetHeight;
                const ratingBadgeHeight = ratingBadgeRef.current.offsetHeight;
                const gap = 16; // gap-4 = 1rem = 16px
                const totalHeight = zenScoreHeight + ratingBadgeHeight + gap;
                setLeftComponentHeight(totalHeight);
            }
        };

        // Initial measurement with a small delay to ensure DOM is ready
        const timeoutId = setTimeout(updateHeight, 0);

        // Update on window resize
        window.addEventListener('resize', updateHeight);

        // Use ResizeObserver for more accurate measurements when content changes
        const resizeObserver = new ResizeObserver(updateHeight);
        if (zenScoreCardRef.current) {
            resizeObserver.observe(zenScoreCardRef.current);
        }
        if (ratingBadgeRef.current) {
            resizeObserver.observe(ratingBadgeRef.current);
        }

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateHeight);
            resizeObserver.disconnect();
        };
    }, [zenScore, zenRank, rating]);



    return (
        isLoadingRating || isLoadingGames ? <RatingLoadingSkeleton /> :
        <div className="flex flex-col gap-4 justify-between mt-4 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto">
            <div className={`flex flex-row gap-4 md:gap-6 lg:gap-8 ${videoHighlights.length === 0 ? 'justify-center' : ''}`}>
                <div className={`flex flex-col gap-4 md:gap-5 lg:gap-6 w-1/2`}>
                    <div ref={zenScoreCardRef}>
                        <ZenScoreCard zenScore={zenScore} zenRank={zenRank} totalRank={totalCount} previousRank={previousRank} previousZenScore={previousZenScore} />
                    </div>
                    <div ref={ratingBadgeRef}>
                        <RatingBadgeHomeScreen rating={rating} />
                    </div>
                </div>
                <Highlights leftComponentHeight={leftComponentHeight || 0} videoHighlights={videoHighlights} />
            </div> 
            <div className="w-full z-10 pt-0 mt-auto">
                <div 
                    className="rounded-full p-3 w-full flex items-center justify-center text-white bg-[#009605]" 
                    style={{ borderBottom: "2px solid #000000" }}
                    onClick={()=>{navigate('/badminton'); Mixpanel.track('book_badminton_clicked', {user_id: userDetails.id})}}
                >
                    <div className="flex flex-row justify-center gap-2 items-center">
                        <PlusWhite className="w-5 h-5"/>
                        <span className="font-bold" style={{ fontSize: '16px' }}>Book Badminton</span>
                    </div>
                </div>  
            </div>
            <CenterModal
                isOpen={isRatingInfoModalOpen}
                onClose={()=>setIsRatingInfoModalOpen(false)}
                title="Rating (ZBR) - Quick Guide"
                subtitle="ZenfitX Badminton Rating"
                children={<RatingInfo />}
            />
        </div>
    )
}

const RatingHomepage: React.FC<{userDetails: IUser}> = ({userDetails}) => {

    const [rating, setRating] = useState(0);
    const [zenScore, setZenScore] = useState(0);
    const [zenRank, setZenRank] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [games, setGames] = useState(0);
    const [isLoadingRating, setIsLoadingRating] = useState(true);
    const [isLoadingGames, setIsLoadingGames] = useState(true);
    const [previousRank, setPreviousRank] = useState(3);
    const [previousZenScore, setPreviousZenScore] = useState(200);
    
    const { mutate: _getRatings } = useMutation({
        mutationFn: getRatings,
        onSuccess: (result) => {
            console.log(result);
            setRating(result.rating.Rating.rating || 0);
            setIsLoadingRating(false);
            setZenScore(result.rating.Rating.zenScore || 0);
            setZenRank(result.rating.rank || 0);
            setTotalCount(result.rating.total_count || 0);
            // setPreviousRank(result.rating.previous_rank || 0);
            // setPreviousZenScore(result.rating.previous_zen_score || 0);
        },
        onError: () => {
            setIsLoadingRating(false);
        }
    });

    const { mutate: _getGamesPlayed } = useMutation({
        mutationFn: getGamesPlayed,
        onSuccess: (result) => {
            setGames(result.gamesPlayedCount);
            setIsLoadingGames(false);
        },
        onError: (error) => {
            console.log(error);
            setIsLoadingGames(false);
        }
    });

    useEffect(() => {
        _getRatings(userDetails?.id as number);
        _getGamesPlayed(userDetails?.id as number);
    }, [userDetails]);



    const isLoading = isLoadingRating || isLoadingGames;

    return (
        <div className="mt-2 pb-2 w-full" style={{ background: 'linear-gradient(to top, #E3F6E4, #FFFFFF)' }}>
            {!isLoadingRating && rating === 0 ? <NoRating games={games} isLoadingGames={isLoadingGames} /> : <Rating rating={rating} zenScore={zenScore} zenRank={zenRank} games={games} totalCount={totalCount} previousRank={previousRank} previousZenScore={previousZenScore} isLoadingRating={isLoadingRating} isLoadingGames={isLoadingGames} />}
            {/* <NoRating games={games} isLoadingGames={isLoadingGames} /> */}
        </div>
    )
}

export default RatingHomepage;