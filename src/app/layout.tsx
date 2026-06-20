import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import NavbarMobile from "@/components/NavbarMobile";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import PageTransitionProvider from "@/components/ClientPageTransitionWrapper";

export const metadata: Metadata = {
  title: "Rustam Kerimov | Portfolio",
  description: "Graphic designer, Rustam Kerimov's portfolio",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PageTransitionProvider>
          <Navbar />
          <NavbarMobile />
          {children}
          <Footer />
        </PageTransitionProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#ecebeb",
              color: "#1c1a17",
              border: "1px solid #ecebeb",
              fontFamily: "Satoshi, sans-serif",
            },
            success: {
              iconTheme: { primary: "#4ade80", secondary: "#1c1a17" },
            },
            error: {
              iconTheme: { primary: "#f87171", secondary: "#1c1a17" },
            },
          }}
        />
      </body>
    </html>
  );
}
