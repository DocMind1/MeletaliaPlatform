"use client";

import React, { useState } from "react";
import { FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import { searchProperties, SearchPropertyFilters } from "../../../userService/userService";

// Interfaz para las propiedades
interface Property {
  id: number;
  Titulo: string;
  Descripcion: string;
  Precio: number;
  Direccion: string;
  Ciudad: string;
  Imagenes: { url: string }[] | null;
}

const FiltroBusquedaLinea: React.FC = () => {
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilter = async () => {
    setLoading(true);
    setError(null);
    setProperties([]);

    const filters: SearchPropertyFilters = {
      city: location || undefined,
      minPrice: minPrice !== "" ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
    };

    console.log("Buscando con filtros:", filters);

    const result = await searchProperties(filters);
    setLoading(false);

    if (result.ok) {
      setProperties(result.properties);
    } else {
      setError(result.error ?? "Error al buscar propiedades");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between bg-white px-3 py-2 rounded-lg shadow-md border">
      {/* Ubicación */}
      <div className="flex items-center space-x-1">
        <FaMapMarkerAlt className="text-gray-600" />
        <input
          type="text"
          placeholder="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="outline-none p-1 border-b border-gray-300 focus:border-blue-600"
        />
      </div>
      {/* Precio */}
      <div className="flex items-center space-x-1">
        <FaDollarSign className="text-gray-600" />
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
          className="w-16 outline-none p-1 border-b border-gray-300 focus:border-blue-600"
        />
        <span className="text-gray-600">-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
          className="w-16 outline-none p-1 border-b border-gray-300 focus:border-blue-600"
        />
      </div>
      {/* Botón Filtrar */}
      <button
        onClick={handleFilter}
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Filtrando..." : "Filtrar"}
      </button>

      {/* Resultados */}
      {error && (
        <div className="mt-2 text-red-500 text-center">{error}</div>
      )}
      {properties.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="border rounded-md p-4 shadow-sm bg-white">
              <h3 className="text-lg font-semibold">{property.Titulo || "Sin título"}</h3>
              <p className="text-gray-600">{property.Descripcion || "Sin descripción"}</p>
              <p className="text-blue-600 font-bold">
                {property.Precio ? `${property.Precio} €` : "Precio no disponible"}
              </p>
              <p>{property.Direccion || "Dirección no disponible"}</p>
              {property.Imagenes && property.Imagenes.length > 0 ? (
                <img
                  src={`${property.Imagenes[0].url}`}
                  alt={property.Titulo || "Imagen"}
                  className="w-full h-40 object-cover mt-2 rounded-md"
                />
              ) : (
                <p className="text-gray-500 mt-2">Sin imagen</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FiltroBusquedaLinea;