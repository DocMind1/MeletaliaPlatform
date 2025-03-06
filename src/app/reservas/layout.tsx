import type { Metadata } from "next";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Maletalia - Reservas",
  description: "Gestiona tus reservas",
  icons: "/favicon.ico",
};

export default function ReservasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        {children}
        <Footer />
      </div>
    </div>
  );
}