import { useEffect, useRef, useState } from "react";
import { IGymCard, IGymDetails } from "../../types/gyms";
import "./style.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { navigate } from "@reach/router";
import ReactPlayer from "react-player";
import { MutedOutlined, SoundOutlined } from "@ant-design/icons";
import ShareMetadata from "../../components/share-metadata";
import { message } from "antd";

interface IGymPhotos {
  gym?: IGymDetails;
  showArray?: boolean;
}

const GymPhotos: React.FC<IGymPhotos> = ({ gym, showArray = true }) => {
  const [isClicked, setIsClicked] = useState<Boolean>(false);
  const [muted, setMuted] = useState(true);

  const shareUrl = window.location.href;
  const shareTitle = `Check out ${gym?.name} on ZenfitX`;
  const shareDescription = `Hey, I just discovered this awesome fitness studio on ZenfitX called ${gym?.name}. Check it out and let's plan this together! Plus, you can score sweet discounts on your first booking.😉`;
  const shareImage = gym?.medias?.[0]?.url || ''; // Use the first media item as the share image, or provide a default

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      message.success("Link copied to clipboard! You can now paste it to share.");
    }).catch(err => {
      console.error('Failed to copy: ', err);
      message.error("Failed to copy link. Please try again.");
    });
  };

  useEffect(() => {
    const shareButton = document.getElementById("share-button");
    shareButton?.addEventListener("click", () => {
      // Check if running in React Native WebView on Android
      if (window.ReactNativeWebView && window.platformInfo?.platform === "android") {
        // Send message to React Native to open native share modal
        window?.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'shareContent',
          title: "ZenfitX",
          text: `Hey, I just discovered this awesome fitness studio on ZenfitX called ${gym?.name}. Check it out and let's plan some awesome activities together! 😉 `,
          url: window.location.href,
        }));
      } else if (navigator.share) {
        // Use Web Share API for browsers that support it
        navigator
          .share({
            title: "ZenfitX",
            text: `Hey, I just discovered this awesome fitness studio on ZenfitX called ${gym?.name}. Check it out and let's plan some awesome activities together! 😉 `,
            url: window.location.href,
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      } else {
        handleShare();
        console.log("error");
      }
    });
    shareButton?.removeEventListener("click", () => {
      setIsClicked(false);
    });
  }, [isClicked]);

  const onSlideChange = (args: any) => {
    console.log(args);
    // args!==1 && pauseVideo()
  };

  const navigateToHome = () => {
    navigate(window.location.origin);
  };

  const shareAndBack = () => {
    return (
      <div className="shareAndBack">
        <span className="Btn" onClick={() => navigateToHome()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15.8327 10.0003H4.16602M4.16602 10.0003L9.99935 15.8337M4.16602 10.0003L9.99935 4.16699"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span
          className="Btn"
          id="share-button"
          onClick={() => setIsClicked(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M7.15833 11.2587L12.85 14.5753M12.8417 5.42533L7.15833 8.74199M17.5 4.16699C17.5 5.5477 16.3807 6.66699 15 6.66699C13.6193 6.66699 12.5 5.5477 12.5 4.16699C12.5 2.78628 13.6193 1.66699 15 1.66699C16.3807 1.66699 17.5 2.78628 17.5 4.16699ZM7.5 10.0003C7.5 11.381 6.38071 12.5003 5 12.5003C3.61929 12.5003 2.5 11.381 2.5 10.0003C2.5 8.61961 3.61929 7.50033 5 7.50033C6.38071 7.50033 7.5 8.61961 7.5 10.0003ZM17.5 15.8337C17.5 17.2144 16.3807 18.3337 15 18.3337C13.6193 18.3337 12.5 17.2144 12.5 15.8337C12.5 14.4529 13.6193 13.3337 15 13.3337C16.3807 13.3337 17.5 14.4529 17.5 15.8337Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    );
  };

  const handleToggleMute = () => setMuted((current) => !current);

  if (gym?.medias?.length) {
    const medias = gym?.medias.map((p: { type: string; url: string }, ind) => {
      if (p.type === "VIDEO") {
        return (
          <>
            {/* <span
              className="muteIcon"
              style={{ zIndex: 1000 }}
              onClick={handleToggleMute}
            >
              {muted ? <MutedOutlined /> : <SoundOutlined />}
            </span>
            <ReactPlayer
              className="player"
              url={p.url}
              playing
              muted={muted}
              playsinline
              volume={1}
              loop
              height={"200px"}
              config={{
                file: {
                  attributes: {
                    controlsList: "nofullscreen",
                  },
                },
              }}
            /> */}
          </>
        );
      } else
        return (
          <div key={`${gym.gymId}-${ind}`} className="carousel-image-wrapper">
            <img
              src={p.url}
              alt={`${gym.name} - ${ind + 1}`}
              className="carousel-image"
            />
          </div>
        );
    });
    return (
      <div className="carouselWrap">
        {shareAndBack()}
        <Carousel
          swipeable={showArray}
          showArrows={false}
          showIndicators={showArray}
          swipeScrollTolerance={100}
          showThumbs={false}
          onChange={onSlideChange}
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            const defStyle = {
              display: "block",
              borderRadius: "100px",
              background: "rgba(201, 201, 201, 0.55)",
              backdropFilter: "blur(1.5px)",
              width: "14px",
              height: "2px",
              marginLeft: 2,
              cursor: "pointer",
            };
            const style = isSelected
              ? { ...defStyle, background: "white" }
              : { ...defStyle };
            return (
              <span
                className="customDots"
                style={style}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`${label} ${index + 1}`}
              >
                {""}
              </span>
            );
          }}
          autoPlay={false}
          interval={7000}
        >
          {medias}
        </Carousel>
      </div>
    );
  } else return null;
};

export default GymPhotos;
