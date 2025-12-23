import React, { useState, useEffect, ReactNode } from 'react';
import './style.css';
// Type definitions
interface BottomUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxHeight?: string | number;
  width?: string | number;
  className?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  borderRadius?: string;
  borderBottom?: boolean;
  draggable?: boolean;
}

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

// BottomUpModal Component
const BottomUpModal: React.FC<BottomUpModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = '90vh',
  width = '100%',
  className = "",
  overlayClassName = "",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  borderRadius = '16px 16px 0 0',
  borderBottom = false,
  draggable = false
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [currentHeight, setCurrentHeight] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => {
        document.body.style.overflow = 'hidden';
      }, 10);
    } else {
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      setStartY(e.touches[0].clientY);
    } else {
      setStartY(e.clientY);
    }
    if (modalRef.current) {
      setCurrentHeight(modalRef.current.getBoundingClientRect().height);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = startY - currentY;
    
    if (modalRef.current) {
      const newHeight = currentHeight + deltaY;
      const maxPossibleHeight = window.innerHeight;
      const minHeight = 200; // Minimum height the modal should maintain
      
      if (newHeight >= minHeight && newHeight <= maxPossibleHeight) {
        modalRef.current.style.height = `${newHeight}px`;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isOpen && draggable) {
      window.addEventListener('mousemove', (e: any) => handleTouchMove(e));
      window.addEventListener('mouseup', handleTouchEnd);
      window.addEventListener('touchmove', (e: any) => handleTouchMove(e));
      window.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', (e: any) => handleTouchMove(e));
      window.removeEventListener('mouseup', handleTouchEnd);
      window.removeEventListener('touchmove', (e: any) => handleTouchMove(e));
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, isDragging, draggable]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && closeOnEscape) {
      const handleDocumentKeyDown = (e: globalThis.KeyboardEvent): void => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleDocumentKeyDown);
      return () => document.removeEventListener('keydown', handleDocumentKeyDown);
    }
  }, [isOpen, closeOnEscape, onClose]);

  if (!isVisible) return null;

  const modalWidth: string = typeof width === 'number' ? `${width}px` : width;
  const modalMaxHeight: string = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center ${overlayClassName} ${isOpen ? "slide-in" : "slide-out"}`}
      style={{ 
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)'
      }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalRef}
        className={`bg-white shadow-2xl transform transition-all duration-300 ease-out overflow-hidden ${className}`}
        style={{
          width: modalWidth,
          maxHeight: modalMaxHeight,
          borderRadius: borderRadius,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Drag handle indicator */}
        {draggable && (
          <div 
            className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleTouchStart(e)}
            onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => handleTouchStart(e)}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
        )}

        {/* Header with close button */}
        <div className={`flex flex-row justify-between px-6 py-4 ${borderBottom ? "border-b border-gray-200" : ""}`}>
            <div className="flex flex-col">
          {title && (
            <div id="modal-title" className={`${subtitle?.length ? "text-m" : "text-xl"} font-bold text-gray-800`}>
              {title}
            </div>
          )}
          {subtitle && (
            <div id="modal-subtitle" className="text-xs font-normal text-gray pt-2">
              {subtitle}
            </div>
          )}
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ml-auto"
              aria-label="Close modal"
              type="button"
            >
              ×
            </button>
          )}
        </div>

        {/* Modal content with scrollable area */}
        <div 
          className="overflow-y-auto"
          style={{ maxHeight: 'calc(90vh - 120px)' }}
        >
          <div className="">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for managing modal state
const useModal = (initialState: boolean = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const openModal = (): void => setIsOpen(true);
  const closeModal = (): void => setIsOpen(false);
  const toggleModal = (): void => setIsOpen(prev => !prev);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

// Example usage component
const ExampleApp: React.FC = () => {
  const smallModal = useModal();
  const mediumModal = useModal();
  const largeModal = useModal();
  const customModal = useModal();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Background content that will be blurred */}
      <div className={`max-w-4xl mx-auto transition-all duration-300 ${
        smallModal.isOpen || mediumModal.isOpen || largeModal.isOpen || customModal.isOpen 
          ? 'blur-sm' : ''
      }`}>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Bottom-Up Modal Examples
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Modal Variations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={smallModal.openModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              type="button"
            >
              Small Modal
            </button>
            
            <button
              onClick={mediumModal.openModal}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              type="button"
            >
              Medium Modal
            </button>

            <button
              onClick={largeModal.openModal}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              type="button"
            >
              Large Modal
            </button>

            <button
              onClick={customModal.openModal}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              type="button"
            >
              Custom Modal
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Slides up from bottom with smooth animation</li>
            <li>Auto-adjusts height based on content</li>
            <li>Maximum height constraint with scrollable content</li>
            <li>Drag handle indicator for mobile-like experience</li>
            <li>Background blur effect</li>
            <li>Customizable width, height, and styling</li>
            <li>TypeScript support with full type safety</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Sample Content</h2>
          <p className="mb-4">
            This content will be blurred when any modal is open. The modals slide up from 
            the bottom and expand to fit their content height automatically.
          </p>
          <p>
            Click any of the buttons above to see different modal sizes and configurations.
            Each modal adapts its height based on the content inside.
          </p>
        </div>
      </div>

      {/* Small Modal */}
      <BottomUpModal
        isOpen={smallModal.isOpen}
        onClose={smallModal.closeModal}
        title="Small Modal"
        width="90%"
      >
        <div className="space-y-4">
          <p>This is a small modal with minimal content.</p>
          <button 
            onClick={smallModal.closeModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            type="button"
          >
            Close
          </button>
        </div>
      </BottomUpModal>

      {/* Medium Modal */}
      <BottomUpModal
        isOpen={mediumModal.isOpen}
        onClose={mediumModal.closeModal}
        title="Medium Modal"
        width="95%"
      >
        <div className="space-y-4">
          <p>This modal has more content and will expand accordingly.</p>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <h3 className="font-semibold text-green-800 mb-2">Success!</h3>
            <p className="text-green-700">Your action was completed successfully.</p>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter some text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Enter a description"
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-3">
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              type="button"
            >
              Save
            </button>
            <button 
              onClick={mediumModal.closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </BottomUpModal>

      {/* Large Modal with Scrollable Content */}
      <BottomUpModal
        isOpen={largeModal.isOpen}
        onClose={largeModal.closeModal}
        title="Large Modal with Scrollable Content"
        width="100%"
        maxHeight="80vh"
      >
        <div className="space-y-6">
          <p>This modal has lots of content and demonstrates scrolling when content exceeds the maximum height.</p>
          
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Section {i + 1}</h3>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                nostrud exercitation ullamco laboris.
              </p>
            </div>
          ))}

          <div className="flex gap-3 pt-4 border-t">
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
              type="button"
            >
              Action
            </button>
            <button 
              onClick={largeModal.closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </BottomUpModal>

      {/* Custom Styled Modal */}
      <BottomUpModal
        isOpen={customModal.isOpen}
        onClose={customModal.closeModal}
        title="Custom Styled Modal"
        width="600px"
        borderRadius="24px 24px 0 0"
        className="border-t-4 border-orange-500"
      >
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">Custom Design</h3>
            <p className="text-orange-700">
              This modal demonstrates custom styling with gradient backgrounds, 
              custom border radius, and colored accents.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-orange-200 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">42</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="bg-white border-2 border-red-200 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">15</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>

          <button 
            onClick={customModal.closeModal}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium"
            type="button"
          >
            Got it!
          </button>
        </div>
      </BottomUpModal>
    </div>
  );
};

export default ExampleApp;
export { BottomUpModal, useModal };
export type { BottomUpModalProps, UseModalReturn };