"use client";
import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header
      className="relative bg-cover bg-center shadow-md text-white"
      style={{ 
        backgroundImage: "url('/images/header.png')", 
        backgroundSize: "100% 455px", 
        backgroundColor: "#2ebae8" 
      }}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-opacity-80" style={{ backgroundColor: "rgba(46, 186, 232, 0.7)" }}>
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 mb-4 sm:mb-0">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={42}
            height={42}
            className="object-contain"
          />
          <span className="text-white drop-shadow-lg">Maletalia </span>
          <span className="text-blue-300 drop-shadow-lg">.com</span>
        </Link>

        {/* Opciones de usuario */}
        <div className="flex items-center gap-4">
          <Link
            href="/registro"
            className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium shadow-md hover:bg-gray-200"
          >
            Hazte una cuenta
          </Link>
          <Link
            href="/login"
            className="border border-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-white hover:text-blue-900 flex items-center gap-2"
          >
            <UserCircle size={20} /> Inicia sesión
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-white text-center py-10 bg-opacity-70" style={{ backgroundColor: "rgba(46, 186, 232, 0.6)" }}>
        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">Encuentra tu próxima estancia</h1>
        <p className="text-base md:text-lg mt-2 drop-shadow-md">Busca ofertas en hoteles, casas y mucho más...</p>
      </div>
    </header>
  );
};

export default Header;
