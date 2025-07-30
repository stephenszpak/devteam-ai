import React, { useState, useEffect } from 'react';

// Type definitions for props
interface DebouncedSearchInputProps {
  items: string[];
  onSearch: (filteredItems: string[]) => void;
  debounceTime?: number;
}

// DebouncedSearchInput component
const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
  items,
  onSearch,
  debounceTime = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Effect for debouncing the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceTime);

    // Cleanup function to clear the timeout if the component unmounts or searchTerm changes
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceTime]);

  // Effect to filter items when debouncedSearchTerm changes
  useEffect(() => {
    const filteredItems = items.filter(item =>
      item.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    onSearch(filteredItems);
  }, [debouncedSearchTerm, items, onSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* Highlighting filtered results can be implemented in the parent using onSearch callback */}
    </div>
  );
};

export default DebouncedSearchInput;