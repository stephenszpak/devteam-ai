import React, { useState } from 'react';
import SearchInput from './SearchInput';

const App: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const data = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape'];

  return (
    <div className="p-4">
      <SearchInput data={data} onSearch={setResults} />
      <ul className="mt-4">
        {results.map((result, index) => (
          <li key={index} className="p-2">{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;