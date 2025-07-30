import React, { useState } from 'react';
import Modal from './Modal';
import SimpleButton from './SimpleButton';

const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="p-4">
      <SimpleButton onClick={openModal}>Open Modal</SimpleButton>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="My Modal">
        <p>This is the content of the modal.</p>
      </Modal>
    </div>
  );
};

export default App;