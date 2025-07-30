import React, { useState } from 'react';

type AccordionItemProps = {
  title: string;
  content: string;
};

type AccordionProps = {
  items: AccordionItemProps[];
};

// AccordionItem component to represent each item in the accordion
const AccordionItem: React.FC<AccordionItemProps & { isOpen: boolean; toggle: () => void }> = ({
  title,
  content,
  isOpen,
  toggle,
}) => {
  return (
    <div className="border-b border-gray-300">
      <button
        onClick={toggle}
        className="flex justify-between w-full p-4 text-left bg-gray-100 hover:bg-gray-200 focus:outline-none"
      >
        <span>{title}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && <div className="p-4">{content}</div>}
    </div>
  );
};

// Accordion component to wrap AccordionItems
const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          toggle={() => toggleAccordion(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;