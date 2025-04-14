// LoginPage.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from './components/auth/AuthForm';
import { login, register, loginWithGoogle, loginWithFacebook } from './services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  // Add a ref to track if redirect has been attempted
  const redirectAttempted = useRef(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // Skip if we've already tried redirecting
        if (redirectAttempted.current) {
          setIsCheckingAuth(false);
          return;
        }

        // Set a flag in session storage to prevent redirect loops
        if (sessionStorage.getItem('redirecting_to_chat')) {
          // We're in a redirect loop, clear it and don't redirect
          sessionStorage.removeItem('redirecting_to_chat');
          setIsCheckingAuth(false);
          return;
        }

        const token = localStorage.getItem('authToken');
        
        // Only redirect if we have a valid token
        if (token) {
          console.log('User is authenticated, redirecting to Chat');
          redirectAttempted.current = true;
          
          // Set flag before redirecting
          sessionStorage.setItem('redirecting_to_chat', 'true');
          
          router.replace('/pages/Chat');
        } else {
          setIsCheckingAuth(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // If token validation fails, clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_info');
        setIsCheckingAuth(false);
      }
    };
    
    // Only run the check on the client side
    if (typeof window !== 'undefined') {
      // Clean up any lingering redirect flags
      if (!redirectAttempted.current) {
        sessionStorage.removeItem('redirecting_to_login');
      }
      checkAuth();
    } else {
      setIsCheckingAuth(false);
    }
    
    // Only run this effect once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          // Use a local placeholder image instead of a remote one that might 404
          photoURL: user.photoURL || '/images/default-avatar.png'
        }));
        
        // Set the redirect attempt flag
        redirectAttempted.current = true;
        // Set flag before redirecting
        sessionStorage.setItem('redirecting_to_chat', 'true');
        // Navigate to the chat page using replace to avoid history stacking
        router.replace('/pages/Chat');
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
        // Store user info in localStorage
        localStorage.setItem('user_info', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          // Use a local placeholder image instead of a remote one that might 404
          photoURL: user.photoURL || '/images/default-avatar.png'
        }));
        
        // Set the redirect attempt flag
        redirectAttempted.current = true;
        // Set flag before redirecting
        sessionStorage.setItem('redirecting_to_chat', 'true');
        // Navigate to the chat page after successful authentication using replace
        router.replace('/pages/Chat');
      }
    } catch (err: any) {
      console.error(`${provider} authentication error:`, err);
      setError(err.message || `An error occurred during ${provider} authentication`);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

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
