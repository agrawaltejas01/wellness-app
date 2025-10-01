import { useEffect, useState } from "react";
import IUser from "../../types/user";
import {ReactComponent as Growth} from "../../images/home/growth.svg"
import { navigate } from "@reach/router";
import { useMutation } from "@tanstack/react-query";
import { getRatings } from "../../apis/ratings/ratings";
import { getGamesPlayed } from "../../apis/games/games";


const NoRating = ({games}: {games: number}) => {
    return (
        <div className="flex flex-col gap-2 items-center justify-center mt-2">
            <Growth />
            <div className="flex flex-row gap-2 rounded-full bg-white p-2">
                <div className="flex flex-col text-black text-xs pl-4 pr-2 items-center">
                    <div className="text-2xl">🔒</div>
                    <div className="font-extralight">Rating</div>
                </div> 
                <div className="border-r border-gray-300" />
                <div className="flex flex-col text-black text-xs pr-4 pl-2 items-center">
                    <div className="text-2xl">{games}</div>
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
                <button className="rounded-full p-2 w-full items-center justify-center text-white"style={{'background': '#009605'}}  onClick={()=>navigate('/badminton')}>Book New Game</button>
            </div>  
        </div>
    )
}

const Rating = ({rating, games}: {rating: number, games: number}) => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center mt-4">
            <div className="flex flex-row gap-4 ">
                <div className="flex flex-col text-black text-xs pl-4 pr-2 items-center">
                    <div className="text-2xl">{rating}</div>    
                    <div className="font-extralight">Rating</div>
                </div> 
                <div className="border-r border-gray" />
                <div className="flex flex-col text-black text-xs pr-4 pl-2 items-center">
                    <div className="text-2xl">{games}</div>
                    <div className="font-extralight">Games</div>
                </div>
            </div>
            <div className="w-full">
                <button className="rounded-full p-2 w-full items-center justify-center bg-white text-black border border-black border-dashed" onClick={()=>navigate('/badminton')}>Book New Game</button>
            </div>
        </div>
    )
}

const RatingHomepage: React.FC<{userDetails: IUser}> = ({userDetails}) => {

    const [rating, setRating] = useState(0);
    const [games, setGames] = useState(0);

    const { mutate: _getRatings } = useMutation({
        mutationFn: getRatings,
        onSuccess: (result) => {
            setRating(result.rating.rating);
        }
    });

    const { mutate: _getGamesPlayed } = useMutation({
        mutationFn: getGamesPlayed,
        onSuccess: (result) => {
            setGames(result.gamesPlayedCount);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    useEffect(() => {
        _getRatings(userDetails?.id as number);
        _getGamesPlayed(userDetails?.id as number);
    }, [userDetails]);



    return (
        <div className="rounded-2xl p-2 border border-white" style={{'background': 'linear-gradient(to right, rgba(199, 255, 202, 1), rgba(238, 255, 183, 1))'}}>
            {rating === 0 ? <NoRating games={games} /> : <Rating rating={rating} games={games} />}
        </div>
    )
}

export default RatingHomepage;