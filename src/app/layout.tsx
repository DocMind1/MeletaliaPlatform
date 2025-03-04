import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "../app/components/Header";
import Footer from "../app/components/Footer";
import { AuthProvider } from "./context/AuthContext"; // Ajusta la ruta si es necesario
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maletalia",
  description: "Casas y alojamientos rurales ",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
