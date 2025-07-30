import React from 'react';

// Define the types for the props
interface ProfileCardProps {
  avatarUrl: string;
  name: string;
  bio: string;
  contactInfo: {
    email: string;
    phone: string;
  };
}

// ProfileCard functional component
const ProfileCard: React.FC<ProfileCardProps> = ({ avatarUrl, name, bio, contactInfo }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white">
      <div className="flex items-center">
        <img className="w-16 h-16 rounded-full border-2 border-gray-300" src={avatarUrl} alt={`${name}'s avatar`} />
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-gray-600">{bio}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <p className="text-gray-700">Email: <a href={`mailto:${contactInfo.email}`} className="text-blue-500">{contactInfo.email}</a></p>
        <p className="text-gray-700">Phone: {contactInfo.phone}</p>
      </div>
    </div>
  );
};

export default ProfileCard;