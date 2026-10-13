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

  const introProgress = useRef(0);

  const frameCountRef = useRef(0);

  const readyReportedRef = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },

      uSpeed: {
        value: 0.48,
      },

      uDelta: {
        value: new THREE.Vector2(-95, 6),
      },

      uAmplitude: {
        value: 0.00145,
      },

      uIntroScale: {
        value: 0.72,
      },

      uIntroOffsetX: {
        value: 0.43,
      },

      uOpacity: {
        value: 0,
      },
    }),
    [],
  );

  useFrame((_, rawDelta) => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    elapsedRef.current += delta;

    introProgress.current = Math.min(1, introProgress.current + delta / 1.45);

    const p = introProgress.current;

    const moveEase = 1 - Math.pow(1 - p, 3);

    const scaleEase = 1 - Math.pow(1 - p, 4);

    const bendRelease = THREE.MathUtils.smoothstep(p, 0.1, 1);

    const introBendX = THREE.MathUtils.lerp(-95, 0, bendRelease);

    const introBendY = THREE.MathUtils.lerp(6, 0, bendRelease);

    const introScale = THREE.MathUtils.lerp(0.72, 1, scaleEase);

    const introOffsetX = THREE.MathUtils.lerp(0.43, 0, moveEase);

    const opacity = THREE.MathUtils.smoothstep(p, 0.02, 0.38);

    material.uniforms.uTime.value = elapsedRef.current;

    material.uniforms.uDelta.value.set(introBendX, introBendY);

    material.uniforms.uIntroScale.value = introScale;

    material.uniforms.uIntroOffsetX.value = introOffsetX;

    material.uniforms.uOpacity.value = opacity;

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
      <planeGeometry args={[2, 2, 28, 32]} />

      <shaderMaterial
        ref={materialRef}
        vertexShader={filterPopupVertexShader}
        fragmentShader={contactPopupFragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        side={THREE.DoubleSide}
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
        transform: "translateZ(0)",
      }}
    >
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
            alpha: true,
            depth: false,
            stencil: false,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color(0, 0, 0), 0);

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
