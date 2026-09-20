"use client";

import { Canvas } from "@react-three/fiber";

import { useEffect, useState } from "react";

import { createPortal } from "react-dom";

import ProjectGalleryScene from "./ProjectGalleryScene";

import type { ProjectGalleryThreeCanvasProps } from "./projectGalleryThreeTypes";

export type { ProjectGalleryVideoBridge } from "./projectGalleryThreeTypes";

export default function ProjectGalleryThreeCanvas(
  props: ProjectGalleryThreeCanvasProps,
) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        inset-0
        z-[5]
      "
    >
      <Canvas
        orthographic
        dpr={[1, 1.25]}
        camera={{
          position: [0, 0, 1000],

          zoom: 1,

          near: 0.1,

          far: 2000,
        }}
        gl={{
          alpha: true,

          antialias: false,

          powerPreference: "high-performance",

          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ProjectGalleryScene {...props} />
      </Canvas>
    </div>,

    document.body,
  );
}
