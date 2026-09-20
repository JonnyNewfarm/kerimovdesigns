"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";

import { useEffect, useMemo, useRef, useState } from "react";

import { ShaderMaterial, Vector2 } from "three";

import * as THREE from "three";

import { ANIMATION_VIDEO } from "./portfolioWorldAssets";

import {
  portfolioBendVertexShader,
  portfolioTextureFragmentShader,
} from "./portfolioImageShaders";

import { WORLD_SECTIONS } from "./portfolioWorldConstants";

import { SceneShell } from "./PortfolioPrimitives";

import { useRingMotion } from "./RingMotionContext";

import WorldButton from "./WorldButton";

function AnimationVideo({
  isActive,
  isMobile,
}: {
  isActive: boolean;

  isMobile: boolean;
}) {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialRef = useRef<ShaderMaterial | null>(null);

  const { difference } = useRingMotion();

  const hovered = useRef(false);

  const pointerTarget = useRef(new Vector2(0.5, 0.5));

  const smoothPointer = useRef(new Vector2(0.5, 0.5));

  const hoverBend = useRef(new Vector2(0, 0));

  const hoverBendVelocity = useRef(new Vector2(0, 0));

  const positionTarget = useRef(new Vector2(0, 0));

  const positionCurrent = useRef(new Vector2(0, 0));

  const positionVelocity = useRef(new Vector2(0, 0));

  const scaleCurrent = useRef(1);

  const scaleVelocity = useRef(0);

  const videoWidth = isMobile ? 4.5 : 5.5;

  const videoHeight = isMobile ? 2.6 : 3;

  /*
   * VIDEO SETUP
   */
  useEffect(() => {
    const video = document.createElement("video");

    video.src = ANIMATION_VIDEO;

    video.loop = true;

    video.muted = true;

    video.playsInline = true;

    video.autoplay = true;

    video.preload = "auto";

    video.crossOrigin = "anonymous";

    video.setAttribute("playsinline", "");

    video.setAttribute("webkit-playsinline", "");

    const videoTexture = new THREE.VideoTexture(video);

    videoTexture.colorSpace = THREE.SRGBColorSpace;

    videoTexture.wrapS = THREE.ClampToEdgeWrapping;

    videoTexture.wrapT = THREE.ClampToEdgeWrapping;

    videoTexture.minFilter = THREE.LinearFilter;

    videoTexture.magFilter = THREE.LinearFilter;

    videoTexture.needsUpdate = true;

    videoRef.current = video;

    setTexture(videoTexture);

    void video.play().catch(() => {});

    return () => {
      video.pause();

      video.removeAttribute("src");

      video.load();

      videoTexture.dispose();

      videoRef.current = null;
    };
  }, []);

  /*
   * PLAY/PAUSE
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (isActive) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: null as THREE.VideoTexture | null,
      },

      uDelta: {
        value: new Vector2(0, 0),
      },

      uAmplitude: {
        value: 0.00145,
      },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uTexture.value = texture;
  }, [texture, uniforms]);

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;

    const material = materialRef.current;

    if (!mesh || !material) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    /*
     * POINTER
     */
    const pointerFollow = 1 - Math.exp(-delta * 7);

    smoothPointer.current.lerp(pointerTarget.current, pointerFollow);

    const diffX = pointerTarget.current.x - smoothPointer.current.x;

    const diffY = pointerTarget.current.y - smoothPointer.current.y;

    /*
     * BEND
     */
    const hoverStrengthX = 120;

    const hoverStrengthY = 85;

    const targetHoverX = hovered.current ? diffX * hoverStrengthX : 0;

    const targetHoverY = hovered.current ? diffY * hoverStrengthY : 0;

    const bendStiffness = hovered.current ? 95 : 78;

    const bendDamping = hovered.current ? 17 : 14;

    hoverBendVelocity.current.x +=
      (targetHoverX - hoverBend.current.x) * bendStiffness * delta;

    hoverBendVelocity.current.y +=
      (targetHoverY - hoverBend.current.y) * bendStiffness * delta;

    hoverBendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    hoverBend.current.addScaledVector(hoverBendVelocity.current, delta);

    hoverBend.current.x = THREE.MathUtils.clamp(hoverBend.current.x, -30, 30);

    hoverBend.current.y = THREE.MathUtils.clamp(hoverBend.current.y, -22, 22);

    /*
     * SCROLL BEND
     */
    const scrollX = THREE.MathUtils.clamp(-difference.current * 3.15, -78, 78);

    const scrollY = THREE.MathUtils.clamp(difference.current * 0.58, -42, 42);

    material.uniforms.uDelta.value.set(
      scrollX * 0.95 + hoverBend.current.x,

      scrollY * 0.95 + hoverBend.current.y,
    );

    /*
     * MAGNETIC
     */
    const maxFollowX = 0.16;

    const maxFollowY = 0.1;

    positionTarget.current.set(
      hovered.current ? (pointerTarget.current.x - 0.5) * maxFollowX * 2 : 0,

      hovered.current ? (pointerTarget.current.y - 0.5) * maxFollowY * 2 : 0,
    );

    const positionStiffness = hovered.current ? 28 : 58;

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

    mesh.position.x = 0.25 + positionCurrent.current.x;

    mesh.position.y = -0.2 + positionCurrent.current.y;

    mesh.position.z = 0.15;

    /*
     * SCALE
     */
    const scaleTarget = hovered.current ? 1.08 : 1;

    const scaleStiffness = 68;

    const scaleDamping = 13;

    scaleVelocity.current +=
      (scaleTarget - scaleCurrent.current) * scaleStiffness * delta;

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

  if (!texture) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={[0.25, -0.2, 0.15]}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <planeGeometry args={[videoWidth, videoHeight, 36, 24]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={portfolioBendVertexShader}
        fragmentShader={portfolioTextureFragmentShader}
        toneMapped={false}
        side={THREE.DoubleSide}
        precision="highp"
      />
    </mesh>
  );
}

export default function AnimationScene({
  scale,
  isActive,
  isMobile,
  onOpen,
}: {
  scale: number;

  isActive: boolean;

  isMobile: boolean;

  onOpen: () => void;
}) {
  const angle = WORLD_SECTIONS[3].angle;

  return (
    <SceneShell angle={angle} scale={scale}>
      <AnimationVideo isActive={isActive} isMobile={isMobile} />

      <WorldButton
        label="ANIMATIONS"
        width={1.8}
        position={[1.65, -1.55, 0.4]}
        onClick={onOpen}
      />
    </SceneShell>
  );
}
