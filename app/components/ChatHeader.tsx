// components/ChatHeader.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { FaVideo, FaPhone, FaEllipsisV } from 'react-icons/fa';

interface ChatHeaderProps {
  username: string;
  avatarSrc: string;
  onInfoClick?: () => void;
  onVideoCallClick?: () => void;
  onAudioCallClick?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  username, 
  avatarSrc, 
  onInfoClick,
  onVideoCallClick,
  onAudioCallClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handleInfoClick = () => {
    if (onInfoClick) {
      onInfoClick();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleAction = (action: string) => {
    switch(action) {
      case 'mute':
        console.log('Mute conversation');
        break;
      case 'search':
        console.log('Search in conversation');
        break;
      case 'block':
        console.log('Block user');
        break;
      case 'delete':
        console.log('Delete conversation');
        break;
      default:
        break;
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-300 shadow-sm relative text-black">
      <div className="flex items-center">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image 
            src={avatarSrc}
            alt="User Avatar"
            layout="fill"
            className="object-cover"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-3">
          <div className="font-medium">{username}</div>
          <div className="text-xs text-gray-500">Active now</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Audio call button */}
        <button 
          onClick={onAudioCallClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Audio call"
        >
          <FaPhone className="text-gray-600" />
        </button>
        
        {/* Video call button */}
        <button 
          onClick={onVideoCallClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Video call"
        >
          <FaVideo className="text-gray-600" />
        </button>
      </div>
      
      <div className="ml-auto flex items-center space-x-3">
        <button 
          className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors duration-200"
          onClick={() => handleAction('search')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <button 
          className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors duration-200"
          onClick={() => handleAction('mute')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.06-7.072m-2.828 9.9a9 9 0 010-12.728" />
          </svg>
        </button>
        
        <button 
          className={`
            rounded-full w-8 h-8 flex items-center justify-center 
            ${isHovered || isDropdownOpen ? 'bg-gray-200' : 'hover:bg-gray-100'} 
            text-gray-600 transition-colors duration-200
          `}
          onClick={handleInfoClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
        
        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute top-full right-4 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <ul className="py-1 text-sm text-gray-700">
              <li>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  onClick={() => handleAction('search')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search in conversation
                </button>
              </li>
              <li>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  onClick={() => handleAction('mute')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.06-7.072m-2.828 9.9a9 9 0 010-12.728" />
                  </svg>
                  Mute notifications
                </button>
              </li>
              <li>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  onClick={() => handleAction('block')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Block user
                </button>
              </li>
              <li className="border-t border-gray-100">
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 flex items-center"
                  onClick={() => handleAction('delete')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete conversation
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;