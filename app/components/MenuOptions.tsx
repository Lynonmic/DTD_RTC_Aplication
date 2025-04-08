// components/MenuOptions.tsx
import React, { useState } from 'react';

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
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoverItem, setHoverItem] = useState<string | null>(null);

  // Default menu items
  const defaultItems: MenuItem[] = [
    { 
      id: 'color', 
      label: 'Change color', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      onClick: () => {
        console.log('Change color clicked');
        setActiveItem('color');
        // Implement color change functionality
      }
    },
    { 
      id: 'emoji', 
      label: 'Change Emoji', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => {
        console.log('Change emoji clicked');
        setActiveItem('emoji');
        // Implement emoji change functionality
      }
    },
    { 
      id: 'links', 
      label: 'Links', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 010-5.656l4-4a4 4 0 015.656 5.656l-1.1 1.1" />
        </svg>
      ),
      onClick: () => {
        console.log('Links clicked');
        setActiveItem('links');
        // Implement links functionality
      }
    },
    { 
      id: 'images', 
      label: 'Shared Images', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => {
        console.log('Shared images clicked');
        setActiveItem('images');
        // Implement shared images functionality
      }
    },
  ];

  // Use custom items if provided, otherwise use defaults
  const menuItems = customItems || defaultItems;

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setActiveItem(item.id);
  };

  return (
    <div className="flex-1 bg-white">
      <h3 className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">Options</h3>
      <ul className="divide-y divide-gray-100">
        {menuItems.map((item) => (
          <li 
            key={item.id}
            className={`
              px-4 py-3 flex justify-between items-center text-black
              transition-all duration-200 cursor-pointer
              ${activeItem === item.id ? 'bg-blue-50' : ''}
              ${hoverItem === item.id ? 'bg-gray-50' : ''}
            `}
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => setHoverItem(item.id)}
            onMouseLeave={() => setHoverItem(null)}
          >
            <div className="flex items-center">
              {item.icon && <span className="mr-3 text-gray-500">{item.icon}</span>}
              <span className={`${activeItem === item.id ? 'font-medium' : ''}`}>{item.label}</span>
            </div>
            {activeItem === item.id && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuOptions;