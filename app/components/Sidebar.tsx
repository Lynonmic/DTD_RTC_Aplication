"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { logout } from '../services/authService';
import { FaUser, FaComments, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import logoImage from '../assets/logo.png';

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

    { icon: <FaComments className="h-6 w-6" />, text: "Chat", path: "/Chat" },
    { icon: <FaSignOutAlt className="h-6 w-6" />, text: "Log out", path: "#" },
  ];

  return (
    <div
      className={`h-full transition-all duration-300 ease-in-out  text-white ${isActive ? "w-56" : "w-20"} text-black shadow-lg`}
      style={{ backgroundColor: '#E5C6FA' }}
    >
      <div className="flex flex-col h-full">
        <div className="p-2 flex flex-col items-center">
          <div className="mb-2 flex items-center justify-center overflow-hidden">
            <Image 
              src={logoImage} 
              alt="DTD Logo" 
              width={isActive ? 100 : 80} 
              height={isActive ? 100 : 80} 
              className="transition-all duration-300"
            />
          </div>
          <div className={`text-center transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
            <div className="text-sm font-bold text-black">DEADLINE TO DIE</div>
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
                  hover:bg-opacity-90 transition-all duration-200 cursor-pointer
                  ${isActive ? 'flex-row items-center px-4 text-left' : ''}
                `}
              >
                <div className={`text-black hover:text-white transition-colors duration-200 ${isActive ? 'mr-3' : 'mb-1'}`}>
                  {item.icon}
                </div>
                {isActive ? (
                  <div className="text-sm text-black">{item.text}</div>
                ) : (
                  <div className="text-xs text-black">{item.text}</div>
                )}
              </div>
            ) : (
              <Link href={item.path} key={index}>
                <div className={`
                  flex flex-col items-center px-2 py-4 
                  hover:bg-opacity-90 transition-all duration-200 cursor-pointer
                  ${isActive ? 'flex-row items-center px-4 text-left' : ''}
                `}>
                  <div className={`text-black hover:text-white transition-colors duration-200 ${isActive ? 'mr-3' : 'mb-1'}`}>
                    {item.icon}
                  </div>
                  {isActive ? (
                    <div className="text-sm text-black">{item.text}</div>
                  ) : (
                    <div className="text-xs text-black">{item.text}</div>
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