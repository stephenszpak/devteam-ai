// Example usage in a parent component, e.g., SleekList.tsx

import React from 'react';
import DebouncedSearchInput from './debouncedSearchInput';

const SleekList: React.FC = () => {
  const handleSearch = (query: string) => {
    // Implement your search logic here
    console.log('Searching for:', query);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Sleek List</h1>
      <DebouncedSearchInput onSearch={handleSearch} />
      {/* Render your list items here */}
    </div>
  );
};

export default SleekList;