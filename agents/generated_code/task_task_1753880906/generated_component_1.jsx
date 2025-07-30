import React, { useState } from 'react';

// AccordionItem type definition
interface AccordionItem {
  title: string;
  content: string;
}

// AccordionProps type definition
interface AccordionProps {
  items: AccordionItem[];
}

// Accordion functional component
const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="border rounded-md">
      {items.map((item, index) => (
        <div key={index}>
          <button
            className="flex justify-between items-center w-full p-4 text-left border-b focus:outline-none hover:bg-gray-200"
            onClick={() => toggleAccordion(index)}
          >
            <span className="font-semibold">{item.title}</span>
            <span>{openIndex === index ? '-' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className="p-4 bg-gray-100">
              <p>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;