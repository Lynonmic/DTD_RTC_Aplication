"use client";
import React from 'react';

interface Friend {
  id?: number;
  avatar?: string;
  name?: string;
  time?: string;
  message?: string;
  unread?: number;
}

const FriendItem: React.FC<{ friend: Friend }> = ({ friend }) => {
  if (!friend) return null;

  return (
    <div className="p-4 flex items-center text-black">
      <div className="relative">
        {friend.avatar ? (
          <img 
            src={friend.avatar} 
            alt={friend.name || 'Avatar'} 
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-black">
            {friend.name ? friend.name.charAt(0) : 'U'}
          </div>
        )}
        {(friend.unread && friend.unread > 0) && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {friend.unread > 9 ? '9+' : friend.unread}
          </div>
        )}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          {friend.name && (
            <p className="font-medium truncate text-black">{friend.name}</p>
          )}
          {friend.time && (
            <p className="text-xs text-gray-500 ml-2">{friend.time}</p>
          )}
        </div>
        {friend.message && (
          <p className="text-sm text-gray-600 truncate mt-1">{friend.message}</p>
        )}
      </div>
    </div>
  );
};

export default FriendItem;