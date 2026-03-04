const IOS_URL = "https://apps.apple.com/in/app/zenfitx/id6736351969";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.zenfitx.zenfitxapp";

const APPLE_BADGE =
  "https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg";
const GOOGLE_BADGE =
  "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png";

const LandingFooter: React.FC = () => {
  return (
    <footer className="landing-footer">
      <p className="landing-footer__label">Download the app</p>
      <div className="landing-footer__store-group">
        <a
          href={IOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on the App Store"
          className="landing-footer__badge-link"
        >
          <img
            src={APPLE_BADGE}
            alt="Download on the App Store"
            className="landing-footer__badge landing-footer__badge--apple"
          />
        </a>

        <a
          href={ANDROID_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on Google Play"
          className="landing-footer__badge-link"
        >
          <img
            src={GOOGLE_BADGE}
            alt="Get it on Google Play"
            className="landing-footer__badge landing-footer__badge--google"
          />
        </a>
      </div>
    </footer>
  );
};

export default LandingFooter;
