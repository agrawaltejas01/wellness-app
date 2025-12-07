import React from 'react';

const KeepMovingBanner: React.FC = () => {
  return (
    <div 
      className="w-full py-6 sm:py-8 bg-white"
      style={{
        backgroundColor: '#FFFFFF',
        color: '#C7C7C7',
      }}
    >
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6"
      >
        <div 
          className="text-left"
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          <div 
            className="mb-2"
            style={{ color: '#C7C7C7', letterSpacing: '0.15em', fontSize: '32px' }}
          >
            KEEP MOVING
          </div>
          <div 
            className="mb-2"
            style={{ color: '#C7C7C7', letterSpacing: '0.15em', fontSize: '32px' }}
          >
            WITH
          </div>
          <div 
            style={{ color: '#C7C7C7', letterSpacing: '0.15em', fontSize: '32px' }}
          >
            ZENFITX 🎾
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeepMovingBanner;

