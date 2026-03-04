import { RouteComponentProps } from "@reach/router";
import LandingHeader from "./Header";
import LandingBody from "./Body";
import LandingFooter from "./Footer";
import "./style.css";
import { useEffect } from "react";
import useWindowDimensions from "../../hooks/getWindowDimensions";

interface ILandingPage extends RouteComponentProps {}

const LandingPage: React.FC<ILandingPage> = () => {
  const dimensions = useWindowDimensions();

  useEffect(() => {
    console.log(dimensions);
  }, []);

  return (
    <div className="landing-page">
      <LandingHeader />
      <LandingBody />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
