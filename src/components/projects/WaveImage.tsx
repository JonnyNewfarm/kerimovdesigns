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
  debugDelay?: number;
}

const textureCache = new Map<string, THREE.Texture>();
const loadingCache = new Map<string, Promise<THREE.Texture>>();

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  startX: number,
  y: number,
  letterSpacing: number,
) {
  let currentX = startX;

  for (const char of text) {
    ctx.fillText(char, currentX, y);
    currentX += ctx.measureText(char).width + letterSpacing;
  }
}

function createLoadingTexture() {
  const width = 1600;
  const height = 1000;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, width, height);

    const text = "LOADING IMAGE";

    // Litt innenfor kanten så den ikke blir croppet av cover-scaling
    const x = 110;
    const y = height - 150;

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "900 40px Montserrat, Arial, Helvetica, sans-serif";
    ctx.textBaseline = "bottom";

    drawSpacedText(ctx, text, x, y, 8);

    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 1;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
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
  texture: THREE.Texture;
  amplitude?: number;
  waveLength?: number;
  speed?: number;
  segments?: number;
}) {
  const image =
    useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);

  const { viewport } = useThree();

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
      value: texture,
    },
    vUvScale: {
      value: new THREE.Vector2(1, 1),
    },
  });

  useEffect(() => {
    if (!image.current) return;

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
  debugDelay = 0,
}: WaveImageProps) {
  const loadingTexture = useMemo(() => createLoadingTexture(), []);

  const [currentTexture, setCurrentTexture] = useState<THREE.Texture>(() => {
    return textureCache.get(src) || loadingTexture;
  });

  useEffect(() => {
    let isMounted = true;

    const cachedTexture = textureCache.get(src);

    if (cachedTexture && debugDelay === 0) {
      setCurrentTexture(cachedTexture);

      return () => {
        isMounted = false;
      };
    }

    setCurrentTexture(loadingTexture);

    Promise.all([loadTexture(src), wait(debugDelay)])
      .then(([texture]) => {
        if (!isMounted) return;

        setCurrentTexture(texture);
      })
      .catch(() => {
        if (!isMounted) return;

        setCurrentTexture(loadingTexture);
      });

    return () => {
      isMounted = false;
    };
  }, [src, loadingTexture, debugDelay]);

  useEffect(() => {
    const preloadSources = allSrcs.filter((imageSrc) => imageSrc !== src);

    preloadSources.forEach((imageSrc) => {
      loadTexture(imageSrc).catch(() => {
        // Ignore preload errors.
      });
    });
  }, [allSrcs, src]);

  return (
    <div className="absolute inset-0 z-10 h-full w-full bg-dark">
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
    </div>
  );
}
