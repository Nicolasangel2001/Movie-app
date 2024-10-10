import React from 'react';
import errorImage from '../../Image/error.png'; 
import './NotFound.css'; 

interface NoMoviesFoundProps {
  searchTerm: string;
}

const NotFound: React.FC<NoMoviesFoundProps> = ({ searchTerm }) => {
  return (
    <div className="not-found-container">
      <img src={errorImage} alt="NotFound" className="not-found-image" /> 
      <p className='Error'>No se encontraron películas para "{searchTerm}".</p>
    </div>
  );
};

export default NotFound;