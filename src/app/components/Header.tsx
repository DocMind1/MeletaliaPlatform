"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header
      className="relative text-white shadow-md bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/header.png')",
        backgroundSize: "100% auto",
        backgroundColor: "#fff",
        minHeight: "455px",
      }}
    >
      <div className="absolute top-0 left-0 w-full px-6 py-4 z-10 pt-[60px] pl-[60px] pr-[60px]">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={42}
              height={42}
              className="object-contain"
            />
            <span className="text-2xl font-bold border border-black shadow-md md:border-0 md:shadow-none drop-shadow-md">
              Maletalia
            </span>
            <span className="text-2xl font-bold border border-black shadow-md md:border-0 md:shadow-none drop-shadow-md">
              .net
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 bg-white text-blue-900 px-3 py-1 rounded-lg shadow-md hover:bg-gray-200"
                >
                  <UserCircle size={24} />
                  <span>MENU</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-blue-900 rounded-lg shadow-lg z-20">
                    <ul className="flex flex-col">
              
                      {user.role?.id === 3 && (
                        <>
                          <li>
                            <Link
                              href="/dashboard"
                              className="block px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => setMenuOpen(false)}
                            >
                              Mis propiedades
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/reservas"
                              className="block px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => setMenuOpen(false)}
                            >
                              Mis Reservas Recibidas
                            </Link>
                          </li>
                        </>
                      )}
                      {user.role?.id === 4 && (
                        <li>
                          <Link
                            href="/reservas"
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => setMenuOpen(false)}
                          >
                            Mis Reservas
                          </Link>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={() => {
                            handleLogout();
                            setMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-lg"
                        >
                          Cerrar sesión
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
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