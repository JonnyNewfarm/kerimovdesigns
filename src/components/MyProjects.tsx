"use client";
import Image from "next/image";
import React, { useState } from "react";

import Link from "next/link";
import { Project } from "@prisma/client";
import { motion } from "framer-motion";

interface MyProjectsProps {
  projects: Project[];
}

const MyProjects = ({ projects }: MyProjectsProps) => {
  const [hoveredProject, setHoveredProject] = useState<number>(0);

  const firstRow = projects.slice(0, 3);
  const secondRow = projects.slice(3, 5);

  return (
    <div className="bg-[#242323] relative flex flex-col justify-center items-center h-screen w-full text-[#ecebeb]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{
          scale: [0.8, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
        className="md:w-[500px] md:h-[300px] w-[350px] h-[200px] relative"
      >
        <Image
          fill
          className="object-cover"
          src={projects[hoveredProject].src}
          alt={projects[hoveredProject].title}
        />
      </motion.div>
      <div className="mt-8">
        <h1 className="uppercase font-bold  text-2xl">Previous work</h1>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{
          scale: [0.8, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
        className="flex gap-x-4 mt-6 justify-center items-center text-lg "
      >
        {firstRow.map((project, index) => (
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
            {index !== firstRow.length - 1 && (
              <span className="text-[#ecebeb]">-</span>
            )}
          </React.Fragment>
        ))}
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{
          scale: [0.8, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
        className="flex gap-x-4  justify-center items-center text-lg "
      >
        {secondRow.map((project, index) => (
          <React.Fragment key={project.title}>
            <Link
              href={`/project/${project.id}`}
              className={`px-2 py-2 transition ${
                hoveredProject === index + 3
                  ? "text-[#7f7979] scale-110"
                  : "hover:text-[#ecebeb]"
              }`}
              onMouseEnter={() => setHoveredProject(index + 3)}
            >
              {project.title}
            </Link>
            {index !== secondRow.length - 1 && (
              <span className="text-[#ecebeb]">-</span>
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default MyProjects;
