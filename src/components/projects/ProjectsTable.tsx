"use client";
import { Project } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface ProjectsTableProps {
  projects: Project[];
  children: ReactNode;
}

const ProjectsTable = ({ projects, children }: ProjectsTableProps) => {
  const [hoveredProject, setHoveredProject] = useState<number>(0);

  return (
    <div className="w-full h-screen flex flex-row-reverse justify-between">
      {/* Image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{
          scale: [0.8, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 0.7,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
        className="lg:w-[60vw] md:w-[40vw] lg:h-[60vh] md:h-[40vh] relative"
      >
        <Image
          fill
          className="object-contain"
          src={projects[hoveredProject].src}
          alt={projects[hoveredProject].title}
        />
      </motion.div>

      {/* Project List */}
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
        className="md:w-[60vw] lg:w-[40vw] h-screen flex flex-col p-14"
      >
        <h1 className="mb-5 ml-2.5 uppercase font-bold text-3xl">
          My Projects
        </h1>

        {/* Project Links */}
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {projects.map((project, index) => (
            <Link
              href={`/project/${project.id}`}
              key={project.id}
              className="border-t-1 w-full py-6 px-2 border-[#ecebeb] text-color flex justify-between items-center"
              onMouseEnter={() => setHoveredProject(index)}
            >
              <h1
                className={`transition-transform duration-200 ${
                  hoveredProject === index
                    ? "scale-110 opacity-70"
                    : "scale-100"
                }`}
              >
                {project.title}
              </h1>
              <h1
                className={`transition-transform duration-200 ${
                  hoveredProject === index
                    ? "scale-110 opacity-70"
                    : "scale-100"
                }`}
              >
                {project.role}
              </h1>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-start mt-5">{children}</div>
      </motion.div>
    </div>
  );
};

export default ProjectsTable;
