import BookedSlot from "../../components/booked-slot";
import DisabledSlot from "../../components/disabled-slot";
import EmptySlot from "../../components/empty-slot";

const SpotsLeftCheckout = ({ spotsLeft, spotsTotal, noOfGuests }: { spotsLeft: number, spotsTotal: number, noOfGuests: number }) => {

    return (
        <div className={`flex items-center justify-between pt-4 pb-2 px-4`}>
            <h1 className="text-sm font-semibold">{spotsLeft}/{spotsTotal} spot(s) left</h1>
            <div className="flex gap-1">
                {Array.from({ length: spotsTotal - spotsLeft }).map((_, index) => (
                    <DisabledSlot key={index} />
                ))}
                {Array.from({ length: noOfGuests }).map((_, index) => (
                    <BookedSlot key={index} />
                ))}
                {Array.from({ length: spotsLeft - noOfGuests }).map((_, index) => (
                    <EmptySlot key={index} />
                ))}

            </div>
        </div>
    )
}

export default SpotsLeftCheckout;