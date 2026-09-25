"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useMemo, useRef } from "react";
import { ShaderMaterial, Vector2 } from "three";
import * as THREE from "three";

import {
  portfolioBendVertexShader,
  portfolioButtonFragmentShader,
} from "@/components/hero/portfolioImageShaders";

/*
 * =========================================================
 * THREE BUTTON PLANE
 * =========================================================
 */

function ButtonPlane({
  pointerTargetRef,
  hoveredRef,
}: {
  pointerTargetRef: React.MutableRefObject<Vector2>;
  hoveredRef: React.MutableRefObject<boolean>;
}) {
  const materialRef = useRef<ShaderMaterial | null>(null);

  const smoothPointer = useRef(new Vector2(0.5, 0.5));

  const hoverBend = useRef(new Vector2(0, 0));

  const bendVelocity = useRef(new Vector2(0, 0));

  const viewport = useThree((state) => state.viewport);

  /*
   * Canvas-wrapperen er større enn selve knappen.
   * Planet fyller derfor ikke hele viewporten.
   */

  const planeWidth = viewport.width * 0.72;

  const planeHeight = viewport.height * 0.42;

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },

      uSpeed: {
        value: 0.7,
      },

      uDelta: {
        value: new Vector2(0, 0),
      },

      /*
       * Roet ned fra 0.0048.
       */
      uAmplitude: {
        value: 0.0032,
      },
    }),
    [],
  );

  useFrame((state, rawDelta) => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    /*
     * =====================================================
     * POINTER LAG
     * =====================================================
     */

    const pointerFollow = 1 - Math.exp(-delta * 7);

    smoothPointer.current.lerp(pointerTargetRef.current, pointerFollow);

    const diffX = pointerTargetRef.current.x - smoothPointer.current.x;

    const diffY = pointerTargetRef.current.y - smoothPointer.current.y;

    /*
     * =====================================================
     * HOVER BEND
     * =====================================================
     *
     * Før:
     *
     * X = 70
     * Y = 42
     *
     * Nå roligere:
     *
     * X = 42
     * Y = 25
     */

    const bendStrengthX = 42;

    const bendStrengthY = 25;

    const targetBendX = hoveredRef.current ? diffX * bendStrengthX : 0;

    const targetBendY = hoveredRef.current ? diffY * bendStrengthY : 0;

    /*
     * Litt roligere spring.
     */

    const bendStiffness = hoveredRef.current ? 82 : 68;

    const bendDamping = hoveredRef.current ? 18 : 14;

    bendVelocity.current.x +=
      (targetBendX - hoverBend.current.x) * bendStiffness * delta;

    bendVelocity.current.y +=
      (targetBendY - hoverBend.current.y) * bendStiffness * delta;

    bendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    hoverBend.current.addScaledVector(bendVelocity.current, delta);

    /*
     * Lavere maks bend.
     */

    hoverBend.current.x = THREE.MathUtils.clamp(hoverBend.current.x, -32, 32);

    hoverBend.current.y = THREE.MathUtils.clamp(hoverBend.current.y, -20, 20);

    /*
     * =====================================================
     * SHADER
     * =====================================================
     */

    material.uniforms.uDelta.value.set(
      hoverBend.current.x,
      hoverBend.current.y,
    );

    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh>
      <planeGeometry args={[planeWidth, planeHeight, 40, 20]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={portfolioBendVertexShader}
        fragmentShader={portfolioButtonFragmentShader}
        toneMapped={false}
        side={THREE.DoubleSide}
        precision="highp"
      />
    </mesh>
  );
}

/*
 * =========================================================
 * CONTACT THREE BUTTON
 * =========================================================
 */

type ContactThreeButtonProps = {
  children: ReactNode;

  onClick: () => void;

  type?: "button" | "submit";
};

export default function ContactThreeButton({
  children,
  onClick,
  type = "button",
}: ContactThreeButtonProps) {
  const pointerTargetRef = useRef(new Vector2(0.5, 0.5));

  const hoveredRef = useRef(false);

  /*
   * =========================================================
   * MAGNETIC
   * =========================================================
   */

  const magneticX = useMotionValue(0);

  const magneticY = useMotionValue(0);

  const smoothX = useSpring(magneticX, {
    stiffness: 180,
    damping: 18,
    mass: 0.45,
  });

  const smoothY = useSpring(magneticY, {
    stiffness: 180,
    damping: 18,
    mass: 0.45,
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

    pointerTargetRef.current.set(normalizedX, normalizedY);

    /*
     * Magnetic follow beholdes omtrent som før.
     */

    const centeredX = normalizedX - 0.5;

    const centeredY = 1 - normalizedY - 0.5;

    magneticX.set(centeredX * 10);

    magneticY.set(centeredY * 6);
  }

  /*
   * =========================================================
   * POINTER LEAVE
   * =========================================================
   */

  function handlePointerLeave() {
    hoveredRef.current = false;

    pointerTargetRef.current.set(0.5, 0.5);

    magneticX.set(0);
    magneticY.set(0);
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <motion.button
      type={type}
      onClick={onClick}
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
        min-h-[50px]
        cursor-pointer
        items-center
        justify-center
        overflow-visible
        font-bold
        px-4
        py-3
        text-sm
        text-[#ecdfcc]
        sm:px-5
        md:min-h-[54px]
        md:px-6
        md:text-lg
      "
    >
      {/*
       * =====================================================
       * LARGE THREE CANVAS
       * =====================================================
       *
       * Fortsatt større enn button så benden
       * ikke blir clipped.
       */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[70%]
          -left-[20%]
          -right-[20%]
          -top-[70%]
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
          <ButtonPlane
            pointerTargetRef={pointerTargetRef}
            hoveredRef={hoveredRef}
          />
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
          z-20
          whitespace-nowrap
          uppercase
        "
      >
        {children}
      </span>
    </motion.button>
  );
}
