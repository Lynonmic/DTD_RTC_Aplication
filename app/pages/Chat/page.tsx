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
import { getAllChats, getChatMessages, sendMessage, createPrivateChat } from '../../services/chatService';
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
      const formattedMessages: Message[] = chatMessages.map(msg => {
        // Special handling for video call messages
        if (msg.type === 'video-call') {
          console.log('Processing video call message:', msg);
          return {
            id: msg.id,
            text: msg.content,
            sender: msg.senderId,
            timestamp: msg.timestamp,
            type: 'video-call',
            status: msg.status || 'active', // Always set active status for video calls
            roomUrl: msg.content, // Use the message content as roomUrl for video calls
            videoCallData: msg.videoCallData || {
              roomUrl: msg.content, // Also set roomUrl in videoCallData
              messageId: msg.id,
              chatId: chatId
            }
          };
        }
        
        // Regular messages
        return {
          id: msg.id,
          text: msg.content,
          sender: msg.senderId,
          timestamp: msg.timestamp,
          type: msg.type || 'text',
          status: msg.status,
          videoCallData: msg.videoCallData
        };
      });
      
      console.log('Formatted messages:', formattedMessages);
      setMessages(formattedMessages);
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

  // Function to handle chat selection
  const handleChatSelect = async (chat: Chat) => {
    try {
      setLoading(true);
      
      // Check if this is a new chat or a friend selection without an existing chat
      const existingChat = chat.id ? chats.find(c => c.id === chat.id) : null;
      
      if (!existingChat && !chat.id && chat.participants && chat.participants.length > 0) {
        // This is a friend selection without an existing chat
        // Create a private chat first
        const friendId = chat.participants[0];
        console.log('Creating private chat with friend:', friendId);
        
        try {
          // Step 1: Create a private chat
          const newChat = await createPrivateChat(currentUser.uid, friendId);
          console.log('Private chat created successfully:', newChat);
          
          // Step 2: Get all chats to refresh the list
          const chatData = await getAllChats(currentUser.uid);
          setChats(chatData);
          
          // Step 3: Set the current chat to the newly created one
          setCurrentChat(newChat);
          
          // Step 4: Fetch messages for the new chat
          await fetchMessages(newChat.id);
        } catch (error) {
          console.error('Error in chat creation sequence:', error);
        }
      } else if (existingChat) {
        // This is an existing chat, just select it
        setCurrentChat(existingChat);
        await fetchMessages(existingChat.id);
      } else if (chat.id) {
        // This is a new chat with an ID (from another source)
        setCurrentChat(chat);
        await fetchMessages(chat.id);
        
        // Refresh the chats list
        try {
          const chatData = await getAllChats(currentUser.uid);
          setChats(chatData);
        } catch (error) {
          console.error('Error refreshing chats:', error);
        }
      }
    } catch (error) {
      console.error('Error in handleChatSelect:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle sending a message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !currentUser.uid) return;
    
    try {
      // Step 1: Ensure we have a valid chat
      let chatId = currentChat?.id;
      
      if (!chatId) {
        // No valid chat ID, we can't send a message
        console.error('No chat ID available for sending message');
        alert('Please select a chat before sending a message');
        return;
      }
      
      console.log('Sending message to chat:', chatId);
      
      // Step 2: Send the message
      const newMessage = await sendMessage({
        chatId: chatId,
        content: text,
        senderId: currentUser.uid,
        type: 'text'
      });
      
      console.log('Message sent successfully, response:', newMessage);
      
      // Step 3: Update local messages state for immediate feedback
      const formattedMessage: Message = {
        id: newMessage.messageId || newMessage.id, // Handle both response formats
        text: text, // Use the text we sent since the response might not include content
        sender: currentUser.uid,
        timestamp: newMessage.timestamp || new Date()
      };
      
      setMessages([...messages, formattedMessage]);
      
      // Step 4: Refresh messages to ensure we have the latest data
      setTimeout(() => fetchMessages(chatId), 500);
    } catch (error) {
      console.error("Error sending message:", error);
      alert('Failed to send message. Please try again.');
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
      const videoCallData = {
        roomUrl: callRoom.roomUrl,
        messageId: callRoom.messageId,
        chatId: callRoom.chatId
      };
      
      setVideoCallData(videoCallData);
      
      // Create a message for the video call that will appear in the chat
      const videoCallMessage = {
        chatId: currentChat.id,
        content: callRoom.roomUrl, // Sử dụng roomUrl làm nội dung tin nhắn
        senderId: currentUser.uid,
        type: 'video-call',
        status: 'active', // Set the initial status as active
        videoCallData: videoCallData,
        roomUrl: callRoom.roomUrl // Thêm trực tiếp roomUrl để đảm bảo nó được truyền đi
      };
      
      // Send the video call message to the chat
      await sendMessage(videoCallMessage);
      
      // Add the message to the local state for immediate display
      const formattedMessage: Message = {
        id: callRoom.messageId,
        text: callRoom.roomUrl, // Sử dụng roomUrl làm nội dung tin nhắn
        sender: currentUser.uid,
        timestamp: new Date(),
        type: 'video-call',
        status: 'active', // Set the initial status as active
        videoCallData: videoCallData,
        roomUrl: callRoom.roomUrl // Thêm trực tiếp roomUrl vào tin nhắn
      };
      
      // Log để kiểm tra dữ liệu
      console.log('Video call message created:', formattedMessage);
      
      setMessages(prevMessages => [...prevMessages, formattedMessage]);
      
      // Show the video call component for the initiator
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
        <FriendList onChatSelect={handleChatSelect} />
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
            <div className="flex items-center justify-center h-full bg-white">
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 bg-white">
              {currentChat ? "No messages yet. Start a conversation!" : "Select a chat to start messaging"}
            </div>
          ) : (
            <MessageList 
              key={currentChat?.id} // Add key prop to force remount when chat changes
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