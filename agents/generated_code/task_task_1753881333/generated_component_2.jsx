// src/components/LoginPage.tsx

import React, { useState } from 'react';
import ModalDialog from './ModalDialog';
import Button from './Button';

const LoginPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center">
      <Button onClick={handleOpenModal}>Open Modal</Button>
      <ModalDialog isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-lg font-bold">Welcome</h2>
        <p>This is a modal dialog example.</p>
      </ModalDialog>
    </div>
  );
};

export default LoginPage;