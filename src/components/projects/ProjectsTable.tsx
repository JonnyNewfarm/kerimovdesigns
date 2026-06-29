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

type ProjectListItem = {
  id: string;
  title: string;
  src: string;
  role: string | null;
  type: string | null;
  tools: string | null;
  createdAt?: Date;
  description?: string | null;
};

interface ProjectsTableProps {
  projects: ProjectListItem[];
  children?: ReactNode;
  startIndex: number;
}

const PROJECTS_PER_VIEW = 5;

const ease = [0.22, 1, 0.36, 1] as const;

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
            {/* strek */}
            <path d="M44 12H14" />

            {/* utstikker som vokser ut mot venstre */}
            <path className="pagination-text-arrow-wing" d="M14 12L24 4" />
          </>
        ) : (
          <>
            {/* strek */}
            <path d="M4 12H34" />

            {/* utstikker som vokser ut mot høyre */}
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
}: ProjectsTableProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  const queuedProjectIndex = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);
  const imageLinkRef = useRef<HTMLAnchorElement | null>(null);
  const lastPointerPosition = useRef<{ x: number; y: number } | null>(null);

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

  const totalPages = Math.max(
    Math.ceil(projects.length / PROJECTS_PER_VIEW),
    1,
  );

  const visibleProjects = useMemo(() => {
    const start = pageIndex * PROJECTS_PER_VIEW;
    const end = start + PROJECTS_PER_VIEW;

    return projects.slice(start, end);
  }, [projects, pageIndex]);

  const activeProject = projects[activeIndex];

  const canGoPrevPage = pageIndex > 0;
  const canGoNextPage = pageIndex < totalPages - 1;

  const setProjectIndex = useCallback(
    (index: number) => {
      if (!projects.length) return;

      const safeIndex = Math.min(Math.max(index, 0), projects.length - 1);

      queuedProjectIndex.current = safeIndex;

      if (animationFrame.current) return;

      animationFrame.current = window.requestAnimationFrame(() => {
        const nextIndex = queuedProjectIndex.current;

        if (nextIndex !== null) {
          setActiveIndex((currentIndex) => {
            if (currentIndex === nextIndex) return currentIndex;
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
    if (!projects.length) return;

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
    if (!canGoPrevPage) return;

    const nextPage = pageIndex - 1;
    const nextActiveIndex = nextPage * PROJECTS_PER_VIEW;

    setDirection(-1);
    setPageIndex(nextPage);
    setActiveIndex(nextActiveIndex);
  };

  const goToNextPage = () => {
    if (!canGoNextPage) return;

    const nextPage = pageIndex + 1;
    const nextActiveIndex = nextPage * PROJECTS_PER_VIEW;

    setDirection(1);
    setPageIndex(nextPage);
    setActiveIndex(nextActiveIndex);
  };

  const handleImageMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    lastPointerPosition.current = {
      x: event.clientX,
      y: event.clientY,
    };

    const rect = event.currentTarget.getBoundingClientRect();

    imageMouseX.set(event.clientX - rect.left);
    imageMouseY.set(event.clientY - rect.top);

    if (!isHoveringImage) {
      setIsHoveringImage(true);
    }
  };

  useEffect(() => {
    const checkInitialHover = (event: MouseEvent) => {
      lastPointerPosition.current = {
        x: event.clientX,
        y: event.clientY,
      };

      const element = imageLinkRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();

      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) return;

      imageMouseX.set(event.clientX - rect.left);
      imageMouseY.set(event.clientY - rect.top);
      setIsHoveringImage(true);
    };

    window.addEventListener("mousemove", checkInitialHover, { once: true });

    return () => {
      window.removeEventListener("mousemove", checkInitialHover);
    };
  }, [imageMouseX, imageMouseY]);
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

  if (!projects.length || !activeProject) {
    return (
      <section className="flex min-h-screen w-full items-center justify-center bg-dark px-7 text-color sm:px-14">
        <TextReveal
          as="p"
          mode="words"
          className="text-sm uppercase tracking-[0.2em] text-white/50"
        >
          No projects found
        </TextReveal>
      </section>
    );
  }

  return (
    <section className="w-full bg-dark text-color">
      <div className="mx-auto grid min-h-screen w-full max-w-[1800px] grid-cols-1 gap-10 px-7 pb-12 pt-28 sm:px-14 md:grid-cols-12 md:px-16 md:pt-32 lg:px-20 xl:px-24">
        <aside className="flex min-h-0 flex-col md:col-span-5 md:h-[calc(100vh-9rem)] md:pr-6 xl:col-span-4">
          <div className="mb-6 flex min-h-[calc(clamp(3rem,5vw,5.4rem)*1.76+1.5rem)] shrink-0 items-end">
            <TextReveal
              as="p"
              mode="words"
              delay={0.05}
              className=" text-[10px] font-black uppercase tracking-[0.35em] text-white/80 sm:text-xs"
            >
              Selected Work
            </TextReveal>
          </div>

          <div className="relative min-h-[390px] flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={pageIndex}
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction === 1 ? 48 : -48,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  x: direction === 1 ? -48 : 48,
                  filter: "blur(8px)",
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
                      ref={imageLinkRef}
                      key={project.id}
                      href={`/project/${project.id}`}
                      transitionLabel={project.title}
                      direction="right"
                      onMouseEnter={() => setProjectIndex(realIndex)}
                      onFocus={() => setProjectIndex(realIndex)}
                      className="group flex min-h-[78px] w-full items-center justify-between gap-6  py-5 text-left transition-opacity duration-300"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <span
                          className={`mt-1 text-[10px] uppercase tracking-[0.22em] transition-all duration-300 sm:text-xs ${
                            isActive ? "text-white opacity-100" : "opacity-35"
                          }`}
                        >
                          {String(startIndex + realIndex + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0">
                          <h2
                            className={`truncate uppercase font-black leading-none tracking-[-0.045em] transition-all duration-500 ${
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
            </AnimatePresence>
          </div>

          <div className="mt-6 flex shrink-0 items-center justify-between  pt-5">
            <div className="flex flex-col 2xl:flex-row pr-5 items-center justify-between w-full">
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
                  className={`group inline-flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.25em] transition-opacity sm:text-md xl:text-xl duration-300 2l:text-xl ${
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
          </div>

          {children ? <div className="mt-8 shrink-0">{children}</div> : null}
        </aside>

        <main className="flex min-h-0 flex-col md:col-span-7 xl:col-span-8">
          <div className="ml-auto flex w-full max-w-[1080px] flex-col">
            <MagneticComp>
              <TransitionLink
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
                    opacity: { duration: 0.2, ease: "easeOut" },
                    scale: { duration: 0.35, ease },
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
                    {activeProject.role ? (
                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/35 sm:text-xs">
                          Role
                        </p>
                        <p className="text-sm uppercase tracking-[0.12em] text-white/75">
                          {activeProject.role}
                        </p>
                      </div>
                    ) : null}

                    {activeProject.type ? (
                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/35 sm:text-xs">
                          Type
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
                  </div>{" "}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default ProjectsTable;
