import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NavbarMobile from "@/components/NavbarMobile";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const lusitana = Montserrat({
  subsets: ["latin"],
  variable: "--font-lusitana",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rustam Kerimov | Portfolio",
  description: "Graphic designer, Rustam Kerimov's portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lusitana.variable}>
        <Navbar />
        <NavbarMobile />
        {children}
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#ecebeb",
              color: "#1c1a17",
              border: "1px solid #ecebeb",
            },
            success: {
              iconTheme: {
                primary: "#4ade80",
                secondary: "#1c1a17",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171",
                secondary: "#1c1a17",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
