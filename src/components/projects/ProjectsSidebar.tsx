"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

import TextReveal from "@/components/TextReveal";

import ProjectsDesktopFilter from "./ProjectsDesktopFilter";

import { useProjectsReveal } from "./ProjectsLoadingGate";

import { projectsEase } from "./projectUtils";

type ProjectsSidebarProps = {
  availableTags: string[];

  selectedTags: string[];

  totalCount: number;

  resultCount: number;

  children?: ReactNode;

  onChange: (tags: string[]) => void;

  onPopupOpenChange?: (open: boolean) => void;
};

export default function ProjectsSidebar({
  availableTags,
  selectedTags,

  totalCount,
  resultCount,

  children,

  onChange,
  onPopupOpenChange,
}: ProjectsSidebarProps) {
  const { revealStarted } = useProjectsReveal();

  return (
    <aside
      className="
        relative
        min-w-0
      "
    >
      <div
        className="
          sticky
          top-28

          flex
          h-[calc(100dvh-9rem)]
          min-h-0
          flex-col
        "
      >
        <div
          className="
            shrink-0
          "
        >
          <TextReveal
            as="h1"
            mode="lines"
            viewport={false}
            active={revealStarted}
            delay={0.14}
            stagger={0.08}
            duration={1}
            y="105%"
            rotate={1.2}
            className="
              max-w-[280px]

              font-bueno
              text-[clamp(2rem,3.1vw,4.7rem)]
              font-black

              uppercase
              leading-[0.82]
              tracking-[-0.02em]
            "
          >
            {"Selected\nWork"}
          </TextReveal>

          <motion.div
            initial={false}
            animate={{
              opacity: revealStarted ? 1 : 0,

              y: revealStarted ? 0 : 8,
            }}
            transition={{
              opacity: {
                duration: 0.75,

                delay: 0.52,

                ease: projectsEase,
              },

              y: {
                duration: 0.85,

                delay: 0.52,

                ease: projectsEase,
              },
            }}
            className="
              mt-8

              xl:mt-9
            "
          >
            {children ? (
              <div
                className="
                  mb-5
                "
              >
                {children}
              </div>
            ) : null}

            <p
              className="
                max-w-[205px]

                text-[8px]
                font-black
                uppercase
                leading-[1.5]
                tracking-[0.16em]

                text-white/25

                xl:text-[9px]
              "
            >
              Selected projects across identity, print, digital and experimental
              work.
            </p>

            <div
              className="
                mt-3

                flex
                items-center
                gap-2

                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]

                text-white/15

                xl:text-[9px]
              "
            >
              <span>Oslo</span>

              <span>/</span>

              <span>2026</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{
            opacity: revealStarted ? 1 : 0,

            y: revealStarted ? 0 : 12,
          }}
          transition={{
            opacity: {
              duration: 0.75,

              delay: 0.34,

              ease: projectsEase,
            },

            y: {
              duration: 0.9,

              delay: 0.34,

              ease: projectsEase,
            },
          }}
          className="
            mt-auto

            w-full
            max-w-[220px]

            pb-1

            xl:max-w-[235px]
          "
        >
          <ProjectsDesktopFilter
            availableTags={availableTags}
            selectedTags={selectedTags}
            totalCount={totalCount}
            resultCount={resultCount}
            onChange={onChange}
            onPopupOpenChange={onPopupOpenChange}
          />
        </motion.div>
      </div>
    </aside>
  );
}
