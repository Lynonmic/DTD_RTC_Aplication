import api from './apiService';
import { User } from '../type';

export interface Friend {
  id: string;
  email: string | null;
  displayName: string;
  photoURL: string | null;
  status: boolean;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createAt: any;
  sender: {
    uid: string;
    displayName: string;
    photoURL: string | null;
  };
}

/**
 * Get all friends of the current user
 * @returns Promise with an array of friends
 */
export const getAllFriends = async (): Promise<Friend[]> => {
  try {
    const response = await api.get('/friends/friendlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
};

/**
 * Get all friend requests for the current user
 * @returns Promise with an array of friend requests
 */
export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    const response = await api.get('/friends/all-requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    throw error;
  }
};

/**
 * Send a friend request to another user
 * @param receiverId The ID of the user to send the request to
 * @returns Promise with the request ID
 */
export const sendFriendRequest = async (receiverId: string): Promise<{ requestId: string }> => {
  try {
    const response = await api.post('/friends/request', { receiverId });
    return response.data;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

/**
 * Accept a friend request
 * @param requestId The ID of the friend request to accept
 * @returns Promise with success message
 */
export const acceptFriendRequest = async (requestId: string): Promise<{ message: string }> => {
  try {
    const response = await api.post(`/friends/accept/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

/**
 * Reject a friend request
 * @param requestId The ID of the friend request to reject
 * @returns Promise with success message
 */
export const rejectFriendRequest = async (requestId: string): Promise<{ message: string }> => {
  try {
    const response = await api.post(`/friends/reject/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

/**
 * Remove a friend
 * @param friendId The ID of the friend to remove
 * @returns Promise with success message
 */
export const removeFriend = async (friendId: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/friends/unfriend/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};
