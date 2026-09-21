"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import { Color, Group, ShaderMaterial, Texture, Vector2 } from "three";
import * as THREE from "three";

import {
  portfolioBendVertexShader,
  portfolioImageFragmentShader,
  projectLabelFragmentShader,
} from "./portfolioImageShaders";

import { WORLD_SECTIONS } from "./portfolioWorldConstants";

import type { Position } from "./portfolioWorldTypes";

import { getCoverUv, SceneShell, TextPlane } from "./PortfolioPrimitives";

import { useRingMotion } from "./RingMotionContext";

import WorldButton from "./WorldButton";

/*
 * =========================================================
 * PROJECT LABEL
 * =========================================================
 */

function ProjectLabel({
  title,

  width,
  height,

  labelWidth,

  labelHeight = 0.26,

  labelInsetX = 0.1,
  labelInsetY = 0.1,

  labelShaderColors,

  labelShaderSpeed = 0.7,

  labelTextColor,

  scaleRef,
}: {
  title: string;

  width: number;
  height: number;

  labelWidth: number;

  labelHeight?: number;

  labelInsetX?: number;
  labelInsetY?: number;

  labelShaderColors: [string, string, string];

  labelShaderSpeed?: number;

  labelTextColor: string;

  scaleRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<Group | null>(null);

  const materialRef = useRef<ShaderMaterial | null>(null);

  const [colorA, colorB, colorC] = labelShaderColors;

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },

      uSpeed: {
        value: labelShaderSpeed,
      },

      uColorA: {
        value: new Color(colorA),
      },

      uColorB: {
        value: new Color(colorB),
      },

      uColorC: {
        value: new Color(colorC),
      },
    }),
    [colorA, colorB, colorC, labelShaderSpeed],
  );

  useFrame((state) => {
    if (ref.current) {
      const scale = Math.max(0, scaleRef.current);

      ref.current.scale.set(scale, scale, 1);

      ref.current.visible = scale > 0.001;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const actualLabelWidth = Math.min(labelWidth, width - labelInsetX * 2);

  const x = -width / 2 + labelInsetX + actualLabelWidth / 2;

  const y = height / 2 - labelInsetY - labelHeight / 2;

  return (
    <group ref={ref} position={[x, y, 0.12]} scale={0}>
      <mesh renderOrder={100} raycast={() => null}>
        <planeGeometry args={[actualLabelWidth, labelHeight]} />

        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={`
            varying vec2 vUv;

            void main() {
              vUv = uv;

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(
                  position,
                  1.0
                );
            }
          `}
          fragmentShader={projectLabelFragmentShader}
          toneMapped={false}
          transparent
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
          precision="highp"
        />
      </mesh>

      <TextPlane
        text={title}
        position={[0, 0, 0.01]}
        width={actualLabelWidth - 0.08}
        height={labelHeight + 0.02}
        fontSize={170}
        fitText
        textPadding={32}
        color={labelTextColor}
        disableRaycast
        depthTest={false}
        renderOrder={101}
      />
    </group>
  );
}

/*
 * =========================================================
 * PROJECT HOVER IMAGE
 * =========================================================
 */

function ProjectHoverImage({
  title,

  texture,

  position,

  width,
  height,

  labelWidth = 1.1,

  labelHeight = 0.26,

  labelInsetX = 0.1,

  labelInsetY = 0.1,

  labelShaderColors = ["#41413d", "#5b5b55", "#77776f"],

  labelShaderSpeed = 0.9,

  labelTextColor = "#ffffff",

  rotationZ = 0,

  bendStrength = 1,

  hoverScale = 1.08,

  hoverZ = 1.15,

  renderOrder = 0,

  isMobile,

  isActive,

  isDimmed,

  onHoverChange,

  onClick,
}: {
  title: string;

  texture: Texture;

  position: Position;

  width: number;
  height: number;

  labelWidth?: number;

  labelHeight?: number;

  labelInsetX?: number;

  labelInsetY?: number;

  labelBgColor?: string;

  labelTextColor?: string;

  rotationZ?: number;

  bendStrength?: number;

  labelShaderColors?: [string, string, string];

  labelShaderSpeed?: number;

  hoverScale?: number;

  hoverZ?: number;

  renderOrder?: number;

  isMobile: boolean;

  isActive: boolean;

  isDimmed: boolean;

  onHoverChange: (hovered: boolean) => void;

  onClick: () => void;
}) {
  const groupRef = useRef<Group | null>(null);

  const materialRef = useRef<ShaderMaterial | null>(null);

  /*
   * =========================================================
   * HOVER
   * =========================================================
   */

  const hovered = useRef(false);

  /*
   * =========================================================
   * POINTER
   * =========================================================
   */

  const pointerTarget = useRef(new Vector2(0.5, 0.5));

  const smoothPointer = useRef(new Vector2(0.5, 0.5));

  /*
   * =========================================================
   * HOVER BEND
   * =========================================================
   */

  const hoverBend = useRef(new Vector2(0, 0));

  const hoverBendVelocity = useRef(new Vector2(0, 0));

  /*
   * =========================================================
   * MAGNETIC POSITION
   * =========================================================
   */

  const positionTarget = useRef(new Vector2(0, 0));

  const positionCurrent = useRef(new Vector2(0, 0));

  const positionVelocity = useRef(new Vector2(0, 0));

  /*
   * =========================================================
   * SCALE
   * =========================================================
   */

  const scaleCurrent = useRef(1);

  const scaleVelocity = useRef(0);

  /*
   * =========================================================
   * Z
   * =========================================================
   */

  const zCurrent = useRef(0);

  const zVelocity = useRef(0);

  /*
   * =========================================================
   * LABEL
   * =========================================================
   */

  const labelScale = useRef(0);

  const labelVelocity = useRef(0);

  /*
   * =========================================================
   * MOBILE TAP
   * =========================================================
   *
   * Vi skiller tap fra swipe.
   *
   * Hvis fingeren har beveget seg mer enn threshold,
   * åpner vi IKKE prosjektet.
   */

  const mobilePointerStart = useRef({
    x: 0,
    y: 0,
  });

  const mobilePointerMoved = useRef(false);

  /*
   * =========================================================
   * RING MOTION
   * =========================================================
   */

  const { difference } = useRingMotion();

  /*
   * =========================================================
   * COVER
   * =========================================================
   */

  const cover = useMemo(
    () => getCoverUv(texture, width, height),
    [texture, width, height],
  );

  /*
   * =========================================================
   * UNIFORMS
   * =========================================================
   */

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
   * =========================================================
   * FRAME
   * =========================================================
   */

  useFrame((_, rawDelta) => {
    const group = groupRef.current;

    const material = materialRef.current;

    if (!group || !material) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    /*
     * =====================================================
     * MOBILE
     * =====================================================
     *
     * Mobil bruker IKKE hover-systemet.
     *
     * Vi setter alle hover-relaterte verdier hardt
     * tilbake til default.
     *
     * Det eneste som fortsatt animeres er scroll-bend.
     */

    if (isMobile) {
      /*
       * Hover state.
       */

      hovered.current = false;

      /*
       * Pointer.
       */

      pointerTarget.current.set(0.5, 0.5);

      smoothPointer.current.set(0.5, 0.5);

      /*
       * Hover bend.
       */

      hoverBend.current.set(0, 0);

      hoverBendVelocity.current.set(0, 0);

      /*
       * Magnetic follow.
       */

      positionTarget.current.set(0, 0);

      positionCurrent.current.set(0, 0);

      positionVelocity.current.set(0, 0);

      /*
       * Scale.
       */

      scaleCurrent.current = 1;

      scaleVelocity.current = 0;

      group.scale.set(1, 1, 1);

      /*
       * Z.
       */

      zCurrent.current = 0;

      zVelocity.current = 0;

      /*
       * Label.
       */

      labelScale.current = 0;

      labelVelocity.current = 0;

      /*
       * Original position.
       */

      group.position.set(position[0], position[1], position[2]);

      /*
       * Scroll bend.
       *
       * Dette beholdes.
       */

      const scrollX = THREE.MathUtils.clamp(
        -difference.current * 3.15,
        -78,
        78,
      );

      const scrollY = THREE.MathUtils.clamp(difference.current * 0.58, -42, 42);

      material.uniforms.uDelta.value.set(
        scrollX * bendStrength,

        scrollY * bendStrength,
      );

      return;
    }

    /*
     * =====================================================
     * DESKTOP POINTER LAG
     * =====================================================
     */

    const pointerFollow = 1 - Math.exp(-delta * 8);

    smoothPointer.current.lerp(pointerTarget.current, pointerFollow);

    const diffX = pointerTarget.current.x - smoothPointer.current.x;

    const diffY = pointerTarget.current.y - smoothPointer.current.y;

    /*
     * =====================================================
     * DESKTOP HOVER BEND
     * =====================================================
     */

    const targetHoverBendX = hovered.current ? diffX * 90 : 0;

    const targetHoverBendY = hovered.current ? diffY * 65 : 0;

    const bendStiffness = 90;

    const bendDamping = 16;

    hoverBendVelocity.current.x +=
      (targetHoverBendX - hoverBend.current.x) * bendStiffness * delta;

    hoverBendVelocity.current.y +=
      (targetHoverBendY - hoverBend.current.y) * bendStiffness * delta;

    hoverBendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    hoverBend.current.addScaledVector(hoverBendVelocity.current, delta);

    /*
     * =====================================================
     * SCROLL BEND
     * =====================================================
     */

    const scrollX = THREE.MathUtils.clamp(-difference.current * 3.15, -78, 78);

    const scrollY = THREE.MathUtils.clamp(difference.current * 0.58, -42, 42);

    material.uniforms.uDelta.value.set(
      scrollX * bendStrength + hoverBend.current.x,

      scrollY * bendStrength + hoverBend.current.y,
    );

    /*
     * =====================================================
     * MAGNETIC FOLLOW
     * =====================================================
     */

    const maxFollowX = width * 0.055;

    const maxFollowY = height * 0.035;

    positionTarget.current.set(
      hovered.current ? (pointerTarget.current.x - 0.5) * maxFollowX * 2 : 0,

      hovered.current ? (pointerTarget.current.y - 0.5) * maxFollowY * 2 : 0,
    );

    const positionStiffness = hovered.current ? 32 : 58;

    const positionDamping = hovered.current ? 8.5 : 11;

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
     * =====================================================
     * SCALE
     * =====================================================
     */

    const scaleTarget = isActive ? hoverScale : isDimmed ? 0.985 : 1;

    scaleVelocity.current += (scaleTarget - scaleCurrent.current) * 70 * delta;

    scaleVelocity.current *= Math.exp(-13 * delta);

    scaleCurrent.current += scaleVelocity.current * delta;

    group.scale.setScalar(scaleCurrent.current);

    /*
     * =====================================================
     * Z
     * =====================================================
     */

    const zTarget = isActive ? hoverZ : isDimmed ? -0.35 : 0;

    zVelocity.current += (zTarget - zCurrent.current) * 60 * delta;

    zVelocity.current *= Math.exp(-12 * delta);

    zCurrent.current += zVelocity.current * delta;

    /*
     * =====================================================
     * FINAL POSITION
     * =====================================================
     */

    group.position.set(
      position[0] + positionCurrent.current.x,

      position[1] + positionCurrent.current.y,

      position[2] + zCurrent.current,
    );

    /*
     * =====================================================
     * LABEL
     * =====================================================
     */

    const labelTarget = hovered.current ? 1 : 0;

    labelVelocity.current += (labelTarget - labelScale.current) * 85 * delta;

    labelVelocity.current *= Math.exp(-15 * delta);

    labelScale.current += labelVelocity.current * delta;
  });

  /*
   * =========================================================
   * DESKTOP POINTER ENTER
   * =========================================================
   */

  function handleEnter(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    hovered.current = true;

    onHoverChange(true);

    if (event.uv) {
      pointerTarget.current.copy(event.uv);

      smoothPointer.current.copy(event.uv);
    }

    document.body.style.cursor = "pointer";
  }

  /*
   * =========================================================
   * DESKTOP POINTER MOVE
   * =========================================================
   */

  function handleMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    if (!event.uv) {
      return;
    }

    pointerTarget.current.copy(event.uv);
  }

  /*
   * =========================================================
   * DESKTOP POINTER LEAVE
   * =========================================================
   */

  function handleLeave(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    hovered.current = false;

    onHoverChange(false);

    pointerTarget.current.set(0.5, 0.5);

    document.body.style.cursor = "";
  }

  /*
   * =========================================================
   * DESKTOP CLICK
   * =========================================================
   */

  function handleDesktopClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    document.body.style.cursor = "";

    onClick();
  }

  /*
   * =========================================================
   * MOBILE POINTER DOWN
   * =========================================================
   */

  function handleMobilePointerDown(event: ThreeEvent<PointerEvent>) {
    if (!isMobile) {
      return;
    }

    mobilePointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    mobilePointerMoved.current = false;
  }

  /*
   * =========================================================
   * MOBILE POINTER MOVE
   * =========================================================
   *
   * Dette brukes KUN for å avgjøre om det er swipe
   * eller et faktisk tap.
   *
   * Ingen visuell effekt skjer.
   */

  function handleMobilePointerMove(event: ThreeEvent<PointerEvent>) {
    if (!isMobile) {
      return;
    }

    const dx = event.clientX - mobilePointerStart.current.x;

    const dy = event.clientY - mobilePointerStart.current.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 8) {
      mobilePointerMoved.current = true;
    }
  }

  /*
   * =========================================================
   * MOBILE POINTER UP
   * =========================================================
   */

  function handleMobilePointerUp(event: ThreeEvent<PointerEvent>) {
    if (!isMobile) {
      return;
    }

    /*
     * Hvis fingeren faktisk har dratt/scrollet:
     *
     * INGENTING skjer.
     */

    if (mobilePointerMoved.current) {
      return;
    }

    /*
     * Faktisk tap.
     */

    event.stopPropagation();

    onClick();
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, 0, rotationZ]}
      /*
       * =====================================================
       * DESKTOP HOVER
       * =====================================================
       *
       * Disse eksisterer IKKE på mobil.
       */

      onPointerEnter={isMobile ? undefined : handleEnter}
      onPointerLeave={isMobile ? undefined : handleLeave}
      /*
       * =====================================================
       * POINTER MOVE
       * =====================================================
       *
       * Desktop:
       * magnetic hover.
       *
       * Mobile:
       * brukes bare for å oppdage swipe.
       */

      onPointerMove={isMobile ? handleMobilePointerMove : handleMove}
      /*
       * =====================================================
       * MOBILE TAP
       * =====================================================
       */

      onPointerDown={isMobile ? handleMobilePointerDown : undefined}
      onPointerUp={isMobile ? handleMobilePointerUp : undefined}
      /*
       * =====================================================
       * DESKTOP CLICK
       * =====================================================
       */

      onClick={isMobile ? undefined : handleDesktopClick}
    >
      <mesh renderOrder={!isMobile && isActive ? 90 : renderOrder}>
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

      {/*
       * =====================================================
       * LABEL
       * =====================================================
       *
       * VIKTIG:
       *
       * Labelen rendres IKKE I DET HELE TATT på mobil.
       *
       * Så det finnes ingen mulighet for at title badge
       * plutselig popper opp ved touch.
       */}

      {!isMobile && (
        <ProjectLabel
          title={title}
          width={width}
          height={height}
          labelWidth={labelWidth}
          labelHeight={labelHeight}
          labelInsetX={labelInsetX}
          labelInsetY={labelInsetY}
          labelShaderColors={labelShaderColors}
          labelShaderSpeed={labelShaderSpeed}
          labelTextColor={labelTextColor}
          scaleRef={labelScale}
        />
      )}
    </group>
  );
}

/*
 * =========================================================
 * ALL PROJECTS SCENE
 * =========================================================
 */

export default function AllProjectsScene({
  scale,

  textures,

  onOpen,

  isMobile,

  dreamProjectTransitionRef,

  postersBundleTransitionRef,

  kistefossTransitionRef,

  aurelisTransitionRef,

  artExhibitionTransitionRef,
}: {
  scale: number;

  textures: Texture[];

  onOpen: () => void;

  isMobile: boolean;

  dreamProjectTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  postersBundleTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  kistefossTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  aurelisTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  artExhibitionTransitionRef: React.RefObject<HTMLAnchorElement | null>;
}) {
  const angle = WORLD_SECTIONS[5].angle;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /*
   * =========================================================
   * HOVER CHANGE
   * =========================================================
   *
   * Ekstra guard:
   *
   * Selv om noe skulle trigge callbacken på mobil,
   * nekter vi å endre activeIndex.
   */

  function setProjectHover(index: number, hovered: boolean) {
    if (isMobile) {
      return;
    }

    setActiveIndex(hovered ? index : null);
  }

  return (
    <SceneShell angle={angle} scale={scale}>
      <group position={[-0.45, 0, 0]} scale={0.9}>
        {/*
         * ===================================================
         * LEFT / LOW
         * ===================================================
         */}

        <ProjectHoverImage
          title="DRØMMENES MELODI"
          texture={textures[0]}
          position={[-2.15, -0.35, 0.4]}
          renderOrder={5}
          width={1.85}
          height={2.6}
          hoverScale={1.2}
          hoverZ={2.1}
          labelWidth={1.2}
          labelHeight={0.26}
          labelInsetX={0.18}
          labelBgColor="#5F3568"
          labelShaderColors={["#8B58A2", "#A36FBA", "#BE91D0"]}
          labelTextColor="#ffffff"
          bendStrength={0.92}
          rotationZ={-0.035}
          isMobile={isMobile}
          isActive={!isMobile && activeIndex === 0}
          isDimmed={!isMobile && activeIndex !== null && activeIndex !== 0}
          onHoverChange={(hovered) => {
            setProjectHover(0, hovered);
          }}
          onClick={() => {
            dreamProjectTransitionRef.current?.click();
          }}
        />

        {/*
         * ===================================================
         * UPPER LEFT
         * ===================================================
         */}

        <ProjectHoverImage
          title="POSTERS BUNDLE #1"
          texture={textures[2]}
          position={[-0.95, 0.48, 1]}
          renderOrder={10}
          width={1.8}
          height={2.35}
          hoverScale={1.1}
          hoverZ={2}
          labelWidth={1.3}
          labelBgColor="#8593f3"
          labelShaderColors={["#7480D1", "#8593F3", "#ABB4FF"]}
          labelTextColor="#ffffff"
          bendStrength={0.86}
          rotationZ={0.025}
          isMobile={isMobile}
          isActive={!isMobile && activeIndex === 2}
          isDimmed={!isMobile && activeIndex !== null && activeIndex !== 2}
          onHoverChange={(hovered) => {
            setProjectHover(2, hovered);
          }}
          onClick={() => {
            postersBundleTransitionRef.current?.click();
          }}
        />

        {/*
         * ===================================================
         * MAIN / CENTER
         * ===================================================
         */}

        <ProjectHoverImage
          title="KISTEFOSS MUSEUM"
          texture={textures[1]}
          position={[0.15, -0.02, 2.1]}
          renderOrder={15}
          width={1.9}
          height={2.55}
          hoverScale={1.07}
          hoverZ={1.3}
          labelWidth={1.3}
          labelBgColor="#0F3470"
          labelShaderColors={["#668BC5", "#7FA0D1", "#9CB8DE"]}
          labelTextColor="#ffffff"
          bendStrength={0.82}
          rotationZ={-0.018}
          isMobile={isMobile}
          isActive={!isMobile && activeIndex === 1}
          isDimmed={!isMobile && activeIndex !== null && activeIndex !== 1}
          onHoverChange={(hovered) => {
            setProjectHover(1, hovered);
          }}
          onClick={() => {
            kistefossTransitionRef.current?.click();
          }}
        />

        {/*
         * ===================================================
         * RIGHT / HIGH
         * ===================================================
         */}

        <ProjectHoverImage
          title="AURELIS CAPITAL"
          texture={textures[3]}
          position={[1.55, 0.58, 3]}
          renderOrder={20}
          width={1.6}
          height={1.9}
          hoverScale={1.15}
          hoverZ={1.1}
          labelWidth={1}
          labelBgColor="#075354"
          labelShaderColors={["#419693", "#5AA9A5", "#78BDB9"]}
          labelTextColor="#ffffff"
          bendStrength={0.95}
          rotationZ={0.028}
          isMobile={isMobile}
          isActive={!isMobile && activeIndex === 3}
          isDimmed={!isMobile && activeIndex !== null && activeIndex !== 3}
          onHoverChange={(hovered) => {
            setProjectHover(3, hovered);
          }}
          onClick={() => {
            aurelisTransitionRef.current?.click();
          }}
        />

        {/*
         * ===================================================
         * LOWER FRONT
         * ===================================================
         */}

        <ProjectHoverImage
          title="ART EXHIBITION"
          texture={textures[4]}
          position={[0.95, -0.95, 3.6]}
          renderOrder={25}
          width={1.3}
          height={1.63}
          hoverScale={1.18}
          hoverZ={0.8}
          labelWidth={0.8}
          labelHeight={0.22}
          labelInsetX={0.1}
          labelInsetY={0.1}
          labelBgColor="#706f66"
          labelShaderColors={["#76666E", "#8D747E", "#A58A91"]}
          labelTextColor="#ffffff"
          bendStrength={0.88}
          rotationZ={-0.045}
          isMobile={isMobile}
          isActive={!isMobile && activeIndex === 4}
          isDimmed={!isMobile && activeIndex !== null && activeIndex !== 4}
          onHoverChange={(hovered) => {
            setProjectHover(4, hovered);
          }}
          onClick={() => {
            artExhibitionTransitionRef.current?.click();
          }}
        />

        {/*
         * ===================================================
         * ALL PROJECTS BUTTON
         * ===================================================
         */}

        <WorldButton
          label="ALL PROJECTS"
          width={1.25}
          height={0.4}
          fontSize={210}
          position={[1.6, -1.7, 3.8]}
          onClick={onOpen}
        />
      </group>
    </SceneShell>
  );
}
