import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import SearchResults from './Pages/SearchResults/SearchResults';
import NotFound from './Pages/NotFound/NotFound';
import Movies from './Pages/Movies/Movies'; 
import MovieDetails from './Componentes/MovieDetails/MovieDetails';
import { Movie } from './API/tmdbApi'; // Asegúrate de importar el tipo Movie

const App: React.FC = () => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setFilteredMovies={setFilteredMovies} setSearchTerm={setSearchTerm} />} />
        <Route path="/movies/:id" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchResults filteredMovies={filteredMovies} searchTerm={searchTerm} />} />
        <Route path="*" element={<NotFound searchTerm={searchTerm} />} /> 
      </Routes>
    </Router>
  );
};

export default App;