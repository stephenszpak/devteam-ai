import React from 'react';
import Accordion from './components/Accordion/Accordion';
import AccordionItem from './components/Accordion/AccordionItem';

const ExamplePage: React.FC = () => {
  return (
    <div className="p-4">
      <Accordion>
        <AccordionItem title="Item 1">
          <p>This is the content for item 1.</p>
        </AccordionItem>
        <AccordionItem title="Item 2">
          <p>This is the content for item 2.</p>
        </AccordionItem>
        <AccordionItem title="Item 3">
          <p>This is the content for item 3.</p>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ExamplePage;