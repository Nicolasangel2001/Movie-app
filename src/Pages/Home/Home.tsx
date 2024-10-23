import React, { useEffect, useState } from 'react';
import { fetchAllMovies, fetchUpcomingMovies } from '../../API/tmdbApi'; 
import Banner from '../../Componentes/Banner/Banner';
import MovieCard from '../../Componentes/Moviecard/Moviecard';
import Spinner from '../../Componentes/Spinner/Spinner';
import NotFound from '../../Pages/NotFound/NotFound';
import { useInView } from 'react-intersection-observer'; // Para lazy loading
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
  const [page, setPage] = useState(1); // Para la paginación

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const movies = await fetchAllMovies(); // Obtener todas las películas
        const upcoming = await fetchUpcomingMovies();
        
        setAllMovies(movies); // Almacena todas las películas
        setUpcomingMovies(upcoming); // Almacena las próximas a estrenarse

        // Filtra las películas populares excluyendo las próximas a estrenarse
        const popularMovies = movies.filter(movie => 
          !upcoming.some(upcomingMovie => upcomingMovie.id === movie.id)
        );
        
        setFilteredMoviesState(popularMovies); // Inicialmente, se muestran las películas populares
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('No se pudieron cargar las películas.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Maneja el cambio de término de búsqueda y filtra las películas
  const handleSearchTermChange = (term: string) => {
    setLocalSearchTerm(term);
    setSearchTerm(term);

    if (term.trim() === '') {
      // Si no hay búsqueda, muestra las películas populares (sin las próximas a estrenar)
      const popularMovies = allMovies.filter(movie => 
        !upcomingMovies.some(upcomingMovie => upcomingMovie.id === movie.id)
      );
      setFilteredMoviesState(popularMovies);
    } else {
      const filtered = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(term.toLowerCase()) &&
        !upcomingMovies.some(upcomingMovie => upcomingMovie.id === movie.id) // Asegúrate de que no sea una película próxima
      );
      setFilteredMoviesState(filtered); // Actualiza las películas filtradas
      setFilteredMovies(filtered); // Asegúrate de que el estado global también se actualice
      setPage(1); // Resetea la página a 1 para evitar la carga de más películas
    }
  };

  // Cargar más películas si es necesario
  const { ref, inView } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && !loading && searchTerm.trim() === '') { // Solo carga más si no hay búsqueda
        fetchMoreMovies();
      }
    },
  });

  const fetchMoreMovies = async () => {
    setLoading(true); // Indica que se está cargando
    try {
      const newMovies = await fetchAllMovies(page);
      const uniqueMovies = newMovies.filter(movie => 
        !allMovies.some(existingMovie => existingMovie.id === movie.id) &&
        !upcomingMovies.some(upcomingMovie => upcomingMovie.id === movie.id) // Asegúrate de que no sea una película próxima
      );

      setAllMovies(prev => [...prev, ...uniqueMovies]);
      setFilteredMoviesState(prev => [...prev, ...uniqueMovies]);
      setPage(prev => prev + 1); // Incrementa la página después de cargar más
    } catch (err) {
      console.error('Error fetching more movies:', err);
    } finally {
      setLoading(false); // Restablece el estado de carga
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
        movies={upcomingMovies} // Pasamos las películas próximas al banner
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

      {/* Referencia para lazy loading solo si no hay búsqueda */}
      {searchTerm.trim() === '' && <div ref={ref} style={{ height: '20px' }} />}
    </div>
  );
};

export default Home;

