"use client";

import { useFrame, useThree } from "@react-three/fiber";

import { useMemo, useRef } from "react";

import * as THREE from "three";

import {
  projectGalleryBendVertexShader,
  projectGalleryImageFragmentShader,
} from "../hero/portfolioImageShaders";

import type { GalleryMediaPlaneProps } from "./projectGalleryThreeTypes";

import { updateCoverUv } from "./projectGalleryThreeUtils";

export default function GalleryMediaPlane({
  index,
  getAnchor,
  getTexture,
  pointerRef,
  hoveredIndexRef,
  scrollBendRef,
}: GalleryMediaPlaneProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const { size } = useThree();

  /*
   * =====================================================
   * UNIFORMS
   * =====================================================
   */

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: null as THREE.Texture | null,
      },

      uOpacity: {
        value: 0,
      },

      uUvScale: {
        value: new THREE.Vector2(1, 1),
      },

      uUvOffset: {
        value: new THREE.Vector2(0, 0),
      },

      uDelta: {
        value: new THREE.Vector2(0, 0),
      },
    }),
    [],
  );

  /*
   * =====================================================
   * POINTER
   * =====================================================
   */

  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));

  const pointerSmooth = useRef(new THREE.Vector2(0.5, 0.5));

  /*
   * =====================================================
   * HOVER BEND
   * =====================================================
   */

  const hoverBend = useRef(new THREE.Vector2(0, 0));

  const hoverBendVelocity = useRef(new THREE.Vector2(0, 0));

  /*
   * =====================================================
   * MAGNETIC POSITION
   * =====================================================
   */

  const positionTarget = useRef(new THREE.Vector2(0, 0));

  const positionCurrent = useRef(new THREE.Vector2(0, 0));

  const positionVelocity = useRef(new THREE.Vector2(0, 0));

  /*
   * =====================================================
   * SCALE
   * =====================================================
   */

  const scaleCurrent = useRef(1);

  const scaleVelocity = useRef(0);

  /*
   * =====================================================
   * OPACITY
   * =====================================================
   */

  const opacityCurrent = useRef(0);

  /*
   * =====================================================
   * FRAME
   * =====================================================
   */

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;

    const material = materialRef.current;

    const anchor = getAnchor();

    const texture = getTexture();

    if (!mesh || !material || !anchor || !texture) {
      if (mesh) {
        mesh.visible = false;
      }

      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    /*
     * =================================================
     * DOM BOUNDS
     * =================================================
     */

    const rect = anchor.getBoundingClientRect();

    const outsideViewport = rect.bottom < -300 || rect.top > size.height + 300;

    if (outsideViewport || rect.width <= 0 || rect.height <= 0) {
      mesh.visible = false;

      return;
    }

    mesh.visible = true;

    /*
     * =================================================
     * TEXTURE
     * =================================================
     */

    material.uniforms.uTexture.value = texture;

    updateCoverUv(
      texture,

      rect.width,
      rect.height,

      material.uniforms.uUvScale.value,

      material.uniforms.uUvOffset.value,
    );

    /*
     * =================================================
     * HOVER
     * =================================================
     */

    const isHovered = hoveredIndexRef.current === index;

    /*
     * =================================================
     * POINTER LOCAL UV
     * =================================================
     */

    if (isHovered && pointerRef.current.active) {
      const x = THREE.MathUtils.clamp(
        (pointerRef.current.x - rect.left) / rect.width,

        0,
        1,
      );

      const y = THREE.MathUtils.clamp(
        (pointerRef.current.y - rect.top) / rect.height,

        0,
        1,
      );

      pointerTarget.current.set(x, y);
    } else {
      pointerTarget.current.set(0.5, 0.5);
    }

    /*
     * =================================================
     * POINTER LAG
     *
     * Samme type feel som hero.
     * =================================================
     */

    const pointerFollow = 1 - Math.exp(-delta * 7);

    pointerSmooth.current.lerp(pointerTarget.current, pointerFollow);

    const differenceX = pointerTarget.current.x - pointerSmooth.current.x;

    const differenceY = pointerTarget.current.y - pointerSmooth.current.y;

    /*
     * =================================================
     * HOVER BEND
     * =================================================
     */

    const targetHoverX = isHovered
      ? THREE.MathUtils.clamp(
          differenceX * 0.32,

          -0.027,
          0.027,
        )
      : 0;

    const targetHoverY = isHovered
      ? THREE.MathUtils.clamp(
          -differenceY * 0.26,

          -0.022,
          0.022,
        )
      : 0;

    const bendStiffness = isHovered ? 95 : 75;

    const bendDamping = isHovered ? 16 : 13;

    hoverBendVelocity.current.x +=
      (targetHoverX - hoverBend.current.x) * bendStiffness * delta;

    hoverBendVelocity.current.y +=
      (targetHoverY - hoverBend.current.y) * bendStiffness * delta;

    hoverBendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    hoverBend.current.addScaledVector(hoverBendVelocity.current, delta);

    /*
     * =================================================
     * FINAL BEND
     *
     * Scroll:
     * Y only.
     *
     * Hover:
     * X + Y.
     * =================================================
     */

    material.uniforms.uDelta.value.set(
      hoverBend.current.x,

      scrollBendRef.current + hoverBend.current.y,
    );

    /*
     * =================================================
     * MAGNETIC FOLLOW
     *
     * Samme styrke som hero.
     * =================================================
     */

    const maxFollowX = rect.width * 0.065;

    const maxFollowY = rect.height * 0.04;

    positionTarget.current.set(
      isHovered ? (pointerTarget.current.x - 0.5) * maxFollowX * 2 : 0,

      isHovered ? -(pointerTarget.current.y - 0.5) * maxFollowY * 2 : 0,
    );

    const positionStiffness = isHovered ? 30 : 60;

    const positionDamping = isHovered ? 8 : 10;

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

    /*
     * =================================================
     * HOVER SCALE
     *
     * Hero: 1 -> 1.1.
     * =================================================
     */

    const scaleTarget = isHovered ? 1.1 : 1;

    const scaleStiffness = 70;

    const scaleDamping = 14;

    scaleVelocity.current +=
      (scaleTarget - scaleCurrent.current) * scaleStiffness * delta;

    scaleVelocity.current *= Math.exp(-scaleDamping * delta);

    scaleCurrent.current += scaleVelocity.current * delta;

    /*
     * =================================================
     * DOM -> THREE POSITION
     * =================================================
     */

    const centerX = rect.left + rect.width / 2;

    const centerY = rect.top + rect.height / 2;

    const x = centerX - size.width / 2;

    const y = size.height / 2 - centerY;

    mesh.position.set(
      x + positionCurrent.current.x,

      y + positionCurrent.current.y,

      0,
    );

    /*
     * =================================================
     * SIZE
     * =================================================
     */

    mesh.scale.set(
      rect.width * scaleCurrent.current,

      rect.height * scaleCurrent.current,

      1,
    );

    /*
     * =================================================
     * DIM OTHER MEDIA
     * =================================================
     */

    const shouldDim =
      hoveredIndexRef.current !== null && hoveredIndexRef.current !== index;

    const targetOpacity = shouldDim ? 0.42 : 1;

    const opacityFollow = 1 - Math.exp(-delta * 9);

    opacityCurrent.current +=
      (targetOpacity - opacityCurrent.current) * opacityFollow;

    material.uniforms.uOpacity.value = opacityCurrent.current;
  });

  return (
    <mesh
      ref={meshRef}
      visible={false}
      frustumCulled={false}
      renderOrder={index + 10}
    >
      <planeGeometry args={[1, 1, 32, 32]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={projectGalleryBendVertexShader}
        fragmentShader={projectGalleryImageFragmentShader}
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
