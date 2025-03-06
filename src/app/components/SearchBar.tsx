"use client";
import React, { useState } from "react";
import { FaSuitcase, FaCalendarAlt, FaEuroSign } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { searchProperties, SearchPropertyFilters } from "../../../userService/userService";

// Interfaz para las propiedades
interface Property {
  id: number;
  Titulo: string;
  Descripcion: string;
  Precio: number;
  Direccion: string;
  Imagenes: { url: string }[] | null;
}

const SearchBar: React.FC = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [properties, setProperties] = useState<Property[]>([]); // Cambia any[] por Property[]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setProperties([]);

    const filters: SearchPropertyFilters = {
      city: destination || undefined,
      availableFrom: checkIn ? checkIn.toISOString().split("T")[0] : undefined,
      availableTo: checkOut ? checkOut.toISOString().split("T")[0] : undefined,
      minPrice,
      maxPrice,
    };

    console.log("Buscando con filtros:", filters);

    const result = await searchProperties(filters);
    setLoading(false);

    if (result.ok) {
      setProperties(result.properties);
    } else {
      setError(result.error ?? null);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-yellow-500 max-w-5xl mx-auto -mt-6 relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Destino (Lugar) */}
        <div className="flex items-center border border-gray-300 rounded-md px-4 py-2 flex-2 bg-white">
          <FaSuitcase className="text-gray-600 mr-2" />
          <input
            type="text"
            placeholder="¿A dónde vas?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
          />
        </div>

        {/* Check-in */}
        <div className="flex items-center border border-gray-300 rounded-md px-4 py-2 flex-1 bg-white">
          <FaCalendarAlt className="text-gray-600 mr-2" />
          <DatePicker
            selected={checkIn}
            onChange={(date: Date | null) => setCheckIn(date)}
            placeholderText="Check-in"
            className="w-full p-2 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
          />
        </div>

        {/* Check-out */}
        <div className="flex items-center border border-gray-300 rounded-md px-4 py-2 flex-1 bg-white">
          <FaCalendarAlt className="text-gray-600 mr-2" />
          <DatePicker
            selected={checkOut}
            onChange={(date: Date | null) => setCheckOut(date)}
            placeholderText="Check-out"
            className="w-full p-2 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
          />
        </div>

        {/* Precio (Mínimo y Máximo) */}
        <div className="flex items-center border border-gray-300 rounded-md px-4 py-2 flex-1 bg-white">
          <FaEuroSign className="text-gray-600 mr-2" />
          <input
            type="number"
            placeholder="min"
            value={minPrice !== undefined ? minPrice : ""}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
            className="w-20 p-2 text-black bg-transparent outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
          />
          <span className="mx-2 text-black">/</span>
          <input
            type="number"
            placeholder="max"
            value={maxPrice !== undefined ? maxPrice : ""}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
            className="w-20 p-2 text-black bg-transparent outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
          />
        </div>

        {/* Botón */}
        <div className="w-full md:w-auto">
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`bg-black text-white px-6 py-3 rounded-md w-full md:w-auto hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {/* Resultados */}
      {error && (
        <div className="mt-4 text-red-500 text-center">{error}</div>
      )}
      {properties.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default SearchBar;