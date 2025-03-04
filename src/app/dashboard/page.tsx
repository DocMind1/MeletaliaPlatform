"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import { createProperty, uploadDashboardImages } from "../../../userService/userService";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    direccion: "",
    numerodehabitaciones: "",
    numerodebanos: "",
    imagenes: null as FileList | null,
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || user.role?.id !== 3) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-red-500 text-center">
          No tienes permiso para acceder a esta página.
        </p>
      </div>
    );
  }

  console.log("Rol del usuario autenticado:", user.role?.id);

  const jwt = user.jwt;
  const userId = user.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, imagenes: e.target.files });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    if (!formData.titulo || !formData.descripcion || !formData.precio || !formData.direccion) {
      setMensaje("Por favor, completa todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    let imageIds: number[] | undefined;
    if (formData.imagenes) {
      const uploadResult = await uploadDashboardImages(Array.from(formData.imagenes), jwt);
      if (uploadResult.ok) {
        imageIds = uploadResult.ids;
      } else {
        setMensaje(`Error al subir imágenes: ${uploadResult.error}`);
        setLoading(false);
        return;
      }
    }

    const propertyData = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      direccion: formData.direccion,
      numerodehabitaciones: parseInt(formData.numerodehabitaciones) || undefined,
      numerodebanos: parseInt(formData.numerodebanos) || undefined,
      users_permissions_user: userId,
      imagenes: imageIds,
    };

    const result = await createProperty(propertyData, jwt);
    if (result.ok) {
      setMensaje("Propiedad creada con éxito.");
      setFormData({
        titulo: "",
        descripcion: "",
        precio: "",
        direccion: "",
        numerodehabitaciones: "",
        numerodebanos: "",
        imagenes: null,
      });
    } else {
      setMensaje(`Error al crear la propiedad: ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Propiedad</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título *</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción *</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio (€) *</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección *</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Número de habitaciones</label>
          <input
            type="number"
            name="numerodehabitaciones"
            value={formData.numerodehabitaciones}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Número de baños</label>
          <input
            type="number"
            name="numerodebanos"
            value={formData.numerodebanos}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Imágenes</label>
          <input
            type="file"
            name="imagenes"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
          <p className="text-sm text-gray-500">Arrastra y suelta o haz clic para añadir imágenes.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md flex justify-center items-center ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {loading ? "Guardando..." : "Crear Propiedad"}
        </button>
      </form>
      {mensaje && (
        <p className={`text-sm text-center mt-4 ${mensaje.includes("éxito") ? "text-green-500" : "text-red-500"}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}