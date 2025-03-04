"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {
  Ban,
  Accessibility,
  Bell,
  Airplay,
  Wifi,
  Car,
  Users,
  Coffee,
  Sun,
  Moon,
} from "lucide-react";

export default function DetallePropiedad() {
  const { id } = useParams();

  const [property, setProperty] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  // Ejemplo de fechas bloqueadas
  const blockedDates = ["2023-12-25", "2023-12-31", "2024-01-01"];
  const isDateBlocked = (date: Date): boolean => {
    const formatted = moment(date).format("YYYY-MM-DD");
    return blockedDates.includes(formatted);
  };

  useEffect(() => {
    if (!id) return;
    const finalURL = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/propiedades/${id}?populate=*`;
    console.log("Fetching property from:", finalURL);
    fetch(finalURL)
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Strapi response:", data);
        // Si la respuesta viene envuelta en "data", úsala; de lo contrario, asigna data directamente
        if (data && data.data !== undefined) {
          setProperty(data.data);
        } else {
          setProperty(data);
        }
      })
      .catch((err) => console.error("Error fetching property:", err));
  }, [id]);

  if (!property) {
    return <div className="p-4">Cargando...</div>;
  }

  // Extrae los campos: si property.attributes existe, úsalo; de lo contrario, usa property
  const { Titulo, Descripcion, Direccion, Precio, Imagenes } =
    property.attributes || property;

  const images =
    Imagenes && Imagenes.length > 0
      ? Imagenes.map((img: any) => ({
          src: img.url,
          alt: Titulo,
        }))
      : [{ src: "/images/placeholder.jpg", alt: Titulo }];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleConfirmDates = () => {
    console.log("Fecha inicio:", startDate ? moment(startDate).format("YYYY-MM-DD") : "");
    console.log("Fecha fin:", endDate ? moment(endDate).format("YYYY-MM-DD") : "");
    closeModal();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold mt-4">{Titulo}</h1>
      <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
        <span className="text-gray-800">📍</span>
        {Direccion}
      </p>

      {/* Carrusel de imágenes e info de la propiedad */}
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2 relative">
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            width={800}
            height={400}
            className="rounded-lg w-full h-auto object-cover"
          />
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700"
          >
            &#8249;
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700"
          >
            &#8250;
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold mt-4">Descripción</h2>
            <p className="text-sm text-gray-800 mt-2">{Descripcion}</p>
            <h2 className="text-base font-semibold mt-4">Precio</h2>
            <p className="text-xl font-bold text-gray-800 mt-2">€ {Precio}</p>
            <button
              onClick={openModal}
              className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-black mt-4"
            >
              Ver fechas disponibles
            </button>
          </div>
        </div>
      </div>

      {/* Sección "Fantástico" y mapa */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 mt-4">Fantástico</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">9,4</p>
            <p className="text-sm text-gray-600 italic mt-2">
              “Tiene unos exteriores maravillosos y que la barbacoa esté en una cabaña aparte...”
            </p>
            <p className="mt-2 font-semibold text-sm">– Irene, España</p>
          </div>
        </div>
        <div>
          <div className="bg-white p-4 shadow-md rounded-lg h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18..."
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Sección de info adicional y servicios */}
      <div className="w-full mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-800 mb-4">
          Información adicional del alojamiento...
        </p>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Servicios más populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Ban size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Habitaciones sin humo</span>
          </div>
          <div className="flex items-center gap-2">
            <Accessibility size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Adaptado para movilidad reducida</span>
          </div>
          {/* Otros servicios */}
        </div>
      </div>

      {/* Modal para fechas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 sm:w-1/2 md:w-1/3">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecciona las fechas</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-800" htmlFor="startDate">
                  Fecha de inicio:
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    if (date && !isDateBlocked(date)) {
                      setStartDate(date);
                    }
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Selecciona una fecha"
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-800" htmlFor="endDate">
                  Fecha de fin:
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    if (date && !isDateBlocked(date)) {
                      setEndDate(date);
                    }
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Selecciona una fecha"
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDates}
                className="px-4 py-2 bg-black text-white rounded hover:bg-black"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
