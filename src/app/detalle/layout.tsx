"use client";
import React, { ReactNode } from "react";
import SearchBar from "../components/SearchBar";

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
