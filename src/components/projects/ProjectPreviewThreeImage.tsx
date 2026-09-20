"use client";

import { Canvas } from "@react-three/fiber";

import { Suspense, useCallback, useEffect, useState } from "react";

import ProjectPreviewScene from "./ProjectPreviewScene";

import type { ProjectPreviewThreeImageProps } from "./projectPreviewTypes";

export default function ProjectPreviewThreeImage({
  src,
  hoverColor,
  anchorRef,
}: ProjectPreviewThreeImageProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
  }, [src]);

  const handleReady = useCallback(() => {
    window.requestAnimationFrame(() => {
      setIsReady(true);
    });
  }, []);

  const finalHoverColor = hoverColor || "#515b4f";

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-visible
      "
    >
      {/*
       * =================================================
       * SKELETON
       * =================================================
       */}

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          inset-0
          overflow-hidden

          bg-white/[0.035]

          transition-opacity
          duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${isReady ? "opacity-0" : "opacity-100"}
        `}
      >
        <div
          className="
            absolute
            inset-0

            animate-pulse

            bg-gradient-to-br
            from-white/[0.02]
            via-white/[0.07]
            to-white/[0.02]
          "
        />
      </div>

      {/*
       * =================================================
       * OVERSCAN CANVAS
       * =================================================
       */}

      <div
        className={`
          pointer-events-none

          absolute

          -left-[12%]
          -right-[12%]
          -top-[18%]
          -bottom-[18%]

          overflow-visible

          transition-opacity
          duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${isReady ? "opacity-100" : "opacity-0"}
        `}
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
          style={{
            position: "absolute",

            inset: 0,

            width: "100%",

            height: "100%",

            pointerEvents: "none",
          }}
          onCreated={({ gl }) => {
            gl.domElement.style.pointerEvents = "none";

            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <ProjectPreviewScene
              key={src}
              src={src}
              anchorRef={anchorRef}
              hoverColor={finalHoverColor}
              onReady={handleReady}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
