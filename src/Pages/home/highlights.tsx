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
import { ReactComponent as BackButtonCheckout } from '../../images/utils/back-button-checkout.svg';

const EMPTY_HIGHLIGHTS_BG_URL = "https://zfx-gyms.zenfitx.link/highlights/sample.gif";

const Highlights = ({leftComponentHeight, videoHighlights}: {leftComponentHeight: number, videoHighlights: any[]}) => {
  const navigate = useNavigate();
  const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
  const [navigateUrl, setNavigateUrl] = useState<string>("");
  const [stateUrl, setStateUrl] = useState<string>("");
  const userId = userDetails.id;

  // Check if the user hasn't seen ANY highlights (user_id not present in any highlight)
  const hasNewHighlights = videoHighlights.length > 0 && videoHighlights.every((highlight: any) => {
    const userIds = highlight.user_id ? highlight.user_id.split(',') : [];
    return !userIds.includes(userId.toString());
  });
  // const hasNewHighlights = false;
  const [showSelectHighlightsModal, setShowSelectHighlightsModal] = useState(false);
  const [showAllHighlightsModal, setShowAllHighlightsModal] = useState(false);
  const [matchIdHighlights, setMatchIdHighlights] = useState(0);
  const [batchIdHighlights, setBatchIdHighlights] = useState(0);
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
        setShowAllHighlightsModal(true);
      // }
    } 
  }
  return (  
    videoHighlights.length > 0 ? <>
    <div
                    className="w-1/2 border rounded-3xl overflow-hidden flex relative"
                    style={{ height: height ? `${height}px` : 'auto',
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${EMPTY_HIGHLIGHTS_BG_URL}')`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'repeat',
                      backgroundPosition: 'center',
                    }}
                    onClick={handleNavigate}
                >
                    {/* <img src={highlightImage} alt="Highlight" className="w-full h-full object-cover" /> */}
                    {hasNewHighlights ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-yellow-400 rounded-lg px-4 py-3 shadow-lg">
                          <div className="text-center">
                            <div className="md:text-lg lg:text-xl text-sm font-bold text-black">New Highlight</div>
                            <div className="md:text-lg lg:text-xl text-sm font-bold text-black">is Ready! 🔥</div>
                            <div className="md:text-sm lg:text-base text-xs font-semibold text-black mt-1">Click to watch</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-0 left-0 right-0">
                        <div className="rounded-t-3xl px-4 py-2 text-center">
                          <div className="md:text-lg lg:text-xl text-sm font-bold text-white drop-shadow">Your Last Highlight</div>
                        </div>
                      </div>
                    )}
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
      title="Spot Yourself"
      subtitle="Spot yourself in the lineup below to unlock your highlights"
      borderBottom={true}
      showCloseButton={false}
    >
      <SelectHighlight highlights={videoHighlights} setFinalSelectedHighlight={setFinalSelectedHighlight} matchId={matchIdHighlights} batchId={batchIdHighlights} setShowStatsModal={setShowStatsModal} setShowSelectHighlightsModal={setShowSelectHighlightsModal} setSelectedBatchId={() => setShowAllHighlightsModal(true)} />
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
    {showAllHighlightsModal && (<BottomUpModal
      isOpen={showAllHighlightsModal}
      onClose={() => setShowAllHighlightsModal(false)}
      title=""
      borderBottom={false}
      showCloseButton={false}
      maxHeight="100%"
    >
      <div className="flex flex-col bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="relative px-4 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-white rounded-full translate-y-8"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold">Select Match</h2>
                <p className="text-indigo-100 text-xs">Select the match you played in to get your highlight</p>
              </div>
            </div>
          </div>
        </div>

        {/* All Batches and Matches */}
        <div className="flex-1 overflow-y-auto mb-10">
          <div className="px-4 py-4 space-y-6">
            {/* Group highlights by batch */}
            {videoHighlights
              .filter((highlight: any, index: number, self: any[]) =>
                index === self.findIndex((h: any) => h.batch_id === highlight.batch_id)
              )
              .map((batch: any, batchIndex: number) => {
                // Get all matches for this batch
                const batchMatches = videoHighlights
                  .filter((highlight: any) => highlight.batch_id === batch.batch_id)
                  .filter((highlight: any, index: number, self: any[]) =>
                    index === self.findIndex((h: any) => h.match_id === highlight.match_id)
                  );

                return (
                  <div key={batch.batch_id} className="space-y-4">
                    {/* Batch Sub Header */}
                    <div className="px-1 py-2">
                      <div className="flex items-center gap-2">
                        {/* <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
                          {batchIndex + 1}
                        </div> */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 truncate">{batch.batch_name}</h4>
                          <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(batch.date)["date suffix"]}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {formatTimeIntToAmPm(batch.start_time || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Matches for this batch */}
                    <div className="space-y-2.5 pl-3">
                      {batchMatches.map((highlight: any, matchIndex: number) => (
                        <div
                          key={highlight.id}
                          className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.01] hover:-translate-y-0.5"
                          onClick={() => {
                            Mixpanel.track("clicked_view_match_on_highlights_page", {
                              userId: userId,
                              matchId: highlight.match_id,
                              batchId: highlight.batch_id,
                            });
                            setShowSelectHighlightsModal(true);
                            setMatchIdHighlights(highlight.match_id);
                            setBatchIdHighlights(highlight.batch_id);
                            setShowAllHighlightsModal(false);
                          }}
                        >
                          {/* Subtle gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <div className="relative p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                {/* Match Number Badge */}
                                <div className="flex-shrink-0">
                                  {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {matchIndex + 1}
                                  </div> */}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                      Match <span className="text-indigo-600">#{highlight.match_id}</span>
                                    </h4>
                                    {/* <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> */}
                                  </div>

                                  {/* <p className="text-xs text-gray-600 mb-2">Ready to watch your highlights</p> */}

                                  {/* Player Thumbnails */}
                                  <div className="flex gap-1.5 mt-1">
                                    {videoHighlights
                                      .filter((h: any) => h.match_id === highlight.match_id)
                                      .slice(0, 4)
                                      .map((h: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="relative w-9 h-9 rounded-full border-1.5 border-white shadow-sm overflow-hidden hover:scale-105 transition-transform duration-200"
                                          style={{ zIndex: 5 - idx }}
                                        >
                                          <img
                                            src={h.thumbnail_link}
                                            alt={`Player ${idx + 1}`}
                                            className="w-full h-full object-cover object-top"
                                          />
                                        </div>
                                      ))}
                                    {videoHighlights.filter((h: any) => h.match_id === highlight.match_id).length > 4 && (
                                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold border-1.5 border-white shadow-sm">
                                        +{videoHighlights.filter((h: any) => h.match_id === highlight.match_id).length - 4}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              <div className="flex-shrink-0 ml-3">
                                <div className="relative">
                                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 group-hover:scale-105 text-xs">
                                    <span>View</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                  {/* Subtle glow effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-200 -z-10"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
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