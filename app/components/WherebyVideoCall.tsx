import React, { useEffect, useState } from 'react';
import { endVideoCallRoom } from '../services/videoCallService';
import './WherebyVideoCall.css';

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
      <div className="video-call-popup">
        <div className="video-call-overlay" onClick={onClose}></div>
        <div className="video-call-container">
          <div className="video-call-header">
            <h5>Video Call Error</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="video-call-body">
            <div className="error-message">
              <div className="alert alert-danger">
                Missing room URL. Cannot join call.
              </div>
            </div>
          </div>
          <div className="video-call-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced URL with user name parameter
  const enhancedUrl = getEnhancedUrl(roomUrl, userName);

  return (
    <div className="video-call-popup">
      <div className="video-call-overlay" onClick={handleEndCall}></div>
      <div className="video-call-container">
        <div className="video-call-header">
          <h5>Video Call</h5>
          <button type="button" className="btn-close" onClick={handleEndCall}></button>
        </div>

        <div className="video-call-body">
          {loading && (
            <div className="loading-indicator">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Connecting to call...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <div className="alert alert-danger">{error}</div>
              <button className="btn btn-secondary" onClick={handleEndCall}>Close</button>
            </div>
          )}

          <iframe
            src={enhancedUrl}
            allow="camera; microphone; fullscreen; speaker; display-capture"
            className="whereby-iframe"
            title="Whereby Video Call"
          ></iframe>
        </div>

        <div className="video-call-footer">
          <button
            className="btn btn-danger"
            onClick={handleEndCall}
          >
            <i className="bi bi-telephone-x"></i> End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default WherebyVideoCall;
