import highlights from "../../images/home/badminton-player.png";
import {ReactComponent as RightArrow} from "../../images/home/right-arrow.svg"
import { useNavigate } from "@reach/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getHighlights } from "../../apis/highlights/highlights";
import { BottomUpModal } from "../profile/half-page-modal";
import SelectHighlight from "./select-highlight";
import { Mixpanel } from "../../mixpanel/init";
// import Stats from "../highlights/stats";
import { formatDate } from "../../utils/date";
import highlightImage from "../../images/home/highlight.jpeg";
import { formatTimeIntToAmPm } from "../../utils/date";

const EMPTY_HIGHLIGHTS_BG_URL = "https://zfx-gyms.zenfitx.link/highlights/sample.gif";

const Highlights = ({leftComponentHeight, videoHighlights}: {leftComponentHeight: number, videoHighlights: any[]}) => {
  const navigate = useNavigate();
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
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    setHeight(leftComponentHeight);
  }, [leftComponentHeight]);

  const handleNavigate = () => {
    
    Mixpanel.track("clicked_highlights_on_home_page", {
      userId: userId,
    });

    if(videoHighlights && videoHighlights.length > 0) {
      // const userHighlight = videoHighlights.find((highlight: any) => highlight.user_id == userId);
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
    <div 
                    className="w-1/2 border rounded-3xl overflow-hidden flex relative"
                    style={{ height: height ? `${height}px` : 'auto', 
                      backgroundImage: `url('${EMPTY_HIGHLIGHTS_BG_URL}')`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'repeat',
                      backgroundPosition: 'center',
                    }}
                    onClick={handleNavigate}
                >
                    {/* <img src={highlightImage} alt="Highlight" className="w-full h-full object-cover" /> */}
                    <div className="absolute top-0 left-0 w-full p-2 md:p-3 flex justify-center" style={{ backgroundColor: '#EBEBEB' }}>
                        <span className="text-black md:text-base lg:text-lg text-xs">Your last highlight!</span>
                    </div>
                    <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                        <div className="relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                <defs>
                                    <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#009605" />
                                        <stop offset="100%" stopColor="#BCAF32" />
                                    </linearGradient>
                                </defs>
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="22"
                                    fill="none"
                                    stroke="url(#borderGradient)"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                />
                            </svg>
                            <div className="flex items-center justify-center w-full h-full">
                                <RightArrow className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
                            </div>
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
    </> : <div
      className="w-1/2 border rounded-3xl flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${EMPTY_HIGHLIGHTS_BG_URL}')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        height: leftComponentHeight ? `${leftComponentHeight}px` : 'auto'
      }}
    >
      <span className="text-white md:text-base lg:text-lg text-sm text-center px-4 drop-shadow">Your Highlight will appear here</span>
    </div>
  );
};

export default Highlights;