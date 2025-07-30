import React from 'react';

// Define the props type for the UserProfileCard component
interface UserProfileCardProps {
  avatarUrl: string;
  name: string;
  bio: string;
  contactInfo: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ avatarUrl, name, bio, contactInfo }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-4">
      <div className="flex items-center">
        <img className="w-16 h-16 rounded-full border-2 border-gray-300" src={avatarUrl} alt={`${name}'s avatar`} />
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-gray-600">{bio}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <p className="text-gray-700">{contactInfo}</p>
      </div>
    </div>
  );
};

export default UserProfileCard;