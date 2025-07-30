import UserProfileCard from './UserProfileCard';

// Sample data
const user = {
  avatarUrl: 'https://example.com/avatar.jpg',
  name: 'John Doe',
  bio: 'Software Engineer with a passion for open source.',
  contactInfo: {
    email: 'john.doe@example.com',
    phone: '123-456-7890',
  },
};

// In your component's render method
<UserProfileCard 
  avatarUrl={user.avatarUrl}
  name={user.name}
  bio={user.bio}
  contactInfo={user.contactInfo}
/>