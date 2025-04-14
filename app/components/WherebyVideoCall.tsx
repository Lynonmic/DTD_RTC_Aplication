'use client';
import React, { useEffect, useState } from 'react';
import { endVideoCallRoom } from '../services/videoCallService';

interface WherebyVideoCallProps {
  roomUrl: string;
  messageId: string;
  chatId: string;
  onClose: () => void;
  userName: string;
}

const WherebyVideoCall: React.FC<WherebyVideoCallProps> = ({ 
  roomUrl, 
  messageId, 
  chatId, 
  onClose, 
  userName 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Format URL to include display name to bypass name entry
  const getEnhancedUrl = (url: string, name: string) => {
    if (!url) return '';

    // URL encode the user's name
    const encodedName = encodeURIComponent(name || 'Guest');

    // Check if URL already has query parameters
    const separator = url.includes('?') ? '&' : '?';

    // Add displayName parameter to bypass name entry
    return `${url}${separator}displayName=${encodedName}&skipMediaPermissionPrompt=true`;
  };

  useEffect(() => {
    // Set a short timeout to let the iframe load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [roomUrl]);

  const handleEndCall = async () => {
    try {
      if (messageId && chatId) {
        console.log('Ending call on server...');
        await endVideoCallRoom({
          chatId,
          messageId
        });
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error ending call:', error);
      if (onClose) onClose();
    }
  };

  // Validate URL
  if (!roomUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h5 className="text-lg font-semibold">Video Call Error</h5>
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Missing room URL. Cannot join call.
            </div>
          </div>
          <div className="flex justify-end p-4 border-t">
            <button 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced URL with user name parameter
  const enhancedUrl = getEnhancedUrl(roomUrl, userName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={handleEndCall}></div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl h-[80vh] z-10 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="text-lg font-semibold">Video Call</h5>
          <button 
            type="button" 
            className="text-gray-500 hover:text-gray-700"
            onClick={handleEndCall}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Connecting to call...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
              <button 
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={handleEndCall}
              >
                Close
              </button>
            </div>
          )}

          <iframe
            src={enhancedUrl}
            allow="camera; microphone; fullscreen; speaker; display-capture"
            className="w-full h-full border-0"
            title="Whereby Video Call"
          ></iframe>
        </div>

        <div className="p-4 border-t flex justify-center">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full flex items-center"
            onClick={handleEndCall}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
            End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default WherebyVideoCall;
