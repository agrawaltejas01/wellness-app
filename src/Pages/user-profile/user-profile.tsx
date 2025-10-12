import { RouteComponentProps, navigate } from "@reach/router";
import { Button, Input, message } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useAtom } from "jotai/react";
import { userDetailsAtom } from "../../atoms/atom";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getRatings } from "../../apis/ratings/ratings";
import { getGamesPlayed } from "../../apis/games/games";
import colors from "../../constants/colours";
import { Mixpanel } from "../../mixpanel/init";
import MetaPixel from "../../components/meta-pixel";
import Loader from "../../components/Loader";
import IUser from "../../types/user";

interface IUserProfile extends RouteComponentProps {}

interface UserStats {
  rating: number;
  gamesPlayed: number;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatDate = (date: string) => {
  if (!date) return "Not provided";
  return `${months[parseInt(date.split("-")[1]) - 1]} ${date.split("-")[2]}, ${date.split("-")[0]}`;
}

const UserProfile: React.FC<IUserProfile> = () => {
  const [userDetails] = useAtom(userDetailsAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [userBio, setUserBio] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [playerStats, setPlayerStats] = useState<UserStats>({ rating: 0, gamesPlayed: 0 });

  // Fetch user rating data
  const { mutate: fetchRating } = useMutation({
    mutationFn: getRatings,
    onSuccess: (data) => {
      setPlayerStats(prev => ({ ...prev, rating: data.rating.rating || 0 }));
    },
    onError: () => {
      console.error("Failed to load rating data");
    },
  });

  // Fetch games played data
  const { mutate: fetchGamesCount } = useMutation({
    mutationFn: getGamesPlayed,
    onSuccess: (data) => {
      setPlayerStats(prev => ({ ...prev, gamesPlayed: data.gamesPlayedCount || 0 }));
      setIsLoading(false);
    },
    onError: () => {
      console.error("Failed to load games data");
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (userDetails?.id) {
      // Initialize user bio from storage
      const storedBio = localStorage.getItem(`user_bio_${userDetails.id}`) || "Tell us about yourself...";
      setUserBio(storedBio);
      
      // Load user statistics
      fetchRating(userDetails.id);
      fetchGamesCount(userDetails.id);
      
      // Analytics tracking
      Mixpanel.track("user_profile_viewed", {
        user_id: userDetails.id,
        user_name: userDetails.name
      });
    } else {
      setIsLoading(false);
    }
  }, [userDetails]);

  const startEditing = () => {
    setBioInput(userBio);
    setEditMode(true);
  };

  const saveBio = () => {
    if (userDetails?.id) {
      setUserBio(bioInput);
      localStorage.setItem(`user_bio_${userDetails.id}`, bioInput);
      setEditMode(false);
      message.success("Profile updated!");
      
      Mixpanel.track("profile_bio_updated", {
        user_id: userDetails.id
      });
    }
  };

  const cancelEditing = () => {
    setBioInput(userBio);
    setEditMode(false);
  };

  const NavigationHeader = () => (
    <div className="bg-black p-4 sticky top-0 z-10">
      <button 
        onClick={() => navigate("/")}
        className="text-white p-2 rounded-full"
      >
        <ArrowLeftOutlined className="text-lg" />
      </button>
    </div>
  );

  const UserAvatar = () => {
    const size = 80;
    return (
      <div className="flex justify-center items-center w-full">
        <div
          className="rounded-full flex items-center justify-center mx-auto"
          style={{
            width: size,
            height: size,
            background: 'conic-gradient(from 0deg, #ff0000, #ff8800, #ffff00, #88ff00, #00ff00, #00ff88, #00ffff, #0088ff, #0000ff, #8800ff, #ff00ff, #ff0088, #ff0000)',
            padding: '3px'
          }}
        >
          <div
            className="bg-black rounded-full flex items-center justify-center text-white font-bold"
            style={{
              width: size - 6,
              height: size - 6,
              fontSize: size / 2.5,
              fontFamily: 'Plus Jakarta Sans'
            }}
          >
            {userDetails?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return <Loader />;

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-700 mb-4">Please log in to view your profile</h2>
          <Button type="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaPixel />
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        
        {/* Profile Hero Section */}
        <div className="bg-black text-white py-8 px-4">
          <div className="text-center">
            <UserAvatar />
            <h1 className="text-2xl font-bold mt-4 mb-1">{userDetails.name}</h1>
            <p className="text-gray-300 text-sm">{userDetails.phone}</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="px-4 py-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-500 mb-1">
                  {playerStats.rating ? playerStats.rating/100 : '-'}
                </div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
              <div className="text-center border-l border-gray-200 pl-6">
                <div className="text-3xl font-bold text-blue-500 mb-1">
                  {playerStats.gamesPlayed}
                </div>
                <div className="text-sm text-gray-500">Games Played</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {/* <div className="px-4 pb-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
              {!editMode && (
                <button
                  onClick={startEditing}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <EditOutlined />
                </button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-3">
                <Input.TextArea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={saveBio}
                    size="small"
                  >
                    Save
                  </Button>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={cancelEditing}
                    size="small"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className={`text-sm leading-6 ${
                userBio === "Tell us about yourself..." 
                  ? "text-gray-400 italic" 
                  : "text-gray-600"
              }`}>
                {userBio}
              </p>
            )}
          </div>
        </div> */}

        {/* Profile Information */}
        <div className="px-4 pb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            <div className="space-y-4">
              {/* <div className="flex justify-between items-center">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-900 font-medium">
                  {userDetails.email || "Not provided"}
                </span>
              </div> */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gender</span>
                <span className="text-gray-900 font-medium">
                  {userDetails.gender === "M" ? "Male" : 
                   userDetails.gender === "F" ? "Female" : 
                   userDetails.gender === "O" ? "Other" : "Not specified"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date of Birth</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(userDetails.dob?.split("T")[0] || "")}
                </span>
              </div>
              {/* <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Bookings</span>
                <span className="text-gray-900 font-medium">
                  {userDetails.noOfBookings || 0}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
