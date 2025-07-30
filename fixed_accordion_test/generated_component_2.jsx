// Example of using ModalDialog in a component

import React, { useState } from 'react';
import ModalDialog from './modalDialog';

const ExampleComponent: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)} className="btn">
        Open Modal
      </button>
      <ModalDialog isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="My Modal">
        <p>This is the content of the modal!</p>
      </ModalDialog>
    </div>
  );
};

export default ExampleComponent;