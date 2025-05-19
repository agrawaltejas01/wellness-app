import { Flex } from "antd";

import { navigate, useNavigate } from "@reach/router";
import { IGymCard } from "../../types/gyms";
import { useEffect, useState } from "react";
import ActivityTiles from "../../components/activity-tiles";
import { concatAndUpperCaseActivities } from "../../utils/activities";

import { Rs } from "../../constants/symbols";
import { useAtom } from "jotai/react";
import { plusDetailsAtom, userDetailsAtom } from "../../atoms/atom";
import IUser, { IPlusDetails } from "../../types/user";
import { Mixpanel } from "../../mixpanel/init";
import { shouldShowDiscount } from "../../utils/offers";
import { discount } from "../../constants/gym-discount";
interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}

function getListOfCenters(
  gymCardsData: IGymCard[],
  plusDetails: IPlusDetails | null,
  userDetails: IUser | null,
  isFromApp: boolean,
  pastAppBookings: PastAppBookingObject 
) {
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
          d="M8.49984 8.66732C9.60441 8.66732 10.4998 7.77189 10.4998 6.66732C10.4998 5.56275 9.60441 4.66732 8.49984 4.66732C7.39527 4.66732 6.49984 5.56275 6.49984 6.66732C6.49984 7.77189 7.39527 8.66732 8.49984 8.66732Z"
          stroke="#4F4F4F"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.49984 14.6673C11.1665 12.0007 13.8332 9.61284 13.8332 6.66732C13.8332 3.7218 11.4454 1.33398 8.49984 1.33398C5.55432 1.33398 3.1665 3.7218 3.1665 6.66732C3.1665 9.61284 5.83317 12.0007 8.49984 14.6673Z"
          stroke="#4F4F4F"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const discountIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_1132_11447)">
          <path
            d="M6.13476 13.7346C6.35326 13.7057 6.57399 13.7649 6.74804 13.899L7.5502 14.5145C7.81536 14.7182 8.18422 14.7182 8.44864 14.5145L9.28117 13.8753C9.43671 13.756 9.63299 13.7035 9.82705 13.7294L10.8684 13.8664C11.1995 13.9101 11.5188 13.7257 11.6469 13.4168L12.0476 12.4479C12.1224 12.2665 12.2661 12.1228 12.4476 12.0479L13.4164 11.6472C13.7252 11.5198 13.9097 11.1998 13.866 10.8687L13.7341 9.86504C13.7052 9.64653 13.7645 9.4258 13.8986 9.25173L14.5141 8.44953C14.7178 8.18435 14.7178 7.81547 14.5141 7.55103L13.8749 6.71846C13.7556 6.56291 13.703 6.36662 13.7289 6.17255L13.866 5.1311C13.9097 4.8 13.7252 4.48075 13.4164 4.3526L12.4476 3.95187C12.2661 3.87706 12.1224 3.73336 12.0476 3.55189L11.6469 2.58302C11.5195 2.27414 11.1995 2.0897 10.8684 2.13341L9.82705 2.27044C9.63299 2.29711 9.43671 2.24451 9.28191 2.126L8.44938 1.48676C8.18422 1.28306 7.81536 1.28306 7.55094 1.48676L6.71842 2.126C6.56288 2.24451 6.3666 2.29711 6.17254 2.27192L5.13114 2.13489C4.80006 2.09119 4.48083 2.27563 4.35269 2.58451L3.95272 3.55337C3.87717 3.7341 3.73348 3.8778 3.55276 3.95336L2.58395 4.35335C2.27508 4.48149 2.09066 4.80074 2.13436 5.13184L2.27138 6.17329C2.29656 6.36736 2.24398 6.56365 2.12547 6.71846L1.48626 7.55103C1.28257 7.81621 1.28257 8.18509 1.48626 8.44953L2.12547 9.2821C2.24472 9.43765 2.2973 9.63394 2.27138 9.82801L2.13436 10.8695C2.09066 11.2006 2.27508 11.5198 2.58395 11.648L3.55276 12.0487C3.73422 12.1235 3.87791 12.2672 3.95272 12.4487L4.35343 13.4175C4.48083 13.7264 4.8008 13.9109 5.13188 13.8672L6.13476 13.7346Z"
            fill="#0B9C5D"
          />
          <path
            d="M6.3335 6.00065C6.3335 6.18475 6.18426 6.33398 6.00016 6.33398C5.81607 6.33398 5.66683 6.18475 5.66683 6.00065C5.66683 5.81656 5.81607 5.66732 6.00016 5.66732C6.18426 5.66732 6.3335 5.81656 6.3335 6.00065Z"
            fill="#0B9C5D"
          />
          <path
            d="M10.3335 10.0007C10.3335 10.1847 10.1843 10.334 10.0002 10.334C9.81607 10.334 9.66683 10.1847 9.66683 10.0007C9.66683 9.81656 9.81607 9.66732 10.0002 9.66732C10.1843 9.66732 10.3335 9.81656 10.3335 10.0007Z"
            fill="#0B9C5D"
          />
          <path
            d="M6.00016 6.00065H6.00683M10.0002 10.0007H10.0068M10.6668 5.33398L5.3335 10.6673M6.13476 13.7346C6.35326 13.7057 6.57399 13.7649 6.74805 13.899L7.5502 14.5145C7.81536 14.7182 8.18422 14.7182 8.44864 14.5145L9.28117 13.8753C9.43671 13.756 9.63299 13.7035 9.82705 13.7294L10.8684 13.8664C11.1995 13.9101 11.5188 13.7257 11.6469 13.4168L12.0476 12.4479C12.1224 12.2665 12.2661 12.1228 12.4476 12.0479L13.4164 11.6472C13.7252 11.5198 13.9097 11.1998 13.866 10.8687L13.7341 9.86504C13.7052 9.64653 13.7645 9.4258 13.8986 9.25173L14.5141 8.44953C14.7178 8.18435 14.7178 7.81547 14.5141 7.55103L13.8749 6.71846C13.7556 6.56291 13.703 6.36662 13.7289 6.17255L13.866 5.1311C13.9097 4.8 13.7252 4.48075 13.4164 4.3526L12.4476 3.95187C12.2661 3.87706 12.1224 3.73336 12.0476 3.55189L11.6469 2.58302C11.5195 2.27414 11.1995 2.0897 10.8684 2.13341L9.82705 2.27044C9.63299 2.29711 9.43671 2.24451 9.28191 2.126L8.44938 1.48676C8.18422 1.28306 7.81536 1.28306 7.55094 1.48676L6.71842 2.126C6.56288 2.24451 6.3666 2.29711 6.17254 2.27192L5.13114 2.13489C4.80006 2.09119 4.48083 2.27563 4.35269 2.58451L3.95272 3.55337C3.87717 3.7341 3.73348 3.8778 3.55276 3.95336L2.58395 4.35335C2.27508 4.48149 2.09066 4.80074 2.13436 5.13184L2.27138 6.17329C2.29656 6.36736 2.24398 6.56365 2.12547 6.71846L1.48626 7.55103C1.28257 7.81621 1.28257 8.18509 1.48626 8.44953L2.12547 9.2821C2.24472 9.43765 2.2973 9.63394 2.27138 9.82801L2.13436 10.8695C2.09066 11.2006 2.27508 11.5198 2.58395 11.648L3.55276 12.0487C3.73422 12.1235 3.87791 12.2672 3.95272 12.4487L4.35343 13.4175C4.48083 13.7264 4.8008 13.9109 5.13188 13.8672L6.13476 13.7346ZM6.3335 6.00065C6.3335 6.18475 6.18426 6.33398 6.00016 6.33398C5.81607 6.33398 5.66683 6.18475 5.66683 6.00065C5.66683 5.81656 5.81607 5.66732 6.00016 5.66732C6.18426 5.66732 6.3335 5.81656 6.3335 6.00065ZM10.3335 10.0007C10.3335 10.1847 10.1843 10.334 10.0002 10.334C9.81607 10.334 9.66683 10.1847 9.66683 10.0007C9.66683 9.81656 9.81607 9.66732 10.0002 9.66732C10.1843 9.66732 10.3335 9.81656 10.3335 10.0007Z"
            stroke="#EDF8F4"
            stroke-width="0.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1132_11447">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const exclusiveIcon = () => {
    return (
      <div className="specialWrap">
        <span className="specialTxt">Trending</span>

        <span className="specialIcon">
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
        </span>
      </div>
    );
  };

  const priceCard = (price: number, showDiscount: boolean, maxDiscount: number, offerPercentage: number, discountType: string) => {
    let finalPrice = (price - maxDiscount) >  (price *  (100 - offerPercentage) / 100) ? (price - maxDiscount) : (price * (100 - offerPercentage) / 100)
    if(discountType == 'FLAT'){
      finalPrice = price - price * offerPercentage / 100;
    }
    if(!showDiscount){
      finalPrice = price;
    }
    console.log({price, showDiscount, finalPrice, maxDiscount, offerPercentage});
    return showDiscount ? (
      <div className="dCard">
        <div className="dPrice">₹{Math.floor(finalPrice)}</div>
        <div className="sPrice slash">₹{price}</div>
        <div className="sPrice">onwards</div>
      </div>
    ) : (
      <div className="dCard">
        <div className="dPrice">
          {Rs}
          {price}
        </div>
        <div className="sPrice">onwards</div>
      </div>
    );
  };

  const cardWidget = (gymCard: IGymCard, isFromApp: boolean, pastAppBookings: PastAppBookingObject) => {
    console.log(gymCard);
    const { medias, name, activities, area, minPrice, isExclusive, maxDiscount, offerPercentage, discountType } = gymCard;
    console.log(medias, "media");

    let showDiscount = shouldShowDiscount(gymCard, userDetails, isFromApp, pastAppBookings, null);
    const discountText = discountType == 'PERCENTAGE' ? `${offerPercentage}% off upto ${Rs}${maxDiscount} on your 1st booking at this center` :
                         discountType == 'FLAT' ? `FLAT ${offerPercentage}% off on your 1st booking at this center` : ``;

    console.log({minPrice});
    return (
      <div
        className="cardWrapper"
        onClick={() => {
          navigate(`/gym/${gymCard.gymId}`, {
            state: { gymId: gymCard.gymId.toString() }
          });
        }}
        key={gymCard.gymId}
      >
        <div className="activityImg1">
          {isExclusive && <span className="sWrap">{exclusiveIcon()}</span>}
          {medias.length>0 &&<img src={medias[0]} className="activityImg1Img" alt="activity pic" />}
        </div>
        <div
          // className="activityDetailWrapper"
          className={
            showDiscount ? "activityDetailWrapper2" : "activityDetailWrapper"
          }
        >
          <div className="activityDetail">
            <div className={name.length<44 ? name.length > 22 ? "nameInc" : "name":'nameNoheight'}>
              <span>{name}</span> {priceCard(minPrice, showDiscount, maxDiscount, offerPercentage, discountType)}
            </div>
            <div className="activity">
              {concatAndUpperCaseActivities(activities?.slice(0, 8))}
            </div>
            <div className="separator"></div>
            {area && <div className="location">
              {locationIcon()}
              {area}
            </div>}
          </div>

          {showDiscount && (
            <div className="discount">
              <div>
                {discountIcon()}
                {/* <span className="dTxt">{discountTxt}</span> */}
                <span className="dTxt">{
                discount[gymCard.gymId as keyof typeof discount].replace("Rs.", `₹`)
                }</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Flex flex={1} vertical justify="space-evenly" style={{ width: "100%" }}>
      {/* {generateCards} */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {gymCardsData.map((gymCard) => {
          return cardWidget(gymCard, isFromApp, pastAppBookings);
        })}
      </div>
    </Flex>
  );
}


interface ICentersNearYou {
  activities: string[];
  activitySelected?: string;
  gymCardsData: IGymCard[];
  showClassesNearYou: boolean;
}



const CentersAroundYou: React.FC<ICentersNearYou> = ({
  activities,
  activitySelected,
  gymCardsData,
  showClassesNearYou
}) => {
  const navigate = useNavigate();
  const [plusDetails] = useAtom(plusDetailsAtom);
  const [userDetails] = useAtom(userDetailsAtom);

  const [isFromApp, setIsFromApp] = useState(false);
  const [pastAppBookings, setPastAppBookings] = useState({});

  useEffect(() => {
    setIsFromApp(window?.isFromApp || false);
    setPastAppBookings(window?.pastAppBookings || {});
  }, []);

  const activityTilesOnClick = async (activity: string) => {
    if (navigate) {
      Mixpanel.track("clicked_activity_pill_home", {
        activity,
      });

      if (activity === "all") showClassesNearYou = true;

      await navigate("/", {
        state: {
          activitySelected: activity,
          activitySelectedFromFilters: activity,
          showClassesNearYouFilters: showClassesNearYou,
        },
        replace: true,
      });
    }
  };

  return (
    <Flex
      flex={1}
      vertical
      style={{ marginTop: "16px" }}
      justify="space-evenly"
    >
      <Flex
        flex={2}
        align="left"
        className="sectionHeading"
        style={{ paddingBottom: "unset" }}
      >
        <span style={{ marginRight: "12px" }}>Fitness centers around you</span>
        <span className="separator"></span>
      </Flex>

      <Flex flex={1}>
        <ActivityTiles
          activities={activities}
          activitySelected={(activitySelected as string) || "all"}
          onClickFunction={activityTilesOnClick}
        />
      </Flex>

      <Flex flex={4} style={{}} id="scrollThis">
        {getListOfCenters(gymCardsData, plusDetails, userDetails, isFromApp, pastAppBookings)}
      </Flex>
    </Flex>
  );
};

export default CentersAroundYou;
