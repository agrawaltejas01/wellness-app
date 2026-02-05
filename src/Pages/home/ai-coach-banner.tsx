import { navigate } from "@reach/router";
import { Mixpanel } from "../../mixpanel/init";

interface AICoachBannerProps {
  userId?: number;
}

const AICoachBanner: React.FC<AICoachBannerProps> = ({ userId }) => {
  const handleClick = () => {
    Mixpanel.track("ai_coach_banner_clicked", { user_id: userId });
    navigate("/coach");
  };

  return (
    <div
      className="rounded-2xl p-4 mx-4 mt-4 cursor-pointer transition-all hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
      }}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              AI Coach
            </h3>
            <p className="text-white text-sm opacity-90">
              Get personalized wellness advice
            </p>
          </div>
        </div>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default AICoachBanner;
