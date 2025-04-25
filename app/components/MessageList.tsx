// components/MessageList.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Message, ChatMessage } from '../type/index';
import { getChatMessages } from '../services/chatService';
import { joinVideoCallRoom } from '../services/videoCallService';
import Image from 'next/image';
import '../styles/scrollbar.css';
import WherebyVideoCall from './WherebyVideoCall';
import { div } from 'framer-motion/client';

interface MessageListProps {
  chatId: string;
  currentUserId: string;
  initialMessages?: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ chatId, currentUserId, initialMessages = [] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [lastMessageId, setLastMessageId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [activeVideoCall, setActiveVideoCall] = useState<Message | null>(null);
  const [userName, setUserName] = useState<string>('User');
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check if user is near bottom of scroll to auto-scroll on new messages
  const isNearBottom = () => {
    if (!messageContainerRef.current) return true;
    
    const container = messageContainerRef.current;
    const threshold = 150; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };
  
  // Initialize with initialMessages when they change
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
      setIsInitialLoad(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [initialMessages]);

  // Set up polling for messages when chatId changes
  useEffect(() => {
    // Only keep the code for handling initialMessages and scrolling
    
    if (chatId && currentUserId) {
      // Reset state for new chat
      setIsInitialLoad(true);
      
      // No need to fetch messages as we're using initialMessages from parent
      // Just set up auto-scrolling when needed
      setTimeout(scrollToBottom, 100);
      
      // Clean up function for when component unmounts or chatId changes
      return () => {}; // No interval to clear anymore
    }
  }, [chatId, currentUserId]);
  
  // Handle loading more messages when scrolling to top
  const handleLoadMoreMessages = () => {
    // Since we're no longer handling message fetching in this component,
    // we should emit an event to the parent component to load more messages
    console.log('Load more messages requested, but functionality removed');
    // In a complete solution, you would add a prop like onLoadMoreMessages
    // and call it here to let the parent component load more messages
  };
  
  // Detect scroll to top to load more messages
  const handleScroll = () => {
    if (!messageContainerRef.current) return;
    
    const { scrollTop } = messageContainerRef.current;
    
    // If scrolled near the top, load more messages
    if (scrollTop < 50 && !isLoading && hasMoreMessages) {
      handleLoadMoreMessages();
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: Date | string | null) => {
    if (!timestamp) return '';
    
    // Ensure we have a valid Date object
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if the date is valid before formatting
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp:', timestamp);
      return '';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Handle joining a video call
  const handleJoinVideoCall = async (message: Message) => {
    try {
      console.log('Attempting to join video call with message:', message);
      
      // Kiểm tra xem tin nhắn có roomUrl trực tiếp không (từ trường bổ sung)
      if ((message as any).roomUrl) {
        console.log('Found direct roomUrl in message:', (message as any).roomUrl);
        
        // Tạo videoCallData từ roomUrl trực tiếp
        const updatedMessage = {
          ...message,
          videoCallData: {
            roomUrl: (message as any).roomUrl,
            messageId: message.id.toString(),
            chatId: chatId
          }
        };
        
        console.log('Setting active video call with direct roomUrl:', updatedMessage);
        setActiveVideoCall(updatedMessage);
        return;
      }
      
      // For messages without videoCallData, create a default one
      if (!message.videoCallData && message.type === 'video-call') {
        console.log('No videoCallData found, creating default one');
        
        try {
          // Try to join the call using the message ID
          const callData = await joinVideoCallRoom(message.id.toString());
          console.log('Received call data from API:', callData);
          
          // Update the message with the room URL
          const updatedMessage = {
            ...message,
            videoCallData: {
              roomUrl: callData.roomUrl,
              messageId: message.id.toString(),
              chatId: chatId
            }
          };
          
          console.log('Setting active video call with updated message:', updatedMessage);
          setActiveVideoCall(updatedMessage);
          return;
        } catch (error) {
          console.error('Error joining video call with message ID:', error);
          alert('Failed to join video call. Please try again.');
          return;
        }
      }
      
      console.log('Message has videoCallData:', message.videoCallData);
      
      // If the message already has a room URL, use it directly
      if (message.videoCallData?.roomUrl) {
        console.log('Using existing room URL from videoCallData:', message.videoCallData.roomUrl);
        setActiveVideoCall(message);
      } else if (message.videoCallData?.messageId) {
        // Otherwise, join the call via the API
        console.log('Joining call via API with messageId:', message.videoCallData.messageId);
        const callData = await joinVideoCallRoom(message.videoCallData.messageId);
        console.log('Received call data from API:', callData);
        
        // Update the message with the room URL
        const updatedMessage = {
          ...message,
          videoCallData: {
            ...message.videoCallData,
            roomUrl: callData.roomUrl
          }
        };
        
        console.log('Setting active video call with updated message:', updatedMessage);
        setActiveVideoCall(updatedMessage);
      } else {
        console.error('No valid videoCallData or messageId found');
        alert('Cannot join video call: missing required information');
      }
    } catch (error) {
      console.error('Error joining video call:', error);
      alert('Failed to join video call. Please try again.');
    }
  };
  
  // Close video call
  const handleCloseVideoCall = () => {
    setActiveVideoCall(null);
  };

  return (
    <div className="h-full p-2 bg-white overflow-hidden flex flex-col" style={{ height: '100%' }}>
      {/* Video call popup */}
      {activeVideoCall && activeVideoCall.videoCallData && (
        <WherebyVideoCall
          roomUrl={activeVideoCall.videoCallData.roomUrl}
          messageId={activeVideoCall.videoCallData.messageId}
          chatId={activeVideoCall.videoCallData.chatId}
          onClose={handleCloseVideoCall}
          userName={userName}
        />
      )}
      
      {isLoading && messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-xs">Loading messages...</p>
        </div>
      ) : messages.length > 0 ? (
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar pb-1"
          style={{ height: 'calc(100% - 8px)', maxHeight: 'calc(100vh - 180px)' }}
          onScroll={handleScroll}
        >
          {isLoading && hasMoreMessages && (
            <div className="text-center py-1">
              <p className="text-xs text-gray-500">Loading more messages...</p>
            </div>
          )}
          <div className="flex flex-col space-y-2">
            {messages.map((msg, index) => {
              const isCurrentUser = msg.sender === currentUserId;
              const showAvatar = index === 0 || 
                (messages[index - 1] && messages[index - 1].sender !== msg.sender);
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end w-full`}
                >
                  {!isCurrentUser && showAvatar && (
                    <div className="flex-shrink-0 mr-1.5">
                      <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium">
                        {msg.sender.charAt(0)}
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[75%] rounded-lg px-3 py-1.5 ${
                      isCurrentUser 
                        ? 'text-white rounded-br-none' 
                        : 'bg-gray-200 text-black rounded-bl-none'
                    }`}
                    style={isCurrentUser ? { backgroundColor: 'rgb(96, 181, 255)' } : {}}
                  >
                    {msg.type === 'video-call' || (msg.text === 'Video call' && msg.roomUrl) ? (
                      <div className="video-call-message">
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleJoinVideoCall(msg);
                        }}
                        className="text-sm text-blue-600 font-medium hover:underline"
                      >
                        Video call
                      </a>
                      <div 
                        className={`text-[10px] mt-0.5 ${
                          isCurrentUser ? 'text-white opacity-80' : 'text-gray-500'
                        }`}
                      >
                        {msg.timestamp && formatTime(msg.timestamp)}
                      </div>
                    </div>
                    ) : msg.type === 'image' && msg.fileURL ? (
                      <div>
                        <div className="image-container mb-1">
                          <img src={msg.roomUrl} alt="Shared image" className="rounded-lg max-w-full" />
                        </div>
                        <p className="text-xs">{msg.text}</p>
                        <div 
                          className={`text-[10px] mt-0.5 ${
                            isCurrentUser ? 'text-white opacity-80' : 'text-gray-500'
                          }`}
                        >
                          {msg.timestamp && formatTime(msg.timestamp)}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs">{msg.text}</p>
                        <div 
                          className={`text-[10px] mt-0.5 ${
                            isCurrentUser ? 'text-white opacity-80' : 'text-gray-500'
                          }`}
                        >
                          {msg.timestamp && formatTime(msg.timestamp)}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {isCurrentUser && showAvatar && (
                    <div className="flex-shrink-0 ml-1.5">
                      <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium">
                        {msg.sender.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p className="text-xs">Start a conversation</p>
        </div>
      )}
    </div>
  );
};

export default MessageList;