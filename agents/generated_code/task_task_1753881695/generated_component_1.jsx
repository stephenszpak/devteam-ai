// debouncedSearchInput.tsx

import React, { useState, useEffect } from 'react';

// Define props type for the component
type DebouncedSearchInputProps = {
  onSearch: (query: string) => void; // Function to call with the search query
  delay?: number; // Optional delay for debounce
};

const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({ onSearch, delay = 300 }) => {
  const [query, setQuery] = useState<string>(''); // State for the input value
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query); // State for debounced value

  // Effect for debouncing the input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    // Cleanup function to clear the timeout if the component unmounts or query changes
    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  // Effect to call the onSearch function when the debouncedQuery changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update query state on input change
        placeholder="Search..."
        className="border border-gray-300 rounded-lg p-2 w-full" // Tailwind CSS styles
      />
      {/* Highlighted results can be rendered here */}
      {/* Additional logic to display highlighted results can be added */}
    </div>
  );
};

export default DebouncedSearchInput;