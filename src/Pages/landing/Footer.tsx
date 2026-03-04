const IOS_URL = "https://apps.apple.com/in/app/zenfitx/id6736351969";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.zenfitx.zenfitxapp";

const APPLE_BADGE =
  "https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg";
const GOOGLE_BADGE =
  "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png";
const QR_CODE = "https://zfx-gyms.zenfitx.link/onboarding/qrcode.png";

const LandingFooter: React.FC = () => {
  return (
    <footer className="landing-footer">
      <p className="landing-footer__label">Download the app</p>

      <div className="landing-footer__content">
        {/* QR code — desktop only */}
        <div className="landing-footer__qr-wrap">
          <img src={QR_CODE} alt="Scan to download ZenFitX" className="landing-footer__qr" />
          <span className="landing-footer__qr-hint">Scan to download</span>
        </div>

        <div className="landing-footer__divider" />

        {/* Store badges */}
        <div className="landing-footer__store-group">
          <a
            href={IOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
            className="landing-footer__badge-link"
          >
            <div className="landing-footer__badge-box">
              <img
                src={APPLE_BADGE}
                alt="Download on the App Store"
                className="landing-footer__badge landing-footer__badge--apple"
              />
            </div>
          </a>

          <a
            href={ANDROID_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get it on Google Play"
            className="landing-footer__badge-link"
          >
            <div className="landing-footer__badge-box">
              <img
                src={GOOGLE_BADGE}
                alt="Get it on Google Play"
                className="landing-footer__badge landing-footer__badge--google"
              />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
