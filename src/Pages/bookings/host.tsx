import { RouteComponentProps } from "@reach/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import { getGymsByActivity } from "../../apis/gym/activities";
import { IGymCard } from "../../types/gyms";
import { getBookingsForHost } from "../../apis/bookings/host";
import { useAtom } from "jotai/react";
import { userDetailsAtom } from "../../atoms/atom";
import SkillCapsule from "../../components/skill-capsule";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const BookingInfoHost: React.FC<RouteComponentProps> = () => {
    const [userDetails] = useAtom(userDetailsAtom);
    const [filterApplied, setFilterApplied] = useState<boolean>(false);
    const [centerName, setCenterName] = useState<string>("");
    const [activity, setActivity] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [gyms, setGyms] = useState<IGymCard[]>([]);
    const [bookings, setBookings] = useState<any>([]);
    const [selectedBooking, setSelectedBooking] = useState<string>("");
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
            setBookings(result.bookings);
        },
    });

    useEffect(() => {
        _getGymsByActivities("ALL");
    }, []);

    // Auto-refresh functionality - refresh bookings every 5 minutes
    // useEffect(() => {
    //     const refreshData = () => {
    //         if (filterApplied && userDetails?.id) {
    //             // If filters are applied, refresh with current filter values
    //             _getBookingsForHost({
    //                 userId: userDetails.id.toString(),
    //                 gymId: centerName,
    //                 activity,
    //                 date,
    //                 startTime,
    //                 endTime
    //             });
    //         }
    //     };

    //     // Set up interval to refresh every 5 minutes (300000 milliseconds)
    //     const interval = setInterval(refreshData, 300000);

    //     // Cleanup interval on component unmount
    //     return () => clearInterval(interval);
    // }, [filterApplied, userDetails?.id, centerName, activity, date, startTime, endTime, _getBookingsForHost]);

    const handleFilter = () => {
        setFilterApplied(true);
        _getBookingsForHost({userId: userDetails?.id?.toString() || "", gymId: centerName, activity, date, startTime, endTime});
    }

    const getBookingDate = (booking: string) => {   
        const date = booking.split("_")[1];
        const day = date.split("-")[2];
        const month = months[parseInt(date.split("-")[1]) - 1];
        return `${day} ${month}`;
    }

    const getBookingTime = (booking: string) => {
        const time = parseInt(booking.split("_")[2]);
        const hour = Math.floor(time / 100);
        const minute = time % 100;
        const ampm = hour < 12 ? "AM" : "PM";   
        const hour12 = hour % 12 || 12;
        return minute == 0 ? `${hour12} ${ampm}` : `${hour12}:${minute} ${ampm}`;
    }

    const handleBookingClick = (booking: string) => {
        if(selectedBooking == booking) {
            setSelectedBooking("");
        } else {
            setSelectedBooking(booking);
        }
    }

    const handlePhoneClick = (phone: string) => {
        window.open(`tel:${phone}`, '_blank');
    }

    const showBookings = () => {
        const bookingsToShow = Object.keys(bookings);
        return (
            bookingsToShow.map((booking: any) => (

                <div className="flex flex-col w-full" onClick={() => handleBookingClick(booking)}>
                    <div key={booking} className={`flex flex-row py-2 px-4 gap-2 w-full justify-between rounded-t-lg bg-white border-2 border-black ${selectedBooking == booking ? "bg-blue-100" : ""}`}>
                        <p className="text-sm font-bold">{getBookingDate(booking)}, {getBookingTime(booking)}</p>
                        <p className="text-sm font-bold">{booking.split("_")[0]}</p>
                        <p className="text-sm font-bold">{bookings[booking][0].equipmentRented > 0 ? "🏸" : "No Shuttle"}</p>
                    </div>
                    {selectedBooking == booking && (
                    <div className="flex flex-col py-2 gap-2 w-full bg-white border-l-2 border-r-2 border-black">
                        {bookings[booking].map((booking: any, index: number) => (
                            <div key={index} className="flex flex-row py-2 px-2 gap-2 w-full justify-between rounded-lg bg-white">
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm font-light px-2">{booking["name"]} </p>
                                    <SkillCapsule
                                        level={booking["skillLevel"]}
                                        editable={false}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <p className="text-sm font-light"> <span className="text-sm font-light">💰</span> {booking["coins"].toLowerCase()} </p>
                                    <p className="text-sm font-light" onClick={() => handlePhoneClick(booking["phone"])}> <span className="text-sm font-light">{booking["phone"]}</span> </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    )} 
                    <p className="text-xs font-light text-center rounded-b-lg border-l-2 border-r-2 border-b-2 border-black bg-blue-100 text-black">{selectedBooking == booking ? "Tap to hide details" : "Tap to view details"}</p>
                </div>
            ))
        )
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
            <hr className="w-full border-gray-300 my-2" />
            <div className="flex flex-col py-2 px-4 gap-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {showBookings()}
            </div>
        </div>
    )
}

export default BookingInfoHost;