import React, { useState, useEffect, useRef } from "react";
import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai/react";
import { userDetailsAtom, afterLoginRedirectAtom } from "../../atoms/atom";
import { updateUser } from "../../apis/auth/login";
import { Mixpanel } from "../../mixpanel/init";
import { setUserProfile, trackEvent } from "../../firebase/config";
import IUser from "../../types/user";
import { getToken } from "../../apis/token/token";
import { accessTokenAtom } from "../../atoms/atom";
import { errorToast } from "../../components/Toast";

interface IProfileCompletionProps extends RouteComponentProps {}

const ProfileCompletion: React.FC<IProfileCompletionProps> = () => {
  const locationStates = useLocation().state;
  const userFromState = locationStates ? (locationStates as any).user : null;
  const afterLoginRedirectProps = locationStates 
    ? (locationStates as any).afterLoginRedirectProps 
    : null;

  const [accessToken, setAccessTokenAtom] = useAtom(accessTokenAtom);
  const [userDetails, setUserDetailsAtom] = useAtom(userDetailsAtom);
  const [afterLoginRedirect] = useAtom(afterLoginRedirectAtom);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: userFromState?.name || userDetails?.name || "",
    phone: userFromState?.phone || userDetails?.phone || "",
    gender: userFromState?.gender || userDetails?.gender || "",
    dob: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [appVersion, setAppVersion] = useState<string>("");
  const [isFromApp, setIsFromApp] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>("");

  const { mutate: updateUserMutation } = useMutation({
    mutationFn: updateUser,
    onError: (response: any) => {
      setIsLoading(false);
      Mixpanel.track("profile_completion_error", {
        phone: formData.phone,
        error: response.message,
      });
    },
    onSuccess: (response) => {
      const updatedUser = {
        ...userFromState,
        ...formData,
        dob: new Date(formData.dob),
        noOfBookings: userFromState?.noOfBookings ?? 0,
        profilePictureThumbnail: profilePicture || userFromState?.profilePictureThumbnail || userDetails?.profilePictureThumbnail,
      };
      
      setUserDetailsAtom(updatedUser);
      
      // Update analytics
      Mixpanel.identify(formData.phone);
      Mixpanel.track("profile_completion_success", {
        phone: formData.phone,
        name: formData.name,
        gender: formData.gender,
        hasProfilePicture: !!profilePicture,
      });
      
      Mixpanel.people.set({
        $name: formData.name,
        $phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
      });

      setUserProfile({
        user_id: formData.phone,
        phone_number: formData.phone,
        name: formData.name,
      });

      trackEvent("profile_completed", {
        user_id: formData.phone,
        completion_date: new Date().toISOString(),
      });

      setIsLoading(false);

      getTokenMutation(formData.phone);
      
      // Navigate to intended destination
      navigate(afterLoginRedirectProps?.afterLoginUrl || afterLoginRedirect?.afterLoginUrl || "/", {
        replace: true,
        state: { ...afterLoginRedirectProps, ...afterLoginRedirect },
      });
    },
  });

  const { mutate: getTokenMutation } = useMutation({
    mutationFn: getToken,
    onSuccess: (response) => {
      setAccessTokenAtom(response.token);
    },
    onError: (response) => {
      setIsLoading(false);
      localStorage.clear();
      window.location.href = "/";
    },
  });

  useEffect(() => {
    Mixpanel.track("open_profile_completion_page");
    setAppVersion(window.platformInfo?.appVersion || "");
    setPlatform(window.platformInfo?.platform || "");
    setIsFromApp(window?.isFromApp || false);
  }, []);

  // Handle selfie upload result from React Native
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'selfieResult') {
          if (data.success && data.uploaded) {
            // Update profile picture from response if available
            if (data.body?.profilePictureThumbnail) {
              setProfilePicture(data.body.profilePictureThumbnail);
            }

            // Track analytics
            Mixpanel.track("profile_picture_uploaded", {
              user_id: userFromState?.id || userDetails?.id,
              status: data.status,
              method: 'profile_completion_app'
            });
          } else {
            if(data?.cancelled){
              return;
            }
            errorToast("Failed to upload profile picture. Please try again.");
            
            Mixpanel.track("profile_picture_upload_failed", {
              user_id: userFromState?.id || userDetails?.id,
              status: data.status,
              method: 'profile_completion_app'
            });
          }
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
  }, [userFromState, userDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      
      if (age < 13) {
        newErrors.dob = "You must be at least 13 years old";
      } else if (age > 100) {
        newErrors.dob = "Please enter a valid date of birth";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to fix image orientation
  const fixImageOrientation = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

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
      errorToast('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errorToast('File size should not exceed 5MB');
      return;
    }

    setIsUploadingImage(true);
    
    try {
      // Fix image orientation before uploading
      const correctedImageBlob = await fixImageOrientation(file);
      
      const uploadUrl = process.env.REACT_APP_BE_URL + '/users/profile-picture';
      let token = window.localStorage["zenfitx-access-token"];
      token = JSON.parse(token as string);

      const uploadFormData = new FormData();
      uploadFormData.append('profilePicture', correctedImageBlob, file.name);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'x-wellness-jwt': token
        },
        body: uploadFormData
      });

      const data = await response.json();
      if (response.ok && data?.profilePictureThumbnail) {
        setProfilePicture(data.profilePictureThumbnail);
        
        Mixpanel.track("profile_picture_uploaded", {
          user_id: userFromState?.id || userDetails?.id,
          status: 'success',
          method: 'profile_completion'
        });
      } else {
        errorToast(data.message || 'Failed to upload profile picture. Please try again.');
        
        Mixpanel.track("profile_picture_upload_failed", {
          user_id: userFromState?.id || userDetails?.id,
          status: 'error',
          method: 'profile_completion'
        });
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      errorToast('Failed to upload profile picture. Please try again.');
      
      Mixpanel.track("profile_picture_upload_failed", {
        user_id: userFromState?.id || userDetails?.id,
        status: 'error',
        error: String(error),
        method: 'profile_completion'
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
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const handleTakePhoto = () => {
    setShowPhotoOptions(false);
    cameraInputRef.current?.click();
  };

  const handleChooseFromGallery = () => {
    setShowPhotoOptions(false);
    let token = window.localStorage["zenfitx-access-token"];
    token = JSON.parse(token as string);
    window?.ReactNativeWebView?.postMessage(JSON.stringify({
      type: 'takeSelfie',
      uploadUrl: process.env.REACT_APP_BE_URL + '/users/profile-picture',
      uploadMethod: 'POST',
      uploadHeaders: { 'x-wellness-jwt': token },
      uploadFieldName: 'profilePicture',
    }));

    if(!window.ReactNativeWebView) {
      fileInputRef.current?.click();
    }
  };

  const handleEditProfilePicture = () => {
    if(isFromApp && appVersion < '1.2.5') {
      errorToast("Please update the app to the latest version to edit your profile picture.");
      return;
    }
    setShowPhotoOptions(true);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Move to step 2
    setCurrentStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Move to step 3
    setCurrentStep(3);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    const userPayload: IUser = {
      id: userFromState?.id || userDetails?.id,
      name: formData.name.trim(),
      phone: formData.phone,
      gender: formData.gender as "M" | "F" | "O",
      dob: new Date(formData.dob).toISOString().split('T')[0],
      noOfBookings: userFromState?.noOfBookings ?? 0,
    };

    updateUserMutation(userPayload);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const handleSkip = () => {
    // Skip current step
    if (currentStep === 2) {
      // Skip photo upload and move to step 3
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Skip health permissions and complete profile
      setIsLoading(true);
      
      const userPayload: IUser = {
        id: userFromState?.id || userDetails?.id,
        name: formData.name.trim(),
        phone: formData.phone,
        gender: formData.gender as "M" | "F" | "O",
        dob: new Date(formData.dob).toISOString().split('T')[0],
        noOfBookings: userFromState?.noOfBookings ?? 0,
      };

      updateUserMutation(userPayload);
    }
  };

  const handleRequestHealthPermissions = () => {
    // Send message to React Native WebView only if platform is iOS
    if (isFromApp && platform === "ios" && window?.ReactNativeWebView) {
      window?.ReactNativeWebView?.postMessage("request_health_permissions");
      
      Mixpanel.track("health_permissions_requested", {
        user_id: userFromState?.id || userDetails?.id,
        platform: platform
      });
    }
  };

  const PhotoOptionsMenu = () => {
    if (!showPhotoOptions) return null;

    return (
      <>
        {/* iOS-style Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setShowPhotoOptions(false)}
        />
        
        {/* iOS-style Action Sheet */}
        <div className="fixed bottom-0 left-0 right-0 z-50" style={{ padding: '0 8px 8px 8px' }}>
          {/* Main Actions Container */}
          <div className="bg-white bg-opacity-95 backdrop-blur-xl overflow-hidden" style={{ borderRadius: '13px', marginBottom: '8px' }}>
            {/* Take Photo Option */}
            {isFromApp && platform === "ios" && <button
              onClick={handleTakePhoto}
              className="w-full px-4 text-center border-b border-gray-200 active:bg-gray-100 transition-colors"
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
            </button>}
            
            {/* Choose from Gallery Option */}
            <button
              onClick={handleChooseFromGallery}
              className="w-full px-4 text-center active:bg-gray-100 transition-colors"
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
            className="w-full px-4 bg-white bg-opacity-95 backdrop-blur-xl text-center active:bg-gray-100 transition-colors"
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

  const isFormValid = formData.name.trim() && 
                     formData.phone.trim() && 
                     formData.gender && 
                     formData.dob &&
                     errors && Object.values(errors).every(value => value === "");

  return (
    <div className="sm:w-full min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        {(currentStep === 2 || currentStep === 3) ? (
          <button
            onClick={currentStep === 2 ? handleBackToStep1 : handleBackToStep2}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
        ) : (
          <div className="w-8"></div>
        )}
        <h2 className="text-lg font-semibold text-gray-900">Complete Profile</h2>
        <div className="w-8"></div> {/* Spacer for center alignment */}
      </div>

      {/* Progress Indicator */}
      <div className="px-6 mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-black h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">Step {currentStep} of 3</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-20">
        <div className="max-w-md mx-auto w-full">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStep === 1 
                ? "Create your player profile." 
                : currentStep === 2 
                ? "Show us your game face"
                : "Unlock deeper insights"}
            </h1>
            <p className="text-gray-600">
              {currentStep === 1 
                ? "Help us personalize your experience ⚡️"
                : currentStep === 2
                ? "Add a photo to start receiving your highlights"
                : "Sync for better analysis and improvement tips"
              }
            </p>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`block w-full px-3 py-4 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-lg ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">+91</span>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  className={`block w-full pl-12 pr-3 py-4 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-lg ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength={10}
                  disabled={!!userFromState?.phone} // Disable if phone already exists
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`block w-full px-3 py-4 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-lg ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                className={`block w-full px-3 py-4 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-lg ${
                  errors.dob ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  colorScheme: 'light',
                }}
                onFocus={(e) => {
                  if (!formData.dob) {
                    e.target.showPicker?.();
                  }
                }}
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
              )}
            </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                  !isFormValid || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 active:bg-gray-900"
                }`}
              >
                Continue
              </button>
            </form>
          )}

          {/* Step 2: Profile Photo Upload */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
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

              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center">
                <div 
                  className="flex justify-center items-center w-full mb-6"
                  onClick={() => {
                    if (!isUploadingImage) {
                      handleEditProfilePicture();
                    }
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center mx-auto"
                    style={{
                      width: 120,
                      height: 120,
                      background: 'conic-gradient(from 0deg, #ff0000, #ff8800, #ffff00, #88ff00, #00ff00, #00ff88, #00ffff, #0088ff, #0000ff, #8800ff, #ff00ff, #ff0088, #ff0000)',
                      padding: '3px'
                    }}
                  >
                    <div
                      className="bg-black rounded-full flex items-center justify-center text-white font-bold relative"
                      style={{
                        width: 114,
                        height: 114,
                        fontSize: 48,
                        fontFamily: 'Plus Jakarta Sans'
                      }}
                    >
                      {profilePicture ? (
                        <img 
                          src={profilePicture} 
                          alt="Profile" 
                          className="rounded-full w-full h-full p-0.5 object-cover"
                        />
                      ) : (
                        formData.name.charAt(0).toUpperCase()
                      )}
                      {isUploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <span 
                  className={`text-sm font-bold mb-4 ${isUploadingImage ? 'text-gray-500' : 'text-green-500 cursor-pointer'}`}
                  onClick={() => {
                    if (!isUploadingImage) {
                      handleEditProfilePicture();
                    }
                  }}
                >
                  {isUploadingImage ? 'Uploading...' : 'Add Photo'}
                </span>

                {profilePicture && (
                  <p className="mt-2 text-sm text-gray-600 mb-4">Photo uploaded successfully!</p>
                )}

                {/* <p className="mt-4 text-sm text-gray-500 text-center">
                  You can skip this step and add a photo later
                </p> */}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 active:bg-gray-900"
                  }`}
                >
                  Continue
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Apple Health Permissions */}
          {currentStep === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-6">
              <div className="flex flex-col items-center">
                {/* Health Icon/Illustration */}
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  Connect Apple Health
                </h2>
                
                {/* <p className="text-gray-600 text-center mb-6">
                  Allow us to access your Apple Health data to provide personalized fitness insights and track your progress.
                </p> */}

                {/* Request Permissions Button */}
                {isFromApp && platform === "ios" && (
                  <button
                    type="button"
                    onClick={handleRequestHealthPermissions}
                    className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 active:from-red-700 active:to-pink-700 transition-all mb-4"
                  >
                    Connect Apple Health
                  </button>
                )}

                {!isFromApp || platform !== "ios" ? (
                  <p className="text-sm text-gray-500 text-center mb-4">
                    Apple Health integration is available on iOS devices.
                  </p>
                ) : null}

                {/* <p className="mt-4 text-sm text-gray-500 text-center">
                  You can skip this step and connect later from settings
                </p> */}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 active:bg-gray-900"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Completing Profile...
                    </div>
                  ) : (
                    "Complete Profile"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
