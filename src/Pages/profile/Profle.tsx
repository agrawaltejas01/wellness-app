import { RouteComponentProps, navigate } from "@reach/router";
import { Flex } from "antd";
import UserDetails from "./user-details";
import NeedHelpBanner from "./need-help";
import DeleteAccountButton from "./delete-account";
import colors from "../../constants/colours";
import PlusClassRemaining from "./plus-classes-remaining";
import PastClasses from "./past-classes";
import UpcomingClasses from "./upcoming-classes";
import { useAtom } from "jotai/react";
import {
  afterLoginRedirectAtom,
  plusDetailsAtom,
  userDetailsAtom,
} from "../../atoms/atom";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getBookingOfUser } from "../../apis/user/bookings";
import { IBookings, IPlusDetails } from "../../types/user";
import { Mixpanel } from "../../mixpanel/init";
import LandingFooter from "../landing/Footer";
import MetaPixel from "../../components/meta-pixel";
import Loader from "../../components/Loader";
import {handleRefresh} from '../../utils/refresh';
import SwipeHandler from "../../components/back-swipe-handler";

interface IProfile extends RouteComponentProps {}

function MixpanelProfileInit(noOfBookings: number, plusDetails?: IPlusDetails) {
  Mixpanel.track("open_profile_page", {
    noOfBookings,
    // ...plusDetails,
  });
}

const Profile: React.FC<IProfile> = () => {
  const [_, setAfterLoginRedirectAtom] = useAtom(afterLoginRedirectAtom);

  const [pastBookings, setPastBookings] = useState<IBookings[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<IBookings[]>([]);
  const [loading, setLoading] = useState(true);

  const { mutate: _getBookingOfUser } = useMutation({
    mutationFn: getBookingOfUser,
    onSuccess: (result) => {
      setPastBookings(result.bookings.pastBookings);
      setUpcomingBookings(result.bookings.upcomingBookings);
      setLoading(false);
      MixpanelProfileInit(
        result.bookings.pastBookings.length +
          result.bookings.upcomingBookings.length
        // plusDetails as IPlusDetails
      );
    },
    onError: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    let userDetailsInLocalStorage = localStorage.getItem(
      "zenfitx-user-details"
    );
    if (!userDetailsInLocalStorage) {
      setAfterLoginRedirectAtom({
        afterLoginUrl: "/profile",
      });

      navigate("/login");
    }

    _getBookingOfUser();
  }, []);

  const handleSwipeRight = async () => {
    navigate("/");
  }

  const shareAndBack = () => {
    return (
      <div className="shareAndBack">
        <span className="Btn" onClick={() => navigate("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15.8327 10.0003H4.16602M4.16602 10.0003L9.99935 15.8337M4.16602 10.0003L9.99935 4.16699"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    );
  };

  if(loading) return <Loader />

  return (
    <>
      <MetaPixel />
    {/* <SwipeHandler onSwipeRight={handleSwipeRight}> */}
    {/* <PullToRefresh onRefresh={handleRefresh}> */}
    <Flex
      flex={1}
      vertical
      style={{ minHeight: "100vh", background: colors.screenBackground }}
    >
      {shareAndBack()}
      <Flex flex={1} align="flex-start">
        <UserDetails />
      </Flex>

      <Flex flex={4} vertical>
        {/* {plusDetails?.isPlusMember ? (
          <Flex flex={1} align="flex-start">
            <PlusClassRemaining />
          </Flex>
        ) : null} */}

        {upcomingBookings.length ? (
          <Flex flex={1} align="center">
            <UpcomingClasses bookings={upcomingBookings} />
          </Flex>
        ) : null}

        {pastBookings.length ? (
          <Flex flex={1} align="center">
            <PastClasses bookings={pastBookings} />
          </Flex>
        ) : null}
      </Flex>
      

      <Flex flex={1} align="flex-end">
        <NeedHelpBanner />
      </Flex>
      
      <Flex flex={1} align="flex-end">
        <DeleteAccountButton />
      </Flex>

      <Flex flex={1} vertical align="flex-end">
        <LandingFooter />
      </Flex>

      {/* <Flex flex={1} vertical align="flex-end">
        <Flex flex={1}>
          <NeedHelpBanner />
        </Flex>
        <Flex flex={1}>
        <LandingFooter />
        </Flex>
      </Flex> */}
    </Flex>
    {/* </PullToRefresh> */}
    {/* </SwipeHandler> */}
    </>
  );
};

export default Profile;
