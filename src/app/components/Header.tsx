"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header
      className="relative text-white shadow-md bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/header.png')",
        backgroundSize: "100% auto",
        backgroundColor: "#fff", // Ajusta este color al de los bordes de la imagen
        minHeight: "455px",
      }}
    >
      <div className="absolute top-0 left-0 w-full px-6 py-4 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={42}
              height={42}
              className="object-contain"
            />
            {/* En mobile se aplica borde y sombra, en pantallas medianas en adelante se eliminan */}
            <span className="text-2xl font-bold border border-black shadow-md md:border-0 md:shadow-none drop-shadow-md">
              Maletalia
            </span>
            <span className="text-2xl font-bold border border-black shadow-md md:border-0 md:shadow-none drop-shadow-md">
              .net
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/registro"
              className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 shadow-md"
            >
              Hazte una cuenta
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 shadow-md flex items-center gap-2"
            >
              <UserCircle size={20} /> Inicia sesión
            </Link>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-0 text-center px-4"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          Encuentra tu próxima estancia
        </h1>
        <p className="text-base md:text-lg mt-2">
          Busca ofertas en hoteles, casas y mucho más...
        </p>
      </div>
    </header>
  );
};

export default Header;
