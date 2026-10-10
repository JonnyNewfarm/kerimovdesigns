"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import TextReveal from "@/components/TextReveal";

import PageTransitionGate from "./PageTransitionGate";
import ProjectsDesktopFilter from "./ProjectsDesktopFilter";
import ProjectsGridCard from "./ProjectsGridCard";
import { useProjectsReveal } from "./ProjectsLoadingGate";

import type { PointerState, SharedPointerRef } from "./projectPreviewTypes";
import type { ProjectsTableProps } from "./projectsTypes";

import { projectsEase } from "./projectUtils";

const EMPTY_STATE_DELAY = 260;

export default function ProjectsTable({
  projects,
  children,
  availableTags = [],
  activeTags = [],
}: ProjectsTableProps) {
  const { revealStarted } = useProjectsReveal();

  const [selectedTags, setSelectedTags] = useState<string[]>(activeTags);

  const [showEmptyState, setShowEmptyState] = useState(false);

  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setSelectedTags(activeTags);
  }, [activeTags]);

  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) {
      return projects;
    }

    return projects.filter((project) => {
      const tags = Array.isArray(project.tags) ? project.tags : [];

      return selectedTags.every((tag) => tags.includes(tag));
    });
  }, [projects, selectedTags]);

  const handleFilterChange = (nextTags: string[]) => {
    setSelectedTags(nextTags);
  };

  useEffect(() => {
    if (filteredProjects.length > 0) {
      setShowEmptyState(false);

      return;
    }

    const timeout = window.setTimeout(() => {
      setShowEmptyState(true);
    }, EMPTY_STATE_DELAY);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [filteredProjects.length]);

  const handleViewAllWork = () => {
    setSelectedTags([]);

    const params = new URLSearchParams(window.location.search);

    params.delete("page");
    params.delete("tag");
    params.delete("tags");

    const query = params.toString();

    const nextUrl =
      query.length > 0
        ? `${window.location.pathname}?${query}`
        : window.location.pathname;

    window.history.pushState(null, "", nextUrl);
  };

  const activeIds = useMemo(() => {
    return new Set(filteredProjects.map((project) => project.id));
  }, [filteredProjects]);

  const activeOrderById = useMemo(() => {
    return new Map(
      filteredProjects.map((project, index) => [project.id, index]),
    );
  }, [filteredProjects]);

  const projectNumberById = useMemo(() => {
    return new Map(projects.map((project, index) => [project.id, index + 1]));
  }, [projects]);

  const sharedPointerRef = pointerRef as SharedPointerRef;

  return (
    <section
      className="
        min-h-screen
        w-full
        bg-dark
        text-color
      "
    >
      <PageTransitionGate className="min-h-screen">
        <div
          className="
            mx-auto
            grid
            min-h-screen
            w-full
            max-w-[1900px]

            grid-cols-1

            px-7
            pb-20
            pt-28

            sm:px-8

            md:pt-32

            lg:grid-cols-[220px_minmax(0,1fr)]
            lg:gap-x-8
            lg:px-8

            xl:grid-cols-[250px_minmax(0,1fr)]
            xl:gap-x-10
            xl:px-12

            2xl:grid-cols-[290px_minmax(0,1fr)]
            2xl:gap-x-14
            2xl:px-16
          "
        >
          <aside
            className="
              relative
              min-w-0
            "
          >
            <div
              className="
                sticky
                top-28

                flex
                h-[calc(100dvh-9rem)]
                min-h-0
                flex-col
              "
            >
              <div
                className="
                  flex
                  min-h-0
                  flex-1
                  items-center
                "
              >
                <motion.div
                  initial={false}
                  animate={{
                    opacity: revealStarted ? 1 : 0,
                    y: revealStarted ? 0 : 12,
                  }}
                  transition={{
                    opacity: {
                      duration: 0.8,
                      delay: 0.2,
                      ease: projectsEase,
                    },

                    y: {
                      duration: 0.95,
                      delay: 0.2,
                      ease: projectsEase,
                    },
                  }}
                  className="
                    -translate-y-[2vh]
                  "
                >
                  {children ? <div className="mb-6">{children}</div> : null}

                  <TextReveal
                    as="p"
                    mode="lines"
                    viewport={false}
                    active={revealStarted}
                    delay={0.2}
                    stagger={0.075}
                    duration={0.95}
                    y="105%"
                    rotate={0.8}
                    className="
                      font-bueno

                      text-[clamp(1.3rem,1.55vw,1.75rem)]
                      font-black

                      uppercase
                      leading-[0.92]
                      tracking-[-0.018em]

                      text-color

                      2xl:text-[clamp(1.4rem,1.5vw,1.9rem)]
                    "
                  >
                    {
                      "Selected projects\nacross identity,\nprint, digital and\nexperimental work."
                    }
                  </TextReveal>
                </motion.div>
              </div>

              <motion.div
                initial={false}
                animate={{
                  opacity: revealStarted ? 1 : 0,
                  y: revealStarted ? 0 : 10,
                }}
                transition={{
                  opacity: {
                    duration: 0.75,
                    delay: 0.42,
                    ease: projectsEase,
                  },

                  y: {
                    duration: 0.85,
                    delay: 0.42,
                    ease: projectsEase,
                  },
                }}
                className="
                  w-full
                  max-w-[220px]
                  shrink-0

                  pb-10

                  xl:max-w-[235px]
                  xl:pb-12

                  2xl:pb-14
                "
              >
                <ProjectsDesktopFilter
                  availableTags={availableTags}
                  selectedTags={selectedTags}
                  totalCount={projects.length}
                  resultCount={filteredProjects.length}
                  onChange={handleFilterChange}
                />
              </motion.div>
            </div>
          </aside>

          <main
            ref={mainRef}
            className="
              relative
              min-w-0
            "
          >
            <motion.div
              initial={false}
              animate={{
                opacity: revealStarted ? 1 : 0,
                y: revealStarted ? 0 : 7,
              }}
              transition={{
                opacity: {
                  duration: 0.7,
                  delay: 0.28,
                  ease: projectsEase,
                },

                y: {
                  duration: 0.8,
                  delay: 0.28,
                  ease: projectsEase,
                },
              }}
              className="
                mb-4

                flex
                items-center
                gap-2

                text-[9px]
                font-black
                uppercase
                tracking-[0.24em]

                text-white/75

                xl:text-[10px]
              "
            >
              <motion.span
                key={filteredProjects.length}
                initial={{
                  opacity: 0,
                  y: 4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.38,
                  ease: projectsEase,
                }}
              >
                {String(filteredProjects.length).padStart(2, "0")}
              </motion.span>

              <span>/</span>

              <span>{String(projects.length).padStart(2, "0")}</span>

              <span className="ml-1">Projects</span>
            </motion.div>

            <LayoutGroup id="projects-grid">
              <motion.div
                layout
                transition={{
                  layout: {
                    duration: 0.78,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                className="
                  grid
                  grid-cols-3

                  gap-x-3
                  gap-y-10

                  xl:gap-x-4
                  xl:gap-y-12

                  2xl:gap-x-5
                  2xl:gap-y-14
                "
              >
                {projects.map((project, index) => {
                  const active = activeIds.has(project.id);

                  return (
                    <ProjectsGridCard
                      key={project.id}
                      project={project}
                      index={index}
                      projectNumber={
                        projectNumberById.get(project.id) ?? index + 1
                      }
                      pointerRef={sharedPointerRef}
                      active={active}
                      activeOrder={
                        activeOrderById.get(project.id) ??
                        projects.length + index
                      }
                    />
                  );
                })}
              </motion.div>
            </LayoutGroup>

            {showEmptyState ? (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: projectsEase,
                }}
                className="
                  w-full

                  pt-[8vh]

                  xl:pt-[9vh]
                  2xl:pt-[10vh]
                "
              >
                <div
                  className="
                    max-w-[680px]
                  "
                >
                  <TextReveal
                    as="h2"
                    mode="lines"
                    viewport={false}
                    active={showEmptyState}
                    delay={0.02}
                    stagger={0.075}
                    duration={0.95}
                    y="108%"
                    rotate={1}
                    className="
                      font-bueno

                      text-[clamp(3.2rem,5.4vw,6.4rem)]
                      font-black

                      uppercase
                      leading-[0.78]
                      tracking-[-0.035em]

                      text-white
                    "
                  >
                    {"No\nmatch"}
                  </TextReveal>

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.75,
                      delay: 0.17,
                      ease: projectsEase,
                    }}
                    className="
                      mt-8

                      flex
                      flex-col
                      items-start
                    "
                  >
                    <p
                      className="
                        max-w-[290px]

                        text-[9px]
                        font-black
                        uppercase
                        leading-[1.55]
                        tracking-[0.17em]

                        text-white/30

                        xl:text-[10px]
                      "
                    >
                      No projects match this combination. Try another filter or
                      view all work.
                    </p>

                    <motion.button
                      type="button"
                      onClick={handleViewAllWork}
                      whileHover={{
                        x: 5,
                      }}
                      transition={{
                        duration: 0.4,
                        ease: projectsEase,
                      }}
                      className="
                        group

                        mt-7

                        flex
                        cursor-pointer
                        items-center
                        gap-3

                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.2em]

                        text-white/45

                        transition-colors
                        duration-300

                        hover:text-white

                        xl:text-[10px]
                      "
                    >
                      <span>View all work</span>

                      <span
                        className="
                          block
                          h-px
                          w-5

                          bg-white/30

                          transition-all
                          duration-500

                          group-hover:w-8
                          group-hover:bg-white
                        "
                      />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </main>
        </div>
      </PageTransitionGate>
    </section>
  );
}
