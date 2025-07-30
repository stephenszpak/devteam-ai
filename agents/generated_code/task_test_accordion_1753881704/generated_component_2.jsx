import React from 'react';
import Accordion from './Accordion';

const ExamplePage: React.FC = () => {
  return (
    <div className="p-4">
      <Accordion 
        title="What is React?"
        content={<p>React is a JavaScript library for building user interfaces.</p>} 
      />
      <Accordion 
        title="What is Tailwind CSS?"
        content={<p>Tailwind CSS is a utility-first CSS framework for creating custom designs.</p>} 
      />
    </div>
  );
};

export default ExamplePage;