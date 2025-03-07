"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import moment from "moment";
import Link from "next/link";

interface User {
  id: number;
  username: string;
  email: string;
  countryCode?: string;
  phone?: string;
}

interface Property {
  id: number;
  attributes?: {
    Titulo: string;
  };
  Titulo?: string; // Para casos donde no hay attributes
}

interface Reservation {
  id: number;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
  createdAt: string;
  propiedad?: Property;
  usuario?: User;
}

interface AuthUser {
  id: number;
  jwt: string;
  role?: { id: number };
}

const ReservasPage: React.FC = () => {
  const { user } = useAuth() as { user: AuthUser | null };
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [editando, setEditando] = useState<{ [key: number]: boolean }>({});
  const [estadoCambios, setEstadoCambios] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      setError(null);
      console.log("Iniciando fetchReservas");

      if (!user) {
        setError("Debes iniciar sesión para ver tus reservas.");
        console.log("Usuario no autenticado");
        setLoading(false);
        return;
      }

      console.log(`Usuario autenticado: ID=${user.id}, Role=${user.role?.id}`);
      if (user.role?.id === 3) {
        setIsOwner(true);
        console.log("Usuario es Propietario (role.id=3)");
      } else if (user.role?.id !== 2) {
        setError("No tienes permiso para ver esta página.");
        console.log("Usuario no tiene rol permitido (ni 2 ni 3)");
        setLoading(false);
        return;
      }

      try {
        let url = "";
        if (user.role?.id === 3) {
          console.log("Obteniendo propiedades del propietario...");
          const propiedadesResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/propiedades?filters[users_permissions_user][$eq]=${user.id}&populate=*`,
            {
              headers: { Authorization: `Bearer ${user.jwt}` },
            }
          );

          if (!propiedadesResponse.ok) {
            const errorText = await propiedadesResponse.text();
            console.log(`Error fetching properties: ${propiedadesResponse.status} - ${errorText}`);
            throw new Error("Error al cargar las propiedades");
          }

          const propiedadesData = await propiedadesResponse.json();
          console.log(`Propiedades response: ${JSON.stringify(propiedadesData)}`);

          let propiedades: Property[] = [];
          if (Array.isArray(propiedadesData)) {
            propiedades = propiedadesData;
          } else if (propiedadesData?.data) {
            propiedades = propiedadesData.data || [];
          } else {
            propiedades = [];
          }

          console.log(`Propiedades procesadas: ${JSON.stringify(propiedades)}`);

          if (propiedades.length === 0) {
            console.log("No se encontraron propiedades para este usuario.");
            setReservas([]);
            setLoading(false);
            return;
          }

          const propiedadIds = propiedades
            .map((prop) => prop.id || (prop.attributes && prop.id))
            .filter((id): id is number => id !== undefined);
          console.log(`Property IDs: ${propiedadIds}`);

          if (propiedadIds.length === 0) {
            console.log("No se extrajeron IDs de propiedades.");
            setReservas([]);
            setLoading(false);
            return;
          }

          const filterParams = propiedadIds.map((id, index) => `filters[propiedad][$in][${index}]=${id}`).join("&");
          url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas?${filterParams}&populate[propiedad]=true&populate[usuario][fields][0]=id&populate[usuario][fields][1]=username&populate[usuario][fields][2]=email&populate[usuario][fields][3]=countryCode&populate[usuario][fields][4]=phone`;
          console.log(`URL de reservas: ${url}`);
        } else {
          url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas?filters[usuario][$eq]=${user.id}&populate[propiedad]=true&populate[usuario][fields][0]=id&populate[usuario][fields][1]=username&populate[usuario][fields][2]=email&populate[usuario][fields][3]=countryCode&populate[usuario][fields][4]=phone`;
          console.log(`URL de reservas para usuario: ${url}`);
        }

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(`Error fetching reservations: ${response.status} - ${JSON.stringify(errorData)}`);
          throw new Error(`Error al cargar las reservas: ${response.status} ${errorData?.error?.message || "Sin detalles"}`);
        }

        const data = await response.json();
        console.log(`Reservations response: ${JSON.stringify(data)}`);

        const fetchedReservas: Reservation[] = Array.isArray(data) ? data : (data.data || []);
        console.log(`Reservas procesadas: ${JSON.stringify(fetchedReservas)}`);

        setReservas(fetchedReservas);
        setLoading(false);
      } catch (err) {
        console.log(`Error en fetchReservas: ${(err as Error).message}`);
        setError((err as Error).message || "Error al cargar las reservas");
        setReservas([]);
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user]);

  const handleEstadoChange = (reservaId: number, newStatus: string) => {
    setEstadoCambios((prev) => ({
      ...prev,
      [reservaId]: newStatus,
    }));
  };

  const toggleEditando = (reservaId: number) => {
    setEditando((prev) => ({
      ...prev,
      [reservaId]: !prev[reservaId],
    }));
  };

  const updateReservationStatus = async (reservaId: number) => {
    if (!user || !isOwner) {
      setError("No tienes permiso para realizar esta acción.");
      console.log("Usuario no autenticado o no es propietario");
      return;
    }

    const reservaToUpdate = reservas.find((reserva) => reserva.id === reservaId);
    if (!reservaToUpdate) {
      setError("Reserva no encontrada");
      console.log(`Reserva con ID ${reservaId} no encontrada`);
      return;
    }

    const newStatus = estadoCambios[reservaId] || reservaToUpdate.estado;
    console.log(`Iniciando actualización de reserva ID ${reservaId} al estado: ${newStatus}`);
    console.log(`Reserva antes de actualizar: ${JSON.stringify(reservaToUpdate)}`);

    try {
      const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas/${reservaId}`;
      console.log(`Enviando solicitud PUT a: ${url}`);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({
          data: {
            estado: newStatus,
            fechaInicio: reservaToUpdate.fechaInicio,
            fechaFin: reservaToUpdate.fechaFin,
            propiedad: reservaToUpdate.propiedad?.id,
            usuario: reservaToUpdate.usuario?.id,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Error al actualizar reserva: ${response.status} - ${JSON.stringify(errorData)}`);
        throw new Error(`Error al actualizar el estado de la reserva: ${response.status} - ${errorData?.error?.message || "Sin detalles"}`);
      }

      const updatedReserva = await response.json();
      console.log(`Reserva actualizada exitosamente: ${JSON.stringify(updatedReserva)}`);

      setReservas((prevReservas) =>
        prevReservas.map((reserva) =>
          reserva.id === reservaId ? { ...reserva, estado: newStatus } : reserva
        )
      );
      setEditando((prev) => ({ ...prev, [reservaId]: false }));
      setEstadoCambios((prev) => {
        const newCambios = { ...prev };
        delete newCambios[reservaId];
        return newCambios;
      });
      setError(null);
    } catch (err) {
      console.log(`Error en updateReservationStatus: ${(err as Error).message}`);
      setError((err as Error).message || "Error al actualizar el estado de la reserva");
    }
  };

  if (!user) {
    return <div className="container mx-auto p-4 text-red-500">Por favor, inicia sesión.</div>;
  }

  if (loading) {
    return <div className="container mx-auto p-4">Cargando...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isOwner ? "Mis Reservas Recibidas" : "Mis Reservas"}
      </h1>

      {reservas.length === 0 ? (
        <p>{isOwner ? "No tienes reservas recibidas." : "No has realizado ninguna reserva."}</p>
      ) : (
        <div className="grid gap-4">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="border p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p>
                  <Link
                    href={`/detalle/${reserva.propiedad?.id || reserva.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {reserva.propiedad?.Titulo || reserva.propiedad?.attributes?.Titulo || "N/A"}
                  </Link>{" "}
                  - {isOwner ? (
                    <>
                      {reserva.usuario?.username || "N/A"} ({reserva.usuario?.email || "N/A"},{" "}
                      {(reserva.usuario?.countryCode || "") + (reserva.usuario?.phone || "N/A")})
                    </>
                  ) : (
                    reserva.usuario?.username || "N/A"
                  )}{" "}
                  - Reservado el: {moment(reserva.createdAt).format("YYYY-MM-DD")} - Desde:{" "}
                  {moment(reserva.fechaInicio).format("YYYY-MM-DD")} Hasta:{" "}
                  {moment(reserva.fechaFin).format("YYYY-MM-DD")} - Estado:{" "}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {isOwner ? (
                  editando[reserva.id] ? (
                    <>
                      <select
                        value={estadoCambios[reserva.id] || reserva.estado}
                        onChange={(e) => handleEstadoChange(reserva.id, e.target.value)}
                        className="border rounded p-1"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                      </select>
                      <button
                        onClick={() => updateReservationStatus(reserva.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Grabar
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={reserva.estado || "N/A"}
                        disabled
                        className="border rounded p-1 bg-gray-200"
                      />
                      <button
                        onClick={() => toggleEditando(reserva.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Editar
                      </button>
                    </>
                  )
                ) : (
                  <span>{reserva.estado || "N/A"}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservasPage;