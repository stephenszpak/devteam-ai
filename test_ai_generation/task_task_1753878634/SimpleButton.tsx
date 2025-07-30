import React from 'react';

// Define the props for the SimpleButton component
interface SimpleButtonProps {
  onClick: () => void; // Function to handle click events
}

// Create the SimpleButton functional component
const SimpleButton: React.FC<SimpleButtonProps> = ({ onClick }) => {
  // Handle button click events
  const handleClick = () => {
    try {
      onClick();
    } catch (error) {
      console.error("Error occurred during button click:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
      aria-label="Click Me" // Accessibility label
      tabIndex={0} // Ensure keyboard accessibility
    >
      Click Me
    </button>
  );
};

export default SimpleButton;
