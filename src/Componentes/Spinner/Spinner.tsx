import React from 'react';
import './Spinner.css'; // Asegúrate de que este archivo CSS exista

const Spinner: React.FC = () => {
  return (
    <div className="spinner"><span className="loader"></span></div>
  );
};

export default Spinner;