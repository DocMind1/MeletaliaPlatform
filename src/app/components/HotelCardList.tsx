"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllProperties } from "../../../userService/userService";

// Interfaz para propiedades a mostrar en la tarjeta
export interface HotelCardProps {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Interfaz para la respuesta de Strapi
interface Property {
  id: number;
  Titulo: string;
  Direccion: string;
  Precio: number;
  Descripcion: string;
  Imagenes?: Array<{
    url: string;
  }>;
}

const HotelCard: React.FC<HotelCardProps> = ({
  name,
  location,
  description,
  price,
  imageUrl,
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Image
      src={imageUrl || "/images/placeholder.jpg"}
      alt={name}
      width={400}
      height={160}
      className="h-40 w-full object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{location}</p>
      <p className="mt-2 text-gray-700">
        {description.length > 100 ? description.slice(0, 100) + "..." : description}
      </p>
      <p className="mt-2 text-lg font-semibold">Desde € {price}</p>
    </div>
  </div>
);

const HotelCardList: React.FC = () => {
  const [hotelData, setHotelData] = useState<HotelCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const result = await getAllProperties();
      if (result.ok && result.properties.length > 0) {
        const mappedProperties = result.properties.map((prop: Property) => ({
          id: prop.id,
          name: prop.Titulo,
          location: prop.Direccion,
          description: prop.Descripcion,
          price: prop.Precio,
          imageUrl:
            prop.Imagenes && prop.Imagenes.length > 0 && prop.Imagenes[0].url
              ? prop.Imagenes[0].url
              : "/images/placeholder.jpg",
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

  return (
    <div className="container mx-auto p-4">
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hotelData.length > 0 ? (
            hotelData.map((hotel) => (
              <Link key={hotel.id} href={`/detalle/${hotel.id}`}>
                <HotelCard {...hotel} />
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center">No hay propiedades disponibles</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelCardList;
