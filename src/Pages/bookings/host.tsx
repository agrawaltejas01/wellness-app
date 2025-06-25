import { RouteComponentProps } from "@reach/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import { getGymsByActivity } from "../../apis/gym/activities";
import { IGymCard } from "../../types/gyms";
import { getBookingsForHost } from "../../apis/bookings/host";
import { useAtom } from "jotai/react";
import { userDetailsAtom } from "../../atoms/atom";

const BookingInfoHost: React.FC<RouteComponentProps> = () => {
    const [userDetails] = useAtom(userDetailsAtom);
    const [filterApplied, setFilterApplied] = useState<boolean>(false);
    const [centerName, setCenterName] = useState<string>("");
    const [activity, setActivity] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [gyms, setGyms] = useState<IGymCard[]>([]);
    const ACTIVITIES = [
        "BADMINTON",
        "PICKLEBALL",
        "FOOTBALL"
    ]


    const { mutate: _getGymsByActivities } = useMutation({
        mutationFn: getGymsByActivity,
        onError: () => {
          errorToast("Error in getting gyms by activity");
        },
        onSuccess: (result) => {
          console.log("gyms gotten - ", result);
          setGyms(result.gyms);
        },
      });


    const { mutate: _getBookingsForHost } = useMutation({
        mutationFn: getBookingsForHost,
        onError: () => {
            errorToast("Error in getting bookings for host");
        },
        onSuccess: (result) => {
            console.log("bookings gotten - ", result);
        },
    });

    useEffect(() => {
        _getGymsByActivities("ALL");
    }, []);

    const handleFilter = () => {
        _getBookingsForHost({userId: userDetails?.id?.toString() || "", gymId: centerName, activity, date, startTime, endTime});
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center py-2 shadow-gray">
                <p className="text-2xl font-bold "> Bookings </p>
            </div>
            <div className="flex flex-col py-2 px-4 gap-2 w-full">
                {/* <div className="text-sm font-bold bg-blue-100 rounded-lg px-4 py-2"> Filters </div> */}
                <select className="text-sm font-bold bg-gray-100 text-center rounded-full px-4 py-2 w-full" value={centerName} onChange={(e) => setCenterName(e.target.value)}>
                    <option value="" disabled>Select Center</option>
                    {gyms.map((gym) => (
                        <option key={gym.gymId} value={gym.gymId}>{gym.name}</option>
                    ))}
                </select>
                <div className="flex flex-row items-center justify-between gap-2 w-full">
                    <select className="text-sm font-bold bg-gray-100 text-center rounded-full px-4 py-2 w-1/2" value={activity} onChange={(e) => setActivity(e.target.value)}>
                        <option value="" disabled>Select Activity</option>
                        {ACTIVITIES.map((activity) => (
                            <option key={activity} value={activity}>{activity}</option>
                        ))}
                    </select>
                    <input type="date" placeholder="Date" className="text-sm font-bold bg-gray-100 text-center rounded-full px-2 py-2 w-1/2" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="flex flex-row items-center justify-between gap-2 w-full">
                    <input type="time" placeholder="Start Time" className="text-sm font-bold bg-gray-100 text-center rounded-full px-2 py-2 w-1/2" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    <input type="time" placeholder="End Time" className="text-sm font-bold bg-gray-100 text-center rounded-full px-2 py-2 w-1/2" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <button className="text-sm font-bold bg-blue-100 rounded-full px-4 py-2" onClick={handleFilter}>Filter</button>
            </div>
        </div>
    )
}

export default BookingInfoHost;