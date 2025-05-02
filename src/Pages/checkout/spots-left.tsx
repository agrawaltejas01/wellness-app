import BookedSlot from "../../components/booked-slot";
import EmptySlot from "../../components/empty-slot";

const SpotsLeft = ({ spotsLeft, spotsTotal }: { spotsLeft: number, spotsTotal: number }) => {

    return (
        <div className={`flex items-center justify-between pt-4 pb-2 px-8`}>
            <h1 className="text-sm font-semibold">{spotsLeft}/{spotsTotal} {spotsLeft > 1 ? "spots" : "spot"} left</h1>
            <div className="flex gap-1">
                {Array.from({ length: spotsLeft }).map((_, index) => (
                    <EmptySlot key={index} />
                ))}
                {Array.from({ length: spotsTotal - spotsLeft }).map((_, index) => (
                    <BookedSlot key={index} />
                ))}

            </div>
        </div>
    )
}

export default SpotsLeft;