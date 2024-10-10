import React, { useEffect, useState } from 'react';
import { fetchPopularMovies, Movie } from '../../API/tmdbApi';
import { useNavigate } from 'react-router-dom';
import './Movies.css';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const popularMovies = await fetchPopularMovies();
        setMovies(popularMovies);
        setLoading(false);
      } catch (error) {
        console.error('Error loading popular movies:', error);
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handleMovieClick = (id: number) => {
    navigate(`/movie/${id}`); 
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="movies-grid">
      {movies.map(movie => (
        <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie.id)}> {/* Manejador de clics */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={movie.title}
            className="movie-image"
          />
          <h3>{movie.title}</h3>
          <p>Rating: {movie.vote_average}/10</p>
          <p>{movie.overview}</p>
        </div>
      ))}
    </div>
  );
};

export default Movies;



