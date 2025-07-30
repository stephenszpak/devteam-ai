// ExamplePage.tsx

import React from 'react';
import AccordionComponent from './AccordionComponent';

const ExamplePage: React.FC = () => {
  const accordionItems = [
    { title: 'Item 1', content: 'Content for item 1' },
    { title: 'Item 2', content: 'Content for item 2' },
    { title: 'Item 3', content: 'Content for item 3' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Example Accordion</h1>
      <AccordionComponent items={accordionItems} />
    </div>
  );
};

export default ExamplePage;