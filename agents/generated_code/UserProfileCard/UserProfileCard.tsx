import React from 'react';

// Define the type for the props of the UserProfileCard component
interface UserProfileCardProps {
  avatarUrl: string;
  name: string;
  bio: string;
  contactInfo: {
    email: string;
    phone: string;
  };
}

// UserProfileCard functional component
const UserProfileCard: React.FC<UserProfileCardProps> = ({ avatarUrl, name, bio, contactInfo }) => {
  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <img className="w-full h-48 object-cover" src={avatarUrl} alt={`${name}'s avatar`} />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        <p className="mt-2 text-gray-600">{bio}</p>
        <div className="mt-4">
          <h3 className="text-gray-700 font-medium">Contact Information:</h3>
          <p className="text-gray-600">Email: {contactInfo.email}</p>
          <p className="text-gray-600">Phone: {contactInfo.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;