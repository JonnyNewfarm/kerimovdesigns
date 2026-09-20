"use client";

import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { ShaderMaterial, Vector2 } from "three";
import * as THREE from "three";

import { WORLD_SECTIONS } from "./portfolioWorldConstants";

type BendRegistration = {
  materialRef: React.RefObject<ShaderMaterial | null>;

  strength: number;
};

type SharedRingMotion = {
  angle: React.MutableRefObject<number>;

  difference: React.MutableRefObject<number>;

  hoverPointerTarget: React.MutableRefObject<Vector2>;

  hoverPointerSmooth: React.MutableRefObject<Vector2>;

  isButtonHovered: React.MutableRefObject<boolean>;

  registerBendMaterial: (
    materialRef: React.RefObject<ShaderMaterial | null>,
    strength: number,
  ) => () => void;
};

const RingMotionContext = createContext<SharedRingMotion | null>(null);

const PIXELS_PER_SECTION = 620;

const SECTION_ANGLE = WORLD_SECTIONS[1].angle - WORLD_SECTIONS[0].angle;

const RAD_PER_PIXEL = SECTION_ANGLE / PIXELS_PER_SECTION;

export function RingMotionProvider({
  virtualScroll,
  children,
}: {
  virtualScroll: MotionValue<number>;

  children: React.ReactNode;
}) {
  const angle = useRef(virtualScroll.get() * RAD_PER_PIXEL);

  const bendTargetScroll = useRef(virtualScroll.get());

  const bendSmoothScroll = useRef(virtualScroll.get());

  const hoverBendTarget = useRef(new Vector2(0, 0));

  const difference = useRef(0);

  const bendCurrent = useRef(new Vector2(0, 0));

  const bendVelocity = useRef(new Vector2(0, 0));

  const hoverPointerTarget = useRef(new Vector2(0.5, 0.5));

  const hoverPointerSmooth = useRef(new Vector2(0.5, 0.5));

  const isButtonHovered = useRef(false);

  const hoverBendCurrent = useRef(new Vector2(0, 0));

  const hoverBendVelocity = useRef(new Vector2(0, 0));

  const bendMaterials = useRef(new Set<BendRegistration>());

  const registerBendMaterial = useCallback(
    (
      materialRef: React.RefObject<ShaderMaterial | null>,

      strength: number,
    ) => {
      const registration: BendRegistration = {
        materialRef,
        strength,
      };

      bendMaterials.current.add(registration);

      return () => {
        bendMaterials.current.delete(registration);
      };
    },
    [],
  );

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);

    const scroll = virtualScroll.get();

    angle.current = scroll * RAD_PER_PIXEL;

    bendTargetScroll.current = scroll;

    const bendFollow = 1 - Math.exp(-delta * 8.5);

    bendSmoothScroll.current +=
      (bendTargetScroll.current - bendSmoothScroll.current) * bendFollow;

    difference.current = bendTargetScroll.current - bendSmoothScroll.current;

    const targetBendX = THREE.MathUtils.clamp(
      -difference.current * 3.15,
      -78,
      78,
    );

    const targetBendY = THREE.MathUtils.clamp(
      difference.current * 0.58,
      -42,
      42,
    );

    const bendStiffness = 112;

    const bendDamping = 10.8;

    const hoverStiffness = 85;

    const hoverDamping = 12;

    hoverBendVelocity.current.x +=
      (hoverBendTarget.current.x - hoverBendCurrent.current.x) *
      hoverStiffness *
      delta;

    hoverBendVelocity.current.y +=
      (hoverBendTarget.current.y - hoverBendCurrent.current.y) *
      hoverStiffness *
      delta;

    hoverBendVelocity.current.multiplyScalar(Math.exp(-hoverDamping * delta));

    hoverBendCurrent.current.addScaledVector(hoverBendVelocity.current, delta);

    bendVelocity.current.x +=
      (targetBendX - bendCurrent.current.x) * bendStiffness * delta;

    bendVelocity.current.y +=
      (targetBendY - bendCurrent.current.y) * bendStiffness * delta;

    bendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    bendCurrent.current.addScaledVector(bendVelocity.current, delta);

    bendCurrent.current.x = THREE.MathUtils.clamp(
      bendCurrent.current.x,
      -82,
      82,
    );

    bendCurrent.current.y = THREE.MathUtils.clamp(
      bendCurrent.current.y,
      -45,
      45,
    );

    for (const registration of bendMaterials.current) {
      const material = registration.materialRef.current;

      if (!material) {
        continue;
      }

      const uniform = material.uniforms.uDelta;

      if (!uniform) {
        continue;
      }

      uniform.value.set(
        (bendCurrent.current.x + hoverBendCurrent.current.x) *
          registration.strength,

        (bendCurrent.current.y + hoverBendCurrent.current.y) *
          registration.strength,
      );
    }
  });

  const value = useMemo(
    () => ({
      angle,
      difference,

      hoverPointerTarget,
      hoverPointerSmooth,
      isButtonHovered,

      registerBendMaterial,
    }),
    [registerBendMaterial],
  );

  return (
    <RingMotionContext.Provider value={value}>
      {children}
    </RingMotionContext.Provider>
  );
}

export function useRingMotion() {
  const context = useContext(RingMotionContext);

  if (!context) {
    throw new Error("useRingMotion must be used inside RingMotionProvider");
  }

  return context;
}

export function useBendMaterial(
  materialRef: React.RefObject<ShaderMaterial | null>,

  bendStrength: number,
) {
  const { registerBendMaterial } = useRingMotion();

  useEffect(() => {
    return registerBendMaterial(materialRef, bendStrength);
  }, [materialRef, bendStrength, registerBendMaterial]);
}

export function CameraRig() {
  const { angle } = useRingMotion();

  useFrame((state) => {
    state.camera.position.set(0, 0, 0);

    state.camera.rotation.set(0, -angle.current, 0, "YXZ");
  });

  return null;
}
