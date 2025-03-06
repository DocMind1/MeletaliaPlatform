"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definir la interfaz para el usuario
interface User {
  id: number;
  jwt: string;
  role?: { id: number };
}

// Definir la interfaz para el contexto
interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Crear el contexto con valores iniciales
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Crear el proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem("userSession");
    if (sessionData) {
      setUser(JSON.parse(sessionData));
    }
  }, []);

  // Guardar el usuario en localStorage cada vez que cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem("userSession", JSON.stringify(user));
    } else {
      localStorage.removeItem("userSession");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};