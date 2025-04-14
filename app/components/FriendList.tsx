"use client";
import React, { useState, useEffect } from 'react';
import FriendItem from './FriendItem';
import Image from 'next/image';
import { getAllUsers, createPrivateChat } from '../services/chatService';
import api from '../services/apiService';
import { User } from '../type';

interface Friend {
  id: string;
  name: string;
  message?: string;
  time?: string;
  avatar: string;
  unread?: number;
  status?: string;
}

const FriendList = () => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users when component mounts or when modal is opened
  useEffect(() => {
    if (showNewChatModal) {
      const fetchUsersData = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          // Get all users from the backend using the correct endpoint
          const response = await api.get('/friends/friendlist');
          const users = response.data;
          
          if (Array.isArray(users)) {
            setAllUsers(users);
          } else {
            console.error('Unexpected response format:', users);
            setAllUsers([]);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          setError('Failed to load users. Please check your connection.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUsersData();
    }
  }, [showNewChatModal]);

  // Fetch friends (chats) when component mounts
  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get the current user from localStorage
        const userInfo = localStorage.getItem('user_info');
        
        if (userInfo) {
          const currentUser = JSON.parse(userInfo);
          
          try {
            // Fetch friend list from the backend using the correct endpoint
            const response = await api.get('/friends/friendlist');
            const friendsData = response.data;
            
            if (Array.isArray(friendsData)) {
              // Map the backend data to our Friend interface
              const formattedFriends = friendsData.map(friend => ({
                id: friend.uid || friend.id || '',
                name: friend.displayName || friend.username || 'Unknown User',
                avatar: friend.photoURL || friend.avatarSrc || '/images/default-avatar.png',
                status: friend.status || 'offline'
              }));
              
              setFriends(formattedFriends);
            } else {
              console.error('Unexpected response format:', friendsData);
              setFriends([]);
            }
          } catch (error) {
            console.error('API error fetching friends:', error);
            setError('Failed to load friends. Please check your connection.');
          }
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Failed to load friends. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFriendsData();
  }, []);

  const handleCreateChat = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Get the current user from localStorage
      const userInfo = localStorage.getItem('user_info');
      
      if (userInfo) {
        const currentUser = JSON.parse(userInfo);
        
        // Create a private chat with the selected user
        await createPrivateChat(currentUser.uid, userId);
        
        // Close the modal and refresh the friends list
        setShowNewChatModal(false);
        const fetchFriendsData = async () => {
          try {
            setIsLoading(true);
            setError(null);
            
            // Get the current user from localStorage
            const userInfo = localStorage.getItem('user_info');
            
            if (userInfo) {
              const currentUser = JSON.parse(userInfo);
              
              try {
                // Fetch friend list from the backend using the correct endpoint
                const response = await api.get('/friends/friendlist');
                const friendsData = response.data;
                
                if (Array.isArray(friendsData)) {
                  // Map the backend data to our Friend interface
                  const formattedFriends = friendsData.map(friend => ({
                    id: friend.uid || friend.id || '',
                    name: friend.displayName || friend.username || 'Unknown User',
                    avatar: friend.photoURL || friend.avatarSrc || '/images/default-avatar.png',
                    status: friend.status || 'offline'
                  }));
                  
                  setFriends(formattedFriends);
                } else {
                  console.error('Unexpected response format:', friendsData);
                  setFriends([]);
                }
              } catch (apiError) {
                console.error('API error fetching friends:', apiError);
                setError('Failed to load friends. Please check your connection.');
              }
            }
          } catch (error) {
            console.error('Error fetching friends:', error);
            setError('Failed to load friends. Please try again later.');
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchFriendsData();
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      setError('Failed to create chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const userInfo = localStorage.getItem('user_info');
    const currentUser = userInfo ? JSON.parse(userInfo) : null;
    
    // Filter out the current user and search by name
    return (
      (!currentUser || user.uid !== currentUser.uid) &&
      ((user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) || 
       (user.email?.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  const handleChatSelect = (id: string) => {
    setActiveChat(id);
    // This would typically trigger a callback to the parent component
  };

  const handleCloseModal = () => {
    setShowNewChatModal(false);
    setSearchQuery('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStartChat = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Get the current user ID from localStorage
      const userInfo = localStorage.getItem('user_info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }
      
      const currentUser = JSON.parse(userInfo);
      const currentUserId = currentUser.uid;
      
      // Create a private chat with the selected user
      const newChat = await createPrivateChat(currentUserId, userId);
      
      // Find the user details to display in the chat list
      const chatUser = allUsers.find(user => user.uid === userId);
      
      // Add the new chat to the friends list
      if (chatUser) {
        const newFriend: Friend = {
          id: newChat.id || `chat-${Date.now()}`,
          name: chatUser.displayName || '',
          message: 'New conversation started',
          time: 'Just now',
          avatar: chatUser.photoURL || '',
          unread: 0
        };
        
        setFriends(prev => [...prev, newFriend]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md h-full flex flex-col">
      {/* Friend List Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-black">Friend List</h2>
          <span className="text-sm text-gray-500">{friends.reduce((acc, friend) => acc + (friend.unread || 0), 0)} Messages</span>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search friends..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Friend List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : friends.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {friends.map((friend) => (
              <FriendItem
                key={friend.id}
                friend={friend}
                isActive={activeChat === friend.id}
                onClick={() => handleChatSelect(friend.id)}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <p>No friends yet</p>
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Friends
            </button>
          </div>
        )}
      </div>
      
      {/* New Chat Button */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={() => setShowNewChatModal(true)}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Chat
        </button>
      </div>
      
      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-black">Start a New Chat</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-black"
              />
              <div className="max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredUsers.map(user => (
                      <li key={user.uid} className="py-3">
                        <button 
                          onClick={() => handleCreateChat(user.uid || '')}
                          className="w-full flex items-center hover:bg-gray-50 p-2 rounded-md"
                          disabled={isLoading}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 text-black">
                            {user.photoURL ? (
                              <Image 
                                src={user.photoURL} 
                                alt={user.displayName || ''} 
                                width={40} 
                                height={40} 
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {(user.displayName || '').charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 text-left">
                            <p className="text-sm font-medium text-gray-100">{user.displayName}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendList;