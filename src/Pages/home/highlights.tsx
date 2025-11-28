import highlights from "../../images/home/badminton-player.png";
import {ReactComponent as RightArrow} from "../../images/home/right-arrow.svg"
import { useNavigate } from "@reach/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getHighlights } from "../../apis/highlights/highlights";
import { BottomUpModal } from "../profile/half-page-modal";
import SelectHighlight from "./select-highlight";
import { Mixpanel } from "../../mixpanel/init";
import Stats from "../highlights/stats";

const Highlights = () => {
  const navigate = useNavigate();
  const [videoHighlights, setVideoHighlights] = useState<any[]>([]);
  const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
  const [navigateUrl, setNavigateUrl] = useState<string>("");
  const [stateUrl, setStateUrl] = useState<string>("");
  const userId = userDetails.id;
  const [showSelectHighlightsModal, setShowSelectHighlightsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const {mutate: _getHighlights} = useMutation({
    mutationFn: getHighlights,
    onSuccess: (result) => {
      if(result && result.length > 0) {
       setVideoHighlights(result);
      }
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      
      console.log("Highlights fetched");
    //   alert(videoHighlights);
    },
  });

  useEffect(() => {
    _getHighlights(userId);
  }, []);

  const handleNavigate = () => {
    if(videoHighlights && videoHighlights.length > 0) {
      const userHighlight = videoHighlights.find((highlight: any) => highlight.user_id == userId);
      // const userHighlight = videoHighlights[0].user_highlights[0];
      if(userHighlight) {
        // setShowSelectHighlightsModal(true);
        // navigate("/highlights", {state: {url: userHighlight.highlight_link}});
        setShowStatsModal(true);
      } else {
        setShowSelectHighlightsModal(true);
      } 
    } 
  }
  return (  
    videoHighlights.length > 0 ? <>
    <div className="flex flex-row rounded-3xl gap-2 px-4 py-2 justify-between shadow-[0_0_15px_rgba(0,0,0,0.1)] cursor-pointer"
     onClick={()=>{
      handleNavigate();
     }}>
      <div className="flex flex-row gap-2 justify-center px-2">
      <img src={highlights} alt="Highlights" style={{ width: "50px", height: "75px" }} />
        <div className="flex flex-col gap-1 px-6 justify-center">
          <h1 className="text-sm font-bold text-black">Your game highlight's ready.</h1>
          <h1 className="text-xs text-black">Checkout now!</h1>
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-center">
        <div className="flex flex-col justify-center"> 
          <RightArrow />
        </div>
      </div>
    </div>
    {showSelectHighlightsModal && (<BottomUpModal
      isOpen={showSelectHighlightsModal}
      onClose={() => setShowSelectHighlightsModal(false)}
      title="Select Highlights"
      borderBottom={true}
      showCloseButton={false}
    >
      <div className="flex flex-col gap-2">
          <SelectHighlight highlights={videoHighlights} setShowStatsModal={setShowStatsModal} setShowSelectHighlightsModal={setShowSelectHighlightsModal} />
      </div>
    </BottomUpModal>)}
    {showStatsModal && (<BottomUpModal
      isOpen={showStatsModal}
      onClose={() => setShowStatsModal(false)}
      title=""
      showCloseButton={false}
    >
      <Stats StatsProps={videoHighlights.find((highlight: any) => highlight.user_id == userId)} />
    </BottomUpModal>)}
    </> : <></>
  );
};

export default Highlights;