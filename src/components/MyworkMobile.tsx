"use client";
import { Project } from "@prisma/client";
import Link from "next/link";
import React from "react";

interface ProjectsTableMobileProps {
  projects: Project[];
}

const ProjectsTableMobile = ({ projects }: ProjectsTableMobileProps) => {
  return (
    <div className="flex flex-col pb-16">
      <div className="h-[35vh] flex items-center justify-center">
        <h1 className="text-3xl mt-20 font-semibold uppercase">
          Previous work
        </h1>
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
                <div className="h-full  bg-[#0d0d0d]  flex justify-center items-center">
                  <img
                    alt="project-image"
                    className="object-contain"
                    src={project.src}
                  />
                </div>
              </Link>
              <div className="w-full ">
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

          <Link
            className="border-2 font-semibold uppercase border-white py-2 px-4"
            href={"/projects"}
          >
            All projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTableMobile;
