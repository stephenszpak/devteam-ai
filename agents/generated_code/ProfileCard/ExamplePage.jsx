import React from 'react';
import ProfileCard from './profileCard';

const ExamplePage: React.FC = () => {
  const userProfile = {
    avatarUrl: 'https://via.placeholder.com/150', // Replace with actual avatar URL
    name: 'John Doe',
    bio: 'Front-end Developer with a passion for creating beautiful and functional web applications.',
    contactInfo: {
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
    },
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ProfileCard
        avatarUrl={userProfile.avatarUrl}
        name={userProfile.name}
        bio={userProfile.bio}
        contactInfo={userProfile.contactInfo}
      />
    </div>
  );
};

export default ExamplePage;