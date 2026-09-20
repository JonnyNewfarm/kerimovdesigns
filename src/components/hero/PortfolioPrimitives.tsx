"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  Vector2,
} from "three";
import * as THREE from "three";

import {
  portfolioBendVertexShader,
  portfolioImageFragmentShader,
  portfolioTextureFragmentShader,
} from "./portfolioImageShaders";

import { WORLD_RADIUS, WORLD_TEXT_COLOR } from "./portfolioWorldConstants";

import type { Position } from "./portfolioWorldTypes";

import { useBendMaterial, useRingMotion } from "./RingMotionContext";

type SceneShellProps = {
  angle: number;
  scale: number;
  children: React.ReactNode;
};

type ImagePlaneProps = {
  texture: Texture;

  position: Position;

  width: number;
  height: number;

  rotationZ?: number;
  bendStrength?: number;

  intro?: boolean;
  introActive?: boolean;
};

type TextPlaneProps = {
  text: string;

  position: Position;

  width: number;
  height: number;

  fontSize?: number;
  lineHeight?: number;

  align?: CanvasTextAlign;

  color?: string;

  bendStrength?: number;

  disableRaycast?: boolean;

  depthTest?: boolean;

  renderOrder?: number;

  fitText?: boolean;

  textPadding?: number;
};

/*
 * =========================================================
 * TEXTURE
 * =========================================================
 */

export function prepareTexture(texture: Texture) {
  texture.colorSpace = SRGBColorSpace;

  texture.needsUpdate = true;

  return texture;
}

/*
 * =========================================================
 * TEXT TEXTURE
 * =========================================================
 */

function createTextTexture({
  text,
  width,
  height,
  fontSize,
  lineHeight,
  align,
  color,
  fitText = false,
  textPadding = 24,
}: {
  text: string;

  width: number;
  height: number;

  fontSize: number;
  lineHeight: number;

  align: CanvasTextAlign;

  color: string;

  fitText?: boolean;

  textPadding?: number;
}) {
  const canvas = document.createElement("canvas");

  const textureHeight = 512;

  const textureWidth = Math.max(
    1,
    Math.round(textureHeight * (width / height)),
  );

  canvas.width = textureWidth;

  canvas.height = textureHeight;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = color;

  ctx.textAlign = align;

  ctx.textBaseline = "middle";

  const lines = text.split("\n");

  let finalFontSize = fontSize;

  ctx.font = `900 ${finalFontSize}px Satoshi, Arial, Helvetica, sans-serif`;

  if (fitText) {
    const maxTextWidth = canvas.width - textPadding * 2;

    const widestLine = Math.max(
      ...lines.map((line) => ctx.measureText(line).width),
    );

    if (widestLine > maxTextWidth) {
      finalFontSize *= maxTextWidth / widestLine;

      ctx.font = `900 ${finalFontSize}px Satoshi, Arial, Helvetica, sans-serif`;
    }
  }

  const adjustedLineHeight = lineHeight * (finalFontSize / fontSize);

  const totalHeight = (lines.length - 1) * adjustedLineHeight;

  const startY = canvas.height / 2 - totalHeight / 2;

  let x = canvas.width / 2;

  if (align === "left") {
    x = textPadding;
  }

  if (align === "right") {
    x = canvas.width - textPadding;
  }

  lines.forEach((line, index) => {
    ctx.fillText(line, x, startY + index * adjustedLineHeight);
  });

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;

  texture.needsUpdate = true;

  return texture;
}

/*
 * =========================================================
 * TEXT PLANE
 * =========================================================
 */

export function TextPlane({
  text,
  position,
  width,
  height,

  fontSize = 170,
  lineHeight = 170,

  align = "center",

  color = WORLD_TEXT_COLOR,

  bendStrength = 0.5,

  disableRaycast = false,

  depthTest = true,

  renderOrder = 0,

  fitText = false,

  textPadding = 24,
}: TextPlaneProps) {
  const materialRef = useRef<ShaderMaterial | null>(null);

  const texture = useMemo(
    () =>
      createTextTexture({
        text,
        width,
        height,
        fontSize,
        lineHeight,
        align,
        color,
        fitText,
        textPadding,
      }),
    [
      text,
      width,
      height,
      fontSize,
      lineHeight,
      align,
      color,
      fitText,
      textPadding,
    ],
  );

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: texture,
      },

      uDelta: {
        value: new Vector2(0, 0),
      },

      uAmplitude: {
        value: 0.00115,
      },
    }),
    [texture],
  );

  useBendMaterial(materialRef, bendStrength);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  if (!texture) {
    return null;
  }

  return (
    <mesh
      position={position}
      raycast={disableRaycast ? () => null : undefined}
      renderOrder={renderOrder}
    >
      <planeGeometry args={[width, height, 20, 10]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={portfolioBendVertexShader}
        fragmentShader={portfolioTextureFragmentShader}
        toneMapped={false}
        transparent
        depthTest={depthTest}
        depthWrite={false}
        side={THREE.DoubleSide}
        precision="highp"
      />
    </mesh>
  );
}

/*
 * =========================================================
 * COVER UV
 * =========================================================
 */

export function getCoverUv(
  texture: Texture,
  planeWidth: number,
  planeHeight: number,
) {
  const image = texture.image as HTMLImageElement | undefined;

  const imageWidth = image?.naturalWidth || image?.width || 1;

  const imageHeight = image?.naturalHeight || image?.height || 1;

  const imageAspect = imageWidth / imageHeight;

  const planeAspect = planeWidth / planeHeight;

  if (imageAspect > planeAspect) {
    const scaleX = planeAspect / imageAspect;

    return {
      scale: new Vector2(scaleX, 1),

      offset: new Vector2((1 - scaleX) / 2, 0),
    };
  }

  const scaleY = imageAspect / planeAspect;

  return {
    scale: new Vector2(1, scaleY),

    offset: new Vector2(0, (1 - scaleY) / 2),
  };
}

/*
 * =========================================================
 * IMAGE PLANE
 * =========================================================
 */

export function ImagePlane({
  texture,
  position,
  width,
  height,

  rotationZ = 0,

  bendStrength = 1,

  intro = false,

  introActive = true,
}: ImagePlaneProps) {
  /*
   * Outer group:
   * intro position + scale.
   */
  const groupRef = useRef<THREE.Group | null>(null);

  /*
   * Inner mesh:
   * hover / magnetic.
   */
  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialRef = useRef<ShaderMaterial | null>(null);

  const { difference } = useRingMotion();

  const hovered = useRef(false);

  /*
   * INTRO
   */
  const introProgress = useRef(intro ? 0 : 1);

  /*
   * POINTER
   */
  const pointerTarget = useRef(new Vector2(0.5, 0.5));

  const smoothPointer = useRef(new Vector2(0.5, 0.5));

  /*
   * HOVER BEND
   */
  const hoverBend = useRef(new Vector2(0, 0));

  const hoverBendVelocity = useRef(new Vector2(0, 0));

  /*
   * MAGNETIC POSITION
   */
  const positionTarget = useRef(new Vector2(0, 0));

  const positionCurrent = useRef(new Vector2(0, 0));

  const positionVelocity = useRef(new Vector2(0, 0));

  /*
   * HOVER SCALE
   */
  const scaleCurrent = useRef(1);

  const scaleVelocity = useRef(0);

  /*
   * TEXTURE COVER
   */
  const cover = useMemo(
    () => getCoverUv(texture, width, height),
    [texture, width, height],
  );

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: texture,
      },

      uDelta: {
        value: new Vector2(0, 0),
      },

      uAmplitude: {
        value: 0.00145,
      },

      uUvScale: {
        value: cover.scale,
      },

      uUvOffset: {
        value: cover.offset,
      },
    }),
    [texture, cover],
  );

  /*
   * =====================================================
   * FRAME
   * =====================================================
   */

  useFrame((_, rawDelta) => {
    const group = groupRef.current;

    const mesh = meshRef.current;

    const material = materialRef.current;

    if (!group || !mesh || !material) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    /*
     * INTRO PROGRESS
     */
    if (intro && introActive && introProgress.current < 1) {
      introProgress.current = Math.min(1, introProgress.current + delta / 1.45);
    }

    const p = intro ? introProgress.current : 1;

    /*
     * INTRO MOVEMENT
     */
    const moveEase = 1 - Math.pow(1 - p, 3);

    const introStartX = 0.75;

    const introOffsetX = intro
      ? THREE.MathUtils.lerp(introStartX, 0, moveEase)
      : 0;

    group.position.set(
      position[0] + introOffsetX,

      position[1],

      position[2],
    );

    /*
     * INTRO SCALE
     */
    const scaleEase = 1 - Math.pow(1 - p, 4);

    const introScale = intro ? THREE.MathUtils.lerp(0.72, 1, scaleEase) : 1;

    group.scale.setScalar(introScale);

    /*
     * INTRO BEND
     */
    const bendRelease = THREE.MathUtils.smoothstep(p, 0.1, 1);

    const introBendX = intro ? THREE.MathUtils.lerp(-165, 0, bendRelease) : 0;

    const introBendY = intro ? THREE.MathUtils.lerp(12, 0, bendRelease) : 0;

    /*
     * POINTER LAG
     */
    const pointerFollow = 1 - Math.exp(-delta * 7);

    smoothPointer.current.lerp(pointerTarget.current, pointerFollow);

    const rawDifferenceX = pointerTarget.current.x - smoothPointer.current.x;

    const rawDifferenceY = pointerTarget.current.y - smoothPointer.current.y;

    /*
     * HOVER BEND
     */
    const hoverStrengthX = 115;

    const hoverStrengthY = 80;

    const targetHoverX = hovered.current ? rawDifferenceX * hoverStrengthX : 0;

    const targetHoverY = hovered.current ? rawDifferenceY * hoverStrengthY : 0;

    const hoverStiffness = hovered.current ? 92 : 75;

    const hoverDamping = hovered.current ? 17 : 14;

    hoverBendVelocity.current.x +=
      (targetHoverX - hoverBend.current.x) * hoverStiffness * delta;

    hoverBendVelocity.current.y +=
      (targetHoverY - hoverBend.current.y) * hoverStiffness * delta;

    hoverBendVelocity.current.multiplyScalar(Math.exp(-hoverDamping * delta));

    hoverBend.current.addScaledVector(hoverBendVelocity.current, delta);

    hoverBend.current.x = THREE.MathUtils.clamp(hoverBend.current.x, -28, 28);

    hoverBend.current.y = THREE.MathUtils.clamp(hoverBend.current.y, -20, 20);

    /*
     * SCROLL BEND
     */
    const scrollX = THREE.MathUtils.clamp(-difference.current * 3.15, -78, 78);

    const scrollY = THREE.MathUtils.clamp(difference.current * 0.58, -42, 42);

    material.uniforms.uDelta.value.set(
      scrollX * bendStrength + hoverBend.current.x + introBendX,

      scrollY * bendStrength + hoverBend.current.y + introBendY,
    );

    /*
     * MAGNETIC FOLLOW
     */
    const maxFollowX = width * 0.065;

    const maxFollowY = height * 0.04;

    positionTarget.current.set(
      hovered.current ? (pointerTarget.current.x - 0.5) * maxFollowX * 2 : 0,

      hovered.current ? (pointerTarget.current.y - 0.5) * maxFollowY * 2 : 0,
    );

    const positionStiffness = hovered.current ? 30 : 60;

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

    mesh.position.set(positionCurrent.current.x, positionCurrent.current.y, 0);

    /*
     * HOVER SCALE
     */
    const hoverScaleTarget = hovered.current ? 1.1 : 1;

    const scaleStiffness = 70;

    const scaleDamping = 14;

    scaleVelocity.current +=
      (hoverScaleTarget - scaleCurrent.current) * scaleStiffness * delta;

    scaleVelocity.current *= Math.exp(-scaleDamping * delta);

    scaleCurrent.current += scaleVelocity.current * delta;

    mesh.scale.setScalar(scaleCurrent.current);
  });

  function handleEnter(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    hovered.current = true;

    if (event.uv) {
      pointerTarget.current.copy(event.uv);

      smoothPointer.current.copy(event.uv);
    }
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
  }

  return (
    <group ref={groupRef} position={position} rotation={[0, 0, rotationZ]}>
      <mesh
        ref={meshRef}
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        <planeGeometry args={[width, height, 28, 32]} />

        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={portfolioBendVertexShader}
          fragmentShader={portfolioImageFragmentShader}
          toneMapped={false}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          precision="highp"
        />
      </mesh>
    </group>
  );
}

/*
 * =========================================================
 * RING POSITION
 * =========================================================
 */

function getRingPosition(angle: number): Position {
  return [Math.sin(angle) * WORLD_RADIUS, 0, -Math.cos(angle) * WORLD_RADIUS];
}

export function SceneShell({ angle, scale, children }: SceneShellProps) {
  return (
    <group
      position={getRingPosition(angle)}
      rotation={[0, -angle, 0]}
      scale={scale}
    >
      {children}
    </group>
  );
}
