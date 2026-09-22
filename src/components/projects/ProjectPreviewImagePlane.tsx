"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  previewBendVertexShader,
  previewImageFragmentShader,
} from "./projectPreviewShaders";

import type { PreviewImagePlaneProps } from "./projectPreviewTypes";

import { getCoverUv } from "./projectPreviewUtils";

export default function ProjectPreviewImagePlane({
  src,
  anchorRef,
  pointerRef,
  onReady,
}: PreviewImagePlaneProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const texture = useLoader(THREE.TextureLoader, src);

  /*
   * =====================================================
   * TEXTURE
   * =====================================================
   */

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.wrapS = THREE.ClampToEdgeWrapping;

    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.minFilter = THREE.LinearFilter;

    texture.magFilter = THREE.LinearFilter;

    texture.generateMipmaps = false;

    texture.needsUpdate = true;

    onReady();
  }, [texture, onReady]);

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
    [texture],
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
   * MOUSE FOLLOW
   * =====================================================
   */

  const positionTarget = useRef(new THREE.Vector2(0, 0));

  const positionCurrent = useRef(new THREE.Vector2(0, 0));

  const positionVelocity = useRef(new THREE.Vector2(0, 0));

  /*
   * =====================================================
   * SCROLL
   * =====================================================
   */

  const scrollBend = useRef(0);

  const scrollVelocity = useRef(0);

  const previousScrollY = useRef(0);

  useEffect(() => {
    previousScrollY.current = window.scrollY;
  }, []);

  /*
   * =====================================================
   * FRAME
   * =====================================================
   */

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;

    const material = materialRef.current;

    const anchor = anchorRef.current;

    if (!mesh || !material || !anchor) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    const rect = anchor.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    /*
     * =================================================
     * COVER
     * =================================================
     */

    const cover = getCoverUv(texture, rect.width, rect.height);

    material.uniforms.uUvScale.value.copy(cover.scale);

    material.uniforms.uUvOffset.value.copy(cover.offset);

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
     * LOCAL POINTER
     * =================================================
     */

    if (isHovered) {
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
     *
     * Før:
     *
     * X:
     * differenceX * 0.23
     * max 0.023
     *
     * Y:
     * differenceY * 0.18
     * max 0.018
     *
     * Nå:
     *
     * X:
     * differenceX * 0.12
     * max 0.012
     *
     * Y:
     * differenceY * 0.09
     * max 0.009
     */

    const targetHoverX = isHovered
      ? THREE.MathUtils.clamp(
          differenceX * 0.16,

          -0.016,
          0.016,
        )
      : 0;

    const targetHoverY = isHovered
      ? THREE.MathUtils.clamp(
          -differenceY * 0.12,

          -0.012,
          0.012,
        )
      : 0;

    /*
     * Litt smoothere / mindre aggressiv spring.
     */

    const bendStiffness = isHovered ? 82 : 70;

    const bendDamping = isHovered ? 17 : 14;

    hoverBendVelocity.current.x +=
      (targetHoverX - hoverBend.current.x) * bendStiffness * delta;

    hoverBendVelocity.current.y +=
      (targetHoverY - hoverBend.current.y) * bendStiffness * delta;

    hoverBendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    hoverBend.current.addScaledVector(hoverBendVelocity.current, delta);

    /*
     * =================================================
     * SCROLL BEND
     * =================================================
     *
     * UENDRET.
     */

    const currentScrollY = window.scrollY;

    const scrollDifference = currentScrollY - previousScrollY.current;

    previousScrollY.current = currentScrollY;

    const targetScrollBend = THREE.MathUtils.clamp(
      -scrollDifference * 0.0018,

      -0.022,
      0.022,
    );

    const scrollStiffness = 105;

    const scrollDamping = 12;

    scrollVelocity.current +=
      (targetScrollBend - scrollBend.current) * scrollStiffness * delta;

    scrollVelocity.current *= Math.exp(-scrollDamping * delta);

    scrollBend.current += scrollVelocity.current * delta;

    const returnFollow = 1 - Math.exp(-delta * 4.5);

    scrollBend.current += (0 - scrollBend.current) * returnFollow;

    /*
     * =================================================
     * FINAL BEND
     * =================================================
     */

    material.uniforms.uDelta.value.set(
      hoverBend.current.x,

      hoverBend.current.y + scrollBend.current,
    );

    /*
     * =================================================
     * IMAGE MOUSE FOLLOW
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
     * POSITION
     * =================================================
     */

    mesh.position.set(positionCurrent.current.x, positionCurrent.current.y, 0);

    /*
     * Ingen hover scale på Projects.
     */

    mesh.scale.set(rect.width, rect.height, 1);
  });

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[1, 1, 40, 40]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={previewBendVertexShader}
        fragmentShader={previewImageFragmentShader}
        toneMapped={false}
        depthTest={false}
        depthWrite={false}
        side={THREE.DoubleSide}
        precision="highp"
      />
    </mesh>
  );
}
