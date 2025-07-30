import React, { useState } from 'react';

// Define the props for the Accordion component
interface AccordionProps {
  title: string;
  content: React.ReactNode;
}

// Accordion component
const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  // State to track whether the accordion is open or closed
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Toggle the open state
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full p-4 text-left text-gray-700 hover:bg-gray-100 focus:outline-none"
        onClick={toggleAccordion}
      >
        <span className="font-semibold">{title}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="p-4">
          {content}
        </div>
      )}
    </div>
  );
};

export default Accordion;