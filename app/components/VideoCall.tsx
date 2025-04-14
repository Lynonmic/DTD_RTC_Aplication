'use client';
import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { createVideoCallRoom, endVideoCallRoom } from '../services/videoCallService';

interface VideoCallProps {
  chatId: string;
  userId: string;
  peerId: string;
  onClose: () => void;
  isInitiator?: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({ 
  chatId, 
  userId, 
  peerId, 
  onClose,
  isInitiator = false 
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callerSignal, setCallerSignal] = useState<any>(null);
  const [callerId, setCallerId] = useState("");
  const [callError, setCallError] = useState<string | null>(null);

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    // Get media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        // If we're the initiator, start the call
        if (isInitiator) {
          startCall();
        }
      })
      .catch(error => {
        console.error("Error accessing media devices:", error);
        setCallError("Could not access camera or microphone. Please check your permissions.");
      });

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    };
  }, []);

  const startCall = async () => {
    if (!stream) return;

    try {
      // Create a video call room in the backend
      const callRoom = await createVideoCallRoom({
        chatId: chatId,
        senderId: userId
      });
      
      console.log('Video call room created:', callRoom);
      
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream
      });

      peer.on('signal', (data: any) => {
        // Here you would send the signal data to the other peer
        // For example, using a real-time database or WebSocket
        console.log("Sending signal to peer:", peerId);
        console.log("Signal data:", data);
        
        // In a real implementation, you would send this data to your backend
        // which would then forward it to the other peer
      });

      peer.on('stream', (currentStream: MediaStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      });

      peer.on('error', (err: Error) => {
        console.error("Peer connection error:", err);
        setCallError(`Connection error: ${err.message}`);
      });

      connectionRef.current = peer;
    } catch (error) {
      console.error('Failed to create video call room:', error);
      setCallError('Failed to start call. Please try again.');
    }
  };

  const answerCall = () => {
    if (!stream || !callerSignal) return;

    setCallAccepted(true);
    
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data: any) => {
      // Here you would send the answer signal back to the caller
      console.log("Sending answer signal to caller:", callerId);
      console.log("Answer signal data:", data);
      
      // In a real implementation, you would send this data to your backend
    });

    peer.on('stream', (currentStream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const endCall = async () => {
    setCallEnded(true);
    
    try {
      // Notify the backend that the call has ended
      await endVideoCallRoom({
        chatId: chatId,
        messageId: '' // You might need to track the messageId from when the call was created
      });
      
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    } catch (error) {
      console.error('Error ending call:', error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Video Call</h2>
          <button 
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            End Call
          </button>
        </div>
        
        {callError && (
          <div className="p-4 bg-red-100 text-red-700 text-center">
            {callError}
          </div>
        )}
        
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="relative">
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="rounded-lg w-full h-auto bg-gray-900"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              You
            </div>
          </div>
          
          <div className="relative">
            {callAccepted && !callEnded ? (
              <>
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  className="rounded-lg w-full h-auto bg-gray-900"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  {peerId}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
                <div className="text-white text-center">
                  {isInitiator ? (
                    <div>
                      <div className="animate-pulse text-xl mb-2">Calling...</div>
                      <div className="text-sm text-gray-400">Waiting for the other person to join</div>
                    </div>
                  ) : receivingCall && !callAccepted ? (
                    <div>
                      <div className="text-xl mb-4">Incoming call...</div>
                      <button 
                        onClick={answerCall} 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mr-2"
                      >
                        Answer
                      </button>
                      <button 
                        onClick={endCall}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      No one else has joined the call yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-gray-100 flex justify-center space-x-4">
          <button className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full" onClick={endCall}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
