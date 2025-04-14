"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

interface UserProfile {
  uid: string;
  username: string;
  email: string;
  avatarSrc: string;
  bio: string;
  joinDate: Date;
  status: string;
  phoneNumber?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Initial user profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    uid: '',
    username: '',
    email: '',
    avatarSrc: '/profile-placeholder.jpg',
    bio: '',
    joinDate: new Date(),
    status: 'Online',
    phoneNumber: ''
  });

  // Form state for editing
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  // Mock function to fetch user profile data
  const fetchUserProfile = async () => {
    // In a real app, this would be an API call to your backend
    setLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data
      const userData: UserProfile = {
        uid: '3p4Hx4MlhPZ4EHdYaQ3tQ5mLANt2',
        username: 'Trần Cường',
        email: 'cuong.tran@example.com',
        avatarSrc: '/profile-placeholder.jpg',
        bio: 'Software developer passionate about creating amazing user experiences.',
        joinDate: new Date('2024-01-15'),
        status: 'Online',
        phoneNumber: '+84 123 456 789'
      };
      
      setUserProfile(userData);
      setFormData(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to your backend
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock user data
        const userData: UserProfile = {
          uid: '3p4Hx4MlhPZ4EHdYaQ3tQ5mLANt2',
          username: 'Trần Cường',
          email: 'cuong.tran@example.com',
          avatarSrc: '/profile-placeholder.jpg',
          bio: 'Software developer passionate about creating amazing user experiences.',
          joinDate: new Date('2024-01-15'),
          status: 'Online',
          phoneNumber: '+84 123 456 789'
        };
        
        setUserProfile(userData);
        setFormData(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the profile state with form data
      setUserProfile(formData);
      setIsEditing(false);
      setLoading(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
      alert('Failed to update profile. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="grid grid-cols-[auto_1fr] h-screen w-full overflow-hidden">
      {/* Left sidebar */}
      <div className="h-full bg-gray-100 overflow-y-auto">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col h-full overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with back button */}
          <div className="bg-blue-600 text-white p-4 flex items-center">
            <button 
              onClick={() => router.back()} 
              className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">User Profile</h1>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="ml-auto bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : isEditing ? (
            /* Edit Profile Form */
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200">
                    <Image 
                      src={formData.avatarSrc} 
                      alt="Profile" 
                      width={160} 
                      height={160} 
                      className="object-cover"
                    />
                  </div>
                  <button 
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => alert('Image upload functionality would go here')}
                  >
                    Change Profile Picture
                  </button>
                </div>
                
                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <input
                        type="text"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(userProfile);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* Profile Display */
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                    <Image 
                      src={userProfile.avatarSrc} 
                      alt="Profile" 
                      width={160} 
                      height={160} 
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {userProfile.status}
                  </span>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{userProfile.username}</h2>
                  <p className="text-gray-500 mb-4">Member since {formatDate(userProfile.joinDate)}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-gray-900">{userProfile.email}</p>
                    </div>
                    {userProfile.phoneNumber && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="mt-1 text-gray-900">{userProfile.phoneNumber}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                    <p className="text-gray-900 whitespace-pre-line">{userProfile.bio || 'No bio provided.'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Activity</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Last login</span>
                    <span className="text-gray-900">Today, 5:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Active sessions</span>
                    <span className="text-gray-900">2 devices</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Account security</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Secure
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
