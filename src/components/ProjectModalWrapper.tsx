"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import TextReveal from "./TextReveal";

export interface Project {
  id: string;
  title: string;
  src: string;
  src2?: string | null;
  src3?: string | null;
  src4?: string | null;
  src5?: string | null;
  src6?: string | null;
  src7?: string | null;
  src8?: string | null;
  src9?: string | null;
  srcVideo?: string | null;
  role?: string | null;
  type?: string | null;
  tools?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectModalWrapperProps {
  project: Project;
}

type ImageDimensions = {
  width: number;
  height: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

const imageLayout = [
  {
    row: "justify-start",
    offset: "translate-x-0 sm:translate-x-10 lg:translate-x-20",
    size: "max-w-[280px] sm:max-w-[360px] lg:max-w-[430px]",
  },
  {
    row: "justify-end",
    offset: "translate-x-0 sm:-translate-x-12 lg:-translate-x-32",
    size: "max-w-[240px] sm:max-w-[330px] lg:max-w-[390px]",
  },
  {
    row: "justify-center",
    offset: "translate-x-0 sm:-translate-x-24 lg:-translate-x-40",
    size: "max-w-[260px] sm:max-w-[350px] lg:max-w-[420px]",
  },
  {
    row: "justify-end",
    offset: "translate-x-0 sm:-translate-x-4 lg:-translate-x-16",
    size: "max-w-[300px] sm:max-w-[380px] lg:max-w-[460px]",
  },
  {
    row: "justify-start",
    offset: "translate-x-0 sm:translate-x-32 lg:translate-x-56",
    size: "max-w-[230px] sm:max-w-[320px] lg:max-w-[380px]",
  },
  {
    row: "justify-center",
    offset: "translate-x-0 sm:translate-x-24 lg:translate-x-44",
    size: "max-w-[270px] sm:max-w-[360px] lg:max-w-[440px]",
  },
  {
    row: "justify-start",
    offset: "translate-x-0 sm:translate-x-4 lg:translate-x-24",
    size: "max-w-[250px] sm:max-w-[340px] lg:max-w-[400px]",
  },
  {
    row: "justify-end",
    offset: "translate-x-0 sm:-translate-x-20 lg:-translate-x-48",
    size: "max-w-[280px] sm:max-w-[370px] lg:max-w-[430px]",
  },
  {
    row: "justify-center",
    offset: "translate-x-0 sm:translate-x-8 lg:translate-x-16",
    size: "max-w-[240px] sm:max-w-[330px] lg:max-w-[390px]",
  },
];

const getTitleLines = (title: string) => {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) return title;

  if (words.length === 2) {
    return `${words[0]}\n${words[1]}`;
  }

  if (words.length === 3) {
    return `${words[0]}\n${words[1]}\n${words[2]}`;
  }

  const firstLineCount = Math.ceil(words.length / 2);

  return `${words.slice(0, firstLineCount).join(" ")}\n${words
    .slice(firstLineCount)
    .join(" ")}`;
};

const fieldVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease,
    },
  },
};

const ProjectModalWrapper = ({ project }: ProjectModalWrapperProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [imageDimensions, setImageDimensions] = useState<
    Record<number, ImageDimensions>
  >({});

  const images = useMemo(() => {
    return [
      project.src,
      project.src2,
      project.src3,
      project.src4,
      project.src5,
      project.src6,
      project.src7,
      project.src8,
      project.src9,
    ].filter(Boolean) as string[];
  }, [
    project.src,
    project.src2,
    project.src3,
    project.src4,
    project.src5,
    project.src6,
    project.src7,
    project.src8,
    project.src9,
  ]);

  const activeImage = activeIndex !== null ? images[activeIndex] : null;
  const activeDimensions =
    activeIndex !== null ? imageDimensions[activeIndex] : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    images.forEach((src, index) => {
      const img = new window.Image();

      img.src = src;

      const markAsReady = () => {
        setLoadedImages((prev) => ({
          ...prev,
          [index]: true,
        }));

        setImageDimensions((prev) => ({
          ...prev,
          [index]: {
            width: img.naturalWidth || 850,
            height: img.naturalHeight || 450,
          },
        }));
      };

      if (img.decode) {
        img
          .decode()
          .then(markAsReady)
          .catch(() => {
            if (img.complete) {
              markAsReady();
            } else {
              img.onload = markAsReady;
            }
          });
      } else {
        img.onload = markAsReady;
      }
    });
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openImage = (index: number) => {
    if (!loadedImages[index] || !imageDimensions[index]) return;

    setHoveredIndex(null);
    setActiveIndex(index);
  };

  const closeImage = () => {
    setActiveIndex(null);
    setHoveredIndex(null);
  };

  if (!isClient) return null;

  return (
    <LayoutGroup>
      <section className="mx-auto w-full max-w-[1600px] px-7 pt-32 sm:px-14">
        <div className="max-w-[1200px]">
          <TextReveal
            as="p"
            mode="words"
            delay={0.05}
            className="mb-8 text-xs font-black uppercase tracking-[0.25em] text-white/50"
          >
            Selected Project
          </TextReveal>

          <TextReveal
            as="h1"
            mode="lines"
            delay={0.12}
            className="text-left text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-color sm:text-7xl md:text-7xl xl:text-[9rem]"
          >
            {getTitleLines(project.title)}
          </TextReveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: 0.28,
                  staggerChildren: 0.08,
                },
              },
            }}
            className="mt-12 grid grid-cols-1 gap-8 border-t border-[#ecebeb]/20 pt-6 sm:grid-cols-3 sm:gap-10"
          >
            <motion.div variants={fieldVariants}>
              <TextReveal
                as="p"
                mode="words"
                className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs"
              >
                Role
              </TextReveal>

              <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                {project.role}
              </p>
            </motion.div>

            <motion.div variants={fieldVariants}>
              <TextReveal
                as="p"
                mode="words"
                className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs"
              >
                Type
              </TextReveal>

              <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                {project.type}
              </p>
            </motion.div>

            <motion.div variants={fieldVariants}>
              <TextReveal
                as="p"
                mode="words"
                className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs"
              >
                Tools
              </TextReveal>

              <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                {project.tools}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="mb-20 mt-20 flex min-h-[70vh] w-full flex-col gap-y-20 px-4 sm:mt-28 sm:gap-y-32 sm:px-8 lg:mt-32">
          {images.map((src, index) => {
            const imageNumber = String(index + 1).padStart(2, "0");
            const isActive = activeIndex === index;
            const isLoaded = loadedImages[index];

            const shouldBlur =
              (hoveredIndex !== null && hoveredIndex !== index) ||
              (activeIndex !== null && activeIndex !== index);

            const layout = imageLayout[index % imageLayout.length];
            const dimensions = imageDimensions[index];

            return (
              <div
                key={`${src}-${index}`}
                className={`flex w-full ${layout.row}`}
              >
                <motion.div
                  layoutId={`project-image-${index}`}
                  className={`group relative w-full ${layout.size} ${layout.offset}`}
                  onMouseEnter={() => {
                    if (activeIndex === null) {
                      setHoveredIndex(index);
                    }
                  }}
                  onMouseLeave={() => {
                    if (activeIndex === null) {
                      setHoveredIndex(null);
                    }
                  }}
                  animate={{
                    opacity: isActive ? 0 : shouldBlur ? 0.45 : 1,
                    filter: shouldBlur ? "blur(5px)" : "blur(0px)",
                  }}
                  style={{
                    pointerEvents: isActive ? "none" : "auto",
                  }}
                  transition={{
                    opacity: {
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    filter: {
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    layout: {
                      duration: 0.85,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }}
                >
                  <Image
                    unoptimized
                    className={`h-auto w-full ${
                      isLoaded ? "cursor-pointer" : "cursor-wait"
                    }`}
                    src={src}
                    alt={project.title || `Project Image ${index + 1}`}
                    width={dimensions?.width || 850}
                    height={dimensions?.height || 450}
                    sizes="(max-width: 768px) 80vw, 520px"
                    priority={index < 3}
                    onLoad={() => {
                      setLoadedImages((prev) => ({
                        ...prev,
                        [index]: true,
                      }));
                    }}
                    onClick={() => openImage(index)}
                  />

                  <div className="pointer-events-none absolute left-4 top-4 opacity-0 transition duration-500 group-hover:opacity-100">
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white mix-blend-difference">
                      {imageNumber}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}

          {project.srcVideo && (
            <div className="flex w-full justify-center lg:justify-start">
              <video
                className="h-auto w-full max-w-[520px] lg:max-w-[680px] lg:translate-x-20"
                autoPlay
                muted
                loop
                playsInline
                src={project.srcVideo}
              />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && activeImage && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
          >
            <motion.div
              layoutId={`project-image-${activeIndex}`}
              className="pointer-events-auto relative cursor-pointer"
              onClick={closeImage}
              transition={{
                layout: {
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
            >
              <Image
                unoptimized
                src={activeImage}
                alt={project.title || `Project Image ${activeIndex + 1}`}
                width={activeDimensions?.width || 850}
                height={activeDimensions?.height || 450}
                sizes="(max-width: 768px) 90vw, 850px"
                priority
                className="h-auto w-auto max-h-[82vh] max-w-[78vw] object-contain"
              />

              <div className="pointer-events-none absolute left-4 top-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white mix-blend-difference">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};

export default ProjectModalWrapper;
