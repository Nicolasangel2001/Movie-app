import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './Banner.css';
import StarRatings from 'react-star-ratings';
import { FaSearch } from 'react-icons/fa';
import SearchBar from '../SearchBar/SearchBar';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  vote_average: number; 
}

interface BannerProps {
  movies: Movie[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Banner: React.FC<BannerProps> = ({ movies, searchTerm, setSearchTerm }) => {
  const [searchInputVisible, setSearchInputVisible] = useState(false);

  const handleSearchClick = () => {
    setSearchInputVisible(!searchInputVisible); 
  };

  // Si no hay películas, muestra un mensaje
  if (!movies.length) {
    return <div className="no-movies">No hay películas próximas a estrenar.</div>;
  }

  return (
    <div className="banner-container">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2000, 
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="banner-slide">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="banner-image"
            />
            <div className="banner-content">
              <h2>{movie.title}</h2>
              <div className="custom-star-ratings">
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
            <FaSearch className="search-icon" onClick={handleSearchClick} />
            {searchInputVisible && (
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;


