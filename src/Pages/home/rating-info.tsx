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
                <li className="py-1">🎥 <span className="pl-2 font-bold"> After each recorded match: </span> we update your rating from video analysis using <b>ZenVision AI</b> - your <b>score</b> + an estimate of your <b>on-court skill</b></li>
                <li className="py-1">🔍 <span className="pl-2 font-bold"> How it works:</span>we compare which team was <b>expected to win based on the current rating</b> (you + partner vs opponents) with what actually happened after the match
                    <ul className="list-disc pl-6">    
                        <li> <span className="font-bold">⬆️ Beat expectations?</span> your rating goes up</li>
                        <li> <span className="font-bold">⬇️ Fall short?</span> your rating goes down</li>
                        <li> <span className="font-bold">📈 Close loss?</span> you can still move up if you exceeded expectations</li>
                        <li> <span className="font-bold">🆕 When you see it:</span> after your first recorded match</li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default RatingInfo;