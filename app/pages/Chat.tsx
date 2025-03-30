import React from 'react';
import Header from '../components/Header';
import ChatArea from '../components/ChatArea';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/UserSidebar';

const Home: React.FC = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Header />
                <ChatArea />
                <MessageInput />
            </div>
        </div>
    );
};

export default Home; 