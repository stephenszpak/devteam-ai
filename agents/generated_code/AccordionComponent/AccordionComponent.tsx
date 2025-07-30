// AccordionComponent.tsx

import React, { useState } from 'react';

// Define TypeScript types for the AccordionItem
interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const AccordionComponent: React.FC<AccordionProps> = ({ items }) => {
  // State to track the currently opened item
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle the accordion item
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {items.map((item, index) => (
        <div key={index} className="border-b">
          <button
            onClick={() => toggleItem(index)}
            className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
          >
            <span className="font-semibold">{item.title}</span>
            <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          <div
            className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
              openIndex === index ? 'max-h-40' : 'max-h-0'
            }`}
          >
            <p className="p-4">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccordionComponent;