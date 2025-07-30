import React from 'react';

// Define the type for the item in the sleek list
interface SleekListItem {
  id: string; // Unique identifier for the item
  title: string; // Title of the item
  description?: string; // Optional description of the item
}

// Define the props for the SleekList component
interface SleekListProps {
  items: SleekListItem[]; // Array of items to display
  onItemClick?: (id: string) => void; // Optional callback for item click
}

// SleekList functional component
const SleekList: React.FC<SleekListProps> = ({ items, onItemClick }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Sleek List</h2>
      <ul className="space-y-4">
        {items.map(item => (
          <li
            key={item.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition"
            onClick={() => onItemClick && onItemClick(item.id)}
          >
            <h3 className="font-medium">{item.title}</h3>
            {item.description && <p className="text-gray-600">{item.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SleekList;