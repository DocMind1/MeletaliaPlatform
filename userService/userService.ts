// userService.ts

interface Servicios {
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
}

export interface SearchPropertyFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  availableFrom?: string;
  availableTo?: string;
  services?: Partial<Servicios>;
}

export interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export interface PropertyBody {
  Titulo: string;
  Descripcion: string;
  Precio: number;
  Direccion: string;
  Pais?: string; // Nuevo campo
  ComunidadAutonoma?: string; // Nuevo campo
  Ciudad?: string; // Nuevo campo
  Numerodehabitaciones?: number;
  Numerodebanos?: number;
  publishedAt?: string;
  users_permissions_user: number;
  Imagenes?: number[];
  Servicios?: {
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
  Desayuno?: string[]; // Mantenemos como string[] para Strapi
  Caracteristicas?: {
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
  PuntosFuertes?: string;
  DisponibleDesde?: string;
  DisponibleHasta?: string;
}


export interface UpdateBody {
  countryCode?: string;
  phone?: string;
  identityDocument?: string;
  identityFiles?: string[];
  role?: number;
}


export interface PropertyBody {
  Titulo: string;
  Descripcion: string;
  Precio: number;
  Direccion: string;
  Numerodehabitaciones?: number;
  Numerodebanos?: number;
  publishedAt?: string;
  users_permissions_user: number;
  Imagenes?: number[];
  Servicios?: {
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
  Desayuno?: string[];
  Caracteristicas?: {
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
  PuntosFuertes?: string;
  DisponibleDesde?: string;
  DisponibleHasta?: string;
}


export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;



/////////////////BUSQUEDAS  .... 

export async function searchProperties(filters: SearchPropertyFilters) {
  try {
    let url = `${STRAPI_URL}/api/propiedades?populate=*`;

    if (filters.city) {
      url += `&filters[Direccion][$containsi]=${encodeURIComponent(filters.city)}`;
    }
    if (filters.minPrice) {
      url += `&filters[Precio][$gte]=${filters.minPrice}`;
    }
    if (filters.maxPrice) {
      url += `&filters[Precio][$lte]=${filters.maxPrice}`;
    }
    if (filters.availableFrom) {
      url += `&filters[DisponibleDesde][$gte]=${filters.availableFrom}`;
    }
    if (filters.availableTo) {
      url += `&filters[DisponibleHasta][$lte]=${filters.availableTo}`;
    }
    if (filters.services) {
      Object.entries(filters.services).forEach(([key, value]) => {
        if (value) {
          url += `&filters[Servicios][${key}][$eq]=true`;
        }
      });
    }

    console.log("Search URL:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Raw API response:", result);

    // Asegurarnos de que siempre devolvemos un array válido
    const properties = Array.isArray(result.data)
      ? result.data
      : (Array.isArray(result) ? result : []);
    
    console.log("Processed properties:", properties);
    return { ok: true, properties };
  } catch (error) {
    console.error("Error in searchProperties:", error);
    const errorMessage = error instanceof Error ? error.message : "Error en la conexión";
    return { ok: false, error: errorMessage };
  }
}
////////////////////////// PÁGINA PRINCIPAL 
export async function getAllProperties() {
  try {
    const url = `${STRAPI_URL}/api/propiedades?populate=*`;
    console.log("URL:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log("Raw API response for all properties:", result);
    
    // Verificar si result es un objeto con data o un array directamente
    const properties = Array.isArray(result.data)
      ? result.data
      : (Array.isArray(result) ? result : []);

    console.log("Processed all properties:", properties);
    return { ok: true, properties };
  } catch (error) {
    console.error("Error in getAllProperties:", error);
    const errorMessage = error instanceof Error ? error.message : "Error en la conexión";
    return { ok: false, error: errorMessage };
  }
}











///////////////////////////CREAR PROPIEDAD
export async function createProperty(data: PropertyBody, jwt: string | null) {
  try {
    console.log("Creando propiedad con datos:", JSON.stringify(data, null, 2), "JWT:", jwt);
    const response = await fetch(`${STRAPI_URL}/api/propiedades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ data }),
    });
    const result = await response.json();
    console.log("Respuesta del servidor:", result);
    if (response.ok) {
      console.log("Propiedad creada con éxito:", result);
      return { ok: true, property: result.data };
    } else {
      console.error("Error al crear propiedad:", result, "Status:", response.status);
      return { ok: false, error: result.error?.message || result.message || "Error desconocido al crear la propiedad" };
    }
  } catch (error) {
    console.error("Error de conexión al crear propiedad:", error);
    return { ok: false, error: "Error en la conexión al servidor" };
  }
}

export async function uploadDashboardImages(files: File[], jwt: string | null) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file, file.name);
  });
  try {
    console.log("Subiendo imágenes para el dashboard con JWT:", jwt); // Log para depuración
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });
    const result = await response.json();
    if (response.ok) {
      const ids = result.map((file: any) => file.id);
      return { ok: true, ids };
    } else {
      console.error("Error al subir imágenes para el dashboard:", result); // Log detallado
      return { ok: false, error: result.error?.message || result.message || "No se pudieron subir las imágenes" };
    }
  } catch (error) {
    console.error("Error de conexión al subir imágenes para el dashboard:", error);
    return { ok: false, error: "Error en la conexión al servidor" };
  }
}


// userService.ts

/////////////////////////// LISTAR PROPIEDADES



export async function getProperties(jwt: string | null, userId: number) {
  try {
    const url = `${STRAPI_URL}/api/propiedades?filters[users_permissions_user][id][$eq]=${userId}&populate=*`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const result = await response.json();
    console.log("Raw API response:", result);
    if (response.ok) {
      // Strapi v5 returns the array directly, not wrapped in "results"
      const properties = Array.isArray(result) ? result : (result.results || []);
      console.log("Processed properties:", properties);
      return { ok: true, properties };
    } else {
      console.error("Error fetching properties:", result);
      return { ok: false, error: result.error?.message || result.message };
    }
  } catch (error) {
    console.error("Error in getProperties:", error);
    return { ok: false, error: "Error en la conexión" };
  }
}



/////////////////////////// ELIMINAR PROPIEDAD
export async function deleteProperty(id: number, jwt: string | null) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/propiedades/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const result = await response.json();
    if (response.ok) {
      return { ok: true };
    } else {
      return { ok: false, error: result.error?.message || result.message };
    }
  } catch (error) {
    return { ok: false, error: "Error en la conexión" };
  }
}

/////////////////////////// ACTUALIZAR PROPIEDAD
export async function updateProperty(id: number, data: PropertyBody, jwt: string | null) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/propiedades/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ data }),
    });
    const result = await response.json();
    if (response.ok) {
      return { ok: true, property: result.data };
    } else {
      return { ok: false, error: result.error?.message || result.message };
    }
  } catch (error) {
    return { ok: false, error: "Error en la conexión" };
  }
}




///////////////////////////REGISTRAR USUARIOS 
export async function registerUser(data: RegisterBody) {
  try {
    console.log("Datos enviados a /api/auth/local/register:", data);
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      return { ok: true, user: result.user, jwt: result.jwt };
    } else {
      console.log("Error de Strapi:", result);
      return { ok: false, error: result.error?.message || result.message || "Error desconocido" };
    }
  } catch (error) {
    console.error("Error en la conexión:", error);
    return { ok: false, error: "Error en la conexión" };
  }
}

export async function updateUser(userId: string, data: UpdateBody, jwt: string | null) {
  try {
    console.log("Datos enviados a /api/users/:id:", data); // Log para depuración
    const response = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      return { ok: true, user: result };
    } else {
      console.log("Error de Strapi en updateUser:", result);
      return { ok: false, error: result.error?.message || result.message };
    }
  } catch (error) {
    console.error("Error en la conexión:", error);
    return { ok: false, error: "Error en la conexión" };
  }
}

export async function uploadFiles(files: File[], jwt: string | null) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file, file.name);
  });
  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });
    const result = await response.json();
    if (response.ok) {
      const ids = result.map((file: any) => file.id);
      return { ok: true, ids };
    } else {
      return { ok: false, error: result.error?.message || result.message };
    }
  } catch (error) {
    return { ok: false, error: "Error en la conexión" };
  }
}