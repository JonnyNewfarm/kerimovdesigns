"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { useTexture, useVideoTexture } from "@react-three/drei";

import * as THREE from "three";

import {
  IMAGE_WIDTH,
  MORPH_SMOOTHING,
  MORPH_STRENGTH,
  IMAGE_HEIGHT_FACTOR,
  SECTIONS,
} from "./servicesData";

import { vertexShader, fragmentShader } from "./servicesShaders";

type Props = {
  progressRef: MutableRefObject<number>;
};

function getAspect(texture: THREE.Texture) {
  const image = texture.image as
    | {
        width?: number;
        height?: number;
        naturalWidth?: number;
        naturalHeight?: number;
        videoWidth?: number;
        videoHeight?: number;
      }
    | undefined;

  if (!image) return 1;

  const width = image.videoWidth || image.naturalWidth || image.width || 1;

  const height = image.videoHeight || image.naturalHeight || image.height || 1;

  return width / height;
}

function MorphPlane({ progressRef }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { viewport } = useThree();

  const images = useTexture([
    SECTIONS[0].src,
    SECTIONS[1].src,
    SECTIONS[2].src,
    SECTIONS[4].src,
  ]);

  const videoTexture = useVideoTexture(SECTIONS[3].src, {
    muted: true,
    loop: true,
    playsInline: true,
    start: false,
  });

  const textures = useMemo(
    () => [images[0], images[1], images[2], videoTexture, images[3]],
    [images, videoTexture],
  );

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: textures[0],
      },
      uNextTexture: {
        value: textures[1],
      },
      uMorph: {
        value: 0,
      },
      uTime: {
        value: 0,
      },
      uStrength: {
        value: MORPH_STRENGTH,
      },
    }),
    [textures],
  );

  const smoothProgress = useRef(0);
  const videoPlaying = useRef(false);

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    });

    return () => {
      const video = videoTexture.image as HTMLVideoElement;

      video?.pause();
    };
  }, [textures, videoTexture]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;

    if (!mesh) return;

    const dt = Math.min(delta, 0.05);

    const target = THREE.MathUtils.clamp(
      progressRef.current,
      0,
      textures.length - 1,
    );

    smoothProgress.current = THREE.MathUtils.damp(
      smoothProgress.current,
      target,
      MORPH_SMOOTHING,
      dt,
    );

    const progress = smoothProgress.current;

    const fromIndex = Math.min(Math.floor(progress), textures.length - 1);

    const toIndex = Math.min(fromIndex + 1, textures.length - 1);

    const morph = THREE.MathUtils.clamp(progress - fromIndex, 0, 1);

    const fromTexture = textures[fromIndex];
    const toTexture = textures[toIndex];

    uniforms.uTexture.value = fromTexture;
    uniforms.uNextTexture.value = toTexture;
    uniforms.uMorph.value = morph;
    uniforms.uTime.value += dt;

    const fromAspect = getAspect(fromTexture);
    const toAspect = getAspect(toTexture);

    const maxWidth = viewport.width * 0.98;
    const maxHeight = viewport.height * IMAGE_HEIGHT_FACTOR;

    function getSize(aspect: number) {
      const width = Math.min(maxWidth, maxHeight * aspect);

      return {
        width,
        height: width / aspect,
      };
    }

    const fromSize = getSize(fromAspect);
    const toSize = getSize(toAspect);

    const sizeProgress = THREE.MathUtils.smoothstep(morph, 0, 1);

    mesh.scale.set(
      THREE.MathUtils.lerp(fromSize.width, toSize.width, sizeProgress),
      THREE.MathUtils.lerp(fromSize.height, toSize.height, sizeProgress),
      1,
    );

    const shouldPlay = progress > 2.1 && progress < 3.95;

    if (shouldPlay !== videoPlaying.current) {
      videoPlaying.current = shouldPlay;

      const video = videoTexture.image as HTMLVideoElement;

      if (shouldPlay) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />

      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function ServicesMorphImage({ progressRef }: Props) {
  return (
    <div
      className="
        relative
        h-[36svh]
        w-full
        md:h-[76svh]
      "
      style={{
        maxWidth: IMAGE_WIDTH,
      }}
    >
      <Canvas
        flat
        orthographic
        camera={{
          position: [0, 0, 5],
          zoom: 100,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{
          display: "block",
          pointerEvents: "none",
        }}
      >
        <Suspense fallback={null}>
          <MorphPlane progressRef={progressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
