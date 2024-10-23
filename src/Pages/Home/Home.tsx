import React, { useEffect, useState } from 'react';
import { fetchAllMovies, fetchUpcomingMovies } from '../../API/tmdbApi'; 
import Banner from '../../Componentes/Banner/Banner';
import MovieCard from '../../Componentes/Moviecard/Moviecard';
import Spinner from '../../Componentes/Spinner/Spinner';
import NotFound from '../../Pages/NotFound/NotFound';
import { useInView } from 'react-intersection-observer';
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
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMoviesState] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setLocalSearchTerm] = useState<string>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const movies = await fetchAllMovies(); 
        const upcoming = await fetchUpcomingMovies();
        
        setAllMovies(movies); 
        setUpcomingMovies(upcoming); 
        
        const popularMovies = movies.filter(movie => 
          !upcoming.some(upcomingMovie => upcomingMovie.id === movie.id)
        );
        
        setFilteredMoviesState(popularMovies);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('No se pudieron cargar las películas.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearchTermChange = (term: string) => {
    setLocalSearchTerm(term);
    setSearchTerm(term);

    if (term.trim() === '') {
      const popularMovies = allMovies.filter(movie => 
        !upcomingMovies.some(upcomingMovie => upcomingMovie.id === movie.id)
      );
      setFilteredMoviesState(popularMovies);
    } else {
      const filtered = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(term.toLowerCase()) &&
        !upcomingMovies.some(upcomingMovie => upcomingMovie.id === movie.id)
      );
      setFilteredMoviesState(filtered);
      setFilteredMovies(filtered);
      setPage(1);
    }
  };

  const { ref, inView } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && !loading && searchTerm.trim() === '') {
        fetchMoreMovies();
      }
    },
  });

  const fetchMoreMovies = async () => {
    setLoading(true);
    try {
      const newMovies = await fetchAllMovies(page);
      const uniqueMovies = newMovies.filter(movie => 
        !allMovies.some(existingMovie => existingMovie.id === movie.id) &&
        !upcomingMovies.some(upcomingMovie => upcomingMovie.id === movie.id)
      );

      setAllMovies(prev => [...prev, ...uniqueMovies]);
      setFilteredMoviesState(prev => [...prev, ...uniqueMovies]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error fetching more movies:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && filteredMovies.length === 0) {
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
        movies={upcomingMovies} 
        searchTerm={searchTerm}
        setSearchTerm={handleSearchTermChange}
      />
      
      <h2>{searchTerm ? `Resultados para "${searchTerm}"` : 'Peliculas Populares'}</h2>
      <div className="movie-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <NotFound searchTerm={searchTerm} />
        )}
      </div>

      {searchTerm.trim() === '' && <div ref={ref} style={{ height: '20px' }} />}
    </div>
  );
};

export default Home;
