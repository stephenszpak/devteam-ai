import React, { useState, useEffect } from 'react';

interface SearchInputWithHighlightProps {
  data: string[]; // Array of strings to search through
  onSearch: (filteredResults: string[]) => void; // Callback to pass filtered results
}

const SearchInputWithHighlight: React.FC<SearchInputWithHighlightProps> = ({ data, onSearch }) => {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // Adjust debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const filteredResults = data.filter(item =>
      item.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    onSearch(filteredResults);
  }, [debouncedQuery, data, onSearch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const highlightMatch = (text: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className="p-2 border rounded mb-2"
      />
      <div className="bg-white border rounded shadow-md">
        {data.filter(item => item.toLowerCase().includes(debouncedQuery.toLowerCase())).map((item, index) => (
          <div key={index} className="p-2 border-b last:border-b-0">
            {highlightMatch(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchInputWithHighlight;