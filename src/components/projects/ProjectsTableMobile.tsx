"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";

import PageTransitionGate from "./PageTransitionGate";
import ProjectTagFilter from "@/components/projects/ProjectsTagFilter";
import TextReveal from "@/components/TextReveal";
import TransitionLink from "../TransitionLink";

type ProjectListItem = {
  id: string;
  title: string;
  src: string;
  type: string | null;
  tools: string | null;
  tags: string[];
  createdAt?: Date;
};

interface ProjectsTableMobileProps {
  projects?: ProjectListItem[];
  children?: ReactNode;
  startIndex: number;
  availableTags?: string[];
  activeTags?: string[];
}

const revealEase = [0.22, 1, 0.36, 1] as const;

const formatTag = (tag: string) => {
  return tag.replaceAll("-", " ");
};

const ProjectsTableMobile = ({
  projects = [],
  children,
  startIndex,
  availableTags = [],
  activeTags = [],
}: ProjectsTableMobileProps) => {
  return (
    <section className="min-h-screen bg-dark pb-24 text-color">
      <PageTransitionGate className="min-h-screen">
        <div className="px-6 pt-28">
          <TextReveal
            as="h1"
            mode="words"
            viewport={false}
            delay={0.02}
            duration={0.75}
            y="90%"
            className="
              text-[7vw]
              font-black
              uppercase
              leading-[1.1]
              tracking-[-0.01em]
            "
          >
            A Selection of Projects, Practice & Collaborations{" "}
          </TextReveal>

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              delay: 0.08,
              duration: 0.65,
              ease: revealEase,
            }}
            className="relative z-30 mt-9"
          >
            <ProjectTagFilter
              availableTags={availableTags}
              activeTags={activeTags}
            />
          </motion.div>
        </div>

        {projects.length > 0 ? (
          <>
            <div className="mt-5 flex flex-col gap-16 px-6">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  number={startIndex + index + 1}
                  index={index}
                  priority={index === 0}
                />
              ))}
            </div>

            {children ? (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.18,
                  duration: 0.65,
                  ease: revealEase,
                }}
                className="mt-16 px-6 pt-8"
              >
                {children}
              </motion.div>
            ) : null}
          </>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
              filter: "blur(5px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.65,
              ease: revealEase,
            }}
            className="
              flex
              min-h-[55vh]
              flex-col
              items-center
              justify-center
              gap-5
              px-6
              text-center
            "
          >
            <p className="text-sm uppercase tracking-[0.2em] text-white/50">
              No projects found
            </p>

            {activeTags.length > 0 ? (
              <a
                href="/projects"
                className="
                  border-b
                  border-white/40
                  pb-1
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-white
                "
              >
                View all projects
              </a>
            ) : null}
          </motion.div>
        )}
      </PageTransitionGate>
    </section>
  );
};

interface ProjectCardProps {
  project: ProjectListItem;
  number: number;
  index: number;
  priority?: boolean;
}

const ProjectCard = ({
  project,
  number,
  index,
  priority = false,
}: ProjectCardProps) => {
  const cardDelay = 0.08 + Math.min(index, 4) * 0.08;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        delay: cardDelay,
        duration: 0.75,
        ease: revealEase,
      }}
      className="flex flex-col"
    >
      <TransitionLink
        href={`/project/${project.id}`}
        transitionLabel={project.title}
        className="block"
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 1.025,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            delay: cardDelay,
            duration: 0.85,
            ease: revealEase,
          }}
          className="
      w-full
      overflow-hidden
      border
      border-white/15
      bg-white/5
    "
        >
          <Image
            src={project.src}
            alt={project.title}
            width={1600}
            height={1200}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 767px) 100vw, 0px"
            className="block h-auto w-full"
          />
        </motion.div>
      </TransitionLink>

      <div className="mt-4">
        <TextReveal
          as="p"
          viewport={false}
          delay={cardDelay + 0.04}
          duration={0.55}
          y="75%"
          className="
            mb-3
            text-[10px]
            uppercase
            tracking-[0.28em]
            text-white/35
          "
        >
          {String(number).padStart(2, "0")}
        </TextReveal>

        <TransitionLink
          href={`/project/${project.id}`}
          transitionLabel={project.title}
          className="inline-block"
        >
          <TextReveal
            as="h2"
            mode="words"
            viewport={false}
            delay={cardDelay + 0.07}
            duration={0.7}
            y="85%"
            className="
              text-2xl
              font-semibold
              uppercase
              leading-[0.95]
              tracking-[-0.025em]
            "
          >
            {project.title}
          </TextReveal>
        </TransitionLink>

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: cardDelay + 0.12,
            duration: 0.6,
            ease: revealEase,
          }}
          className="
            mt-6
            flex
            items-start
            justify-between
            gap-6
            border-t
            border-white/15
            pt-4
            text-xs
            uppercase
            tracking-[0.18em]
            text-white/55
          "
        >
          <div className="flex max-w-[60%] flex-wrap gap-x-3 gap-y-1">
            {project.tags.map((tag, tagIndex) => (
              <TextReveal
                key={tag}
                as="span"
                viewport={false}
                delay={cardDelay + 0.14 + tagIndex * 0.025}
                duration={0.55}
                y="75%"
              >
                {formatTag(tag)}
              </TextReveal>
            ))}
          </div>

          {project.tools ? (
            <TextReveal
              as="span"
              viewport={false}
              delay={cardDelay + 0.16}
              duration={0.55}
              y="75%"
              className="max-w-[40%] text-right"
            >
              {project.tools}
            </TextReveal>
          ) : null}
        </motion.div>
      </div>
    </motion.article>
  );
};

export default ProjectsTableMobile;
