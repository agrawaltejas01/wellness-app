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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselIndexRef = useRef(0);
  const secondImageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const carouselStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const carouselImagesRef = useRef<string[]>([]);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

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
          setCarouselIndex(0);
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
                setCarouselIndex(carouselIndexRef.current);
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

  const advanceCarousel = (direction: 'next' | 'prev') => {
    if (!isCarouselActive || carouselImagesRef.current.length === 0) return;

    // Clear existing interval
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }

    if (direction === 'next') {
      // If clicking on fifth.avif, navigate to login page
      if (currentImage.includes('fifth.avif')) {
        handleGetStarted();
        return;
      }
      
      // Advance to next image (if not already on last image)
      if (carouselIndexRef.current < carouselImagesRef.current.length - 1) {
        carouselIndexRef.current = carouselIndexRef.current + 1;
        setCarouselIndex(carouselIndexRef.current);
        setCurrentImage(carouselImagesRef.current[carouselIndexRef.current]);
      }
    } else {
      // Go to previous image (if not already on first carousel image)
      if (carouselIndexRef.current > 0) {
        carouselIndexRef.current = carouselIndexRef.current - 1;
        setCarouselIndex(carouselIndexRef.current);
        setCurrentImage(carouselImagesRef.current[carouselIndexRef.current]);
      }
    }
    
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
        setCarouselIndex(carouselIndexRef.current);
        setCurrentImage(carouselImagesRef.current[carouselIndexRef.current]);
      }
    }, 5000);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    // Only advance carousel if carousel is active (not first 2 images)
    if (isCarouselActive && carouselImagesRef.current.length > 0) {
      advanceCarousel('next');
    }
  };

  const handleNextClick = () => {
    advanceCarousel('next');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isCarouselActive) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default to avoid scrolling
    if (isCarouselActive) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isCarouselActive || touchStartXRef.current === null || touchStartYRef.current === null) return;
    
    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;
    
    // Only process swipe if horizontal movement is greater than vertical (to avoid conflicts with scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous image
        advanceCarousel('prev');
      } else {
        // Swipe left - go to next image
        advanceCarousel('next');
      }
    }
    
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCarouselActive) return;
    touchStartXRef.current = e.clientX;
    touchStartYRef.current = e.clientY;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isCarouselActive || touchStartXRef.current === null || touchStartYRef.current === null) return;
    
    const deltaX = e.clientX - touchStartXRef.current;
    const deltaY = e.clientY - touchStartYRef.current;
    
    // Only process drag if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Drag right - go to previous image
        advanceCarousel('prev');
      } else {
        // Drag left - go to next image
        advanceCarousel('next');
      }
    }
    
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (showLoader) return <Loader />;
  
  // Show loader until image is loaded
  if (!imageLoaded) return <Loader />;

  const isLastCarouselImage = isCarouselActive && carouselIndex === carouselImagesRef.current.length - 1;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${isCarouselActive ? 'cursor-pointer select-none' : ''}`}
        style={{
          backgroundImage: `url('${currentImage}')`,
          touchAction: isCarouselActive ? 'pan-y' : 'auto',
        }}
        onClick={handleImageClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      
      {/* Carousel Buttons - Only show when carousel is active */}
      {isCarouselActive && (
        <div className="absolute bottom-0 left-0 right-0 pb-8 px-6 flex justify-center z-20">
          {isLastCarouselImage ? (
            <button
              onClick={handleGetStarted}
              className="group text-white font-bold relative w-full md:w-auto md:px-16 lg:px-20 py-4 md:py-6 text-lg md:text-xl font-bold text-black rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out border border-gray-300/30 hover:border-gray-400/50"
              style={{ background: 'black' }}
            >
              {/* Button Background Effects */}
              <div className="absolute inset-0 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" style={{ background: 'linear-gradient(to right, rgba(199, 255, 202, 0.3), rgba(238, 255, 183, 0.3))' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Button Text */}
              <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                Get Started
                {/* <svg 
                  className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                > 
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg> */}
              </span>
            </button>
          ) : (
            <button
              onClick={handleNextClick}
              className="group relative text-black font-bold w-full md:w-auto md:px-16 lg:px-20 py-4 md:py-6 text-lg md:text-xl font-bold text-black rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out border border-gray-300/30 hover:border-gray-400/50"
              style={{ background: '#e4e4e4' }}
            >
              {/* Button Background Effects */}
              <div className="absolute inset-0 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" style={{ background: 'linear-gradient(to right, rgba(199, 255, 202, 0.3), rgba(238, 255, 183, 0.3))' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Button Text */}
              <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                Next
                {/* <svg 
                  className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg> */}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Onboarding;
