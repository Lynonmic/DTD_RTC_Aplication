export interface Message {
  id: number | string;
  text: string;
  sender: string;
  timestamp?: Date;
  type?: string; // 'text', 'image', 'video-call', etc.
  status?: 'active' | 'ended'; // Status for video calls
  roomUrl?: string; // Đường dẫn trực tiếp đến phòng gọi video
  videoCallData?: {
    roomUrl: string;
    messageId: string;
    chatId: string;
  };
  fileURL?: string;
}

export interface User {
  id?: string;
  uid?: string;
  username?: string;
  displayName?: string;
  email?: string;
  avatarSrc?: string;
  photoURL?: string;
  status?: boolean;
  bio?: string;
  createAt?: string;
}

export interface Chat {
  id: string;
  name?: string;
  photoURL?: string;
  type: string;
  participants: string[];
  participantDetails?: Array<{
    id: string;
    name: string;
    avatarSrc: string;
  }>;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
  lastMessageSenderId?: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  messageId?: string; // Added for API response compatibility
  chatId: string;
  content: string;
  senderId: string;
  timestamp: any; // Firebase timestamp or Date
  type: string;
  status?: 'active' | 'ended'; // Status for video calls
  videoCallData?: {
    roomUrl: string;
    messageId: string;
    chatId: string;
  };
  fileURL?: string;
  readBy?: string[];
  read?: boolean;
}