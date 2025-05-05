import { useEffect } from "react";

import { useState } from "react";

const WhatToBring = ({whatToBring}: {whatToBring: string}) => {

    const [whatToBringList, setWhatToBringList] = useState<string[]>([]);
    useEffect(() => {
        const list = whatToBring.split(/\n|\\n/);
        setWhatToBringList(list);
    }, [whatToBring]);

    return (
        <div className="flex flex-col justify-center shadow-gray rounded-xl mx-8 my-4 py-4 px-4 rounded-xl">
        <h1 className="text-sm font-bold">What to bring</h1>
        <ul className="list-disc text-sm mt-2 pl-2"> 
            {whatToBringList && whatToBringList.map((item, index) => (
                <li key={index} className="text-sm text-gray">{item}</li>
            ))}
        </ul>
    </div>
    )
}

export default WhatToBring;