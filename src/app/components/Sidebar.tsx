"use client";

import Link from "next/link";
import { Home, PlusCircle, Calendar, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const router = useRouter();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("userSession"); // Limpiar el almacenamiento local
    setUser(null); // Limpiar el estado del usuario en el contexto
    router.push("/"); // Redirigir a la página de inicio
  };

  // Si no hay usuario, mostrar una versión mínima del Sidebar
  if (!user) {
    return (
      <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6">
        <Link href="/" className="mb-6 relative" title="Inicio">
          <div
            className={`p-3 rounded-full ${
              pathname === "/"
                ? "bg-gray text-white"
                : "text-gray-600 hover:bg-gray-200"
            } transition-colors duration-200`}
          >
            <Home size={24} />
            {/* Círculo de notificación rojo */}
            <span className="absolute top-0 right-0 w-5 h-5 bg-gray-800  rounded-full flex items-center justify-center text-white text-xs">
              1
            </span>
          </div>
        </Link>
      </aside>
    );
  }

  return (
    <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6">


      {/* Ícono para Inicio (/) */}
      <Link href="/" className="mb-6" title="Inicio">
        <div
          className={`p-3 rounded-full ${
            pathname === "/"
              ? "bg-gray-800  text-white"
              : "text-gray-600 hover:bg-gray-200"
          } transition-colors duration-200`}
        >
          <Home size={24} />
        </div>
      </Link>

      {/* Ícono para Dashboard (/dashboard) - Solo rol 3 */}
      {user.role?.id === 3 && (
        <Link href="/dashboard" className="mb-6" title="Dashboard">
          <div
            className={`p-3 rounded-full ${
              pathname === "/dashboard"
                ? "bg-gray-800  text-white"
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
                ? "bg-gray-800  text-white"
                : "text-gray-600 hover:bg-gray-200"
            } transition-colors duration-200`}
          >
            <Calendar size={24} />
          </div>
        </Link>
      )}

      {/* Ícono para Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto p-3 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-200"
        title="Cerrar Sesión"
      >
        <LogOut size={24} />
      </button>
    </aside>
  );
}