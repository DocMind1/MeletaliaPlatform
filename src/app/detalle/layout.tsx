// app/detalle/layout.tsx
"use client";
import React, { ReactNode } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

interface DetalleLayoutProps {
  children: ReactNode;
}

export default function DetalleLayout({ children }: DetalleLayoutProps) {
  return (
    <>
      <SearchBar />
      {children}
   
    </>
  );
}
