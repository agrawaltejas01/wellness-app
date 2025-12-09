import { navigate } from "@reach/router";
import { Mixpanel } from "../mixpanel/init";

const BottomNav: React.FC = () => {
  const handleHomeClick = () => {
    Mixpanel.track("bottom_nav_home_clicked");
    navigate("/");
  };

  const handleBookGameClick = () => {
    Mixpanel.track("bottom_nav_book_game_clicked", {
      activity: "BADMINTON"
    });
    // Navigate to activity page with badminton selected
    navigate("/badminton", {
      state: {
        activitySelectedFromFilters: "BADMINTON"
      }
    });
  };

  const handleCommunityClick = () => {
    Mixpanel.track("bottom_nav_community_clicked");
    // Navigate to community page
    navigate("/leaderboard");
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50"
      style={{
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Home Button */}
          <button
            onClick={handleHomeClick}
            className="flex flex-col items-center justify-center flex-1 transition-all duration-200 hover:opacity-70"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 mb-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span
              className="text-xs sm:text-sm font-semibold"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                color: "#000000",
              }}
            >
              Home
            </span>
          </button>

          {/* Book Game Button */}
          <button
            onClick={handleBookGameClick}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 mx-2 sm:mx-4 transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{
              backgroundColor: "#4CAF50",
              borderRadius: "50px",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              borderBottom: "2px solid #000000",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span
              className="text-sm sm:text-base md:text-lg font-bold text-white"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              Book
            </span>
          </button>

          {/* Community Button */}
          <button
            onClick={handleCommunityClick}
            className="flex flex-col items-center justify-center flex-1 transition-all duration-200 hover:opacity-70"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 mb-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span
              className="text-xs sm:text-sm font-semibold"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                color: "#000000",
              }}
            >
              Community
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;

