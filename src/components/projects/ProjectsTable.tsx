"use client";

import { Project } from "@prisma/client";
import Link from "next/link";
import React, { ReactNode, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WaveImage from "@/components/projects/WaveImage";
import WaveLinkText from "../WaveLink";

interface ProjectsTableProps {
  projects: Project[];
  children?: ReactNode;
  startIndex: number;
}

const PROJECTS_PER_VIEW = 5;

const ProjectsTable = ({
  projects,
  children,
  startIndex,
}: ProjectsTableProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_VIEW);

  const visibleProjects = useMemo(() => {
    const start = pageIndex * PROJECTS_PER_VIEW;
    const end = start + PROJECTS_PER_VIEW;

    return projects.slice(start, end);
  }, [projects, pageIndex]);

  const activeProject = projects[activeIndex];

  const nearbyImages = useMemo(() => {
    return [
      projects[activeIndex - 1]?.src,
      activeProject?.src,
      projects[activeIndex + 1]?.src,
    ].filter(Boolean) as string[];
  }, [projects, activeIndex, activeProject?.src]);

  const canGoPrevPage = pageIndex > 0;
  const canGoNextPage = pageIndex < totalPages - 1;

  const setProjectIndex = (index: number) => {
    if (!projects.length) return;

    const safeIndex = Math.min(Math.max(index, 0), projects.length - 1);
    setActiveIndex(safeIndex);
  };

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

  if (!projects.length || !activeProject) {
    return (
      <section className="flex min-h-screen w-full items-center justify-center bg-dark px-7 text-color sm:px-14">
        <p className="text-sm uppercase tracking-[0.2em] text-white/50">
          No projects found
        </p>
      </section>
    );
  }

  return (
    <section className="w-full bg-dark text-color">
      <div className="mx-auto grid min-h-screen w-full max-w-[1800px] grid-cols-1 gap-10 px-7 pb-12 pt-28 sm:px-14 md:grid-cols-12 md:px-16 md:pt-32 lg:px-20 xl:px-24">
        <aside className="flex min-h-0 flex-col md:col-span-5 md:h-[calc(100vh-9rem)] md:pr-6 xl:col-span-4">
          <div className="mb-8 flex min-h-[calc(clamp(3rem,5vw,5.4rem)*1.76+1.5rem)] shrink-0 items-end">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              viewport={{ once: true }}
              className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/80 font-black sm:text-xs"
            >
              Selected Work
            </motion.p>
          </div>

          <div className="relative min-h-[390px] flex-1 overflow-hidden border-t border-[#ecebeb]/20">
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
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0"
              >
                {visibleProjects.map((project, index) => {
                  const realIndex = pageIndex * PROJECTS_PER_VIEW + index;
                  const isActive = activeIndex === realIndex;

                  return (
                    <Link
                      key={project.id}
                      href={`/project/${project.id}`}
                      onMouseEnter={() => setProjectIndex(realIndex)}
                      onFocus={() => setProjectIndex(realIndex)}
                      className="group flex min-h-[78px] w-full items-center justify-between gap-6 border-b border-[#ecebeb]/20 py-5 text-left transition-opacity duration-300"
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
                            className={`truncate uppercase leading-none tracking-[-0.045em] transition-all duration-500 ${
                              isActive
                                ? "translate-x-3 text-[clamp(1.75rem,2.1vw,2.65rem)] text-white opacity-100"
                                : "translate-x-0 text-[clamp(1.45rem,1.75vw,2.15rem)] text-white/45 opacity-80"
                            }`}
                          >
                            {project.title}
                          </h2>
                        </div>
                      </div>

                      <p
                        className={`hidden shrink-0 text-right text-xs uppercase tracking-[0.22em] transition-all duration-300 lg:block ${
                          isActive ? "opacity-70" : "opacity-25"
                        }`}
                      >
                        {project.role}
                      </p>
                    </Link>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex shrink-0 items-center justify-between border-t border-[#ecebeb]/20 pt-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 sm:text-xs">
              Browse projects
            </p>

            <div className="flex items-center gap-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 sm:text-xs">
                {String(pageIndex + 1).padStart(2, "0")} /{" "}
                {String(totalPages).padStart(2, "0")}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={goToPrevPage}
                  disabled={!canGoPrevPage}
                  aria-label="Previous projects"
                  className={`group relative cursor-pointer flex h-9 w-9 items-center justify-center text-lg leading-none ${
                    canGoPrevPage
                      ? "text-white"
                      : "cursor-not-allowed text-white/20 opacity-40"
                  }`}
                >
                  <span className="absolute left-0 top-0 h-px w-full origin-right scale-x-100 bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-0" />
                  <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-0" />
                  <span className="absolute left-0 top-0 h-full w-px origin-bottom scale-y-100 bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-0" />
                  <span className="absolute right-0 top-0 h-full w-px origin-top scale-y-100 bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-0" />

                  <span className="relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1">
                    ←
                  </span>
                </button>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={!canGoNextPage}
                  aria-label="Next projects"
                  className={`group relative cursor-pointer flex h-9 w-9 items-center justify-center text-lg leading-none ${
                    canGoNextPage
                      ? "text-white"
                      : "cursor-not-allowed text-white/20 opacity-40"
                  }`}
                >
                  <span className="absolute left-0 top-0 h-px w-full origin-left scale-x-100 bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-0" />
                  <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-100 bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-0" />
                  <span className="absolute left-0 top-0 h-full w-px origin-top scale-y-100 bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-0" />
                  <span className="absolute right-0 top-0 h-full w-px origin-bottom scale-y-100 bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-0" />

                  <span className="relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>

          {children ? <div className="mt-8 shrink-0">{children}</div> : null}
        </aside>

        <main className="flex min-h-0 flex-col md:col-span-7 xl:col-span-8">
          <div className="ml-auto flex w-full max-w-[1080px] flex-col">
            <Link
              href={`/project/${activeProject.id}`}
              className="relative z-10 block h-[clamp(360px,56vh,640px)] w-full shrink-0 cursor-pointer"
              aria-label={`Open project ${activeProject.title}`}
            >
              <div className="absolute inset-0 z-10 overflow-visible">
                <WaveImage
                  src={activeProject.src}
                  allSrcs={nearbyImages}
                  amplitude={0.035}
                  waveLength={5}
                  speed={0.032}
                  segments={16}
                />
              </div>
            </Link>

            <div className="mt-7 min-h-0  pt-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{
                    opacity: 0,
                    y: 18,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -14,
                    filter: "blur(8px)",
                  }}
                  transition={{
                    duration: 0.34,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/40 sm:text-xs">
                    Featured Project
                  </p>

                  <Link href={`/project/${activeProject.id}`}>
                    <h2 className="max-w-[980px] text-[clamp(2.8rem,4.6vw,5.8rem)] uppercase leading-[0.88] tracking-[-0.055em] transition-opacity duration-300 hover:opacity-70">
                      {activeProject.title}
                    </h2>
                  </Link>

                  <div className="mt-6 grid grid-cols-1 gap-6 border-t border-[#ecebeb]/20 pt-6 sm:grid-cols-3">
                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                        Role
                      </p>
                      <p className="text-sm text-white/90 sm:text-base">
                        {activeProject.role}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                        Type
                      </p>
                      <p className="text-sm text-white/90 sm:text-base">
                        {activeProject.type}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                        Tools
                      </p>
                      <p className="text-sm text-white/90 sm:text-base">
                        {activeProject.tools}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/project/${activeProject.id}`}
                    className="mt-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/80 font-black transition-opacity duration-300 hover:opacity-60 sm:text-xs"
                  >
                    <WaveLinkText text="Open Project" />
                  </Link>
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
