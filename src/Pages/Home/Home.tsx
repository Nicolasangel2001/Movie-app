import React, { useEffect, useState } from 'react';
import { fetchPopularMovies } from '../../API/tmdbApi';
import Banner from '../../Componentes/Banner/Banner';
import MovieCard from '../../Componentes/Moviecard/Moviecard';
import Spinner from '../../Componentes/Spinner/Spinner';
import NotFound from '../../Pages/NotFound/NotFound';
import './Home.css';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

interface HomeProps {
  setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const Home: React.FC<HomeProps> = ({ setFilteredMovies, setSearchTerm }) => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [filteredMovies, setLocalFilteredMovies] = useState<Movie[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setLocalSearchTerm] = useState<string>(''); 

  // Fetch popular movies when component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await fetchPopularMovies();
        setPopularMovies(movies);
        setLocalFilteredMovies(movies);
        setFilteredMovies(movies); 
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('No se pudieron cargar las películas.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [setFilteredMovies]);

  // Maneja el cambio de término de búsqueda y filtra las películas
  const handleSearchTermChange = (term: string) => {
    setLocalSearchTerm(term); // Actualizar el término de búsqueda local
    setSearchTerm(term); // Actualizar el término de búsqueda global

  
    const filtered = popularMovies.filter(movie =>
      movie.title.toLowerCase().includes(term.toLowerCase())
    );
    setLocalFilteredMovies(filtered); // Actualizar las películas filtradas localmente
    setFilteredMovies(filtered); // Actualizar el estado global de las películas filtradas
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      
      <Banner 
        movies={popularMovies} 
        searchTerm={searchTerm} 
        setSearchTerm={handleSearchTermChange} 
      />
      
     
      <h2>{searchTerm ? `Resultados para "${searchTerm}"` : 'Películas Populares'}</h2>
      <div className="movie-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <NotFound searchTerm={searchTerm} />
        )}
      </div>
    </div>
  );
};

export default Home;
