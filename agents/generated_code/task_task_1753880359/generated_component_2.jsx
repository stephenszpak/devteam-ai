import React from 'react';
import Accordion from './Accordion';

const ExampleUsage: React.FC = () => {
  const accordionItems = [
    { title: 'Item 1', content: 'Content for item 1' },
    { title: 'Item 2', content: 'Content for item 2' },
    { title: 'Item 3', content: 'Content for item 3' },
  ];

  return <Accordion items={accordionItems} />;
};

export default ExampleUsage;