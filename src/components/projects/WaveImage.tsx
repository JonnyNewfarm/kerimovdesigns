"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { fragment, vertex } from "@/components/projects/WaveShader";

interface WaveImageProps {
  src: string;
  allSrcs?: string[];
  amplitude?: number;
  waveLength?: number;
  speed?: number;
  segments?: number;
}

const textureCache = new Map<string, THREE.Texture>();
const loadingCache = new Map<string, Promise<THREE.Texture>>();

function createFallbackTexture() {
  const data = new Uint8Array([12, 12, 12, 255]);
  const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function prepareTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 1;
  texture.needsUpdate = true;

  return texture;
}

function loadTexture(src: string) {
  const cachedTexture = textureCache.get(src);

  if (cachedTexture) {
    return Promise.resolve(cachedTexture);
  }

  const existingLoad = loadingCache.get(src);

  if (existingLoad) {
    return existingLoad;
  }

  const loader = new THREE.TextureLoader();

  const promise = new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      src,
      (texture) => {
        const preparedTexture = prepareTexture(texture);

        textureCache.set(src, preparedTexture);
        loadingCache.delete(src);

        resolve(preparedTexture);
      },
      undefined,
      (error) => {
        loadingCache.delete(src);
        reject(error);
      },
    );
  });

  loadingCache.set(src, promise);

  return promise;
}

function WaveModel({
  texture,
  amplitude = 0.05,
  waveLength = 5,
  speed = 0.032,
  segments = 16,
}: {
  texture: THREE.Texture | null;
  amplitude?: number;
  waveLength?: number;
  speed?: number;
  segments?: number;
}) {
  const image =
    useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);

  const { viewport } = useThree();

  const fallbackTexture = useMemo(() => createFallbackTexture(), []);

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
      value: texture || fallbackTexture,
    },
    vUvScale: {
      value: new THREE.Vector2(1, 1),
    },
  });

  useEffect(() => {
    if (!texture || !image.current) return;

    image.current.material.uniforms.uTexture.value = texture;
    image.current.material.needsUpdate = true;
  }, [texture]);

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

    const imageWidth = currentTexture.image.width || 1;
    const imageHeight = currentTexture.image.height || 1;

    const imageAspect = imageWidth / imageHeight;

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
      <planeGeometry args={[0.99, 1, segments, segments]} />

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
  allSrcs = [],
  amplitude = 0.05,
  waveLength = 5,
  speed = 0.032,
  segments = 16,
}: WaveImageProps) {
  const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(
    () => textureCache.get(src) || null,
  );

  const [isLoading, setIsLoading] = useState(!textureCache.has(src));
  const [hasLoadedOnce, setHasLoadedOnce] = useState(textureCache.has(src));

  useEffect(() => {
    let isMounted = true;

    setIsLoading(!textureCache.has(src));

    loadTexture(src)
      .then((texture) => {
        if (!isMounted) return;

        setCurrentTexture(texture);
        setHasLoadedOnce(true);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;

        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  useEffect(() => {
    const preloadSources = allSrcs.filter((imageSrc) => imageSrc !== src);

    preloadSources.forEach((imageSrc) => {
      loadTexture(imageSrc).catch(() => {
        // Ignore preload errors.
      });
    });
  }, [allSrcs, src]);

  return (
    <div className="absolute inset-0 z-10 h-full w-full  bg-dark ">
      <Canvas
        className="absolute inset-0 z-50 h-full w-full"
        camera={{
          position: [0, 0, 2],
          fov: 70,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.NoToneMapping,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <WaveModel
          texture={currentTexture}
          amplitude={amplitude}
          waveLength={waveLength}
          speed={speed}
          segments={segments}
        />
      </Canvas>

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-dark/40">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/60 sm:text-xs">
            <span className="h-2 w-2 animate-pulse bg-white/70" />
            {hasLoadedOnce ? "Loading image" : "Preparing image"}
          </div>
        </div>
      )}
    </div>
  );
}
