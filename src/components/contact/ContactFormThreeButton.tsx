"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { motion, useMotionValue, useSpring } from "framer-motion";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

import { useMemo, useRef } from "react";

import { ShaderMaterial, Vector2 } from "three";

import * as THREE from "three";

import { portfolioBendVertexShader } from "@/components/hero/portfolioImageShaders";

import { contactFormButtonFragmentShader } from "./contactFormShaders";

/*
 * =========================================================
 * THREE PLANE
 * =========================================================
 */

function FormButtonPlane({
  pointerRef,
  hoveredRef,
}: {
  pointerRef: React.MutableRefObject<Vector2>;

  hoveredRef: React.MutableRefObject<boolean>;
}) {
  const materialRef = useRef<ShaderMaterial | null>(null);

  const bend = useRef(new Vector2(0, 0));

  const bendVelocity = useRef(new Vector2(0, 0));

  const viewport = useThree((state) => state.viewport);

  /*
   * =========================================================
   * UNIFORMS
   * =========================================================
   */

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },

      uSpeed: {
        value: 0.62,
      },

      uDelta: {
        value: new Vector2(0, 0),
      },

      /*
       * Før:
       * 0.0048
       *
       * Nå roligere.
       */
      uAmplitude: {
        value: 0.0032,
      },
    }),
    [],
  );

  /*
   * =========================================================
   * FRAME
   * =========================================================
   */

  useFrame((state, rawDelta) => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    /*
     * Pointer fra sentrum.
     */

    const centeredX = pointerRef.current.x - 0.5;

    const centeredY = pointerRef.current.y - 0.5;

    /*
     * =====================================================
     * BEND TARGET
     * =====================================================
     *
     * Før:
     *
     * X = 42
     * Y = 28
     *
     * Nå mye roligere:
     *
     * X = 24
     * Y = 15
     */

    const targetX = hoveredRef.current ? centeredX * 24 : 0;

    const targetY = hoveredRef.current ? centeredY * 15 : 0;

    /*
     * Litt mykere spring også.
     */

    const stiffness = hoveredRef.current ? 62 : 54;

    const damping = hoveredRef.current ? 14 : 13;

    bendVelocity.current.x += (targetX - bend.current.x) * stiffness * delta;

    bendVelocity.current.y += (targetY - bend.current.y) * stiffness * delta;

    bendVelocity.current.multiplyScalar(Math.exp(-damping * delta));

    bend.current.addScaledVector(bendVelocity.current, delta);

    /*
     * Mindre maksimal deformasjon.
     */

    bend.current.x = THREE.MathUtils.clamp(bend.current.x, -22, 22);

    bend.current.y = THREE.MathUtils.clamp(bend.current.y, -14, 14);

    material.uniforms.uDelta.value.set(bend.current.x, bend.current.y);

    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  /*
   * Canvas er større enn selve knappen
   * slik at benden ikke blir clipped.
   */

  const width = viewport.width * 0.74;

  const height = viewport.height * 0.38;

  return (
    <mesh>
      <planeGeometry args={[width, height, 40, 16]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={portfolioBendVertexShader}
        fragmentShader={contactFormButtonFragmentShader}
        side={THREE.DoubleSide}
        toneMapped={false}
        precision="highp"
      />
    </mesh>
  );
}

/*
 * =========================================================
 * BUTTON
 * =========================================================
 */

type ContactFormThreeButtonProps = {
  children: ReactNode;

  type?: "button" | "submit";
};

export default function ContactFormThreeButton({
  children,

  type = "submit",
}: ContactFormThreeButtonProps) {
  const hoveredRef = useRef(false);

  const pointerRef = useRef(new Vector2(0.5, 0.5));

  /*
   * =========================================================
   * MAGNETIC FOLLOW
   * =========================================================
   */

  const x = useMotionValue(0);

  const y = useMotionValue(0);

  const smoothX = useSpring(x, {
    stiffness: 160,
    damping: 17,
    mass: 0.5,
  });

  const smoothY = useSpring(y, {
    stiffness: 160,
    damping: 17,
    mass: 0.5,
  });

  /*
   * =========================================================
   * POINTER ENTER
   * =========================================================
   */

  function handlePointerEnter(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    hoveredRef.current = true;
  }

  /*
   * =========================================================
   * POINTER MOVE
   * =========================================================
   */

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const normalizedX = THREE.MathUtils.clamp(
      (event.clientX - rect.left) / rect.width,
      0,
      1,
    );

    const normalizedY = THREE.MathUtils.clamp(
      1 - (event.clientY - rect.top) / rect.height,
      0,
      1,
    );

    /*
     * THREE bend.
     */

    pointerRef.current.set(normalizedX, normalizedY);

    /*
     * Magnetic follow.
     *
     * Denne er fortsatt ganske subtil.
     */

    x.set((normalizedX - 0.5) * 9);

    y.set((0.5 - normalizedY) * 5);
  }

  /*
   * =========================================================
   * POINTER LEAVE
   * =========================================================
   */

  function handlePointerLeave() {
    hoveredRef.current = false;

    pointerRef.current.set(0.5, 0.5);

    x.set(0);
    y.set(0);
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <motion.button
      type={type}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        x: smoothX,
        y: smoothY,
      }}
      className="
        relative
        flex
        min-h-[58px]
        cursor-pointer
        items-center
        justify-center
        overflow-visible
        px-5
        py-4
        text-xl
        uppercase
        text-[#ecdfcc]
      "
    >
      {/*
       * =====================================================
       * THREE CANVAS
       * =====================================================
       */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[80%]
          -left-[25%]
          -right-[25%]
          -top-[80%]
          z-0
        "
      >
        <Canvas
          orthographic
          camera={{
            position: [0, 0, 5],

            zoom: 100,

            near: 0.01,

            far: 20,
          }}
          dpr={[1, 1.5]}
          frameloop="always"
          gl={{
            antialias: false,

            alpha: true,

            stencil: false,

            powerPreference: "high-performance",
          }}
        >
          <FormButtonPlane pointerRef={pointerRef} hoveredRef={hoveredRef} />
        </Canvas>
      </div>

      {/*
       * =====================================================
       * TEXT
       * =====================================================
       */}

      <span
        className="
          pointer-events-none
          relative
          z-10
          whitespace-nowrap
        "
      >
        {children}
      </span>
    </motion.button>
  );
}
