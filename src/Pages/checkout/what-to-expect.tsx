import { useEffect, useState } from "react";

const WhatToExpect = ({whatToExpect}: {whatToExpect: string}) => {
   const [whatToExpectList, setWhatToExpectList] = useState<string[]>([]);
   useEffect(() => {
    const list = whatToExpect.split(/\n|\\n/);
    setWhatToExpectList(list);
   }, [whatToExpect]);

    return (
        <div className="what-to-expect-section flex flex-col justify-center px-8 pt-3">
            <h1 className="text-sm font-bold what-to-expect-title">What to expect</h1>
            <ul className="list-disc text-sm font-normal mt-2 pl-2"> 
                {whatToExpectList && whatToExpectList.map((item, index) => (
                    <li key={index} className="text-sm text-activity-description">{item}</li>
                ))}
            </ul>
        </div>
    )
}

export default WhatToExpect;