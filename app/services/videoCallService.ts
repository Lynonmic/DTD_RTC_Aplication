import api from './apiService';

/**
 * Interface for video call room response
 */
export interface VideoCallRoom {
  roomUrl: string;
  messageId: string;
  chatId: string;
  createdAt: string;
  createdBy: string;
  status: 'active' | 'ended';
}

/**
 * Creates a new video call room using Whereby integration
 * @param data Object containing chatId and senderId
 * @returns Promise with the created video call data including Whereby room URL
 */
export const createVideoCallRoom = async (data: { chatId: string; senderId: string }): Promise<VideoCallRoom> => {
  try {
    // API path matches the routes defined in backend/src/routes/videoCallRoutes.js
    const response = await api.post('/video-call/create', {
      chatId: data.chatId,
      senderId: data.senderId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating video call room:', error);
    throw error;
  }
};

/**
 * Ends an active video call room
 * @param data Object containing chatId and messageId
 * @returns Promise with the result of ending the call
 */
export const endVideoCallRoom = async (data: { chatId: string; messageId: string }) => {
  try {
    // API path matches the routes defined in backend/src/routes/videoCallRoutes.js
    const response = await api.post('/video-call/end', {
      chatId: data.chatId,
      messageId: data.messageId
    });
    return response.data;
  } catch (error) {
    console.error('Error ending video call:', error);
    throw error;
  }
};

/**
 * Gets information about a video call
 * @param meetingId The ID of the meeting/call to get info for
 * @returns Promise with the video call information
 */
export const getVideoCallInfo = async (meetingId: string): Promise<VideoCallRoom> => {
  try {
    const response = await api.get(`/video-call/info/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting video call info:', error);
    throw error;
  }
};

/**
 * Joins an existing video call room
 * @param messageId The message ID associated with the call
 * @returns Promise with the video call room information
 */
export const joinVideoCallRoom = async (messageId: string): Promise<VideoCallRoom> => {
  try {
    const response = await api.post('/video-call/join', { messageId });
    return response.data;
  } catch (error) {
    console.error('Error joining video call room:', error);
    throw error;
  }
};
