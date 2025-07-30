// src/components/ModalDialog.tsx

import React, { useEffect, FC, ReactNode } from 'react';

interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalDialog: FC<ModalDialogProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalDialog;