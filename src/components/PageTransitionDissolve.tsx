"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { useEffect, useMemo, useRef } from "react";

import * as THREE from "three";

import {
  pageTransitionFragmentShader,
  pageTransitionVertexShader,
} from "./pageTransitionShaders";

import type {
  TransitionStatus,
  TransitionVariant,
} from "./ClientPageTransitionWrapper";

type PageTransitionDissolveProps = {
  status: TransitionStatus;
  variant: TransitionVariant;
  onCovered: () => void;
  onFinished: () => void;
};

type DissolvePlaneProps = PageTransitionDissolveProps;

/*
 * =========================================================
 * EASE
 * =========================================================
 */

function easeInOutSine(value: number) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

/*
 * =========================================================
 * DISSOLVE PLANE
 * =========================================================
 */

function DissolvePlane({
  status,
  variant,
  onCovered,
  onFinished,
}: DissolvePlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const { viewport } = useThree();

  /*
   * =====================================================
   * PROGRESS
   * =====================================================
   */

  const progressRef = useRef(status === "leaving" ? 1 : 0);

  const animationRef = useRef({
    from: status === "leaving" ? 1 : 0,

    to: status === "leaving" ? 0 : 1,

    elapsed: 0,

    completed: false,
  });

  /*
   * =====================================================
   * COLORS
   * =====================================================
   */

  const colors = useMemo(() => {
    if (variant === "projectDetails") {
      return {
        a: new THREE.Color("#11130f"),
        b: new THREE.Color("#1e211c"),
      };
    }

    return {
      a: new THREE.Color("#31362f"),
      b: new THREE.Color("#545c51"),
    };
  }, [variant]);

  /*
   * =====================================================
   * UNIFORMS
   * =====================================================
   */

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },

      uProgress: {
        value: progressRef.current,
      },

      uColorA: {
        value: colors.a,
      },

      uColorB: {
        value: colors.b,
      },
    }),
    [colors],
  );

  /*
   * =====================================================
   * STATUS CHANGE
   * =====================================================
   */

  useEffect(() => {
    animationRef.current = {
      from: progressRef.current,

      to: status === "entering" ? 1 : 0,

      elapsed: 0,

      completed: false,
    };
  }, [status]);

  /*
   * =====================================================
   * COLOR UPDATE
   * =====================================================
   */

  useEffect(() => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    material.uniforms.uColorA.value.copy(colors.a);

    material.uniforms.uColorB.value.copy(colors.b);
  }, [colors]);

  /*
   * =====================================================
   * FRAME
   * =====================================================
   */

  useFrame((state, rawDelta) => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    material.uniforms.uTime.value = state.clock.elapsedTime;

    const animation = animationRef.current;

    if (animation.completed) {
      return;
    }

    animation.elapsed += delta;

    /*
     * Keep timing exactly where we liked it.
     */

    const duration = status === "entering" ? 0.82 : 0.68;

    const normalized = THREE.MathUtils.clamp(
      animation.elapsed / duration,
      0,
      1,
    );

    const eased = easeInOutSine(normalized);

    const progress = THREE.MathUtils.lerp(animation.from, animation.to, eased);

    progressRef.current = progress;

    material.uniforms.uProgress.value = progress;

    if (normalized < 1) {
      return;
    }

    animation.completed = true;

    progressRef.current = animation.to;

    material.uniforms.uProgress.value = animation.to;

    if (status === "entering") {
      onCovered();

      return;
    }

    onFinished();
  });

  /*
   * =====================================================
   * PLANE
   * =====================================================
   */

  return (
    <mesh>
      <planeGeometry args={[viewport.width * 1.02, viewport.height * 1.02]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={pageTransitionVertexShader}
        fragmentShader={pageTransitionFragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        precision="highp"
      />
    </mesh>
  );
}

/*
 * =========================================================
 * OVERLAY
 * =========================================================
 */

export default function PageTransitionDissolve({
  status,
  variant,
  onCovered,
  onFinished,
}: PageTransitionDissolveProps) {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        inset-0
        z-[99999]
        overflow-hidden
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
        dpr={[1, 1.25]}
        frameloop="always"
        gl={{
          antialias: false,

          alpha: true,

          depth: false,

          stencil: false,

          powerPreference: "high-performance",
        }}
      >
        <DissolvePlane
          status={status}
          variant={variant}
          onCovered={onCovered}
          onFinished={onFinished}
        />
      </Canvas>
    </div>
  );
}
