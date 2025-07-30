import React, { useState } from 'react';
import SearchInput from './SearchInput';

const SleekList: React.FC = () => {
  const items = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango'];

  const handleItemSelect = (item: string) => {
    console.log(`Selected item: ${item}`);
    // Handle the selected item (e.g., update state, navigate, etc.)
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Fruits List</h1>
      <SearchInput items={items} onSelect={handleItemSelect} />
    </div>
  );
};

export default SleekList;