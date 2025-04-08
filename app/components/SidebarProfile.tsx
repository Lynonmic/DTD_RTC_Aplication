// components/SidebarProfile.tsx
import React, { useState } from 'react';
import Image from 'next/image';

interface SidebarProfileProps {
  name: string;
  avatarSrc: string;
}

const SidebarProfile: React.FC<SidebarProfileProps> = ({ name, avatarSrc }) => {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleButtonClick = (action: string) => {
    console.log(`${action} button clicked`);
    // Implement the functionality for each button
    switch (action) {
      case 'copy':
        // Copy profile info
        navigator.clipboard.writeText(name)
          .then(() => console.log('Profile name copied to clipboard'))
          .catch(err => console.error('Failed to copy: ', err));
        break;
      case 'voice':
        // Toggle voice call
        console.log('Voice call toggled');
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4 flex flex-col items-center bg-white border-b border-gray-200">
      <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 shadow-md">
        {avatarSrc ? (
          <Image 
            src={avatarSrc}
            alt="Profile"
            width={80}
            height={80}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-2xl text-black">
            {name ? name.charAt(0) : 'U'}
          </div>
        )}
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      
      <h3 className="font-semibold text-lg text-black mb-1">{name}</h3>
      <p className="text-sm text-gray-500 mb-4">Online</p>
      
      <div className="flex space-x-4">
        <button 
          className={`
            bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center 
            transition-all duration-200 text-black
            ${isHovered === 'copy' ? 'bg-gray-200 scale-105' : ''}
          `}
          onClick={() => handleButtonClick('copy')}
          onMouseEnter={() => setIsHovered('copy')}
          onMouseLeave={() => setIsHovered(null)}
          aria-label="Copy profile info"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
        </button>
        
        <button 
          className={`
            bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center 
            transition-all duration-200 text-black
            ${isHovered === 'voice' ? 'bg-gray-200 scale-105' : ''}
          `}
          onClick={() => handleButtonClick('voice')}
          onMouseEnter={() => setIsHovered('voice')}
          onMouseLeave={() => setIsHovered(null)}
          aria-label="Voice call"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SidebarProfile;