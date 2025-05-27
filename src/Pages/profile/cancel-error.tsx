import React from "react";
import { ReactComponent as ErrorIcon } from "../../images/utils/error.svg";
const CancelError: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-row items-center justify-center" style={{width: "32px", height: "32px"}}>
                <ErrorIcon />
            </div>
            <div className="flex flex-col items-center justify-center pt-5 pb-10">
                <p className="text-sm font-bold">Something went wrong!</p>
                <p className="text-sm text-gray-500">Please try again later.</p>
            </div>
        </div>
    )
}   

export default CancelError;