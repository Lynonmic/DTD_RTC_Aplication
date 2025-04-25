"use client";
import React, { useState, useEffect } from 'react';
import FriendItem from './FriendItem';
import Image from 'next/image';
import { createPrivateChat } from '../services/chatService';
import { getAllFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, Friend as FriendType, FriendRequest } from '../services/friendService';
import { searchUsers } from '../services/userSearchService';
import { User } from '../type';
import { FaSearch, FaPlus } from 'react-icons/fa';

interface Friend {
  id: string;
  name: string;
  message?: string;
  time?: string;
  avatar: string;
  unread?: number;
  status?: boolean | string;
}

interface FriendListProps {
  onChatSelect?: (chat: any) => void;
}

const FriendList = ({ onChatSelect }: FriendListProps) => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<FriendType[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'requests'>('search');
  const [isSearching, setIsSearching] = useState(false);
  const [messageCount, setMessageCount] = useState(29); // For the message count in the header

  // Fetch all users when component mounts or when modal is opened
  useEffect(() => {
    if (showNewChatModal) {
      const fetchUsersData = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          // Get all friends from the backend using our friendService
          const friendsData = await getAllFriends();
          
          if (Array.isArray(friendsData)) {
            setAllUsers(friendsData);
          } else {
            console.error('Unexpected response format:', friendsData);
            setAllUsers([]);
          }

          // Get friend requests
          const requestsData = await getFriendRequests();
          if (Array.isArray(requestsData)) {
            setFriendRequests(requestsData);
          } else {
            console.error('Unexpected friend requests format:', requestsData);
            setFriendRequests([]);
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

  // Fetch friends when component mounts
  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        try {
          // Fetch friend list using our friendService
          const friendsData = await getAllFriends();
          
          if (Array.isArray(friendsData)) {
            // Map the backend data to our Friend interface
            const formattedFriends = friendsData.map(friend => ({
              id: friend.id || '',
              name: friend.displayName || 'Unknown User',
              avatar: friend.photoURL || '/images/default-avatar.png',
              status: friend.status ? 'online' : 'offline'
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
      setError(null);
      
      console.log('Step 1: Creating private chat with user:', userId);
      
      // Get the current user from localStorage
      const userInfoStr = localStorage.getItem('user_info');
      if (!userInfoStr) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }
      
      const userInfo = JSON.parse(userInfoStr);
      const currentUserId = userInfo.uid;
      
      // Step 1: Create a private chat with the selected user
      const newChat = await createPrivateChat(currentUserId, userId);
      console.log('Step 1 Complete: Private chat created:', newChat);
      
      // Close the modal
      setShowNewChatModal(false);
      
      // Step 2: Get all chats to refresh the list
      console.log('Step 2: Refreshing all chats');
      try {
        // Fetch friend list using our friendService
        const friendsData = await getAllFriends();
        
        if (Array.isArray(friendsData)) {
          // Map the backend data to our Friend interface
          const formattedFriends = friendsData.map(friend => ({
            id: friend.id || '',
            name: friend.displayName || 'Unknown User',
            avatar: friend.photoURL || '/images/default-avatar.png',
            status: friend.status ? 'online' : 'offline'
          }));
          
          setFriends(formattedFriends);
          console.log('Step 2 Complete: Chats refreshed');
        } else {
          console.error('Unexpected response format:', friendsData);
          setFriends([]);
        }
      } catch (error) {
        console.error('Error in Step 2 - refreshing chats:', error);
        setError('Failed to load friends. Please check your connection.');
      }
      
      // Step 3: Enable sending messages by selecting the chat
      console.log('Step 3: Enabling message sending by selecting the chat');
      if (onChatSelect && newChat) {
        onChatSelect(newChat);
        console.log('Step 3 Complete: Chat selected, ready to send messages');
      }
      
    } catch (error) {
      console.error('Error in chat creation sequence:', error);
      setError('Failed to create chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Note: handleStartChat function was removed as it was redundant with handleCreateChat
  // and wasn't being used anywhere in the component

  const handleChatSelect = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Step 1: Selecting chat with ID:', id);
      setActiveChat(id);
      
      // Find the chat in the friends list
      const selectedFriend = friends.find(friend => friend.id === id);
      
      if (!selectedFriend) {
        console.error('Friend not found with ID:', id);
        setError('Friend not found');
        setIsLoading(false);
        return;
      }
      
      console.log('Step 1 Complete: Found friend:', selectedFriend.name);
      
      // Step 2: Get all chats to ensure we have the latest data
      console.log('Step 2: Refreshing all chats');
      try {
        // This is typically handled in the parent component via the onChatSelect callback
        // But we can log it here for consistency
        console.log('Step 2 Complete: Chat list refresh triggered');
      } catch (error) {
        console.error('Error in Step 2 - refreshing chats:', error);
      }
      
      // Step 3: Enable sending messages by selecting the chat in the parent component
      console.log('Step 3: Enabling message sending by selecting the chat');
      if (onChatSelect) {
        // Pass complete chat information including participants array
        // This is critical for the ChatPage component to create a new chat if needed
        onChatSelect({
          id: '', // Empty ID to trigger chat creation in parent component
          name: selectedFriend.name,
          photoURL: selectedFriend.avatar,
          participants: [selectedFriend.id] // Add participants array with friend ID
        });
        console.log('Step 3 Complete: Chat selected with participants, ready to send messages');
      }
    } catch (error) {
      console.error('Error in chat selection sequence:', error);
      setError('Failed to select chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowNewChatModal(false);
    setSearchQuery('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle user search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle sending friend request
  const handleSendFriendRequest = async (userId: string) => {
    try {
      setIsLoading(true);
      await sendFriendRequest(userId);
      // Update UI to show request sent
      setSearchResults(prev => 
        prev.map(user => 
          user.id === userId || user.uid === userId 
            ? { ...user, requestSent: true } 
            : user
        )
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Failed to send friend request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle accepting friend request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      await acceptFriendRequest(requestId);
      // Remove the request from the list
      setFriendRequests(prev => prev.filter(request => request.id !== requestId));
      // Refresh friend list
      const friendsData = await getAllFriends();
      if (Array.isArray(friendsData)) {
        const formattedFriends = friendsData.map(friend => ({
          id: friend.id || '',
          name: friend.displayName || 'Unknown User',
          avatar: friend.photoURL || '/images/default-avatar.png',
          status: friend.status ? 'online' : 'offline'
        }));
        
        setFriends(formattedFriends);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError('Failed to accept friend request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle rejecting friend request
  const handleRejectRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      await rejectFriendRequest(requestId);
      // Remove the request from the list
      setFriendRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      setError('Failed to reject friend request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const userInfo = localStorage.getItem('user_info');
    const currentUser = userInfo ? JSON.parse(userInfo) : null;
    
    // Filter out the current user and search by name
    return (
      (!currentUser || user.id !== currentUser.uid) &&
      ((user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) || 
       (user.email?.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });


  return (
    <div className="bg-white shadow-md h-full flex flex-col">
      {/* Friend List Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center">
            <h2 className="font-semibold text-lg text-black">Friend List</h2>
            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-xs rounded-full text-black">
              {messageCount} 
            </span>
            <span className="text-black">Messages</span>
          </div>
          
        </div>
      </div>
      
      {/* Search Bar - Using the SearchBar component */}
      <div className="border-b border-gray-200">
        <div className="relative px-4 py-2">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <FaSearch className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Friend List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : friends.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {friends.map((friend) => (
              <FriendItem
                key={friend.id}
                friend={{
                  id: friend.id,
                  name: friend.name,
                  avatar: friend.avatar,
                  message: friend.message,
                  time: friend.time,
                  unread: friend.unread,
                  status: friend.status
                }}
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
              className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add Friends
            </button>
          </div>
        )}
      </div>
      
      {/* New Chat Button - Removed as we have the + button in the header */}
      <div className="fixed bottom-4 left-60 z-10">
        <button
          onClick={() => setShowNewChatModal(true)}
          className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors"
        >
          <FaPlus className="h-5 w-5" />
        </button>
      </div>
      
      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Friend Management</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-3 font-medium text-sm ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-black hover:text-black'}`}
                onClick={() => setActiveTab('search')}
              >
                Find Friends
              </button>
              <button
                className={`flex-1 py-3 font-medium text-sm ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('requests')}
              >
                Friend Requests {friendRequests.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {friendRequests.length}
                  </span>
                )}
              </button>
            </div>
            
            <div className="p-4">
              {/* Search Users Tab */}
              {activeTab === 'search' && (
                <>
                  <div className="flex mb-4">
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {searchResults.map(user => (
                          <li key={user.id || user.uid} className="py-3">
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                              <div className="flex items-center">
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
                                  <p className="text-sm font-medium text-black">{user.displayName}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {(user as User & { requestSent?: boolean }).requestSent ? (
                                  <span className="text-xs text-gray-500 italic">Request sent</span>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleSendFriendRequest(user.id || user.uid || '')}
                                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                      disabled={isLoading}
                                    >
                                      Add Friend
                                    </button>
                                    <button
                                      onClick={() => handleCreateChat(user.id || user.uid || '')}
                                      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                                      disabled={isLoading}
                                    >
                                      Message
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : searchQuery ? (
                      <div className="text-center py-8 text-gray-500">
                        No users found matching "{searchQuery}"
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Search for users to add as friends
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {/* Friend Requests Tab */}
              {activeTab === 'requests' && (
                <div className="max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : friendRequests.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {friendRequests.map(request => (
                        <li key={request.id} className="py-3">
                          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 text-black">
                                {request.sender.photoURL ? (
                                  <Image 
                                    src={request.sender.photoURL} 
                                    alt={request.sender.displayName || ''} 
                                    width={40} 
                                    height={40} 
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    {(request.sender.displayName || '').charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="ml-3 text-left">
                                <p className="text-sm font-medium text-black">{request.sender.displayName}</p>
                                <p className="text-xs text-gray-500">Wants to be your friend</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAcceptRequest(request.id)}
                                className="px-3 py-1 text-white text-xs rounded hover:opacity-90 transition-colors"
                                style={{ backgroundColor: 'rgb(96, 181, 255)' }}
                                disabled={isLoading}
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="px-3 py-1 text-white text-xs rounded hover:opacity-90 transition-colors"
                                style={{ backgroundColor: 'rgba(96, 181, 255, 0.8)' }}
                                disabled={isLoading}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No pending friend requests
                    </div>
                  )}
                </div>
              )}
              
              {/* Existing Friends Section */}
              {activeTab === 'search' && filteredUsers.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Your Friends</h4>
                  <ul className="divide-y divide-gray-200 max-h-40 overflow-y-auto">
                    {filteredUsers.map(user => (
                      <li key={user.id} className="py-2">
                        <button 
                          onClick={() => handleCreateChat(user.id || '')}
                          className="w-full flex items-center hover:bg-gray-50 p-2 rounded-md"
                          disabled={isLoading}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 text-black">
                            {user.photoURL ? (
                              <Image 
                                src={user.photoURL} 
                                alt={user.displayName || ''} 
                                width={32} 
                                height={32} 
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {(user.displayName || '').charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 text-left">
                            <p className="text-sm font-medium text-black">{user.displayName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <div className="ml-auto">
                            <span className={`inline-block w-2 h-2 rounded-full ${user.status ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendList;