"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../components/auth/AuthForm';
import { login, register, loginWithGoogle, loginWithFacebook } from '../../services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      router.push('/pages/Chat');
    }
  }, [router]);

  const handleAuthentication = async (email: string, password: string, isSignUp: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      let user;
      
      if (isSignUp) {
        // For signup, we'll use a default display name based on the email
        const displayName = email.split('@')[0];
        user = await register(email, password, displayName);
      } else {
        user = await login(email, password);
      }
      
      // The auth service already stores the token in localStorage as 'authToken'
      if (user) {
        // Store additional user info in localStorage for easy access
        localStorage.setItem('user_info', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          photoURL: user.photoURL || '/profile-placeholder.jpg'
        }));
        
        // Navigate to the chat page
        router.push('/pages/Chat');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError(null);
    
    try {
      let user;
      
      if (provider === 'google') {
        user = await loginWithGoogle();
      } else if (provider === 'facebook') {
        user = await loginWithFacebook();
      }
      
      if (user) {
        // Navigate to the chat page after successful authentication
        // The token is already stored in localStorage by the auth service
        router.push('/pages/Chat');
      }
    } catch (err: any) {
      console.error(`${provider} authentication error:`, err);
      setError(err.message || `An error occurred during ${provider} authentication`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Authenticating...</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <AuthForm 
            onAuthenticate={handleAuthentication}
            onSocialAuth={handleSocialAuth}
          />
        </div>
      )}
    </div>
  );
}
