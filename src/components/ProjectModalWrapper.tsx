"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import TextReveal from "./TextReveal";
import MagneticComp from "./MagneticComp";

export interface Project {
  id: string;
  title: string;
  description?: string | null;
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
  tags?: string | string[] | null;
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
    size: "max-w-[280px] sm:max-w-[360px] lg:max-w-[560px] xl:max-w-[640px]",
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

const formatCount = (count: number) => String(count).padStart(2, "0");

const RollingDigit = ({
  digit,
  delay = 0,
}: {
  digit: number;
  delay?: number;
}) => {
  const duration = digit === 0 ? 0.6 : 0.45 + digit * 0.22;

  return (
    <span className="relative inline-block h-[1em] overflow-hidden leading-none">
      <motion.span
        className="block"
        initial={{ y: "0%" }}
        animate={{ y: `-${digit * 10}%` }}
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1],
          delay,
        }}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <span
            key={index}
            className="block h-[1em] leading-none"
            aria-hidden="true"
          >
            {index}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

const RollingCount = ({
  value,
  digits = 2,
}: {
  value: number;
  digits?: number;
}) => {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setHasStarted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [value]);

  const currentValue = hasStarted ? value : 0;
  const formattedValue = String(currentValue).padStart(digits, "0");

  return (
    <span
      className="inline-flex overflow-hidden text-lg font-black uppercase leading-none tracking-[0.06em] text-white/85 sm:text-xl"
      aria-label={formatCount(value)}
    >
      {formattedValue.split("").map((character, index) => (
        <RollingDigit
          key={`${index}-${character}`}
          digit={Number(character)}
          delay={index * 0.08}
        />
      ))}
    </span>
  );
};

const ProjectDescription = ({
  title,
  description,
}: {
  title: string;
  description?: string | null;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  const paragraphs = description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const previewText = paragraphs[0] || description;
  const textToShow = isExpanded ? description : previewText;
  const hasMoreText =
    paragraphs.length > 1 || description.length > previewText.length;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 40,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.85,
        ease,
      }}
      className="mt-14 w-full px-4 py-10 sm:mt-20 sm:px-8 sm:py-16 lg:mt-28 lg:px-0"
      aria-labelledby="project-description-title"
    >
      <div className="ml-auto w-full max-w-[920px] pr-4 sm:pr-8 lg:pr-16 xl:pr-20">
        <h2 id="project-description-title" className="sr-only">
          {title} project description
        </h2>

        <motion.div
          layout
          id="project-description-content"
          transition={{
            layout: {
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          className="overflow-hidden whitespace-pre-line text-base font-black italic leading-8 tracking-[0.06em] text-white/85 sm:text-lg sm:leading-9 md:text-2xl md:leading-10"
        >
          {textToShow}
        </motion.div>

        {hasMoreText && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls="project-description-content"
            className="mt-8 inline-flex items-center cursor-pointer gap-3 text-[10px] font-black uppercase tracking-[0.32em] text-white/55 transition-opacity duration-300 hover:opacity-100 sm:text-xs"
          >
            <span>{isExpanded ? "Show less" : "Read more"}</span>

            <span
              className={`inline-flex origin-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isExpanded ? "rotate-90" : "-rotate-90"
              }`}
              aria-hidden="true"
            >
              <svg
                width="30"
                height="18"
                viewBox="0 0 30 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-[14px] w-[24px] sm:h-[16px] sm:w-[28px]"
              >
                <path
                  d="M4 14H26"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
                <path
                  d="M4 14L11 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </button>
        )}
      </div>
    </motion.section>
  );
};

const getProjectTags = (tags?: string | string[] | null) => {
  if (!tags) return [];

  const parsedTags = Array.isArray(tags) ? tags : tags.split(",");

  return parsedTags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag, index, allTags) => allTags.indexOf(tag) === index);
};

const formatTag = (tag: string) => {
  return tag.replaceAll("-", " ");
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

  const imageCount = images.length;
  const videoCount = project.srcVideo ? 1 : 0;
  const projectTags = getProjectTags(project.tags);

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
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[1200px]">
              <TextReveal
                as="h1"
                mode="lines"
                delay={0.12}
                className="text-left text-5xl font-black uppercase leading-[0.9] tracking-[-0.025em] text-color sm:text-7xl md:text-7xl xl:text-[9rem]"
              >
                {getTitleLines(project.title)}
              </TextReveal>
            </div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                filter: "blur(8px)",
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.85,
                ease,
                delay: 0.15,
              }}
              className="flex items-center gap-8 xl:justify-end xl:pb-4"
            >
              <div className="flex flex-col">
                <span className="mb-2 text-[10px]  uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                  Images
                </span>

                <RollingCount value={imageCount} />
              </div>

              <div className="flex flex-col">
                <span className="mb-2 text-[10px]  uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                  Videos
                </span>

                <RollingCount value={videoCount} />
              </div>
            </motion.div>
          </div>

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
            className="mt-4 grid grid-cols-1 gap-6 border-t border-[#ecebeb]/20 pt-6 sm:grid-cols-3 sm:gap-10"
          >
            <motion.div variants={fieldVariants}>
              <TextReveal
                as="p"
                mode="words"
                className="mb-3 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs"
              >
                Tags
              </TextReveal>

              <p className="text-sm max-w-60 uppercase leading-relaxed text-white/85 sm:text-base">
                {projectTags.length > 0
                  ? projectTags.map(formatTag).join(", ")
                  : "—"}
              </p>
            </motion.div>

            <motion.div variants={fieldVariants}>
              <TextReveal
                as="p"
                mode="words"
                className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs"
              >
                Year
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
              <div key={`${src}-${index}`}>
                <div className={`flex w-full ${layout.row}`}>
                  <MagneticComp>
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
                  </MagneticComp>
                </div>

                {index === 0 && (
                  <ProjectDescription
                    title={project.title}
                    description={project.description}
                  />
                )}
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
