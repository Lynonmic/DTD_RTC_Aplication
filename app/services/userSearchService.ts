import api from './apiService';
import { User } from '../type';

/**
 * Search for users by name or email
 * @param query The search query
 * @returns Promise with an array of users matching the search query
 */
export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    // Get the current user ID from localStorage
    const userInfo = localStorage.getItem('user_info');
    const currentUserId = userInfo ? JSON.parse(userInfo).uid : null;
    
    // Make API call to search users
    const response = await api.get('/users/search', {
      params: {
        query,
        currentUserId,
        limit: 20
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param userId The user ID to fetch
 * @returns Promise with the user data
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
