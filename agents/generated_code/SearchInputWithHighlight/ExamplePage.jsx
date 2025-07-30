import React, { useState } from 'react';
import SearchInputWithHighlight from './SearchInputWithHighlight';

const ExamplePage: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const data = ['Apple', 'Banana', 'Orange', 'Grape', 'Pineapple']; // Sample data

  return (
    <div>
      <h1 className="text-2xl mb-4">Example Page</h1>
      <SearchInputWithHighlight data={data} onSearch={setResults} />
      <div className="mt-4">
        <h2 className="text-xl">Results:</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index} className="p-2 border-b last:border-b-0">
              {result}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExamplePage;