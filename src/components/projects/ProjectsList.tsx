"use client";

import { AnimatePresence, motion } from "framer-motion";

import TransitionLink from "@/components/TransitionLink";

import type { ProjectListItem } from "./projectsTypes";
import { PROJECTS_PER_VIEW, projectsEase } from "./projectUtils";
import TextReveal from "../TextReveal";

type ProjectsListProps = {
  projects: ProjectListItem[];
  activeIndex: number;
  pageIndex: number;
  startIndex: number;
  direction: 1 | -1;
  activeTagsKey: string;
  hasProjects: boolean;
  onSelectProject: (index: number) => void;
};

export default function ProjectsList({
  projects,
  activeIndex,
  pageIndex,
  startIndex,
  direction,
  activeTagsKey,
  hasProjects,
  onSelectProject,
}: ProjectsListProps) {
  return (
    <div className="relative min-h-[390px] flex-1 overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        {hasProjects ? (
          <motion.div
            key={`projects-${activeTagsKey || "all"}-${pageIndex}`}
            custom={direction}
            initial={{
              opacity: 0,
              y: 14,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -10,
              filter: "blur(3px)",
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0"
          >
            {projects.map((project, index) => {
              const realIndex = pageIndex * PROJECTS_PER_VIEW + index;

              const isActive = activeIndex === realIndex;

              return (
                <TransitionLink
                  key={project.id}
                  href={`/project/${project.id}`}
                  transitionLabel={project.title}
                  onFocus={() => {
                    onSelectProject(realIndex);
                  }}
                  className="
              group
              inline-flex
              min-h-[78px]
              w-fit
              items-center
              py-5
              text-left
              transition-opacity
              duration-300
            "
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <span
                      className={`
                  mt-1
                  text-[10px]
                  uppercase
                  tracking-[0.22em]
                  transition-all
                  duration-300
                  sm:text-xs
                  ${isActive ? "text-white opacity-100" : "opacity-35"}
                `}
                    >
                      <TextReveal
                        key={`${project.id}-${pageIndex}-${activeTagsKey}-number`}
                        as="span"
                        viewport={false}
                        delay={0.08 + index * 0.055}
                        duration={0.55}
                        y="75%"
                      >
                        {String(startIndex + realIndex + 1).padStart(2, "0")}
                      </TextReveal>
                    </span>

                    <div className="min-w-0">
                      <h2
                        onMouseEnter={() => {
                          onSelectProject(realIndex);
                        }}
                        className={`
                    w-fit
                    max-w-full
                    truncate
                    font-black
                    uppercase
                    leading-none
                    tracking-[-0.045em]
                    transition-all
                    duration-500
                    ${
                      isActive
                        ? "translate-x-3 text-[clamp(1.75rem,2.1vw,2.65rem)] text-white opacity-100"
                        : "translate-x-0 text-[clamp(1.45rem,1.75vw,2.15rem)] text-white/45 opacity-80"
                    }
                  `}
                      >
                        <TextReveal
                          key={`${project.id}-${pageIndex}-${activeTagsKey}-title`}
                          as="span"
                          viewport={false}
                          delay={0.1 + index * 0.055}
                          duration={0.7}
                          y="85%"
                        >
                          {project.title}
                        </TextReveal>
                      </h2>
                    </div>
                  </div>
                </TransitionLink>
              );
            })}
          </motion.div>
        ) : (
          <EmptyProjectsList activeTagsKey={activeTagsKey} />
        )}
      </AnimatePresence>
    </div>
  );
}

type EmptyProjectsListProps = {
  activeTagsKey: string;
};

function EmptyProjectsList({ activeTagsKey }: EmptyProjectsListProps) {
  return (
    <motion.div
      key={`empty-${activeTagsKey || "all"}`}
      initial={{
        opacity: 0,
        y: 24,
        filter: "blur(8px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: -16,
        filter: "blur(6px)",
      }}
      transition={{
        duration: 0.48,
        ease: projectsEase,
      }}
      className="
        absolute
        inset-0
        flex
        flex-col
        justify-center
        pb-16
      "
    >
      <motion.div
        initial={{
          scaleX: 0,
          opacity: 0,
        }}
        animate={{
          scaleX: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.08,
          ease: projectsEase,
        }}
        className="
          mb-7
          h-px
          w-full
          origin-left
          bg-white/15
        "
      />

      <motion.p
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.14,
          ease: projectsEase,
        }}
        className="
          max-w-[420px]
          text-[clamp(1.8rem,3vw,3.4rem)]
          font-black
          uppercase
          leading-[0.95]
          tracking-[-0.04em]
          text-white
        "
      >
        No projects found
      </motion.p>

      <motion.p
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.2,
          ease: projectsEase,
        }}
        className="
          mt-4
          max-w-[360px]
          text-[10px]
          uppercase
          leading-relaxed
          tracking-[0.2em]
          text-white/70
          sm:text-xs
        "
      >
        Try removing one of the selected tags
      </motion.p>
    </motion.div>
  );
}
