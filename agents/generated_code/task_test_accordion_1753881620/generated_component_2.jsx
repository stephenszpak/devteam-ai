import React, { useState, ReactNode } from 'react';
import AccordionItem from './AccordionItem';

interface AccordionProps {
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return (
    <div className="border border-gray-300 rounded-md">
      {children}
    </div>
  );
};

export default Accordion;