"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '../services/authService';

export default function Sidebar() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      console.log('User logged out successfully');
      // Redirect to the main page after logout
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, text: "Account", path: "/account" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>, text: "Chat", path: "/pages/Chat" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>, text: "Notification", path: "/notifications" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, text: "Setting", path: "/settings" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>, text: "Log out", path: "#" },
  ];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`h-full transition-all duration-300 ease-in-out ${isActive ? "w-56" : "w-20"} bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex flex-col items-center">
          <div className="text-2xl mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className={`text-center transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
            <div className="text-sm font-bold text-white">DEADLINE TO DIE</div>
          </div>
          <div className={`text-center transition-opacity duration-300 ${!isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
            <div className="text-sm font-bold text-white">DTD</div>
          </div>
        </div>
        
        <div className="flex-1 py-4 mt-4">
          {menuItems.map((item, index) => (
            item.text === "Log out" ? (
              <div 
                key={index}
                onClick={handleLogout}
                className={`
                  flex flex-col items-center px-2 py-4 
                  hover:bg-gray-700 transition-all duration-200 cursor-pointer
                  ${isActive ? 'flex-row items-center px-4 text-left' : ''}
                `}
              >
                <div className={`text-gray-300 hover:text-white transition-colors duration-200 ${isActive ? 'mr-3' : 'mb-1'}`}>
                  {item.icon}
                </div>
                {isActive ? (
                  <div className="text-sm text-gray-300">{item.text}</div>
                ) : (
                  <div className="text-xs text-gray-400">{item.text}</div>
                )}
              </div>
            ) : (
              <Link href={item.path} key={index}>
                <div className={`
                  flex flex-col items-center px-2 py-4 
                  hover:bg-gray-700 transition-all duration-200 cursor-pointer
                  ${isActive ? 'flex-row items-center px-4 text-left' : ''}
                `}>
                  <div className={`text-gray-300 hover:text-white transition-colors duration-200 ${isActive ? 'mr-3' : 'mb-1'}`}>
                    {item.icon}
                  </div>
                  {isActive ? (
                    <div className="text-sm text-gray-300">{item.text}</div>
                  ) : (
                    <div className="text-xs text-gray-400">{item.text}</div>
                  )}
                </div>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}