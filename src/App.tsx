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
// Create a client
const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
