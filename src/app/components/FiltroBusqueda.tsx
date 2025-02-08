"use client";
import React, { useState } from "react";
import { FaMapMarkerAlt, FaDollarSign, FaHome, FaBed, FaBath, FaToggleOn, FaToggleOff } from "react-icons/fa";

const FiltroBusquedaLinea: React.FC = () => {
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [propertyType, setPropertyType] = useState("");
  const [rooms, setRooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [availability, setAvailability] = useState(false);

  const handleFilter = () => {
    console.log({
      location,
      minPrice,
      maxPrice,
      propertyType,
      rooms,
      bathrooms,
      availability,
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between bg-white p-3 rounded-lg shadow-md border space-x-2">
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
      {/* Tipo de propiedad */}
      <div className="flex items-center space-x-1">
        <FaHome className="text-gray-600" />
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="outline-none p-1 border-b border-gray-300 focus:border-blue-600"
        >
          <option value="">Tipo</option>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="local_comercial">Local Comercial</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      {/* Habitaciones */}
      <div className="flex items-center space-x-1">
        <FaBed className="text-gray-600" />
        <select
          value={rooms}
          onChange={(e) => setRooms(Number(e.target.value))}
          className="outline-none p-1 border-b border-gray-300 focus:border-blue-600"
        >
          {[...Array(10).keys()].map((n) => (
            <option key={n} value={n + 1}>{n + 1}</option>
          ))}
        </select>
      </div>
      {/* Baños */}
      <div className="flex items-center space-x-1">
        <FaBath className="text-gray-600" />
        <select
          value={bathrooms}
          onChange={(e) => setBathrooms(Number(e.target.value))}
          className="outline-none p-1 border-b border-gray-300 focus:border-blue-600"
        >
          {[...Array(10).keys()].map((n) => (
            <option key={n} value={n + 1}>{n + 1}</option>
          ))}
        </select>
      </div>
      {/* Disponibilidad */}
      <div className="flex items-center space-x-1">
        {availability ? (
          <FaToggleOn
            className="text-green-600 cursor-pointer"
            onClick={() => setAvailability(!availability)}
          />
        ) : (
          <FaToggleOff
            className="text-gray-600 cursor-pointer"
            onClick={() => setAvailability(!availability)}
          />
        )}
        <span className="text-sm text-gray-600">Disponible</span>
      </div>
      {/* Botón Filtrar */}
      <button
        onClick={handleFilter}
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-black transition"
      >
        Filtrar
      </button>
    </div>
  );
};

export default FiltroBusquedaLinea;
