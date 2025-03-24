// global.d.ts

interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}
interface Window {
  ReactNativeWebView: {
    postMessage: (message: string) => void;
  };
  pastAppBookings?: PastAppBookingObject;
  onAppLoad?: () => void;
  isFromApp?: boolean;
  paymentCallback: (response: any) => void;
  platformInfo?: {
    platform: ?string;
    version?: string;
    appVersion: ?string;
  };
}

//   declare global {
//     interface Window {
//       ReactNativeWebView: {
//         postMessage: (message: string) => void;
//       };
//       onAppLoad?: () => void;
//       isFromApp?: boolean;
//     }
//   }

