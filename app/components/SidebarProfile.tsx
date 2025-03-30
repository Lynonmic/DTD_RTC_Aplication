// components/SidebarProfile.tsx
import React from 'react';
import Image from 'next/image';

interface SidebarProfileProps {
  name: string;
  avatarSrc: string;
}

const SidebarProfile: React.FC<SidebarProfileProps> = ({ name, avatarSrc }) => {
  return (
    <div className="p-4 flex flex-col items-center">
      <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
        <Image 
          src={avatarSrc}
          alt="Profile"
          width={64}
          height={64}
          className="object-cover"
        />
      </div>
      <h3 className="font-semibold text-lg">{name}</h3>
      <div className="flex mt-4 space-x-4">
        <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
        </button>
        <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SidebarProfile;