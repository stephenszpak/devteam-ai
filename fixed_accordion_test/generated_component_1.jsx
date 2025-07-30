// components/modalDialog.tsx

import React, { useEffect } from 'react';

interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalDialog: React.FC<ModalDialogProps> = ({ isOpen, onClose, title, children }) => {
  // Close modal on 'Escape' key press
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    // Add event listener for keydown
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    // Cleanup the event listener on unmount or when modal closes
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} aria-hidden="true"></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg z-10 max-w-sm w-full mx-4">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalDialog;