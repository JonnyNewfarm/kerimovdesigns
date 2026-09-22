"use client";

import { useFrame } from "@react-three/fiber";

import { useMemo, useRef } from "react";

import * as THREE from "three";

import {
  hoverLabelFragmentShader,
  previewBendVertexShader,
} from "./projectPreviewShaders";

import type { PreviewHoverLabelProps } from "./projectPreviewTypes";

import useHoverLabelTexture from "./useHoverLabelTexture";

export default function ProjectPreviewHoverLabel({
  anchorRef,
  pointerRef,
  backgroundColor,
}: PreviewHoverLabelProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const texture = useHoverLabelTexture(backgroundColor);

  /*
   * =====================================================
   * POSITION SPRING
   * =====================================================
   */

  const positionTarget = useRef(new THREE.Vector2(0, 0));

  const positionCurrent = useRef(new THREE.Vector2(0, 0));

  const positionVelocity = useRef(new THREE.Vector2(0, 0));

  /*
   * =====================================================
   * POINTER LAG FOR BEND
   * =====================================================
   */

  const pointerSmooth = useRef(new THREE.Vector2(0, 0));

  /*
   * =====================================================
   * BEND
   * =====================================================
   */

  const bendCurrent = useRef(new THREE.Vector2(0, 0));

  const bendVelocity = useRef(new THREE.Vector2(0, 0));

  /*
   * =====================================================
   * REVEAL
   * =====================================================
   */

  const scaleCurrent = useRef(0.35);

  const scaleVelocity = useRef(0);

  const opacityCurrent = useRef(0);

  const wasHovered = useRef(false);

  /*
   * =====================================================
   * UNIFORMS
   * =====================================================
   */

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: texture,
      },

      uOpacity: {
        value: 0,
      },

      uDelta: {
        value: new THREE.Vector2(0, 0),
      },
    }),
    [texture],
  );

  /*
   * =====================================================
   * FRAME
   * =====================================================
   */

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;

    const material = materialRef.current;

    const anchor = anchorRef.current;

    if (!mesh || !material || !anchor || !texture) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    const rect = anchor.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    /*
     * =================================================
     * HOVER
     * =================================================
     */

    const isHovered =
      pointerRef.current.active &&
      pointerRef.current.x >= rect.left &&
      pointerRef.current.x <= rect.right &&
      pointerRef.current.y >= rect.top &&
      pointerRef.current.y <= rect.bottom;

    /*
     * =================================================
     * LABEL SIZE
     * =================================================
     */

    const labelWidth = THREE.MathUtils.clamp(rect.width * 0.25, 190, 290);

    const labelHeight = labelWidth * 0.35;

    /*
     * =================================================
     * TARGET POSITION
     * =================================================
     */

    const centerX = rect.left + rect.width / 2;

    const centerY = rect.top + rect.height / 2;

    const targetX = pointerRef.current.x - centerX;

    const targetY = -(pointerRef.current.y - centerY);

    positionTarget.current.set(targetX, targetY);

    /*
     * Første frame på hover:
     * ikke fly inn fra forrige posisjon.
     */

    if (isHovered && !wasHovered.current) {
      positionCurrent.current.copy(positionTarget.current);

      positionVelocity.current.set(0, 0);

      pointerSmooth.current.set(pointerRef.current.x, pointerRef.current.y);
    }

    /*
     * =================================================
     * POSITION SPRING
     * =================================================
     */

    if (isHovered) {
      const positionStiffness = 125;

      const positionDamping = 17;

      positionVelocity.current.x +=
        (positionTarget.current.x - positionCurrent.current.x) *
        positionStiffness *
        delta;

      positionVelocity.current.y +=
        (positionTarget.current.y - positionCurrent.current.y) *
        positionStiffness *
        delta;

      positionVelocity.current.multiplyScalar(
        Math.exp(-positionDamping * delta),
      );

      positionCurrent.current.addScaledVector(positionVelocity.current, delta);
    }

    /*
     * =================================================
     * POINTER LAG
     * =================================================
     */

    const pointerFollow = 1 - Math.exp(-delta * 7);

    pointerSmooth.current.x +=
      (pointerRef.current.x - pointerSmooth.current.x) * pointerFollow;

    pointerSmooth.current.y +=
      (pointerRef.current.y - pointerSmooth.current.y) * pointerFollow;

    const differenceX = pointerRef.current.x - pointerSmooth.current.x;

    const differenceY = pointerRef.current.y - pointerSmooth.current.y;

    /*
     * =================================================
     * BEND TARGET
     * =================================================
     *
     * Før:
     *
     * X = 0.30 / max 0.052
     * Y = 0.17 / max 0.038
     *
     * Nå litt roligere:
     *
     * X = 0.22 / max 0.036
     * Y = 0.12 / max 0.026
     */

    const targetBendX = isHovered
      ? THREE.MathUtils.clamp(
          (differenceX / labelWidth) * 0.22,

          -0.036,
          0.036,
        )
      : 0;

    const targetBendY = isHovered
      ? THREE.MathUtils.clamp(
          -(differenceY / labelHeight) * 0.12,

          -0.026,
          0.026,
        )
      : 0;

    /*
     * Litt roligere spring.
     */

    const bendStiffness = isHovered ? 88 : 72;

    const bendDamping = isHovered ? 18 : 14;

    bendVelocity.current.x +=
      (targetBendX - bendCurrent.current.x) * bendStiffness * delta;

    bendVelocity.current.y +=
      (targetBendY - bendCurrent.current.y) * bendStiffness * delta;

    bendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    bendCurrent.current.addScaledVector(bendVelocity.current, delta);

    material.uniforms.uDelta.value.copy(bendCurrent.current);

    /*
     * =================================================
     * SCALE REVEAL
     * =================================================
     */

    const scaleTarget = isHovered ? 1 : 0.35;

    const scaleStiffness = 95;

    const scaleDamping = 17;

    scaleVelocity.current +=
      (scaleTarget - scaleCurrent.current) * scaleStiffness * delta;

    scaleVelocity.current *= Math.exp(-scaleDamping * delta);

    scaleCurrent.current += scaleVelocity.current * delta;

    /*
     * =================================================
     * OPACITY
     * =================================================
     */

    const opacityTarget = isHovered ? 0.96 : 0;

    const opacityFollow = 1 - Math.exp(-delta * 13);

    opacityCurrent.current +=
      (opacityTarget - opacityCurrent.current) * opacityFollow;

    material.uniforms.uOpacity.value = opacityCurrent.current;

    /*
     * =================================================
     * TRANSFORM
     * =================================================
     */

    mesh.position.set(positionCurrent.current.x, positionCurrent.current.y, 10);

    mesh.scale.set(
      labelWidth * scaleCurrent.current,

      labelHeight * scaleCurrent.current,

      1,
    );

    mesh.visible = opacityCurrent.current > 0.002;

    wasHovered.current = isHovered;
  });

  if (!texture) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      renderOrder={100}
      frustumCulled={false}
      raycast={() => null}
    >
      <planeGeometry args={[1, 1, 28, 16]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={previewBendVertexShader}
        fragmentShader={hoverLabelFragmentShader}
        transparent
        toneMapped={false}
        depthTest={false}
        depthWrite={false}
        side={THREE.DoubleSide}
        precision="highp"
      />
    </mesh>
  );
}
