import axios from 'axios';


export interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  vote_average: number; 
  overview: string; 
  genres: { id: number; name: string }[]; 
  runtime: number; 
}


export interface Actor {
  id: number;
  name: string;
  profile_path: string; 
  character: string; 
}

const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;


export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const url = `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return []; 
  }
};


export const fetchNowPlayingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error; 
  }
};


export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  const url = `${API_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const response = await axios.get(url);
    return response.data.results; 
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return []; 
  }
};


export const fetchAllMovies = async (page = 1): Promise<Movie[]> => {
  const url = `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

  try {
    const response = await axios.get(url);
    return response.data.results; 
  } catch (error) {
    console.error('Error fetching all movies:', error);
    return []; 
  }
};


export const fetchMovieDetails = async (id: string): Promise<Movie> => {
  const url = `${API_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`;

  try {
    const response = await axios.get(url);
    const movieData = response.data;

    
    return {
      id: movieData.id,
      title: movieData.title,
      backdrop_path: movieData.backdrop_path || '', 
      vote_average: movieData.vote_average,
      overview: movieData.overview,
      genres: movieData.genres || [], 
      runtime: movieData.runtime || 0, 
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};


export const fetchMovieCredits = async (id: string): Promise<Actor[]> => {
  const url = `${API_URL}/movie/${id}/credits?api_key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data.cast; 
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return []; 
  }
};
