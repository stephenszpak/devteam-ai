import React, { useState, ReactNode } from 'react';
import AccordionItemContent from './AccordionItemContent';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div>
      <button
        className="flex justify-between w-full p-4 text-left border-b border-gray-300 focus:outline-none"
        onClick={toggleAccordion}
      >
        <span>{title}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && <AccordionItemContent>{children}</AccordionItemContent>}
    </div>
  );
};

export default AccordionItem;