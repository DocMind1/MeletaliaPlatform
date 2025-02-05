"use client";
import React, { useState } from "react";
import { FaHotel, FaCalendarAlt, FaUser } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchBar: React.FC = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const handleSearch = () => {
    console.log("Buscando:", { destination, checkIn, checkOut, adults, children, rooms });
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-yellow-500 max-w-5xl mx-auto -mt-6 relative z-10">
      <div className="flex flex-col md:flex-row items-center">
        {/* Destino */}
        <div className="flex items-center border md:border-r px-4 py-2 flex-1 w-full">
          <FaHotel className="text-gray-600 mr-2" />
          <input
            type="text"
            placeholder="¿A dónde vas?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 outline-none"
          />
        </div>
        
        {/* Check-in */}
        <div className="flex items-center border-t md:border-t-0 md:border-l md:border-r px-4 py-2 flex-1 w-full">
          <FaCalendarAlt className="text-gray-600 mr-2" />
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date)}
            placeholderText="Check-in"
            className="w-full p-2 outline-none"
          />
        </div>

        {/* Check-out */}
        <div className="flex items-center border-t md:border-t-0 md:border-l md:border-r px-4 py-2 flex-1 w-full">
          <FaCalendarAlt className="text-gray-600 mr-2" />
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date)}
            placeholderText="Check-out"
            className="w-full p-2 outline-none"
          />
        </div>
        
        {/* Huéspedes */}
        <div className="flex items-center border-t md:border-t-0 md:border-l px-4 py-2 flex-1 w-full">
          <FaUser className="text-gray-600 mr-2" />
          <select 
            value={adults} 
            onChange={(e) => setAdults(Number(e.target.value))} 
            className="outline-none p-2 mr-2"
          >
            {[...Array(10).keys()].map((n) => (
              <option key={n} value={n + 1}>{n + 1} Adulto(s)</option>
            ))}
          </select>
          <select 
            value={children} 
            onChange={(e) => setChildren(Number(e.target.value))} 
            className="outline-none p-2 mr-2"
          >
            {[...Array(10).keys()].map((n) => (
              <option key={n} value={n}>{n} Niño(s)</option>
            ))}
          </select>
          <select 
            value={rooms} 
            onChange={(e) => setRooms(Number(e.target.value))} 
            className="outline-none p-2"
          >
            {[...Array(10).keys()].map((n) => (
              <option key={n} value={n + 1}>{n + 1} Habitación(es)</option>
            ))}
          </select>
        </div>
        
        {/* Botón */}
        <button 
          onClick={handleSearch} 
          className="bg-blue-600 text-white px-6 py-3 rounded-md mt-4 md:mt-0 md:rounded-r-md hover:bg-blue-700 transition"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
