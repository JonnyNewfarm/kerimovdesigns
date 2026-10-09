"use client";

import { Canvas, useFrame } from "@react-three/fiber";

import { useMemo, useRef } from "react";

import * as THREE from "three";

import { filterPopupVertexShader } from "@/components/projects/filterPopupShaders";

import { contactPopupFragmentShader } from "./contactPopupShaders";

type ContactPopupThreeBackgroundProps = {
  onReady?: () => void;
};

function ContactPopupPlane({ onReady }: { onReady?: () => void }) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const elapsedRef = useRef(0);

  const frameCountRef = useRef(0);

  const readyReportedRef = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },

      /*
       * Litt roligere enn filter-popupen.
       */
      uSpeed: {
        value: 0.48,
      },
    }),
    [],
  );

  useFrame((_, delta) => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    elapsedRef.current += Math.min(delta, 0.05);

    material.uniforms.uTime.value = elapsedRef.current;

    if (!readyReportedRef.current) {
      frameCountRef.current += 1;

      if (frameCountRef.current >= 4) {
        readyReportedRef.current = true;

        onReady?.();
      }
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2, 1, 1]} />

      <shaderMaterial
        ref={materialRef}
        vertexShader={filterPopupVertexShader}
        fragmentShader={contactPopupFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        transparent={false}
        toneMapped={false}
        precision="highp"
      />
    </mesh>
  );
}

export default function ContactPopupThreeBackground({
  onReady,
}: ContactPopupThreeBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        overflow-hidden
      "
      style={{
        /*
         * Matcher den mørkeste delen
         * av Contact-gradienten.
         */
        background: "rgb(69, 71, 61)",

        transform: "translateZ(0)",
      }}
    >
      {/* =================================================
          FALLBACK
      ================================================= */}

      <div
        className="
          absolute
          inset-0
        "
        style={{
          background: "rgb(69, 71, 61)",
        }}
      />

      {/* =================================================
          CANVAS OVERSCAN
      ================================================= */}

      <div
        className="
          absolute
          -inset-[3px]
        "
        style={{
          transform: "translateZ(0)",
        }}
      >
        <Canvas
          orthographic
          frameloop="always"
          dpr={[1, 1.5]}
          camera={{
            position: [0, 0, 1],
          }}
          gl={{
            antialias: false,

            alpha: false,

            depth: false,

            stencil: false,

            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#45473d"), 1);

            gl.domElement.style.display = "block";

            gl.domElement.style.width = "100%";

            gl.domElement.style.height = "100%";

            gl.domElement.style.transform = "translateZ(0)";
          }}
          style={{
            position: "absolute",

            inset: 0,

            width: "100%",

            height: "100%",

            display: "block",
          }}
        >
          <ContactPopupPlane onReady={onReady} />
        </Canvas>
      </div>
    </div>
  );
}
