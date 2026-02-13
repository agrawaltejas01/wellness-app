import { RouteComponentProps } from "@reach/router";
import { Flex } from "antd";
import LandingHeader from "./Header";
import LandingFooter from "./Footer";
import LandingContent from "./Content";
import "./style.css";

interface ILandingPage extends RouteComponentProps {}

const LandingPage: React.FC<ILandingPage> = () => {
  return (
    <div className="landing-page">
      <LandingHeader />
      <LandingContent />
      <div className="content-container">
        <LandingFooter />
      </div>
    </div>
  );
};

export default LandingPage;
