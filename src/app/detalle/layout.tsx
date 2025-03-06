"use client";
import React, { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";

interface DetalleLayoutProps {
  children: ReactNode;
}

export default function DetalleLayout({ children }: DetalleLayoutProps) {
  return (
    <>
    
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
