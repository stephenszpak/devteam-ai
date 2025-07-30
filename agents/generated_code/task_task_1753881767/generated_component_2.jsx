import React from 'react';
import SleekList from './SleekList';

const App: React.FC = () => {
  const items = [
    { id: '1', title: 'Item 1', description: 'Description for Item 1' },
    { id: '2', title: 'Item 2', description: 'Description for Item 2' },
    { id: '3', title: 'Item 3' }, // Item without description
  ];

  const handleItemClick = (id: string) => {
    console.log(`Item clicked: ${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <SleekList items={items} onItemClick={handleItemClick} />
    </div>
  );
};

export default App;