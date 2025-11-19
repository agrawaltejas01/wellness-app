import { useEffect, useState } from "react";
import BookedSlot from "../../components/booked-slot";
import PlayersLoadingComponent from "../../components/coplayers-loading";
import Loader from "../../components/Loader";
import SkillCapsule from "../../components/skill-capsule";
import { getCoplayers } from "../../apis/gym/activities";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import RatingBadge from "../../utils/rating-badge";
import { InfoCircleOutlined } from "@ant-design/icons";
import { CenterModal } from "../profile/center-modal";

const CoplayerCard = ( {players, loading, spotsLeft, spotsTotal}: {players: any[], loading: boolean, spotsLeft: number, spotsTotal: number} ) => {

    const userId = window.localStorage["zenfitx-user-details"] ? JSON.parse(window.localStorage["zenfitx-user-details"]).id : null;
    const [showZBRInfoModal, setShowZBRInfoModal] = useState(false);
    if(loading) {
        return (
           <PlayersLoadingComponent />
        )
    } else {
        // if(userId == null) {
        //     return (
        //         <div className="flex items-center justify-center shadow-gray rounded-xl mx-8 my-4 px-4 py-8">
        //             <h1 className="text-sm font-semibold">Please login to see your coplayers</h1>
        //         </div>
        //     )
        // } else 
    if(players.length > 0) {
        return (
            <div className="flex-col items-center justify-between shadow-gray rounded-xl mx-4 my-3 ">
                <div className="flex-col items-center justify-between px-4">
                <h1 className="text-sm font-semibold pt-3"> Players ({spotsTotal - spotsLeft})</h1>
                <div className="flex flex-row gap-1">
                    <h1 className="text-xs font-normal text-#626262 pt-1 pb-1">ZBR is a verified rating assigned by ZenVision AI</h1>
                    <InfoCircleOutlined className="w-3 h-3 self-center" onClick={()=>{setShowZBRInfoModal(true)}} />
                </div>
            </div>
            {showZBRInfoModal && (
                <CenterModal
                    isOpen={showZBRInfoModal}
                    onClose={() => setShowZBRInfoModal(false)}
                    title="ZBR Games"
                    subtitle=""
                    showCloseButton={false}
                    children={<div className="flex flex-col mt-2 text-xs gap-1">
                      <span>🎯 ZBR: your verified badminton rating, assigned after your first recorded match using ZenVision AI
                      </span>
                      <span>⭐ ZBR Games: Join only if you meet the minimum ZBR needed
                      </span>
                      <span>⚪ Open Games: Anyone can join (ZBR or no ZBR)</span>
                      <span>🆕 New players: You can play only Open games first → after 1st game a verified ZBR is assigned based on your game level </span>
                    </div>}
                />
            )}
            {Array.from({length: players.length}).map((_, index) => (
                <div key={index} className="flex-col items-center justify-center">
                    <div className="flex items-center justify-between pt-4 pb-3">
                        <div className="flex items-center justify-center">
                            <h1 className="text-sm font-normal pl-4 font-jakarta"> {players[index].userId === userId ? "You" : players[index].name}</h1>
                            <h1 className="text-sm font-normal px-1 font-jakarta"> {players[index].noOfBookings > 1 ? ` +${players[index].noOfBookings - 1}` : ""}</h1>
                        </div>
                        <div className="flex items-center justify-center">
                            <h1 className="text-sm pr-2"> {players[index].noOfBookings} {players[index].noOfBookings > 1 ? "spots" : "spot"} </h1>
                            <div className="flex items-center justify-center pr-4 gap-1">
                                {Array.from({ length:  players[index].noOfBookings}).map((_, index) => (
                                    <BookedSlot key={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <hr className="border-1 border-separate border-dashed mx-4 border-gray border-spacing-16" />
                    <div className="flex items-center pt-3 px-4 pb-4 justify-between">
                        {players[index].rating && players[index].rating !== 0 ? <RatingBadge rating={players[index].rating} playerRating={true} /> : <h1 className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1"> Not rated yet </h1>}
                        <div className="flex-col items-center justify-center">
                            <h1 className="text-sm text-black font-bold text-right"> {players[index].gamesPlayed > 0 ? `${players[index].gamesPlayed - 1} ${players[index].gamesPlayed > 2 ? "Games" : "Game"}` : "No Games"} </h1>
                            <h1 className="text-sm text-gray-500 text-right"> Played on ZenfitX </h1>
                        </div>
                    </div>
                    <hr className={`${index === players.length - 1 ? "border-b-1 border-white pb-2" : "border-t-1 border-gray-200"}`} />
                </div>
            ))}
        </div>
        )
    } else {
            return (
                // <div className="flex items-center justify-center shadow-gray rounded-xl mx-8 my-4 px-4 py-8">
                //     {/* <h1 className="text-sm font-semibold">Be the first to book this batch</h1> */}
                // </div>
                <div></div>
            )
        }
    }
}

export default CoplayerCard;
