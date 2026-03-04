import { RouteComponentProps, useLocation, useNavigate } from "@reach/router";
import { Flex, Space } from "antd";
import HomeBanner from "./banner";
import ClassesNearYou from "./classes-near-you";
import CentersAroundYou from "./centers-around-you";
import ProfileBanner from "./profile-banner";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import {
  getAllActivities,
  getExclusiveGyms,
  getGymsByActivity,
  getPastAppBookings
} from "../../apis/gym/activities";
import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import { IGymCard } from "../../types/gyms";
import { getPlusDetailsOfUser } from "../../apis/user/plus";
import { useAtom } from "jotai/react";
import { plusDetailsAtom, userDetailsAtom } from "../../atoms/atom";
import IUser, { IBookings, IPlusDetails } from "../../types/user";
import useAuthRedirect from "../auth/redirect-hook";
import { Mixpanel } from "../../mixpanel/init";
import { getUserDeatils } from "../../apis/user/userDetails";
import Onboarding from "./onboarding";
import MetaPixel from "../../components/meta-pixel";
import {handleRefresh} from '../../utils/refresh';
import ForceUpdatePopup from "../../components/ForceUpdatePopup";
import GoToApp from "../../components/go-to-app";
import { saveNotificationToken } from "../../apis/notifications/notifications";  
import CoinsHomepage from "../coins/coins-homepage";
import Feedback from "./feedback";
import HomeBannerV2 from "./banner-v2";
import LeaderboardHome from "./leaderboard-home";
import Highlights from "./highlights";
import ProfileCompletion from "../auth/profile-completion";
import GetStarted from "./get-started";
import ProfileHeader from "./profile-header";
import ActivitySelector from "./activity-selector";
import AICoachBanner from "./ai-coach-banner";
import BottomNav from "../../components/bottom-nav";
import GameHighlights from "./game-highlights";
import { getUpcomingBookings } from "../../apis/bookings/upcoming";
import UpcomingBooking from "./upcoming-booking";
import KeepMovingBanner from "./keep-moving-banner";
import RatingHomepage from "./rating-homepage";
import ZbrFaq from "./zbr-faq";

interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}

interface IHome extends RouteComponentProps {
  activitySelected?: string;
  showClassesNearYou?: boolean;
}

function MixpanelHomeInit(user: IUser | null) {
  Mixpanel.identify(user?.phone as string);
  Mixpanel.people.set({
    $name: user?.name as string,
    $phone: user?.phone as string,
    $id: user?.id as number,
  });
  Mixpanel.track("open_home_page");
}

const Home: React.FC<IHome> = ({ activitySelected, showClassesNearYou }) => {
  // useAuthRedirect();

  const navigate = useNavigate();

  let locationStates = useLocation().state;
  let activitySelectedFromFilters = locationStates
    ? (locationStates as any).activitySelectedFromFilters
    : null;
  let showClassesNearYouFilters = locationStates
    ? (locationStates as any).showClassesNearYouFilters
    : null;

  // Hardcoded activities
  const [activities, setActivities] = useState<string[]>(["BADMINTON", "PICKLEBALL", "FITNESS & RECOVERY"]);
  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(
    activitySelectedFromFilters || activitySelected || "BADMINTON"
  );
  const [gymCardsData, setGymCardsData] = useState<IGymCard[]>([]);
  const [pastAppBookings, setPastAppBookings] = useState<PastAppBookingObject>({});
  const [isFromApp, setIsFromApp] = useState(false);

  const [pluDetails, setPlusDetailsAtom] = useAtom(plusDetailsAtom);
  const [userDetails, setUserDetailsAtom] = useAtom(userDetailsAtom);
  const [onboarding, setOnboarding] = useState<boolean>(false);
  const [gotPastBookings, setGotPastAppBookings] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const showClassesNearYouRef = useRef(true);

  const mixpanelSet = useRef(false);

  // Commented out - using hardcoded activities instead
  // const { mutate: _getAllActivities } = useMutation({
  //   mutationFn: getAllActivities,
  //   onError: () => {
  //     errorToast("Error in getting activities near you");
  //   },
  //   onSuccess: (result) => {
  //     console.log("activities - ", result);
  //     console.log("activities array - ", result.activities);
  //     if (result.activities && result.activities.length > 0) {
  //       setActivities(result.activities);
  //     }
  //   },
  // });

  const { mutate: _getUserDeatils } = useMutation({
    mutationFn: getUserDeatils,
    onError: () => {
      // errorToast("Error in getting user details");
      console.log("Error in getting user details");
    },
    onSuccess: (result) => {
      console.log("deatils - ", result);
      setUserDetailsAtom(result.user);
    },
  });

  const { mutate: _getPastAppBookings } = useMutation({
    mutationFn: getPastAppBookings,
    onError: () => {
      errorToast("Error in getting past app bookings");
    },
    onSuccess: (result) => {
      console.log("past app bookings - ", result);
      setPastAppBookings(result.bookings);
      window.pastAppBookings = result.bookings;
    },
  });

  const { mutate: _getGymsByActivities } = useMutation({
    mutationFn: getGymsByActivity,
    onError: () => {
      errorToast("Error in getting gyms by activity");
    },
    onSuccess: (result) => {
      console.log("gyms gotten - ", result);
      setGymCardsData(result.gyms);
    },
  });

  const { mutate: _getGymsByExclusive } = useMutation({
    mutationFn: getExclusiveGyms,
    onError: () => {
      errorToast("Error in getting gyms by activity");
    },
    onSuccess: (result) => {
      console.log("gyms gotten - ", result);
      setGymCardsData(result.gyms);
    },
  });

  const { mutate: _saveNotificationToken } = useMutation({
    mutationFn: saveNotificationToken,
    onError: () => {},
    onSuccess: (result) => {
      console.log("notification token stored successfully!");
    },
  });

  // useEffect(() => {
  //   if(userDetails?.id) {
  //     window?.ReactNativeWebView?.postMessage("request_health_permissions");
  //   }
  // }, [userDetails]);
  

  // useEffect(()=>{
  //   const { mutate: _getGymsByActivities } = useMutation({
  //     mutationFn: getGymsByActivity,
  //     onError: () => {
  //       errorToast("Error in getting gyms by activity");
  //     },
  //     onSuccess: (result) => {
  //       console.log("gyms gotten - ", result);
  //       setGymCardsData(result.gyms);
  //     },
  //   });

  // },[activitySelected])

  const { mutate: _getPlusDetailsOfUser } = useMutation({
    mutationFn: getPlusDetailsOfUser,
    onSuccess: (data) => {
      console.log("HELLO => ")
      console.log(data);
      setPlusDetailsAtom(data.plus as unknown as IPlusDetails);
    },
    onError: (error) => {
      errorToast("Error in getting plus details");
    },
  });


  useEffect(() => {
    const userSource = window?.platformInfo?.platform  || 'web';
    const appFlag = userSource != 'web' ? true : false;
    setIsFromApp(appFlag);
    window.isFromApp = appFlag;
  }, [])

  useEffect(() => {
    if(userDetails?.id) {
      window?.ReactNativeWebView?.postMessage("notification alert");

      const sessionLocation = window.sessionStorage["zenfitx-location"];
      if(!sessionLocation) {
        window?.ReactNativeWebView?.postMessage("request_location");
        window.sessionStorage.setItem("zenfitx-location", "true");
      }

      const notificationToken = window.localStorage["token"];
      if (notificationToken) {
        _saveNotificationToken({ userId: userDetails?.id as number, token: notificationToken });
      }
    }
  }, [userDetails])

  useEffect(() => {
    if (onboarding) {
      setCookie("onboarding", "done", 1);
    }
  }, [onboarding]);

  useEffect(() => {
    const userDetails =
      window.localStorage["zenfitx-user-details"] &&
      JSON.parse(window.localStorage["zenfitx-user-details"]);

    // if (!userDetails || (userDetails && userDetails.noOfBookings < 1) || !userDetails?.name || !userDetails?.gender || !userDetails?.dob) {
      _getUserDeatils();
    // }
    // _getAllActivities(); // Commented out - using hardcoded activities
    if(userDetails){
      const userId = JSON.parse(window.localStorage["zenfitx-user-details"]).id || null;
      _getPastAppBookings(userId)
      setGotPastAppBookings(true);
    }
    setGotPastAppBookings(true);

    // _getPlusDetailsOfUser(userDetails?.phone as string);
  }, []);

  useEffect(() => {
    if (selectedActivity) {
      _getGymsByActivities(selectedActivity);
    }
  }, [selectedActivity]);

  useEffect(() => {
    if(window.platformInfo?.platform == "ios") {
      if(!window.platformInfo?.appVersion || (window.platformInfo?.appVersion < '1.2.3')) {
        setShowUpdatePopup(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!mixpanelSet.current) {
      MixpanelHomeInit(userDetails);
      mixpanelSet.current = true;
    }
  }, [userDetails]);


  function setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  // Set the 'onboarding' cookie to 'done' and expire it after 1 day
  const showOnBoarding = () => {
    return (
      // !onboarding && !userDetails?.id && getCookie("onboarding") !== "done"
      !userDetails?.id
      // !userDetails?.id && getCookie("onboarding") !== "done"
    );
  };

  function getCookie(name: string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  if(showUpdatePopup) return <ForceUpdatePopup />
  if (showOnBoarding()) return <Onboarding setOnboarding={setOnboarding} />;
  if (!gotPastBookings) {
    return <Loader />;
  }
  if(!userDetails?.name || !userDetails?.gender || !userDetails?.dob) return <GetStarted />;

  // return (
  //   <>
  //     <MetaPixel />
  //     {/* <PullToRefresh onRefresh={handleRefresh}> */}
  //     <div>
  //     <Flex flex={1} vertical style={{ overflowX: "hidden" }}>
  //       <div>
  //         <Space></Space>

  //         {/* {userDetails?.phone && <Flex flex={1}>
  //           <ProfileBanner />
  //         </Flex>} */}

  //         <Flex flex={3}>
  //           <HomeBannerV2 userDetails={userDetails as IUser} />
  //         </Flex>

  //         <LeaderboardHome activityId={1} />
  //         <div className="w-full mt-2 px-5">
  //           <Highlights />
  //         </div>

  //         <div className="w-full mt-2 px-5">
  //           <CoinsHomepage />
  //         </div>


  //         {showClassesNearYou ? (
  //           <Flex style={{ marginLeft: "16px" }} flex={3}>
  //             <ClassesNearYou />
  //           </Flex>
  //         ) : null}
  //       </div>

  //       <Flex flex={3} style={{ margin: "0 5%" }}>
  //         <CentersAroundYou
  //           activities={activities}
  //           activitySelected={activitySelected}
  //           gymCardsData={gymCardsData}
  //           showClassesNearYou={showClassesNearYou}
  //         />
  //       </Flex>
  //     </Flex>
  //     </div>
  //     <div className="flex flex-col fixed bottom-0 left-0 right-0 z-1000">
  //           <Feedback />
  //     </div>
  //     {/* </PullToRefresh> */}
  //   </>
  // );

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    
    // Navigate to gymming page for FITNESS/GYMMING activity
    if (activity === "GYMMING" || activity === "FITNESS" || activity === "FITNESS & RECOVERY") {
      Mixpanel.track("navigate_to_gymming", { activity });
      navigate("/gymming");
      return;
    }
    
    _getGymsByActivities(activity);
  };

  const isComingSoon = selectedActivity === "PICKLEBALL";

  return (
    <>
      <MetaPixel />
      <div className={`min-h-screen bg-white ${!isComingSoon ? 'pb-24' : ''}`}>
        {/* Profile Header */}
        <ProfileHeader userDetails={userDetails as IUser} />
        
        {/* Activity Selector */}
        <ActivitySelector
          activities={activities}
          selectedActivity={selectedActivity}
          onActivitySelect={handleActivitySelect}
        />
        
        {/* Coming Soon Message */}
        {isComingSoon ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-300"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  color: "#000000",
                }}
              >
                Coming Soon!
              </h2>
              <p
                className="text-base sm:text-lg text-gray-600 mb-6"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                We're working hard to bring {selectedActivity?.toLowerCase()} to you. Stay tuned for updates!
              </p>
              <div
                className="inline-block px-6 py-3 rounded-full"
                style={{
                  backgroundColor: "#F5F5F5",
                }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    color: "#666666",
                  }}
                >
                  🚀 Launching Soon
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <UpcomingBooking userId={userDetails?.id as unknown as string} />

            {/* AI Coach Banner */}
            <AICoachBanner userId={userDetails?.id} />

            <RatingHomepage userDetails={userDetails} />

            {/* Game Highlights Section - Only show for available activities */}
            <GameHighlights />
            
            {/* Leaderboard Section */}
            <LeaderboardHome activityId={1} />
            
            {/* Keep Moving Banner */}
            <KeepMovingBanner />

            <div
              className="ml-4 rounded-full p-3 px-6 inline-block cursor-pointer"
              style={{ backgroundColor: "#009605", borderBottom: "2px solid #000000" }}
              onClick={() => navigate("/zbr-faq")}
            >
              <span className="text-sm text-white font-bold">FAQs</span>
            </div>
          </>
        )}
      </div>
      
      {/* Bottom Navigation - Hide for coming soon activities */}
      {/* {!isComingSoon && <BottomNav />} */}
    </>
  );
};

export default Home;
