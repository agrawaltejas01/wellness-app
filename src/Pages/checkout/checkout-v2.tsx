import { RouteComponentProps, useLocation } from "@reach/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IBatch } from "../../types/gyms";
import { getActivityById } from "../../apis/gym/activities";
import { errorToast } from "../../components/Toast";
import { getUserSkillLevel } from "../../apis/user/userDetails";
import SkillLevelInput from "./skill-input";
import BatchCheckoutV2 from "./batch-checkout-v2";
import Home from "../home/home";
import CheckoutV3 from "./checkout-v3";
import { ACTIVITY_NAME_TO_ID_MAP, COPLAYER_CARD_ENABLED } from "../../constants/activities";
import Loader from "../../components/Loader";
interface IClassCheckout extends RouteComponentProps {}

interface IClassCheckout {
}

interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}

const BatchCheckoutBookingV2: React.FC<IClassCheckout> = () => {

    const batchId = window.location.pathname.split("/")[3];
    const [skillLevel, setSkillLevel] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    
    const [batchDetails, setBatchDetails] = useState<IBatch>();

    const { mutate: _getActivityById } = useMutation({
        mutationFn: getActivityById,
        onSuccess: (result) => {
          setBatchDetails(result.batch);
        },
        onError: (error) => {
          errorToast("Error in getting gym data");
        },
    });

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [showSkillInput, setShowSkillInput] = useState<boolean>(false);

    const { mutate: _getUserSkillLevel } = useMutation({
        mutationFn: getUserSkillLevel,
        onSuccess: (result) => {
            if(result.skillLevel == 'UNKNOWN') {
                setShowSkillInput(true);
            } else {
                console.log(`result.skillLevel: ${result.skillLevel}`);
                setSkillLevel(result.skillLevel);
            }
        },
        onError: (error) => {
            errorToast("Error in getting user skill level");
        },
    });

    useEffect(() => {   
        _getActivityById(batchId);
    }, [batchId]);

    useEffect(() => {
        const userId = window.localStorage["zenfitx-user-details"]
                        ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
                        : null;

        // const userId = 59;

        const localSkillLevel = localStorage.getItem(`skillLevel-${ACTIVITY_NAME_TO_ID_MAP[`${batchDetails?.activity}` as keyof typeof ACTIVITY_NAME_TO_ID_MAP]}`);
        if(localSkillLevel != null) {
            setSkillLevel(localSkillLevel);
        }

        if(userId == null) {
            setShowSkillInput(false);
            setLoading(false);
        } else {
            if(batchDetails?.activity.toUpperCase() == "FOOTBALL" || (batchDetails?.slots && (batchDetails?.slots > 6 && batchDetails?.activity?.toUpperCase() != "PICKLEBALL"))) {
                setShowSkillInput(false);
            } else if(!COPLAYER_CARD_ENABLED.includes(batchDetails?.activity.toUpperCase() || "")) {
                setShowSkillInput(false);
            } else if(userId && batchId) {
                _getUserSkillLevel({userId, batchId: Number(batchId)});
                console.log(`skillLevel: ${skillLevel}`);
                
            } else if(skillLevel) {
                setShowSkillInput(false);
            } 
            
            if(queryParams.get('edit') == 'true') {
                setShowSkillInput(true);
            } else if(queryParams.get('edit') == 'false') {
                setShowSkillInput(false);
            }
            setLoading(false);
        }
    }, [batchDetails, location.search]);

    useEffect(() => {
        if(batchDetails) {
            localStorage.setItem(`skillLevel-${ACTIVITY_NAME_TO_ID_MAP[`${batchDetails?.activity}`.toUpperCase() as keyof typeof ACTIVITY_NAME_TO_ID_MAP]}`, skillLevel);
        }
    }, [batchDetails, skillLevel]);


    if(loading) {
        return <Loader />
    }

    if(showSkillInput) {

        const userId = window.localStorage["zenfitx-user-details"]
                        ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
                        : null;
        return (    
            <div className="flex flex-col">
                <div className="flex flex-col blur-sm fixed top-0 left-0 right-0 bottom-0 pointer-events-none">
                <CheckoutV3 skillLevel={skillLevel}/>
                </div>
                <div className="flex flex-col z-10">
                    <SkillLevelInput userId={userId} activityId={ACTIVITY_NAME_TO_ID_MAP[`${batchDetails?.activity}` as keyof typeof ACTIVITY_NAME_TO_ID_MAP]} batchId={Number(batchId)} />
                </div>
            </div>
        )
    } else { 
        return (
            <div>
                <CheckoutV3 skillLevel={skillLevel} />
            </div>
        )
    }
}

export default BatchCheckoutBookingV2;