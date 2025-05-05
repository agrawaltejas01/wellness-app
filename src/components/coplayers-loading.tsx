import React from 'react';

const PlayersLoadingComponent = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden mx-8">
      {/* Header - Players count */}
      <div className="flex items-center mb-2">
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
      <div className="h-4 w-56 bg-gray-200 animate-pulse rounded-md mb-6"></div>
      
      {/* First player */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-5 w-5 bg-blue-200 animate-pulse rounded-full"></div>
          </div>
        </div>
        <div className="border-t border-gray-200 border-dashed pt-3"></div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-100 animate-pulse rounded-full"></div>
            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
          <div className="h-4 w-36 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
      
      {/* Second player */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="h-5 w-28 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="flex gap-1">
              <div className="h-5 w-5 bg-blue-200 animate-pulse rounded-full"></div>
              <div className="h-5 w-5 bg-blue-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 border-dashed pt-3"></div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-yellow-100 animate-pulse rounded-full"></div>
            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
          <div className="h-4 w-36 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
      
      {/* Third player */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="h-5 w-36 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="flex gap-1">
              <div className="h-5 w-5 bg-blue-200 animate-pulse rounded-full"></div>
              <div className="h-5 w-5 bg-blue-200 animate-pulse rounded-full"></div>
              <div className="h-5 w-5 bg-blue-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 border-dashed pt-3"></div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 animate-pulse rounded-full"></div>
            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
          <div className="h-4 w-36 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
      
      {/* Shimmer effect using pure Tailwind with animated background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
    </div>
  );
};

// Add the shimmer animation to your Tailwind config or use a custom CSS file
// This would go in your tailwind.config.js:
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         shimmer: 'shimmer 2s infinite linear',
//       },
//       keyframes: {
//         shimmer: {
//           '0%': { transform: 'translateX(-100%)' },
//           '100%': { transform: 'translateX(100%)' },
//         },
//       },
//     },
//   },
// };

export default PlayersLoadingComponent;