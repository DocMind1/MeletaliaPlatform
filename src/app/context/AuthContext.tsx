"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextProps {
  user: any;
  setUser: (user: any) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem("userSession");
    if (sessionData) {
      setUser(JSON.parse(sessionData));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
