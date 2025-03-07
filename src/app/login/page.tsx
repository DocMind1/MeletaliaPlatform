"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Usamos useAuth en lugar de useContext

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth(); // Cambiamos a useAuth()

  const fetchUserRole = async (jwt: string) => {
    try {
      const meResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=role`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!meResponse.ok) return undefined;
      const meResult = await meResponse.json();
      return meResult.role;
    } catch (err) {
      console.error("Error al obtener el rol del usuario:", err);
      return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local?populate=role`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: formData.email,
            password: formData.password,
          }),
        }
      );
      const result = await response.json();
      console.log("Respuesta de Strapi:", result);

      if (!response.ok) {
        setMensaje(
          "Error de autenticación: " +
            (result.error?.message || result.message || "Error desconocido")
        );
      } else {
        let roleReturned = result.user?.role;
        if (!roleReturned) {
          roleReturned = await fetchUserRole(result.jwt);
        }
        console.log("Rol retornado:", roleReturned);

        // Guardar datos en localStorage y actualizar AuthContext
        const sessionData = { ...result.user, jwt: result.jwt, role: roleReturned };
        localStorage.setItem("userSession", JSON.stringify(sessionData));
        setUser(sessionData);

        if (roleReturned && roleReturned.id === 3) {
          console.log("Redirigiendo a /dashboard");
          router.push("/dashboard");
        } else if (roleReturned && roleReturned.id === 4) {
          console.log("Redirigiendo a /");
          router.push("/");
        } else {
          console.log("Rol no reconocido:", roleReturned);
          setMensaje("Rol de usuario no reconocido.");
        }
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      setMensaje("Error en la autenticación.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
      <form
        onSubmit={handleSubmit}
        className={`${loading ? "opacity-50 pointer-events-none" : ""} space-y-4`}
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md flex justify-center items-center ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>
      </form>
      {mensaje && (
        <p className="text-red-500 text-sm text-center mt-4">{mensaje}</p>
      )}
    </div>
  );
}