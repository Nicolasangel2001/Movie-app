import React from 'react';
import './Moviecard.css'; 
import StarRatings from 'react-star-ratings';
import { useNavigate } from 'react-router-dom';



interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    backdrop_path?: string; 
    vote_average: number;
    overview: string;
    generes?: { id: number; name: string }[]; 
    runtime?: number;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  // Usa una imagen por defecto si backdrop_path es null o undefined
  const imgUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : 'default_image.jpg'; 

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <img src={imgUrl} alt={movie.title} className="movie-card__image" />
      <h3 className='titulo'>{movie.title}</h3>

     

      <div className='star-rating'>
        <StarRatings
          rating={movie.vote_average / 2} 
          starRatedColor="gold"
          numberOfStars={5}
          name="rating"
          starDimension="20px"
          starSpacing="5px"
        />
      </div>

    
      
     
    </div>
  );
};

export default MovieCard;

