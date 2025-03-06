"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext, useAuth } from "../context/AuthContext";
import {
  createProperty,
  uploadDashboardImages,
  getProperties,
  deleteProperty,
  updateProperty,
  STRAPI_URL,
} from "../../../userService/userService";


// Interfaz Property actualizada con fechas de disponibilidad
interface Property {
  id: number;
  documentId: string;
  Titulo: string;
  Descripcion: string;
  Precio: number;
  Direccion: string;
  Numerodehabitaciones?: number;
  Numerodebanos?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  locale: string | null;
  Imagenes?: Array<{
    id: number;
    url: string;
    alternativeText: string | null;
    caption: string | null;
    formats: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  }>;
  users_permissions_user: {
    id: number;
    username: string;
    email: string;
  };
  Servicios: {
    WiFi: boolean;
    Parking: boolean;
    AdaptadoMovilidadReducida: boolean;
    Piscina: boolean;
    Gimnasio: boolean;
    Spa: boolean;
    Restaurante: boolean;
    Bar: boolean;
    Lavanderia: boolean;
    Recepcion24h: boolean;
    TransporteAeropuerto: boolean;
    ServicioHabitaciones: boolean;
    AdmiteMascotas: boolean;
    ZonasFumadores: boolean;
    AireAcondicionadoComun: boolean;
    CalefaccionComun: boolean;
    SalaConferencias: boolean;
    AreaJuegosInfantiles: boolean;
    Biblioteca: boolean;
    Jardin: boolean;
  };
  Desayuno: string[];
  Caracteristicas: {
    Terraza: boolean;
    VistasPanoramicas: boolean;
    AireAcondicionado: boolean;
    Calefaccion: boolean;
    Minibar: boolean;
    TVPantallaPlana: boolean;
    CajaFuerte: boolean;
    Escritorio: boolean;
    Banera: boolean;
    Ducha: boolean;
    SecadorPelo: boolean;
    ArticulosAseo: boolean;
    Armario: boolean;
    Insonorizacion: boolean;
    Cafetera: boolean;
    HervidorElectrico: boolean;
    Microondas: boolean;
    Nevera: boolean;
    CamaExtraGrande: boolean;
    ServicioStreaming: boolean;
  };
  PuntosFuertes: string;
  DisponibleDesde?: string;
  DisponibleHasta?: string;
}

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    Titulo: "",
    Descripcion: "",
    Precio: "",
    Direccion: "",
    Numerodehabitaciones: "",
    Numerodebanos: "",
    publishedAt: "",
    imagenes: null as FileList | null,
    Servicios: {
      WiFi: false,
      Parking: false,
      AdaptadoMovilidadReducida: false,
      Piscina: false,
      Gimnasio: false,
      Spa: false,
      Restaurante: false,
      Bar: false,
      Lavanderia: false,
      Recepcion24h: false,
      TransporteAeropuerto: false,
      ServicioHabitaciones: false,
      AdmiteMascotas: false,
      ZonasFumadores: false,
      AireAcondicionadoComun: false,
      CalefaccionComun: false,
      SalaConferencias: false,
      AreaJuegosInfantiles: false,
      Biblioteca: false,
      Jardin: false,
    },
    Desayuno: [] as string[],
    Caracteristicas: {
      Terraza: false,
      VistasPanoramicas: false,
      AireAcondicionado: false,
      Calefaccion: false,
      Minibar: false,
      TVPantallaPlana: false,
      CajaFuerte: false,
      Escritorio: false,
      Banera: false,
      Ducha: false,
      SecadorPelo: false,
      ArticulosAseo: false,
      Armario: false,
      Insonorizacion: false,
      Cafetera: false,
      HervidorElectrico: false,
      Microondas: false,
      Nevera: false,
      CamaExtraGrande: false,
      ServicioStreaming: false,
    },
    PuntosFuertes: "",
    DisponibleDesde: "",
    DisponibleHasta: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [mensajeType, setMensajeType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  const jwt = user?.jwt || null;
  const userId = user ? parseInt(user.id.toString(), 10) : 0;
  
  useEffect(() => {
    if (jwt && userId) {
      loadProperties();
    }
  }, [jwt, userId]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje("");
        setMensajeType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const loadProperties = async () => {
    setIsLoadingProperties(true);
    const result = await getProperties(jwt, userId);
    if (result.ok) {
      setProperties(result.properties || []);
    } else {
      setMensaje("Error al cargar propiedades");
      setMensajeType("error");
      setProperties([]);
    }
    setIsLoadingProperties(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      if (name in formData.Servicios) {
        setFormData({
          ...formData,
          Servicios: { ...formData.Servicios, [name]: checked },
        });
      } else if (name in formData.Caracteristicas) {
        setFormData({
          ...formData,
          Caracteristicas: { ...formData.Caracteristicas, [name]: checked },
        });
      }
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = e.target.files;
      // Validar que no se suban más de 8 imágenes
      if (selectedFiles.length > 8) {
        setMensaje("No puedes subir más de 8 imágenes.");
        setMensajeType("error");
        // Limpiar el input para evitar que se procesen más de 8 imágenes
        e.target.value = "";
        return;
      }
      setFormData({ ...formData, imagenes: selectedFiles });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      let imageIds: number[] | undefined;

      if (formData.imagenes) {
        const uploadResult = await uploadDashboardImages(
          Array.from(formData.imagenes),
          jwt
        );
        if (uploadResult.ok) {
          imageIds = uploadResult.ids;
        } else {
          setMensaje(`Error al subir imágenes: ${uploadResult.error}`);
          setMensajeType("error");
          setLoading(false);
          return;
        }
      }

      const propertyData = {
        Titulo: formData.Titulo,
        Descripcion: formData.Descripcion,
        Precio: parseFloat(formData.Precio),
        Direccion: formData.Direccion,
        Numerodehabitaciones: formData.Numerodehabitaciones
          ? parseInt(formData.Numerodehabitaciones)
          : undefined,
        Numerodebanos: formData.Numerodebanos
          ? parseInt(formData.Numerodebanos)
          : undefined,
        publishedAt: formData.publishedAt
          ? `${formData.publishedAt}T00:00:00.000Z`
          : undefined,
        DisponibleDesde: formData.DisponibleDesde
          ? `${formData.DisponibleDesde}T00:00:00.000Z`
          : undefined,
        DisponibleHasta: formData.DisponibleHasta
          ? `${formData.DisponibleHasta}T00:00:00.000Z`
          : undefined,
        users_permissions_user: userId,
        Imagenes: imageIds,
        Servicios: formData.Servicios,
        Desayuno: formData.Desayuno,
        Caracteristicas: formData.Caracteristicas,
        PuntosFuertes: formData.PuntosFuertes,
      };

      const result = editingProperty
        ? await updateProperty(editingProperty.id, propertyData, jwt)
        : await createProperty(propertyData, jwt);

      if (result.ok) {
        setMensaje(
          editingProperty
            ? "Propiedad actualizada con éxito."
            : "Propiedad creada con éxito."
        );
        setMensajeType("success");
        setShowModal(false);
        setEditingProperty(null);
        await loadProperties();
      } else {
        setMensaje(`Error: ${result.error}`);
        setMensajeType("error");
      }
    } catch (error) {
      setMensaje("Error en la conexión al servidor.");
      setMensajeType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteProperty(id, jwt);
    if (result.ok) {
      setMensaje("Propiedad eliminada con éxito.");
      setMensajeType("success");
      await loadProperties();
    } else {
      setMensaje(`Error al eliminar: ${result.error}`);
      setMensajeType("error");
    }
  };

  if (!user || user.role?.id !== 3) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-red-500 text-center">
          No tienes permiso para acceder a esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        {/* Contenido del header si lo necesitas */}
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto pt-24 pb-6 px-6">
        {/* Toast Notification */}
        {mensaje && (
          <div
            className={`fixed top-20 right-6 px-6 py-3 rounded-md shadow-lg text-white transition-opacity duration-300 ${mensajeType === "success" ? "bg-green-500" : "bg-red-500"
              }`}
          >
            {mensaje}
          </div>
        )}

        {/* Popup (Modal) para el Formulario */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4">
                {editingProperty ? "Editar Propiedad" : "Crear Propiedad"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="Titulo"
                    value={formData.Titulo}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>



      








                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción *
                  </label>
                  <textarea
                    name="Descripcion"
                    value={formData.Descripcion}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Precio (€) *
                  </label>
                  <input
                    type="number"
                    name="Precio"
                    value={formData.Precio}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="Direccion"
                    value={formData.Direccion}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Número de habitaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Número de habitaciones
                  </label>
                  <input
                    type="number"
                    name="Numerodehabitaciones"
                    value={formData.Numerodehabitaciones}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Número de baños */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Número de baños
                  </label>
                  <input
                    type="number"
                    name="Numerodebanos"
                    value={formData.Numerodebanos}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Fecha de publicación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de publicación
                  </label>
                  <input
                    type="date"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Fecha de Disponibilidad Desde */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Disponible Desde
                  </label>
                  <input
                    type="date"
                    name="DisponibleDesde"
                    value={formData.DisponibleDesde}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Fecha de Disponibilidad Hasta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Disponible Hasta
                  </label>
                  <input
                    type="date"
                    name="DisponibleHasta"
                    value={formData.DisponibleHasta}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Servicios */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Servicios
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.Servicios).map(
                      ([servicio, checked]) => (
                        <label
                          key={servicio}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            name={servicio}
                            checked={checked}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            {servicio
                              .replace(/([A-Z])/g, " $1")
                              .trim()
                              .replace("Adaptado Movilidad Reducida", "Adaptado movilidad reducida")
                              .replace("Recepcion24h", "Recepción 24h")
                              .replace("Aire Acondicionado Comun", "Aire acondicionado común")
                              .replace("Calefaccion Comun", "Calefacción común")
                              .replace("Area Juegos Infantiles", "Área juegos infantiles")}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
                {/* Opciones de Desayuno */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Opciones de Desayuno
                  </h3>
                  <select
                    multiple
                    name="Desayuno"
                    value={formData.Desayuno}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Continental">Continental</option>
                    <option value="Vegetariano">Vegetariano</option>
                    <option value="Vegano">Vegano</option>
                    <option value="Sin Gluten">Sin Gluten</option>
                    <option value="Buffet">Buffet</option>
                  </select>
                </div>
                {/* Características de las Habitaciones */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Características de las Habitaciones
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.Caracteristicas).map(
                      ([caracteristica, checked]) => (
                        <label
                          key={caracteristica}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            name={caracteristica}
                            checked={checked}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            {caracteristica
                              .replace(/([A-Z])/g, " $1")
                              .trim()
                              .replace("Vistas Panoramicas", "Vistas panorámicas")
                              .replace("TV Pantalla Plana", "TV pantalla plana")
                              .replace("Articulos Aseo", "Artículos de aseo")
                              .replace("Hervidor Electrico", "Hervidor eléctrico")
                              .replace("Cama Extra Grande", "Cama extra grande")
                              .replace("Servicio Streaming", "Servicio de streaming")}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
                {/* Puntos Fuertes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Puntos Fuertes
                  </label>
                  <textarea
                    name="PuntosFuertes"
                    value={formData.PuntosFuertes}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Imágenes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Imágenes (máximo 8)
                  </label>
                  <input
                    type="file"
                    name="imagenes"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                  />
                  <p className="text-sm text-gray-500">
                    Arrastra y suelta o haz clic para añadir hasta 8 imágenes.
                  </p>
                </div>
                {/* Botones */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-2 rounded-md flex justify-center items-center ${loading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                      } text-white transition duration-200`}
                  >
                    {loading
                      ? "Guardando..."
                      : editingProperty
                        ? "Actualizar Propiedad"
                        : "Crear Propiedad"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProperty(null);
                      setFormData({
                        Titulo: "",
                        Descripcion: "",
                        Precio: "",
                        Direccion: "",
                        Numerodehabitaciones: "",
                        Numerodebanos: "",
                        publishedAt: "",
                        imagenes: null,
                        Servicios: {
                          WiFi: false,
                          Parking: false,
                          AdaptadoMovilidadReducida: false,
                          Piscina: false,
                          Gimnasio: false,
                          Spa: false,
                          Restaurante: false,
                          Bar: false,
                          Lavanderia: false,
                          Recepcion24h: false,
                          TransporteAeropuerto: false,
                          ServicioHabitaciones: false,
                          AdmiteMascotas: false,
                          ZonasFumadores: false,
                          AireAcondicionadoComun: false,
                          CalefaccionComun: false,
                          SalaConferencias: false,
                          AreaJuegosInfantiles: false,
                          Biblioteca: false,
                          Jardin: false,
                        },
                        Desayuno: [],
                        Caracteristicas: {
                          Terraza: false,
                          VistasPanoramicas: false,
                          AireAcondicionado: false,
                          Calefaccion: false,
                          Minibar: false,
                          TVPantallaPlana: false,
                          CajaFuerte: false,
                          Escritorio: false,
                          Banera: false,
                          Ducha: false,
                          SecadorPelo: false,
                          ArticulosAseo: false,
                          Armario: false,
                          Insonorizacion: false,
                          Cafetera: false,
                          HervidorElectrico: false,
                          Microondas: false,
                          Nevera: false,
                          CamaExtraGrande: false,
                          ServicioStreaming: false,
                        },
                        PuntosFuertes: "",
                        DisponibleDesde: "",
                        DisponibleHasta: "",
                      });
                    }}
                    className="flex-1 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listado de Propiedades */}
        <div className="mt-8">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Mis Propiedades
            </h2>
            <button
              onClick={() => {
                setShowModal(true);
                setEditingProperty(null);
                setFormData({
                  Titulo: "",
                  Descripcion: "",
                  Precio: "",
                  Direccion: "",
                  Numerodehabitaciones: "",
                  Numerodebanos: "",
                  publishedAt: "",
                  imagenes: null,
                  Servicios: {
                    WiFi: false,
                    Parking: false,
                    AdaptadoMovilidadReducida: false,
                    Piscina: false,
                    Gimnasio: false,
                    Spa: false,
                    Restaurante: false,
                    Bar: false,
                    Lavanderia: false,
                    Recepcion24h: false,
                    TransporteAeropuerto: false,
                    ServicioHabitaciones: false,
                    AdmiteMascotas: false,
                    ZonasFumadores: false,
                    AireAcondicionadoComun: false,
                    CalefaccionComun: false,
                    SalaConferencias: false,
                    AreaJuegosInfantiles: false,
                    Biblioteca: false,
                    Jardin: false,
                  },
                  Desayuno: [],
                  Caracteristicas: {
                    Terraza: false,
                    VistasPanoramicas: false,
                    AireAcondicionado: false,
                    Calefaccion: false,
                    Minibar: false,
                    TVPantallaPlana: false,
                    CajaFuerte: false,
                    Escritorio: false,
                    Banera: false,
                    Ducha: false,
                    SecadorPelo: false,
                    ArticulosAseo: false,
                    Armario: false,
                    Insonorizacion: false,
                    Cafetera: false,
                    HervidorElectrico: false,
                    Microondas: false,
                    Nevera: false,
                    CamaExtraGrande: false,
                    ServicioStreaming: false,
                  },
                  PuntosFuertes: "",
                  DisponibleDesde: "",
                  DisponibleHasta: "",
                });
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Crear Nueva Propiedad
            </button>
          </div>
          {isLoadingProperties ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="ml-2 text-gray-600">
                Cargando propiedades...
              </span>
            </div>
          ) : properties.length === 0 ? (
            <p className="text-gray-600 text-center">
              No hay propiedades disponibles.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => {
                const imageUrl =
                  prop.Imagenes?.length && prop.Imagenes[0]?.url
                    ? prop.Imagenes[0].url
                    : null;

                return (
                  <div
                    key={prop.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={prop.Titulo}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          console.log(
                            `Error cargando imagen para ${prop.Titulo}: ${imageUrl}`
                          );
                          e.currentTarget.src = "/images/placeholder.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Sin imagen</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {prop.Titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Precio: €{prop.Precio.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Habitaciones: {prop.Numerodehabitaciones || "N/A"} |
                        Baños: {prop.Numerodebanos || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Creado: {new Date(prop.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Publicado:{" "}
                        {prop.publishedAt
                          ? new Date(prop.publishedAt).toLocaleDateString()
                          : "No publicado"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Disponible Desde:{" "}
                        {prop.DisponibleDesde
                          ? new Date(prop.DisponibleDesde).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Disponible Hasta:{" "}
                        {prop.DisponibleHasta
                          ? new Date(prop.DisponibleHasta).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {prop.Descripcion}
                      </p>
                    </div>
                    <div className="p-4 pt-0 flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingProperty(prop);
                          setShowModal(true);
                          setFormData({
                            Titulo: prop.Titulo,
                            Descripcion: prop.Descripcion,
                            Precio: prop.Precio.toString(),
                            Direccion: prop.Direccion,
                            Numerodehabitaciones:
                              prop.Numerodehabitaciones?.toString() || "",
                            Numerodebanos:
                              prop.Numerodebanos?.toString() || "",
                            publishedAt: prop.publishedAt
                              ? prop.publishedAt.split("T")[0]
                              : "",
                            imagenes: null,
                            Servicios: prop.Servicios || {
                              WiFi: false,
                              Parking: false,
                              AdaptadoMovilidadReducida: false,
                              Piscina: false,
                              Gimnasio: false,
                              Spa: false,
                              Restaurante: false,
                              Bar: false,
                              Lavanderia: false,
                              Recepcion24h: false,
                              TransporteAeropuerto: false,
                              ServicioHabitaciones: false,
                              AdmiteMascotas: false,
                              ZonasFumadores: false,
                              AireAcondicionadoComun: false,
                              CalefaccionComun: false,
                              SalaConferencias: false,
                              AreaJuegosInfantiles: false,
                              Biblioteca: false,
                              Jardin: false,
                            },
                            Desayuno: prop.Desayuno || [],
                            Caracteristicas: prop.Caracteristicas || {
                              Terraza: false,
                              VistasPanoramicas: false,
                              AireAcondicionado: false,
                              Calefaccion: false,
                              Minibar: false,
                              TVPantallaPlana: false,
                              CajaFuerte: false,
                              Escritorio: false,
                              Banera: false,
                              Ducha: false,
                              SecadorPelo: false,
                              ArticulosAseo: false,
                              Armario: false,
                              Insonorizacion: false,
                              Cafetera: false,
                              HervidorElectrico: false,
                              Microondas: false,
                              Nevera: false,
                              CamaExtraGrande: false,
                              ServicioStreaming: false,
                            },
                            PuntosFuertes: prop.PuntosFuertes || "",
                            DisponibleDesde: prop.DisponibleDesde
                              ? prop.DisponibleDesde.split("T")[0]
                              : "",
                            DisponibleHasta: prop.DisponibleHasta
                              ? prop.DisponibleHasta.split("T")[0]
                              : "",
                          });
                        }}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}