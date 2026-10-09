import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/navbar/Navbar";
import NavbarMobile from "@/components/navbar/NavbarMobile";
import Footer from "@/components/Footer";

import PageTransitionProvider from "@/components/ClientPageTransitionWrapper";
import { ProjectNavProvider } from "@/components/ProjectNavContext";
import { HeroIntroProvider } from "@/components/HeroIntroContext";
import ContactOverlayProvider from "@/components/contact/ContactOverlayProvider";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Rustam Kerimov | Portfolio",
  description: "Graphic designer, Rustam Kerimov's portfolio",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PageTransitionProvider>
          <HeroIntroProvider>
            <ContactOverlayProvider>
              <ProjectNavProvider>
                <Navbar />

                <NavbarMobile />

                {children}
              </ProjectNavProvider>

              <Footer />
            </ContactOverlayProvider>
          </HeroIntroProvider>
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
