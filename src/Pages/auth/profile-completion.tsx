import React, { useState, useEffect } from "react";
import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai/react";
import { userDetailsAtom, afterLoginRedirectAtom } from "../../atoms/atom";
import { updateUser } from "../../apis/auth/login";
import { Mixpanel } from "../../mixpanel/init";
import { setUserProfile, trackEvent } from "../../firebase/config";
import IUser from "../../types/user";

interface IProfileCompletionProps extends RouteComponentProps {}

const ProfileCompletion: React.FC<IProfileCompletionProps> = () => {
  const locationStates = useLocation().state;
  const userFromState = locationStates ? (locationStates as any).user : null;
  const afterLoginRedirectProps = locationStates 
    ? (locationStates as any).afterLoginRedirectProps 
    : null;

  const [, setUserDetailsAtom] = useAtom(userDetailsAtom);
  const [afterLoginRedirect] = useAtom(afterLoginRedirectAtom);

  const [formData, setFormData] = useState({
    name: userFromState?.name || "",
    phone: userFromState?.phone || "",
    gender: userFromState?.gender || "",
    dob: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      };
      
      setUserDetailsAtom(updatedUser);
      
      // Update analytics
      Mixpanel.identify(formData.phone);
      Mixpanel.track("profile_completion_success", {
        phone: formData.phone,
        name: formData.name,
        gender: formData.gender,
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
      
      // Navigate to intended destination
      navigate(afterLoginRedirectProps?.afterLoginUrl || afterLoginRedirect?.afterLoginUrl || "/", {
        replace: true,
        state: { ...afterLoginRedirectProps, ...afterLoginRedirect },
      });
    },
  });

  useEffect(() => {
    Mixpanel.track("open_profile_completion_page");
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    const userPayload: IUser = {
      id: userFromState?.id,
      name: formData.name.trim(),
      phone: formData.phone,
      gender: formData.gender as "M" | "F" | "O",
      dob: new Date(formData.dob).toISOString().split('T')[0],
      noOfBookings: userFromState?.noOfBookings ?? 0,
    };

    updateUserMutation(userPayload);
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
        <div className="w-8"></div> {/* Spacer for center alignment */}
        <h2 className="text-lg font-semibold text-gray-900">Complete Profile</h2>
        <div className="w-8"></div> {/* Spacer for center alignment */}
      </div>

      {/* Progress Indicator */}
      <div className="px-6 mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-black h-2 rounded-full w-full transition-all duration-300"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">Step 2 of 2</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-20">
        <div className="max-w-md mx-auto w-full">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tell us about yourself
            </h1>
            <p className="text-gray-600">
              Help us personalize your fitness journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                // value={formData.dob}
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
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Completing Profile...
                </div>
              ) : (
                "Complete Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
