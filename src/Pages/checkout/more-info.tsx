import { useEffect } from "react";

import { useState } from "react";

const MoreInfo = ({moreInfo}: {moreInfo: string}) => {  

    const [moreInfoList, setMoreInfoList] = useState<string[]>([]);
    useEffect(() => {
        const list = moreInfo.split(/\n|\\n/);
        setMoreInfoList(list);
    }, [moreInfo]);

    return (
        <div className="more-info-section flex flex-col justify-center px-8 pt-3">
        <h1 className="text-sm font-bold more-info-title">More Info</h1>
        <ul className="list-disc text-sm font-normal mt-2 pl-2"> 
            {moreInfoList && moreInfoList.map((item, index) => (
                <li key={index} className="text-sm text-activity-description">{item}</li>
            ))}
        </ul>
    </div>
    )
}

export default MoreInfo;