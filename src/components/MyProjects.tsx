"use client";
import Image from "next/image";
import React, { useState } from "react";

import Link from "next/link";
import { Project } from "@prisma/client";

interface MyProjectsProps {
  projects: Project[];
}

const MyProjects = ({ projects }: MyProjectsProps) => {
  const [hoveredProject, setHoveredProject] = useState<number>(0);

  return (
    <div className="bg-[#242323] relative flex flex-col justify-center items-center h-screen w-full text-[#ecebeb]">
      <div className="md:w-[500px] md:h-[300px] w-[350px] h-[200px] relative">
        <Image
          fill
          className="object-cover"
          src={projects[hoveredProject].src}
          alt={projects[hoveredProject].title}
        />
      </div>
      <div className="mt-10">
        <h1 className="uppercase font-semibold text-2xl">Previous work</h1>
      </div>

      <div className="flex flex-wrap  gap-x-4 gap-y-2 mt-10 justify-center items-center text-lg font-bold uppercase">
        {projects.slice(0, 5).map((project, index) => (
          <React.Fragment key={project.title}>
            <Link
              href={`/project/${project.id}`}
              className={`px-2 py-2 transition ${
                hoveredProject === index
                  ? "text-[#7f7979] scale-110"
                  : "hover:text-[#ecebeb]"
              }`}
              onMouseEnter={() => setHoveredProject(index)}
            >
              {project.title}
            </Link>
            {index !== projects.length - 1 && (
              <span className="text-[#ecebeb]">-</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MyProjects;
