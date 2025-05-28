import React, { useEffect, useState } from "react";
import Dance from "../../images/home/Dance-home.png";
import Yoga from "../../images/home/Yoga-home.png";
import Boxing from "../../images/home/Boxing-home.png";
import Badminton from "../../images/home/Badminton-home.png";
import Gym from "../../images/home/Gym-home.png";
import Swim from "../../images/home/Swimming-home.png";
import Pickleball from "../../images/home/Pickleball-home.png";

import { Carousel } from "react-responsive-carousel";
import { Mixpanel } from "../../mixpanel/init";
import Loader from "../../components/Loader";
import { navigate } from "@reach/router";

interface Onboarding {
  setOnboarding: (val: boolean) => void;
}

const Onboarding: React.FC<Onboarding> = ({ setOnboarding }) => {

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    Mixpanel.track("open_onboarding_page");
  }, []);

  const images = [
		{ id: "Pickleball", url: Pickleball },
		{ id: "Baddy", url: Badminton },
		{ id: "Swim", url: Swim },
		{ id: "Gym", url: Gym },
		{ id: "Dance", url: Dance },
		{ id: "Yoga", url: Yoga },
		{ id: "Boxing", url: Boxing }
	];
	const medias = images.map((i) => <img src={i.url} className="obImg" />);

  return (
		<>
      {showLoader ? <Loader /> : ``}
			<div className="obImgWrap" style={{transform: '0px'}}>
				<Carousel
					swipeable={true}
					showArrows={false}
					showThumbs={false}
					autoPlay={true}
					interval={1200}
					infiniteLoop
					animationHandler="fade"
				>
					{medias}
				</Carousel>
			</div>
			<div className="exploreBtn">
				<div style={{ padding: "0px 24px 16px 24px", width: "82vw" }}>
					<div className="fh1">ZenfitX</div>
					<div className="fh2">
						Explore & book any fitness or wellness activity near you!
					</div>
				</div>
				<button
					className="obBtn"
					onClick={() => {
						// setOnboarding(true);
            setShowLoader(true);
						Mixpanel.track("clicked_explore_now_on_onboarding_page");
						navigate('/login', { state: { signup: true } });
            // navigate('/');
					}}
				>
					{/* Explore Now */}
					Login/Signup
				</button>
			</div>
		</>
	);
};

export default Onboarding;
