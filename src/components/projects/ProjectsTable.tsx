"use client";

import { Project } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectsTableProps {
  projects: Project[];
  children: ReactNode;
  startIndex: number;
}

const ProjectsTable = ({
  projects,
  children,
  startIndex,
}: ProjectsTableProps) => {
  const [hoveredProject, setHoveredProject] = useState<number>(0);

  if (!projects.length) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-dark px-7 text-color sm:px-14">
        <p className="text-sm uppercase tracking-[0.2em] text-white/50">
          No projects found
        </p>
      </div>
    );
  }

  const activeProject = projects[hoveredProject];

  return (
    <section className="min-h-screen w-full bg-dark text-color">
      <div className="mx-auto grid min-h-screen w-full max-w-[1800px] grid-cols-1 px-7 pb-10 pt-28 sm:px-14 lg:grid-cols-12 lg:gap-10 lg:px-20 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col lg:col-span-5 lg:h-[calc(100vh-7rem)] lg:pr-8 xl:col-span-4"
        >
          <div className="mb-10 shrink-0">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/45 sm:text-xs">
              Selected Work
            </p>
            <h1 className="max-w-[420px] text-4xl uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl xl:text-7xl">
              My Projects
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto border-t border-[#ecebeb]/20 pr-2">
            {projects.map((project, index) => {
              const isActive = hoveredProject === index;

              return (
                <Link
                  href={`/project/${project.id}`}
                  key={project.id}
                  onMouseEnter={() => {
                    if (hoveredProject !== index) {
                      setHoveredProject(index);
                    }
                  }}
                  onFocus={() => {
                    if (hoveredProject !== index) {
                      setHoveredProject(index);
                    }
                  }}
                  className="group flex w-full items-center justify-between gap-6 border-b border-[#ecebeb]/20 py-5 transition-opacity duration-300 hover:opacity-100"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <span
                      className={`mt-1 text-[10px] uppercase tracking-[0.22em] transition-opacity duration-300 sm:text-xs ${
                        isActive ? "opacity-100" : "opacity-35"
                      }`}
                    >
                      {String(startIndex + index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <h2
                        className={`truncate text-xl uppercase leading-none tracking-[-0.03em] transition-all duration-300 sm:text-2xl xl:text-3xl ${
                          isActive
                            ? "translate-x-2 opacity-100"
                            : "translate-x-0 opacity-75"
                        }`}
                      >
                        {project.title}
                      </h2>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`text-xs uppercase tracking-[0.18em] transition-all duration-300 sm:text-sm ${
                        isActive ? "opacity-70" : "opacity-35"
                      }`}
                    >
                      {project.role}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="shrink-0">{children}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
          viewport={{ once: true }}
          className="mt-14 flex flex-col lg:col-span-7 lg:mt-0 lg:min-h-[calc(100vh-7rem)] xl:col-span-8"
        >
          <div className="ml-auto flex w-full max-w-[820px] flex-col">
            <div className="relative overflow-hidden border border-[#ecebeb]/20">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.005 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="relative h-[38vh] w-full sm:h-[46vh] lg:h-[52vh] xl:h-[60vh]"
                >
                  <Image
                    fill
                    src={activeProject.src}
                    alt={activeProject.title}
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 60vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 border-t border-[#ecebeb]/20 pt-6">
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/40 sm:text-xs">
                Featured Project
              </p>

              <h2 className="max-w-[700px] text-3xl uppercase leading-[0.92] tracking-[-0.04em] sm:text-5xl xl:text-6xl">
                {activeProject.title}
              </h2>

              <div className="mt-8 grid grid-cols-1 gap-8 border-t border-[#ecebeb]/20 pt-6 sm:grid-cols-3">
                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                    Role
                  </p>
                  <p className="text-sm text-white/85 sm:text-base">
                    {activeProject.role}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                    Type
                  </p>
                  <p className="text-sm text-white/85 sm:text-base">
                    {activeProject.type}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                    Tools
                  </p>
                  <p className="text-sm text-white/85 sm:text-base">
                    {activeProject.tools}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsTable;
