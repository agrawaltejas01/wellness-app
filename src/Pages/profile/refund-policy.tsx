import React from "react";
import { IBookings } from "../../types/user";

const RefundPolicy: React.FC<{booking: IBookings}> = ({ booking }) => {

    const getRefundPolicy = (refundPolicy: string) => {
        let points: string[] = [];

        const refundPolicyObject = JSON.parse(refundPolicy);

        if(!refundPolicy) {
            points.push("There is no refund policy for this booking");
            return points;
        }

        if(refundPolicyObject.refund_applicable === false) {
            points.push("Refund is not applicable for this booking");
            return points;
        }

        if(refundPolicyObject.conditions?.length > 0) {
            points.push("Post Cancellation, it will take 5-7 working days to get refund credited to your source account.");
            // headers.push("Refund conditions are as follows:");
            for(let i = refundPolicyObject.conditions.length - 1; i >= 0; i--) {
                const condition = refundPolicyObject.conditions[i];
                if(condition.refund_percentage == 100) {
                    points.push(`Full refund will be made if the booking is cancelled before ${condition.minutes_before / 60} hours.`);
                } else {
                    points.push(`${condition.refund_percentage}% of the total booking amount will be refunded if the booking is cancelled before ${condition.minutes_before / 60} hours.`);
                }
            }
        }
        
        if(points.length == 0) {
            points.push("There is no refund policy for this booking");
        }
        return points;
    }

    const refundPolicy = getRefundPolicy(booking.refundPolicy || "{}");


    return (
        <div className="flex flex-col text-sm py-2 text-gray-500">
            <ul>
                {refundPolicy.map((point: string, index: number) => (
                    <li key={index} className="list-disc list-inside">{point}</li>
                ))}
            </ul>
        </div>
    )
}

export default RefundPolicy;