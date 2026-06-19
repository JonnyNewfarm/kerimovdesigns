import Image from "next/image";
import React, { ReactNode } from "react";
import TransitionLink from "../TransitionLink";

type ProjectListItem = {
  id: string;
  title: string;
  src: string;
  role: string | null;
  type: string | null;
  tools: string | null;
  createdAt?: Date;
};

interface ProjectsTableMobileProps {
  projects: ProjectListItem[];
  children?: ReactNode;
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
        <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/40">
          Selected Work
        </p>

        <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em]">
          My Projects
        </h1>
      </div>

      <div className="mt-12 flex flex-col gap-16 px-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            number={startIndex + index + 1}
            priority={index === 0}
          />
        ))}
      </div>

      {children ? <div className="mt-16 px-6 pt-8">{children}</div> : null}
    </section>
  );
};

interface ProjectCardProps {
  project: ProjectListItem;
  number: number;
  priority?: boolean;
}

const ProjectCard = ({
  project,
  number,
  priority = false,
}: ProjectCardProps) => {
  return (
    <article className="flex flex-col">
      <TransitionLink
        href={`/project/${project.id}`}
        direction="left"
        transitionLabel={project.title}
        className="block"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/15 bg-white/5">
          <Image
            src={project.src}
            alt={project.title}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 767px) 100vw, 0px"
            className="object-cover"
          />
        </div>
      </TransitionLink>

      <div className="mt-4">
        <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/35">
          {String(number).padStart(2, "0")}
        </p>

        <h2 className="text-2xl uppercase leading-[0.95] tracking-[-0.04em]">
          {project.title}
        </h2>

        <div className="mt-6 flex justify-between border-t border-white/15 pt-4 text-xs uppercase tracking-[0.18em] text-white/55">
          <span>{project.role ?? ""}</span>

          <span className="max-w-[45%] truncate text-right">
            {project.tools ?? ""}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProjectsTableMobile;
