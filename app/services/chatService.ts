import api from './apiService';
import { Chat, ChatMessage, Message } from '../type';

// Utility function to generate a random color avatar when image loading fails
const generateRandomColorAvatar = (identifier: string, size = 200): string => {
  // Create a hash from the identifier string
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate a vibrant color using HSL
  const hue = Math.abs(hash % 360);
  const saturation = 70 + Math.abs((hash >> 8) % 30);
  const lightness = 45 + Math.abs((hash >> 16) % 20);
  
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const initial = identifier.charAt(0).toUpperCase();
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" dy=".35em" font-family="Arial, sans-serif" font-size="${size/2}px" fill="white" text-anchor="middle">${initial}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// Get all chats for a user
export const getAllChats = async (uid: string): Promise<Chat[]> => {
  try {
    const response = await api.get(`/chats/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error getting chats:', error);
    return [];
  }
};

// Get messages for a specific chat
export const getChatMessages = async (
  chatId: string, 
  limit: number = 10,
  lastMessageId?: string
): Promise<ChatMessage[]> => {
  try {
    const response = await api.get(`/chats/messages/${chatId}/${limit}`);
    return [...response.data].reverse();
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

// Create a new private chat
export const createPrivateChat = async (uid: string, friendId: string): Promise<Chat> => {
  try {
    const response = await api.post('/chats/private', { uid, friendId });
    return response.data;
  } catch (error) {
    console.error('Error creating private chat:', error);
    throw error;
  }
};

// Create a new group chat
export const createGroupChat = async (chatData: any): Promise<Chat> => {
  try {
    const response = await api.post('/chats/group', chatData);
    return response.data;
  } catch (error) {
    console.error('Error creating group chat:', error);
    throw error;
  }
};

// Send a new message
export const sendMessage = async (messageData: any): Promise<ChatMessage> => {
  try {
    const response = await api.post('/chats/send', messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (chatId: string, userId: string): Promise<any> => {
  try {
    const response = await api.put(`/chats/read/${chatId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Get all users (for creating new chats)
export const getAllUsers = async (): Promise<any[]> => {
  try {
    const response = await api.get('/friends/friendlist');
    
    // Add fallback avatars for users without profile images
    return response.data.map((user: any) => {
      if (!user.avatarSrc && !user.photoURL) {
        const identifier = user.displayName || user.username || user.uid || user.id || 'User';
        user.avatarSrc = generateRandomColorAvatar(identifier);
        user.photoURL = user.avatarSrc;
      }
      return user;
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Upload media
export const uploadMedia = async (chatId: string, senderId: string, file: File): Promise<any> => {
  try {
    // Create form data to send the file
    const formData = new FormData();
    formData.append('media', file);
    formData.append('chatId', chatId);
    formData.append('senderId', senderId);

    // Determine file type (image or video)
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    formData.append('type', fileType);

    // Set content to filename if it's a reasonable length, otherwise use generic label
    const content = file.name.length < 30 ? file.name : `${fileType === 'image' ? 'Image' : 'Video'} file`;
    formData.append('content', content);

    const response = await api.post('/chats/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};
