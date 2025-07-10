import { useEffect, useState } from "react";
import {ReactComponent as LocationIcon} from "../../images/utils/location.svg";
import {ReactComponent as ArrowDownIcon} from "../../images/utils/arrow-down-white.svg";
import { BottomUpModal } from "../profile/half-page-modal";



const PlacesV2 = () => {


    const [search, setSearch] = useState("");
    const [places, setPlaces] = useState<any[]>([]);
    const [location, setLocation] = useState<string>("");
    const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

    const fetchPlace = async (lat: number, lng: number) => {
        // Check if location exists in localStorage and is not expired
        // const locationData = localStorage.getItem('zenfitx-location');
        // if (locationData) {
        //     const {timestamp, address} = JSON.parse(locationData);
        //     const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
            
        //     if (Date.now() - timestamp < fiveMinutes) {
        //         // Location data exists and is not expired
        //         setLocation(address);
        //         return;
        //     }
        // }

        // Location not in cache or expired, fetch from API
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&latlng=${lat},${lng}&radius=50`);
            const data = await response.json();
            console.log(data);
            setLocation(data.results[0].formatted_address);
        } catch (error) {
            console.log(error);
        }
        // const data = await response.json();
        // console.log(data);
        // setLocation(data.results[0].formatted_address);
        // Store location data in localStorage with expiration
        // localStorage.setItem('zenfitx-location', JSON.stringify({
        //     timestamp: Date.now(),
        //     address: data.results[0].formatted_address
        // }));
    }


    useEffect(() => {
        // const fetchPlaces = async () => {
        //     const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
        //     const data = await response.json();
        //     setPlaces(data.predictions);
        // }
        // fetchPlaces();
        navigator.geolocation.getCurrentPosition((position: any) => {
            fetchPlace(position.coords.latitude, position.coords.longitude);
        }, (error: any) => {
            console.log(error);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }, [search]);
    
    return (
        <div>
            <div className="flex flex-row gap-2" onClick={() => setShowLocationModal(true)}>
                <LocationIcon className="w-4 h-4" style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                }} />
                <div className="flex flex-col">
                    <div className="text-white font-bold">{location.split(',')[0]}</div>
                </div>
                <ArrowDownIcon className="w-6 h-6" style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                }} />
            </div>
            <div className="text-white text-xs" style={{
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box', 
                maxWidth: '300px',
            }}>{location.split(',').slice(1).join(',')}</div>
            
            {showLocationModal && (
                <BottomUpModal
                    isOpen={showLocationModal}
                    onClose={() => setShowLocationModal(false)}
                    title="Search Location"
                    draggable={true}
                >
                    <div className="flex flex-col gap-2 h-full">
                        <div className="text-black font-bold">Location</div>
                        <div className="text-black font-bold">Location</div>
                    </div>
                </BottomUpModal>
            )}
        </div>
    )
}

export default PlacesV2;