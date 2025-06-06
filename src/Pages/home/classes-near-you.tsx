import { Flex } from "antd";

import { navigate, RouteComponentProps } from "@reach/router";
import { Mixpanel } from "../../mixpanel/init";
import activityToSvgMap from "../../images/class-images/activity-map";
import { toLetterCase } from "../../utils/string-operation";
import { useEffect, useState } from "react";

interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}

async function navigateToHome(activity: string) {
  Mixpanel.track("clicked_classes_tile_home", {
    activity,
  });
  return await navigate("/", {
    state: {
      activitySelected: activity,
      activitySelectedFromFilters: activity,
      showClassesNearYouFilters: false,
    },
    replace: true,
  });
}

const classTile = (activity: string, isFromApp: boolean, pastAppBookings: PastAppBookingObject) => (
  <Flex
    onClick={async () => {
      Mixpanel.track("clicked_activity_tile_on_home_page", { activity });
      await navigate(`/${activity}`);
    }}
    justify="center"
    align="center"
    vertical
  >
    <Flex>{activityToSvgMap(activity)}</Flex>
    {/* <span style={{ marginTop: "4px" }}> {toLetterCase(activity)} </span> */}
  </Flex>
);

const trendingTile = (isFromApp: boolean, pastAppBookings: PastAppBookingObject) => {
  return (
    <div
      className="trendingBox"
      onClick={async () => {
        Mixpanel.track("clicked_activity_tile_on_home_page", {
          activity: "trending",
        });
        await navigate(`/trending`);
      }}
    >
      <div className="trendingWrapper">
        <span className="trending">Trending</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="17"
            viewBox="0 0 20 17"
            fill="none"
          >
            <path
              d="M14 5L15.6205 9.37946L20 11L15.6205 12.6205L14 17L12.3795 12.6205L8 11L12.3795 9.37946L14 5Z"
              fill="#FFF7CC"
            />
            <path
              opacity="0.8"
              d="M3.5 0L4.44532 2.55468L7 3.5L4.44532 4.44532L3.5 7L2.55468 4.44532L0 3.5L2.55468 2.55468L3.5 0Z"
              fill="#FFF7CC"
            />
          </svg>
        </span>
      </div>
      <div className="zBox">on Zenfitx</div>
    </div>
  );
};

function createUpperFlexTiles(isFromApp: boolean, pastAppBookings: PastAppBookingObject) {
  return (
    <Flex
      style={{
        flex: 1,
        justifyContent: "space-around",
        marginBottom: "16px",
        gap: "8px",
      }}
    >
      <span>{trendingTile(isFromApp, pastAppBookings)}</span>
      <span> {classTile("badmintonKids", isFromApp, pastAppBookings)} </span>
      <span> {classTile("ride", isFromApp, pastAppBookings)} </span>
      <span>{classTile("badminton", isFromApp, pastAppBookings)}</span>
      <span>{classTile("strength", isFromApp, pastAppBookings)}</span>
      <span>{classTile("swimming", isFromApp, pastAppBookings)}</span>
      <span>{classTile("personaltraining", isFromApp, pastAppBookings)}</span>
    </Flex>
  );
}

function createLowerFlexTiles(isFromApp: boolean, pastAppBookings: PastAppBookingObject) {
  return (
    <Flex
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignContent: "center",
        gap: "8px",
      }}
    >
      <span>{classTile("yoga", isFromApp, pastAppBookings)}</span>
      <span>{classTile("pickleball", isFromApp, pastAppBookings)}</span>
      <span> {classTile("football", isFromApp, pastAppBookings)} </span>
      <span> {classTile("gym", isFromApp, pastAppBookings)} </span>
      <span> {classTile("zumba", isFromApp, pastAppBookings)} </span>
      <span> {classTile("boxing", isFromApp, pastAppBookings)} </span>
      <span> {classTile("gymming", isFromApp, pastAppBookings)} </span>
    </Flex>
  );
}

interface IClassesNearYou extends RouteComponentProps  {}

const ClassesNearYou: React.FC<IClassesNearYou> = () => {
  const [isFromApp, setIsFromApp] = useState(false);
  const [pastAppBookings, setPastAppBookings] = useState({});

  useEffect(() => {
    setIsFromApp(window?.isFromApp || false);
    setPastAppBookings(window?.pastAppBookings || {});
  }, []);

  return (
    <Flex flex={1} vertical style={{}}>
      <Flex flex={1} align="left" className="sectionHeading">
        <span style={{ marginRight: "12px" }}>Popular activities</span>
        <span className="separator" style={{ marginRight: "16px" }}></span>
      </Flex>

      <Flex flex={3}>
        <Flex flex={1} vertical>
          <div
            style={{
              width: "95vw",
              overflow: "auto",
              scrollbarWidth: "none",
              scrollBehavior: "smooth",
            }}
          >
            <Flex flex={1} wrap="nowrap">
              {createUpperFlexTiles(isFromApp, pastAppBookings)}
            </Flex>
            <Flex flex={1} wrap="nowrap">
              {createLowerFlexTiles(isFromApp, pastAppBookings)}
            </Flex>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ClassesNearYou;
