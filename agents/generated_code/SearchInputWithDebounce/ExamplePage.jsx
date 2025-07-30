import React from 'react';
import SearchInputWithDebounce from './SearchInputWithDebounce';

const ExamplePage: React.FC = () => {
  const handleSelect = (item: string) => {
    console.log('Selected item:', item);
  };

  const data = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Search Example</h1>
      <SearchInputWithDebounce data={data} onSelect={handleSelect} />
    </div>
  );
};

export default ExamplePage;