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
import IUser, { IPlusDetails } from "../../types/user";
import useAuthRedirect from "../auth/redirect-hook";
import { Mixpanel } from "../../mixpanel/init";
import LandingFooter from "../landing/Footer";
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

  activitySelected = activitySelectedFromFilters || activitySelected;
  showClassesNearYou = showClassesNearYouFilters == false ? false : true;
  const [activities, setActivities] = useState<string[]>([]);
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

  const { mutate: _getAllActivities } = useMutation({
    mutationFn: getAllActivities,
    onError: () => {
      errorToast("Error in getting activities near you");
    },
    onSuccess: (result) => {
      console.log("activities - ", result);
      setActivities(result.activities);
    },
  });

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

    if (!userDetails || (userDetails && userDetails.noOfBookings < 1)) {
      _getUserDeatils();
    }
    _getAllActivities();
    if(userDetails){
      const userId = JSON.parse(window.localStorage["zenfitx-user-details"]).id || null;
      _getPastAppBookings(userId)
      setGotPastAppBookings(true);
    }
    setGotPastAppBookings(true);
    _getGymsByActivities(activitySelected);

    // _getPlusDetailsOfUser(userDetails?.phone as string);
  }, [activitySelected]);

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
  if (!activities.length || !gotPastBookings) return <Loader />;

  return (
    <>
      <MetaPixel />
      {/* <PullToRefresh onRefresh={handleRefresh}> */}
      <div>
      <Flex flex={1} vertical style={{ overflowX: "hidden" }}>
        <div>
          <Space></Space>

          {/* {userDetails?.phone && <Flex flex={1}>
            <ProfileBanner />
          </Flex>} */}

          <Flex flex={3}>
            <HomeBannerV2 userDetails={userDetails as IUser} />
          </Flex>

          <LeaderboardHome activityId={1} />
          <div className="w-full mt-2 px-5">
            <Highlights />
          </div>

          <div className="w-full mt-2 px-5">
            <CoinsHomepage />
          </div>


          {showClassesNearYou ? (
            <Flex style={{ marginLeft: "16px" }} flex={3}>
              <ClassesNearYou />
            </Flex>
          ) : null}
        </div>

        <Flex flex={3} style={{ margin: "0 5%" }}>
          <CentersAroundYou
            activities={activities}
            activitySelected={activitySelected}
            gymCardsData={gymCardsData}
            showClassesNearYou={showClassesNearYou}
          />
        </Flex>
      </Flex>
      </div>
      <div className="flex flex-col fixed bottom-0 left-0 right-0 z-1000">
            <Feedback />
      </div>
      {/* </PullToRefresh> */}
    </>
  );
};

export default Home;
