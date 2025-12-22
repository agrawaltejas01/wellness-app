import { navigate, RouteComponentProps, useLocation } from "@reach/router";
import ReelsVideoPlayer from "./a";
import { useState } from "react";
import { BottomUpModal } from "../profile/half-page-modal";
import { ReactComponent as BackButtonCheckout } from '../../images/utils/back-button-checkout.svg';
import { Mixpanel } from "../../mixpanel/init";

interface IStats extends RouteComponentProps {}

const Stats: React.FC<IStats> = () => {

  const {highlight_link, rally_link, heatmap_link, playerId} = useLocation().state as {highlight_link: string, rally_link: string, heatmap_link: string, playerId: number};
  const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
  const userId = userDetails.id;
  
  const handleHighlightClick = () => {
    Mixpanel.track("clicked_match_highlights_on_match_recap", {
      userId: userId,
    });
    navigate("/highlights", { state: { url: highlight_link, muted: false } });
  };

  const handleRallyClick = () => {
    // navigate("/highlights", { state: { url: StatsProps.rally_link } });
    Mixpanel.track("clicked_top_rallies_on_match_recap", {
      userId: userId,
    });
    navigate("/highlights", { state: { url: rally_link } });
  };

  const handleHeatMapClick = () => {
    // navigate("/highlights", { state: { url: StatsProps.heat_map_link } });
    // navigate("/highlights", { state: { url: heat_map_link } });
    Mixpanel.track("clicked_movement_heatmap_on_match_recap", {
      userId: userId,
    });
    navigate("/heat-map", { state: { heatmap_link: heatmap_link, playerId: playerId } });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to top, #E3F6E4, #FFFFFF)' }}>
      <div className="w-full max-w-4xl mx-auto mt-4 px-4">
        <BackButtonCheckout onClick={() => navigate(-1)} className="cursor-pointer" />
      </div>
      <div className="flex flex-col gap-6 px-6 pt-8 pb-24 max-w-2xl mx-auto">
        {/* Player Badge */}
        {/* <div className="flex items-center justify-center gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-emerald-200/50">
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-slate-700 font-medium">Your player ID:</span>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold shadow-md">
              {StatsProps.player_id}
            </span>
          </div>
        </div> */}

        {/* Title */}
        <div className="text-center space-y-2 animate-fadeIn" style={{ animationDelay: "100ms" }}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Your Match Recap
          </h1>
          <p className="text-slate-500 text-sm">
            Auto Curated by <span className="font-bold bg-emerald-500/20 px-2 py-1 rounded-lg" style={{ color: 'rgb(17, 19, 11)' }}>ZenVision AI</span>
          </p>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col gap-4 mt-4">
          {/* Highlights Card */}
          <div
            onClick={handleHighlightClick}
            className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] animate-fadeIn"
            style={{ animationDelay: "200ms" }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-bold text-base mb-1">Match Highlights</h3>
                <p className="text-white/80 text-xs">Watch your top shots</p>
              </div>
              <svg
                className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Top Rallies Card */}
          <div
            onClick={handleRallyClick}
            className="group relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] animate-fadeIn"
            style={{ animationDelay: "300ms" }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-bold text-base mb-1">Top Rallies</h3>
                <p className="text-white/80 text-xs">Replay the most intense exchanges</p>
              </div>
              <svg
                className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Heatmap Card */}
          <div
            onClick={handleHeatMapClick}
            className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] animate-fadeIn"
            style={{ animationDelay: "400ms" }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-bold text-base mb-1">Movement Heatmap</h3>
                <p className="text-white/80 text-xs">Your court coverage, visualized</p>
              </div>
              <svg
                className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12" />
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Stats;   