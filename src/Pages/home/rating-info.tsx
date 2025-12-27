import React from "react";

const RatingInfo: React.FC = () => {
    return (
        <div className="flex flex-col gap-2 text-xs mt-2">
            <ul>
                <li className="py-1">🔢 <span className="pl-2 font-bold"> Scale:</span> 1.00 - 10.00</li>
                <li className="py-1">
                    <div className="pl-2">
                        <div className="overflow-x-auto">
                            <table className="text-xs border-collapse w-auto border border-gray-300 bg-gray-50 rounded-md">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-center py-1 px-3 font-bold">Rating Range</th>
                                        <th className="text-center py-1 px-3 font-bold">Skill Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-200">
                                        <td className="text-center py-1 px-3">1-2.49</td>
                                        <td className="text-center py-1 px-3">Beginner</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="text-center py-1 px-3">2.5-3.99</td>
                                        <td className="text-center py-1 px-3">Amateur</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="text-center py-1 px-3">4-5.49</td>
                                        <td className="text-center py-1 px-3">Intermediate</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="text-center py-1 px-3">5.5-6.99</td>
                                        <td className="text-center py-1 px-3">Intermediate+</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="text-center py-1 px-3">7-8.49</td>
                                        <td className="text-center py-1 px-3">Advance</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="text-center py-1 px-3">8.5-9</td>
                                        <td className="text-center py-1 px-3">Advance+</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="text-center py-1 px-3">9-9.49</td>
                                        <td className="text-center py-1 px-3">Pro</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center py-1 px-3">9.5-10</td>
                                        <td className="text-center py-1 px-3">Pro+</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </li>
                <li className="py-1">🎥 <span className="pl-1 font-bold">From recorded matches: </span> we update your rating from video analysis using <b>ZenVision AI</b> - your <b>score</b> + an estimate of your <b>on-court skill</b></li>
                <li className="py-1">🔍 <span className="pl-1 font-bold">How it works:</span>You are evaluated on multiple factors such as shot quality, court coverage, and overall gameplay to generate your ZenfitX Badminton Rating (ZBR) — a skill-level rating.
                <li className="py-1">Your ZBR updates only when your actual gameplay improves or declines against rated opponents, based on your recorded matches analyzed using ZenVision AI.</li>
                <li className="py-1"><span className="pl-1 font-bold">Utility:</span> ZBR unlocks access to Verified Level Games (e.g., “ZBR 5 Required”).</li>
                    {/* <ul className="list-disc pl-6">     */}
                        {/* <li> <span className="font-bold">⬆️ Beat expectations?</span> your rating goes up</li>
                        <li> <span className="font-bold">⬇️ Fall short?</span> your rating goes down</li>
                        <li> <span className="font-bold">📈 Close loss?</span> you can still move up if you exceeded expectations</li>
                        <li> <span className="font-bold">🆕 When you see it:</span> after your first recorded match</li>
                    </ul> */}
                
                </li>
            </ul>
        </div>
    )
}

// const RatingInfo = () => {
//     return (
//         <div className="flex flex-col gap-2 text-xs mt-2 max-w-md">
//             <span>
//                 ZenfitX has upgraded partnered venues into Smart Courts. 
//                 Our cameras capture your game, and ZenVision AI transforms it into a full pro experience: giving you the same broadcast vibe as athletes on TV.
//             </span>
//             <span>
//             What this means for you:
//             </span>
//             <span>
//                 🎥 <b>Your Highlights:</b> Get auto-edited clips of your best shots. No recording needed, just play.
//             </span>
//             <span>
//                 ⭐️ <b>ZBR (Game Level & Rating):</b> ZenfitX Badminton Rating reveals your true skill. ZenVision AI analyzes your gameplay to give you a rating and a daily score post your first game.
//             </span>
//             <ul className="list-disc pl-3">
//                 <li>Compete: Climb the community leaderboard.</li>
//                 <li>Unlock: Use your ZBR to join exclusive, skill-matched games for better competition.</li>
//             </ul>
//             <span>
//                 🧠 <b>Stats & Analysis:</b> Understand exactly how you played. From shot quality to court coverage, ZenVision AI turns video data into your personalized improvement plan.
//             </span>
//         </div>
//     )
// }

export default RatingInfo;