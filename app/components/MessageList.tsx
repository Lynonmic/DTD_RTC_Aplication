// components/MessageList.tsx
import React from 'react';
import { Message } from '../type/index';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white">
      {messages.length > 0 ? (
        messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            <div className="flex items-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                {msg.sender.charAt(0)}
              </div>
            </div>
            <div className="inline-block bg-gray-200 rounded-lg px-4 py-2 max-w-xs sm:max-w-md">
              {msg.text}
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Start a conversation
        </div>
      )}
    </div>
  );
};

export default MessageList;