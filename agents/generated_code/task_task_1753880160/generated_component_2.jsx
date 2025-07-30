// App.tsx

import React, { useState } from 'react';
import SearchInput from './SearchInput';

const App: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const data = ["Apple", "Banana", "Orange", "Grape", "Pineapple", "Mango"]; // Example data

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Search Example</h1>
      <SearchInput data={data} onSearch={setResults} />
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Search Results:</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index} className="p-1 border-b border-gray-200">{result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;