"use client";

import Link from "next/link";
import { Home, PlusCircle, Calendar, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta según tu estructura

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth(); // Obtener el usuario autenticado

  // Si no hay usuario, no mostrar el Sidebar (o mostrar una versión mínima)
  if (!user) {
    return (
      <aside className="w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-6">
        <Link href="/" className="mb-6" title="Inicio">
          <div
            className={`p-3 rounded-full ${
              pathname === "/"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            } transition-colors duration-200`}
          >
            <Home size={24} />
          </div>
        </Link>
      </aside>
    );
  }

  return (
    <aside className="w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-6">
      {/* Ícono para regresar a la raíz (/) */}
      <Link href="/" className="mb-6" title="Inicio">
        <div
          className={`p-3 rounded-full ${
            pathname === "/"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-200"
          } transition-colors duration-200`}
        >
          <Home size={24} />
        </div>
      </Link>

      {/* Ícono para Perfil (/perfil) - Todos los usuarios */}
      <Link href="/perfil" className="mb-6" title="Perfil">
        <div
          className={`p-3 rounded-full ${
            pathname === "/perfil"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-200"
          } transition-colors duration-200`}
        >
          <User size={24} />
        </div>
      </Link>

      {/* Ícono para Dashboard (/dashboard) - Solo rol 3 */}
      {user.role?.id === 3 && (
        <Link href="/dashboard" className="mb-6" title="Dashboard">
          <div
            className={`p-3 rounded-full ${
              pathname === "/dashboard"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            } transition-colors duration-200`}
          >
            <PlusCircle size={24} />
          </div>
        </Link>
      )}

      {/* Ícono para Reservas (/reservas) - Rol 2 o 3 */}
      {(user.role?.id === 2 || user.role?.id === 3) && (
        <Link
          href="/reservas"
          className="mb-6"
          title={user.role?.id === 3 ? "Mis Reservas Recibidas" : "Mis Reservas"}
        >
          <div
            className={`p-3 rounded-full ${
              pathname === "/reservas"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            } transition-colors duration-200`}
          >
            <Calendar size={24} />
          </div>
        </Link>
      )}
    </aside>
  );
}