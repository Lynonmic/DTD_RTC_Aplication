"use client";
import React, { useState, useEffect } from 'react';
import FriendItem from './FriendItem';
import Image from 'next/image';
// In a real app, we would import from the actual service
// import { createPrivateChat } from '@/services/chatService';

interface Friend {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string;
  unread: number;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

const FriendList = () => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([
    { id: 'user1', name: 'John Doe', avatar: '/avatar4.png' },
    { id: 'user2', name: 'Jane Smith', avatar: '/avatar5.png' },
    { id: 'user3', name: 'Mike Johnson', avatar: '/avatar6.png' },
    { id: 'user4', name: 'Emily Davis', avatar: '/avatar7.png' },
    { id: 'user5', name: 'Chris Wilson', avatar: '/avatar8.png' },
  ]);
  
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: 'Trần Cường',
      message: 'Body 2 maecenas sed diam eget risus varius blandit sit amet non',
      time: '12:30 PM',
      avatar: '/avatar1.png',
      unread: 9
    },
    {
      id: 2,
      name: 'Alex Johnson',
      message: 'Hey, how are you doing today?',
      time: '10:45 AM',
      avatar: '/avatar2.png',
      unread: 2
    },
    {
      id: 3,
      name: 'Sarah Williams',
      message: 'Can we meet tomorrow to discuss the project?',
      time: 'Yesterday',
      avatar: '/avatar3.png',
      unread: 0
    }
  ]);

  const [activeChat, setActiveChat] = useState(1);

  const handleChatSelect = (id: number) => {
    setActiveChat(id);
  };

  const handleAddNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleCloseModal = () => {
    setShowNewChatModal(false);
    setSearchQuery('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock implementation of createPrivateChat
  const mockCreatePrivateChat = async (currentUserId: string, friendId: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock chat data
    return {
      id: `chat-${Date.now()}`,
      participants: [currentUserId, friendId],
      type: 'private',
      createdAt: new Date()
    };
  };

  const handleStartChat = async (userId: string) => {
    try {
      setIsLoading(true);
      // Get current user ID (in a real app, this would come from auth context)
      const currentUserId = '3p4Hx4MlhPZ4EHdYaQ3tQ5mLANt2';
      
      // Call the mock API to create a private chat
      const newChat = await mockCreatePrivateChat(currentUserId, userId);
      
      // In a real app, you would update the friends list with the new chat
      // For now, we'll just add a mock entry
      const newFriend = {
        id: friends.length + 1,
        name: allUsers.find(user => user.id === userId)?.name || 'New Friend',
        message: 'New conversation started',
        time: 'Just now',
        avatar: allUsers.find(user => user.id === userId)?.avatar || '/profile-placeholder.jpg',
        unread: 0
      };
      
      setFriends([newFriend, ...friends]);
      setActiveChat(newFriend.id);
      handleCloseModal();
      
      // Show success message
      alert('New chat created successfully!');
    } catch (error) {
      console.error('Error creating new chat:', error);
      alert('Failed to create new chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white text-black relative">
      {/* User profile section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black overflow-hidden">
            <span>TC</span>
          </div>
          <span className="ml-3 font-medium text-black">My Account</span>
        </div>
      </div>
      
      {/* Friend list header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-black">Friend List</h2>
          <span className="text-sm text-gray-500">{friends.reduce((acc, friend) => acc + friend.unread, 0)} Messages</span>
        </div>
      </div>
      
      {/* Friend list content */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {friends.map((friend) => (
            <div 
              key={friend.id} 
              onClick={() => handleChatSelect(friend.id)}
              className={`cursor-pointer ${activeChat === friend.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <FriendItem friend={friend} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Add new chat button */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleAddNewChat}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Chat
        </button>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Start a New Chat</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search for a friend</label>
                <input
                  type="text"
                  id="search"
                  placeholder="Type a name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No users found</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredUsers.map(user => (
                      <li key={user.id} className="py-3">
                        <button 
                          onClick={() => handleStartChat(user.id)}
                          className="w-full flex items-center hover:bg-gray-50 p-2 rounded-md"
                          disabled={isLoading}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                            {user.avatar ? (
                              <Image 
                                src={user.avatar} 
                                alt={user.name} 
                                width={40} 
                                height={40} 
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {user.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 text-left">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              {isLoading && (
                <div className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendList;