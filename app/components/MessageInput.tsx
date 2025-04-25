// components/MessageInput.tsx
import React, { useState, FormEvent, useRef } from 'react';
import { sendMessage, uploadMedia, createPrivateChat, getAllChats } from '../services/chatService';
import { FaSmile, FaPaperclip, FaPaperPlane, FaTimes } from 'react-icons/fa';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  chatId: string;
  currentUserId: string;
  friendId?: string; // Optional friendId for creating a new chat
  onChatCreated?: (chatId: string) => void; // Callback when a chat is created
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, chatId, currentUserId, friendId, onChatCreated }) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !currentUserId) return;
    
    try {
      setIsSending(true);
      
      // Initialize activeChatId with the current chatId
      let activeChatId = chatId;
      
      // Step 1: Create private chat if needed
      if ((!activeChatId || activeChatId === '') && friendId) {
        console.log('Step 1: Creating private chat with friend:', friendId);
        try {
          // Create a private chat with the friend
          const newChat = await createPrivateChat(currentUserId, friendId);
          console.log('Step 1 Complete: Private chat created:', newChat);
          
          // Update the active chat ID
          activeChatId = newChat.id;
          
          // Notify parent component about the new chat
          if (onChatCreated) {
            onChatCreated(activeChatId);
          }
        } catch (chatError) {
          console.error('Error in Step 1 - creating private chat:', chatError);
          alert('Failed to create chat. Please try again.');
          setIsSending(false);
          return;
        }
      } else {
        console.log('Step 1: Using existing chat:', activeChatId);
      }
      
      // Step 2: Refresh chats list
      if (friendId) {
        console.log('Step 2: Refreshing all chats');
        try {
          // Get all chats to refresh the list
          const chats = await getAllChats(currentUserId);
          console.log('Step 2 Complete: Chats refreshed, found', chats.length, 'chats');
        } catch (error) {
          console.error('Error in Step 2 - refreshing chats:', error);
          // Continue anyway since we already have the chat ID
        }
      } else {
        console.log('Step 2: Skipping chat refresh - no friendId provided');
      }
      
      // Step 3: Send the message via parent component
      console.log('Step 3: Sending message to chat:', activeChatId);
      
      if (selectedFile) {
        // Upload media file
        const uploadedMedia = await uploadMedia(activeChatId, currentUserId, selectedFile);
        console.log('Step 3 Complete: Media uploaded successfully:', uploadedMedia);
        
        // Call the parent component's onSendMessage callback
        // The parent will handle the actual message sending
        onSendMessage(uploadedMedia.content || 'Image sent');
        
        // Clear the file selection
        handleClearFile();
      } else {
        // Call the parent component's onSendMessage callback
        // The parent will handle the actual message sending
        onSendMessage(newMessage);
        
        console.log('Step 3 Complete: Message passed to parent component');
      }
      
      // Clear the input field
      setNewMessage('');
    } catch (error) {
      console.error('Error in message sending sequence:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-gray-200 p-3 bg-white">
      {filePreview && (
        <div className="mb-3 relative">
          <div className="relative inline-block">
            <img 
              src={filePreview} 
              alt="Selected file preview" 
              className="h-20 rounded-md object-cover" 
            />
            <button 
              type="button" 
              onClick={handleClearFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <FaTimes className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        <button 
          type="button" 
          onClick={handleUploadClick}
          className="p-2 text-gray-500 hover:text-purple-500 transition-colors"
        >
          <FaPaperclip className="h-5 w-5" />
        </button>
        <div className="relative flex-1 mx-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter message"
            className="w-full py-2 pl-4 pr-10 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-400 text-black"
            disabled={isSending}
          />
          <button 
            type="button" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-500 transition-colors"
          >
            <FaSmile className="h-5 w-5" />
          </button>
        </div>
        <button 
          type="submit" 
          className={`p-2 rounded-full ${isSending ? 'text-gray-400' : 'text-purple-500 hover:text-purple-600'} transition-colors`}
          disabled={isSending || (!newMessage.trim() && !selectedFile)}
        >
          <FaPaperPlane className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;