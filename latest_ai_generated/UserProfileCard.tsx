import React from 'react';

// Define the types for the props
interface UserProfileCardProps {
    avatarUrl: string;
    name: string;
    bio: string;
    contactInfo: string;
}

// Create the UserProfileCard functional component
const UserProfileCard: React.FC<UserProfileCardProps> = ({ avatarUrl, name, bio, contactInfo }) => {
    // Basic error handling: Check if required props are provided
    if (!avatarUrl || !name || !bio || !contactInfo) {
        return <div className="text-red-600">Error: Missing required profile information.</div>;
    }

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white">
            <img
                className="w-full h-48 object-cover rounded-full"
                src={avatarUrl}
                alt={`${name}'s avatar`}
                loading="lazy"
            />
            <div className="py-4">
                <h2 className="font-bold text-xl mb-2">{name}</h2>
                <p className="text-gray-700 text-base mb-4">{bio}</p>
                <a href={`mailto:${contactInfo}`} className="text-blue-500 hover:underline">
                    {contactInfo}
                </a>
            </div>
        </div>
    );
};

export default UserProfileCard;
