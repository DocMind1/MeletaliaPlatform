"use client";
import Link from "next/link";
import { UserCircle } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 mb-4 sm:mb-0">
          <span className="text-white">Meletalia</span>
          <span className="text-blue-300">.com</span>
        </Link>
        
        {/* Opciones de usuario */}
        <div className="flex items-center gap-4">
          <Link 
            href="/registro" 
            className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
          >
            Hazte una cuenta
          </Link>
          <Link 
            href="/login" 
            className="border border-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-blue-900 flex items-center gap-2"
          >
            <UserCircle size={20} /> Inicia sesión
          </Link>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="bg-blue-900 text-white text-center py-10">
        <h1 className="text-3xl md:text-4xl font-bold">Encuentra tu próxima estancia</h1>
        <p className="text-base md:text-lg mt-2">Busca ofertas en hoteles, casas y mucho más...</p>
      </div>
    </header>
  );
};

export default Header;
