import { useState } from "react";
import Circle from "../../components/circle";
import SkillCapsule, { SkillLevel } from "../../components/skill-capsule";
import { useMutation } from "@tanstack/react-query";
import { updateUserSkillLevel } from "../../apis/user/userDetails";
import { errorToast, successToast } from "../../components/Toast";
import { navigate } from "@reach/router";
import { ACTIVITY_NAME_TO_ID_MAP } from "../../constants/activities";

const skillLevels = [
    {
        id: 1,
        name: "Beginner",
        symbol: "B",
        description: "No game played before"
    },
    {
        id: 2,
        name: "Amateur",
        symbol: "A",
        description: "1+ game played before"
    },
    {
        id: 3,
        name: "Intermediate",
        symbol: "I",
        description: "3+ games played before"
    },
    {
        id: 4,
        name: "Professional",
        symbol: "P",
        description: "15+ games played before"
    }
]

const skillLevelBackgroundColorMap: Record<SkillLevel, string> = {
    'Beginner': 'rgba(107, 227, 156, 0.15)',
    'Amateur': 'rgba(255, 199, 91, 0.15)',
    'Intermediate': 'rgba(108, 160, 220, 0.15)',
    'Professional': 'rgba(156, 106, 222, 0.15)',
    'Unknown': 'rgba(0, 0, 0, 0.15)'
}

const skillLevelColor: Record<SkillLevel, string> = {
    'Beginner': '#6BE39C',
    'Amateur': '#FFC75B',
    'Intermediate': '#6CA0DC',
    'Professional': '#9C6ADE',
    'Unknown': 'black'
}

const SkillLevelInput = ({userId, activityId, batchId}: {userId: number, activityId: number, batchId: number}) => {

    const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>("UNKNOWN");

    const { mutate: _updateUserSkillLevel } = useMutation({
        mutationFn: updateUserSkillLevel,
        onSuccess: (result) => {
            successToast("Skill level updated successfully");
            localStorage.setItem(`skillLevel-${activityId}`, selectedSkillLevel.toUpperCase());
        },
        onError: (error) => {
            errorToast("Error in updating user skill level");
        },
    });

    const handleConfirm = () => {
        if(selectedSkillLevel === "UNKNOWN") {
            alert("Please select a game level");
            return;
        }
        if(userId) {
            _updateUserSkillLevel({userId, activityId, skillLevel: selectedSkillLevel.toUpperCase()});
        }
        localStorage.setItem(`skillLevel-${activityId}`, selectedSkillLevel.toUpperCase());
        const bookingUrl = `/checkout/batch/${batchId}/booking`;
        window.location.href = bookingUrl;
    }

    return (
        <div className="flex flex-col px-4 rounded-lg fixed bottom-0 w-full bg-white">    
            <div className="flex flex-row justify-between px-4 py-4 my-2 rounded-lg">
                <p className="text-lg font-bold">First tell us your game level</p>
            </div>
            {skillLevels.map((skillLevel) => (
                <div key={skillLevel.id} className="flex flex-row justify-between px-4 py-4 my-2 rounded-lg"
                     style={{ backgroundColor: skillLevelBackgroundColorMap[skillLevel.name as SkillLevel] }}
                     onClick={() => setSelectedSkillLevel(skillLevel.name)}>
                    <div className="flex flex-row gap-2">
                    <Circle
                        radius={12}
                        borderColor= {skillLevelColor[skillLevel.name as SkillLevel]}
                        borderStyle="solid"
                        backgroundColor= {skillLevelColor[skillLevel.name as SkillLevel]}
                        character={skillLevel.symbol}
                    />
                    <div style={{ fontSize: '14px', color: 'black' }} className="flex flex-col">
                        <p className="font-bold"> {skillLevel.name}</p>
                        <p>{skillLevel.description}</p>
                    </div>
                    </div>
                    <Circle
                        radius={8}
                        borderColor= "black"
                        borderStyle="solid"
                        backgroundColor= {selectedSkillLevel === skillLevel.name ? "black" : skillLevelBackgroundColorMap[skillLevel.name as SkillLevel]}
                        character=''
                    />
                </div>
            ))}
            <hr className="my-4" />
            <div className="flex flex-row px-4 my-2 rounded-lg pb-2">
                <button className="bg-black font-bold text-md text-white px-4 py-2 rounded-lg w-full text-center" onClick={handleConfirm}>Confirm</button>
            </div>
        </div>
    )
}

export default SkillLevelInput;