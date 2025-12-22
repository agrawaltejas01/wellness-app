import { navigate, RouteComponentProps, useLocation } from "@reach/router";
import { useState, useRef, useEffect } from "react";
import { ReactComponent as BackButtonCheckout } from '../../images/utils/back-button-checkout.svg';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

interface IHeatMap extends RouteComponentProps {}

const HeatMap: React.FC<IHeatMap> = () => {
  const {heatmap_link, playerId} = useLocation().state as {heatmap_link: string, playerId: number};
  const images = heatmap_link.split(',').map(link => link.trim()).filter(link => link.length > 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const newIndex = Math.round(scrollLeft / containerWidth);
      setCurrentIndex(Math.min(newIndex, images.length)); // Now we have images.length + 1 slides (grid + individual)
    }
  };

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      container.scrollTo({
        left: index * containerWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Set initial scroll position
    scrollToImage(currentIndex);
  }, []);

  useEffect(() => {
    // Preload all heatmap images
    const preloadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
        // Still show content even if some images fail to load
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [images]);

  return (
    <>
      <style>
        {`
          .scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="relative min-h-screen flex flex-col bg-slate-50 px-4 py-4">
      {/* Back Button */}
      <div className="w-full max-w-4xl mx-auto mb-4">
        <BackButtonCheckout onClick={() => navigate(-1)} className="cursor-pointer" />
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold text-black mb-1">Court Coverage</h1>
        <p className="text-sm text-gray-600">You're player {playerId} in this game</p>
      </div>
      
      {/* Scroll Container */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        {!imagesLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-gray-600 mt-2">Loading heatmaps...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Image Display */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-container"
              style={{
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE and Edge
              }}
              onScroll={handleScroll}
            >
              {/* Grid View - First Slide */}
          <div className="flex-shrink-0 w-full snap-center">
            <div className="shadow-lg bg-white p-4" style={{ height: '70vh' }}>
              <div className="grid grid-cols-2 gap-4 h-full">
                {images.map((image, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex-1 min-h-0">
                      <img
                        src={image}
                        alt={`Heat Map ${index + 1}`}
                        className="rounded-lg shadow-md w-full h-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => scrollToImage(index + 1)} // Navigate to individual view
                        style={{ background: '#444' }}
                      />
                    </div>
                    <div className="text-center mt-2 text-xs text-gray-600">Player {index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

              {/* Individual Views */}
          {images.map((image, index) => (
            <div key={`individual-${index}`} className="flex-shrink-0 w-full snap-center">
              <img
                src={image}
                alt={`Heat Map ${index + 1}`}
                className="rounded-2xl shadow-lg w-full h-auto"
                style={{ maxHeight: '70vh', background: '#444', objectFit: 'contain' }}
              />
            </div>
          ))}
            </div>

            {/* Indicators - Always show for grid + individual views */}
            <div className="flex justify-center gap-2 mt-4">
              {/* Grid view indicator */}
              <button
                onClick={() => scrollToImage(0)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === 0
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label="Go to overview"
              />
              {/* Individual view indicators */}
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToImage(index + 1)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index + 1 === currentIndex
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="text-center mt-2 text-gray-600 text-sm">
              {currentIndex === 0 ? 'Overview' : `${currentIndex} / ${images.length}`}
            </div>

            {/* Heatmap Legend */}
            <div className="text-center mt-2 text-gray-700 text-xs max-w-2xl mx-auto px-4">
              <div><strong>Fire (Red/Yellow):</strong> Most time spent • <strong>Black:</strong> Gaps, rarely stepped • <strong>Doubles:</strong> Look for gaps between partners</div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default HeatMap;