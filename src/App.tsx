import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "@reach/router";

import Home from "./Pages/home/home";
import Gym from "./Pages/gym/gym";
import BatchCheckout from "./Pages/checkout/batch-checkout";
import BatchPaymentSuccess from "./Pages/checkout/payment-success";
import PlusCheckout from "./Pages/checkout/plus-checkout";
import PlusPaymentSuccess from "./Pages/checkout/plus-payment-success";
import Login from "./Pages/auth/login";
import VerifyMagicLink from "./Pages/auth/verify";
import Profile from "./Pages/profile/Profle";
import SchedulePage from "./Pages/checkout/schedule-page";
import Activity from "./Pages/activity/Activity";
// import BatchCheckoutBooking from "./Pages/checkout/checkout";
import PrivacyPolicy from "./Pages/privacy/privacy";
import BatchCheckoutV2 from "./Pages/checkout/batch-checkout-v2";
import BatchCheckoutBookingV2 from "./Pages/checkout/checkout-v2";
import GoToApp from "./components/go-to-app";
// Create a client
const queryClient = new QueryClient();

// Layout component that includes the GoToApp banner on all pages
const AppLayout: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  return (
    <>
      {children}
      <GoToApp />
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
          <Login path="/login" />
          <VerifyMagicLink path="/verify" />

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
        </Router>
      </AppLayout>
    </QueryClientProvider>
  );
} 

export default App;
