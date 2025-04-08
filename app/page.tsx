'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // If token exists, redirect to Chat page
      router.push('/pages/Chat');
    } else {
      // If no token, redirect to Login page
      router.push('/pages/Login');
    }
    
    setLoading(false);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        {loading ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading...</p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
            <p>Please wait while we redirect you.</p>
            <div className="flex space-x-4 mt-4 justify-center">
              <button 
                onClick={() => router.push('/pages/Chat')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Go to Chat
              </button>
              <button 
                onClick={() => router.push('/pages/Login')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}