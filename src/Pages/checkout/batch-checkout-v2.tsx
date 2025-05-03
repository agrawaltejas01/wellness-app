import ScrollableContent from "../../components/ScrollableContent";
import WhatToBring from "./what-to-bring";
import CoplayerCard from "./coplayer-card";
import SpotsLeft from "./spots-left";
import WhatToExpect from "./what-to-expect";
import BookNowFooterV2 from "./book-now-footer-v2";
import {ReactComponent as BackButton} from '../../images/utils/back-button.svg';
import {ReactComponent as ShareButton} from '../../images/utils/share-button.svg';
import { navigate, RouteComponentProps } from "@reach/router";
import { IBatch, IGymDetails } from "../../types/gyms";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getActivityById, getGymById, getCoplayers } from "../../apis/gym/activities";
import { errorToast } from "../../components/Toast";
import BookNowFooter from "./book-now-footer";
import { EBookNowComingFromPage } from "../../types/checkout";
import { ECheckoutType } from "../../types/checkout";
import AboutTheActivity from "./about-the-activity";
import { convert24HourTo12Hour } from "../../utils/functions/utils";
import { formatDate, formatTimeIntToAmPm } from "../../utils/date";
import Circle from "../../components/circle";
import Loader from "../../components/Loader";

interface IClassCheckout extends RouteComponentProps {
}

interface IPlayer {
    name: string;
    level: string;
    noOfBookings: number;
    gamesPlayed: number;
}

const BatchCheckoutV2: React.FC<IClassCheckout> = () => {

    const [loading, setLoading] = useState(true);
    const [batchDetails, setBatchDetails] = useState<IBatch>();
    const [gym, setGym] = useState<IGymDetails | null>(null);
    const [gotBatchDetails, setBatchDetailsCheck] = useState<Boolean>(false);
    const [gotGymDetails, setGymDetailsCheck] = useState<Boolean>(false);
    const [spotsLeft, setSpotsLeft] = useState<number>(0);
    const [spotsTotal, setSpotsTotal] = useState<number>(0);
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [gotCoplayers, setGotCoplayers] = useState<boolean>(false);
    const [isFromApp, setIsFromApp] = useState(false);
    const [pastAppBookings, setPastAppBookings] = useState({});
    const { COPLAYER_CARD_ENABLED } = require("../../constants/activities");

    const batchId = window.location.pathname.split("/")[3];

    useEffect(() => {
      // Get isFromApp from window object
      const userSource = window?.platformInfo?.platform || "web";
      const appFlag = userSource !== "web";
      setIsFromApp(appFlag);
  
      // Get pastAppBookings from window object or initialize empty
      const storedBookings = window?.pastAppBookings || {};
      setPastAppBookings(storedBookings);
    }, []);
  
  const { mutate: _getActivityById } = useMutation({
      mutationFn: getActivityById,
      onSuccess: (result) => {
        setBatchDetails(result.batch);
      },
      onError: (error) => {
        errorToast("Error in getting gym data");
      },
      onSettled: () => {
        setLoading(false);
      },
    });

    const { mutate: _getGymById } = useMutation({
      mutationFn: getGymById,
      onSuccess: (result) => {
          setGym(result.gym);
          setGymDetailsCheck(true);
      },
      onError: (error) => {
          errorToast("Error in getting gym data");
      },
    });

    const { mutate: _getCoplayers } = useMutation({
        mutationFn: getCoplayers,
        onSuccess: (result) => {  
            setPlayers(result.map((player: any) => ({name: player.name,
                        userId: player.userId, 
                        level: player.skillLevel, 
                        noOfBookings: player.noOfGuests, 
                        gamesPlayed: player.activityBookCount})));
        },
        onError: (error) => {
            errorToast("Error in getting coplayers");
        },
    });
    
    const isCoplayerCardEnabled = COPLAYER_CARD_ENABLED.includes(batchDetails?.activity?.toUpperCase() || "");

    useEffect(() => {
        _getActivityById(batchId);
        _getCoplayers(batchId);
        setGotCoplayers(true);
        // setPlayers([{name: "Pratik", level: "Beginner", noOfBookings: 1, gamesPlayed: 0}, {name: "Nikita", level: "Amateur", noOfBookings: 2, gamesPlayed: 5}, {name: "Whiskey", level: "Intermediate", noOfBookings: 3, gamesPlayed: 23}]);
    }, []);

    useEffect(() => {
        if (batchDetails?.gymId) {
          _getGymById(String(batchDetails.gymId));
          setBatchDetailsCheck(true);
        }
    }, [batchDetails]);
    
    useEffect(() => {
        setSpotsLeft(batchDetails?.slots ? batchDetails?.slots - batchDetails?.slotsBooked : 0);
        setSpotsTotal(batchDetails?.slots ? batchDetails?.slots : 0);
    }, [batchDetails]);

    const gymId = batchDetails?.gymId;
    const activityName = batchDetails?.activityName ? batchDetails?.activityName : "";
    const activity = batchDetails?.activity ? batchDetails?.activity : "";
    const location = gym?.name ? gym?.name + (gym?.area ? ", " + gym.area : "") : "";

    const navigateToHome = () => {
        navigate(`/gym/${gymId}/batch`);
    }


  if(loading) {
      return <Loader />
  }

  return (
    <div className="flex flex-col">
        <div className="flex flex-col bg-gradient-to-r from-black to-transparent bg-cover bg-center"
             style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${require('../../images/utils/pickleball.png')})` }}>
          <div className="flex flex-row justify-between pl-2 pt-2 pr-2">
            <BackButton onClick={() => navigateToHome()} />
            <ShareButton />
          </div>
          <div className="flex flex-col px-6 text-white ">
            <p className="text-sm font-normal font-jakarta pt-3">{activity.toLowerCase()}</p>
            <p className="text-xl font-normal font-jakarta pt-1">{activityName}</p>
            <p className="text-xs font-normal font-jakarta pt-1">{location}</p>
            <div className="flex flex-row pt-1 pb-4 text-white font-jakarta text-2xl pt-3">
              <p className="text-white">{batchDetails?.date ? formatDate(batchDetails.date)["date suffix"] : "Date not available"}</p>
              <p className="dotWhite"></p>
              <p className="text-white">{formatTimeIntToAmPm(batchDetails?.startTime || 0)}</p>
              <p className="dotWhite"></p>
              <p className="text-white">{batchDetails?.DurationMin} mins</p>
            </div>
          </div>
        </div>
        <div>
        <ScrollableContent bottomPadding={100}>
          {isCoplayerCardEnabled && <SpotsLeft spotsLeft={spotsLeft} spotsTotal={spotsTotal} />}
          {isCoplayerCardEnabled && <CoplayerCard players={players} loading={!gotCoplayers} spotsLeft={spotsLeft} spotsTotal={spotsTotal}/>}
          {batchDetails?.aboutTheActivity && <AboutTheActivity aboutTheActivity={batchDetails?.aboutTheActivity} />}
          {batchDetails?.whatToExpect && <WhatToExpect whatToExpect={batchDetails?.whatToExpect} />}
          {batchDetails?.whatToBring && <WhatToBring whatToBring={batchDetails?.whatToBring} />}
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
        </ScrollableContent>
        </div>
      </div>
  )
  
};

export default BatchCheckoutV2; 

