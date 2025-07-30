import React from 'react';
import SleekList from './SleekList';

const App: React.FC = () => {
  const items = [
    { id: 1, title: 'Item One', description: 'Description for item one.' },
    { id: 2, title: 'Item Two', description: 'Description for item two.' },
    { id: 3, title: 'Item Three', description: 'Description for item three.' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Item List</h1>
      <SleekList items={items} />
    </div>
  );
};

export default App;