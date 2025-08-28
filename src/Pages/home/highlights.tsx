import highlights from "../../images/home/badminton-player.png";
import {ReactComponent as RightArrow} from "../../images/home/right-arrow.svg"
import { useNavigate } from "@reach/router";
import { useState } from "react";

const Highlights = () => {
  const navigate = useNavigate();

  return (  
    <div className="flex flex-row rounded-lg gap-2 bg-blue-200 px-4 py-2 justify-between shadow-[0_0_15px_rgba(0,0,0,0.2)] cursor-pointer"
     onClick={()=>{
      navigate('/highlights', {state: {url: "https://zfx-gyms.zenfitx.link/videos/prod/highlights/a.mp4"}});
     }}>
      <div className="flex flex-col gap-2 justify-center">
        <h1 className="text-md font-bold text-black">Highlight of your last game is ready.</h1>
        <h1 className="text-md font-bold text-black">Checkout now!</h1>
      </div>
      <img src={highlights} alt="Highlights" style={{ width: "70px", height: "100px" }} />
      <div className="flex flex-col justify-center"> 
        <RightArrow />
      </div>
    </div>  
  );
};

export default Highlights;