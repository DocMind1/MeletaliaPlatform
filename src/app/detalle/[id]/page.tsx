"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import moment from "moment";
import {
  Accessibility,
  Bell,
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
import { useAuth } from "../../context/AuthContext";
import ReservationForm from "../../components/ReservationForm";
import Header from "@/app/components/Header";

interface Property {
  id: number;
  documentId?: string;
  Titulo: string;
  Descripcion: string;
  Direccion: string;
  Precio: number;
  Imagenes?: Array<{ url: string }>;
  DisponibleDesde?: string;
  DisponibleHasta?: string;
  Servicios?: {
    WiFi?: boolean;
    Parking?: boolean;
    AdaptadoMovilidadReducida?: boolean;
    Piscina?: boolean;
    Gimnasio?: boolean;
    Spa?: boolean;
    Restaurante?: boolean;
    Bar?: boolean;
    Lavanderia?: boolean;
    Recepcion24h?: boolean;
    AdmiteMascotas?: boolean;
    Jardin?: boolean;
  };
  Desayuno?: string[];
  Caracteristicas?: {
    Terraza?: boolean;
    VistasPanoramicas?: boolean;
    AireAcondicionado?: boolean;
    Calefaccion?: boolean;
    Minibar?: boolean;
    TVPantallaPlana?: boolean;
    CajaFuerte?: boolean;
    Escritorio?: boolean;
    Banera?: boolean;
    Ducha?: boolean;
    SecadorPelo?: boolean;
    ArticulosAseo?: boolean;
    Armario?: boolean;
    Insonorizacion?: boolean;
    Cafetera?: boolean;
    Nevera?: boolean;
    CamaExtraGrande?: boolean;
  };
  PuntosFuertes?: string;
  users_permissions_user?: {
    data: {
      id: number;
      attributes: {
        stripeAccountId?: string;
      };
    };
  };
}



interface Reservation {
  id: number;
  attributes: {
    estado: string;
    fechaInicio: string;
    fechaFin: string;
  };
}

export default function DetallePropiedad() {

  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]); // Se mantiene por si se usa en el futuro

  const params = useParams(); // Obtener los parámetros sin desestructurar directamente
  const propertyId = Array.isArray(params?.id) ? params?.id[0] : params?.id; // Manejar caso de array o string

  const images = useMemo(() => {
    if (!property) {
      return [{ src: "/images/placeholder.jpg", alt: "Propiedad sin título" }];
    }
    return property.Imagenes && property.Imagenes.length > 0
      ? property.Imagenes.map((img: { url: string }) => ({
        src: img.url,
        alt: property.Titulo,
      }))
      : [{ src: "/images/placeholder.jpg", alt: property.Titulo }];
  }, [property]);

  useEffect(() => {
    if (!propertyId) return;
    const finalURL = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/propiedades/${propertyId}?populate=*`;
    console.log("Fetching property from:", finalURL);
    fetch(finalURL)
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Strapi response:", data);
        if (data && data.data !== undefined) {
          setProperty(data.data);
        } else {
          setProperty(data);
        }
      })
      .catch((err) => console.error("Error fetching property:", err));
  }, [propertyId]);

  useEffect(() => {
    if (!propertyId) return;
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas?filters[propiedad][$eq]=${propertyId}&populate=*`)
      .then((res) => res.json())
      .then((data) => {
        const reservations: Reservation[] = data.data || [];
        const occupied = reservations
          .filter((res) => res.attributes.estado === "confirmada")
          .flatMap((res) => {
            const start = moment(res.attributes.fechaInicio);
            const end = moment(res.attributes.fechaFin);
            const dates: Date[] = [];
            for (let date = start; date <= end; date = date.clone().add(1, "days")) {
              dates.push(date.toDate());
            }
            return dates;
          });
        setOccupiedDates(occupied);
      })
      .catch((err) => {
        console.error("Error al cargar reservas:", err);
        setOccupiedDates([]);
      });
  }, [propertyId]);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  if (!propertyId) {
    return <div className="p-4">Error: ID de propiedad no encontrado.</div>;
  }

  if (!property) {
    return <div className="p-4">Cargando...</div>;
  }

  const {
    Titulo,
    Descripcion,
    Direccion,
    Precio,
    DisponibleDesde,
    DisponibleHasta,
    Servicios,
    Desayuno,
    Caracteristicas,
    PuntosFuertes,
  } = property;

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleReservationSuccess = () => {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas?filters[propiedad][$eq]=${propertyId}&populate=*`)
      .then((res) => res.json())
      .then((data) => {
        const reservations: Reservation[] = data.data || [];
        const occupied = reservations
          .filter((res) => res.attributes.estado === "confirmada")
          .flatMap((res) => {
            const start = moment(res.attributes.fechaInicio);
            const end = moment(res.attributes.fechaFin);
            const dates: Date[] = [];
            for (let date = start; date <= end; date = date.clone().add(1, "days")) {
              dates.push(date.toDate());
            }
            return dates;
          });
        setOccupiedDates(occupied);
      })
      .catch((err) => {
        console.error("Error al recargar reservas:", err);
        setOccupiedDates([]);
      });
  };

  console.log(occupiedDates);

  return (
    <div className="max-w-6xl mx-auto pl-4 pr-4 text-black">
      <Header />
      <h1 className="text-2xl font-bold mt-4  text-black ">{Titulo}</h1>
      <p className="text-sm text-black flex items-center gap-2 mt-2">
        <span className="text-black">📍</span>
        {Direccion} | Disponible desde: {DisponibleDesde ? new Date(DisponibleDesde).toLocaleDateString() : "No especificado"} | Disponible hasta: {DisponibleHasta ? new Date(DisponibleHasta).toLocaleDateString() : "No especificado"}
      </p>

      <div className="grid md:grid-cols-1 gap-4 mt-4">
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

      </div>








      <div className="mt-6">
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-base font-semibold">Descripción</h2>
          <p className="text-sm text-gray-800 mt-2">{Descripcion}</p>
          {PuntosFuertes && (
            <>
              <h2 className="text-base font-semibold mt-4">Puntos Fuertes</h2>
              <p className="text-sm text-gray-800 mt-2">{PuntosFuertes}</p>
            </>
          )}
        </div>
      </div>




      <div className="flex flex-col gap-4">

        <div className="bg-white p-4 rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold  text-black ">Precio</h2>
            <p className="text-xl font-bold text-gray-800 mt-2">€ {Precio}</p>
            <button
              onClick={openModal}
              className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-900 mt-4 "
            >
              Reservar
            </button>
          </div>
        </div>
      </div>




      <div className="mt-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <p className="text-sm text-gray-800 mb-4">
            Información adicional del alojamiento...
          </p>

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

      {isModalOpen && (
        <ReservationForm
          propertyId={propertyId}
          availableFrom={DisponibleDesde || ""}
          availableUntil={DisponibleHasta || ""}
          pricePerNight={Precio} // Agregar precio por noche
          isOwner={user?.id === (property?.users_permissions_user?.data?.id ?? null)}
          onClose={closeModal}
          onSuccess={handleReservationSuccess}
          occupiedDates={occupiedDates} // Pasar las fechas ocupadas
          ownerStripeId={null} />
      )}
    </div>
  );
}