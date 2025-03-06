"use client";

import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../context/AuthContext";

const localizer = momentLocalizer(moment);

interface ReservationEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  propiedad: string;
  estado: string;
}

export default function ReservationsDashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationEvent[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [mensajeType, setMensajeType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    // Verificar si user existe antes de hacer la solicitud
    if (!user || !user.id || !user.jwt) {
      setMensaje("Debes iniciar sesión para ver las reservas.");
      setMensajeType("error");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/propiedades?filters[users_permissions_user][$eq]=${user.id}&populate=*`, {
      headers: {
        Authorization: `Bearer ${user.jwt}`,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const propertyIds = data.data.map((prop: any) => prop.id);

        const reservationsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas?filters[propiedad][$in]=${propertyIds.join(",")}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${user.jwt}`,
            },
          }
        );
        const reservationsData = await reservationsResponse.json();

        const events = reservationsData.data.map((reserva: any) => ({
          id: reserva.id,
          title: `Reserva para ${reserva.attributes.propiedad.data.attributes.Titulo} (${reserva.attributes.estado})`,
          start: new Date(reserva.attributes.fechaInicio),
          end: new Date(reserva.attributes.fechaFin),
          propiedad: reserva.attributes.propiedad.data.attributes.Titulo,
          estado: reserva.attributes.estado,
        }));

        setReservations(events);
      })
      .catch((err) => {
        setMensaje("Error al cargar las reservas.");
        setMensajeType("error");
        console.error(err);
      });
  }, [user]);

  const handleReservationAction = async (reservationId: number, action: "confirm" | "cancel") => {
    if (!user || !user.jwt) {
      setMensaje("Debes iniciar sesión para realizar esta acción.");
      setMensajeType("error");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas/${reservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({
          data: {
            estado: action === "confirm" ? "confirmada" : "cancelada",
          },
        }),
      });

      if (response.ok) {
        setMensaje(`Reserva ${action === "confirm" ? "confirmada" : "cancelada"} con éxito.`);
        setMensajeType("success");
        setReservations((prev) =>
          prev.map((event) =>
            event.id === reservationId
              ? { ...event, estado: action === "confirm" ? "confirmada" : "cancelada", title: `${event.title.split(" (")[0]} (${action === "confirm" ? "confirmada" : "cancelada"})` }
              : event
          )
        );
      } else {
        const result = await response.json();
        setMensaje(result.error?.message || `Error al ${action === "confirm" ? "confirmar" : "cancelar"} la reserva.`);
        setMensajeType("error");
      }
    } catch (error) {
      setMensaje("Error en la conexión al servidor.");
      setMensajeType("error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {mensaje && (
        <div
          className={`fixed top-20 right-6 px-6 py-3 rounded-md shadow-lg text-white transition-opacity duration-300 ${
            mensajeType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {mensaje}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>
      <Calendar
        localizer={localizer}
        events={reservations}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event: ReservationEvent) => {
          if (event.estado === "pendiente") {
            if (window.confirm(`¿Confirmar reserva para ${event.propiedad}?`)) {
              handleReservationAction(event.id, "confirm");
            } else if (window.confirm(`¿Cancelar reserva para ${event.propiedad}?`)) {
              handleReservationAction(event.id, "cancel");
            }
          }
        }}
      />
    </div>
  );
}