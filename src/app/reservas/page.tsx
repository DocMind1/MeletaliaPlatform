"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import moment from "moment";
import Link from "next/link";
import Image from "next/image";

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
  Titulo?: string;
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
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");

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
      } else if (user.role?.id !== 4) {
        setError("No tienes permiso para ver esta página.");
        console.log("Usuario no tiene rol permitido (ni 4 ni 3)");
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

        setReservas(fetchedReservas.sort((a: Reservation, b: Reservation) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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
        const errorMessage = `Error al actualizar el estado: ${response.status} - ${errorData?.error?.message || "Sin detalles"}`;
        console.log(`Error al actualizar reserva: ${response.status} - ${JSON.stringify(errorData)}`);
        throw new Error(errorMessage);
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
      const errorMsg = (err as Error).message || "Error al actualizar el estado de la reserva";
      console.log(`Error en updateReservationStatus: ${errorMsg}`);
      setError(errorMsg);
    }
  };

  // Filtrar reservas según el estado seleccionado
  const filteredReservas = reservas.filter((reserva) => {
    if (filtroEstado === "todas") return true;
    if (filtroEstado === "pasadas") return moment(reserva.fechaFin).isBefore(moment());
    if (filtroEstado === "futuras") return moment(reserva.fechaFin).isSameOrAfter(moment());
    return reserva.estado === filtroEstado;
  });

  if (!user) {
    return <div className="container mx-auto p-6 text-red-600 text-center">Inicia sesión.</div>;
  }

  if (loading) {
    return <div className="container mx-auto p-6 text-gray-600 text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-6 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl text-black">
      <Link href="/" className="inline-flex items-center gap-3 mb-8">
        <Image src="/images/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
        <span className="text-lg font-medium text-gray-900">Maletalia.net</span>
      </Link>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isOwner ? "Reservas Recibidas" : "Mis Reservas"}
      </h1>

      {/* Filtro por estado */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFiltroEstado("todas")}
          className={`text-sm px-4 py-2 rounded-md ${filtroEstado === "todas" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltroEstado("futuras")}
          className={`text-sm px-4 py-2 rounded-md ${filtroEstado === "futuras" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Futuras
        </button>
        <button
          onClick={() => setFiltroEstado("pasadas")}
          className={`text-sm px-4 py-2 rounded-md ${filtroEstado === "pasadas" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Pasadas
        </button>
        <button
          onClick={() => setFiltroEstado("pendiente")}
          className={`text-sm px-4 py-2 rounded-md ${filtroEstado === "pendiente" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFiltroEstado("confirmada")}
          className={`text-sm px-4 py-2 rounded-md ${filtroEstado === "confirmada" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Confirmadas
        </button>
        <button
          onClick={() => setFiltroEstado("cancelada")}
          className={`text-sm px-4 py-2 rounded-md ${filtroEstado === "cancelada" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Canceladas
        </button>
        {isOwner && (
          <button
            onClick={() => setFiltroEstado("completada")}
            className={`text-sm px-4 py-2 rounded-md ${filtroEstado === "completada" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Completadas
          </button>
        )}
      </div>

      {filteredReservas.length === 0 ? (
        <p className="text-gray-900 text-center py-8 font-medium">
          {isOwner ? "No hay reservas recibidas." : "No tienes reservas."}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredReservas.map((reserva) => {
            const isPast = moment(reserva.fechaFin).isBefore(moment());
            return (
              <div
                key={reserva.id}
                className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                <div className="text-sm space-y-1">
                  <div>
                    <Link
                      href={`/detalle/${reserva.propiedad?.id || reserva.id}`}
                      className="text-blue-700 hover:underline font-semibold"
                    >
                      {reserva.propiedad?.Titulo || reserva.propiedad?.attributes?.Titulo || "N/A"}
                    </Link>
                  </div>
                  {isOwner && (
                    <div className="text-gray-600">
                      {reserva.usuario?.username || "N/A"} ({reserva.usuario?.email || "N/A"},{" "}
                      {(reserva.usuario?.countryCode || "") + (reserva.usuario?.phone || "N/A")})
                    </div>
                  )}
                  <div className="text-gray-600">
                    Reservado: {moment(reserva.createdAt).format("DD/MM/YYYY")} · Desde:{" "}
                    {moment(reserva.fechaInicio).format("DD/MM/YYYY")} · Hasta:{" "}
                    {moment(reserva.fechaFin).format("DD/MM/YYYY")}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {isOwner ? (
                    editando[reserva.id] ? (
                      <>
                        <select
                          value={estadoCambios[reserva.id] || reserva.estado}
                          onChange={(e) => handleEstadoChange(reserva.id, e.target.value)}
                          className="text-sm border-gray-300 rounded-md p-1.5 focus:ring-2 focus:ring-blue-300 outline-none"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="cancelada">Cancelada</option>
                          <option value="completada">Completada</option>
                        </select>
                        <button
                          onClick={() => updateReservationStatus(reserva.id)}
                          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                        >
                          Guardar
                        </button>
                      </>
                    ) : (
                      <>
                        <span
                          className={`text-sm capitalize px-3 py-1 rounded-full font-medium ${
                            reserva.estado === "confirmada"
                              ? "bg-green-100 text-green-800"
                              : reserva.estado === "completada"
                              ? "bg-gray-100 text-gray-800"
                              : reserva.estado === "cancelada"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {reserva.estado || "N/A"}
                        </span>
                        <button
                          onClick={() => toggleEditando(reserva.id)}
                          className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                        >
                          Editar
                        </button>
                      </>
                    )
                  ) : (
                    <span
                      className={`text-sm capitalize px-3 py-1 rounded-full font-medium ${
                        reserva.estado === "confirmada"
                          ? "bg-green-100 text-green-800"
                          : reserva.estado === "completada"
                          ? "bg-gray-100 text-gray-800"
                          : reserva.estado === "cancelada"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {reserva.estado || "N/A"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReservasPage;