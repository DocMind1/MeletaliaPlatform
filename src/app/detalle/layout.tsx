"use client";
import React, { ReactNode } from "react";
import SearchBar from "../components/SearchBar";
import { AuthProvider } from "../context/AuthContext";

interface DetalleLayoutProps {
  children: ReactNode;
}

export default function DetalleLayout({ children }: DetalleLayoutProps) {
  return (
    <>
      <SearchBar />
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
