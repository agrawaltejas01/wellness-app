import "@fontsource/plus-jakarta-sans";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import reportWebVitals from "./reportWebVitals";

function checkAndRedirect() {
  const currentUrl = window.location.href;
  // const isGymUrl = /^https?:\/\/zenfitx\.in\/gym\/(30)/.test(currentUrl);
  const isGymUrl = true;

  // Check if we're in React Native WebView
  const isInWebView = Boolean(
    (window as any).ReactNativeWebView ||
      navigator.userAgent.toLowerCase().includes("wv") ||
      navigator.userAgent.toLowerCase().includes("webview") ||
      navigator.userAgent.toLowerCase().includes("react-native"),
  );

  // Only redirect if it's a gym URL and we're not in WebView
  if (isGymUrl && !isInWebView) {
    // Clear the page content first
    document.body.innerHTML = "";
    document.body.style.backgroundColor = "#FFFFFF";

    // Small delay before redirect to ensure blank screen is shown
    setTimeout(() => {
      const userAgent = navigator.userAgent.toLowerCase();

      if (/iphone|ipad|ipod/.test(userAgent)) {
        window.location.href = "https://apps.apple.com/app/id6736351969";
      } else if (/android/.test(userAgent)) {
        window.location.href =
          "https://play.google.com/store/apps/details?id=com.zenfitx.zenfitxapp";
      }
    }, 100);
  }
}

// Run the check when the page loads
window.addEventListener("load", checkAndRedirect);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <GoogleOAuthProvider clientId="396103304924-vmr6eu83uq789oonk7k6jr3eq5oukloi.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
