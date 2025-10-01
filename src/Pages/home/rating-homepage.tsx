import { useEffect, useState } from "react";
import IUser from "../../types/user";
import {ReactComponent as Growth} from "../../images/home/growth.svg"


const NoRating = () => {
    return (
        <div className="flex flex-col gap-2 items-center justify-center mt-2">
            <Growth />
            <div className="flex flex-row gap-2 rounded-full bg-white p-2">
                <div className="flex flex-col text-black text-xs pl-4 pr-2 items-center">
                    <div className="text-2xl">-</div>
                    <div className="font-extralight">Rating</div>
                </div> 
                <div className="border-r border-gray-300" />
                <div className="flex flex-col text-black text-xs pr-4 pl-2 items-center">
                    <div className="text-2xl">🔒</div>
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
            <div className="flex flex-row rounded-full p-2 w-full items-center justify-center" style={{'background': '#009605'}}>
                <span className="text-xs text-white px-2">Book New Game</span>
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
                <button className="rounded-full p-2 w-full items-center justify-center bg-white text-black border border-black border-dashed">Book New Game</button>
            </div>
        </div>
    )
}

const RatingHomepage: React.FC<{userDetails: IUser}> = ({userDetails}) => {

    const [rating, setRating] = useState(0);
    const [games, setGames] = useState(0);

    useEffect(() => {
        if(Math.random() > 0.5) {
            setRating(Math.floor(Math.random() * 5) + 1);
            setGames(Math.floor(Math.random() * 10) + 1);
        } else {
            setRating(0);
            setGames(0);
        }
    }, [userDetails]);



    return (
        <div className="rounded-2xl p-2 border border-white" style={{'background': 'linear-gradient(to right, rgba(199, 255, 202, 1), rgba(238, 255, 183, 1))'}}>
            {rating === 0 ? <NoRating /> : <Rating rating={rating} games={games} />}
        </div>
    )
}

export default RatingHomepage;