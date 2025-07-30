// SearchInputWithDebounce.tsx

import React, { useState, useEffect } from 'react';

interface SearchInputWithDebounceProps {
  data: string[]; // Array of strings to filter through
  onSelect: (item: string) => void; // Callback when an item is selected
}

const SearchInputWithDebounce: React.FC<SearchInputWithDebounceProps> = ({ data, onSelect }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [debouncedValue, setDebouncedValue] = useState<string>(inputValue);

  // Debounce input value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  // Filter data based on debounced value
  useEffect(() => {
    if (debouncedValue) {
      const results = data.filter(item =>
        item.toLowerCase().includes(debouncedValue.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  }, [debouncedValue, data]);

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search..."
        className="border rounded p-2 w-full"
      />
      {filteredData.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded mt-1 w-full">
          {filteredData.map((item) => (
            <li
              key={item}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              {item.replace(new RegExp(`(${debouncedValue})`, 'gi'), (match) => `<mark>${match}</mark>`)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInputWithDebounce;