// components/MessageInput.tsx
import React, { useState, FormEvent } from 'react';
import { sendMessage } from '../services/chatService';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  chatId: string;
  currentUserId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, chatId, currentUserId }) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chatId || !currentUserId) return;
    
    try {
      setIsSending(true);
      
      // Send message using the chat service
      const sentMessage = await sendMessage({
        chatId,
        content: newMessage,
        senderId: currentUserId,
        type: 'text'
      });
      
      console.log('Message sent successfully:', sentMessage);
      
      // Call the parent component's onSendMessage callback
      onSendMessage(newMessage);
      
      // Clear the input field
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-gray-300 p-3 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center">
        <button type="button" className="p-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button type="button" className="p-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter message"
          className="flex-1 mx-3 py-2 px-4 bg-gray-200 rounded-full focus:outline-none text-black"
          disabled={isSending}
        />
        <button 
          type="submit" 
          className={`p-2 rounded-full ${isSending ? 'text-gray-400' : 'text-blue-500 hover:text-blue-600'}`}
          disabled={isSending || !newMessage.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;