import React from 'react';
import '../styles/copyright.css';

const Copyright = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full text-center py-4 bg-gray-900 text-gray-300 text-sm">
      © {year} Fintrax. Todos los derechos reservados.
    </footer>
  );
};

export default Copyright;
