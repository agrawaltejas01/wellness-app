import { navigate, RouteComponentProps, useLocation } from "@reach/router";
import { Flex } from "antd";
import GymPhotos from "./gym-photos";
import GymInfo from "./gym-info";
import BookClassBanner from "./book-class-banner";
import BatchSchedule from "./batch-schedule";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getGymById, getPastAppBookings } from "../../apis/gym/activities";
import { errorToast } from "../../components/Toast";
import Loader from "../../components/Loader";
import { IGymDetails } from "../../types/gyms";
import { Mixpanel } from "../../mixpanel/init";
import ShareMetada from "../../components/share-metadata";
import MetaPixel from "../../components/meta-pixel";
import {handleRefresh} from '../../utils/refresh';
import SwipeHandler from '../../components/back-swipe-handler';

interface IGYmPage extends RouteComponentProps {
  gymId?: string;
}

interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}

function MixpanelGymInit(gym: IGymDetails) {
  Mixpanel.track("open_gym_page", {
    gymName: gym.name,
    gymId: gym.gymId,
  });
}

const Gym: React.FC<IGYmPage> = ({ gymId, }) => {
  const [gym, setGym] = useState<IGymDetails | null>(null);
  const { mutate: _getGymById } = useMutation({
    mutationFn: getGymById,
    onSuccess: (result) => {
      setGym(result.gym);
      MixpanelGymInit(result.gym);
    },
    onError: (error) => {
      errorToast("Error in getting gym data");
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSwipeRight = async () => {
    // Add your right swipe logic here
    navigate('/');
  };

  useEffect(() => {
    _getGymById(gymId as string);
  }, [gymId]);

  if (!gym) return <Loader />;

  return (
    <>
      <ShareMetada 
        title={"ZenfitX"}
        description={`Hey, I just discovered this awesome fitness studio on ZenfitX called ${gym?.name}. Check it out and let's plan this together! Plus, you can score sweet discounts on your first booking.😉`}
        url={window.location.href}
        image={gym.medias[0].url}
      />
      <MetaPixel />

      <div className="min-h-screen bg-gray-50">
        {/* Desktop Layout */}
        <div className="hidden lg:block lg:h-screen lg:overflow-hidden">
          <div className="max-w-7xl mx-auto p-6 h-full">
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Left: Photos */}
              <div className="h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
                  <GymPhotos gym={gym} />
                  
                  {/* Fill remaining space */}
                  <div className="flex-1 bg-gradient-to-b from-gray-50 to-white p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Location</h3>
                        <p className="text-base text-gray-700">{gym.area}</p>
                        <p className="text-sm text-gray-500 mt-1">{gym.addressLine1}</p>
                      </div>
                      
                      {gym.googleRating && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Rating</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{gym.googleRating}</span>
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            </div>
                            <span className="text-sm text-gray-500">({gym.googleReviews} reviews)</span>
                          </div>
                        </div>
                      )}

                      {gym.activities && gym.activities.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Activities</h3>
                          <div className="flex flex-wrap gap-2">
                            {gym.activities.slice(0, 5).map((activity: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                              >
                                {activity.charAt(0) + activity.slice(1).toLowerCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Info - Scrollable */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <GymInfo gymData={gym} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden gymWrap">
          <Flex flex={1}>
            <GymPhotos gym={gym} />
          </Flex>

          <Flex flex={2} vertical justify="center">
            <GymInfo gymData={gym} />
          </Flex>
        </div>
      </div>
    </>
  );
};

export default Gym;
