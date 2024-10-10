import axios from 'axios';

// Definir el tipo Movie
export interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  vote_average: number; // Calificación
  overview: string; // Descripción
  genres: { id: number; name: string }[]; // Lista de géneros
  runtime: number; // Duración en minutos
}

// Definir el tipo Actor para los créditos
export interface Actor {
  id: number;
  name: string;
  profile_path: string; // Imagen del actor
  character: string; // Personaje que interpreta
}

// URL base y clave API desde el archivo .env
const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'a04c62620dd07531dc22304fa49a9a09';

// Función para obtener películas populares
export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const url = `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const response = await axios.get(url);
    return response.data.results; // Devolver la lista de películas populares
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return []; // Devuelve un array vacío en caso de error
  }
};

// Función para obtener detalles de una película por ID, incluyendo géneros y duración
export const fetchMovieDetails = async (id: string): Promise<Movie> => {
  const url = `${API_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`;

  try {
    const response = await axios.get(url);
    const movieData = response.data;

    // Retornar los detalles de la película con géneros y duración
    return {
      id: movieData.id,
      title: movieData.title,
      backdrop_path: movieData.backdrop_path || '', // Asegúrate de que sea una cadena vacía si no está disponible
      vote_average: movieData.vote_average,
      overview: movieData.overview,
      genres: movieData.genres || [], // Asegúrate de que sea un array vacío si no hay géneros
      runtime: movieData.runtime || 0, // Establecer un valor predeterminado
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Función para obtener los actores de una película por ID
export const fetchMovieCredits = async (id: string): Promise<Actor[]> => {
  const url = `${API_URL}/movie/${id}/credits?api_key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data.cast; // Devuelve la lista de actores
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return []; // Devuelve un array vacío en caso de error
  }
};
