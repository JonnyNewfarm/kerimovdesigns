"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import * as THREE from "three";

/*
 * =========================================================
 * SHADERS
 * =========================================================
 */

const spinnerVertexShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying vec3 vNormalView;

uniform float uTime;

void main() {
  vUv = uv;

  vec3 p = position;

  /*
   * vUv.x går rundt hele ringen.
   * En pulse reiser rundt loopen.
   */
  float travel =
    fract(
      vUv.x -
      uTime * 0.33
    );

  /*
   * Wrapped distance til pulse-center.
   */
  float dist =
    min(
      travel,
      1.0 - travel
    );

  /*
   * Brei myk pulse.
   */
  float pulse =
    1.0 -
    smoothstep(
      0.0,
      0.22,
      dist
    );

  /*
   * Mer konsentrert kjerne.
   */
  float pulseCore =
    1.0 -
    smoothstep(
      0.0,
      0.085,
      dist
    );

  /*
   * Retning utover fra sentrum av ringen.
   */
  vec2 radialDir =
    normalize(
      max(
        vec2(
          abs(p.x),
          abs(p.y)
        ),
        vec2(0.0001)
      )
    );

  radialDir.x *=
    sign(p.x);

  radialDir.y *=
    sign(p.y);

  /*
   * Svell litt utover akkurat der
   * pulsen passerer.
   */
  p.xy +=
    radialDir *
    pulse *
    0.13;

  /*
   * Løft pulsen frem i Z-rommet.
   */
  p.z +=
    pulse *
    0.18;

  /*
   * Litt ekstra volum i kjernen.
   */
  p +=
    normal *
    pulseCore *
    0.035;

  /*
   * Veldig subtil organisk bevegelse
   * over hele ringen.
   */
  p +=
    normal *
    sin(
      vUv.x * 6.28318530718 +
      uTime * 1.5
    ) *
    0.008;

  vec4 mvPosition =
    modelViewMatrix *
    vec4(
      p,
      1.0
    );

  vNormalView =
    normalize(
      normalMatrix *
      normal
    );

  gl_Position =
    projectionMatrix *
    mvPosition;
}
`;

const spinnerFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying vec3 vNormalView;

uniform float uTime;
uniform vec3 uColor;

void main() {
  float travel =
    fract(
      vUv.x -
      uTime * 0.33
    );

  float dist =
    min(
      travel,
      1.0 - travel
    );

  float pulse =
    1.0 -
    smoothstep(
      0.0,
      0.22,
      dist
    );

  float pulseCore =
    1.0 -
    smoothstep(
      0.0,
      0.085,
      dist
    );

  /*
   * Enkel view-space lighting.
   */
  vec3 normal =
    normalize(vNormalView);

  vec3 lightDir =
    normalize(
      vec3(
        0.45,
        0.7,
        1.0
      )
    );

  float light =
    dot(
      normal,
      lightDir
    ) * 0.5 + 0.5;

  light =
    mix(
      0.62,
      1.0,
      light
    );

  vec3 baseColor =
    uColor;

  vec3 brightColor =
    vec3(
      1.0,
      0.97,
      0.91
    );

  vec3 color =
    mix(
      baseColor,
      brightColor,
      pulse * 0.35 +
      pulseCore * 0.35
    );

  color *= light;

  gl_FragColor =
    vec4(
      color,
      0.96
    );

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/*
 * =========================================================
 * THREE SPINNER
 * =========================================================
 */

function ElasticLoopSpinner() {
  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },

      uColor: {
        value: new THREE.Color("#ecdfcc"),
      },
    }),
    [],
  );

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;

    const material = materialRef.current;

    if (!mesh || !material) {
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    const time = state.clock.elapsedTime;

    material.uniforms.uTime.value += delta;

    /*
     * Rolig premium-rotasjon.
     */
    mesh.rotation.z += delta * 0.95;

    mesh.rotation.y += delta * 0.42;

    mesh.rotation.x = 0.78 + Math.sin(time * 0.55) * 0.08;
  });

  return (
    <mesh ref={meshRef} rotation={[0.78, -0.25, 0]}>
      <torusGeometry
        args={[
          /*
           * Radius
           */
          1,

          /*
           * Thickness
           * Litt chunky.
           */
          0.085,

          /*
           * Tube segments
           */
          18,

          /*
           * Circle segments
           */
          180,
        ]}
      />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={spinnerVertexShader}
        fragmentShader={spinnerFragmentShader}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/*
 * =========================================================
 * LOADER
 * =========================================================
 */

export default function HeroLoadingSpinner({
  loaderComplete,
}: {
  loaderComplete: boolean;
}) {
  const [shouldRender, setShouldRender] = useState(!loaderComplete);

  useEffect(() => {
    if (!loaderComplete) {
      setShouldRender(true);
    }
  }, [loaderComplete]);

  if (!shouldRender) {
    return null;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.88,
      }}
      animate={{
        opacity: loaderComplete ? 0 : 1,

        scale: loaderComplete ? 0.92 : 1,
      }}
      transition={{
        opacity: {
          duration: loaderComplete ? 0.65 : 0.35,
          ease: [0.22, 1, 0.36, 1],
        },

        scale: {
          duration: loaderComplete ? 0.75 : 0.5,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      onAnimationComplete={() => {
        if (loaderComplete) {
          setShouldRender(false);
        }
      }}
      className="
        pointer-events-none
        absolute
        bottom-5
        right-5
        z-[1200]

        h-[58px]
        w-[58px]

        sm:bottom-6
        sm:right-6
        sm:h-[64px]
        sm:w-[64px]
      "
      style={{
        willChange: "opacity, transform",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0, 5.1],
          fov: 32,
          near: 0.1,
          far: 100,
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ElasticLoopSpinner />
      </Canvas>
    </motion.div>
  );
}
