"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Se ha eliminado el import de FiltroBusqueda ya que no se utiliza

export interface HotelCardProps {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
}

const HotelCard: React.FC<HotelCardProps> = ({
  name,
  location,
  rating,
  reviews,
  price,
}) => (
  <>
    <Image
      src="/images/image2.jpg"
      alt={name}
      width={400}
      height={160}
      className="h-40 w-full object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{location}</p>
      <div className="flex items-center mt-2">
        <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
          {rating}
        </span>
        <p className="ml-2 text-gray-600 text-sm">
          Excepcional &middot; {reviews} comentarios
        </p>
      </div>
      <p className="mt-2 text-lg font-semibold">Desde &euro; {price}</p>
    </div>
  </>
);

const HotelCardList: React.FC<{ hotels?: HotelCardProps[] }> = ({ hotels }) => {
  const [hotelData, setHotelData] = useState<HotelCardProps[]>(hotels || []);

  useEffect(() => {
    if (!hotels || hotels.length === 0) {
      setHotelData([
        {
          name: "Bungalows y Glamping Medina Sidonia",
          location: "España, Medina Sidonia",
          rating: 8.2,
          reviews: 382,
          price: 90,
        },
        {
          name: "Casa Rural La Marquesa - Cuenca",
          location: "España, Valera de Abajo",
          rating: 9.4,
          reviews: 67,
          price: 220,
        },
        {
          name: "Casa rural Abatetxe",
          location: "España, Elgoibar",
          rating: 9.7,
          reviews: 198,
          price: 220,
        },
        {
          name: "Can Elisa Safari Tent",
          location: "España, Tàrbena",
          rating: 9.6,
          reviews: 18,
          price: 331,
        },
        {
          name: "Hotel Sol y Mar",
          location: "México, Cancún",
          rating: 8.9,
          reviews: 240,
          price: 150,
        },
        {
          name: "Resort Paraíso",
          location: "Brasil, Río de Janeiro",
          rating: 9.1,
          reviews: 320,
          price: 200,
        },
        {
          name: "Mountain Retreat",
          location: "Suiza, Zúrich",
          rating: 9.5,
          reviews: 150,
          price: 300,
        },
        {
          name: "Urban Oasis",
          location: "Estados Unidos, Nueva York",
          rating: 8.8,
          reviews: 410,
          price: 250,
        },
        {
          name: "Coastal Escape",
          location: "Australia, Sydney",
          rating: 8.7,
          reviews: 190,
          price: 180,
        },
        {
          name: "Desert Mirage",
          location: "Marruecos, Marrakech",
          rating: 9.0,
          reviews: 220,
          price: 210,
        },
        {
          name: "Lakeview Resort",
          location: "Canadá, Ontario",
          rating: 9.3,
          reviews: 130,
          price: 275,
        },
        {
          name: "City Central Hotel",
          location: "Reino Unido, Londres",
          rating: 8.5,
          reviews: 350,
          price: 190,
        },
      ]);
    }
  }, [hotels]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {hotelData.map((hotel, index) => (
          <Link
            key={index}
            href="/detalle"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
          >
            <HotelCard {...hotel} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HotelCardList;
