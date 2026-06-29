"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef } from "react";

type WaveImageProps = {
  src: string;
  alt?: string;
  className?: string;
};

const vertexShader = `
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform float uStrength;

  varying vec2 vUv;
  varying float vDepth;
  varying float vHover;

  void main() {
    vUv = uv;

    vec3 pos = position;

    vec2 centered = uv - 0.5;

    float dist = distance(uv, uMouse);

    // Stor, myk hover-zone.
    float hoverInfluence = exp(-dist * dist * 9.0) * uHover;

    // Grid/paper displacement over hele planet.
    // Dette er "rutene på et plane" som bøyer seg litt frem/bak.
    float waveA = sin((uv.x * 8.0) + (uTime * 0.9));
    float waveB = cos((uv.y * 7.0) - (uTime * 0.75));
    float waveC = sin(((uv.x + uv.y) * 7.5) + (uTime * 0.55));
    float waveD = cos(((uv.x - uv.y) * 6.0) - (uTime * 0.65));

    float globalDepth = (
      waveA * 0.035 +
      waveB * 0.032 +
      waveC * 0.024 +
      waveD * 0.018
    );

    // Noen punkter går frem, noen går bak.
    pos.z += globalDepth * uStrength;

    // Hover lager ekstra fold rundt cursor.
    float hoverWave = sin((dist * 22.0) - (uTime * 4.5)) * hoverInfluence;
    pos.z += hoverInfluence * 0.22;
    pos.z += hoverWave * 0.055;

    // Subtil drag ut fra cursor, så det føles som image-mesh.
    vec2 dir = normalize(uv - uMouse + 0.0001);
    pos.x += dir.x * hoverInfluence * 0.035;
    pos.y += dir.y * hoverInfluence * 0.025;

    // Litt større dybde mot midten, men IKKE deformerte kanter.
    float centerFalloff = 1.0 - smoothstep(0.0, 0.72, length(centered));
    pos.z += centerFalloff * sin(uTime * 0.7 + uv.x * 4.0) * 0.018;

    vDepth = globalDepth + hoverInfluence;
    vHover = hoverInfluence;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;

  varying vec2 vUv;
  varying float vDepth;
  varying float vHover;

  vec2 coverUv(vec2 uv, vec2 containerSize, vec2 imageSize) {
    float containerRatio = containerSize.x / containerSize.y;
    float imageRatio = imageSize.x / imageSize.y;

    vec2 scale = vec2(1.0);
    vec2 offset = vec2(0.0);

    if (containerRatio > imageRatio) {
      scale.y = imageRatio / containerRatio;
      offset.y = (1.0 - scale.y) * 0.5;
    } else {
      scale.x = containerRatio / imageRatio;
      offset.x = (1.0 - scale.x) * 0.5;
    }

    return uv * scale + offset;
  }

  void main() {
    vec2 uv = vUv;

    float dist = distance(uv, uMouse);
    float hoverInfluence = exp(-dist * dist * 9.0) * uHover;

    vec2 dir = normalize(uv - uMouse + 0.0001);

    // UV distortion som følger mesh-bøyingen.
    vec2 meshFlow = vec2(
      sin((uv.y * 7.0) + (uTime * 0.7)),
      cos((uv.x * 7.0) - (uTime * 0.6))
    ) * 0.006;

    vec2 hoverDistort = dir * hoverInfluence * 0.025;

    vec2 distortedUv = uv + meshFlow + hoverDistort;

    vec2 textureUv = coverUv(distortedUv, uResolution, uImageResolution);

    vec4 color = texture2D(uTexture, textureUv);

    // Lys/skygge fra Z-depth, så rutene føles som de går frem/bak.
    color.rgb += vDepth * 0.18;
    color.rgb += vHover * 0.10;

    // Litt mørkere rundt selve trykket.
    color.rgb -= smoothstep(0.22, 0.0, dist) * uHover * 0.055;

    gl_FragColor = color;
  }
`;

function WaveMesh({ src }: { src: string }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const texture = useLoader(THREE.TextureLoader, src);
  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);

  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));

  const hover = useRef(0);
  const targetHover = useRef(0);

  const strength = useRef(1);

  const imageResolution = useMemo(() => {
    const image = texture.image as HTMLImageElement | undefined;

    return new THREE.Vector2(
      image?.naturalWidth || image?.width || 1,
      image?.naturalHeight || image?.height || 1,
    );
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: texture,
      },
      uMouse: {
        value: new THREE.Vector2(0.5, 0.5),
      },
      uHover: {
        value: 0,
      },
      uTime: {
        value: 0,
      },
      uStrength: {
        value: 1,
      },
      uResolution: {
        value: new THREE.Vector2(size.width, size.height),
      },
      uImageResolution: {
        value: imageResolution,
      },
    }),
    [texture, size.width, size.height, imageResolution],
  );

  useEffect(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
  }, [texture]);

  useEffect(() => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    materialRef.current.uniforms.uImageResolution.value.copy(imageResolution);
  }, [size.width, size.height, imageResolution]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    hover.current = THREE.MathUtils.lerp(
      hover.current,
      targetHover.current,
      1 - Math.pow(0.001, delta),
    );

    mouse.current.lerp(targetMouse.current, 1 - Math.pow(0.001, delta));

    // Litt roligere når man ikke hover, sterkere på hover.
    const targetStrength = targetHover.current ? 1.25 : 0.7;

    strength.current = THREE.MathUtils.lerp(
      strength.current,
      targetStrength,
      1 - Math.pow(0.001, delta),
    );

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uHover.value = hover.current;
    materialRef.current.uniforms.uMouse.value.copy(mouse.current);
    materialRef.current.uniforms.uStrength.value = strength.current;
  });

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      onPointerMove={(event) => {
        if (!event.uv) return;
        targetMouse.current.set(event.uv.x, event.uv.y);
      }}
      onPointerEnter={(event) => {
        targetHover.current = 1;

        if (event.uv) {
          targetMouse.current.set(event.uv.x, event.uv.y);
        }
      }}
      onPointerLeave={() => {
        targetHover.current = 0;
      }}
    >
      {/* Dette er rutene. Flere segments = mykere bøying. */}
      <planeGeometry args={[1, 1, 160, 160]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

export default function WaveImage({
  src,
  alt = "",
  className = "",
}: WaveImageProps) {
  return (
    <div
      aria-label={alt}
      role={alt ? "img" : undefined}
      className={`relative h-full w-full overflow-hidden ${className}`}
    >
      <Canvas
        orthographic
        camera={{
          position: [0, 0, 2],
          zoom: 100,
          near: 0.01,
          far: 100,
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="absolute inset-0 h-full w-full"
      >
        <Suspense fallback={null}>
          <WaveMesh src={src} />
        </Suspense>
      </Canvas>
    </div>
  );
}
