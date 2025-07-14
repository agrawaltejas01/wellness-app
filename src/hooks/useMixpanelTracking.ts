import { useEffect } from 'react';
import { Mixpanel } from '../mixpanel/init';

export const useMixpanelTracking = () => {
  useEffect(() => {
    const handleMessage = (event: any) => {
     alert(event.data);
      const message = event.data;
      const type = message.type;
      const timestamp = message.timestamp;
      const data = message.data;
      const source = message.source;

      Mixpanel.track(`${type}`, {
        message: message,
        timestamp: timestamp,
        data: data,
        source: source
      });
    };

    window.addEventListener("message", handleMessage);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
}; 