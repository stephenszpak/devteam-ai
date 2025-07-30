import React, { useState, useEffect } from 'react';

interface SearchInputProps {
  items: string[]; // List of items to filter
}

const SearchInput: React.FC<SearchInputProps> = ({ items }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue) {
        const filtered = items.filter(item =>
          item.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredItems(filtered);
      } else {
        setFilteredItems([]);
      }
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, items]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Highlight matched text
  const highlightText = (text: string) => {
    if (!inputValue) return text;
    const parts = text.split(new RegExp(`(${inputValue})`, 'gi'));
    return parts.map((part, index) => (
      <span key={index} className={part.toLowerCase() === inputValue.toLowerCase() ? 'font-bold text-blue-600' : ''}>
        {part}
      </span>
    ));
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        aria-label="Search"
        className="border rounded-md p-2 w-full"
        placeholder="Search..."
      />
      {error && <div className="text-red-500">{error}</div>}
      {filteredItems.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 z-10">
          {filteredItems.map((item, index) => (
            <li key={index} className="p-2 hover:bg-gray-200">
              {highlightText(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
