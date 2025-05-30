import React from "react";
import { IBookings } from "../../types/user";

const RefundPolicy: React.FC<{booking: IBookings}> = ({ booking }) => {

    const getRefundPolicy = (refundPolicy: string) => {
        let points: string[] = [];

        const refundPolicyObject = JSON.parse(refundPolicy);



        if(!refundPolicy || refundPolicy == "{}") {
            points.push("❌ There is no refund policy for this booking");
            return points;
        }

        if(refundPolicyObject.refund_applicable === false) {
            points.push("❌ Refund is not applicable for this booking");
            return points;
        }

        if(refundPolicyObject.conditions?.length > 0) {
            const refundConditions = refundPolicyObject.conditions;
            refundConditions.sort((a: any, b: any) => b.minutes_before - a.minutes_before);
            // headers.push("Refund conditions are as follows:");
            for(let i = 0; i < refundConditions.length; i++) {
                const condition = refundConditions[i];
                if(condition.refund_percentage == 100) {
                    points.push(`💯 Full refund if cancelled at least ${condition.minutes_before / 60} hours before the start time.`);
                } else {
                    points.push(`🔁 ${condition.refund_percentage}% refund if cancelled at least ${condition.minutes_before / 60} hours before the start time.`);
                }
                if(i == refundConditions.length - 1) {
                    points.push(`❌ No refund if cancelled less than ${condition.minutes_before / 60} hours before the start time.`);
                }
            }
        }
        return points;
    }

    const refundPolicy = getRefundPolicy(booking.refundPolicy || "{}");


    return (
        refundPolicy.length == 1 ?
        <div className="flex flex-col text-sm pt-4 text-gray-500">
            {refundPolicy[0]}
        </div> :
        <div className="flex flex-col">
            <div className="flex flex-col text-sm font-bold py-2 text-gray-500">
                💸 Refund Timeline:
            </div>
            <div className="flex flex-col text-sm text-gray-500 px-4 pb-2">
                <p>Once cancelled, your refund will be credited to the original payment method within <b>5–7 working days.</b></p>
            </div>
            <div className="flex flex-col font-bold text-sm text-gray-500">
                <p>💰 How much you’ll get back:</p>
            </div>
            <div className="flex flex-col text-sm text-gray-500 px-2 pb-2">
                <ul className="list-disc list-inside text-sm">
                    {refundPolicy.map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default RefundPolicy;