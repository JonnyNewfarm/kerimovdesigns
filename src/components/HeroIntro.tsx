"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type HeroIntroProps = {
  isDone: boolean;
};

type IntroProject = {
  title: string;
  images: [string, string, string];
};

const introProjects: IntroProject[] = [
  {
    title: "Drømmenes Melodi",
    images: [
      "/cube-img/dream-1-rotate.jpg",
      "/cube-img/dream-2.jpg",
      "/cube-img/dream-3.jpg",
    ],
  },
  {
    title: "Art Exhibition",
    images: [
      "/cube-img/caiman-rotate.jpg",
      "/cube-img/caiman-1.jpg",
      "/cube-img/caiman-2.jpg",
    ],
  },
  {
    title: "Rustam Kerimov",
    images: [
      "/cube-img/rustam-4.jpg",
      "/cube-img/rustam-3.jpg",
      "/cube-img/rustam-5.jpg",
    ],
  },
];

const ease = [0.76, 0, 0.24, 1] as const;

const imageTransition = {
  duration: 0.75,
  ease,
};

export default function HeroIntro({ isDone }: HeroIntroProps) {
  const [imagesReady, setImagesReady] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const activeProject = introProjects[activeProjectIndex];

  const allImages = useMemo(() => {
    return introProjects.flatMap((project) => project.images);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function preloadImages() {
      await Promise.all(
        allImages.map((src) => {
          return new Promise<void>((resolve) => {
            const img = new window.Image();

            img.onload = () => resolve();
            img.onerror = () => {
              console.error("Hero intro image failed:", src);
              resolve();
            };

            img.src = src;
          });
        }),
      );

      if (mounted) {
        setImagesReady(true);
      }
    }

    preloadImages();

    return () => {
      mounted = false;
    };
  }, [allImages]);

  useEffect(() => {
    if (!imagesReady) return;

    const caimanTimer = window.setTimeout(() => {
      setActiveProjectIndex(1);
    }, 1150);

    const rustamTimer = window.setTimeout(() => {
      setActiveProjectIndex(2);
    }, 2300);

    return () => {
      window.clearTimeout(caimanTimer);
      window.clearTimeout(rustamTimer);
    };
  }, [imagesReady]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.6,
              delay: 0.15,
              ease,
            },
          }}
          className="absolute inset-0 z-50 bg-[#181c14]"
        >
          <div className="relative h-full w-full overflow-hidden">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: imagesReady ? 1 : 0,
                y: imagesReady ? 0 : 10,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute left-1/2 top-[18%] -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.45em] text-[#ecdfcc]/65"
            >
              Portfolio Experience
            </motion.p>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{
                  opacity: imagesReady ? 1 : 0,
                  scale: imagesReady ? 1 : 0.98,
                }}
                transition={{
                  duration: 0.65,
                  ease,
                }}
                className="relative h-[245px] w-[245px] bg-[#181c14] md:h-[285px] md:w-[285px]"
                style={
                  {
                    "--intro-gap": "8px",
                  } as React.CSSProperties
                }
              >
                <ImageSlot
                  className="absolute left-0 top-0 h-full w-[calc(62%-var(--intro-gap)/2)] overflow-hidden bg-[#181c14]"
                  src={activeProject.images[0]}
                  direction="left"
                />

                <ImageSlot
                  className="absolute right-0 top-0 h-[calc(46%-var(--intro-gap)/2)] w-[calc(38%-var(--intro-gap)/2)] overflow-hidden bg-[#181c14]"
                  src={activeProject.images[1]}
                  direction="right"
                />

                <ImageSlot
                  className="absolute bottom-0 right-0 h-[calc(54%-var(--intro-gap)/2)] w-[calc(38%-var(--intro-gap)/2)] overflow-hidden bg-[#181c14]"
                  src={activeProject.images[2]}
                  direction="right"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: imagesReady ? 1 : 0,
              }}
              transition={{
                duration: 3.2,
                ease,
              }}
              className="absolute bottom-[18%] left-1/2 h-[1px] w-[180px] origin-left -translate-x-1/2 bg-[#ecdfcc]/60"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ImageSlot({
  className,
  src,
  direction = "left",
}: {
  className: string;
  src: string;
  direction?: "left" | "right";
}) {
  const [currentImage, setCurrentImage] = useState(src);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentImageRef = useRef(src);
  const firstRenderRef = useRef(true);

  const enterX = direction === "left" ? "-42%" : "42%";
  const exitX = direction === "left" ? "42%" : "-42%";

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      currentImageRef.current = src;
      setCurrentImage(src);
      return;
    }

    if (currentImageRef.current === src) return;

    const oldImage = currentImageRef.current;

    setPreviousImage(oldImage);
    setCurrentImage(src);
    setIsAnimating(true);

    currentImageRef.current = src;

    const timeout = window.setTimeout(() => {
      setPreviousImage(null);
      setIsAnimating(false);
    }, imageTransition.duration * 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [src]);

  return (
    <div className={className}>
      {previousImage && (
        <motion.div
          key={`previous-${previousImage}`}
          initial={{
            x: "0%",
            opacity: 1,
          }}
          animate={{
            x: exitX,
            opacity: 0,
          }}
          transition={imageTransition}
          className="absolute inset-0"
        >
          <HeroImage src={previousImage} />
        </motion.div>
      )}

      <motion.div
        key={`current-${currentImage}`}
        initial={
          isAnimating
            ? {
                x: enterX,
                opacity: 0,
              }
            : {
                x: "0%",
                opacity: 1,
              }
        }
        animate={{
          x: "0%",
          opacity: 1,
        }}
        transition={imageTransition}
        className="absolute inset-0"
      >
        <HeroImage src={currentImage} />
      </motion.div>
    </div>
  );
}

function HeroImage({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
