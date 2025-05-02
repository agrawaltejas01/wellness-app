import "@fontsource/plus-jakarta-sans";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import reportWebVitals from "./reportWebVitals";

// Add this at the top of your index.tsx
function mobileRedirect() {
  // Don't redirect if we're in a WebView
  const isInWebView = Boolean(
    (window as any).ReactNativeWebView ||
    navigator.userAgent.toLowerCase().includes("wv") ||
    navigator.userAgent.toLowerCase().includes("webview") ||
    navigator.userAgent.toLowerCase().includes("react-native")
  );


  if (isInWebView) {
    return; // Skip redirection if in WebView
  }

  // Check if it's a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) {
    return; // Skip redirection if not mobile
  }

  // Get current path for deep linking
  const currentPath = window.location.pathname + window.location.search;
  // Define app links
  const isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
  const appScheme = isAndroid 
  ? "zenfitx://" + currentPath.substring(1) 
  : "zenfitx://" + currentPath.substring(1);
  
  const appStoreLink = isAndroid
    ? "https://play.google.com/store/apps/details?id=com.zenfitx.zenfitxapp"
    : "https://apps.apple.com/app/id6736351969";

  // Try to open the app first
  let appOpened = false;
  
  // Set timeout for fallback to app store
  const timeout = setTimeout(() => {
    if (!appOpened) {
      // Clear the page content for cleaner transition
      document.body.innerHTML = "";
      document.body.style.backgroundColor = "#FFFFFF";
      
      // Redirect to app store
      window.location.href = appStoreLink;
    }
  }, 1500);
  
  // Clear timeout if app opens
  const clearRedirectTimeout = () => {
    appOpened = true;
    clearTimeout(timeout);
  };
  
  window.addEventListener('pagehide', clearRedirectTimeout);
  window.addEventListener('blur', clearRedirectTimeout);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      clearRedirectTimeout();
    }
  });

  // Try Android intent first for Android devices
  if (isAndroid) {
    const currentUrl = new URL(window.location.href);
    const intentUrl = `intent://${currentUrl.host}${currentUrl.pathname}${currentUrl.search}#Intent;scheme=https;package=com.zenfitx.zenfitxapp;S.browser_fallback_url=${encodeURIComponent(appStoreLink)};end`;
    // const intentUrl = `intent://${currentPath.substring(1)}#Intent;scheme=zenfitx;package=com.zenfitx.zenfitxapp;S.browser_fallback_url=${encodeURIComponent(appStoreLink)};end`;
    window.location.href = intentUrl;
  } else {
    // For iOS, try universal links first (if configured), then custom scheme
    window.location.href = appScheme;
  }
}

// Run immediately before React loads
// if (typeof window !== 'undefined') {
//   mobileRedirect();
// }


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
    }, 200);
  }
}

// // Run the check when the page loads
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
