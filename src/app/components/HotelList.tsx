"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllProperties } from "../../../userService/userService";

// Interfaz para las propiedades
export interface HotelCardProps {
  id: number;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
}

const HotelCard: React.FC<HotelCardProps> = ({ name, location, price, imageUrl }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden w-64 flex-shrink-0">
    <Image 
      src={imageUrl || "/images/image3.jpg"}
      alt={name}
      width={256}
      height={160}
      className="h-40 w-full object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{location}</p>
      <p className="mt-2 text-lg font-semibold">Desde € {price}</p>
    </div>
  </div>
);

const HotelList: React.FC = () => {
  const [hotelData, setHotelData] = useState<HotelCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const result = await getAllProperties();
      if (result.ok && result.properties.length > 0) {
        const mappedProperties = result.properties.map((prop: any) => ({
          id: prop.id,
          name: prop.Titulo,
          location: prop.Direccion,
          price: prop.Precio,
          imageUrl: prop.Imagenes && prop.Imagenes.length > 0 && prop.Imagenes[0].url
            ? prop.Imagenes[0].url
            : "/images/image3.jpg",
        }));
        setHotelData(mappedProperties);
        setError(null);
      } else {
        console.error("Failed to fetch properties:", result.error);
        setHotelData([]);
        setError(
          `Error al cargar las propiedades: ${
            result.error || "Por favor, intenta de nuevo más tarde."
          }`
        );
      }
    };

    fetchProperties();
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Botón izquierda */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full z-10 hover:bg-opacity-75"
      >
        ‹
      </button>

      <div ref={carouselRef} className="carousel flex gap-4 overflow-x-auto p-4">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : hotelData.length > 0 ? (
          hotelData.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/detalle/${hotel.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HotelCard {...hotel} />
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No hay propiedades disponibles</p>
        )}
      </div>

      {/* Botón derecha */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full z-10 hover:bg-opacity-75"
      >
        ›
      </button>

      <style jsx>{`
        .carousel {
          -ms-overflow-style: none; /* IE y Edge */
          scrollbar-width: none; /* Firefox */
        }
        .carousel::-webkit-scrollbar {
          display: none; /* Chrome, Safari y Opera */
        }
      `}</style>
    </div>
  );
};

export default HotelList;