// components/SearchBar.tsx
import React, { useState, ChangeEvent } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  return (
    <div className="px-3 py-2 border-b border-gray-200 text-black">
      <div className="relative">
        <input 
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search" 
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm text-black"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
      </div>
    </div>
  );
};

export default SearchBar;