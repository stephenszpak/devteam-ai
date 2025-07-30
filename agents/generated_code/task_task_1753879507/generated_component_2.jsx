import React, { useState, useEffect } from 'react';

// Type definition for the props
interface SearchInputProps {
  data: string[]; // The array of items to filter
  onSearch: (results: string[]) => void; // Callback to return search results
}

const SearchInput: React.FC<SearchInputProps> = ({ data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300); // Adjust the debounce delay as necessary

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter results based on the debounced search term
  useEffect(() => {
    if (debouncedTerm) {
      const filteredResults = data.filter(item =>
        item.toLowerCase().includes(debouncedTerm.toLowerCase())
      );
      onSearch(filteredResults);
    } else {
      onSearch([]); // Return an empty array if no search term
    }
  }, [debouncedTerm, data, onSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1">
        {debouncedTerm && (
          <ul className="max-h-60 overflow-auto">
            {data
              .filter(item => item.toLowerCase().includes(debouncedTerm.toLowerCase()))
              .map((item, index) => (
                <li key={index} className="p-2 hover:bg-blue-100">
                  {item.replace(
                    new RegExp(`(${debouncedTerm})`, 'gi'),
                    match => `<strong>${match}</strong>`
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchInput;