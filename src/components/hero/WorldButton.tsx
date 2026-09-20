"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";

import React, { useMemo, useRef } from "react";

import { Group, ShaderMaterial, Vector2 } from "three";

import * as THREE from "three";

import {
  portfolioBendVertexShader,
  portfolioButtonFragmentShader,
} from "./portfolioImageShaders";

import { WORLD_ACCENT_COLOR } from "./portfolioWorldConstants";

import type { Position } from "./portfolioWorldTypes";

import { TextPlane } from "./PortfolioPrimitives";

import { useRingMotion } from "./RingMotionContext";

function BendColorPlane({
  width,
  height,
  bendStrength = 0.78,
  hoverBendRef,
}: {
  width: number;
  height: number;

  bendStrength?: number;

  hoverBendRef: React.MutableRefObject<Vector2>;
}) {
  const materialRef = useRef<ShaderMaterial | null>(null);

  const { difference } = useRingMotion();

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

      uAmplitude: {
        value: 0.0026,
      },
    }),
    [],
  );

  useFrame((state) => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    const scrollX = THREE.MathUtils.clamp(-difference.current * 0.65, -10, 10);

    const scrollY = THREE.MathUtils.clamp(difference.current * 0.14, -6, 6);

    material.uniforms.uDelta.value.set(
      scrollX * bendStrength + hoverBendRef.current.x,

      scrollY * bendStrength + hoverBendRef.current.y,
    );

    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh>
      <planeGeometry args={[width, height, 32, 12]} />

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

export default function WorldButton({
  label,
  position,

  width = 2,

  height = 0.48,

  fontSize = 220,

  onClick,
}: {
  label: string;

  position: Position;

  width?: number;

  height?: number;

  fontSize?: number;

  onClick: () => void;
}) {
  const ref = useRef<Group>(null);

  const pointerTarget = useRef(new Vector2(0.5, 0.5));

  const smoothPointer = useRef(new Vector2(0.5, 0.5));

  const hovered = useRef(false);

  const positionTarget = useRef(new Vector2(0, 0));

  const positionCurrent = useRef(new Vector2(0, 0));

  const positionVelocity = useRef(new Vector2(0, 0));

  const hoverBend = useRef(new Vector2(0, 0));

  const bendVelocity = useRef(new Vector2(0, 0));

  const scaleCurrent = useRef(1);

  const scaleVelocity = useRef(0);

  useFrame((_, rawDelta) => {
    const group = ref.current;

    if (!group) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    const pointerFollow = 1 - Math.exp(-delta * 7);

    smoothPointer.current.lerp(pointerTarget.current, pointerFollow);

    const rawDifferenceX = pointerTarget.current.x - smoothPointer.current.x;

    const rawDifferenceY = pointerTarget.current.y - smoothPointer.current.y;

    const bendStrengthX = 55;

    const bendStrengthY = 35;

    const targetBendX = hovered.current ? rawDifferenceX * bendStrengthX : 0;

    const targetBendY = hovered.current ? rawDifferenceY * bendStrengthY : 0;

    const bendStiffness = hovered.current ? 100 : 75;

    const bendDamping = hovered.current ? 17 : 13;

    bendVelocity.current.x +=
      (targetBendX - hoverBend.current.x) * bendStiffness * delta;

    bendVelocity.current.y +=
      (targetBendY - hoverBend.current.y) * bendStiffness * delta;

    bendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    hoverBend.current.addScaledVector(bendVelocity.current, delta);

    hoverBend.current.x = THREE.MathUtils.clamp(hoverBend.current.x, -55, 55);

    hoverBend.current.y = THREE.MathUtils.clamp(hoverBend.current.y, -32, 32);

    const maxFollowX = 0.1;

    const maxFollowY = 0.055;

    positionTarget.current.set(
      hovered.current ? (pointerTarget.current.x - 0.5) * maxFollowX * 2 : 0,

      hovered.current ? (pointerTarget.current.y - 0.5) * maxFollowY * 2 : 0,
    );

    const positionStiffness = hovered.current ? 28 : 55;

    const positionDamping = hovered.current ? 8 : 10;

    positionVelocity.current.x +=
      (positionTarget.current.x - positionCurrent.current.x) *
      positionStiffness *
      delta;

    positionVelocity.current.y +=
      (positionTarget.current.y - positionCurrent.current.y) *
      positionStiffness *
      delta;

    positionVelocity.current.multiplyScalar(Math.exp(-positionDamping * delta));

    positionCurrent.current.addScaledVector(positionVelocity.current, delta);

    group.position.set(
      position[0] + positionCurrent.current.x,

      position[1] + positionCurrent.current.y,

      position[2],
    );

    const scaleTarget = hovered.current ? 1.1 : 1;

    const scaleStiffness = 65;

    const scaleDamping = 13;

    scaleVelocity.current +=
      (scaleTarget - scaleCurrent.current) * scaleStiffness * delta;

    scaleVelocity.current *= Math.exp(-scaleDamping * delta);

    scaleCurrent.current += scaleVelocity.current * delta;

    group.scale.setScalar(scaleCurrent.current);
  });

  function handleEnter(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    hovered.current = true;

    if (event.uv) {
      pointerTarget.current.copy(event.uv);

      smoothPointer.current.copy(event.uv);
    }

    document.body.style.cursor = "pointer";
  }

  function handleMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    if (!event.uv) {
      return;
    }

    pointerTarget.current.copy(event.uv);
  }

  function handleLeave(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    hovered.current = false;

    pointerTarget.current.set(0.5, 0.5);

    document.body.style.cursor = "";
  }

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    document.body.style.cursor = "";

    onClick();
  }

  return (
    <group
      ref={ref}
      position={position}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={handleClick}
    >
      <BendColorPlane
        width={width}
        height={height}
        bendStrength={0.78}
        hoverBendRef={hoverBend}
      />

      <TextPlane
        text={label}
        position={[0, 0, 0.05]}
        width={width - 0.16}
        height={height - 0.12}
        fontSize={fontSize}
        lineHeight={170}
        color={WORLD_ACCENT_COLOR}
        bendStrength={0.78}
      />
    </group>
  );
}
