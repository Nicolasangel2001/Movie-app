import React from 'react';
import { FaSearch } from 'react-icons/fa'; 
import './SearchBar.css'; 

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void; 
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda
  };

  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Buscar películas..."
        value={searchTerm}
        onChange={handleChange} 
      />
    </div>
  );
};

export default SearchBar;