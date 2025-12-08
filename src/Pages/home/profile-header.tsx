import { useMutation } from "@tanstack/react-query";
import { getCoins } from "../../apis/coins/coins";
import IUser from "../../types/user";
import { useEffect, useState } from "react";
import { Mixpanel } from "../../mixpanel/init";
import { navigate } from "@reach/router";
import coinImage from "../../images/utils/coin.png";
import verifiedBadgeImg from "../../images/home/verified-badge-player.png";
import { getRatings } from "../../apis/ratings/ratings";

interface ProfileHeaderProps {
  userDetails: IUser;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userDetails }) => {
  const [coins, setCoins] = useState(0);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isRatedPlayer, setIsRatedPlayer] = useState(false);

  const { mutate: _getCoins } = useMutation({
    mutationFn: getCoins,
    onSuccess: (result) => {
      setCoins(result.coins);
    },
  });

  const { mutate: _getRatings } = useMutation({
    mutationFn: getRatings,
    onSuccess: (result) => {
      const ratingValue = result?.rating?.Rating?.rating || 0;
      setIsRatedPlayer(ratingValue > 0);
    },
    onError: () => {
      setIsRatedPlayer(false);
    },
  });

  useEffect(() => {
    if (userDetails?.id) {
      _getCoins(userDetails.id as number);
      _getRatings(userDetails.id as number);
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
          <div className="relative">
            <div
              className="cursor-pointer rounded-full flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
              onClick={handleProfileClick}
              style={{
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
            {isRatedPlayer && (
              <img
                src={verifiedBadgeImg}
                alt="Verified player"
                className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6"
              />
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
              {firstName},
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
          className="flex flex-row items-center sm:gap-2 md:gap-3 pl-1 sm:pl-2 md:pl-4 pr-1 sm:pr-4 md:pr-5 py-1 sm:py-2 md:py-3 rounded-full cursor-pointer flex-shrink-0"
          style={{
            backgroundColor: "#FED52C3D",
          }}
          onClick={handleCoinsClick}
        >
          {/* Coin icon */}
          <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14">
            <img
              src={coinImage}
              alt="Coin"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          {/* Coins text */}
          <div className="flex flex-col items-start">
            <p
              className="sm:text-2xl md:text-3xl leading-none pr-1"
              style={{
                fontFamily: "General Sans, sans-serif",
                color: "#000000",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {coins === 0 ? '25% off' : coins}
            </p>
            <p
              className="sm:text-xs md:text-sm tracking-wide leading-none mt-0.5 pr-1"
              style={{
                fontFamily: "General Sans, sans-serif",
                color: "#000000",
                fontSize: "10px",
              }}
            >
              {coins === 0 ? 'Buy Coins' : 'Coins'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

