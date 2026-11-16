"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import ServicesMobile from "./ServicesMobile";

const ServicesDesktop = dynamic(() => import("./ServicesShowcase"), {
  ssr: false,
});

type Viewport = "mobile" | "desktop" | null;

export default function ServicesShowcaseResponsive() {
  const [viewport, setViewport] = useState<Viewport>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const updateViewport = () => {
      setViewport(media.matches ? "desktop" : "mobile");
    };

    updateViewport();

    media.addEventListener("change", updateViewport);

    return () => {
      media.removeEventListener("change", updateViewport);
    };
  }, []);

  if (viewport === null) {
    return null;
  }

  if (viewport === "mobile") {
    return <ServicesMobile />;
  }

  return <ServicesDesktop />;
}
