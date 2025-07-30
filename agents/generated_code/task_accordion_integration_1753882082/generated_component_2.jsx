import React from 'react';
import Accordion from './Accordion'; // Adjust the import path as necessary

const ExamplePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Example Page</h1>
      <Accordion 
        title="Section 1" 
        content={<p>This is the content for section 1.</p>} 
      />
      <Accordion 
        title="Section 2" 
        content={<p>This is the content for section 2.</p>} 
      />
    </div>
  );
};

export default ExamplePage;