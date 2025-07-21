import { useEffect } from 'react';
import { Mixpanel } from '../mixpanel/init';

export const useMixpanelTracking = () => {
  useEffect(() => {
    const handleMessage = (event: any) => {
      const message = event.data;

      const type = JSON.parse(message).type;
      const timestamp = JSON.parse(message).timestamp;
      const data = JSON.parse(message).data;
      const source = JSON.parse(message).source;

      Mixpanel.track(`${type}`, {
        message: message,
        timestamp: timestamp,
        data: data,
        source: source
      });
    };

    window.addEventListener("message", handleMessage);

    // // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
}; 