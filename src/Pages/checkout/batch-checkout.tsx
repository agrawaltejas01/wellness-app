import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { Flex } from "antd";
import BatchInfoOnCheckout from "./batch-info";
import BatchPrice from "./batch-price";
import BatchCheckoutPlusPrice from "./batch-checkout-plus-price";
import BookNowFooter from "./book-now-footer";
import { IBatch, IGymDetails } from "../../types/gyms";
import { useEffect, useRef, useState } from "react";
import {
  EBookNowComingFromPage,
  ECheckoutType,
  ESelectedPlan,
} from "../../types/checkout";
import { plusDetailsAtom, userDetailsAtom } from "../../atoms/atom";
import { useAtom } from "jotai/react";
import activityToSvgMap from "../../images/class-images/activity-map";
import { Mixpanel } from "../../mixpanel/init";
import {
  getActivityById,
  getGymById,
} from "../../apis/gym/activities";
import { useMutation } from "@tanstack/react-query";
import { errorToast } from "../../components/Toast";
import { formatDate, formatTimeIntToAmPm } from "../../utils/date";
import { createMapsLink } from "../../utils/string-operation";
import { ReactComponent as LocationLogo } from "../../images/home/location.svg";
import MetaPixel from "../../components/meta-pixel";
import Loader from "../../components/Loader";

interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}
interface IClassCheckout extends RouteComponentProps {
  // batchDetails?: IBatch;
  // gymData?: IGymDetails;
}

function MixpanelBatchCheckoutInit(batchDetails: IBatch, gymData: IGymDetails) {
  Mixpanel.track("open_batch_checkout_page", {
    ...batchDetails,
    ...gymData,
  });
}

const BatchCheckout: React.FC<IClassCheckout> = () => {
  const [userDetails] = useAtom(userDetailsAtom);

  const handleSwipeRight = async () => {
    // Add your right swipe logic here
    navigateToHome();
  };
  const batchId = window.location.pathname.split("/")[3];
  const [selectedPlan, setSelectedPlan] = useState<ESelectedPlan>(
    ESelectedPlan.BATCH,
  );
  const [batchDetails, setBatchDetails] = useState<IBatch>();
  const [gym, setGym] = useState<IGymDetails | null>(null);
  const [totalAmount, setTotalAmount] = useState();

  const [plusDetails] = useAtom(plusDetailsAtom);
  const mixpanelSet = useRef(false);

  const [isClicked, setIsClicked] = useState<Boolean>(false);
  const [gotBatchDetails, setBatchDetailsCheck] = useState<Boolean>(false);
  const [gotGymDetails, setGymDetailsCheck] = useState<Boolean>(false);
  const [loading, setLoading] = useState(true);

  const [isFromApp, setIsFromApp] = useState(false);
  const [pastAppBookings, setPastAppBookings] = useState({});
  const slotsRemainingVisible = [6, 22, 24, 25, 27, 28, 31, 32];

  useEffect(() => {
    // Get isFromApp from window object
    const userSource = window?.platformInfo?.platform || "web";
    const appFlag = userSource !== "web";
    setIsFromApp(appFlag);

    // Get pastAppBookings from window object or initialize empty
    const storedBookings = window?.pastAppBookings || {};
    setPastAppBookings(storedBookings);
  }, []);

  const gymId = batchDetails?.gymId;

  useEffect(() => {
    if (gym && batchDetails) {
      mixpanelSet.current = true;
    }
  }, [gym, batchDetails]);

  const { mutate: _getActivityById } = useMutation({
    mutationFn: getActivityById,
    onSuccess: (result) => {
      console.log(result.batch);
      setBatchDetails(result.batch);
      setLoading(false);
    },
    onError: (error) => {
      errorToast("Error in getting gym data");
    },
  });

  const { mutate: _getGymById } = useMutation({
    mutationFn: getGymById,
    onSuccess: (result) => {
      setGym(result.gym);
      setGymDetailsCheck(true);
      //   MixpanelGymInit(result.gym);
    },
    onError: (error) => {
      errorToast("Error in getting gym data");
    },
  });

  useEffect(() => {
    _getActivityById(batchId);
  }, []);
  useEffect(() => {
    if (batchDetails?.gymId) {
      _getGymById(String(batchDetails.gymId));
      setBatchDetailsCheck(true);
    }
  }, [batchDetails]);

  useEffect(() => {
    const shareButton = document.getElementById("share-button");
    shareButton?.addEventListener("click", () => {
      if (navigator.share && gotGymDetails && gotBatchDetails) {
        navigator
          .share({
            title: "ZenfitX",
            text: `Hey, Join me for ${batchDetails?.activityName} at ${("0" + batchDetails?.startTime.toString()).slice(-4).substring(0, 2)}:00 on ${new Date(`${batchDetails?.date}`).toDateString()} at the ${gym?.name}. Let's sweat it out together! 😬`,
            url: window.location.href,
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      } else {
        console.log("Share not supported on this browser, do it the old way.");
      }
    });
    shareButton?.removeEventListener("click", () => {
      setIsClicked(false);
    });
  }, [isClicked && gotBatchDetails && gotGymDetails]);

  const logoTsx = (
    <Flex flex={1}>
      {(batchDetails?.activity &&
        activityToSvgMap(batchDetails.activity.toLowerCase() as string)) ||
        null}
    </Flex>
  );

  const navigateToHome = () => {
    navigate(`/gym/${gymId}/batch`);
  };

  const leftDivider = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="111"
        height="2"
        viewBox="0 0 111 2"
        fill="none"
      >
        <path
          d="M0 1H110.5"
          stroke="url(#paint0_linear_1369_5909)"
          stroke-opacity="0.7"
          stroke-width="0.8"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1369_5909"
            x1="0"
            y1="1.5"
            x2="110.5"
            y2="1.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="#9E9E9E" />
          </linearGradient>
        </defs>
      </svg>
    );
  };
  const rightDivider = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="111"
        height="2"
        viewBox="0 0 111 2"
        fill="none"
      >
        <path
          d="M0.5 1H111"
          stroke="url(#paint0_linear_1369_5911)"
          stroke-opacity="0.7"
          stroke-width="0.8"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1369_5911"
            x1="0.5"
            y1="1.5"
            x2="111"
            y2="1.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#9E9E9E" />
            <stop offset="1" stop-color="white" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const shareAndBack = () => {
    return (
      <div className="shareAndBack">
        <span className="Btn" onClick={() => navigateToHome()}>
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
        <span
          className="Btn"
          id="share-button"
          onClick={() => setIsClicked(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M7.15833 11.2587L12.85 14.5753M12.8417 5.42533L7.15833 8.74199M17.5 4.16699C17.5 5.5477 16.3807 6.66699 15 6.66699C13.6193 6.66699 12.5 5.5477 12.5 4.16699C12.5 2.78628 13.6193 1.66699 15 1.66699C16.3807 1.66699 17.5 2.78628 17.5 4.16699ZM7.5 10.0003C7.5 11.381 6.38071 12.5003 5 12.5003C3.61929 12.5003 2.5 11.381 2.5 10.0003C2.5 8.61961 3.61929 7.50033 5 7.50033C6.38071 7.50033 7.5 8.61961 7.5 10.0003ZM17.5 15.8337C17.5 17.2144 16.3807 18.3337 15 18.3337C13.6193 18.3337 12.5 17.2144 12.5 15.8337C12.5 14.4529 13.6193 13.3337 15 13.3337C16.3807 13.3337 17.5 14.4529 17.5 15.8337Z"
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

  const locationIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
      >
        <path
          d="M8.49935 8.66732C9.60392 8.66732 10.4993 7.77189 10.4993 6.66732C10.4993 5.56275 9.60392 4.66732 8.49935 4.66732C7.39478 4.66732 6.49935 5.56275 6.49935 6.66732C6.49935 7.77189 7.39478 8.66732 8.49935 8.66732Z"
          stroke="#05070B"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.49935 14.6673C11.166 12.0007 13.8327 9.61284 13.8327 6.66732C13.8327 3.7218 11.4449 1.33398 8.49935 1.33398C5.55383 1.33398 3.16602 3.7218 3.16602 6.66732C3.16602 9.61284 5.83268 12.0007 8.49935 14.6673Z"
          stroke="#05070B"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };
  const mapsLink = createMapsLink(
    batchDetails?.venueAddressLine1 || "",
    batchDetails?.venueAddressLine1 || "",
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* <SwipeHandler onSwipeRight={handleSwipeRight}> */}
      {/* <PullToRefresh onRefresh={handleRefresh}> */}
      <Flex
        flex={1}
        vertical
        style={{
          backgroundColor: "#F8F8F8",
          minHeight: "100vh",
        }}
      >
        {shareAndBack()}
        {batchDetails?.image && (
          <div style={{ clipPath: "ellipse(100% 93% at 50% 5%)" }}>
            <img
              width="360px"
              height="250px"
              className="activityImg"
              src={batchDetails?.image}
              alt="img"
            ></img>
          </div>
        )}
        <div className="activityContainer">
          <div className="activityHeading">
            <span style={{ maxWidth: "220px" }}>
              {batchDetails?.activityName}
              {batchDetails?.trainer && ` with ${batchDetails?.trainer}`}
            </span>
          </div>
          <div className="activityDate">
            <span>
              {batchDetails?.date
                ? formatDate(batchDetails.date)["date suffix"]
                : "Date not available"}
            </span>
            {batchDetails?.isDayPass ? (
              ""
            ) : (
              <>
                <span className="dot"></span>
                {formatTimeIntToAmPm(batchDetails?.startTime || 0)}
              </>
            )}
            <span className="dot"></span>{" "}
            {batchDetails?.isDayPass
              ? "All Day"
              : batchDetails?.DurationMin + " min" || "Duration not available"}
          </div>
          <div className="activityLoc">
            <span className="locIcon">{locationIcon()}</span>
            {gym?.name},{gym?.area}
          </div>
          {slotsRemainingVisible.includes(gym?.gymId || 0) &&
          batchDetails?.slots &&
          batchDetails?.slotsBooked >= 0 &&
          batchDetails?.slots != 1 ? (
            <div className="remainingSlots">
              <span>
                {batchDetails.slots - batchDetails.slotsBooked} spot(s) left out
                of {batchDetails?.slots}
              </span>
            </div>
          ) : (
            ""
          )}

          <div className="text-[#696969]">
            {[
              {
                title: "ABOUT THE ACTIVITY",
                content: batchDetails?.aboutTheActivity,
              },
              { title: "What To Expect?", content: batchDetails?.whatToExpect },
              { title: "What To Bring?", content: batchDetails?.whatToBring },
              { title: "More info", content: batchDetails?.moreInfo },
            ].map(
              (section) =>
                section.content && (
                  <div key={section.title} className="mb-4">
                    <div className="flex items-center justify-center text-[12px] font-semibold uppercase tracking-widest text-[#05070B] my-2 whitespace-nowrap">
                      {leftDivider()}
                      <span className="mx-3">{section.title}</span>
                      {rightDivider()}
                    </div>
                    <ol className="list-decimal pl-5 text-[14px]">
                      {section.content.split("\n").map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ol>
                  </div>
                ),
            )}
          </div>
          {batchDetails?.venue && (
            <div className="sectionAct">
              <div className="sectionActHeading">
                {leftDivider()}
                <span style={{ margin: "0px 12px" }}>Address</span>
                {rightDivider()}
              </div>
              <div className="locWrp locWrpCol">
                <div
                  className="baseTxt baseTxt1"
                  style={{ color: "#828081", marginLeft: "16px" }}
                >
                  <span
                    className="baseTxt"
                    style={{ color: "#828081", alignItems: "flex-start" }}
                  >
                    <LocationLogo
                      style={{ marginRight: "8px", marginTop: "4px" }}
                    />{" "}
                    <span style={{ color: "#828081", maxWidth: "80%" }}>
                      {batchDetails?.venue}
                    </span>
                  </span>
                  <span
                    style={{
                      textDecoration: "underline",
                      color: "#000",
                      minWidth: "30%",
                    }}
                    onClick={() => {
                      window.open(mapsLink);
                    }}
                  >
                    View on map
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {gym && (
          <BookNowFooter
            checkoutType={ECheckoutType.BATCH}
            batchDetails={batchDetails}
            gymData={gym}
            batchId={Number(batchId)}
            isFromApp={isFromApp}
            totalAmount={batchDetails?.price as number}
            comingFrom={EBookNowComingFromPage.BATCH_CHECKOUT_PAGE}
            forceBookNowCta={true}
          />
        )}
      </Flex>
      {/* </PullToRefresh> */}
      {/* </SwipeHandler> */}
      <MetaPixel />
    </>
  );
};

export default BatchCheckout;
