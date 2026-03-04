import { RouteComponentProps } from "@reach/router";
import LandingHeader from "./Header";
import LandingBody from "./Body";
import LandingFooter from "./Footer";
import "./style.css";

interface ILandingPage extends RouteComponentProps {}

const LandingPage: React.FC<ILandingPage> = () => {
  return (
    <div className="landing-page">
      <LandingHeader />
      <LandingBody />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
