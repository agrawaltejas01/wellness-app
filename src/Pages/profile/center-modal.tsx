import React, { useState, useEffect, ReactNode } from 'react';

// Type definitions
interface CenterModalProps {
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
}

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

// CenterModal Component
const CenterModal: React.FC<CenterModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = '90vh',
  width = '500px',
  className = "",
  overlayClassName = "",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  borderRadius = '16px',
  borderBottom = true
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

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
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
      style={{ 
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 300ms ease-out'
      }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`bg-white shadow-2xl transform transition-all duration-300 ease-out overflow-hidden ${className}`}
        style={{
          width: modalWidth,
          maxWidth: '90vw',
          maxHeight: modalMaxHeight,
          borderRadius: borderRadius,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
          opacity: isOpen ? 1 : 0,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className={`flex flex-row justify-between items-start px-6 py-4 ${borderBottom ? "border-b border-gray-200" : ""}`}>
          <div className="flex flex-col flex-1 pr-4">
            {title && (
              <div id="modal-title" className={`${subtitle?.length ? "text-lg" : "text-xl"} font-bold text-gray-800`}>
                {title}
              </div>
            )}
            {subtitle && (
              <div id="modal-subtitle" className="text-sm font-normal text-gray-600 mt-1">
                {subtitle}
              </div>
            )}
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
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
          <div className="px-6 pb-6">
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
  const infoModal = useModal();
  const confirmModal = useModal();
  const formModal = useModal();
  const largeModal = useModal();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Background content that will be blurred */}
      <div className={`max-w-4xl mx-auto transition-all duration-300 ${
        infoModal.isOpen || confirmModal.isOpen || formModal.isOpen || largeModal.isOpen 
          ? 'blur-sm' : ''
      }`}>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Center Modal Examples
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Modal Variations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={infoModal.openModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              type="button"
            >
              Info Modal
            </button>
            
            <button
              onClick={confirmModal.openModal}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              type="button"
            >
              Confirm Modal
            </button>

            <button
              onClick={formModal.openModal}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              type="button"
            >
              Form Modal
            </button>

            <button
              onClick={largeModal.openModal}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors text-center"
              type="button"
            >
              Large Modal
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Appears in center with smooth scale animation</li>
            <li>Auto-adjusts height based on content</li>
            <li>Maximum height constraint with scrollable content</li>
            <li>Background blur effect</li>
            <li>Customizable width, height, and styling</li>
            <li>TypeScript support with full type safety</li>
            <li>Keyboard and overlay click handling</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Sample Content</h2>
          <p className="mb-4">
            This content will be blurred when any modal is open. The modals appear in the center 
            of the screen with a subtle scale animation.
          </p>
          <p>
            Click any of the buttons above to see different modal types and configurations.
            Each modal is responsive and adapts to different screen sizes.
          </p>
        </div>
      </div>

      {/* Info Modal */}
      <CenterModal
        isOpen={infoModal.isOpen}
        onClose={infoModal.closeModal}
        title="Information"
        subtitle="Here's some important information for you"
        width="400px"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  This is an informational message to help you understand something important.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={infoModal.closeModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              type="button"
            >
              Got it
            </button>
          </div>
        </div>
      </CenterModal>

      {/* Confirmation Modal */}
      <CenterModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.closeModal}
        title="Confirm Action"
        subtitle="Are you sure you want to proceed?"
        width="450px"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            This action cannot be undone. Please make sure you want to continue before proceeding.
          </p>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> This action is permanent and cannot be reversed.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button 
              onClick={confirmModal.closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button 
              onClick={confirmModal.closeModal}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              type="button"
            >
              Confirm
            </button>
          </div>
        </div>
      </CenterModal>

      {/* Form Modal */}
      <CenterModal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        title="Contact Form"
        subtitle="Fill out the form below to get in touch"
        width="500px"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your message"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button 
              onClick={formModal.closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              type="button"
            >
              Send Message
            </button>
          </div>
        </div>
      </CenterModal>

      {/* Large Modal with Scrollable Content */}
      <CenterModal
        isOpen={largeModal.isOpen}
        onClose={largeModal.closeModal}
        title="Large Content Modal"
        subtitle="This modal demonstrates scrollable content"
        width="600px"
        maxHeight="80vh"
      >
        <div className="space-y-6">
          <p>This modal has lots of content and demonstrates scrolling when content exceeds the maximum height.</p>
          
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Section {i + 1}</h3>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          ))}

          <div className="flex gap-3 pt-4 border-t">
            <button 
              onClick={largeModal.closeModal}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </CenterModal>
    </div>
  );
};

export default ExampleApp;
export { CenterModal, useModal };
export type { CenterModalProps, UseModalReturn };