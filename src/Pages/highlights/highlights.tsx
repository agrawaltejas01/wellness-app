import { RouteComponentProps, useLocation } from "@reach/router";
import ReelsVideoPlayer from "./a";

interface IHighlights extends RouteComponentProps {}

const Highlights: React.FC<IHighlights> = () => {

  const {url, downloadEnabled = true} = useLocation().state as {url: string, downloadEnabled: boolean};

  const handleShare = () => {
    const video = document.getElementById("video") as HTMLVideoElement;
    const videoURL = video?.currentSrc;

    if (navigator.share) {
        navigator.share({
        title: "Check out this video!",
        text: "Watch this video I found:",
        url: videoURL
        }).catch(err => console.log("Share failed:", err));
    } else {
        alert("Sharing not supported in this browser.");
    }
  }


  return (
    // <div className="flex flex-col gap-2 h-screen mx-auto pb-10">
    //   <h1 className="text-2xl font-bold text-black px-4 py-4">Highlights</h1>
    //   <video id="video" src={url} controls={true} muted autoPlay={true} loop={true} style={{
    //     backgroundSize: "cover",
    //     overflow: "hidden",
    //     padding: "20px",
    //   }} />
    //   <div className="flex flex-row gap-2 justify-center mx-5">
    //     <div className="rounded-lg bg-gray-300 text-black font-bold text-lg px-4 py-2 w-1/2 text-center cursor-pointer" onClick={handleShare}>
    //         Share
    //     </div>
    //     <div className="rounded-lg bg-gray-300 text-black font-bold text-lg px-4 py-2 w-1/2 text-center cursor-pointer">
    //         <a href={url} download="highlight.mp4" >Download</a>
    //     </div>
    //   </div>
    // </div>
    <ReelsVideoPlayer src={url} caption="" downloadEnabled={downloadEnabled} />
  );
};

export default Highlights;