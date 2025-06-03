"use client";
import { Project } from "@prisma/client";
import Link from "next/link";
import React, { ReactNode } from "react";

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
        <h1 className="text-3xl uppercase font-bold mt-28">My Projects</h1>
      </div>
      <div className="flex justify-center items-center">
        <div className="h-full w-full flex gap-y-10 flex-col items-center">
          {projects.map((project, index) => (
            <div key={index}>
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="w-[80vw]  flex justify-center "
              >
                <div className="w-[] h-full p-0 bg-black/60  flex justify-center items-center">
                  <img
                    alt="project-image"
                    className="object-contain"
                    src={project.src}
                  />
                </div>
              </Link>
              <div className="w-full px-10">
                <div className="p-5 w-full border-b-1 border-b-white">
                  <h1>{project.title}</h1>
                </div>
                <div className=" p-5 flex justify-between text-sm">
                  <h1>{project.role}</h1>
                  <h1>{project.tools}</h1>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTableMobile;
