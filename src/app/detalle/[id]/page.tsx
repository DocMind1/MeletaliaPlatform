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
  DoorOpen,
  Tv,
  Lock,
  LampDesk as LampDeskIcon,
  Bath,
  ShowerHead,
  Wind,
  Briefcase,
  VolumeX,
  Coffee as CoffeeIcon,
  ThermometerSun,
  Snowflake,
  IceCream,
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

  // Hook para cargar la propiedad
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

  // Extraer imágenes después de que property esté disponible
  const images = property
    ? (property.attributes || property).Imagenes && (property.attributes || property).Imagenes.length > 0
      ? (property.attributes || property).Imagenes.map((img: any) => ({
          src: img.url,
          alt: (property.attributes || property).Titulo,
        }))
      : [{ src: "/images/placeholder.jpg", alt: (property.attributes || property).Titulo }]
    : [];

  // Hook para el temporizador del carrusel (fuera de cualquier condicional)
  useEffect(() => {
    if (!images || images.length <= 1) return; // No iniciar el temporizador si hay 0 o 1 imagen

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Cambia cada 5 segundos (5000ms)

    // Limpiar el intervalo cuando el componente se desmonte o cambie images
    return () => clearInterval(interval);
  }, [images]);

  // Funciones del carrusel
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

  if (!property) {
    return <div className="p-4">Cargando...</div>;
  }

  // Extrae los campos: si property.attributes existe, úsalo; de lo contrario, usa property
  const { 
    Titulo, 
    Descripcion, 
    Direccion, 
    Precio, 
    Imagenes, 
    DisponibleDesde, 
    DisponibleHasta, 
    Servicios, 
    Desayuno, 
    Caracteristicas, 
    PuntosFuertes 
  } = property.attributes || property;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Título */}
      <h1 className="text-2xl font-bold mt-4">{Titulo}</h1>
      {/* Dirección y fechas de disponibilidad en una sola línea */}
      <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
        <span className="text-gray-800">📍</span>
        {Direccion} | Disponible desde: {DisponibleDesde ? new Date(DisponibleDesde).toLocaleDateString() : "No especificado"} | Disponible hasta: {DisponibleHasta ? new Date(DisponibleHasta).toLocaleDateString() : "No especificado"}
      </p>

      {/* Carrusel de imágenes, mapa y precio */}
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {/* Carrusel de imágenes */}
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
            ‹
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700"
          >
            ›
          </button>
        </div>

        {/* Columna derecha: Mapa y Precio */}
        <div className="flex flex-col gap-4">
          {/* Mapa */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18..."
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
          {/* Precio y botón */}
          <div className="bg-white p-4 rounded-lg flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold">Precio</h2>
              <p className="text-xl font-bold text-gray-800 mt-2">€ {Precio}</p>
              <button
                onClick={openModal}
                className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-900 mt-4 w-full"
              >
                Reservar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción y Puntos Fuertes (debajo del carrusel) */}
      <div className="mt-6">
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-base font-semibold">Descripción</h2>
          <p className="text-sm text-gray-800 mt-2">{Descripcion}</p>
          {/* Puntos Fuertes */}
          {PuntosFuertes && (
            <>
              <h2 className="text-base font-semibold mt-4">Puntos Fuertes</h2>
              <p className="text-sm text-gray-800 mt-2">{PuntosFuertes}</p>
            </>
          )}
        </div>
      </div>

      {/* Sección de info adicional, servicios, características y desayuno (debajo de la descripción) */}
      <div className="mt-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <p className="text-sm text-gray-800 mb-4">
            Información adicional del alojamiento...
          </p>

          {/* Servicios */}
          <h2 className="text-lg font-bold text-gray-800 mb-4">Servicios más populares</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Servicios && Servicios.WiFi && (
              <div className="flex items-center gap-2">
                <Wifi size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">WiFi</span>
              </div>
            )}
            {Servicios && Servicios.Parking && (
              <div className="flex items-center gap-2">
                <Car size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Parking</span>
              </div>
            )}
            {Servicios && Servicios.AdaptadoMovilidadReducida && (
              <div className="flex items-center gap-2">
                <Accessibility size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Adaptado para movilidad reducida</span>
              </div>
            )}
            {Servicios && Servicios.Piscina && (
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Piscina</span>
              </div>
            )}
            {Servicios && Servicios.Gimnasio && (
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Gimnasio</span>
              </div>
            )}
            {Servicios && Servicios.Spa && (
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Spa</span>
              </div>
            )}
            {Servicios && Servicios.Restaurante && (
              <div className="flex items-center gap-2">
                <Coffee size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Restaurante</span>
              </div>
            )}
            {Servicios && Servicios.Bar && (
              <div className="flex items-center gap-2">
                <Coffee size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Bar</span>
              </div>
            )}
            {Servicios && Servicios.Lavanderia && (
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Lavandería</span>
              </div>
            )}
            {Servicios && Servicios.Recepcion24h && (
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Recepción 24h</span>
              </div>
            )}
            {Servicios && Servicios.AdmiteMascotas && (
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Admite mascotas</span>
              </div>
            )}
            {Servicios && Servicios.Jardin && (
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Jardín</span>
              </div>
            )}
          </div>

          {/* Características de las habitaciones */}
          <h2 className="text-lg font-bold text-gray-800 mt-6 mb-4">Características de las habitaciones</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Caracteristicas && Caracteristicas.Terraza && (
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Terraza</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.VistasPanoramicas && (
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Vistas panorámicas</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.AireAcondicionado && (
              <div className="flex items-center gap-2">
                <ThermometerSun size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Aire acondicionado</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.Calefaccion && (
              <div className="flex items-center gap-2">
                <Snowflake size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Calefacción</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.Minibar && (
              <div className="flex items-center gap-2">
                <Coffee size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Minibar</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.TVPantallaPlana && (
              <div className="flex items-center gap-2">
                <Tv size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">TV pantalla plana</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.CajaFuerte && (
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Caja fuerte</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.Escritorio && (
              <div className="flex items-center gap-2">
                <LampDeskIcon size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Escritorio</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.Banera && (
              <div className="flex items-center gap-2">
                <Bath size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Bañera</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.Ducha && (
              <div className="flex items-center gap-2">
                <ShowerHead size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Ducha</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.SecadorPelo && (
              <div className="flex items-center gap-2">
                <Wind size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Secador de pelo</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.ArticulosAseo && (
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Artículos de aseo</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.Armario && (
              <div className="flex items-center gap-2">
                <DoorOpen size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Armario</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.Insonorizacion && (
              <div className="flex items-center gap-2">
                <VolumeX size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Insonorización</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.Cafetera && (
              <div className="flex items-center gap-2">
                <CoffeeIcon size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Cafetera</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.Nevera && (
              <div className="flex items-center gap-2">
                <IceCream size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Nevera</span>
              </div>
            )}
            {Caracteristicas && Caracteristicas.CamaExtraGrande && (
              <div className="flex items-center gap-2">
                <Moon size={16} className="text-gray-800" />
                <span className="text-sm text-gray-800">Cama extra grande</span>
              </div>
            )}
          </div>

          {/* Opciones de desayuno */}
          {Desayuno && Desayuno.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-gray-800 mt-6 mb-4">Opciones de Desayuno</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Desayuno.map((opcion: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Coffee size={16} className="text-gray-800" />
                    <span className="text-sm text-gray-800">{opcion}</span>
                  </div>
                ))}
              </div>
            </>
          )}
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
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
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