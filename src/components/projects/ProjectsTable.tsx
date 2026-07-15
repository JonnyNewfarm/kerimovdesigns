"use client";

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import TransitionLink from "@/components/TransitionLink";
import TextReveal from "@/components/TextReveal";
import Image from "next/image";
import MagneticComp from "../MagneticComp";
import ProjectsTagFilter from "./ProjectsTagFilter";

type ProjectListItem = {
  id: string;
  title: string;
  src: string;
  type: string | null;
  tools: string | null;
  tags: string[];
  createdAt?: Date;
  description?: string | null;
};

interface ProjectsTableProps {
  projects: ProjectListItem[];
  children?: ReactNode;
  startIndex: number;
  availableTags?: string[];
  activeTags?: string[];
}

const PROJECTS_PER_VIEW = 5;

const ease = [0.22, 1, 0.36, 1] as const;

const formatTag = (tag: string) => {
  return tag.replaceAll("-", " ");
};

const PaginationTextArrow = ({ direction }: { direction: "prev" | "next" }) => {
  const isPrev = direction === "prev";

  return (
    <span
      className={`pagination-text-arrow ${isPrev ? "is-prev" : "is-next"}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 24">
        {isPrev ? (
          <>
            <path d="M44 12H14" />
            <path className="pagination-text-arrow-wing" d="M14 12L24 4" />
          </>
        ) : (
          <>
            <path d="M4 12H34" />
            <path className="pagination-text-arrow-wing" d="M34 12L24 4" />
          </>
        )}
      </svg>
    </span>
  );
};

const ProjectsTable = ({
  projects,
  children,
  startIndex,
  availableTags = [],
  activeTags = [],
}: ProjectsTableProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  const queuedProjectIndex = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);
  const imageLinkRef = useRef<HTMLAnchorElement | null>(null);

  const imageMouseX = useMotionValue(0);
  const imageMouseY = useMotionValue(0);

  const cursorX = useSpring(imageMouseX, {
    stiffness: 180,
    damping: 22,
    mass: 0.4,
  });

  const cursorY = useSpring(imageMouseY, {
    stiffness: 180,
    damping: 22,
    mass: 0.4,
  });

  const activeTagsKey = activeTags.join("|");

  const totalPages = Math.max(
    Math.ceil(projects.length / PROJECTS_PER_VIEW),
    1,
  );

  const visibleProjects = useMemo(() => {
    const start = pageIndex * PROJECTS_PER_VIEW;
    const end = start + PROJECTS_PER_VIEW;

    return projects.slice(start, end);
  }, [projects, pageIndex]);

  const activeProject = projects[activeIndex] ?? null;
  const hasProjects = projects.length > 0 && activeProject !== null;

  const canGoPrevPage = hasProjects && pageIndex > 0;
  const canGoNextPage = hasProjects && pageIndex < totalPages - 1;

  const setProjectIndex = useCallback(
    (index: number) => {
      if (!projects.length) {
        return;
      }

      const safeIndex = Math.min(Math.max(index, 0), projects.length - 1);

      queuedProjectIndex.current = safeIndex;

      if (animationFrame.current) {
        return;
      }

      animationFrame.current = window.requestAnimationFrame(() => {
        const nextIndex = queuedProjectIndex.current;

        if (nextIndex !== null) {
          setActiveIndex((currentIndex) => {
            if (currentIndex === nextIndex) {
              return currentIndex;
            }

            return nextIndex;
          });
        }

        queuedProjectIndex.current = null;
        animationFrame.current = null;
      });
    },
    [projects.length],
  );

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    setPageIndex(0);
    setActiveIndex(0);
    setDirection(1);
    setIsHoveringImage(false);
  }, [activeTagsKey]);

  useEffect(() => {
    if (!projects.length) {
      setActiveIndex(0);
      setPageIndex(0);
      setIsHoveringImage(false);
      return;
    }

    setActiveIndex((currentIndex) => {
      if (currentIndex > projects.length - 1) {
        return projects.length - 1;
      }

      return currentIndex;
    });
  }, [projects.length]);

  useEffect(() => {
    if (pageIndex > totalPages - 1) {
      const safePage = Math.max(totalPages - 1, 0);
      const nextActiveIndex = safePage * PROJECTS_PER_VIEW;

      setPageIndex(safePage);
      setActiveIndex(nextActiveIndex);
    }
  }, [pageIndex, totalPages]);

  const goToPrevPage = () => {
    if (!canGoPrevPage) {
      return;
    }

    const nextPage = pageIndex - 1;
    const nextActiveIndex = nextPage * PROJECTS_PER_VIEW;

    setDirection(-1);
    setPageIndex(nextPage);
    setActiveIndex(nextActiveIndex);
    setIsHoveringImage(false);
  };

  const goToNextPage = () => {
    if (!canGoNextPage) {
      return;
    }

    const nextPage = pageIndex + 1;
    const nextActiveIndex = nextPage * PROJECTS_PER_VIEW;

    setDirection(1);
    setPageIndex(nextPage);
    setActiveIndex(nextActiveIndex);
    setIsHoveringImage(false);
  };

  const handleImageMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    imageMouseX.set(event.clientX - rect.left);
    imageMouseY.set(event.clientY - rect.top);

    if (!isHoveringImage) {
      setIsHoveringImage(true);
    }
  };

  const handleImageMouseEnter = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    imageMouseX.set(event.clientX - rect.left);
    imageMouseY.set(event.clientY - rect.top);

    setIsHoveringImage(true);
  };

  const handleImageMouseLeave = () => {
    setIsHoveringImage(false);
  };

  return (
    <section className="w-full bg-dark text-color">
      <div className="mx-auto grid min-h-screen w-full max-w-[1800px] grid-cols-1 gap-10 px-7 pb-12 pt-28 sm:px-8 md:grid-cols-12 md:pt-32 lg:px-8 xl:px-18">
        <aside className="flex min-h-0 flex-col md:col-span-5 md:h-[calc(100vh-9rem)] md:pr-6 xl:col-span-4">
          <div className="relative z-[200] mb-6 flex min-h-[calc(clamp(3rem,5vw,5.4rem)*1.76+1.5rem)] shrink-0 flex-col justify-end gap-5">
            <ProjectsTagFilter
              availableTags={availableTags}
              activeTags={activeTags}
            />
          </div>

          <TextReveal
            as="p"
            mode="words"
            delay={0.05}
            className="mb-2 mt-5 text-[10px] font-black uppercase tracking-[0.35em] text-white/80 sm:text-xs"
          >
            Selected Work
          </TextReveal>

          <div className="relative min-h-[390px] flex-1 overflow-hidden">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              {hasProjects ? (
                <motion.div
                  key={`projects-${activeTagsKey || "all"}-${pageIndex}`}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    x: direction === 1 ? 42 : -42,
                    filter: "blur(7px)",
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    x: direction === 1 ? -28 : 28,
                    filter: "blur(7px)",
                  }}
                  transition={{
                    duration: 0.42,
                    ease,
                  }}
                  className="absolute inset-0"
                >
                  {visibleProjects.map((project, index) => {
                    const realIndex = pageIndex * PROJECTS_PER_VIEW + index;

                    const isActive = activeIndex === realIndex;

                    return (
                      <TransitionLink
                        key={project.id}
                        href={`/project/${project.id}`}
                        transitionLabel={project.title}
                        direction="right"
                        onFocus={() => setProjectIndex(realIndex)}
                        className="group inline-flex min-h-[78px] w-fit items-center py-5 text-left transition-opacity duration-300"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <span
                            className={`mt-1 text-[10px] uppercase tracking-[0.22em] transition-all duration-300 sm:text-xs ${
                              isActive ? "text-white opacity-100" : "opacity-35"
                            }`}
                          >
                            {String(startIndex + realIndex + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <div className="min-w-0">
                            <h2
                              onMouseEnter={() => setProjectIndex(realIndex)}
                              className={`w-fit max-w-full truncate font-black uppercase leading-none tracking-[-0.045em] transition-all duration-500 ${
                                isActive
                                  ? "translate-x-3 text-[clamp(1.75rem,2.1vw,2.65rem)] text-white opacity-100"
                                  : "translate-x-0 text-[clamp(1.45rem,1.75vw,2.15rem)] text-white/45 opacity-80"
                              }`}
                            >
                              {project.title}
                            </h2>
                          </div>
                        </div>
                      </TransitionLink>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key={`empty-${activeTagsKey || "all"}`}
                  initial={{
                    opacity: 0,
                    y: 24,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -16,
                    filter: "blur(6px)",
                  }}
                  transition={{
                    duration: 0.48,
                    ease,
                  }}
                  className="absolute inset-0 flex flex-col justify-center pb-16"
                >
                  <motion.div
                    initial={{
                      scaleX: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scaleX: 1,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08,
                      ease,
                    }}
                    className="mb-7 h-px w-full origin-left bg-white/15"
                  />

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.14,
                      ease,
                    }}
                    className="max-w-[420px] text-[clamp(1.8rem,3vw,3.4rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white"
                  >
                    No projects found
                  </motion.p>

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2,
                      ease,
                    }}
                    className="mt-4 max-w-[360px] text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/70 sm:text-xs"
                  >
                    Try removing one of the selected tags
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            animate={{
              opacity: hasProjects ? 1 : 0,
              y: hasProjects ? 0 : 10,
            }}
            transition={{
              duration: 0.3,
              ease,
            }}
            aria-hidden={!hasProjects}
            className={`mt-6 flex shrink-0 items-center justify-between pt-5 ${
              hasProjects ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <div className="flex w-full flex-col items-center justify-between pr-5 2xl:flex-row">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 sm:text-xs">
                {String(pageIndex + 1).padStart(2, "0")} /{" "}
                {String(totalPages).padStart(2, "0")}
              </p>

              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={goToPrevPage}
                  disabled={!canGoPrevPage}
                  aria-label="Previous projects"
                  className={`group inline-flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.25em] transition-opacity duration-300 sm:text-md xl:text-lg 2xl:text-xl ${
                    canGoPrevPage
                      ? "cursor-pointer text-white hover:opacity-70"
                      : "cursor-not-allowed text-white/20 opacity-90"
                  }`}
                >
                  <PaginationTextArrow direction="prev" />
                  <span>Prev</span>
                </button>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={!canGoNextPage}
                  aria-label="Next projects"
                  className={`group inline-flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.25em] transition-opacity duration-300 sm:text-md xl:text-xl 2xl:text-xl ${
                    canGoNextPage
                      ? "cursor-pointer text-white hover:opacity-70"
                      : "cursor-not-allowed text-white/20 opacity-90"
                  }`}
                >
                  <span>Next</span>
                  <PaginationTextArrow direction="next" />
                </button>
              </div>
            </div>
          </motion.div>

          {children ? <div className="mt-8 shrink-0">{children}</div> : null}
        </aside>

        <main className="relative flex min-h-0 flex-col md:col-span-7 xl:col-span-8">
          <AnimatePresence initial={false} mode="wait">
            {hasProjects && activeProject ? (
              <motion.div
                key={`project-view-${activeTagsKey || "all"}`}
                initial={{
                  opacity: 0,
                  x: 32,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  x: 22,
                  filter: "blur(8px)",
                }}
                transition={{
                  duration: 0.48,
                  ease,
                }}
                className="ml-auto flex w-full max-w-[1080px] flex-col"
              >
                <MagneticComp>
                  <TransitionLink
                    ref={imageLinkRef}
                    href={`/project/${activeProject.id}`}
                    transitionLabel={activeProject.title}
                    direction="right"
                    onMouseMove={handleImageMouseMove}
                    onMouseEnter={handleImageMouseEnter}
                    onMouseLeave={handleImageMouseLeave}
                    className="group relative isolate z-10 block h-[clamp(360px,56vh,640px)] w-full shrink-0 cursor-pointer overflow-hidden"
                    aria-label={`Open project ${activeProject.title}`}
                  >
                    <Image
                      src={activeProject.src}
                      alt={activeProject.title}
                      fill
                      priority
                      sizes="(min-width: 1280px) 66vw, (min-width: 768px) 58vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />

                    <motion.div
                      aria-hidden="true"
                      style={{
                        x: cursorX,
                        y: cursorY,
                      }}
                      animate={{
                        opacity: isHoveringImage ? 1 : 0,
                        scale: isHoveringImage ? 1 : 0.35,
                      }}
                      transition={{
                        opacity: {
                          duration: 0.2,
                          ease: "easeOut",
                        },
                        scale: {
                          duration: 0.35,
                          ease,
                        },
                      }}
                      className="pointer-events-none absolute left-0 top-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 mix-blend-difference lg:flex"
                    >
                      <div className="text-center text-[7vw] font-black uppercase leading-[0.78] tracking-[-0.035em] text-white md:text-[5.8vw] lg:text-[4.8vw]">
                        View case
                      </div>
                    </motion.div>
                  </TransitionLink>
                </MagneticComp>

                <div className="mt-7 min-h-0 pt-7">
                  <AnimatePresence initial={false} mode="sync">
                    <motion.div
                      key={activeProject.id}
                      initial={{
                        opacity: 0,
                        y: 14,
                        filter: "blur(6px)",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        filter: "blur(6px)",
                        position: "absolute",
                        width: "100%",
                      }}
                      transition={{
                        duration: 0.22,
                        ease,
                      }}
                      className="relative"
                    >
                      <TextReveal
                        as="p"
                        mode="words"
                        delay={0}
                        viewport={false}
                        className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/40 sm:text-xs"
                      >
                        Featured Project
                      </TextReveal>

                      <TransitionLink
                        href={`/project/${activeProject.id}`}
                        transitionLabel={activeProject.title}
                        direction="right"
                        className="inline-block"
                      >
                        <TextReveal
                          as="h2"
                          mode="words"
                          delay={0}
                          stagger={0.012}
                          duration={0.42}
                          viewport={false}
                          className="max-w-[980px] text-[clamp(2.8rem,4.6vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.035em] transition-opacity duration-300 hover:opacity-70"
                        >
                          {activeProject.title}
                        </TextReveal>
                      </TransitionLink>

                      <div className="mt-6 grid grid-cols-1 gap-6 pt-6 sm:grid-cols-3">
                        {activeProject.tags?.length ? (
                          <div>
                            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/35 sm:text-xs">
                              Tags
                            </p>

                            <div className="flex flex-wrap gap-x-3 gap-y-2">
                              {activeProject.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-sm uppercase tracking-[0.12em] text-white/75"
                                >
                                  {formatTag(tag)}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {activeProject.type ? (
                          <div>
                            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/35 sm:text-xs">
                              Year
                            </p>

                            <p className="text-sm uppercase tracking-[0.12em] text-white/75">
                              {activeProject.type}
                            </p>
                          </div>
                        ) : null}

                        {activeProject.tools ? (
                          <div>
                            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/35 sm:text-xs">
                              Tools
                            </p>

                            <p className="text-sm uppercase tracking-[0.12em] text-white/75">
                              {activeProject.tools}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`empty-preview-${activeTagsKey || "all"}`}
                initial={{
                  opacity: 0,
                  scale: 0.985,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  scale: 0.99,
                  filter: "blur(8px)",
                }}
                transition={{
                  duration: 0.5,
                  ease,
                }}
                className="ml-auto flex min-h-[clamp(360px,56vh,640px)] w-full max-w-[1080px] items-center justify-center border border-white/[0.07]"
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.12,
                    duration: 0.4,
                    ease,
                  }}
                  className="flex flex-col items-center px-8 text-center"
                >
                  <span className="mb-5 block h-px w-12 bg-white/25" />

                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 sm:text-xs">
                    No matching work
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </section>
  );
};

export default ProjectsTable;
