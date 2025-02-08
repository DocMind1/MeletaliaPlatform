"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export interface HotelCardProps {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
}

const HotelCard: React.FC<HotelCardProps> = ({ name, location, rating, reviews, price }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden w-64 flex-shrink-0">
    {/* Se reemplaza el campo gris por una imagen tomada de public/images/image3.jpg */}
    <Image 
      src="/images/image3.jpg"
      alt={name}
      width={256} // w-64 equivale a 256px
      height={160} // h-40 equivale a 160px
      className="h-40 w-full object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{location}</p>
      <div className="flex items-center mt-2">
        <span className="bg-black text-white px-2 py-1 rounded text-sm font-semibold">
          {rating}
        </span>
        <p className="ml-2 text-gray-600 text-sm">
          Excepcional · {reviews} comentarios
        </p>
      </div>
      <p className="mt-2 text-lg font-semibold">Desde € {price}</p>
    </div>
  </div>
);

const HotelList: React.FC<{ hotels?: HotelCardProps[] }> = ({ hotels }) => {
  const [hotelData, setHotelData] = useState<HotelCardProps[]>(hotels || []);
  const carouselRef = useRef<HTMLDivElement>(null);

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
      ]);
    }
  }, [hotels]);

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
        &#8249;
      </button>

      <div ref={carouselRef} className="carousel flex gap-4 overflow-x-auto p-4">
        {hotelData.length > 0 ? (
          hotelData.map((hotel, index) => (
            <Link
              key={index}
              href="/detalle"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HotelCard {...hotel} />
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No hay hoteles disponibles</p>
        )}
      </div>

      {/* Botón derecha */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full z-10 hover:bg-opacity-75"
      >
        &#8250;
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
