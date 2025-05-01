import { useEffect, useState } from "react";

const WhatToExpect = ({whatToExpect}: {whatToExpect: string}) => {
   const [whatToExpectList, setWhatToExpectList] = useState<string[]>([]);
   useEffect(() => {
    const list = whatToExpect.split(/\n|\\n/);
    setWhatToExpectList(list);
   }, [whatToExpect]);

    return (
        <div className="flex flex-col justify-center shadow-gray rounded-xl mx-8 my-4 py-4 px-4 rounded-xl">
            <h1 className="text-sm font-bold">What to expect</h1>
            <ul className="list-disc text-sm mt-2 pl-2"> 
                {whatToExpectList && whatToExpectList.map((item, index) => (
                    <li key={index} className="text-sm text-gray">{item}</li>
                ))}
            </ul>
        </div>
    )
}

export default WhatToExpect;