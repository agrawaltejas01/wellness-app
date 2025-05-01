import { useEffect, useState } from "react";

const AboutTheActivity = ({aboutTheActivity}: {aboutTheActivity: string}) => {
   const [aboutTheActivityList, setAboutTheActivityList] = useState<string[]>([]);
   useEffect(() => {
    const list = aboutTheActivity.split(/\n|\\n/);
    setAboutTheActivityList(list);
   }, [aboutTheActivity]);

    return (
        <div className="flex flex-col justify-center shadow-gray rounded-xl mx-8 my-4 py-4 px-4 rounded-xl">
            <h1 className="text-sm font-bold">About the activity</h1>
            <ul className="list-disc text-sm mt-2 pl-2"> 
                {aboutTheActivityList && aboutTheActivityList.map((item, index) => (
                    <li key={index} className="text-sm text-gray">{item}</li>
                ))}
            </ul>
        </div>
    )
}

export default AboutTheActivity;