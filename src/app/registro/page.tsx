"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useAuth } from "../context/AuthContext";

interface PropertyDetail {
  id: number;
  attributes: {
    Titulo: string;
    Descripcion: string;
    Direccion: string;
    Precio: number;
    Imagenes?: Array<{ url: string }>;
  };
}

interface Reservation {
  id: number;
  attributes: {
    fechaInicio: string;
    fechaFin: string;
  };
}

export default function DetallePropiedad() {
  const params = useParams();
  const { id } = params || {};
  useAuth(); // Mantenemos el hook por posibles efectos secundarios
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]); // Restaurado para funcionalidad de fechas ocupadas
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/propiedades/${id}?populate=*`);
        const data = await res.json();
        setProperty(data.data);
      } catch {
        console.error("Error fetching property");
        console.log(occupiedDates);
      }
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas?filters[propiedad][$eq]=${id}`);
        const data = await res.json();
        const fetchedReservations: Reservation[] = data.data || [];
        setReservations(fetchedReservations);

        // Calculamos las fechas ocupadas a partir de las reservas
        const occupied = fetchedReservations.flatMap((reserva) => {
          const start = moment(reserva.attributes.fechaInicio);
          const end = moment(reserva.attributes.fechaFin);
          const dates: Date[] = [];
          for (let date = start; date <= end; date = date.clone().add(1, "days")) {
            dates.push(date.toDate());
          }
          return dates;
        });
        setOccupiedDates(occupied);
      } catch {
        console.error("Error fetching reservations");
      }
    };
    fetchReservations();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setEndDate(null);
    }
  }, [startDate, endDate]);

  if (!property) return <div>Cargando...</div>;

  const { Titulo, Descripcion, Direccion, Precio, Imagenes } = property.attributes;

  const images = useMemo(() => {
    return Imagenes && Imagenes.length > 0
      ? Imagenes.map((img: { url: string }) => ({ src: img.url, alt: Titulo }))
      : [{ src: "/images/placeholder.jpg", alt: Titulo }];
  }, [Imagenes, Titulo]);

  const isDateBlocked = (date: Date): boolean => {
    return reservations.some((reserva) => {
      const start = moment(reserva.attributes.fechaInicio);
      const end = moment(reserva.attributes.fechaFin);
      return moment(date).isBetween(start, end, undefined, "[]");
    });
  };

  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
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
      <p className="text-sm text-gray-600">{Direccion}</p>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2 relative">
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            width={800}
            height={400}
            className="rounded-lg w-full h-auto object-cover"
          />
          <button onClick={prevImage} className="absolute left-2 top-1/2">‹</button>
          <button onClick={nextImage} className="absolute right-2 top-1/2">›</button>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-base font-semibold">Descripción</h2>
          <p className="text-sm text-gray-800">{Descripcion}</p>
          <p className="text-xl font-bold">€ {Precio}</p>
          <button onClick={openModal} className="bg-black text-white px-6 py-3 mt-4">
            Ver fechas disponibles
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-lg font-bold">Selecciona las fechas</h2>
            <div className="flex flex-col gap-4">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => date && !isDateBlocked(date) && setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="p-2 border rounded w-full"
              />
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => date && !isDateBlocked(date) && setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300">Cancelar</button>
              <button onClick={handleConfirmDates} className="px-4 py-2 bg-black text-white">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}