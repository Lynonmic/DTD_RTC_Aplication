// components/UserSidebar.tsx
import React from 'react';
import SidebarProfile from './SidebarProfile'; // Removed .tsx extension
import SearchBar from '../components/SearchBar'; // Ensure the module exists
import MenuOptions from '../components/MenuOptions'; // Ensure the module exists

const UserSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-purple-200 flex flex-col">
      <SidebarProfile name="Nhi Cute" avatarSrc="/profile-placeholder.jpg" />
      <SearchBar />
      <MenuOptions />
    </div>
  );
};

export default UserSidebar;