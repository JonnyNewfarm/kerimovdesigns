"use client";
import Image from "next/image";
import React, { useState } from "react";
import project1 from "../../public/projects/project1.jpg";
import project2 from "../../public/projects/project2.jpg";
import project3 from "../../public/projects/project3.jpg";
import project4 from "../../public/projects/project4.jpg";
import Link from "next/link";

const MyProjects = () => {
  const [hoveredProject, setHoveredProject] = useState<number>(0); // Set default to 0 (first project)

  const projects = [
    {
      title: "Project 1",
      src: project1,
    },
    {
      title: "Project 2",
      src: project2,
    },
    {
      title: "Project 3",
      src: project3,
    },
    {
      title: "Project 4",
      src: project4,
    },
  ];

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

      <div className="flex space-x-4 mt-10">
        {projects.map((project, index) => (
          <Link
            href={""}
            key={project.title}
            className="px-4 py-2 hover:bg-[#555] transition"
            onMouseEnter={() => setHoveredProject(index)}
          >
            {project.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyProjects;
