import { RouteComponentProps, navigate } from "@reach/router";
import React, { useEffect, useState } from 'react'
import { IGymCard } from "../../types/gyms";
import { useMutation } from "@tanstack/react-query";
import { getAllActivities, getGymsByActivity } from "../../apis/gym/activities";
import { errorToast } from "../../components/Toast";
import { useAtom } from "jotai";
import { userDetailsAtom } from "../../atoms/atom";
import { concatAndUpperCaseActivities } from "../../utils/activities";
import { shouldShowDiscount } from "../../utils/offers";
import { Rs } from "../../constants/symbols";
import MetaPixel from "../../components/meta-pixel";
import { discount } from "../../constants/gym-discount";

interface PastAppBookingObject {
  [key: string]: any;
}

interface IActivity extends RouteComponentProps {}

const Activity: React.FC<IActivity> = ({}) => {
  let activity = window.location.pathname.split('/')[1]
  if(activity == "badmintonKids") {
    activity = "One Month Plan";
  }
  const [activities, setActivities] = useState<string[]>([]);
  const [gymCardsData, setGymCardsData] = useState<IGymCard[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>(activity);
  const [userDetails] = useAtom(userDetailsAtom);
  const [isFromApp, setIsFromApp] = useState(false);
  const [pastAppBookings, setPastAppBookings] = useState({});

  useEffect(() => {
    setIsFromApp(window?.isFromApp || false);
    setPastAppBookings(window?.pastAppBookings || {});
  }, []);

  const { mutate: _getAllActivities } = useMutation({
    mutationFn: getAllActivities,
    onError: () => {
      errorToast("Error in getting activities near you");
    },
    onSuccess: (result) => {
      setActivities(result.activities);
    },
  });

  const { mutate: _getGymsByActivities } = useMutation({
    mutationFn: getGymsByActivity,
    onError: () => {
      errorToast("Error in getting gyms by activity");
    },
    onSuccess: (result) => {
      setGymCardsData(result.gyms);
      if(!result.gyms.length)
        _getGymsByActivities('all')
    },
  });

  useEffect(() => {
    _getAllActivities();
  }, [])

  useEffect(() => {
    _getGymsByActivities(selectedActivity);
  }, [selectedActivity])

  const GymCard: React.FC<{ gymCard: IGymCard }> = ({ gymCard }) => {
    const { medias, name, activities, area, minPrice, isExclusive, maxDiscount, offerPercentage, discountType } = gymCard;
    const finalPrice = (minPrice - maxDiscount) >  (minPrice *  (100 - offerPercentage) / 100) ? (minPrice - maxDiscount) : (minPrice * (100 - offerPercentage) / 100);
    let showDiscount = shouldShowDiscount(gymCard, userDetails, isFromApp, pastAppBookings, null);
    const discountPrice = discountType == 'FLAT' ? minPrice - minPrice * offerPercentage / 100 : finalPrice;

    return (
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full flex flex-col hover:scale-105"
        onClick={() => {
          navigate(`/gym/${gymCard.gymId}`, {
            state: { gymId: gymCard.gymId.toString() },
          });
        }}
      >
        {/* Image Section */}
        <div className="relative h-48 sm:h-56 lg:h-64 bg-gray-200 flex-shrink-0">
          {isExclusive && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-70 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
              >
                <path
                  opacity="0.8"
                  d="M7.73192 1.88364L8.61499 3.40904L10.3478 3.73162L8.82239 4.61468L8.49981 6.34748L7.61674 4.82208L5.88394 4.4995L7.40934 3.61644L7.73192 1.88364Z"
                  fill="#FFF7CC"
                />
                <path
                  d="M3.88235 3.25586L4.93094 6.08962L7.76471 7.13821L4.93094 8.1868L3.88235 11.0206L2.83377 8.1868L0 7.13821L2.83377 6.08962L3.88235 3.25586Z"
                  fill="#FFF7CC"
                />
              </svg>
              <span className="text-xs font-semibold text-white">Trending</span>
            </div>
          )}
          {medias.length > 0 && (
            <img 
              src={medias[0]} 
              className="w-full h-full object-cover" 
              alt={name} 
            />
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          {/* Name and Price Row */}
          <div className="flex justify-between items-start mb-2">
            <h3 
              className="text-base sm:text-lg lg:text-xl font-bold text-black flex-1 mr-2 line-clamp-2"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              {name}
            </h3>
            
            {/* Price Card */}
            <div className="flex flex-col items-end">
              {showDiscount ? (
                <>
                  <span className="text-lg font-bold text-black">₹{Math.floor(discountPrice)}</span>
                  <span className="text-xs text-gray-400 line-through">₹{minPrice}</span>
                  <span className="text-xs text-gray-600">onwards</span>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-black">₹{minPrice}</span>
                  <span className="text-xs text-gray-600">onwards</span>
                </>
              )}
            </div>
          </div>

          {/* Activities */}
          <p 
            className="text-sm text-gray-600 mb-3"
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            {gymCard.gymId == 41 ? "Badminton Kids Coaching" : concatAndUpperCaseActivities(activities?.slice(0, 8))}
          </p>

          {/* Divider */}
          <div className="h-px bg-gray-200 mb-3"></div>

          {/* Location */}
          {area && (
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                className="flex-shrink-0"
              >
                <path
                  d="M8.49984 8.66732C9.60441 8.66732 10.4998 7.77189 10.4998 6.66732C10.4998 5.56275 9.60441 4.66732 8.49984 4.66732C7.39527 4.66732 6.49984 5.56275 6.49984 6.66732C6.49984 7.77189 7.39527 8.66732 8.49984 8.66732Z"
                  stroke="#4F4F4F"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.49984 14.6673C11.1665 12.0007 13.8332 9.61284 13.8332 6.66732C13.8332 3.7218 11.4454 1.33398 8.49984 1.33398C5.55432 1.33398 3.1665 3.7218 3.1665 6.66732C3.1665 9.61284 5.83317 12.0007 8.49984 14.6673Z"
                  stroke="#4F4F4F"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm text-gray-700">{area}</span>
            </div>
          )}

          {/* Discount Banner */}
          {showDiscount && (
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#EDF8F4" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clipPath="url(#clip0_1132_11447)">
                  <path d="M6.13476 13.7346C6.35326 13.7057 6.57399 13.7649 6.74804 13.899L7.5502 14.5145C7.81536 14.7182 8.18422 14.7182 8.44864 14.5145L9.28117 13.8753C9.43671 13.756 9.63299 13.7035 9.82705 13.7294L10.8684 13.8664C11.1995 13.9101 11.5188 13.7257 11.6469 13.4168L12.0476 12.4479C12.1224 12.2665 12.2661 12.1228 12.4476 12.0479L13.4164 11.6472C13.7252 11.5198 13.9097 11.1998 13.866 10.8687L13.7341 9.86504C13.7052 9.64653 13.7645 9.4258 13.8986 9.25173L14.5141 8.44953C14.7178 8.18435 14.7178 7.81547 14.5141 7.55103L13.8749 6.71846C13.7556 6.56291 13.703 6.36662 13.7289 6.17255L13.866 5.1311C13.9097 4.8 13.7252 4.48075 13.4164 4.3526L12.4476 3.95187C12.2661 3.87706 12.1224 3.73336 12.0476 3.55189L11.6469 2.58302C11.5195 2.27414 11.1995 2.0897 10.8684 2.13341L9.82705 2.27044C9.63299 2.29711 9.43671 2.24451 9.28191 2.126L8.44938 1.48676C8.18422 1.28306 7.81536 1.28306 7.55094 1.48676L6.71842 2.126C6.56288 2.24451 6.3666 2.29711 6.17254 2.27192L5.13114 2.13489C4.80006 2.09119 4.48083 2.27563 4.35269 2.58451L3.95272 3.55337C3.87717 3.7341 3.73348 3.8778 3.55276 3.95336L2.58395 4.35335C2.27508 4.48149 2.09066 4.80074 2.13436 5.13184L2.27138 6.17329C2.29656 6.36736 2.24398 6.56365 2.12547 6.71846L1.48626 7.55103C1.28257 7.81621 1.28257 8.18509 1.48626 8.44953L2.12547 9.2821C2.24472 9.43765 2.2973 9.63394 2.27138 9.82801L2.13436 10.8695C2.09066 11.2006 2.27508 11.5198 2.58395 11.648L3.55276 12.0487C3.73422 12.1235 3.87791 12.2672 3.95272 12.4487L4.35343 13.4175C4.48083 13.7264 4.8008 13.9109 5.13188 13.8672L6.13476 13.7346Z" fill="#0B9C5D"/>
                  <path d="M6.00016 6.00065H6.00683M10.0002 10.0007H10.0068M10.6668 5.33398L5.3335 10.6673M6.13476 13.7346C6.35326 13.7057 6.57399 13.7649 6.74805 13.899L7.5502 14.5145C7.81536 14.7182 8.18422 14.7182 8.44864 14.5145L9.28117 13.8753C9.43671 13.756 9.63299 13.7035 9.82705 13.7294L10.8684 13.8664C11.1995 13.9101 11.5188 13.7257 11.6469 13.4168L12.0476 12.4479C12.1224 12.2665 12.2661 12.1228 12.4476 12.0479L13.4164 11.6472C13.7252 11.5198 13.9097 11.1998 13.866 10.8687L13.7341 9.86504C13.7052 9.64653 13.7645 9.4258 13.8986 9.25173L14.5141 8.44953C14.7178 8.18435 14.7178 7.81547 14.5141 7.55103L13.8749 6.71846C13.7556 6.56291 13.703 6.36662 13.7289 6.17255L13.866 5.1311C13.9097 4.8 13.7252 4.48075 13.4164 4.3526L12.4476 3.95187C12.2661 3.87706 12.1224 3.73336 12.0476 3.55189L11.6469 2.58302C11.5195 2.27414 11.1995 2.0897 10.8684 2.13341L9.82705 2.27044C9.63299 2.29711 9.43671 2.24451 9.28191 2.126L8.44938 1.48676C8.18422 1.28306 7.81536 1.28306 7.55094 1.48676L6.71842 2.126C6.56288 2.24451 6.3666 2.29711 6.17254 2.27192L5.13114 2.13489C4.80006 2.09119 4.48083 2.27563 4.35269 2.58451L3.95272 3.55337C3.87717 3.7341 3.73348 3.8778 3.55276 3.95336L2.58395 4.35335C2.27508 4.48149 2.09066 4.80074 2.13436 5.13184L2.27138 6.17329C2.29656 6.36736 2.24398 6.56365 2.12547 6.71846L1.48626 7.55103C1.28257 7.81621 1.28257 8.18509 1.48626 8.44953L2.12547 9.2821C2.24472 9.43765 2.2973 9.63394 2.27138 9.82801L2.13436 10.8695C2.09066 11.2006 2.27508 11.5198 2.58395 11.648L3.55276 12.0487C3.73422 12.1235 3.87791 12.2672 3.95272 12.4487L4.35343 13.4175C4.48083 13.7264 4.8008 13.9109 5.13188 13.8672L6.13476 13.7346Z" stroke="#EDF8F4" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_1132_11447">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-xs text-green-700 font-medium">
                {discount[gymCard.gymId as keyof typeof discount]?.replace("Rs.", "₹") || "Special discount available"}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <MetaPixel />
      <div className="min-h-screen bg-gray-50">
        {/* Header with Back Button */}
        <div 
          className="sticky top-0 z-10 bg-white shadow-sm"
          style={{
            padding: "16px 20px",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M15.8327 10.0003H4.16602M4.16602 10.0003L9.99935 15.8337M4.16602 10.0003L9.99935 4.16699"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span 
                className="text-lg font-semibold"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                Back
              </span>
            </button>
          </div>
        </div>

        {/* Activity Selector */}
        <div className="bg-white px-4 py-3 mb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto scrollbar-hide gap-2">
              <button
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold transition-all ${
                  selectedActivity === "all" 
                    ? "bg-black bg-opacity-5 text-black border border-black" 
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
                onClick={() => setSelectedActivity("all")}
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                All
              </button>
              {activities?.map((act) => (
                <button
                  key={act}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold transition-all ${
                    selectedActivity === act 
                      ? "bg-black bg-opacity-5 text-black border border-black" 
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                  onClick={() => setSelectedActivity(act)}
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}
                >
                  {act.charAt(0) + act.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gym Cards List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          {gymCardsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {gymCardsData.map((gymCard) => (
                <GymCard key={gymCard.gymId} gymCard={gymCard} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No centers found for this activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  ); 
};

export default Activity;
