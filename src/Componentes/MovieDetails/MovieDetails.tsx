import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { fetchMovieDetails, fetchMovieCredits, Movie, Actor } from '../../API/tmdbApi';
import './MovieDetails.css';
import Spinner from '../../Componentes/Spinner/Spinner';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const movieData = await fetchMovieDetails(id!);
        setMovie(movieData);
      } catch (error) {
        console.error('Error loading movie details:', error);
      }
    };

    const loadMovieCredits = async () => {
      try {
        const creditsData = await fetchMovieCredits(id!);
        setActors(creditsData); 
      } catch (error) {
        console.error('Error loading movie credits:', error);
      }
    };

    loadMovieDetails();
    loadMovieCredits();
  }, [id]);

  if (!movie) {
    return <div className="loader-container"><Spinner /></div>;
  }

  return (
    <div className="container">
      <div className="movie-info">
        <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={movie.title} className="img-movie" />
        <div className="movie-details">
          <h1 className='movie-title'>{movie.title}</h1>
          <p>{movie.overview}</p>

      <p className='duration'><strong>Duration:</strong> {movie.runtime} minutes</p>

      
      <p className='genero'><strong>Generes:</strong> {movie.genres.map((genre) => genre.name).join(', ')}</p>
          
          <div className="custom-star-rating">
  <StarRatings
    rating={movie.vote_average / 2} // Divide entre 2 para adaptar a 5 estrellas
    starRatedColor="gold"
    numberOfStars={5}
    name="rating"
    starDimension="20px"
    starSpacing="5px"
  />
</div>
        </div>
      </div>

      <ActorBanner actors={actors} /> {}
    </div>
  );
};

// Componente para el Banner de Actores
const ActorBanner: React.FC<{ actors: Actor[] }> = ({ actors }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' }); 
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' }); 
    }
  };

  return (
    <div className="actor-banner">
      <h3>Casting:</h3>
      <div className="banner-container">
        <button className="scroll-button left" onClick={scrollLeft}>&lt;</button>
        <div className="actor-scroll" ref={scrollRef}>
          {actors.map((actor) => (
            <div key={actor.id} className="actor-card">
              <img
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'default_image.jpg'} 
                alt={actor.name}
                className="actor-image"
              />
              <div className="actor-info">
                <h4>{actor.name}</h4>
                <p>{actor.character}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>&gt;</button>
      </div>
    </div>
  );
};

export default MovieDetails;