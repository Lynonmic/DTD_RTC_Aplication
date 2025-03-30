// components/MenuOptions.tsx
import React from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface MenuOptionsProps {
  customItems?: MenuItem[];
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ customItems }) => {
  // Default menu items
  const defaultItems: MenuItem[] = [
    { id: 'color', label: 'Change color', onClick: () => console.log('Change color clicked') },
    { id: 'emoji', label: 'Change Emoji', onClick: () => console.log('Change emoji clicked') },
    { 
      id: 'links', 
      label: 'Links', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 010-5.656l4-4a4 4 0 015.656 5.656l-1.1 1.1" />
        </svg>
      ),
      onClick: () => console.log('Links clicked')
    },
    { id: 'images', label: 'Shared Images', onClick: () => console.log('Shared images clicked') },
  ];

  // Use custom items if provided, otherwise use defaults
  const menuItems = customItems || defaultItems;

  return (
    <div className="flex-1">
      <ul>
        {menuItems.map((item) => (
          <li 
            key={item.id}
            className="px-4 py-3 hover:bg-purple-300 cursor-pointer flex justify-between items-center"
            onClick={item.onClick}
          >
            <span>{item.label}</span>
            {item.icon && item.icon}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuOptions;