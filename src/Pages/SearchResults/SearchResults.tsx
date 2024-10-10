import React from 'react';
import MovieCard from '../../Componentes/Moviecard/Moviecard';
import { Movie } from '../../API/tmdbApi'; 
import './SearchResults.css';
import NotFound from '../../Pages/NotFound/NotFound';

interface SearchResultsProps {
  filteredMovies: Movie[];  
  searchTerm: string;       
}

const SearchResults: React.FC<SearchResultsProps> = ({ filteredMovies, searchTerm }) => {
  if (filteredMovies.length === 0) {
    return <NotFound searchTerm={searchTerm} />;  
  }

  return (
    <div>
      <h2>Resultados de la búsqueda: {searchTerm}</h2>
      <div className="movie-grid">
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};


export default SearchResults;