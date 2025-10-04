import { useEffect, useState } from "react";
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


const NoRating = ({games, isLoadingGames}: {games: number, isLoadingGames: boolean}) => {
    return (
        <div className="flex flex-col gap-2 items-center justify-center mt-2">
            <Growth />
            <div className="flex flex-row gap-2 rounded-full bg-white p-2">
                <div className="flex flex-col text-black text-xs pl-4 pr-2 items-center">
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
                    <span className="font-bold text-base font-sans">Get your SESH analysis</span>
                </div>  
                <div className="flex flex-row ">
                    <span className="font-extralight text-sm">Learn & improve your game with us</span>
                </div>
            </div>
            <div className="w-full">
                <div className="rounded-full p-2 w-full items-center justify-center text-white"style={{'background': '#009605'}}  onClick={()=>navigate('/badminton')}>
                    <div className="flex flex-row justify-center gap-1">
                        <PlusWhite />
                        Book New Game
                    </div>
                </div>
            </div>  
        </div>
    )
}

const Rating = ({rating, games, isLoadingRating, isLoadingGames}: {rating: number, games: number, isLoadingRating: boolean, isLoadingGames: boolean}) => {
    const [isRatingInfoModalOpen, setIsRatingInfoModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4 items-center justify-center mt-4">
            <div className="flex flex-row gap-4">
                <div className={`flex flex-col text-black text-xs pl-4 pr-2 items-center ${isLoadingRating ? 'animate-pulse-slow' : ''}`}>
                    <div className="flex flex-row gap-1">
                        <div className="text-6xl">{isLoadingRating ? '...' : rating/100}</div>
                        {/* <div className="text-2xl self-center">/10</div> */}
                    </div>
                    <div className="flex flex-row gap-1">
                    <div className="font-extralight">
                        Rating
                    </div>
                        <InfoCircleOutlined className="w-3 h-3 self-center" onClick={()=>setIsRatingInfoModalOpen(true)} />
                    </div>
                </div> 
                <div className="border-r border-gray" />
                <div className={`flex flex-col text-black text-xs pr-4 pl-2 items-center ${isLoadingGames ? 'animate-pulse-slow' : ''}`}>
                    <div className="text-6xl">{isLoadingGames ? '...' : games}</div>
                    <div className="font-extralight">Games</div>
                </div>
            </div>
            <div className="w-full" onClick={()=>navigate('/badminton')}>
                <div className="rounded-full p-2 w-full items-center justify-center bg-white text-black border border-black border-dashed">
                    <div className="flex flex-row justify-center gap-1 p-1">
                        <Plus />
                        <span className="font-light">Book New Game</span>
                    </div>
                </div>
            </div>
            <CenterModal
                isOpen={isRatingInfoModalOpen}
                onClose={()=>setIsRatingInfoModalOpen(false)}
                title="Rating Info"
                children={<RatingInfo />}
            />
        </div>
    )
}

const RatingHomepage: React.FC<{userDetails: IUser}> = ({userDetails}) => {

    const [rating, setRating] = useState(0);
    const [games, setGames] = useState(0);
    const [isLoadingRating, setIsLoadingRating] = useState(true);
    const [isLoadingGames, setIsLoadingGames] = useState(true);

    const { mutate: _getRatings } = useMutation({
        mutationFn: getRatings,
        onSuccess: (result) => {
            setRating(result.rating.rating);
            setIsLoadingRating(false);
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
        <div className={`mx-4 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.2)] p-2 border border-white bg-white ${isLoading ? 'animate-pulse-slow' : ''}`}>
            {!isLoadingRating && rating === 0 ? <NoRating games={games} isLoadingGames={isLoadingGames} /> : <Rating rating={rating} games={games} isLoadingRating={isLoadingRating} isLoadingGames={isLoadingGames} />}
        </div>
    )
}

export default RatingHomepage;