"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Mesh,
  Texture,
  TextureLoader,
  SRGBColorSpace,
  CanvasTexture,
} from "three";
import {
  useScroll,
  useSpring,
  useTransform,
  motion,
  MotionValue,
} from "framer-motion";
import Link from "next/link";
import { OrbitControls } from "@react-three/drei";
import MagneticComp from "./MagneticComp";
import HeroIntro from "./HeroIntro";
import TextReveal from "@/components/TextReveal";
import TransitionLink from "./TransitionLink";

const ease = [0.22, 1, 0.36, 1] as const;

function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsMdUp(mediaQuery.matches);

    function handleChange(e: MediaQueryListEvent) {
      setIsMdUp(e.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMdUp;
}

const HERO_BG_COLOR = "#181c14";

const cubeProjects: {
  title: string;
  subtitle: string;
  images: string[];
  href?: string;
}[] = [
  {
    title: "Rustam Kerimov",
    subtitle: "Graphic Designer",
    images: [
      "/cube-img/rustam-4.jpg",
      "/cube-img/rustam-3.jpg",
      "/cube-img/rustam-5.jpg",
    ],
  },
  {
    title: "Echo Festival",
    subtitle: "View Project",
    href: "/project/692fa8ade953917a4953f016",
    images: [
      "/cube-img/echo-1.jpg",
      "/cube-img/echo-2.jpg",
      "/cube-img/echo-3.jpg",
    ],
  },
  {
    title: "i-D Magazine",
    subtitle: "View Project",
    href: "/project/692f9a5d6a4755436ddef92b",
    images: [
      "/cube-img/id-mag-1.jpg",
      "/cube-img/id-mag-2.jpg",
      "/cube-img/id-mag-3.jpg",
    ],
  },
  {
    title: "Art Exhibition",
    subtitle: "View Project",
    href: "/project/6930b50f931d3caa254b3237",
    images: [
      "/cube-img/cubeimg5.png",
      "/cube-img/caiman-1.jpg",
      "/cube-img/caiman-2.jpg",
    ],
  },
  {
    title: "Drømmenes Melodi",
    subtitle: "View Project",
    href: "/project/69300cd7a94f6af6c6b7d9d8",
    images: [
      "/cube-img/dream-1.jpg",
      "/cube-img/dream-2.jpg",
      "/cube-img/dream-3.jpg",
    ],
  },
  {
    title: "Maltesers Package",
    subtitle: "View Project",
    href: "/project/692f8cfc17ad2ca258e981de",
    images: [
      "/cube-img/maltesers-1.jpg",
      "/cube-img/maltesers-2.jpg",
      "/cube-img/maltesers-3.jpg",
    ],
  },
];

type CubeProject = (typeof cubeProjects)[number];

type CollageTile = {
  imageSlot: 0 | 1 | 2;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: boolean;
};

const BOX_FACE_PROJECT_INDEXES = [1, 2, 3, 4, 0, 5];

const faceCollageLayout: CollageTile[] = [
  { imageSlot: 0, x: 0, y: 0, width: 0.62, height: 1 },
  { imageSlot: 1, x: 0.62, y: 0, width: 0.38, height: 0.46 },
  { imageSlot: 2, x: 0.62, y: 0.46, width: 0.38, height: 0.54 },
];

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number,
  rotate = false,
) {
  const imageWidth =
    image instanceof HTMLImageElement
      ? image.naturalWidth || image.width
      : image.width;

  const imageHeight =
    image instanceof HTMLImageElement
      ? image.naturalHeight || image.height
      : image.height;

  if (!imageWidth || !imageHeight) return;

  ctx.save();

  if (rotate) {
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(Math.PI / 2);

    drawImageCover(ctx, image, -height / 2, -width / 2, height, width, false);

    ctx.restore();
    return;
  }

  const imageRatio = imageWidth / imageHeight;
  const tileRatio = width / height;

  let sourceWidth = imageWidth;
  let sourceHeight = imageHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > tileRatio) {
    sourceWidth = imageHeight * tileRatio;
    sourceX = (imageWidth - sourceWidth) / 2;
  } else {
    sourceHeight = imageWidth / tileRatio;
    sourceY = (imageHeight - sourceHeight) / 2;
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );

  ctx.restore();
}

function createCollageTexture(
  textures: Texture[],
  tiles: CollageTile[],
  shouldRotateLargeImage = false,
) {
  const size = 1024;
  const gap = 34;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);

  ctx.fillStyle = HERO_BG_COLOR;
  ctx.fillRect(0, 0, size, size);

  tiles.forEach((tile) => {
    const texture = textures[tile.imageSlot];
    const image = texture?.image as HTMLImageElement | HTMLCanvasElement;

    if (!image) return;

    const x = tile.x * size;
    const y = tile.y * size;
    const width = tile.width * size;
    const height = tile.height * size;

    const insetLeft = x === 0 ? 0 : gap / 2;
    const insetTop = y === 0 ? 0 : gap / 2;
    const insetRight = x + width >= size ? 0 : gap / 2;
    const insetBottom = y + height >= size ? 0 : gap / 2;

    const drawX = x + insetLeft;
    const drawY = y + insetTop;
    const drawWidth = width - insetLeft - insetRight;
    const drawHeight = height - insetTop - insetBottom;

    const isLargeImage = tile.imageSlot === 0;

    drawImageCover(
      ctx,
      image,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
      shouldRotateLargeImage && isLargeImage,
    );
  });

  const collageTexture = new CanvasTexture(canvas);

  collageTexture.colorSpace = SRGBColorSpace;
  collageTexture.needsUpdate = true;

  return collageTexture;
}

function createBlurredTexture(texture: Texture) {
  const image = texture.image as HTMLImageElement | HTMLCanvasElement;

  if (!image) return null;

  const width =
    image instanceof HTMLImageElement
      ? image.naturalWidth || image.width
      : image.width;

  const height =
    image instanceof HTMLImageElement
      ? image.naturalHeight || image.height
      : image.height;

  if (!width || !height) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.clearRect(0, 0, width, height);

  ctx.filter = "blur(6px) brightness(0.80)";
  ctx.drawImage(image, 0, 0, width, height);

  const blurredTexture = new CanvasTexture(canvas);

  blurredTexture.colorSpace = SRGBColorSpace;

  blurredTexture.wrapS = texture.wrapS;
  blurredTexture.wrapT = texture.wrapT;
  blurredTexture.repeat.copy(texture.repeat);
  blurredTexture.offset.copy(texture.offset);
  blurredTexture.center.copy(texture.center);
  blurredTexture.rotation = texture.rotation;
  blurredTexture.flipY = texture.flipY;

  blurredTexture.needsUpdate = true;

  return blurredTexture;
}

function waitForTextureImage(texture: Texture) {
  const image = texture.image as HTMLImageElement | undefined;

  if (!image) return Promise.resolve();

  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  if (typeof image.decode === "function") {
    return image.decode().catch(() => undefined);
  }

  return new Promise<void>((resolve) => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });
}

function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyTouchAction = document.body.style.touchAction;

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscrollBehavior =
      document.documentElement.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior =
        originalHtmlOverscrollBehavior;

      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.touchAction = originalBodyTouchAction;

      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

export default function Index() {
  const container = useRef<HTMLDivElement | null>(null);
  const isMdUp = useIsMdUp();

  const [activeCubeProject, setActiveCubeProject] =
    useState<CubeProject | null>(null);

  const activeCubeProjectRef = useRef<CubeProject | null>(null);
  const isProjectOverlayHoveredRef = useRef(false);
  const overlayLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [introDone, setIntroDone] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("hero-intro-seen") === "true";
  });

  useScrollLock(!introDone);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 4.3]);
  const smoothProgress = useSpring(progress, { damping: 20 });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  function clearOverlayTimeout() {
    if (overlayLeaveTimeoutRef.current) {
      clearTimeout(overlayLeaveTimeoutRef.current);
      overlayLeaveTimeoutRef.current = null;
    }
  }

  function handleActiveProjectChange(project: CubeProject | null) {
    clearOverlayTimeout();

    if (project) {
      activeCubeProjectRef.current = project;
      setActiveCubeProject(project);
      return;
    }

    overlayLeaveTimeoutRef.current = setTimeout(() => {
      if (isProjectOverlayHoveredRef.current) return;

      activeCubeProjectRef.current = null;
      setActiveCubeProject(null);
    }, 140);
  }

  function handleProjectOverlayEnter() {
    isProjectOverlayHoveredRef.current = true;
    clearOverlayTimeout();

    if (activeCubeProjectRef.current) {
      setActiveCubeProject(activeCubeProjectRef.current);
    }
  }

  function handleProjectOverlayLeave() {
    isProjectOverlayHoveredRef.current = false;

    overlayLeaveTimeoutRef.current = setTimeout(() => {
      activeCubeProjectRef.current = null;
      setActiveCubeProject(null);
    }, 140);
  }

  useEffect(() => {
    return () => {
      clearOverlayTimeout();
    };
  }, []);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hero-intro-seen");

    if (hasSeenIntro) {
      setIntroDone(true);
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem("hero-intro-seen", "true");
      setIntroDone(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={container}
      className="min-h-[150dvh]"
      initial={false}
      animate={{ opacity: 1 }}
    >
      <div className="sticky top-0 relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden uppercase">
        <HeroIntro isDone={introDone} />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={false}
            animate={introDone ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="relative h-full w-full"
          >
            <Canvas className="h-3/4 w-full">
              {isMdUp && <OrbitControls enableZoom={false} enablePan={false} />}

              <ambientLight intensity={2} />
              <directionalLight position={[2, 1, 1]} />

              <Cube
                scrollProgress={smoothProgress}
                introDone={introDone}
                onActiveProjectChange={handleActiveProjectChange}
              />
            </Canvas>

            {activeCubeProject && introDone && (
              <div className="pointer-events-none absolute left-1/2 top-[38%] z-20 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center uppercase">
                <div
                  className="pointer-events-auto"
                  onPointerEnter={handleProjectOverlayEnter}
                  onPointerLeave={handleProjectOverlayLeave}
                >
                  <p className="mb-2 text-[10px] font-bold tracking-[0.55em] text-white">
                    {activeCubeProject.subtitle}
                  </p>

                  <h3 className="text-3xl font-black tracking-[-0.05em] text-white md:text-5xl">
                    {activeCubeProject.title}
                  </h3>

                  {activeCubeProject.href && (
                    <TransitionLink
                      href={activeCubeProject.href}
                      transitionLabel={activeCubeProject.title}
                      className="mt-5 inline-block border border-white px-5 py-3 text-xs font-bold tracking-[0.35em] text-white transition hover:bg-white hover:text-black"
                    >
                      View case
                    </TransitionLink>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.9,
            delay: introDone ? 0.15 : 0,
            ease,
          }}
          className="pointer-events-none absolute bottom-4 z-10 px-4 text-center lg:bottom-11"
        >
          {introDone && (
            <>
              <TextReveal
                as="h1"
                mode="words"
                viewport={false}
                delay={0.05}
                className="-mb-1 text-2xl font-bold text-color sm:text-2xl"
              >
                Rustam Kerimov
              </TextReveal>

              <motion.div
                className="mx-auto mt-1 rounded-3xl bg-stone-500"
                style={{
                  width: lineWidth,
                  height: "2px",
                  originX: 0,
                }}
              />

              <TextReveal
                as="h2"
                mode="words"
                viewport={false}
                delay={0.12}
                className="whitespace-nowrap text-3xl font-extrabold text-color sm:text-4xl"
              >
                Graphic Designer
              </TextReveal>
            </>
          )}
        </motion.div>

        <motion.div
          initial={false}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.9,
            delay: introDone ? 0.25 : 0,
            ease,
          }}
          className="absolute bottom-10 left-10 z-10 hidden px-4 text-left lg:block"
        >
          {introDone && (
            <MagneticComp>
              <Link href="/projects" className="inline-block">
                <TextReveal
                  as="span"
                  mode="words"
                  viewport={false}
                  delay={0.05}
                  className="text-4xl font-extrabold text-color sm:text-4xl"
                >
                  Archives
                </TextReveal>
              </Link>
            </MagneticComp>
          )}
        </motion.div>

        <motion.div
          initial={false}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.9,
            delay: introDone ? 0.3 : 0,
            ease,
          }}
          className="absolute bottom-10 right-10 z-10 hidden px-4 text-left lg:block"
        >
          {introDone && (
            <MagneticComp>
              <Link href="/contact" className="inline-block">
                <TextReveal
                  as="span"
                  mode="words"
                  viewport={false}
                  delay={0.05}
                  className="text-4xl font-extrabold text-color sm:text-4xl"
                >
                  Collaborate
                </TextReveal>
              </Link>
            </MagneticComp>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

const Cube = ({
  scrollProgress,
  introDone,
  onActiveProjectChange,
}: {
  scrollProgress: MotionValue<number>;
  introDone: boolean;
  onActiveProjectChange: (project: CubeProject | null) => void;
}) => {
  const mesh = useRef<Mesh>(null);

  const { camera, raycaster, pointer } = useThree();

  const [hovered, setHovered] = useState(false);
  const [activeMaterialIndex, setActiveMaterialIndex] = useState<number | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [collageTextures, setCollageTextures] = useState<
    (CanvasTexture | null)[]
  >([]);
  const [blurredTextures, setBlurredTextures] = useState<
    (CanvasTexture | null)[]
  >([]);

  const hoveredRef = useRef(false);
  const hasPointerEnteredRef = useRef(false);
  const activeMaterialIndexRef = useRef<number | null>(null);
  const targetScaleRef = useRef(1);

  const allImagePaths = useMemo(
    () => cubeProjects.flatMap((project) => project.images),
    [],
  );

  const textures = useLoader(TextureLoader, allImagePaths) as Texture[];

  useEffect(() => {
    let cancelled = false;

    let generatedCollageTextures: (CanvasTexture | null)[] = [];
    let generatedBlurredTextures: (CanvasTexture | null)[] = [];

    async function buildTextures() {
      textures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      await Promise.all(
        textures.map((texture) => waitForTextureImage(texture)),
      );

      if (cancelled) return;

      const textureGroups = cubeProjects.map((project, projectIndex) => {
        const startIndex = cubeProjects
          .slice(0, projectIndex)
          .reduce((total, currentProject) => {
            return total + currentProject.images.length;
          }, 0);

        return textures.slice(startIndex, startIndex + project.images.length);
      });

      generatedCollageTextures = BOX_FACE_PROJECT_INDEXES.map(
        (projectIndex) => {
          const projectTextures = textureGroups[projectIndex];

          const shouldRotateLargeImage = projectIndex !== 0;

          return createCollageTexture(
            projectTextures,
            faceCollageLayout,
            shouldRotateLargeImage,
          );
        },
      );

      generatedBlurredTextures = generatedCollageTextures.map((texture) =>
        texture ? createBlurredTexture(texture) : null,
      );

      if (cancelled) {
        generatedCollageTextures.forEach((texture) => {
          texture?.dispose();
        });

        generatedBlurredTextures.forEach((texture) => {
          texture?.dispose();
        });

        return;
      }

      setCollageTextures(generatedCollageTextures);
      setBlurredTextures(generatedBlurredTextures);
    }

    buildTextures();

    return () => {
      cancelled = true;

      generatedCollageTextures.forEach((texture) => {
        texture?.dispose();
      });

      generatedBlurredTextures.forEach((texture) => {
        texture?.dispose();
      });
    };
  }, [textures]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    if (!mesh.current) return;

    mesh.current.position.set(0, 0, 0);
    mesh.current.rotation.set(0, 0, 0);
    mesh.current.scale.set(1, 1, 1);
    targetScaleRef.current = 1;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;

    const value = scrollProgress.get();

    mesh.current.rotation.x = value;
    mesh.current.rotation.y = value * 1.2;

    if (hasPointerEnteredRef.current) {
      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObject(mesh.current, false);
      const currentIntersection = intersects[0];

      if (introDone && currentIntersection?.face) {
        const materialIndex = currentIntersection.face.materialIndex ?? 0;
        const projectIndex = BOX_FACE_PROJECT_INDEXES[materialIndex];

        if (!hoveredRef.current) {
          hoveredRef.current = true;
          setHovered(true);
        }

        if (activeMaterialIndexRef.current !== materialIndex) {
          activeMaterialIndexRef.current = materialIndex;
          setActiveMaterialIndex(materialIndex);
          onActiveProjectChange(cubeProjects[projectIndex]);
        }
      } else {
        if (hoveredRef.current) {
          hoveredRef.current = false;
          setHovered(false);
        }

        if (activeMaterialIndexRef.current !== null) {
          activeMaterialIndexRef.current = null;
          setActiveMaterialIndex(null);
          onActiveProjectChange(null);
        }
      }
    }

    if (isMobile) {
      mesh.current.scale.set(1, 1, 1);
      return;
    }

    const targetScale = hoveredRef.current && introDone ? 1.1 : 1;
    targetScaleRef.current += (targetScale - targetScaleRef.current) * 0.1;

    mesh.current.scale.set(
      targetScaleRef.current,
      targetScaleRef.current,
      targetScaleRef.current,
    );
  });

  function handlePointerEnter() {
    if (!introDone) return;

    hasPointerEnteredRef.current = true;
  }

  function handlePointerLeave() {
    hasPointerEnteredRef.current = false;
    hoveredRef.current = false;
    activeMaterialIndexRef.current = null;

    setHovered(false);
    setActiveMaterialIndex(null);
    onActiveProjectChange(null);
  }

  const texturesReady =
    collageTextures.length === BOX_FACE_PROJECT_INDEXES.length &&
    collageTextures.every(Boolean) &&
    blurredTextures.length === BOX_FACE_PROJECT_INDEXES.length &&
    blurredTextures.every(Boolean);

  if (!texturesReady) {
    return null;
  }

  return (
    <mesh
      ref={mesh}
      position={[0, 0, 0]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <boxGeometry args={[2.3, 2.3, 2.3]} />

      {BOX_FACE_PROJECT_INDEXES.map((projectIndex, materialIndex) => {
        const isRustam = projectIndex === 0;
        const isActiveFace =
          hovered && introDone && activeMaterialIndex === materialIndex;

        const normalTexture = collageTextures[materialIndex];

        const textureMap =
          isActiveFace && blurredTextures[materialIndex]
            ? blurredTextures[materialIndex]
            : normalTexture;

        if (isRustam) {
          return (
            <meshBasicMaterial
              key={materialIndex}
              attach={`material-${materialIndex}`}
              map={textureMap}
              toneMapped={false}
            />
          );
        }

        return (
          <meshStandardMaterial
            key={materialIndex}
            attach={`material-${materialIndex}`}
            map={textureMap}
          />
        );
      })}
    </mesh>
  );
};
