// components/UserSidebar.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarProfile from './SidebarProfile';
import SearchBar from './SearchBar';
import MenuOptions from './MenuOptions';
import userDefaultImage from '../assets/user.png';

const UserSidebar: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>('menu');
  const [userData, setUserData] = useState({
    name: '',
    avatarSrc: 'https://res.cloudinary.com/dhatjk5lm/image/upload/v1744169461/profile-placeholder.jpg',
    uid: ''
  });

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
          const parsedUserInfo = JSON.parse(userInfo);
          setUserData({
            name: parsedUserInfo.displayName || 'User',
            avatarSrc: parsedUserInfo.photoURL || userDefaultImage.src,
            uid: parsedUserInfo.uid
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    getUserData();
  }, []);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality
    if (query.trim()) {
      setActiveSection('search');
    } else {
      setActiveSection('menu');
    }
  };

  // Custom menu items for this sidebar
  const customMenuItems = [
    { 
      id: 'profile', 
      label: 'Edit Profile', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: () => router.push('/Profile')
    },
    { 
      id: 'theme', 
      label: 'Change Theme', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      onClick: () => console.log('Change theme clicked')
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      onClick: () => console.log('Notifications clicked')
    },
    { 
      id: 'privacy', 
      label: 'Privacy Settings', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      onClick: () => console.log('Privacy settings clicked')
    }
  ];

  return (
    <div className={"h-full flex flex-col bg-gray-50 border-l border-gray-200 shadow-sm"}
>
      {/* Profile section */}
      <SidebarProfile name={userData.name} avatarSrc={userData.avatarSrc} />
      
      {/* Search bar */}
      <div className="px-2 pt-2">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {/* Menu options */}
      <div className="flex-1 overflow-y-auto">
        <MenuOptions customItems={customMenuItems} />
      </div>
      
     
    </div>
  );
};

export default UserSidebar;