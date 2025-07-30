import React from 'react';
import Accordion from './accordion';

const App: React.FC = () => {
  const accordionItems = [
    { title: 'Section 1', content: 'Content for section 1.' },
    { title: 'Section 2', content: 'Content for section 2.' },
    { title: 'Section 3', content: 'Content for section 3.' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Accordion</h1>
      <Accordion items={accordionItems} />
    </div>
  );
};

export default App;