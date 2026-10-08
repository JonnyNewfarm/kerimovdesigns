"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import ProjectPreviewScene from "./ProjectPreviewScene";

import type { ProjectPreviewThreeImageProps } from "./projectPreviewTypes";

export default function ProjectPreviewThreeImage({
  src,
  hoverColor,
  anchorRef,
  pointerRef,
  variant = "preview",
}: ProjectPreviewThreeImageProps) {
  const isCard = variant === "card";

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
      {/* =================================================
          OVERSCAN CANVAS

          Ingen skeleton.
          Ingen opacity-fade.
          Ingen isReady-state.

          Når texture allerede ligger i cache etter preload,
          renderer bildet direkte.
      ================================================= */}

      <div
        className={`
          pointer-events-none
          absolute
          overflow-visible

          ${
            isCard
              ? `
                -left-[42%]
                -right-[42%]
                -top-[38%]
                -bottom-[38%]
              `
              : `
                -left-[12%]
                -right-[12%]
                -top-[18%]
                -bottom-[18%]
              `
          }
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
              src={src}
              anchorRef={anchorRef}
              hoverColor={finalHoverColor}
              onReady={() => {}}
              pointerRef={pointerRef}
              compact={isCard}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
