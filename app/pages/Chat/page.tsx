"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import FriendList from '../../components/FriendList';
import ChatHeader from '../../components/ChatHeader';
import MessageList from '../../components/MessageList';
import MessageInput from '../../components/MessageInput';
import UserSidebar from '../../components/UserSidebar';
import WherebyVideoCall from '../../components/WherebyVideoCall';
import { Message, Chat, ChatMessage } from '../../type';
import { auth } from '../../config/firebase';
import { useRouter } from 'next/navigation';
import { getAllChats, getChatMessages, sendMessage, markMessagesAsRead } from '../../services/chatService';
import { createVideoCallRoom } from '../../services/videoCallService';
import '../../styles/scrollbar.css';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallData, setVideoCallData] = useState<{roomUrl: string, messageId: string, chatId: string} | null>(null);

  const [currentUser, setCurrentUser] = useState({
    uid: "",
    username: "",
    avatarSrc: "https://res.cloudinary.com/dhatjk5lm/image/upload/v1744169461/profile-placeholder.jpg"
  });
  
  // Function to fetch messages for a chat
  const fetchMessages = async (chatId: string) => {
    try {
      setLoading(true);
      console.log('Fetching messages for chat:', chatId);
      const chatMessages = await getChatMessages(chatId);
      console.log('Received chat messages:', chatMessages);
      
      // Convert to Message format for MessageList component
      const formattedMessages: Message[] = chatMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.senderId,
        timestamp: msg.timestamp
      }));
      
      setMessages(formattedMessages);
      
      // Mark messages as read
      if (currentUser.uid) {
        await markMessagesAsRead(chatId, currentUser.uid);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userInfo = localStorage.getItem('user_info');
      
      if (!token) {
        // Redirect to login if not authenticated
        console.log('No auth token found, redirecting to homepage');
        router.push('/');
        return;
      }
      
      // Set current user from localStorage
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          setCurrentUser({
            uid: parsedUserInfo.uid,
            username: parsedUserInfo.displayName,
            avatarSrc: parsedUserInfo.photoURL
          });
        } catch (error) {
          console.error('Error parsing user info:', error);
          // Redirect to login if user info is invalid
          console.log('Invalid user info, redirecting to homepage');
          router.push('/');
        }
      } else {
        // Redirect to login if user info is missing
        console.log('No user info found, redirecting to homepage');
        router.push('/');
      }
    };
    
    // Small delay to ensure localStorage is available (client-side only)
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [router]);

  // Fetch chats when currentUser changes
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatData = await getAllChats(currentUser.uid);
        setChats(chatData);
        
        // Set current chat to the first one if available
        if (chatData.length > 0) {
          setCurrentChat(chatData[0]);
          // Fetch messages for the first chat
          await fetchMessages(chatData[0].id);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.uid) {
      fetchChats();
    }
  }, [currentUser]);

  // Fetch chats when currentUser changes
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatData = await getAllChats(currentUser.uid);
        setChats(chatData);
        
        // Set current chat to the first one if available
        if (chatData.length > 0) {
          setCurrentChat(chatData[0]);
          // Fetch messages for the first chat
          await fetchMessages(chatData[0].id);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.uid) {
      fetchChats();
    }
  }, [currentUser]);

  // Function to handle chat selection
  const handleChatSelect = async (chat: Chat) => {
    setCurrentChat(chat);
    await fetchMessages(chat.id);
  };
  
  // Function to handle sending a message
  const handleSendMessage = async (text: string) => {
    if (!currentChat || !text.trim() || !currentUser.uid) return;
    
    try {
      console.log('Sending message to chat:', currentChat.id);
      // Send message to backend
      const newMessage = await sendMessage({
        chatId: currentChat.id,
        content: text,
        senderId: currentUser.uid,
        type: 'text'
      });
      
      console.log('Message sent, response:', newMessage);
      
      // Update local messages state
      const formattedMessage: Message = {
        id: newMessage.messageId || newMessage.id, // Handle both response formats
        text: text, // Use the text we sent since the response might not include content
        sender: currentUser.uid,
        timestamp: newMessage.timestamp || new Date()
      };
      
      setMessages([...messages, formattedMessage]);
      
      // Refresh messages to ensure we have the latest data
      setTimeout(() => fetchMessages(currentChat.id), 500);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle info button click
  const handleInfoClick = () => {
    console.log('Info clicked for chat:', currentChat?.id);
    // You can implement additional functionality here, such as:
    // - Opening a chat details modal
    // - Showing participant information
    // - Displaying chat settings
  };

  // Function to start a video call
  const handleStartVideoCall = async () => {
    if (!currentChat || !currentUser.uid) {
      console.error('Cannot start video call: No active chat or user');
      return;
    }
    
    try {
      console.log('Starting video call for chat:', currentChat.id);
      
      // Create a video call room using the backend service
      const callRoom = await createVideoCallRoom({
        chatId: currentChat.id,
        senderId: currentUser.uid
      });
      
      console.log('Video call room created:', callRoom);
      
      // Set the video call data and show the video call component
      setVideoCallData({
        roomUrl: callRoom.roomUrl,
        messageId: callRoom.messageId,
        chatId: callRoom.chatId
      });
      
      setShowVideoCall(true);
    } catch (error) {
      console.error('Failed to create video call room:', error);
      alert('Could not start video call. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-[auto_250px_minmax(500px,1fr)_250px] lg:grid-cols-[auto_220px_minmax(450px,1fr)_220px] md:grid-cols-[auto_200px_1fr_0] sm:grid-cols-[auto_0_1fr_0] h-screen w-full overflow-hidden">
      {/* Left sidebar */}
      <div className="h-full bg-gray-100 overflow-y-auto custom-scrollbar">
        <Sidebar />
      </div>
      
      {/* Friend list section */}
      <div className="h-full border-r border-gray-200 overflow-y-auto custom-scrollbar md:block sm:hidden">
        <FriendList />
      </div>
      
      {/* Chat section */}
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 shadow-sm z-10">
          <ChatHeader 
            username={currentChat ? currentChat.name || "Chat" : "Select a chat"}
            avatarSrc={currentChat?.photoURL || currentUser.avatarSrc}
            onInfoClick={handleInfoClick}
            onVideoCallClick={() => handleStartVideoCall()}
            onAudioCallClick={() => console.log('Audio call clicked')}
          />
        </div>
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              {currentChat ? "No messages yet. Start a conversation!" : "Select a chat to start messaging"}
            </div>
          ) : (
            <MessageList 
              chatId={currentChat?.id || ''} 
              currentUserId={currentUser.uid} 
              initialMessages={messages}
            />
          )}
        </div>
        <div className="flex-shrink-0 border-t border-gray-200 bg-white">
          {currentChat && (
            <MessageInput 
              onSendMessage={handleSendMessage} 
              chatId={currentChat.id} 
              currentUserId={currentUser.uid}
            />
          )}
        </div>
        
        {/* Video call overlay */}
        {showVideoCall && videoCallData && (
          <WherebyVideoCall
            roomUrl={videoCallData.roomUrl}
            messageId={videoCallData.messageId}
            chatId={videoCallData.chatId}
            onClose={() => setShowVideoCall(false)}
            userName={currentUser.username || currentUser.uid}
          />
        )}
      </div>
      
      {/* User sidebar */}
      <div className="h-full border-l border-gray-200 bg-gray-50 overflow-y-auto md:hidden lg:block">
        <UserSidebar />
      </div>
    </div>
  );
}