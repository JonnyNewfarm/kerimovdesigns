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
  Euler,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
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
  POSTER_LINK_CENTER_X,
  POSTER_LINK_CENTER_Y,
  POSTER_LINK_PLANE_HEIGHT,
  POSTER_LINK_PLANE_WIDTH,
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
  posterImagePaths,
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
  createPosterTexture,
  createCollageTexture,
  createLogoInspirationTexture,
  createMovingGraphicsTextTexture,
  createTopTextTexture,
  createVisualIdentityTexture,
  loadSatoshiFont,
  waitForTextureImage,
} from "./cubeTextures";

type GradientPalette = {
  colorA: string;
  colorB: string;
  colorC: string;
  colorD: string;
};

type GradientFaceMaterialProps = {
  attach: string;
  materialIndex: number;
  palette: GradientPalette;
  isMobile: boolean;
  hoveredRef: React.MutableRefObject<boolean>;
  introDoneRef: React.MutableRefObject<boolean>;
  activeMaterialIndexRef: React.MutableRefObject<number | null>;
  targetMouseUvRef: React.MutableRefObject<Vector2>;
};

function GradientFaceMaterial({
  attach,
  materialIndex,
  palette,
  isMobile,
  hoveredRef,
  introDoneRef,
  activeMaterialIndexRef,
  targetMouseUvRef,
}: GradientFaceMaterialProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const elapsedRef = useRef(0);

  const uniforms = useMemo(
    () => ({
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
    }),
    [palette.colorA, palette.colorB, palette.colorC, palette.colorD],
  );
  useFrame((_, delta) => {
    elapsedRef.current += Math.min(delta, 0.1);
    uniforms.uTime.value = elapsedRef.current;
    //comment
    const isActiveFace =
      !isMobile &&
      hoveredRef.current &&
      introDoneRef.current &&
      activeMaterialIndexRef.current === materialIndex;

    uniforms.uHover.value = MathUtils.lerp(
      uniforms.uHover.value,
      isActiveFace ? 1 : 0,
      0.08,
    );

    if (isMobile) {
      uniforms.uMouse.value.set(0.5, 0.5);
    } else {
      uniforms.uMouse.value.lerp(targetMouseUvRef.current, 0.12);
    }

    if (materialRef.current) {
      materialRef.current.uniformsNeedUpdate = true;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      attach={attach}
      vertexShader={gradientVertexShader}
      fragmentShader={gradientFragmentShader}
      uniforms={uniforms}
      toneMapped={false}
    />
  );
}

export type CubeProps = {
  isActive: boolean;
  scrollProgress: MotionValue<number>;
  introDone: boolean;
  isDraggingCubeRef: React.MutableRefObject<boolean>;
  contactTransitionRef: React.MutableRefObject<HTMLAnchorElement | null>;
  clientWorkTransitionRef: React.MutableRefObject<HTMLAnchorElement | null>;
  visualIdentityTransitionRef: React.MutableRefObject<HTMLAnchorElement | null>;
  animationTransitionRef: React.MutableRefObject<HTMLAnchorElement | null>;
  logoTransitionRef: React.MutableRefObject<HTMLAnchorElement | null>;
  onReady: () => void;
  alignTrigger: number;
};
export default function Cube({
  isActive,
  scrollProgress,
  introDone,
  isDraggingCubeRef,
  contactTransitionRef,
  clientWorkTransitionRef,
  visualIdentityTransitionRef,
  animationTransitionRef,
  logoTransitionRef,
  onReady,
  alignTrigger,
}: CubeProps) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const rotationOffsetRef = useRef(new Quaternion());

  const alignFromRef = useRef(new Quaternion());
  const alignToRef = useRef(new Quaternion());

  const alignProgressRef = useRef(1);
  const isAligningRef = useRef(false);

  const previousAlignTriggerRef = useRef(alignTrigger);

  const rustamMaterialRef = useRef<MeshBasicMaterial | null>(null);

  const hoveredRef = useRef(false);
  const activeMaterialIndexRef = useRef<number | null>(null);

  const targetMouseUvRef = useRef(new Vector2(0.5, 0.5));
  const targetScaleRef = useRef(1);

  const introDoneRef = useRef(introDone);

  const movingVideoTextureRef = useRef<VideoTexture | null>(null);
  const movingVideoElementRef = useRef<HTMLVideoElement | null>(null);

  const FACE_NORMALS = [
    new Vector3(1, 0, 0), // right
    new Vector3(-1, 0, 0), // left
    new Vector3(0, 1, 0), // top
    new Vector3(0, -1, 0), // bottom
    new Vector3(0, 0, 1), // front / KERIMOV
    new Vector3(0, 0, -1), // back
  ];

  const faceOrientationQuaternions = useMemo(() => {
    const topBase = new Quaternion().setFromEuler(
      new Euler(-Math.PI / 2, 0, 0),
    );

    const topCorrection = new Quaternion().setFromAxisAngle(
      new Vector3(0, 0, 1),
      -Math.PI / 2,
    );

    return [
      // RIGHT
      new Quaternion().setFromEuler(new Euler(0, Math.PI / 2, Math.PI / 2)),

      // LEFT
      new Quaternion().setFromEuler(new Euler(0, -Math.PI / 2, -Math.PI)),

      // TOP / ABOUT
      topBase.multiply(topCorrection),

      // BOTTOM
      new Quaternion().setFromEuler(new Euler(Math.PI / 2, 0, 0)),

      // FRONT
      new Quaternion().setFromEuler(new Euler(0, 0, 0)),

      // BACK
      new Quaternion().setFromEuler(new Euler(0, Math.PI, 0)),
    ];
  }, []);

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

  const [posterTexture, setPosterTexture] = useState<CanvasTexture | null>(
    null,
  );

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

  const posterTextures = useLoader(
    TextureLoader,
    posterImagePaths,
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

      generatedVisualIdentityTexture =
        createVisualIdentityTexture(visualTextures);

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
    let generatedPosterTexture: CanvasTexture | null = null;

    async function buildCanvasTextures() {
      posterTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      await loadSatoshiFont();

      await Promise.all(
        posterTextures.map((texture) => waitForTextureImage(texture)),
      );

      if (cancelled) {
        return;
      }

      generatedMovingTexture = createMovingGraphicsTextTexture();

      generatedPosterTexture = createPosterTexture(posterTextures);

      if (cancelled) {
        generatedMovingTexture?.dispose();
        generatedPosterTexture?.dispose();

        return;
      }

      setMovingGraphicsTextTexture(generatedMovingTexture);

      setPosterTexture(generatedPosterTexture);
    }

    buildCanvasTextures();

    return () => {
      cancelled = true;

      generatedMovingTexture?.dispose();
      generatedPosterTexture?.dispose();
    };
  }, [posterTextures]);

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
    const video = movingVideoElementRef.current;

    if (!video) {
      return;
    }

    if (!isActive) {
      video.pause();
      hoveredRef.current = false;
      activeMaterialIndexRef.current = null;
      document.body.style.cursor = "";
      return;
    }

    void video.play().catch(() => {
      // Browser may delay playback until interaction.
    });
  }, [isActive]);

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

  useFrame((state, delta) => {
    if (!group.current) {
      return;
    }

    const value = scrollProgress.get();

    const scrollQuaternion = new Quaternion().setFromEuler(
      new Euler(value, value * 1.4, 0, "XYZ"),
    );

    /*
     * ALIGN BUTTON PRESSED
     */
    if (alignTrigger !== previousAlignTriggerRef.current) {
      previousAlignTriggerRef.current = alignTrigger;

      clearCubeHover();

      const currentQuaternion = group.current.quaternion.clone();

      const cameraDirection = new Vector3();
      state.camera.getWorldDirection(cameraDirection);

      const towardCamera = cameraDirection.negate();

      let closestFaceIndex = 0;
      let highestDot = -Infinity;

      FACE_NORMALS.forEach((normal, index) => {
        const worldNormal = normal
          .clone()
          .applyQuaternion(currentQuaternion)
          .normalize();

        const dot = worldNormal.dot(towardCamera);

        if (dot > highestDot) {
          highestDot = dot;
          closestFaceIndex = index;
        }
      });

      const faceQuaternion = faceOrientationQuaternions[closestFaceIndex];

      const targetQuaternion = state.camera.quaternion
        .clone()
        .multiply(faceQuaternion.clone().invert())
        .normalize();

      alignFromRef.current.copy(currentQuaternion);
      alignToRef.current.copy(targetQuaternion);

      alignProgressRef.current = 0;
      isAligningRef.current = true;
    }

    /*
     * SMOOTH ALIGN ANIMATION
     */
    if (isAligningRef.current) {
      const ALIGN_DURATION = 0.9;

      alignProgressRef.current = Math.min(
        alignProgressRef.current + delta / ALIGN_DURATION,
        1,
      );

      const t = alignProgressRef.current;

      /*
       * Smooth ease-in-out.
       */
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      group.current.quaternion.slerpQuaternions(
        alignFromRef.current,
        alignToRef.current,
        eased,
      );

      if (t >= 1) {
        isAligningRef.current = false;

        /*
         * Save an offset from the scroll rotation.
         *
         * This is what prevents the cube from jumping
         * straight back to the old scroll orientation
         * after the alignment finishes.
         */
        rotationOffsetRef.current
          .copy(scrollQuaternion)
          .invert()
          .multiply(alignToRef.current);
      }
    } else if (!isDraggingCubeRef.current) {
      /*
       * Normal scroll rotation + whatever offset
       * the align button created.
       */
      group.current.quaternion
        .copy(scrollQuaternion)
        .multiply(rotationOffsetRef.current);
    }

    /*
     * SCALE
     */
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
      posterTexture &&
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
      {/* TOP / ABOUT FACE */}
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

        {/* CONTACT LINK */}
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
      <group>
        <mesh
          position={[0, 0, 0.04]}
          renderOrder={100}
          onClick={handleContactClick}
          onPointerEnter={(event) => {
            event.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={(event) => {
            event.stopPropagation();
            document.body.style.cursor = "";
          }}
        >
          <planeGeometry args={[1.7, 0.45]} />

          <meshBasicMaterial
            transparent
            opacity={0}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      </group>

      <group
        position={[0, -FACE_OVERLAY_POSITION, 0]}
        rotation={[Math.PI / 2, 0, Math.PI * 2]}
      >
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
            map={posterTexture}
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
          position={[POSTER_LINK_CENTER_X, POSTER_LINK_CENTER_Y, 0.012]}
          renderOrder={40}
          onClick={handleClientWorkClick}
          onPointerOver={handleContactPointerOver}
          onPointerOut={handleContactPointerOut}
          onPointerDown={handleContactPointerDown}
          onPointerUp={handleContactPointerUp}
        >
          <planeGeometry
            args={[POSTER_LINK_PLANE_WIDTH, POSTER_LINK_PLANE_HEIGHT]}
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
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 24, 24, 24]} />

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
            <GradientFaceMaterial
              key={materialIndex}
              attach={`material-${materialIndex}`}
              materialIndex={materialIndex}
              palette={palette}
              isMobile={isMobile}
              hoveredRef={hoveredRef}
              introDoneRef={introDoneRef}
              activeMaterialIndexRef={activeMaterialIndexRef}
              targetMouseUvRef={targetMouseUvRef}
            />
          );
        })}
      </mesh>
    </group>
  );
}
