import React, { useState } from 'react';
import Modal from './Modal';

const ExamplePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Example Page</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={openModal}
      >
        Open Modal
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-lg font-semibold">Modal Title</h2>
        <p className="mt-2">This is the content of the modal.</p>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          onClick={closeModal}
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ExamplePage;