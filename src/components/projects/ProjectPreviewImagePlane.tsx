"use client";

import { useFrame, useLoader } from "@react-three/fiber";

import { useEffect, useMemo, useRef } from "react";

import * as THREE from "three";

import {
  previewBendVertexShader,
  previewImageFragmentShader,
} from "./projectPreviewShaders";

import type { PreviewImagePlaneProps } from "./projectPreviewTypes";

/*
 * =========================================================
 * COVER UV
 * =========================================================
 */

function getCoverUv(
  texture: THREE.Texture,
  containerWidth: number,
  containerHeight: number,
) {
  const image = texture.image as HTMLImageElement | ImageBitmap | undefined;

  if (!image || !containerWidth || !containerHeight) {
    return {
      scale: new THREE.Vector2(1, 1),
      offset: new THREE.Vector2(0, 0),
    };
  }

  const imageWidth = "naturalWidth" in image ? image.naturalWidth : image.width;

  const imageHeight =
    "naturalHeight" in image ? image.naturalHeight : image.height;

  if (!imageWidth || !imageHeight) {
    return {
      scale: new THREE.Vector2(1, 1),
      offset: new THREE.Vector2(0, 0),
    };
  }

  const imageAspect = imageWidth / imageHeight;

  const containerAspect = containerWidth / containerHeight;

  const scale = new THREE.Vector2(1, 1);

  const offset = new THREE.Vector2(0, 0);

  if (containerAspect > imageAspect) {
    const visibleHeight = imageAspect / containerAspect;

    scale.set(1, visibleHeight);

    offset.set(0, (1 - visibleHeight) * 0.5);
  } else {
    const visibleWidth = containerAspect / imageAspect;

    scale.set(visibleWidth, 1);

    offset.set((1 - visibleWidth) * 0.5, 0);
  }

  return {
    scale,
    offset,
  };
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function ProjectPreviewImagePlane({
  src,
  anchorRef,
  pointerRef,
  onReady,
}: PreviewImagePlaneProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  /*
   * =====================================================
   * TEXTURE
   * =====================================================
   */

  const texture = useLoader(THREE.TextureLoader, src);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.wrapS = THREE.ClampToEdgeWrapping;

    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.minFilter = THREE.LinearFilter;

    texture.magFilter = THREE.LinearFilter;

    texture.generateMipmaps = false;

    texture.needsUpdate = true;
  }, [texture]);

  /*
   * =====================================================
   * READY
   * =====================================================
   */

  const readyReportedRef = useRef(false);

  useEffect(() => {
    readyReportedRef.current = false;
  }, [src]);

  useEffect(() => {
    if (readyReportedRef.current) {
      return;
    }

    let frameOne = 0;
    let frameTwo = 0;

    frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(() => {
        if (readyReportedRef.current) {
          return;
        }

        readyReportedRef.current = true;

        onReady();
      });
    });

    return () => {
      window.cancelAnimationFrame(frameOne);

      window.cancelAnimationFrame(frameTwo);
    };
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

      uDelta: {
        value: new THREE.Vector2(0, 0),
      },

      uUvScale: {
        value: new THREE.Vector2(1, 1),
      },

      uUvOffset: {
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

  const smoothPointer = useRef(new THREE.Vector2(0.5, 0.5));

  /*
   * =====================================================
   * HOVER BEND
   * =====================================================
   */

  const hoverBend = useRef(new THREE.Vector2(0, 0));

  const hoverVelocity = useRef(new THREE.Vector2(0, 0));

  /*
   * =====================================================
   * SCROLL BEND
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
   * MOUSE FOLLOW
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
   * Z
   * =====================================================
   */

  const zCurrent = useRef(0);

  const zVelocity = useRef(0);

  /*
   * =====================================================
   * FRAME
   * =====================================================
   */

  useFrame((_, delta) => {
    const mesh = meshRef.current;

    const material = materialRef.current;

    const anchor = anchorRef.current;

    if (!mesh || !material || !anchor) {
      return;
    }

    const dt = Math.min(delta, 1 / 30);

    const rect = anchor.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    /*
     * ===================================================
     * COVER
     * ===================================================
     */

    const cover = getCoverUv(texture, rect.width, rect.height);

    material.uniforms.uUvScale.value.copy(cover.scale);

    material.uniforms.uUvOffset.value.copy(cover.offset);

    /*
     * ===================================================
     * POINTER
     * ===================================================
     */

    const pointer = pointerRef.current;

    const isHovered =
      pointer.active &&
      pointer.x >= rect.left &&
      pointer.x <= rect.right &&
      pointer.y >= rect.top &&
      pointer.y <= rect.bottom;

    let targetPointerX = 0.5;
    let targetPointerY = 0.5;

    if (isHovered) {
      targetPointerX = THREE.MathUtils.clamp(
        (pointer.x - rect.left) / rect.width,
        0,
        1,
      );

      targetPointerY = THREE.MathUtils.clamp(
        (pointer.y - rect.top) / rect.height,
        0,
        1,
      );
    }

    /*
     * ===================================================
     * POINTER SMOOTHING
     * ===================================================
     */

    const pointerFollow = isHovered ? 7 : 4.5;

    smoothPointer.current.x = THREE.MathUtils.damp(
      smoothPointer.current.x,
      targetPointerX,
      pointerFollow,
      dt,
    );

    smoothPointer.current.y = THREE.MathUtils.damp(
      smoothPointer.current.y,
      targetPointerY,
      pointerFollow,
      dt,
    );

    /*
     * ===================================================
     * HOVER BEND
     * ===================================================
     */

    const differenceX = smoothPointer.current.x - 0.5;

    const differenceY = smoothPointer.current.y - 0.5;

    const targetHoverX = isHovered
      ? THREE.MathUtils.clamp(differenceX * 0.16, -0.016, 0.016)
      : 0;

    const targetHoverY = isHovered
      ? THREE.MathUtils.clamp(-differenceY * 0.12, -0.012, 0.012)
      : 0;

    const hoverStiffness = isHovered ? 82 : 70;

    const hoverDamping = isHovered ? 17 : 14;

    /*
     * X
     */

    const hoverForceX = (targetHoverX - hoverBend.current.x) * hoverStiffness;

    hoverVelocity.current.x += hoverForceX * dt;

    hoverVelocity.current.x *= Math.exp(-hoverDamping * dt);

    hoverBend.current.x += hoverVelocity.current.x * dt;

    /*
     * Y
     */

    const hoverForceY = (targetHoverY - hoverBend.current.y) * hoverStiffness;

    hoverVelocity.current.y += hoverForceY * dt;

    hoverVelocity.current.y *= Math.exp(-hoverDamping * dt);

    hoverBend.current.y += hoverVelocity.current.y * dt;

    /*
     * ===================================================
     * ORIGINAL SUBTLE SCROLL BEND
     * ===================================================
     */

    const currentScrollY = window.scrollY;

    const scrollDifference = currentScrollY - previousScrollY.current;

    previousScrollY.current = currentScrollY;

    const targetScrollBend = THREE.MathUtils.clamp(
      -scrollDifference * 0.0018,
      -0.022,
      0.022,
    );

    const scrollForce = (targetScrollBend - scrollBend.current) * 105;

    scrollVelocity.current += scrollForce * dt;

    scrollVelocity.current *= Math.exp(-12 * dt);

    scrollBend.current += scrollVelocity.current * dt;

    /*
     * Smooth tilbake til flat.
     */

    if (Math.abs(scrollDifference) < 0.01) {
      scrollBend.current = THREE.MathUtils.damp(scrollBend.current, 0, 4.5, dt);

      scrollVelocity.current = THREE.MathUtils.damp(
        scrollVelocity.current,
        0,
        5,
        dt,
      );
    }

    /*
     * ===================================================
     * FINAL BEND
     * ===================================================
     */

    material.uniforms.uDelta.value.set(
      hoverBend.current.x,

      hoverBend.current.y + scrollBend.current,
    );

    /*
     * ===================================================
     * MOUSE FOLLOW
     * ===================================================
     */

    const maxFollowX = rect.width * 0.065;

    const maxFollowY = rect.height * 0.04;

    positionTarget.current.x = isHovered ? differenceX * maxFollowX * 2 : 0;

    positionTarget.current.y = isHovered ? -differenceY * maxFollowY * 2 : 0;

    /*
     * Den gamle, mykere followeren.
     */

    const positionStiffness = isHovered ? 30 : 60;

    const positionDamping = isHovered ? 8 : 10;

    /*
     * X
     */

    const positionForceX =
      (positionTarget.current.x - positionCurrent.current.x) *
      positionStiffness;

    positionVelocity.current.x += positionForceX * dt;

    positionVelocity.current.x *= Math.exp(-positionDamping * dt);

    positionCurrent.current.x += positionVelocity.current.x * dt;

    /*
     * Y
     */

    const positionForceY =
      (positionTarget.current.y - positionCurrent.current.y) *
      positionStiffness;

    positionVelocity.current.y += positionForceY * dt;

    positionVelocity.current.y *= Math.exp(-positionDamping * dt);

    positionCurrent.current.y += positionVelocity.current.y * dt;

    /*
     * ===================================================
     * HOVER SCALE
     * ===================================================
     */

    const targetScale = isHovered ? 1.045 : 1;

    const scaleStiffness = isHovered ? 75 : 65;

    const scaleDamping = isHovered ? 14 : 15;

    const scaleForce = (targetScale - scaleCurrent.current) * scaleStiffness;

    scaleVelocity.current += scaleForce * dt;

    scaleVelocity.current *= Math.exp(-scaleDamping * dt);

    scaleCurrent.current += scaleVelocity.current * dt;

    /*
     * ===================================================
     * Z LIFT
     * ===================================================
     */

    const targetZ = isHovered ? 18 : 0;

    const zStiffness = isHovered ? 70 : 60;

    const zDamping = isHovered ? 14 : 15;

    const zForce = (targetZ - zCurrent.current) * zStiffness;

    zVelocity.current += zForce * dt;

    zVelocity.current *= Math.exp(-zDamping * dt);

    zCurrent.current += zVelocity.current * dt;

    /*
     * ===================================================
     * APPLY
     * ===================================================
     */

    mesh.position.set(
      positionCurrent.current.x,
      positionCurrent.current.y,
      zCurrent.current,
    );

    mesh.scale.set(
      rect.width * scaleCurrent.current,

      rect.height * scaleCurrent.current,

      1,
    );
  });

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[1, 1, 40, 40]} />

      <shaderMaterial
        ref={materialRef}
        vertexShader={previewBendVertexShader}
        fragmentShader={previewImageFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        depthWrite={false}
        depthTest
        toneMapped={false}
        precision="highp"
      />
    </mesh>
  );
}
