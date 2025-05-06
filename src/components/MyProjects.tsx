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
      <div className="w-[500px] h-[300px] relative">
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

      <div className="flex space-x-4 mt-10 items-center text-lg">
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
