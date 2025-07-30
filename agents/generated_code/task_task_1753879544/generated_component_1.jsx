import React from 'react';
import { Button } from './Button'; // Assuming Button is in the same directory

// Define types for the ProfileCard props
interface ProfileCardProps {
  name: string;
  description: string;
  imageUrl: string;
  onEdit?: () => void; // Optional edit action
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, description, imageUrl, onEdit }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white">
      <img className="w-full h-48 object-cover" src={imageUrl} alt={`${name}'s profile`} />
      <div className="py-4">
        <h2 className="font-bold text-xl mb-2">{name}</h2>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      {onEdit && (
        <div className="flex justify-end">
          <Button onClick={onEdit} label="Edit Profile" />
        </div>
      )}
    </div>
  );
};

export default ProfileCard;