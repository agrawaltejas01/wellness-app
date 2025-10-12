import React from "react";

const RatingInfo: React.FC = () => {
    return (
        <div className="flex flex-col gap-2 text-xs mt-2">
            <ul>
                <li className="py-1">🔢 <span className="pl-2 font-bold"> Scale:</span> 1.00 - 10.00</li>
                <li className="py-1">🎥 <span className="pl-2 font-bold"> After each recorded match: </span> we update your rating from video analysis - your score + an estimate of your on-court skill</li>
                <li className="py-1">🔍 <span className="pl-2 font-bold"> How it works:</span> we compare what was expected (you + partner vs opponents) with what actually happened
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