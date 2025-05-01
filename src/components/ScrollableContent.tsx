import React, { useEffect, useRef } from 'react';

interface ScrollableContentProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
  bottomPadding?: number; // Extra padding to account for fixed elements at bottom
}

const ScrollableContent: React.FC<ScrollableContentProps> = ({
  children,
  className = '',
  maxHeight = '100vh', // Changed from 50vh to 100vh
  bottomPadding = 80, // Default padding for "Book Now" button
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Add extra bottom padding to make sure content is still visible
  // even when scrolled to the bottom with a fixed element present
  useEffect(() => {
    const updatePadding = () => {
      if (contentRef.current) {
        contentRef.current.style.paddingBottom = `${bottomPadding}px`;
        contentRef.current.style.marginTop = '250px';
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    
    return () => {
      window.removeEventListener('resize', updatePadding);
    };
  }, [bottomPadding]);

  return (
    <div
      ref={contentRef}
      className={`scrollable-content ${className}`}
      style={{
        overflowY: 'auto', 
        maxHeight,
        position: 'relative',
        scrollbarWidth: 'thin', // For Firefox
        msOverflowStyle: 'none', // For IE
      }}
    >
      {children}
    </div>
  );
};

// Usage example with "What-to-bring" section
export const EventDetails: React.FC = () => {
  return (
    <div className="event-details-page">
      <h1>Event Title</h1>
      
      {/* Other content */}
      
      <ScrollableContent bottomPadding={100}>
        <section className="event-description">
          <p>Event description goes here...</p>
        </section>
        
        <section id="what-to-bring" className="what-to-bring">
          <h2>What to Bring</h2>
          <ul>
            <li>Comfortable shoes</li>
            <li>Water bottle</li>
            <li>Sunscreen</li>
            <li>Personal ID</li>
            <li>Ticket confirmation</li>
          </ul>
        </section>
        
        {/* Add more sections here */}
      </ScrollableContent>
      
      {/* Fixed "Book Now" button that might block content */}
      <div className="book-now-container" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 10,
      }}>
        <button className="book-now-button">Book Now</button>
      </div>
    </div>
  );
};

export default ScrollableContent; 