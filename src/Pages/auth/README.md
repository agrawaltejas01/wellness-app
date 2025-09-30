# New Authentication Flow

This directory contains the new modern authentication flow for the ZenfitX wellness app.

## Components

### 1. NewLogin (`new-login.tsx`)
- **Route**: `/new-login`
- Modern minimalist login page with mobile number input
- Sends OTP to the provided mobile number
- Features:
  - Clean white background with black buttons
  - Mobile-first responsive design
  - Input validation for 10-digit mobile numbers
  - Loading states and error handling
  - Automatic navigation to OTP verification

### 2. NewVerify (`new-verify.tsx`)
- **Route**: `/verify-otp`
- OTP verification page with 4-digit code input
- Features:
  - Large, accessible OTP input fields
  - Resend OTP functionality with 30-second cooldown
  - Error handling for incorrect OTP
  - Automatic navigation based on user status (new vs existing)

### 3. ProfileCompletion (`profile-completion.tsx`)
- **Route**: `/profile-completion`
- Profile completion form for new users or users with incomplete profiles
- Required fields:
  - Full Name
  - Mobile Number (pre-filled and disabled if already exists)
  - Gender (Male/Female/Other)
  - Date of Birth
- Features:
  - Form validation with real-time error messages
  - Age validation (minimum 13 years)
  - Progress indicator
  - Integration with analytics (Mixpanel, Firebase)

### 4. AuthDemo (`auth-demo.tsx`)
- **Route**: `/auth-demo`
- Demo page for testing the new authentication flow
- Provides buttons to test different parts of the flow

## Flow Logic

1. **User enters mobile number** → `/new-login`
2. **OTP sent and verified** → `/verify-otp`
3. **Check user profile completeness**:
   - If new user OR missing profile data → `/profile-completion`
   - If existing user with complete profile → Navigate to intended destination

## API Integration

The new flow integrates with existing APIs:
- `checkUserPhoneAndSendOtp()` - Send OTP to mobile number
- `verifyOtplessOtp()` - Verify OTP and get user data
- `addUser()` - Create/update user profile
- `checkUserPhoneAndResendOtp()` - Resend OTP

## Styling

- **Design**: Modern minimalist with white background
- **Buttons**: Black with hover states
- **Framework**: Tailwind CSS for responsive design
- **Typography**: Clean, readable fonts with proper hierarchy
- **Mobile-first**: Optimized for mobile devices

## Testing

Visit `/auth-demo` to test the complete authentication flow without affecting the existing login system.

## Migration Notes

- The new flow is available alongside the existing auth system
- Routes are separate (`/new-login` vs `/login`)
- The redirect hook has been updated to use the new flow by default
- All existing functionality remains intact
