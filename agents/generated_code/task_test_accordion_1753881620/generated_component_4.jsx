import React, { ReactNode } from 'react';

interface AccordionItemContentProps {
  children: ReactNode;
}

const AccordionItemContent: React.FC<AccordionItemContentProps> = ({ children }) => {
  return (
    <div className="p-4 bg-gray-100">
      {children}
    </div>
  );
};

export default AccordionItemContent;