import React, { useState, useEffect } from 'react';

// Define the props for the SearchInput component
interface SearchInputProps {
  data: string[]; // Array of strings to filter
  onSearch: (filteredData: string[]) => void; // Callback to pass filtered data
}

const SearchInput: React.FC<SearchInputProps> = ({ data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedTerm, setDebouncedTerm] = useState<string>('');

  // Update the debounced term after 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter data based on the debounced search term
  useEffect(() => {
    if (debouncedTerm) {
      const filteredData = data.filter(item =>
        item.toLowerCase().includes(debouncedTerm.toLowerCase())
      );
      onSearch(filteredData);
    } else {
      onSearch(data); // Reset to original data if no search term
    }
  }, [debouncedTerm, data, onSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded-lg p-2 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <div className="absolute bg-white border rounded-lg mt-1 w-full z-10">
          {data
            .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {item}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;