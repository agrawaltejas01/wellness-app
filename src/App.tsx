import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "@reach/router";
import { useState, useEffect } from "react";

import Home from "./Pages/home/home";
import Gym from "./Pages/gym/gym";
import BatchCheckout from "./Pages/checkout/batch-checkout";
import BatchPaymentSuccess from "./Pages/checkout/payment-success";
import PlusCheckout from "./Pages/checkout/plus-checkout";
import PlusPaymentSuccess from "./Pages/checkout/plus-payment-success";
import Login from "./Pages/auth/login";
import VerifyMagicLink from "./Pages/auth/verify";
import NewLogin from "./Pages/auth/new-login";
import NewVerify from "./Pages/auth/new-verify";
import ProfileCompletion from "./Pages/auth/profile-completion";
import AuthDemo from "./Pages/auth/auth-demo";
import Profile from "./Pages/profile/Profle";
import SchedulePage from "./Pages/checkout/schedule-page";
import Activity from "./Pages/activity/Activity";
// import BatchCheckoutBooking from "./Pages/checkout/checkout";
import PrivacyPolicy from "./Pages/privacy/privacy";
import BatchCheckoutV2 from "./Pages/checkout/batch-checkout-v2";
import BatchCheckoutBookingV2 from "./Pages/checkout/checkout-v2";
import GoToApp from "./components/go-to-app";
import Coins from "./Pages/coins/coins";
import BookingInfoHost from "./Pages/bookings/host";
import BookingInfoCenter from "./Pages/bookings/center";
import FeedbackThankyou from "./Pages/home/feedback-thankyou";
import Leaderboard from "./Pages/leaderboard/leaderboard";
import UserProfile from "./Pages/user-profile/user-profile";
import Highlights from "./Pages/highlights/highlights";

// Create a client
const queryClient = new QueryClient();

// Layout component that includes the GoToApp banner on all pages
const AppLayout: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const [isAppBannerVisible, setIsAppBannerVisible] = useState(false);
  
  // When banner becomes visible, disable body scrolling
  useEffect(() => {
    if (isAppBannerVisible) {
      // Disable scrolling on body
      document.body.style.overflow = 'hidden';
      // Save the current scroll position
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Re-enable scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.top = '';
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
    
    return () => {
      // Cleanup when component unmounts
      document.body.style.position = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isAppBannerVisible]);
  
  return (
    <>
      {/* Main content with conditional dimming */}
      <div className={isAppBannerVisible ? "" : ""}>
        {children}
      </div>
      
      {/* App banner with overlay effect when visible */}
      {/* <GoToApp onVisibilityChange={setIsAppBannerVisible} /> */}
      
      {/* Improved overlay that both dims and prevents interaction */}
      {/* {isAppBannerVisible && (
        <div 
          className="app-overlay"
          aria-hidden="true"
          onClick={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        />
      )} */}
    </>
  );
};

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Router>
          {/* <LandingPage path="/" /> */}
          <Home path="/" />
          <Activity path="/:activity" />
          {/* <Login path="/login" /> */}
          <VerifyMagicLink path="/verify" />
          <NewLogin path="/login" />
          <NewVerify path="/verify-otp" />
          <ProfileCompletion path="/profile-completion" />
          {/* <AuthDemo path="/auth-demo" /> */}

        <Profile path="/profile" />
        <Gym path="/gym/:gymId" />
        <SchedulePage path="/gym/:gymId/batch" />
        {/* <GuestCheckout path="/gym/:gymId/batch/checkout" /> */}
        <BatchCheckoutV2 path="/checkout/batch/:batchId" />
        <BatchCheckoutBookingV2 path="/checkout/batch/:batchId/booking" />
        <PlusCheckout path="/checkout/plus" />
        <BatchPaymentSuccess path="/checkout/success" />
        <PlusPaymentSuccess path="/plus/success" />
        <PlusPaymentSuccess path="/plus/success" />
          <PrivacyPolicy path="/privacy" />
          <Coins path="/coins" />
          <BookingInfoHost path="/booking-info-host" />
          <BookingInfoCenter path="/booking-info-center" /> 
          <FeedbackThankyou path="/feedback-thankyou" />
          <Highlights path="/highlights" />
          <Leaderboard path="/leaderboard" />
          <UserProfile path="/user-profile" />
        </Router>
      </AppLayout>
    </QueryClientProvider>
  );
} 

export default App;
