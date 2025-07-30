import React from 'react';

// Define the type for each item in the list
interface ListItem {
  id: number;
  title: string;
  description: string;
}

// Define the props for the SleekList component
interface SleekListProps {
  items: ListItem[];
}

// Functional component for SleekList
const SleekList: React.FC<SleekListProps> = ({ items }) => {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {items.map(item => (
          <li key={item.id} className="p-4 hover:bg-gray-100 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SleekList;