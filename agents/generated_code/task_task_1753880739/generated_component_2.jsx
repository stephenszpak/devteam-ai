import React, { useState } from 'react';
import SearchInput from './SearchInput';

const UserProfile: React.FC = () => {
  const [users, setUsers] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'David']);
  const [filteredUsers, setFilteredUsers] = useState<string[]>(users);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User Profile</h1>
      <SearchInput data={users} onSearch={setFilteredUsers} />
      <ul className="mt-4">
        {filteredUsers.map((user, index) => (
          <li key={index} className="p-2 border-b">
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;