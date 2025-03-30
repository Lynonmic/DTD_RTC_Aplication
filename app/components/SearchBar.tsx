// components/SearchBar.tsx
import React, { useState, ChangeEvent } from 'react';

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
    <div className="px-4 mb-4">
      <div className="relative">
        <input 
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search" 
          className="w-full pl-8 pr-4 py-2 rounded-md bg-white"
        />
        <div className="absolute left-2 top-2.5 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;