import { useEffect, useState } from "react";

const AboutTheActivity = ({aboutTheActivity}: {aboutTheActivity: string}) => {
   const [aboutTheActivityList, setAboutTheActivityList] = useState<string[]>([]);
   useEffect(() => {
    const list = aboutTheActivity.split(/\n|\\n/);
    setAboutTheActivityList(list);
   }, [aboutTheActivity]);

    return (
        <div className="about-activity-section flex flex-col justify-center px-8 pt-3">
            <h1 className="text-sm font-bold about-activity-title">About the activity</h1>
            <ul className="list-disc text-sm font-normal mt-2 pl-2"> 
                {aboutTheActivityList && aboutTheActivityList.map((item, index) => (
                    <li key={index} className="text-sm text-activity-description">{item}</li>
                ))}
            </ul>
        </div>
    )
}

export default AboutTheActivity;