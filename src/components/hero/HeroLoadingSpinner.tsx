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

varying float vForwardDistance;
varying float vSlurpEdge;

uniform float uTime;
uniform float uExit;

const float PI = 3.141592653589793238;
const float TAU = 6.283185307179586476;

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

float easeInOutCubic(float x) {
  return x < 0.5
    ? 4.0 * x * x * x
    : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
}

void main() {
  vUv = uv;

  vec3 p = position;

  /*
   * =====================================================
   * NORMAL SPINNER PULSE
   * =====================================================
   */

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

  radialDir.x *= sign(p.x);
  radialDir.y *= sign(p.y);

  /*
   * Normal pulse forsvinner når
   * slurp-exiten starter.
   */
  float loaderStrength =
    1.0 -
    smoothstep(
      0.0,
      0.3,
      uExit
    );

  p.xy +=
    radialDir *
    pulse *
    0.13 *
    loaderStrength;

  p.z +=
    pulse *
    0.18 *
    loaderStrength;

  p +=
    normal *
    pulseCore *
    0.035 *
    loaderStrength;

  p +=
    normal *
    sin(
      vUv.x * TAU +
      uTime * 1.5
    ) *
    0.008 *
    loaderStrength;

  /*
   * =====================================================
   * ONE-WAY SLURP
   * =====================================================
   *
   * VIKTIG:
   *
   * Dette er IKKE wrapped distance.
   *
   * Vi må vite hvilken vei rundt ringen
   * et punkt ligger fra splitten.
   *
   * Dermed kan vi spise ringen i kun
   * én retning.
   */

  float splitPoint = 0.72;

  /*
   * 0 = ved splitten.
   * 1 = én hel runde senere.
   *
   * Dette følger stigende UV.x.
   */
  float forwardDistance =
    fract(
      vUv.x -
      splitPoint +
      1.0
    );

  vForwardDistance =
    forwardDistance;

  /*
   * =====================================================
   * EXIT PROGRESS
   * =====================================================
   */

  float exitEase =
    easeInOutCubic(
      clamp(
        uExit,
        0.0,
        1.0
      )
    );

  /*
   * Den ene slurp-kanten beveger seg
   * hele veien rundt ringen.
   */
  float cutPosition =
    mix(
      0.0,
      1.015,
      exitEase
    );

  /*
   * =====================================================
   * SINGLE MOVING EDGE
   * =====================================================
   */

  float edgeDistance =
    forwardDistance -
    cutPosition;

  /*
   * Et område rett foran den bevegende
   * slurp-kanten.
   */
  float edgeWidth =
    mix(
      0.13,
      0.07,
      exitEase
    );

  float slurpEdge =
    1.0 -
    smoothstep(
      0.0,
      edgeWidth,
      edgeDistance
    );

  /*
   * Kun området FORAN kanten.
   *
   * Dermed påvirker vi ikke delen
   * som allerede er borte.
   */
  slurpEdge *=
    step(
      0.0,
      edgeDistance
    );

  slurpEdge *=
    smoothstep(
      0.015,
      0.08,
      uExit
    );

  float edgeCore =
    pow(
      slurpEdge,
      1.65
    );

  vSlurpEdge =
    slurpEdge;

  /*
   * =====================================================
   * TANGENTIAL SLURP
   * =====================================================
   *
   * Dette er selve "suges med rundt"
   * følelsen.
   *
   * Den levende enden trekkes fremover
   * i SAMME retning som cut-kanten beveger seg.
   */

  float angle =
    atan(
      p.y,
      p.x
    );

  float radius =
    length(
      p.xy
    );

  /*
   * Positiv rotasjon rundt ringen.
   */
  float tangentPull =
    edgeCore *
    mix(
      0.12,
      0.29,
      exitEase
    );

  angle +=
    tangentPull;

  p.x =
    cos(angle) *
    radius;

  p.y =
    sin(angle) *
    radius;

  /*
   * =====================================================
   * STRETCH
   * =====================================================
   *
   * Rett foran kanten strekkes loopen
   * litt før den blir slurpet bort.
   */

  float stretch =
    sin(
      slurpEdge *
      PI
    );

  p.xy *=
    1.0 +
    stretch *
    0.055;

  /*
   * =====================================================
   * PINCH THE END
   * =====================================================
   *
   * Gjør den bevegende enden tynnere,
   * nesten som elastisk materiale som
   * blir trukket inn.
   */

  p +=
    normal *
    (
      -0.073 *
      edgeCore
    );

  /*
   * =====================================================
   * INWARD SUCTION
   * =====================================================
   *
   * Enden dras svakt inn mot sentrum
   * samtidig som den beveger seg rundt.
   */

  float inwardPull =
    edgeCore *
    mix(
      0.12,
      0.36,
      exitEase
    );

  p.xy *=
    1.0 -
    inwardPull;

  /*
   * =====================================================
   * DEPTH
   * =====================================================
   *
   * Liten "snap" frem før enden
   * blir sugd bakover.
   */

  p.z +=
    stretch *
    0.035;

  p.z -=
    edgeCore *
    0.13;

  /*
   * =====================================================
   * ELASTIC TRAIL
   * =====================================================
   *
   * Litt deformation rett foran
   * slurp-kanten.
   */

  float trail =
    1.0 -
    smoothstep(
      0.0,
      edgeWidth * 2.3,
      max(
        edgeDistance,
        0.0
      )
    );

  trail *=
    smoothstep(
      0.02,
      0.12,
      uExit
    );

  float wobble =
    sin(
      forwardDistance *
      TAU * 2.0 -
      uTime * 2.0
    );

  p +=
    normal *
    wobble *
    trail *
    0.012;

  /*
   * =====================================================
   * FINAL TAIL
   * =====================================================
   *
   * På slutten er det bare en liten
   * bit av ringen igjen.
   *
   * Den skal også slurpes med samme
   * bevegelse — ikke scale hele objektet.
   */

  float finalPhase =
    smoothstep(
      0.84,
      1.0,
      uExit
    );

  /*
   * Kun den gjenværende enden påvirkes.
   */
  float remainingTail =
    1.0 -
    smoothstep(
      cutPosition,
      cutPosition + 0.17,
      forwardDistance
    );

  remainingTail *=
    step(
      cutPosition,
      forwardDistance
    );

  float finalPull =
    finalPhase *
    remainingTail;

  /*
   * Siste lille delen trekkes
   * videre rundt.
   */
  float finalAngle =
    finalPull *
    0.38;

  float finalRadius =
    length(
      p.xy
    );

  float currentAngle =
    atan(
      p.y,
      p.x
    );

  currentAngle +=
    finalAngle;

  finalRadius *=
    1.0 -
    finalPull *
    0.48;

  p.x =
    cos(currentAngle) *
    finalRadius;

  p.y =
    sin(currentAngle) *
    finalRadius;

  p.z -=
    finalPull *
    0.12;

  /*
   * =====================================================
   * OUTPUT
   * =====================================================
   */

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

varying float vForwardDistance;
varying float vSlurpEdge;

uniform float uTime;
uniform vec3 uColor;
uniform float uExit;

float easeInOutCubic(float x) {
  return x < 0.5
    ? 4.0 * x * x * x
    : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
}

void main() {
  /*
   * =====================================================
   * ONE-WAY CUT
   * =====================================================
   */

  float exitEase =
    easeInOutCubic(
      clamp(
        uExit,
        0.0,
        1.0
      )
    );

  float cutPosition =
    mix(
      0.0,
      1.015,
      exitEase
    );

  /*
   * Alt som slurp-kanten allerede
   * har passert blir usynlig.
   *
   * Bare én side beveger seg.
   */
  float visible =
    smoothstep(
      cutPosition,
      cutPosition + 0.012,
      vForwardDistance
    );

  /*
   * Før exit:
   * full ring.
   */
  visible =
    mix(
      1.0,
      visible,
      smoothstep(
        0.008,
        0.045,
        uExit
      )
    );

  if (
    visible <
    0.004
  ) {
    discard;
  }

  /*
   * =====================================================
   * NORMAL PULSE
   * =====================================================
   */

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
   * =====================================================
   * LIGHTING
   * =====================================================
   */

  vec3 normal =
    normalize(
      vNormalView
    );

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
    ) *
    0.5 +
    0.5;

  light =
    mix(
      0.62,
      1.0,
      light
    );

  /*
   * =====================================================
   * COLOR
   * =====================================================
   */

  vec3 brightColor =
    vec3(
      1.0,
      0.97,
      0.91
    );

  float pulseStrength =
    1.0 -
    smoothstep(
      0.0,
      0.28,
      uExit
    );

  vec3 color =
    mix(
      uColor,
      brightColor,
      (
        pulse * 0.35 +
        pulseCore * 0.35
      ) *
      pulseStrength
    );

  /*
   * Liten highlight på akkurat
   * den ene enden som blir slurpet.
   */
  color =
    mix(
      color,
      brightColor,
      vSlurpEdge *
      0.24
    );

  color *=
    light;

  /*
   * =====================================================
   * ALPHA
   * =====================================================
   */

  float finalFade =
    1.0 -
    smoothstep(
      0.985,
      1.0,
      uExit
    );

  gl_FragColor =
    vec4(
      color,
      visible *
      finalFade *
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

function ElasticLoopSpinner({ exiting }: { exiting: boolean }) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const exitRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },

      uColor: {
        value: new THREE.Color("#ecdfcc"),
      },

      uExit: {
        value: 0,
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

    /*
     * =================================================
     * TIME
     * =================================================
     */

    material.uniforms.uTime.value += delta;

    /*
     * =================================================
     * EXIT
     * =================================================
     */

    if (exiting) {
      exitRef.current = Math.min(1, exitRef.current + delta / 1.08);
    } else {
      exitRef.current = THREE.MathUtils.damp(exitRef.current, 0, 10, delta);
    }

    const exit = exitRef.current;

    material.uniforms.uExit.value = exit;

    /*
     * =================================================
     * ROTATION
     * =================================================
     *
     * Viktig:
     *
     * Spinneren fortsetter å gå
     * SAMME vei mens den slurpes.
     *
     * Den stopper ikke opp.
     */

    const rotationStrength = THREE.MathUtils.lerp(1, 0.72, exit);

    mesh.rotation.z += delta * 0.95 * rotationStrength;

    mesh.rotation.y += delta * 0.42 * rotationStrength;

    /*
     * Normal tilt.
     */
    mesh.rotation.x = 0.78 + Math.sin(time * 0.55) * 0.08 * (1 - exit * 0.7);

    /*
     * Veldig liten ekstra spin
     * når slurpen er langt på vei.
     *
     * Holder momentumet i samme retning.
     */
    const finish = THREE.MathUtils.smoothstep(exit, 0.55, 1);

    mesh.rotation.z += delta * finish * 0.35;
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
           */
          0.085,

          /*
           * Tube segments
           */
          20,

          /*
           * Circle segments
           *
           * Mange segmenter fordi den
           * ene bevegende enden skal
           * deformeres smooth.
           */
          280,
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
  onExitComplete,
}: {
  loaderComplete: boolean;
  onExitComplete?: () => void;
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
        /*
         * Ingen scale-down.
         *
         * Shaderen gjør hele exit.
         */
        opacity: loaderComplete ? 0 : 1,

        scale: 1,
      }}
      transition={{
        opacity: {
          duration: loaderComplete ? 0.1 : 0.35,

          /*
           * Vent til slurpen er ferdig.
           */
          delay: loaderComplete ? 1.04 : 0,

          ease: [0.22, 1, 0.36, 1],
        },

        scale: {
          duration: 0.5,

          ease: [0.22, 1, 0.36, 1],
        },
      }}
      onAnimationComplete={() => {
        if (loaderComplete) {
          setShouldRender(false);
          onExitComplete?.();
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
        <ElasticLoopSpinner exiting={loaderComplete} />
      </Canvas>
    </motion.div>
  );
}
