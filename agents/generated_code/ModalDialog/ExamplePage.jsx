import React, { useState } from 'react';
import ModalDialog from './ModalDialog';

const ExamplePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <button
        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        onClick={openModal}
      >
        Open Modal
      </button>

      <ModalDialog isOpen={isModalOpen} onClose={closeModal} title="My Modal">
        <p>This is a responsive modal dialog using Tailwind CSS and React!</p>
      </ModalDialog>
    </div>
  );
};

export default ExamplePage;