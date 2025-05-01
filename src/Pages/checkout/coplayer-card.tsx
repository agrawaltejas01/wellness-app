import { useEffect, useState } from "react";
import BookedSlot from "../../components/booked-slot";
import PlayersLoadingComponent from "../../components/coplayers-loading";
import Loader from "../../components/Loader";
import SkillCapsule from "../../components/skill-capsule";
import { getCoplayers } from "../../apis/gym/activities";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";

const CoplayerCard = ( {players, loading, spotsLeft, spotsTotal}: {players: any[], loading: boolean, spotsLeft: number, spotsTotal: number} ) => {

    const userId = window.localStorage["zenfitx-user-details"] ? JSON.parse(window.localStorage["zenfitx-user-details"]).id : null;

    if(loading) {
        return (
           <PlayersLoadingComponent />
        )
    } else {
        if(userId == null) {
            return (
                <div className="flex items-center justify-center shadow-gray rounded-xl mx-8 my-4 px-4 py-8">
                    <h1 className="text-sm font-semibold">Please login to see your coplayers</h1>
                </div>
            )
        } else if(players.length > 0) {
        return (
            <div className="flex-col items-center justify-between shadow-gray rounded-xl mx-8 my-4 ">
                <div className="flex-col items-center justify-between px-4 py-2">
                <h1 className="text-sm font-semibold">Players ({spotsTotal - spotsLeft})</h1>
                <h1 className="text-xs text-gray-500">Levels are marked by the players.</h1>
            </div>
            {Array.from({length: players.length}).map((_, index) => (
                <div key={index} className="flex-col items-center justify-center">
                    <div className="flex items-center justify-between px-4 py-2">
                        <div className="flex items-center justify-center">
                            <h1 className="text-sm"> {players[index].userId === userId ? "You" : players[index].name}</h1>
                            <h1 className="text-sm px-1"> {players[index].noOfBookings > 1 ? ` +${players[index].noOfBookings - 1}` : ""}</h1>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <h1 className="text-sm"> {players[index].noOfBookings} spots </h1>
                            <div className="flex items-center justify-center gap-1">
                                {Array.from({ length:  players[index].noOfBookings}).map((_, index) => (
                                    <BookedSlot key={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <hr className="border-1 border-separate border-dashed mx-4 border-gray border-spacing-16" />
                    <div className="flex items-center px-4 py-4 pb-4 justify-between">
                        {players[index].level && players[index].level !== 'UNKNOWN' ? <h1 className="text-xs text-gray-500"> <SkillCapsule level={players[index].level} /> </h1> : <h1 className="text-xs text-gray-500"> </h1>}
                        <div className="flex-col items-center justify-center gap-2">
                            <h1 className="text-sm text-black font-bold text-right"> {players[index].gamesPlayed > 0 ? `${players[index].gamesPlayed} Games` : "No Games"} </h1>
                            <h1 className="text-sm text-gray-500 text-right"> Played On ZenfitX </h1>
                        </div>
                    </div>
                    <hr className={`${index === players.length - 1 ? "hidden" : "border-t-1 border-gray-200"}`} />
                </div>
            ))}
        </div>
        )
    } else {
        return (
            <div>
                {/* <h1>No coplayers found</h1> */}
            </div>
        )
    }
}
}

export default CoplayerCard;
