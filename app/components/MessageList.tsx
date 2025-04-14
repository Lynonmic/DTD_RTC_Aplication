// components/MessageList.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Message, ChatMessage } from '../type/index';
import { getChatMessages, markMessagesAsRead } from '../services/chatService';
import '../styles/scrollbar.css';

interface MessageListProps {
  chatId: string;
  currentUserId: string;
  initialMessages?: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ chatId, currentUserId, initialMessages = [] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Set up polling for messages when chatId changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatMessages = await getChatMessages(chatId);
        const formattedMessages: Message[] = chatMessages.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.senderId,
          timestamp: new Date(msg.timestamp)
        }));
        
        // Check if we should auto-scroll based on current scroll position
        const shouldAutoScroll = isInitialLoad || isNearBottom();
        
        setMessages(formattedMessages);
        
        if (shouldAutoScroll) {
          setTimeout(scrollToBottom, 100);
        }
        
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        // Mark messages as read after fetching
        try {
          await markMessagesAsRead(chatId, currentUserId);
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };

    if (chatId && currentUserId) {
      setIsInitialLoad(true); // Reset for new chat
      fetchMessages();
      
      // Set up polling interval (every 3 seconds)
      const pollInterval = setInterval(fetchMessages, 3000);
      
      // Clean up interval when component unmounts or chatId changes
      return () => {
        clearInterval(pollInterval);
      };
    }
  }, [chatId, currentUserId]);
  
  // Scroll to bottom on initial mount
  useEffect(() => {
    if (initialMessages.length > 0) {
      scrollToBottom();
    }
  }, []);
  
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

  return (
    <div className="h-full p-4 bg-white overflow-hidden flex flex-col" style={{ height: '100%' }}>
      {messages.length > 0 ? (
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar pb-2"
          style={{ height: 'calc(100% - 16px)', maxHeight: 'calc(100vh - 180px)' }}
        >
          <div className="space-y-4">
            {messages.map((msg) => {
              const isCurrentUser = msg.sender === currentUserId;
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-lg lg:max-w-xl rounded-lg px-4 py-2 ${
                      isCurrentUser 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-200 text-black rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div 
                      className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {msg.timestamp && formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Start a conversation
        </div>
      )}
    </div>
  );
};

export default MessageList;