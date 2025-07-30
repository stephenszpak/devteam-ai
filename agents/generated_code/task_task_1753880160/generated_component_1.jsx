// SearchInput.tsx

import React, { useState, useEffect } from 'react';

interface SearchInputProps {
  data: string[]; // Array of strings to search from
  onSearch: (results: string[]) => void; // Callback to handle search results
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchInput: React.FC<SearchInputProps> = ({ data, onSearch }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300); // 300ms debounce

  useEffect(() => {
    if (debouncedQuery) {
      const results = data.filter(item =>
        item.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      onSearch(results);
    } else {
      onSearch([]);
    }
  }, [debouncedQuery, data, onSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full"
        placeholder="Search..."
      />
      {query && (
        <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {data
            .filter(item => item.toLowerCase().includes(query.toLowerCase()))
            .map((item, index) => (
              <li
                key={index}
                className={`p-2 ${item.toLowerCase().includes(query.toLowerCase()) ? 'bg-blue-100' : ''}`}
              >
                {item}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;