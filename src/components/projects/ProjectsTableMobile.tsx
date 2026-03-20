"use client";

import { Project } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useState } from "react";

interface ProjectsTableMobileProps {
  projects: Project[];
  children: ReactNode;
  startIndex: number;
}

const ProjectsTableMobile = ({
  projects,
  children,
  startIndex,
}: ProjectsTableMobileProps) => {
  if (!projects.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark text-color">
        No projects
      </div>
    );
  }

  return (
    <section className="bg-dark pb-24 text-color">
      <div className="px-6 pt-28">
        <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-white/40">
          Selected Work
        </p>

        <h1 className="text-4xl uppercase leading-[0.95] tracking-[-0.04em]">
          My Projects
        </h1>
      </div>

      <div className="mt-12 flex flex-col gap-16 px-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            number={startIndex + index + 1}
          />
        ))}
      </div>

      <div className="mt-16 border-t border-white/15 px-6 pt-8">{children}</div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  number: number;
}

const ProjectCard = ({ project, number }: ProjectCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <article className="flex flex-col">
      <Link href={`/project/${project.id}`} className="block">
        <div className="relative h-[240px] w-full overflow-hidden border border-white/15">
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 animate-pulse bg-white/5" />
          )}

          <Image
            src={project.src}
            alt={project.title}
            fill
            className={`object-cover transition-opacity duration-700 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoadingComplete={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />

          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm uppercase tracking-[0.2em]">
              Image error
            </div>
          )}
        </div>
      </Link>

      <div className="mt-6 border-t border-white/15 pt-6">
        <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/35">
          {String(number).padStart(2, "0")}
        </p>

        <h2 className="text-2xl uppercase leading-[0.95] tracking-[-0.04em]">
          {project.title}
        </h2>

        <div className="mt-6 flex justify-between border-t border-white/15 pt-4 text-xs uppercase tracking-[0.18em] text-white/55">
          <span>{project.role}</span>
          <span className="max-w-[45%] text-right truncate">
            {project.tools}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProjectsTableMobile;
