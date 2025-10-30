import { RouteComponentProps, navigate } from "@reach/router";
import { Button, Input, message } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useAtom } from "jotai/react";
import { userDetailsAtom } from "../../atoms/atom";
import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { getRatings } from "../../apis/ratings/ratings";
import { getGamesPlayed } from "../../apis/games/games";
import colors from "../../constants/colours";
import { Mixpanel } from "../../mixpanel/init";
import MetaPixel from "../../components/meta-pixel";
import Loader from "../../components/Loader";
import IUser from "../../types/user";
import "./user-profile.css";

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
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [userBio, setUserBio] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [playerStats, setPlayerStats] = useState<UserStats>({ rating: 0, gamesPlayed: 0 });
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
      if (userDetails?.profilePictureThumbnail) {
        setProfilePicture(userDetails.profilePictureThumbnail);
      }
      // Analytics tracking
      Mixpanel.track("user_profile_viewed", {
        user_id: userDetails.id,
        user_name: userDetails.name
      });
    } else {
      setIsLoading(false);
    }
  }, [userDetails]);

  // Handle selfie upload result from React Native
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'selfieResult') {
          if (data.success && data.uploaded) {
            message.success("Profile picture updated successfully!");
            
            // Update profile picture from response if available
            if (data.body?.profilePictureThumbnail) {
              setProfilePicture(data.body.profilePictureThumbnail);
            }

            // Track analytics
            Mixpanel.track("profile_picture_updated", {
              user_id: userDetails?.id,
              status: data.status
            });
            
            // Optionally reload user details to get the updated picture
            // You might want to trigger a refresh of userDetailsAtom here
          } else {
            if(data?.cancelled){
              return;
            }
            message.error("Failed to update profile picture. Please try again.");
            
            Mixpanel.track("profile_picture_update_failed", {
              user_id: userDetails?.id,
              status: data.status
            });
          }
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error("Error handling message from React Native:", error);
      }
    };

    // Listen for messages from React Native WebView
    if (window.ReactNativeWebView) {
      window.addEventListener('message', handleMessage);
      document.addEventListener('message', handleMessage as any);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as any);
    };
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

  // Helper function to fix image orientation
  const fixImageOrientation = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas with image dimensions
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Set canvas dimensions to image dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image onto canvas (this respects orientation in modern browsers)
          ctx.drawImage(img, 0, 0);

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          }, file.type || 'image/jpeg', 0.95);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      message.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      message.error('File size should not exceed 5MB');
      return;
    }

    setIsUploadingImage(true);
    
    try {
      // Fix image orientation before uploading
      const correctedImageBlob = await fixImageOrientation(file);
      
      const uploadUrl = process.env.REACT_APP_BE_URL + '/users/profile-picture';
      let token = window.localStorage["zenfitx-access-token"];
      token = JSON.parse(token as string);

      const formData = new FormData();
      // Use the corrected image blob with the original filename
      formData.append('profilePicture', correctedImageBlob, file.name);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'x-wellness-jwt': token
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok && data?.profilePictureThumbnail) {
        setProfilePicture(data.profilePictureThumbnail);
        message.success('Profile picture updated successfully!');
        
        // Update userDetails atom with new profile picture
        if (userDetails) {
          setUserDetails({
            ...userDetails,
            profilePictureThumbnail: data.profilePictureThumbnail
          });
        }

        Mixpanel.track("profile_picture_updated", {
          user_id: userDetails?.id,
          status: 'success',
          method: 'web_upload'
        });
        navigate('/', { replace: true });
      } else {
        message.error(data.message || 'Failed to update profile picture. Please try again.');
        
        Mixpanel.track("profile_picture_update_failed", {
          user_id: userDetails?.id,
          status: 'error',
          method: 'web_upload'
        });
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      message.error('Failed to update profile picture. Please try again.');
      
      Mixpanel.track("profile_picture_update_failed", {
        user_id: userDetails?.id,
        status: 'error',
        error: String(error),
        method: 'web_upload'
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTakePhoto = () => {
    setShowPhotoOptions(false);
    cameraInputRef.current?.click();
  };

  const handleChooseFromGallery = () => {
    setShowPhotoOptions(false);
    // fileInputRef.current?.click();
    let token = window.localStorage["zenfitx-access-token"];
    token = JSON.parse(token as string);
    window?.ReactNativeWebView?.postMessage(JSON.stringify({
      type: 'takeSelfie',
      uploadUrl: process.env.REACT_APP_BE_URL + '/users/profile-picture',
      uploadMethod: 'POST',
      uploadHeaders: { 'x-wellness-jwt': token },
      uploadFieldName: 'profilePicture',
    }));
  };

  const handleEditProfilePicture = () => {
    setShowPhotoOptions(true);
  };

  const PhotoOptionsMenu = () => {
    if (!showPhotoOptions) return null;

    return (
      <>
        {/* iOS-style Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40 ios-backdrop"
          onClick={() => setShowPhotoOptions(false)}
        />
        
        {/* iOS-style Action Sheet */}
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up" style={{ padding: '0 8px 8px 8px' }}>
          {/* Main Actions Container */}
          <div className="bg-white bg-opacity-95 backdrop-blur-xl overflow-hidden ios-action-sheet" style={{ borderRadius: '13px', marginBottom: '8px' }}>
            {/* Title */}
            {/* <div className="px-4 border-b border-gray-200" style={{ paddingTop: '13px', paddingBottom: '13px' }}>
              <p className="text-center text-gray-500 font-normal" style={{ fontSize: '13px', letterSpacing: '-0.08px' }}>
                Update Profile Picture
              </p>
            </div> */}
            
            {/* Take Photo Option */}
            <button
              onClick={handleTakePhoto}
              className="w-full px-4 text-center border-b border-gray-200 active:bg-gray-100 transition-colors ios-action-button"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                color: '#007AFF',
                fontSize: '20px',
                paddingTop: '16px',
                paddingBottom: '16px',
                fontWeight: '400'
              }}
            >
              Take Photo
            </button>
            
            {/* Choose from Gallery Option */}
            <button
              onClick={handleChooseFromGallery}
              className="w-full px-4 text-center active:bg-gray-100 transition-colors ios-action-button"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                color: '#007AFF',
                fontSize: '20px',
                paddingTop: '16px',
                paddingBottom: '16px',
                fontWeight: '400'
              }}
            >
              Choose Photo
            </button>
          </div>
          
          {/* Cancel Button - Separated */}
          <button
            onClick={() => setShowPhotoOptions(false)}
            className="w-full px-4 bg-white bg-opacity-95 backdrop-blur-xl text-center active:bg-gray-100 transition-colors ios-cancel-button"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              color: '#007AFF',
              fontSize: '20px',
              paddingTop: '16px',
              paddingBottom: '16px',
              fontWeight: '600',
              borderRadius: '13px'
            }}
          >
            Cancel
          </button>
        </div>
      </>
    );
  };

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
            {profilePicture ? <img src={profilePicture} className="rounded-full w-full h-full p-0.5" /> : userDetails?.name?.charAt(0)?.toUpperCase() || "U"}
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
        
        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          capture="environment"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        {/* Photo Options Menu */}
        <PhotoOptionsMenu />
        
        {/* Profile Hero Section */}
        <div className="bg-black text-white py-8 px-4">
          <div className="text-center">
            <UserAvatar />
            <span 
              className={`text-sm font-bold ${isUploadingImage ? 'text-gray-500' : 'text-green-500 cursor-pointer'}`} 
              onClick={() => {
                if (!isUploadingImage) {
                  handleEditProfilePicture();
                }
              }}
            >
              {isUploadingImage ? 'Uploading...' : 'Edit'}
            </span>
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
                  {playerStats.rating/100}
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
        <div className="px-4 pb-4">
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
        </div>

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
