import React from 'react';
import ProfileCard from './ProfileCard';

const UserProfile: React.FC = () => {
  const handleEdit = () => {
    console.log('Edit profile clicked');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ProfileCard
        name="John Doe"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        imageUrl="https://via.placeholder.com/150"
        onEdit={handleEdit}
      />
    </div>
  );
};

export default UserProfile;