import { useMutation } from "@tanstack/react-query";
import { getUpcomingBookings } from "../../apis/bookings/upcoming";
import { errorToast } from "../../components/Toast";
import { useEffect, useState } from "react";
import shuttlecockIcon from "../../images/activities/shuttlecock.png";
import { formatDate, formatTimeIntToAmPm } from "../../utils/date";
import colors from "../../constants/colours";
import { navigate } from "@reach/router";

interface IUpcomingBooking {
    activityName: string;
    date: string;
    startTime: string;
    gymName: string;
}



const UpcomingBooking: React.FC<{ userId: string }> = ({ userId }) => {

    const [upcomingBooking, setUpcomingBooking] = useState<IUpcomingBooking | null>(null);
    const { mutate: _getUpcomingBookings } = useMutation({
        mutationFn: getUpcomingBookings,
        onError: () => {
          errorToast("Error in getting upcoming bookings");
        },
        onSuccess: (result) => {
          setUpcomingBooking(result.booking);
        },
      });

    useEffect(() => {
        _getUpcomingBookings({ userId });
    }, []);
  return (
    <>
    {upcomingBooking && upcomingBooking.activityName === "BADMINTON" && (
    <div 
      className="rounded-2xl p-3 md:p-4 mx-4 md:mx-auto mt-4 max-w-2xl cursor-pointer transition-shadow"
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)';
      }}
      onClick={() => navigate('/profile')}
    >
      {/* Header with UPCOMING GAME and horizontal lines */}
      <div className="flex items-center justify-center gap-3 md:gap-4 mb-2 md:mb-3">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span 
          className="font-semibold text-gray-400 uppercase tracking-[0.3em] md:tracking-[0.4em]"
          style={{ 
            fontSize: '12px',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}
        >
          UPCOMING GAME
        </span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
      
      {/* Content with shuttlecock icon and booking info */}
      <div 
        className="flex flex-row items-center gap-3 md:gap-4 rounded-lg p-2 md:p-3"
        style={{
          background: 'linear-gradient(to right, #e6e6e6, #ffffff)'
        }}
      >
        <div className="flex-shrink-0">
          <div className="w-10 h-10 md:w-10 md:h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
            <img src={shuttlecockIcon} alt="shuttlecock" className="w-8 h-8 object-contain p-1" />
          </div>
        </div>
        <div className="flex flex-col gap-1 md:gap-1.5 flex-1">
          <span className="text-xs md:text-sm font-semibold text-gray-800 uppercase">BADMINTON</span>
          <div className="flex flex-row items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
            <span>{formatDate(upcomingBooking.date)["date suffix"]}</span>
            <span>•</span>
            <span>{formatTimeIntToAmPm(Number(upcomingBooking.startTime))}</span>
            <span>•</span>
            <span className="truncate">{upcomingBooking.gymName}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <svg 
            className="w-5 h-5 md:w-6 md:h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: '#A1A1A1' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
    )}
    </>
  );
};

export default UpcomingBooking;