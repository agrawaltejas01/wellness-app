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
import { formatDate } from "../../utils/date";
import { formatTimeIntToAmPm } from "../../utils/date";

const Highlights = () => {
  const navigate = useNavigate();
  const [videoHighlights, setVideoHighlights] = useState<any[]>([]);
  const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
  const [navigateUrl, setNavigateUrl] = useState<string>("");
  const [stateUrl, setStateUrl] = useState<string>("");
  const userId = userDetails.id;
  const [showSelectHighlightsModal, setShowSelectHighlightsModal] = useState(false);
  const [showSelectHighlightsBatchesModal, setShowSelectHighlightsBatchesModal] = useState(false);
  const [selectedBatchHighlightsModal, setSelectedBatchHighlightsModal] = useState(false);
  const [batchIdHighlights, setBatchIdHighlights] = useState(0);
  const [selectedMatchHighlights, setSelectedMatchHighlights] = useState(false);
  const [matchIdHighlights, setMatchIdHighlights] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
  const [finalSelectedHighlight, setFinalSelectedHighlight] = useState<any>(null);
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
    
    Mixpanel.track("clicked_highlights_on_home_page", {
      userId: userId,
    });

    if(videoHighlights && videoHighlights.length > 0) {
      // const userHighlight = videoHighlights.find((highlight: any) => highlight.user_id == userId);
      // const userHighlight = videoHighlights[0].user_highlights[0];
      // if(userHighlight) {
        // setShowSelectHighlightsModal(true);
        // navigate("/highlights", {state: {url: userHighlight.highlight_link}});
        // setShowStatsModal(true);
        setShowSelectHighlightsBatchesModal(true);
      // }
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
          <SelectHighlight highlights={videoHighlights} setFinalSelectedHighlight={setFinalSelectedHighlight} matchId={matchIdHighlights} batchId={batchIdHighlights} setShowStatsModal={setShowStatsModal} setShowSelectHighlightsModal={setShowSelectHighlightsModal} />
      </div>
    </BottomUpModal>)}
    {/* {showStatsModal && (<BottomUpModal
      isOpen={showStatsModal}
      onClose={() => setShowStatsModal(false)}
      title=""
      showCloseButton={false}
    >
      <Stats />
      <div className="h-screen" />
    </BottomUpModal>)} */}
    {showSelectHighlightsBatchesModal && (<BottomUpModal
      isOpen={showSelectHighlightsBatchesModal}
      onClose={() => setShowSelectHighlightsBatchesModal(false)}
      title="Select Batches"
      borderBottom={true}
      showCloseButton={false}
    >
      <div className="flex flex-col gap-2 h-full px-4 pb-4">
        {videoHighlights.filter((highlight: any, index: number, self: any[]) => 
          // This line ensures that only the first occurrence of each unique batch_id remains in the filtered array,
          // effectively removing duplicates by returning true only for the first match of each batch_id.
          index === self.findIndex((h: any) => h.batch_id === highlight.batch_id)
        ).map((highlight: any) => (
          <div key={highlight.id} className="flex flex-row justify-between px-2 py-2 " onClick={() => {
            setSelectedBatchHighlightsModal(true);
            setBatchIdHighlights(highlight.batch_id);
            setShowSelectHighlightsBatchesModal(false);
          }}> 
            <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 w-full px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span className="text-sm font-semibold text-gray-800">{highlight.batch_name}</span>
              <div className="flex flex-row gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(highlight.date)["date suffix"]}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTimeIntToAmPm(highlight.start_time || 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-screen" />
    </BottomUpModal>)}
    {selectedBatchHighlightsModal && (<BottomUpModal
      isOpen={selectedBatchHighlightsModal}
      onClose={() => setSelectedBatchHighlightsModal(false)}
      title="Selected Batch Highlights"
      borderBottom={true}
      showCloseButton={false}
      maxHeight="100%"
    >
      <div className="flex flex-col gap-2 px-2 mt-2">
        {videoHighlights.filter((highlight: any, index: number, self: any[]) => 
          index === self.findIndex((h: any) => h.match_id === highlight.match_id)
        ).map((highlight: any) => (
          <div
            key={highlight.id}
            className="flex flex-row items-center gap-4 px-4 py-3 rounded-2xl bg-white/90 border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
            onClick={() => {
              setShowSelectHighlightsModal(true);
              setMatchIdHighlights(highlight.match_id);
              setSelectedBatchHighlightsModal(false);
            }}
          >
            <div className="flex flex-col">
              <span className="text-base font-semibold text-gray-900">Match <span className="text-indigo-600">#{highlight.match_id}</span></span>
              <span className="text-xs text-gray-500 mt-1">Highlight</span>
            </div>
            <div className="flex-1 flex justify-end items-center">
              <button
                className="px-3 py-1 text-xs rounded-md bg-indigo-50 text-indigo-600 font-medium border border-indigo-100 shadow-sm hover:bg-indigo-100 focus:outline-none transition"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="h-screen" />
    </BottomUpModal>)}
    </> : <></>
  );
};

export default Highlights;