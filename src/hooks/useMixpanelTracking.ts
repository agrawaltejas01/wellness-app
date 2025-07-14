import { useEffect } from 'react';
import { Mixpanel } from '../mixpanel/init';

export const useMixpanelTracking = () => {
  useEffect(() => {
    const handleMessage = (event: any) => {
      const message = event.data;
      const type = message.type;
      const timestamp = message.timestamp;
      const data = message.data;
      const source = message.source;

      alert(type);

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