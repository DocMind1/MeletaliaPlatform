"use client";

import React, { useState } from "react"; // Eliminamos useContext porque usaremos useAuth
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaGlobe, FaPhone, FaIdCard } from "react-icons/fa";
import { registerUser, updateUser, uploadFiles } from "../../../userService/userService";
import { useAuth } from "../context/AuthContext"; // Usamos useAuth en lugar de AuthContext directamente

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

interface UpdateBody {
  countryCode?: string;
  phone?: string;
  identityDocument?: string;
  identityFiles?: string[];
  role?: number;
}

export default function Registro() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    countryCode: "",
    phone: "",
    identityDocument: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStepOneComplete, setIsStepOneComplete] = useState(false);
  const [tempData, setTempData] = useState<RegisterBody | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { setUser } = useAuth(); // Cambiamos a useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const validateStepOneFields = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio.";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
      valid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
      valid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      valid = false;
    }
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleStepOne = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStepOneFields()) {
      setMensaje("Por favor, corrige los errores del formulario.");
      return;
    }

    if (formData.role === "Propietario") {
      setMensaje("Recuerda: Al registrarte como 'Ofrezco una estancia', tu cuenta estará pendiente de aprobación.");
    }

    setLoading(true);
    setMensaje("");

    const registerData: RegisterBody = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
    setTempData(registerData);
    setIsStepOneComplete(true);
    setLoading(false);
    setMensaje("Paso 1 completado. Completa los datos adicionales para finalizar el registro.");
  };

  const validateStepTwoFields = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};
    if (!formData.countryCode.trim()) {
      newErrors.countryCode = "El código de país es obligatorio.";
      valid = false;
    } else {
      const countryCodeRegex = /^\+\d{1,4}$/;
      if (!countryCodeRegex.test(formData.countryCode)) {
        newErrors.countryCode = "El código de país debe ser como '+34' (máximo 4 dígitos).";
        valid = false;
      }
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio.";
      valid = false;
    } else {
      const phoneCleaned = formData.phone.replace(/\s/g, "");
      const phoneRegex = /^\d{6,15}$/;
      if (!phoneRegex.test(phoneCleaned)) {
        newErrors.phone = "El teléfono debe contener solo números (6-15 dígitos).";
        valid = false;
      }
    }
    if (formData.role === "Propietario") {
      if (!formData.identityDocument.trim()) {
        newErrors.identityDocument = "El documento de identidad es obligatorio para Propietarios.";
        valid = false;
      }
      if (files.length === 0) {
        newErrors.files = "Debes adjuntar al menos un archivo para Propietarios.";
        valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  };

  const handleStepTwo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStepTwoFields()) {
      setMensaje("Por favor, corrige los errores del formulario.");
      return;
    }

    setLoading(true);
    setMensaje("");

    const roleId = formData.role === "Propietario" ? 3 : 4;

    if (!tempData) {
      setMensaje("Error: No se encontraron datos del paso 1.");
      setLoading(false);
      return;
    }

    const registerData: RegisterBody = { ...tempData };

    try {
      const registerResult = await registerUser(registerData);
      if (!registerResult.ok) {
        throw new Error("Error en el registro: " + registerResult.error);
      }

      const userId = registerResult.user.id;
      const jwt = registerResult.jwt;

      const updateData: UpdateBody = {
        countryCode: formData.countryCode,
        phone: formData.phone.replace(/\s/g, ""),
        role: roleId,
      };

      if (formData.role === "Propietario") {
        updateData.identityDocument = formData.identityDocument;
      }

      if (files.length > 0 && formData.role === "Propietario") {
        const uploadResult = await uploadFiles(files, jwt);
        if (!uploadResult.ok) {
          throw new Error("Error al subir archivos: " + uploadResult.error);
        }
        updateData.identityFiles = uploadResult.ids.map(String);
      }

      const updateResult = await updateUser(userId.toString(), updateData, jwt);
      if (!updateResult.ok) {
        throw new Error("Error al actualizar datos: " + updateResult.error);
      }

      // Guardar datos en localStorage y actualizar AuthContext
      const sessionData = {
        ...registerResult.user,
        jwt: registerResult.jwt,
        role: { id: roleId },
      };
      localStorage.setItem("userSession", JSON.stringify(sessionData));
      setUser(sessionData);

      if (formData.role === "Propietario") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setMensaje(err instanceof Error ? err.message : "Error al completar el registro, intenta de nuevo.");
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `mt-1 block w-full border rounded-md p-2 ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="max-w-lg mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Registro de Usuario</h1>
      {!isStepOneComplete ? (
        <form
          onSubmit={handleStepOne}
          className={`space-y-6 ${loading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaUser /> Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={inputClass("username")}
            />
            {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaEnvelope /> Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass("email")}
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaLock /> Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={inputClass("password")}
              />
              {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaLock /> Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={inputClass("confirmPassword")}
              />
              {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Selecciona tu rol
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Cliente">Quiero una estancia</option>
              <option value="Propietario">Ofrezco una estancia</option>
            </select>
            {formData.role === "Propietario" && (
              <p className="text-gray-600 text-xs mt-1">
                Al registrarte como Propietario, tu cuenta estará pendiente de aprobación.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md flex justify-center items-center ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              "Continuar al paso 2"
            )}
          </button>
        </form>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Paso 2: Completa tus datos adicionales</h2>
          <form
            onSubmit={handleStepTwo}
            className={`space-y-6 ${loading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div>
              <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaGlobe /> Código de país
              </label>
              <input
                type="text"
                id="countryCode"
                name="countryCode"
                placeholder="+34"
                value={formData.countryCode}
                onChange={handleChange}
                required
                className={inputClass("countryCode")}
              />
              {errors.countryCode && <span className="text-red-500 text-xs">{errors.countryCode}</span>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaPhone /> Teléfono móvil
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="600123456"
                value={formData.phone}
                onChange={handleChange}
                required
                className={inputClass("phone")}
              />
              {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
            </div>
            {formData.role === "Propietario" && (
              <>
                <div>
                  <label htmlFor="identityDocument" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaIdCard /> Documento de identidad
                  </label>
                  <input
                    type="text"
                    id="identityDocument"
                    name="identityDocument"
                    value={formData.identityDocument}
                    onChange={handleChange}
                    required
                    className={inputClass("identityDocument")}
                    placeholder="Ej: 12345678Z"
                  />
                  {errors.identityDocument && <span className="text-red-500 text-xs">{errors.identityDocument}</span>}
                </div>
                <div>
                  <label htmlFor="files" className="block text-sm font-medium text-gray-700">
                    Copia del documento (PDF o imagen)
                  </label>
                  <input
                    type="file"
                    id="files"
                    name="files"
                    multiple
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    required
                    className={`${errors.files ? "border-red-500" : "border-gray-300"} mt-1 block w-full`}
                  />
                  {errors.files && <span className="text-red-500 text-xs">{errors.files}</span>}
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md flex justify-center items-center ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                "Finalizar registro"
              )}
            </button>
          </form>
        </>
      )}
      {mensaje && (
        <div className="mt-4 p-4 border rounded-md text-center">{mensaje}</div>
      )}
    </div>
  );
}