// components/SearchInput.tsx

import React, { useState, useEffect } from 'react';

// Define types for the props
interface SearchInputProps {
  placeholder?: string;
  data: string[];
  onSearch: (result: string[]) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder = "Search...", data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedTerm, setDebouncedTerm] = useState<string>(searchTerm);

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter the data based on the debounced search term
  useEffect(() => {
    const filteredResults = data.filter(item => 
      item.toLowerCase().includes(debouncedTerm.toLowerCase())
    );
    onSearch(filteredResults);
  }, [debouncedTerm, data, onSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
      />
      {/* Optionally, you could add a dropdown for results */}
      {/* This section can be customized further */}
      <div className="absolute bg-white border border-gray-300 rounded-lg mt-1 w-full z-10">
        {debouncedTerm && data.filter(item => item.toLowerCase().includes(debouncedTerm.toLowerCase())).map((item, index) => (
          <div key={index} className="p-2 hover:bg-blue-100">
            {item.replace(new RegExp(`(${debouncedTerm})`, 'gi'), (match) => `<strong>${match}</strong>`)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchInput;