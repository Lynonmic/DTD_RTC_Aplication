'use client'
/*import React, { useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import ChatHeader from './components/chatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import UserSidebar from './components/UserSidebar';
import { Message } from './type/index';

interface ChatProps {
  initialMessages: Message[];
}

export default function Chat({ initialMessages = [] }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const handleSendMessage = (newMessage: string): void => {
    if (newMessage.trim()) {
      setMessages([...messages, { 
        id: Date.now(), 
        text: newMessage, 
        sender: 'Trường',
        timestamp: new Date()
      }]);
    }
  };

  const toggleSidebar = (): void => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Head>
        <title>Chat Application</title>
        <meta name="description" content="Chat application interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      }
      <div className="flex flex-col flex-1 border-r border-gray-300">
        <ChatHeader 
          username="Trường" 
          avatarSrc="/avatar-placeholder.jpg" 
          onInfoClick={toggleSidebar} 
        />
        <MessageList messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>

     
      {showSidebar && <UserSidebar />}
    </div>
  );
}*/

// pages/auth.tsx
import { NextPage } from 'next';
import Head from 'next/head';
import AuthForm from './components/auth/AuthForm';

const AuthPage: NextPage = () => {
  // Handle authentication
  const handleAuthenticate = (email: string, password: string, isSignUp: boolean) => {
    console.log(`${isSignUp ? 'Sign up' : 'Sign in'} with:`, { email, password });
    // Here you would typically call your authentication API
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Head>
        <title>{`Housy - ${true ? 'Sign Up' : 'Login'}`}</title>
        <meta name="description" content="Find your perfect apartment with Housy" />
      </Head>
      
      <AuthForm onAuthenticate={handleAuthenticate} />
    </div>
  );
};

export default AuthPage;

/*export const getServerSideProps: GetServerSideProps = async () => {
  // In a real app, you would fetch messages from a database or API
  const initialMessages: Message[] = [
    { id: 1, text: 'Single line message', sender: 'Trường', timestamp: new Date() },
  ];

  return {
    props: {
      initialMessages: initialMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp ? msg.timestamp.toISOString() : null
      })),
    },
  };
};*/