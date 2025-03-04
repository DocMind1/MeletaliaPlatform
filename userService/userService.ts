// userService.ts
export interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export interface UpdateBody {
  countryCode?: string;
  phone?: string;
  identityDocument?: string;
  identityFiles?: string[];
  role?: number; // El rol solo se envía en updateUser
}

export interface PropertyBody {
  titulo: string;
  descripcion: string;
  precio: number;
  direccion: string;
  numerodehabitaciones?: number;
  numerodebanos?: number;
  users_permissions_user: number;
  imagenes?: number[];
}



const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;



///////////////////////////CREAR PROPIEDAD

export async function createProperty(data: PropertyBody, jwt: string | null) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/propiedades`, {
      method: "POST",
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