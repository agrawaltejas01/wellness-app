import highlights from "../../images/home/badminton-player.png";
import {ReactComponent as RightArrow} from "../../images/home/right-arrow.svg"
import { useNavigate } from "@reach/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getHighlights } from "../../apis/highlights/highlights";

const Highlights = () => {
  const navigate = useNavigate();
  const [videoHighlights, setVideoHighlights] = useState<string>("");
  const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
  const userId = userDetails.id;
  const {mutate: _getHighlights} = useMutation({
    mutationFn: getHighlights,
    onSuccess: (result) => {
      console.log(result);
      setVideoHighlights(result?.highlight_link || "");
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      console.log("Highlights fetched");
    //   alert(videoHighlights);
    },
  });

  useEffect(() => {
    _getHighlights(userId);
  }, []);

  return (  
    videoHighlights && videoHighlights.length > 0 ?  (

    <div className="flex flex-row rounded-lg gap-2 px-4 py-2 justify-between shadow-[0_0_15px_rgba(0,0,0,0.2)] cursor-pointer"
    style={{'background': 'linear-gradient(to right, rgba(199, 255, 202, 1), rgba(238, 255, 183, 1))'}}
     onClick={()=>{
      navigate('/highlights', {state: {url: videoHighlights}});
     }}>
      <div className="flex flex-col gap-2 justify-center">
        <h1 className="text-xs font-bold italic text-black">Highlight of your last game is ready.</h1>
        <h1 className="text-xs font-bold text-black">Checkout now!</h1>
      </div>
    <div className="flex flex-row gap-2 justify-center">
      <img src={highlights} alt="Highlights" style={{ width: "50px", height: "75px" }} />
      <div className="flex flex-col justify-center"> 
        <RightArrow />
      </div>
      </div>
    </div>  
    ) : null
  );
};

export default Highlights;