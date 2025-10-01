import { useMutation } from "@tanstack/react-query";
import { getCoins } from "../../apis/coins/coins";
import IUser from "../../types/user"
import { useEffect, useState } from "react";
import { Mixpanel } from "../../mixpanel/init";
import { navigate } from "@reach/router";
import RatingHomepage from "./rating-homepage";

const HomeBannerV2: React.FC<{userDetails: IUser}> = ({userDetails}) => {

    const [coins, setCoins] = useState(0);

    const { mutate: _getCoins } = useMutation({
        mutationFn: getCoins,
        onSuccess: (result) => {
            setCoins(result.coins);
        }
      });
    
      useEffect(() => {
        _getCoins(userDetails?.id as number);
      }, []);

  return (
    <div style={{'width':'100%', 'backgroundColor':'black' }} className="p-4 flex flex-col justify-between">
        <div className="flex flex-row justify-between">
            <div style={{'color':'white'}} className="flex flex-row items-center gap-2">
                <div
                    style={{
                    width: `${20 * 2}px`,
                    height: `${20 * 2}px`,
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #ff0000, #ff8800, #ffff00, #88ff00, #00ff00, #00ff88, #00ffff, #0088ff, #0000ff, #8800ff, #ff00ff, #ff0088, #ff0000)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2px'
                    }}
                >
                <div
                    style={{
                        width: `${20 * 2 - 4}px`,
                        height: `${20 * 2 - 4}px`,
                        borderRadius: '50%',
                        backgroundColor: 'black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: `${20}px`,
                        fontWeight: 'bold',
                        fontFamily: 'Plus Jakarta Sans',
                        color: 'white'
                    }}
                >
                {userDetails?.name.split(" ")[0].charAt(0)}
            </div>
        </div>
            <div className="flex flex-col flex-start">
                <div className="text-white text-sm font-bold flex-start"> {userDetails?.name.split(" ")[0]} </div>
            </div>
            </div>
            <div className="flex flex-row gap-3 items-center">
          {coins > 0 && <div className="flex flex-row rounded-full gap-2 items-center border border-white p-1 bg-red-500 bg-opacity-50" 
              onClick={()=>{
                navigate('/coins')
                Mixpanel.track("clicked_coins_capsule_home", {
                  user_id: userDetails?.id
                });
              }}>
            <img src={require('../../images/home/coin.jpg')} className="rounded-lg w-4 h-4"/>
            <p className="text-white text-sm font-bold">{coins}</p>
          </div>}
          <div className="flex text-white text-sm border rounded-lg px-2 py-1" onClick={()=>navigate('/profile')}>Bookings</div>
            </div>
        </div>
        <div className="mt-8 w-full">
            <RatingHomepage userDetails={userDetails} />
        </div>
    </div>
  )
}

export default HomeBannerV2