import { useNavigate } from "@reach/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getHighlights } from "../../apis/highlights/highlights";
import { Mixpanel } from "../../mixpanel/init";

interface Highlight {
  id: string;
  thumbnail: string;
  videoUrl: string;
  location: string;
  sessionTime: string;
  date: string;
}

const GameHighlights: React.FC = () => {
  const navigate = useNavigate();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const userDetails = JSON.parse(
    window.localStorage["zenfitx-user-details"] || "{}"
  );
  const userId = userDetails.id;

  const { mutate: _getHighlights } = useMutation({
    mutationFn: getHighlights,
    onSuccess: (result) => {
      console.log("Highlights result:", result);
      // Parse the highlights data from API
      if (result?.highlights && Array.isArray(result.highlights)) {
        setHighlights(result.highlights);
      }
    },
    onError: (error) => {
      console.log("Error fetching highlights:", error);
    },
  });

  useEffect(() => {
    if (userId) {
      _getHighlights(userId);
    }
  }, [userId]);

  const handleGetHighlights = () => {
    Mixpanel.track("get_highlights_clicked");
    // Navigate to highlights upload or info page
    navigate("/highlights");
  };

  const handleHighlightClick = (highlight: Highlight) => {
    Mixpanel.track("highlight_card_clicked", {
      highlight_id: highlight.id,
      location: highlight.location,
    });
    navigate("/highlights", { state: { url: highlight.videoUrl } });
  };

  return (
    <div className="w-full py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading with decorative lines */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div 
            className="flex-1 h-0.5 max-w-[120px] sm:max-w-[180px]"
            style={{ background: 'linear-gradient(to left, #e6e6e6, #ffffff)' }}
          ></div>
          <h2
            className="px-4 sm:px-6 text-sm sm:text-base font-bold text-center"
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              letterSpacing: "2px",
              color: "#000000",
            }}
          >
            GAME HIGHLIGHTS
          </h2>
          <div 
            className="flex-1 h-0.5 max-w-[120px] sm:max-w-[180px]"
            style={{ background: 'linear-gradient(to right, #e6e6e6, #ffffff)' }}
          ></div>
        </div>

        {/* Horizontal scrolling cards */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 sm:gap-3 md:gap-4 pb-4">
          {/* Get Your Highlights Card */}
          <div
            onClick={handleGetHighlights}
            className="flex-shrink-0 w-40 sm:w-56 md:w-64 lg:w-72 h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl cursor-pointer transition-transform duration-200 hover:scale-105 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a4d1a 0%, #2d7a2d 100%)",
            }}
          >
            {/* Arrow Icon */}
            <div className="absolute top-3 right-3 sm:top-6 sm:right-6">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>

            {/* Text */}
            <div className="absolute bottom-4 left-3 right-3 sm:bottom-8 sm:left-6 sm:right-6">
              <h3
                className="text-white text-xl sm:text-3xl md:text-4xl font-bold leading-tight"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                Get
                <br />
                Your
                <br />
                Highlights
              </h3>
            </div>
          </div>

          {/* Highlight Video Cards */}
          {highlights.map((highlight) => (
            <div
              key={highlight.id}
              onClick={() => handleHighlightClick(highlight)}
              className="flex-shrink-0 w-40 sm:w-56 md:w-64 lg:w-72 h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl cursor-pointer transition-transform duration-200 hover:scale-105 relative overflow-hidden"
              style={{
                background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%), url(${highlight.thumbnail}) center/cover`,
                backgroundColor: "#2a2a2a",
              }}
            >
              {/* Location and Session Info */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                    style={{ backgroundColor: "#ff4444" }}
                  ></div>
                  <p
                    className="text-white text-xs sm:text-sm md:text-base italic opacity-90"
                    style={{
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                    }}
                  >
                    {highlight.location}
                  </p>
                </div>
                <h3
                  className="text-white text-base sm:text-2xl md:text-3xl font-bold"
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}
                >
                  {highlight.sessionTime}
                </h3>
              </div>
            </div>
          ))}

          {/* Placeholder cards if no highlights */}
          {highlights.length === 0 && (
            <>
              <div
                className="flex-shrink-0 w-40 sm:w-56 md:w-64 lg:w-72 h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl relative overflow-hidden"
                style={{
                  background: "linear-gradient(to bottom, #3a3a3a, #2a2a2a)",
                }}
              >
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                      style={{ backgroundColor: "#ff4444" }}
                    ></div>
                    <p
                      className="text-white text-xs sm:text-sm md:text-base italic opacity-90"
                      style={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                      }}
                    >
                      Coolulu
                    </p>
                  </div>
                  <h3
                    className="text-white text-base sm:text-2xl md:text-3xl font-bold"
                    style={{
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                    }}
                  >
                    08-PM SESH
                  </h3>
                </div>
              </div>

              <div
                className="flex-shrink-0 w-40 sm:w-56 md:w-64 lg:w-72 h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl relative overflow-hidden"
                style={{
                  background: "linear-gradient(to bottom, #3a3a3a, #2a2a2a)",
                }}
              >
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                      style={{ backgroundColor: "#ff4444" }}
                    ></div>
                    <p
                      className="text-white text-xs sm:text-sm md:text-base italic opacity-90"
                      style={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                      }}
                    >
                      Coolulu
                    </p>
                  </div>
                  <h3
                    className="text-white text-base sm:text-2xl md:text-3xl font-bold"
                    style={{
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                    }}
                  >
                    04-PM SESH
                  </h3>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GameHighlights;

