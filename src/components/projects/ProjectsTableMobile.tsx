"use client";
import { Project } from "@prisma/client";
import Link from "next/link";
import React, { ReactNode, useState } from "react";

interface ProjectsTableMobileProps {
  projects: Project[];
  children: ReactNode;
}

const ProjectsTableMobile = ({
  projects,
  children,
}: ProjectsTableMobileProps) => {
  return (
    <div className="flex flex-col bg-bg-dark pb-20">
      <div className="h-[35vh] flex items-center justify-center">
        <h1 className="text-3xl uppercase font-bold mt-20">My Projects</h1>
      </div>
      <div className="flex justify-center items-center">
        <div className="h-full w-full flex gap-y-10 flex-col items-center">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}

          <div className="flex justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-[80vw] flex flex-col items-center">
      <Link
        href={`/project/${project.id}`}
        className="w-full flex justify-center"
      >
        <div className="h-[200px] w-full bg-black/60 flex justify-center items-center relative">
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 animate-pulse bg-[#21271cc9]"></div>
          )}
          <img
            alt="project-image"
            src={project.src}
            className={`object-contain transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
              Image failed to load
            </div>
          )}
        </div>
      </Link>
      <div className="w-full">
        <div className="p-5 w-full border-b border-white">
          <h1>{project.title}</h1>
        </div>
        <div className="p-5 flex justify-between text-sm">
          <h1>{project.role}</h1>
          <h1>{project.tools}</h1>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTableMobile;
