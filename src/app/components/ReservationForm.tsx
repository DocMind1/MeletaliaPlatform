"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import moment from "moment";

interface ReservationFormProps {
  propertyId: string;
  availableFrom: string;
  availableUntil: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  propertyId,
  availableFrom,
  availableUntil,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!user || !propertyId) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/propiedades/${propertyId}?populate=users_permissions_user`,
          {
            headers: {
              Authorization: `Bearer ${user.jwt}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar la propiedad");
        }

        const propertyData = await response.json();
        console.log("Property data:", propertyData);

        // Determinar si el usuario autenticado es el propietario de la propiedad
        const propertyOwnerId = propertyData?.data?.attributes?.users_permissions_user?.data?.id;
        console.log("Property owner ID:", propertyOwnerId, "User ID:", user.id);
        setIsOwner(propertyOwnerId === user.id);
      } catch (err: any) {
        console.error("Error fetching property:", err);
        setError(err.message || "Error al verificar la propiedad");
      }
    };

    fetchProperty();
  }, [user, propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Debes iniciar sesión para hacer una reserva.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Por favor selecciona las fechas de inicio y fin.");
      return;
    }

    const start = moment(startDate);
    const end = moment(endDate);
    const availableFromDate = moment(availableFrom);
    const availableUntilDate = moment(availableUntil);

    if (start.isBefore(availableFromDate) || end.isAfter(availableUntilDate)) {
      setError("Las fechas seleccionadas no están dentro del rango disponible.");
      return;
    }

    if (end.isBefore(start) || end.isSame(start)) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({
          data: {
            propiedad: propertyId,
            fechaInicio: moment(startDate).format("YYYY-MM-DD"),
            fechaFin: moment(endDate).format("YYYY-MM-DD"),
            usuario: user.id,
            estado: isOwner ? "confirmada" : "pendiente",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la reserva");
      }

      const result = await response.json();
      console.log("Reservation creation response:", result);

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al crear la reserva");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Reservar Propiedad</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={availableFrom}
              max={availableUntil}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={moment(startDate).format("YYYY-MM-DD")}
              max={availableUntil}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Reservar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;