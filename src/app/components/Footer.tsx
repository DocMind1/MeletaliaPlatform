"use client";
import React from 'react';

const Footer: React.FC = () => (
  <footer className="footer py-4 bg-gray-100">
    <div className="container mx-auto px-4 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} Maletalia. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default Footer;
