import React, { useState, useEffect } from 'react';

// Type definition for the props
interface SearchInputProps {
  items: string[]; // Array of items to search through
  onSelect: (item: string) => void; // Function to call when an item is selected
}

const SearchInput: React.FC<SearchInputProps> = ({ items, onSelect }) => {
  const [query, setQuery] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debounce function to limit the filtering frequency
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    // Clear the previous timeout if it exists
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout to filter items after 300ms
    const timeout = setTimeout(() => {
      filterItems(value);
    }, 300);
    
    setDebounceTimeout(timeout);
  };

  // Filter items based on the query
  const filterItems = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = items.filter(item => item.toLowerCase().includes(lowercasedQuery));
    setFilteredItems(filtered);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      {filteredItems.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1">
          {filteredItems.map((item, index) => (
            <li 
              key={index} 
              onClick={() => onSelect(item)} 
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {/* Highlight matched text */}
              <span>
                {item.split(new RegExp(`(${query})`, 'gi')).map((part, i) =>
                  part.toLowerCase() === query.toLowerCase() ? (
                    <span key={i} className="font-bold text-blue-600">{part}</span>
                  ) : (
                    part
                  )
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;