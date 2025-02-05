"use client";
import Image from "next/image";
import React, { useState } from "react";
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

export default function PlantillaDetalle() {
  const images = [
    { src: "/images/image1.jpg", alt: "Casa Rural La Marquesa 1" },
    { src: "/images/image2.jpg", alt: "Casa Rural La Marquesa 2" },
    { src: "/images/image3.jpg", alt: "Casa Rural La Marquesa 3" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const blockedDates = ["2023-12-25", "2023-12-31", "2024-01-01"];

  const isDateBlocked = (date: Date): boolean => {
    const formatted = moment(date).format("YYYY-MM-DD");
    return blockedDates.includes(formatted);
  };

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
      <h1 className="text-xl font-bold mt-4">Casa Rural La Marquesa - Cuenca</h1>
      <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
        <span className="text-gray-800">📍</span>
        Calle San Isidro número 32 Casa rural, 16120 Valera de Abajo, España
        <span className="text-gray-800 cursor-pointer">
          {" - Ubicaci&oacute;n excelente - Ver mapa"}
        </span>
      </p>

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
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 sm:p-4 rounded-full hover:bg-gray-700"
          >
            &#8249;
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 sm:p-4 rounded-full hover:bg-gray-700"
          >
            &#8250;
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold mt-4">Personal</h3>
            <p className="text-xl font-bold text-gray-800 mt-2">9,8</p>
            <h2 className="text-base font-semibold mt-4">Puntos fuertes del alojamiento</h2>
            <p className="text-sm text-gray-800">
              &iexcl;Ideal para estancias de 2 noches! Este hotel est&aacute; en el coraz&oacute;n de Cracovia y tiene una puntuaci&oacute;n excelente en ubicaci&oacute;n: 9,5
            </p>
            <h2 className="text-base font-semibold mt-4">Informaci&oacute;n sobre el desayuno</h2>
            <p className="text-sm text-gray-800">
              &iexcl;Ideal para estancias de 2 noches! Continental, Vegetariano, Vegano, Sin gluten, Buffet
            </p>
            <h2 className="text-base font-semibold mt-4">Habitaciones con:</h2>
            <p className="text-sm text-gray-800">Terraza</p>
            <h2 className="text-base font-semibold mt-4">Vistas a la ciudad</h2>
            <p className="text-sm text-gray-800">Hay parking privado en el hotel</p>
            <button
              onClick={openModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 mt-4"
            >
              Ver fechas disponibles
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 mt-4">Fant&aacute;stico</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">9,4</p>
            <p className="text-sm text-gray-600 italic mt-2">
              &quot;Tiene unos exteriores maravillosos y que la barbacoa est&eacute; en una caba&ntilde;a aparte est&aacute; genial. La mesa del sal&oacute;n es amplia, cupimos todos sin problema.&quot;
            </p>
            <p className="mt-2 font-semibold text-sm">&ndash; Irene, Espa&ntilde;a</p>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-800 mb-4">
          Es posible que tengas descuento Genius en Hotel Golden Queen. Para saber si se aplica el descuento Genius en tus fechas, inicia sesi&oacute;n.
          <br />
          Los descuentos Genius en este alojamiento dependen de las fechas de reserva, las fechas de estancia y otras ofertas disponibles.
          <br />
          Info fiable: Los clientes dicen que la descripci&oacute;n y las fotos de este alojamiento son muy precisas.
          <br />
          Hotel Golden Queen es un alojamiento con una ubicaci&oacute;n excelente en el centro de Cracovia, a 9 min a pie de Torre del Ayuntamiento y a 800 metros de Plaza del Mercado. Se ofrece parking privado por un suplemento. El alojamiento ofrece recepci&oacute;n 24 horas, traslado para ir o volver del aeropuerto, servicio de habitaciones y wifi gratis en todo el alojamiento.
          <br />
          En el hotel, todas las habitaciones tienen aire acondicionado, zona de estar, TV de pantalla plana con canales v&iacute;a sat&eacute;lite, caja fuerte y ba&ntilde;o privado con ducha, art&iacute;culos de aseo gratuitos y secador de pelo.
          <br />
          El desayuno est&aacute; disponible e incluye opciones buffet, continentales o vegetarianas.
          <br />
          Hotel Golden Queen ofrece alojamiento de 4 estrellas con sauna y terraza.
          <br />
          Cerca del alojamiento hay puntos de inter&eacute;s como Lonja de los Pa&ntilde;os, Stadion Miejski Cracovii y Museo Nacional de Cracovia. El aeropuerto (Aeropuerto Internacional Juan Pablo II de Cracovia-Balice) est&aacute; a 15 km.
          <br />
          A las parejas les encanta la ubicaci&oacute;n &mdash; Le han puesto un 9,6 para viajes de dos personas.
          <br />
          Las distancias en la descripci&oacute;n del alojamiento se calculan con OpenStreetMap&copy;
        </p>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Servicios m&aacute;s populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Ban size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Habitaciones sin humo</span>
          </div>
          <div className="flex items-center gap-2">
            <Accessibility size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Adaptado personas de movilidad reducida</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Servicio de habitaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <Airplay size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Traslado aeropuerto</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">WiFi gratis</span>
          </div>
          <div className="flex items-center gap-2">
            <Car size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Parking privado</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Habitaciones familiares</span>
          </div>
          <div className="flex items-center gap-2">
            <Coffee size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Tetera/cafetera en todas las habitaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Desayuno excepcional</span>
          </div>
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-gray-800" />
            <span className="text-sm text-gray-800">Cuna gratis disponible bajo petici&oacute;n</span>
          </div>
        </div>
      </div>

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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
