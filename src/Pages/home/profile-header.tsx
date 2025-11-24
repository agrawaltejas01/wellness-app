import { useMutation } from "@tanstack/react-query";
import { getCoins } from "../../apis/coins/coins";
import IUser from "../../types/user";
import { useEffect, useState } from "react";
import { Mixpanel } from "../../mixpanel/init";
import { navigate } from "@reach/router";

interface ProfileHeaderProps {
  userDetails: IUser;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userDetails }) => {
  const [coins, setCoins] = useState(0);
  const [profilePicture, setProfilePicture] = useState<string>("");

  const { mutate: _getCoins } = useMutation({
    mutationFn: getCoins,
    onSuccess: (result) => {
      setCoins(result.coins);
    },
  });

  useEffect(() => {
    if (userDetails?.id) {
      _getCoins(userDetails.id as number);
    }
  }, [userDetails?.id]);

  useEffect(() => {
    if (userDetails?.profilePictureThumbnail) {
      setProfilePicture(userDetails.profilePictureThumbnail);
    }
  }, [userDetails]);

  const handleProfileClick = () => {
    Mixpanel.track("user_profile_clicked", { user_id: userDetails?.id });
    navigate("/user-profile");
  };

  const handleCoinsClick = () => {
    Mixpanel.track("clicked_coins_capsule_home", {
      user_id: userDetails?.id,
    });
    navigate("/coins");
  };

  const firstName = userDetails?.name?.split(" ")[0] || "there";

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white max-w-7xl mx-auto">
      <div className="flex flex-row justify-between items-center gap-2 sm:gap-4">
        {/* Left section - Profile and greeting */}
        <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
          {/* Profile picture with border */}
          <div
            className="cursor-pointer rounded-full flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
            onClick={handleProfileClick}
            style={{
              border: "2px solid #000000",
              padding: "2px",
              overflow: "hidden",
            }}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={firstName}
                className="w-full h-full rounded-full object-cover"
                style={{
                  display: "block",
                }}
              />
            ) : (
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-white text-sm sm:text-lg md:text-xl font-bold"
                style={{ backgroundColor: "#000000" }}
              >
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Greeting text */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <h1
              className="text-base sm:text-xl md:text-2xl lg:text-3xl font-normal leading-tight truncate"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                color: "#000000",
              }}
            >
              Hey {firstName},
            </h1>
            <p
              className="text-xs sm:text-sm md:text-base font-normal leading-tight"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                color: "#666666",
                textDecorationColor: "#666666",
                textUnderlineOffset: "3px",
              }}
            >
              Let's look at your sesh!
            </p>
          </div>
        </div>

        {/* Right section - Coins */}
        <div
          className="flex flex-row items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded-full cursor-pointer flex-shrink-0"
          style={{
            backgroundColor: "#FFF9E6",
          }}
          onClick={handleCoinsClick}
        >
          {/* Coin icon - 3D layered effect */}
          <div className="relative flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10">
            <div
              className="absolute rounded-full"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#D4A017",
                top: "12%",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#FFD700",
                border: "2px solid #FFA500",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "50%",
                height: "50%",
                backgroundColor: "#FFE55C",
                top: "15%",
                left: "15%",
                opacity: 0.7,
              }}
            />
          </div>

          {/* Coins text */}
          <div className="flex flex-col items-center">
            <p
              className="text-lg sm:text-2xl md:text-3xl font-extrabold leading-none"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                color: "#000000",
              }}
            >
              {coins}
            </p>
            <p
              className="text-xs sm:text-xs md:text-sm font-semibold tracking-wide leading-none mt-0.5"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                color: "#000000",
              }}
            >
              COINS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

