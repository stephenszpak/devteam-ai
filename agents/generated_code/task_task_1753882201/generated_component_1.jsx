// Accordion.tsx
import React, { useState } from 'react';

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border rounded-md">
          <button
            className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 focus:outline-none"
            onClick={() => toggleItem(index)}
          >
            {item.title}
          </button>
          {openIndex === index && (
            <div className="p-4 bg-gray-100">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;