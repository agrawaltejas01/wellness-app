import React from 'react';
import './ForceUpdatePopup.css'; // Assuming you'll add some styles
import { Mixpanel } from '../mixpanel/init';

const ForceUpdatePopup = () => {
  const handleUpdateClick = () => {
    // Replace with your actual App Store URL
    // const appStoreUrl = 'itms-apps://apps.apple.com/in/app/zenfitx/id6736351969';
    Mixpanel.track("force_update_clicked");
    const appStoreUrl = 'https://apps.apple.com/in/app/zenfitx/id6736351969';
    window.location.href = appStoreUrl;
  };

  return (
    <div className="force-update-overlay">
      <div className="force-update-modal">
        <h2>Update Required</h2>
        <p>
          A new version of our app is available! Please update to continue
          using the application.
        </p>
        <div className="update-button-container">
          <button onClick={handleUpdateClick} className="update-button">
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForceUpdatePopup;