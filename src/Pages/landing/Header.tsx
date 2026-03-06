import { Mixpanel } from "../../mixpanel/init";

const LOGO_URL = "https://zfx-gyms.zenfitx.link/onboarding/logo.avif";

const LandingHeader: React.FC = () => {
  const scrollToFooter = () => {
    Mixpanel.track("clicked_get_app_on_landing_page");
    document.querySelector(".landing-footer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="landing-header">
      <a href="/" className="landing-header__logo-link" aria-label="ZenFitX">
        <img
          src={LOGO_URL}
          alt="ZenFitX"
          className="landing-header__logo"
          loading="eager"
        />
      </a>
      <button className="landing-header__get-app" onClick={scrollToFooter}>
        Get the App
      </button>
    </header>
  );
};

export default LandingHeader;
