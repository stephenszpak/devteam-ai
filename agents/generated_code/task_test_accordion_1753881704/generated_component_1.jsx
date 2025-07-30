import React, { useState } from 'react';

// Define the Props type for the Accordion
interface AccordionProps {
  title: string;
  content: React.ReactNode;
}

// Accordion Component
const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(prevState => !prevState);
  };

  return (
    <div className="border border-gray-300 rounded-md mb-2">
      <button 
        className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={toggleAccordion}
      >
        <span className="font-semibold">{title}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-300">
          {content}
        </div>
      )}
    </div>
  );
};

export default Accordion;