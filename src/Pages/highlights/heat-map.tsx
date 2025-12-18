import { navigate, RouteComponentProps, useLocation } from "@reach/router";
import { useState } from "react";
import { ReactComponent as BackButtonCheckout } from '../../images/utils/back-button-checkout.svg';

interface IHeatMap extends RouteComponentProps {}

const HeatMap: React.FC<IHeatMap> = () => {
  const {heatmap_link, playerId} = useLocation().state as {heatmap_link: string, playerId: number};
  const images = heatmap_link.split(',').map(link => link.trim()).filter(link => link.length > 0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 px-4 py-4">
      {/* Back Button */}
      <div className="w-full max-w-4xl mx-auto mb-4">
        <BackButtonCheckout onClick={() => navigate(-1)} className="cursor-pointer" />
      </div>

      <div className="text-center">
        <h1 className="text-base font-bold text-black">You're Player {playerId} in this game.</h1>
      </div>
      
      {/* Carousel Container */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        {/* Image Display */}
        <div className="relative">
          <img
            src={images[currentIndex]}
            alt={`Heat Map ${currentIndex + 1}`}
            className="rounded-2xl shadow-lg w-full h-auto"
            style={{ maxHeight: '70vh', background: '#444', objectFit: 'contain' }}
          />
          
          {/* Navigation Buttons - Only show if more than 1 image */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Indicators - Only show if more than 1 image */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="text-center mt-2 text-gray-600 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatMap;