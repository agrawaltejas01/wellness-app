import React, { useEffect, useState, useRef } from "react";
import { Mixpanel } from "../../mixpanel/init";
import Loader from "../../components/Loader";
import { navigate } from "@reach/router";

interface Onboarding {
  setOnboarding: (val: boolean) => void;
}

const Onboarding: React.FC<Onboarding> = ({ setOnboarding }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState('https://zfx-gyms.zenfitx.link/onboarding/first.avif');
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselIndexRef = useRef(0);
  const secondImageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const carouselStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const carouselImagesRef = useRef<string[]>([]);

  useEffect(() => {
    Mixpanel.track("open_onboarding_page");
    
    // Preload first image first - show component once it's loaded
    const firstImageSrc = 'https://zfx-gyms.zenfitx.link/onboarding/first.avif';
    const firstImg = new Image();
    firstImg.onload = () => {
      setImageLoaded(true);
      
      // Once first image is loaded, preload other images in the background
      const otherImagesToPreload = [
        'https://zfx-gyms.zenfitx.link/onboarding/second.avif',
        'https://zfx-gyms.zenfitx.link/onboarding/third.avif',
        'https://zfx-gyms.zenfitx.link/onboarding/fourth.avif',
        'https://zfx-gyms.zenfitx.link/onboarding/fifth.avif',
      ];

      otherImagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
      });

      // Switch to second image after 2 seconds
      secondImageTimeoutRef.current = setTimeout(() => {
        setCurrentImage('https://zfx-gyms.zenfitx.link/onboarding/second.avif');
        
        // After showing second image for 2 seconds, start carousel
        carouselStartTimeoutRef.current = setTimeout(() => {
          const carouselImages = [
            'https://zfx-gyms.zenfitx.link/onboarding/third.avif',
            'https://zfx-gyms.zenfitx.link/onboarding/fourth.avif',
            'https://zfx-gyms.zenfitx.link/onboarding/fifth.avif',
          ];
          
          carouselImagesRef.current = carouselImages;
          carouselIndexRef.current = 0;
          setCurrentImage(carouselImages[carouselIndexRef.current]);
          setIsCarouselActive(true);
          
          // Cycle through carousel images every 5 seconds
          const startCarouselInterval = () => {
            if (carouselIntervalRef.current) {
              clearInterval(carouselIntervalRef.current);
            }
            carouselIntervalRef.current = setInterval(() => {
              // If currently on fifth.avif (last image), navigate to login instead of looping
              if (carouselIndexRef.current === carouselImages.length - 1) {
                if (carouselIntervalRef.current) {
                  clearInterval(carouselIntervalRef.current);
                }
                handleGetStarted();
              } else {
                carouselIndexRef.current = (carouselIndexRef.current + 1) % carouselImages.length;
                setCurrentImage(carouselImages[carouselIndexRef.current]);
              }
            }, 5000);
          };
          
          startCarouselInterval();
        }, 5000);
      }, 5000);
    };
    firstImg.onerror = () => {
      setImageLoaded(true);
    };
    firstImg.src = firstImageSrc;

    // Cleanup function
    return () => {
      if (secondImageTimeoutRef.current) {
        clearTimeout(secondImageTimeoutRef.current);
      }
      if (carouselStartTimeoutRef.current) {
        clearTimeout(carouselStartTimeoutRef.current);
      }
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, []);

  const handleGetStarted = () => {
    setShowLoader(true);
    Mixpanel.track("clicked_get_started_on_onboarding_page");
    navigate('/login', { state: { signup: true } });
  };

  const handleImageClick = () => {
    // Only advance carousel if carousel is active (not first 2 images)
    if (isCarouselActive && carouselImagesRef.current.length > 0) {
      // If clicking on fifth.avif, navigate to login page
      if (currentImage.includes('fifth.avif')) {
        handleGetStarted();
        return;
      }
      
      // Clear existing interval
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
      
      // Advance to next image (if not already on last image)
      if (carouselIndexRef.current < carouselImagesRef.current.length - 1) {
        carouselIndexRef.current = carouselIndexRef.current + 1;
        setCurrentImage(carouselImagesRef.current[carouselIndexRef.current]);
        
        // Restart interval for next auto-advance
        carouselIntervalRef.current = setInterval(() => {
          // If currently on fifth.avif (last image), navigate to login instead of looping
          if (carouselIndexRef.current === carouselImagesRef.current.length - 1) {
            if (carouselIntervalRef.current) {
              clearInterval(carouselIntervalRef.current);
            }
            handleGetStarted();
          } else {
            carouselIndexRef.current = (carouselIndexRef.current + 1) % carouselImagesRef.current.length;
            setCurrentImage(carouselImagesRef.current[carouselIndexRef.current]);
          }
        }, 5000);
      }
    }
  };

  if (showLoader) return <Loader />;
  
  // Show loader until image is loaded
  if (!imageLoaded) return <Loader />;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${isCarouselActive ? 'cursor-pointer' : ''}`}
        style={{
          backgroundImage: `url('${currentImage}')`,
        }}
        onClick={handleImageClick}
      />
    </div>
  );
};

export default Onboarding;
