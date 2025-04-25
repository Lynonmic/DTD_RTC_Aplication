"use client";
import React from 'react';
import Image from 'next/image';

interface Friend {
  id?: string;
  avatar?: string;
  name?: string;
  time?: string;
  message?: string;
  unread?: number;
  status?: string | boolean;
}

const FriendItem: React.FC<{ friend: Friend; isActive?: boolean; onClick?: () => void }> = ({ friend, isActive, onClick }) => {
  if (!friend) return null;

  return (
    <li className={`hover:bg-gray-50 cursor-pointer ${isActive ? 'bg-gray-50' : ''}`} onClick={onClick}>
      <div className="flex items-center p-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {friend.avatar ? (
              <Image 
                src={friend.avatar} 
                alt={friend.name || 'Avatar'} 
                width={48} 
                height={48} 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                {friend.name ? friend.name.charAt(0) : 'U'}
              </div>
            )}
          </div>
          {friend.status === 'online' && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="ml-3 flex-1 overflow-hidden">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-black">{friend.name}</h3>
            <span className="text-xs text-gray-500">{friend.time || 'Yesterday'}</span>
          </div>
          <p className="text-sm text-gray-500 truncate">
            {friend.message || 'Body 2 maecenas sed diam eget risus varius blandit sit amet non'}
          </p>
        </div>
        {friend.unread && friend.unread > 0 && (
          <div className="ml-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">{friend.unread > 9 ? '9+' : friend.unread}</span>
          </div>
        )}
      </div>
    </li>
  );
};

export default FriendItem;