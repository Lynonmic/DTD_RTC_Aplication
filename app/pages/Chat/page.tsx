"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import FriendList from '../../components/FriendList';
import ChatHeader from '../../components/ChatHeader';
import MessageList from '../../components/MessageList';
import MessageInput from '../../components/MessageInput';
import UserSidebar from '../../components/UserSidebar';
import VideoCall from '../../components/VideoCall';
import { Message } from '../../type/index';
import { auth } from '../../config/firebase';
import { useRouter } from 'next/navigation';

// Define types for chat data
interface Chat {
  id: string;
  name?: string;
  photoURL?: string;
  type: string;
  participants: string[];
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Date;
  };
}

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: any; // Firebase timestamp
  type: string;
  fileURL?: string;
  readBy: string[];
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallData, setVideoCallData] = useState<{peerId: string, chatId: string} | null>(null);

  const [currentUser, setCurrentUser] = useState({
    uid: "",
    username: "",
    avatarSrc: "/profile-placeholder.jpg"
  });
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userInfo = localStorage.getItem('user_info');
      
      if (!token) {
        // Redirect to login if not authenticated
        router.push('/pages/Login');
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
          router.push('/pages/Login');
        }
      } else {
        // Redirect to login if user info is missing
        router.push('/pages/Login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Mock service functions since we can't directly import from backend
  const mockGetAllChats = async (uid: string): Promise<Chat[]> => {
    // Simulate API call
    console.log(`Fetching chats for user: ${uid}`);
    return [
      {
        id: "chat1",
        name: "John Doe",
        photoURL: "/profile-placeholder.jpg",
        type: "private",
        participants: [uid, "user2"],
        lastMessage: {
          content: "Hello there!",
          senderId: "user2",
          timestamp: new Date()
        }
      },
      {
        id: "chat2",
        name: "Group Chat",
        photoURL: "/group-placeholder.jpg",
        type: "group",
        participants: [uid, "user3", "user4"],
        lastMessage: {
          content: "When is the meeting?",
          senderId: "user3",
          timestamp: new Date()
        }
      }
    ];
  };

  const mockGetChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
    // Simulate API call
    console.log(`Fetching messages for chat: ${chatId}`);
    return [
      {
        id: "msg1",
        content: "Hello! How are you?",
        senderId: "user2",
        timestamp: new Date(),
        type: "text",
        readBy: [currentUser.uid]
      },
      {
        id: "msg2",
        content: "I'm doing great! Just working on some new features.",
        senderId: currentUser.uid,
        timestamp: new Date(),
        type: "text",
        readBy: [currentUser.uid, "user2"]
      }
    ];
  };

  const mockSendMessage = async (messageData: {
    chatId: string;
    content: string;
    senderId: string;
    type: string;
  }): Promise<ChatMessage> => {
    // Simulate API call
    console.log(`Sending message to chat: ${messageData.chatId}`);
    return {
      id: `msg-${Date.now()}`,
      content: messageData.content,
      senderId: messageData.senderId,
      timestamp: new Date(),
      type: messageData.type,
      readBy: [messageData.senderId]
    };
  };

  const mockMarkAsRead = async (chatId: string, userId: string): Promise<void> => {
    // Simulate API call
    console.log(`Marking messages as read for chat: ${chatId} by user: ${userId}`);
  };

  const mockGetCurrentUser = () => {
    // Simulate getting current user with the specific UID for testing
    return {
      uid: "3p4Hx4MlhPZ4EHdYaQ3tQ5mLANt2",
      displayName: "Trần Cường",
      photoURL: "/profile-placeholder.jpg"
    };
  };

  // Check authentication and fetch user data and chats on component mount
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Check if user is authenticated
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            // User is signed in
            console.log("User is authenticated:", firebaseUser.uid);
            
            // Set current user from Firebase
            setCurrentUser({
              uid: firebaseUser.uid || "3p4Hx4MlhPZ4EHdYaQ3tQ5mLANt2", // Fallback to test UID if needed
              username: firebaseUser.displayName || "Trần Cường",
              avatarSrc: firebaseUser.photoURL || "/profile-placeholder.jpg"
            });
            
            // Fetch user's chats using the UID from Firebase
            const userChats = await mockGetAllChats(firebaseUser.uid);
            setChats(userChats);
            
            // Set current chat to the first one if available
            if (userChats.length > 0) {
              setCurrentChat(userChats[0]);
              // Fetch messages for the first chat
              await fetchMessages(userChats[0].id);
            }
          } else {
            // User is not signed in, use test UID
            console.log("User is not authenticated, using test UID");
            const user = mockGetCurrentUser();
            setCurrentUser({
              uid: user.uid,
              username: user.displayName || "Trần Cường",
              avatarSrc: user.photoURL || "/profile-placeholder.jpg"
            });
            
            // Fetch user's chats using the test UID
            const userChats = await mockGetAllChats(user.uid);
            setChats(userChats);
            
            // Set current chat to the first one if available
            if (userChats.length > 0) {
              setCurrentChat(userChats[0]);
              // Fetch messages for the first chat
              await fetchMessages(userChats[0].id);
            }
          }
          setLoading(false);
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error checking authentication:", error);
        setLoading(false);
      }
    };
    
    checkAuthAndFetchData();
  }, []);

  // Fetch messages for a specific chat
  const fetchMessages = async (chatId: string) => {
    try {
      const chatMessages = await mockGetChatMessages(chatId);
      
      // Convert backend messages to frontend Message format
      const formattedMessages: Message[] = chatMessages.map(msg => ({
        id: parseInt(msg.id.replace('msg-', '')) || Math.floor(Math.random() * 10000), // Convert string ID to number
        text: msg.content,
        sender: msg.senderId === currentUser.uid ? "You" : msg.senderId,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
      }));
      
      setMessages(formattedMessages);
      
      // Mark messages as read
      if (currentUser.uid) {
        await mockMarkAsRead(chatId, currentUser.uid);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle chat selection
  const handleChatSelect = async (chat: Chat) => {
    setCurrentChat(chat);
    await fetchMessages(chat.id);
  };

  // Handle sending a message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !currentChat) return;
    
    try {
      // Prepare message data
      const messageData = {
        chatId: currentChat.id,
        content: text,
        senderId: currentUser.uid,
        type: "text"
      };
      
      // Optimistically add message to UI
      const tempId = Date.now();
      const tempMessage: Message = {
        id: tempId, // Use number for ID to match Message interface
        text,
        sender: "You",
        timestamp: new Date()
      };
      setMessages([...messages, tempMessage]);
      
      // Send message to backend
      const sentMessage = await mockSendMessage(messageData);
      
      // Update messages with the actual message from server
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === tempId 
            ? {
                id: parseInt(sentMessage.id.replace('msg-', '')) || Math.floor(Math.random() * 10000),
                text: sentMessage.content,
                sender: "You",
                timestamp: sentMessage.timestamp ? new Date(sentMessage.timestamp) : new Date()
              } 
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the optimistically added message on error
      const tempId = Date.now();
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempId));
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

  return (
    <div className="grid grid-cols-[auto_300px_1fr_250px] lg:grid-cols-[auto_250px_1fr_220px] md:grid-cols-[auto_200px_1fr_0] sm:grid-cols-[auto_0_1fr_0] h-screen w-full overflow-hidden">
      {/* Left sidebar */}
      <div className="h-full bg-gray-100 overflow-y-auto">
        <Sidebar />
      </div>
      
      {/* Friend list section */}
      <div className="h-full border-r border-gray-200 overflow-y-auto md:block sm:hidden">
        <FriendList />
      </div>
      
      {/* Chat section */}
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 shadow-sm z-10">
          <ChatHeader 
            username={currentChat ? currentChat.name || "Chat" : "Select a chat"}
            avatarSrc={currentChat?.photoURL || currentUser.avatarSrc}
            onInfoClick={handleInfoClick}
            onVideoCallClick={() => setShowVideoCall(true)}
            onAudioCallClick={() => console.log('Audio call clicked')}
          />
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              {currentChat ? "No messages yet. Start a conversation!" : "Select a chat to start messaging"}
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>
        <div className="flex-shrink-0 border-t border-gray-200 bg-white">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
        
        {/* Video call overlay */}
        {showVideoCall && currentChat && (
          <div className="fixed inset-0 z-50">
            <VideoCall
              chatId={currentChat.id}
              userId={currentUser.uid}
              peerId={currentChat.participants.find(id => id !== currentUser.uid) || ''}
              onClose={() => setShowVideoCall(false)}
              isInitiator={true}
            />
          </div>
        )}
      </div>
      
      {/* User sidebar */}
      <div className="h-full border-l border-gray-200 bg-gray-50 overflow-y-auto md:hidden lg:block">
        <UserSidebar />
      </div>
    </div>
  );
}