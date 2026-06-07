"use client";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { fragment, vertex } from "@/components/projects/WaveShader";

interface WaveImageProps {
  src: string;
  allSrcs: string[];
  amplitude?: number;
  waveLength?: number;
  speed?: number;
  segments?: number;
}

function WaveModel({
  src,
  allSrcs,
  amplitude = 0.05,
  waveLength = 5,
  speed = 0.032,
  segments = 32,
}: WaveImageProps) {
  const image =
    useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);

  const textures = useTexture(allSrcs);
  const { viewport } = useThree();

  const textureMap = useMemo(() => {
    const map = new Map<string, THREE.Texture>();

    allSrcs.forEach((imageSrc, index) => {
      const texture = textures[index];

      if (!texture) return;

      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;

      map.set(imageSrc, texture);
    });

    return map;
  }, [allSrcs, textures]);

  const uniforms = useRef({
    uTime: {
      value: 0,
    },
    uAmplitude: {
      value: amplitude,
    },
    uWaveLength: {
      value: waveLength,
    },
    uTexture: {
      value: textures[0],
    },
    vUvScale: {
      value: new THREE.Vector2(1, 1),
    },
  });

  useEffect(() => {
    const nextTexture = textureMap.get(src);

    if (!nextTexture || !image.current) return;

    image.current.material.uniforms.uTexture.value = nextTexture;
    image.current.material.needsUpdate = true;
  }, [src, textureMap]);

  useFrame(() => {
    if (!image.current) return;

    const material = image.current.material;
    const currentTexture = material.uniforms.uTexture.value as THREE.Texture;

    if (!currentTexture?.image) return;

    const planeWidth = viewport.width;
    const planeHeight = viewport.height;

    image.current.scale.x = planeWidth;
    image.current.scale.y = planeHeight;

    const planeAspect = planeWidth / planeHeight;
    const imageAspect =
      currentTexture.image.width / currentTexture.image.height;

    const uvScale = material.uniforms.vUvScale.value as THREE.Vector2;

    if (planeAspect > imageAspect) {
      uvScale.set(1, imageAspect / planeAspect);
    } else {
      uvScale.set(planeAspect / imageAspect, 1);
    }

    material.uniforms.uTime.value += speed;
    material.uniforms.uAmplitude.value = amplitude;
    material.uniforms.uWaveLength.value = waveLength;
  });

  return (
    <mesh ref={image}>
      <planeGeometry args={[1, 1, segments, segments]} />

      <shaderMaterial
        fragmentShader={fragment}
        vertexShader={vertex}
        uniforms={uniforms.current}
        side={THREE.DoubleSide}
        transparent={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function WaveImage({
  src,
  allSrcs,
  amplitude = 0.05,
  waveLength = 5,
  speed = 0.032,
  segments = 32,
}: WaveImageProps) {
  return (
    <Canvas
      className="absolute inset-0 h-full w-full"
      camera={{
        position: [0, 0, 2],
        fov: 70,
      }}
      gl={{
        antialias: true,
        alpha: true,
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.NoToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
      }}
    >
      <Suspense fallback={null}>
        <WaveModel
          src={src}
          allSrcs={allSrcs}
          amplitude={amplitude}
          waveLength={waveLength}
          speed={speed}
          segments={segments}
        />
      </Suspense>
    </Canvas>
  );
}
