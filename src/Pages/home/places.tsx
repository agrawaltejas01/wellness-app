import { useEffect, useState } from "react";
import {ReactComponent as LocationIcon} from "../../images/utils/location.svg";
import {ReactComponent as ArrowDownIcon} from "../../images/utils/arrow-down-white.svg";
import { BottomUpModal } from "../profile/half-page-modal";
import {ReactComponent as SearchIcon} from "../../images/home/search.svg";
import { useMutation } from "@tanstack/react-query";
import { getLocation, searchLocation, getPlaceDetails } from "../../apis/location/location";
import { Mixpanel } from "../../mixpanel/init";



const Places = () => {

    const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
    const userId = userDetails.id;

    const [search, setSearch] = useState("");
    const [places, setPlaces] = useState<any[]>([]);
    const [location, setLocation] = useState<string>("");
    const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
    const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");
    const [lat, setLat] = useState<number>(0);
    const [lng, setLng] = useState<number>(0);


    const {mutate: _searchLocation} = useMutation({
        mutationFn: searchLocation,
        onSuccess: (data) => {
            setPlaces(data.predictions);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const {mutateAsync: _getPlaceDetails} = useMutation({
        mutationFn: getPlaceDetails,
        onSuccess: (data) => {
            return data;
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const {mutateAsync: _getLocation} = useMutation({
        mutationFn: getLocation,
        onSuccess: (data) => {
            return data;
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const fetchPlace = async (lat: number, lng: number, refresh: boolean = false) => {
        // Check if location exists in sessionStorage and is not expired
        if(!refresh) {
            const locationData = sessionStorage.getItem('zenfitx-location');
            if (locationData) {
                const {timestamp, address} = JSON.parse(locationData);
                const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
                
                if (Date.now() - timestamp < fiveMinutes) {
                    // Location data exists and is not expired
                    setLocation(address);
                    return;
                }
            }
        }

        // Location not in cache or expired, fetch from API
        try {
            const data = await _getLocation({latitude: lat, longitude: lng});
            setLocation(data.results[0].formatted_address);
            sessionStorage.setItem('zenfitx-location', JSON.stringify({
                timestamp: Date.now(),
                address: data.results[0].formatted_address
            }));
        } catch (error) {
            console.log(error);
        }
        // const data = await response.json();
        // console.log(data);
        // setLocation(data.results[0].formatted_address);
        // Store location data in localStorage with expiration
        
    }


    useEffect(() => {
        // const fetchPlaces = async () => {
        //     const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
        //     const data = await response.json();
        //     setPlaces(data.predictions);
        // }
        // fetchPlaces();
        navigator.geolocation.getCurrentPosition((position: any) => {
            sessionStorage.setItem('zenfitx-latitude', position.coords.latitude.toString());
            sessionStorage.setItem('zenfitx-longitude', position.coords.longitude.toString());
            Mixpanel.track('current_location', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                user_id: userId
            });
            fetchPlace(position.coords.latitude, position.coords.longitude);
        }, (error: any) => {
            if(sessionStorage.getItem('zenfitx-location')) {
                const locationData = JSON.parse(sessionStorage.getItem('zenfitx-location') || '{}');
                setLocation(locationData.address);
            } else {
                setLocation('Select location');
            }
            console.log(error);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }, [search]);

    const fetchPlaceDetails = async (place: any) => {
        const data = await _getPlaceDetails(place.place_id);
        setLocation(place.structured_formatting.main_text + ', ' + place.structured_formatting.secondary_text);
        sessionStorage.setItem('zenfitx-latitude', data.location.latitude.toString());
        sessionStorage.setItem('zenfitx-longitude', data.location.longitude.toString());
        sessionStorage.setItem('zenfitx-location', JSON.stringify({
            timestamp: Date.now(),
            address: place.structured_formatting.main_text + ', ' + place.structured_formatting.secondary_text
        }));
        Mixpanel.track('location_changed', {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            user_id: userId
        });
        // fetchPlace(data.location.latitude, data.location.longitude, true);
        setShowLocationModal(false);
    }

    useEffect(() => {
        if(search.length > 2 && showLocationModal) {
            _searchLocation(search);
        } else {
            setPlaces([]);
        }
    }, [search]);
    
    return (
        <div>
            <div className="flex flex-row gap-2" onClick={() => setShowLocationModal(true)}>
                <LocationIcon className="w-4 h-4" style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                }} />
                <div className="flex flex-col">
                    <div className="text-white font-bold"
                    style={{
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box', 
                        maxWidth: '250px',
                    }}>{location.split(',')[0]}</div>
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
                    // draggable={false}
                >
                    <div className="flex flex-col gap-2 h-full">
                        <div className="flex flex-row gap-2 items-center px-2 py-1 bg-gray-100 border-b border-gray-300 rounded-lg mx-4 mb-1">  
                            <SearchIcon className="w-5 h-5" style={{
                                marginLeft: '10px',
                            }} />
                            <input type="text" className="text-black p-2 bg-transparent outline-none w-full" placeholder="search your location" onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            { places.length > 0 && <div className="text-sm text-gray font-bold px-4 mt-2">SEARCH RESULTS</div>}
                            { places.length > 0 && places.map((place, index) => (
                                <div>
                                <div className="flex flex-col gap-2 px-2 mx-4 mb-1" key={index} onClick={() => {
                                    setSelectedPlaceId(place.place_id);
                                    fetchPlaceDetails(place);
                                    setShowLocationModal(false);
                                }}>
                                    <div className="flex flex-row gap-2 items-center">
                                        <LocationIcon className="w-4 h-4" />
                                        <div className="text-sm text-black font-bold">{place.structured_formatting.main_text}</div>
                                    </div>
                                    <div className="text-xs text-gray">{place.structured_formatting.secondary_text}</div>
                                </div>
                                {index !== places.length - 1 && <hr className="border-gray-300 mx-4" />}
                                </div>
                            ))}
                        </div>
                        { places.length === 0 && search.length > 2 && <div className="text-sm text-gray font-bold px-4 mt-2">NO RESULTS FOUND</div>}
                        <div className="h-screen" /> 
                    </div>  
                </BottomUpModal>
            )}
        </div>
    )
}

export default Places;  
