import activityToSvgMap from "../../images/class-images/activity-map";
import { Mixpanel } from "../../mixpanel/init";

interface ActivitySelectorProps {
  activities: string[];
  selectedActivity?: string;
  onActivitySelect: (activity: string) => void;
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  activities,
  selectedActivity,
  onActivitySelect,
}) => {
  const handleActivityClick = (activity: string) => {
    Mixpanel.track("activity_selected", { activity });
    onActivitySelect(activity);
  };

  return (
    <div className="w-full bg-white" 
    // style={{ backgroundColor: "#FAFAFA" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-stretch px-2 sm:px-4 md:px-6">
          {activities.map((activity) => {
            const isSelected = selectedActivity === activity;
            const displayName = activity.toUpperCase();

            return (
              <div
                key={activity}
                className="flex-1 cursor-pointer relative"
                onClick={() => handleActivityClick(activity)}
                style={{
                  background: isSelected 
                    ? "linear-gradient(to top, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)"
                    : "transparent",
                }}
              >
                <div 
                  className="flex flex-col items-center justify-center py-3 sm:py-4 md:py-5 px-1 sm:px-2 rounded-lg transition-all duration-200"
                  
                >
                  {/* Activity Icon */}
                  <div
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center mb-2 sm:mb-3 transition-all duration-200"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {activityToSvgMap(activity)}
                    </div>
                  </div>

                  {/* Activity Name */}
                  <p
                    className="sm:text-sm md:text-base lg:text-lg font-semibold text-center transition-colors duration-200"
                    style={{
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                      letterSpacing: "0.5px",
                      color: "#000000",
                      fontSize: "10px",
                    }}
                  >
                    {displayName}
                  </p>
                </div>

                {/* Selection Indicator - Green underline */}
                <div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-300"
                  style={{
                    height: "3px",
                    backgroundColor: isSelected ? "#4CAF50" : "transparent",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivitySelector;

