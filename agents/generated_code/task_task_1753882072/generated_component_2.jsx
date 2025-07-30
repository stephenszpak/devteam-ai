import React, { useState } from 'react';
import DebouncedSearchInput from './DebouncedSearchInput';

const SleekList: React.FC = () => {
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape'];
  const [filteredItems, setFilteredItems] = useState(items);

  return (
    <div className="p-4">
      <DebouncedSearchInput
        items={items}
        onSearch={setFilteredItems}
      />
      <ul className="mt-2">
        {filteredItems.map((item, index) => (
          <li key={index} className="py-1">{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default SleekList;