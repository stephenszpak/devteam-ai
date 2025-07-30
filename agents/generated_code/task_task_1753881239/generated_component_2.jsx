// Example usage in App.tsx or any other component

import React, { useState } from 'react';
import SearchInput from './components/SearchInput';

const App: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const sampleData = ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Search Example</h1>
      <SearchInput data={sampleData} onSearch={setResults} />
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Results:</h2>
        <ul>
          {results.map((item, index) => (
            <li key={index} className="p-2 border-b">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;