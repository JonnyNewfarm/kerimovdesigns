"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import {
  CanvasTexture,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  VideoTexture,
} from "three";
import type { MotionValue } from "framer-motion";

import {
  ABOUT_LINK_CENTER_X,
  ABOUT_LINK_CENTER_Y,
  ABOUT_LINK_PLANE_HEIGHT,
  ABOUT_LINK_PLANE_WIDTH,
  ANIMATION_LINK_CENTER_X,
  ANIMATION_LINK_CENTER_Y,
  ANIMATION_LINK_PLANE_HEIGHT,
  ANIMATION_LINK_PLANE_WIDTH,
  BOX_FACE_PROJECT_INDEXES,
  CLIENT_WORK_LINK_CENTER_X,
  CLIENT_WORK_LINK_CENTER_Y,
  CLIENT_WORK_LINK_PLANE_HEIGHT,
  CLIENT_WORK_LINK_PLANE_WIDTH,
  CUBE_SIZE,
  FACE_OVERLAY_POSITION,
  FACE_OVERLAY_SIZE,
  LOGO_LINK_CENTER_X,
  LOGO_LINK_CENTER_Y,
  LOGO_LINK_PLANE_HEIGHT,
  LOGO_LINK_PLANE_WIDTH,
  SHADER_DISPLACEMENT,
  SHADER_MOVEMENT,
  SHADER_SPEED,
  SHADER_WARP,
  VIDEO_OVERLAY_POSITION,
  VISUAL_LINK_CENTER_X,
  VISUAL_LINK_CENTER_Y,
  VISUAL_LINK_PLANE_HEIGHT,
  VISUAL_LINK_PLANE_WIDTH,
  clientWorkImagePaths,
  cubeProjects,
  faceCollageLayout,
  logoImagePaths,
  visualImagePaths,
} from "./cubeConstants";
import {
  gradientFragmentShader,
  gradientPalettes,
  gradientVertexShader,
} from "./cubeShaders";
import {
  createClientWorkTexture,
  createCollageTexture,
  createLogoInspirationTexture,
  createMovingGraphicsTextTexture,
  createTopTextTexture,
  createVisualIdentityTexture,
  loadSatoshiFont,
  waitForTextureImage,
} from "./cubeTextures";

export type CubeProps = {
  scrollProgress: MotionValue<number>;
  introDone: boolean;
  isDraggingCubeRef: React.MutableRefObject<boolean>;
  contactTransitionRef: React.MutableRefObject<HTMLAnchorElement | null>;
  clientWorkTransitionRef: React.MutableRefObject<HTMLAnchorElement | null>;
  visualIdentityTransitionRef: React.MutableRefObject<HTMLAnchorElement | null>;
  animationTransitionRef: React.MutableRefObject<HTMLAnchorElement | null>;
  logoTransitionRef: React.MutableRefObject<HTMLAnchorElement | null>;
  onReady: () => void;
};

export default function Cube({
  scrollProgress,
  introDone,
  isDraggingCubeRef,
  contactTransitionRef,
  clientWorkTransitionRef,
  visualIdentityTransitionRef,
  animationTransitionRef,
  logoTransitionRef,
  onReady,
}: CubeProps) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);

  const shaderMaterials = useRef<(ShaderMaterial | null)[]>([]);
  const rustamMaterialRef = useRef<MeshBasicMaterial | null>(null);

  const hoveredRef = useRef(false);
  const activeMaterialIndexRef = useRef<number | null>(null);

  const targetMouseUvRef = useRef(new Vector2(0.5, 0.5));
  const targetScaleRef = useRef(1);

  const introDoneRef = useRef(introDone);

  const movingVideoTextureRef = useRef<VideoTexture | null>(null);
  const movingVideoElementRef = useRef<HTMLVideoElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  const [rustamTexture, setRustamTexture] = useState<CanvasTexture | null>(
    null,
  );

  const [topTextTexture, setTopTextTexture] = useState<CanvasTexture | null>(
    null,
  );

  const [visualIdentityTexture, setVisualIdentityTexture] =
    useState<CanvasTexture | null>(null);

  const [movingGraphicsTextTexture, setMovingGraphicsTextTexture] =
    useState<CanvasTexture | null>(null);

  const [movingGraphicsVideoTexture, setMovingGraphicsVideoTexture] =
    useState<VideoTexture | null>(null);

  const [clientWorkTexture, setClientWorkTexture] =
    useState<CanvasTexture | null>(null);

  const [logoInspirationTexture, setLogoInspirationTexture] =
    useState<CanvasTexture | null>(null);

  const rustamImagePaths = useMemo(() => cubeProjects[0].images, []);

  const rustamTextures = useLoader(
    TextureLoader,
    rustamImagePaths,
  ) as Texture[];

  const visualTextures = useLoader(
    TextureLoader,
    visualImagePaths,
  ) as Texture[];

  const logoTextures = useLoader(TextureLoader, logoImagePaths) as Texture[];

  const clientWorkTextures = useLoader(
    TextureLoader,
    clientWorkImagePaths,
  ) as Texture[];

  useEffect(() => {
    introDoneRef.current = introDone;
  }, [introDone]);

  useEffect(() => {
    let cancelled = false;

    let generatedRustamTexture: CanvasTexture | null = null;

    async function buildRustamTexture() {
      rustamTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      await Promise.all(
        rustamTextures.map((texture) => waitForTextureImage(texture)),
      );

      if (cancelled) {
        return;
      }

      generatedRustamTexture = createCollageTexture(
        rustamTextures,
        faceCollageLayout,
        false,
      );

      if (cancelled) {
        generatedRustamTexture?.dispose();
        return;
      }

      setRustamTexture(generatedRustamTexture);
    }

    buildRustamTexture();

    return () => {
      cancelled = true;
      generatedRustamTexture?.dispose();
    };
  }, [rustamTextures]);

  useEffect(() => {
    let cancelled = false;

    let texture: CanvasTexture | null = null;

    async function buildTopTextTexture() {
      await loadSatoshiFont();

      if (cancelled) {
        return;
      }

      texture = createTopTextTexture();

      if (cancelled) {
        texture?.dispose();
        return;
      }

      setTopTextTexture(texture);
    }

    buildTopTextTexture();

    return () => {
      cancelled = true;
      texture?.dispose();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    let generatedVisualIdentityTexture: CanvasTexture | null = null;

    async function buildVisualIdentityTexture() {
      visualTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      logoTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      await loadSatoshiFont();

      await Promise.all([
        ...visualTextures.map((texture) => waitForTextureImage(texture)),
        ...logoTextures.map((texture) => waitForTextureImage(texture)),
      ]);

      if (cancelled) {
        return;
      }

      generatedVisualIdentityTexture = createVisualIdentityTexture(
        visualTextures,
        logoTextures[3],
      );

      if (cancelled) {
        generatedVisualIdentityTexture?.dispose();
        return;
      }

      setVisualIdentityTexture(generatedVisualIdentityTexture);
    }

    buildVisualIdentityTexture();

    return () => {
      cancelled = true;
      generatedVisualIdentityTexture?.dispose();
    };
  }, [visualTextures, logoTextures]);

  useEffect(() => {
    let cancelled = false;

    let generatedMovingTexture: CanvasTexture | null = null;
    let generatedClientWorkTexture: CanvasTexture | null = null;

    async function buildCanvasTextures() {
      clientWorkTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      await loadSatoshiFont();

      await Promise.all(
        clientWorkTextures.map((texture) => waitForTextureImage(texture)),
      );

      if (cancelled) {
        return;
      }

      generatedMovingTexture = createMovingGraphicsTextTexture();

      generatedClientWorkTexture = createClientWorkTexture(clientWorkTextures);

      if (cancelled) {
        generatedMovingTexture?.dispose();
        generatedClientWorkTexture?.dispose();
        return;
      }

      setMovingGraphicsTextTexture(generatedMovingTexture);

      setClientWorkTexture(generatedClientWorkTexture);
    }

    buildCanvasTextures();

    return () => {
      cancelled = true;

      generatedMovingTexture?.dispose();
      generatedClientWorkTexture?.dispose();
    };
  }, [clientWorkTextures]);

  useEffect(() => {
    let cancelled = false;

    let generatedLogoTexture: CanvasTexture | null = null;

    async function buildLogoInspirationTexture() {
      logoTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      await loadSatoshiFont();

      await Promise.all(
        logoTextures.map((texture) => waitForTextureImage(texture)),
      );

      if (cancelled) {
        return;
      }

      generatedLogoTexture = createLogoInspirationTexture(logoTextures);

      if (cancelled) {
        generatedLogoTexture?.dispose();
        return;
      }

      setLogoInspirationTexture(generatedLogoTexture);
    }

    buildLogoInspirationTexture();

    return () => {
      cancelled = true;
      generatedLogoTexture?.dispose();
    };
  }, [logoTextures]);

  useEffect(() => {
    const video = document.createElement("video");

    video.src = "/bylarm-new.mp4";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "metadata";
    video.crossOrigin = "anonymous";

    movingVideoElementRef.current = video;

    const texture = new VideoTexture(video);

    texture.colorSpace = SRGBColorSpace;

    movingVideoTextureRef.current = texture;

    setMovingGraphicsVideoTexture(texture);

    async function playVideo() {
      try {
        await video.play();
      } catch {
        // Browser may delay autoplay.
      }
    }

    playVideo();

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();

      texture.dispose();

      movingVideoElementRef.current = null;
      movingVideoTextureRef.current = null;
    };
  }, []);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useLayoutEffect(() => {
    if (!group.current || !mesh.current) {
      return;
    }

    group.current.position.set(0, 0, 0);
    group.current.rotation.set(0, 0, 0);
    group.current.scale.set(1, 1, 1);

    mesh.current.position.set(0, 0, 0);
    mesh.current.rotation.set(0, 0, 0);
    mesh.current.scale.set(1, 1, 1);

    targetScaleRef.current = 1;
  }, []);

  function triggerContactTransition() {
    contactTransitionRef.current?.click();
  }

  function triggerClientWorkTransition() {
    clientWorkTransitionRef.current?.click();
  }

  function triggerVisualIdentityTransition() {
    visualIdentityTransitionRef.current?.click();
  }

  function triggerAnimationTransition() {
    animationTransitionRef.current?.click();
  }

  function triggerLogoTransition() {
    logoTransitionRef.current?.click();
  }

  function updateRustamMaterial() {
    if (!rustamMaterialRef.current || !rustamTexture) {
      return;
    }

    if (rustamMaterialRef.current.map === rustamTexture) {
      return;
    }

    rustamMaterialRef.current.map = rustamTexture;

    rustamMaterialRef.current.needsUpdate = true;
  }

  function clearCubeHover() {
    hoveredRef.current = false;

    activeMaterialIndexRef.current = null;

    document.body.style.cursor = "";

    updateRustamMaterial();
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    if (!introDoneRef.current) {
      return;
    }

    event.stopPropagation();

    const materialIndex = event.face?.materialIndex ?? null;

    hoveredRef.current = materialIndex !== null;

    activeMaterialIndexRef.current = materialIndex;

    if (!isMobile && event.uv) {
      targetMouseUvRef.current.set(event.uv.x, event.uv.y);
    }

    updateRustamMaterial();
  }

  function handlePointerLeave() {
    clearCubeHover();
  }

  function handleContactClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    document.body.style.cursor = "";

    triggerContactTransition();
  }

  function handleClientWorkClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    document.body.style.cursor = "";

    triggerClientWorkTransition();
  }

  function handleVisualIdentityClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    document.body.style.cursor = "";

    triggerVisualIdentityTransition();
  }

  function handleAnimationClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    document.body.style.cursor = "";

    triggerAnimationTransition();
  }

  function handleLogoClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    document.body.style.cursor = "";

    triggerLogoTransition();
  }

  function handleContactPointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    hoveredRef.current = true;

    document.body.style.cursor = "pointer";
  }

  function handleContactPointerOut(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    hoveredRef.current = false;

    activeMaterialIndexRef.current = null;

    document.body.style.cursor = "";
  }

  function handleContactPointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    hoveredRef.current = true;

    document.body.style.cursor = "pointer";
  }

  function handleContactPointerUp(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    hoveredRef.current = true;

    document.body.style.cursor = "pointer";
  }

  useFrame(({ clock }) => {
    if (!group.current) {
      return;
    }

    const time = clock.getElapsedTime();
    const value = scrollProgress.get();

    shaderMaterials.current.forEach((material, materialIndex) => {
      if (!material) {
        return;
      }

      const isActiveFace =
        !isMobile &&
        hoveredRef.current &&
        introDoneRef.current &&
        activeMaterialIndexRef.current === materialIndex;

      material.uniforms.uTime.value = time;

      material.uniforms.uHover.value = MathUtils.lerp(
        material.uniforms.uHover.value,
        isActiveFace ? 1 : 0,
        0.08,
      );

      if (!isMobile) {
        material.uniforms.uMouse.value.lerp(targetMouseUvRef.current, 0.12);
      } else {
        material.uniforms.uMouse.value.set(0.5, 0.5);
      }
    });

    if (!isDraggingCubeRef.current) {
      group.current.rotation.x = value;
      group.current.rotation.y = value * 1.4;
    }

    if (isMobile) {
      group.current.scale.set(1.05, 1.05, 1.05);

      return;
    }

    const targetScale = hoveredRef.current && introDoneRef.current ? 1.1 : 1;

    targetScaleRef.current += (targetScale - targetScaleRef.current) * 0.1;

    group.current.scale.set(
      targetScaleRef.current,
      targetScaleRef.current,
      targetScaleRef.current,
    );
  });
  const isCubeReady = Boolean(
    rustamTexture &&
      topTextTexture &&
      visualIdentityTexture &&
      movingGraphicsTextTexture &&
      movingGraphicsVideoTexture &&
      clientWorkTexture &&
      logoInspirationTexture,
  );

  useEffect(() => {
    if (!isCubeReady) {
      return;
    }

    onReady();
  }, [isCubeReady, onReady]);

  if (!isCubeReady) {
    return null;
  }

  return (
    <group ref={group}>
      {/* TOP FACE: RUSTAM / ABOUT */}
      <group
        position={[0, FACE_OVERLAY_POSITION, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <mesh renderOrder={30} raycast={() => null}>
          <planeGeometry args={[FACE_OVERLAY_SIZE, FACE_OVERLAY_SIZE]} />

          <meshBasicMaterial
            map={topTextTexture}
            transparent
            depthWrite={false}
            depthTest
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>

        <mesh
          position={[ABOUT_LINK_CENTER_X, ABOUT_LINK_CENTER_Y, 0.012]}
          renderOrder={40}
          onClick={handleContactClick}
          onPointerOver={handleContactPointerOver}
          onPointerOut={handleContactPointerOut}
          onPointerDown={handleContactPointerDown}
          onPointerUp={handleContactPointerUp}
        >
          <planeGeometry
            args={[ABOUT_LINK_PLANE_WIDTH, ABOUT_LINK_PLANE_HEIGHT]}
          />

          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* BOTTOM FACE: ANIMATIONS */}
      <group
        position={[0, -FACE_OVERLAY_POSITION, 0]}
        rotation={[Math.PI / 2, 0, Math.PI * 2]}
      >
        {/* Tekstlaget */}
        <mesh renderOrder={30} raycast={() => null}>
          <planeGeometry args={[FACE_OVERLAY_SIZE, FACE_OVERLAY_SIZE]} />

          <meshBasicMaterial
            map={movingGraphicsTextTexture}
            transparent
            depthWrite={false}
            depthTest
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>

        <mesh
          position={[ANIMATION_LINK_CENTER_X, ANIMATION_LINK_CENTER_Y, 0.012]}
          renderOrder={40}
          onClick={handleAnimationClick}
          onPointerOver={handleContactPointerOver}
          onPointerOut={handleContactPointerOut}
          onPointerDown={handleContactPointerDown}
          onPointerUp={handleContactPointerUp}
        >
          <planeGeometry
            args={[ANIMATION_LINK_PLANE_WIDTH, ANIMATION_LINK_PLANE_HEIGHT]}
          />

          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Videoen på animasjonssiden */}
      <mesh
        position={[0.19, -VIDEO_OVERLAY_POSITION, -0.66]}
        rotation={[Math.PI / 2, 0, Math.PI * 2]}
        renderOrder={28}
        raycast={() => null}
      >
        <planeGeometry args={[1.72, 0.77]} />

        <meshBasicMaterial
          map={movingGraphicsVideoTexture}
          depthWrite={false}
          depthTest
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* LEFT FACE: VISUAL IDENTITIES */}
      <group
        position={[-FACE_OVERLAY_POSITION, 0, 0]}
        rotation={[0, -Math.PI / 2, -Math.PI]}
      >
        <mesh renderOrder={30} raycast={() => null}>
          <planeGeometry args={[FACE_OVERLAY_SIZE, FACE_OVERLAY_SIZE]} />

          <meshBasicMaterial
            map={visualIdentityTexture}
            transparent
            depthWrite={false}
            depthTest
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>

        <mesh
          position={[VISUAL_LINK_CENTER_X, VISUAL_LINK_CENTER_Y, 0.012]}
          renderOrder={40}
          onClick={handleVisualIdentityClick}
          onPointerOver={handleContactPointerOver}
          onPointerOut={handleContactPointerOut}
          onPointerDown={handleContactPointerDown}
          onPointerUp={handleContactPointerUp}
        >
          <planeGeometry
            args={[VISUAL_LINK_PLANE_WIDTH, VISUAL_LINK_PLANE_HEIGHT]}
          />

          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* RIGHT FACE: CLIENT WORK */}
      <group
        position={[FACE_OVERLAY_POSITION, 0, 0]}
        rotation={[0, Math.PI / 2, Math.PI / 2]}
      >
        <mesh renderOrder={30} raycast={() => null}>
          <planeGeometry args={[FACE_OVERLAY_SIZE, FACE_OVERLAY_SIZE]} />

          <meshBasicMaterial
            map={clientWorkTexture}
            transparent
            depthWrite={false}
            depthTest
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>

        <mesh
          position={[
            CLIENT_WORK_LINK_CENTER_X,
            CLIENT_WORK_LINK_CENTER_Y,
            0.012,
          ]}
          renderOrder={40}
          onClick={handleClientWorkClick}
          onPointerOver={handleContactPointerOver}
          onPointerOut={handleContactPointerOut}
          onPointerDown={handleContactPointerDown}
          onPointerUp={handleContactPointerUp}
        >
          <planeGeometry
            args={[CLIENT_WORK_LINK_PLANE_WIDTH, CLIENT_WORK_LINK_PLANE_HEIGHT]}
          />

          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* BACK FACE: VISUAL MARKS / LOGO DESIGN */}
      <group
        position={[0, 0, -FACE_OVERLAY_POSITION]}
        rotation={[0, Math.PI, 0]}
      >
        <mesh renderOrder={30} raycast={() => null}>
          <planeGeometry args={[FACE_OVERLAY_SIZE, FACE_OVERLAY_SIZE]} />

          <meshBasicMaterial
            map={logoInspirationTexture}
            transparent
            depthWrite={false}
            depthTest
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>

        <mesh
          position={[LOGO_LINK_CENTER_X, LOGO_LINK_CENTER_Y, 0.012]}
          renderOrder={40}
          onClick={handleLogoClick}
          onPointerOver={handleContactPointerOver}
          onPointerOut={handleContactPointerOut}
          onPointerDown={handleContactPointerDown}
          onPointerUp={handleContactPointerUp}
        >
          <planeGeometry
            args={[LOGO_LINK_PLANE_WIDTH, LOGO_LINK_PLANE_HEIGHT]}
          />

          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      <mesh
        ref={mesh}
        position={[0, 0, 0]}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />

        {BOX_FACE_PROJECT_INDEXES.map((projectIndex, materialIndex) => {
          const isRustam = projectIndex === 0;

          if (isRustam) {
            return (
              <meshBasicMaterial
                key={materialIndex}
                ref={rustamMaterialRef}
                attach={`material-${materialIndex}`}
                map={rustamTexture}
                toneMapped={false}
              />
            );
          }

          const palette = gradientPalettes[projectIndex];

          return (
            <shaderMaterial
              key={materialIndex}
              ref={(material) => {
                shaderMaterials.current[materialIndex] = material;
              }}
              attach={`material-${materialIndex}`}
              vertexShader={gradientVertexShader}
              fragmentShader={gradientFragmentShader}
              uniforms={{
                uTime: {
                  value: 0,
                },
                uHover: {
                  value: 0,
                },
                uMouse: {
                  value: new Vector2(0.5, 0.5),
                },
                uSpeed: {
                  value: SHADER_SPEED,
                },
                uMovement: {
                  value: SHADER_MOVEMENT,
                },
                uWarp: {
                  value: SHADER_WARP,
                },
                uDisplacement: {
                  value: SHADER_DISPLACEMENT,
                },
                uColorA: {
                  value: new Color(palette.colorA),
                },
                uColorB: {
                  value: new Color(palette.colorB),
                },
                uColorC: {
                  value: new Color(palette.colorC),
                },
                uColorD: {
                  value: new Color(palette.colorD),
                },
              }}
              toneMapped={false}
              onBeforeRender={() => {
                const material = shaderMaterials.current[materialIndex];

                if (!material) {
                  return;
                }

                const time = performance.now() * 0.001;

                const isActiveFace =
                  !isMobile &&
                  hoveredRef.current &&
                  introDoneRef.current &&
                  activeMaterialIndexRef.current === materialIndex;

                material.uniforms.uTime.value = time;

                material.uniforms.uHover.value = MathUtils.lerp(
                  material.uniforms.uHover.value,
                  isActiveFace ? 1 : 0,
                  0.08,
                );

                if (!isMobile) {
                  material.uniforms.uMouse.value.lerp(
                    targetMouseUvRef.current,
                    0.12,
                  );
                } else {
                  material.uniforms.uMouse.value.set(0.5, 0.5);
                }
              }}
            />
          );
        })}
      </mesh>
    </group>
  );
}
