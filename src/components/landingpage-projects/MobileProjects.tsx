"use client";

import { useEffect, useState } from "react";

import MagneticComp from "@/components/MagneticComp";
import TransitionLink from "@/components/TransitionLink";

import MobileProjectItem from "./MobileProjectItem";

import { mobileLayout } from "./projectLayouts";

import type { ProjectListItem } from "./projectTypes";

type MobileProjectsProps = {
  projects: ProjectListItem[];
};

export default function MobileProjects({ projects }: MobileProjectsProps) {
  const [isSm, setIsSm] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    const updateBreakpoint = () => {
      setIsSm(mediaQuery.matches);
    };

    updateBreakpoint();

    mediaQuery.addEventListener("change", updateBreakpoint);

    return () => {
      mediaQuery.removeEventListener("change", updateBreakpoint);
    };
  }, []);

  return (
    <section
      className="
        relative
        mx-auto
        w-full
        overflow-hidden
        px-4
        sm:px-7
      "
    >
      <header className="relative w-fit">
        <span
          className="
            absolute
            bottom-full
            right-0
            mb-2
            text-[10px]
            tracking-[0.12em]
            text-color/50
          "
        >
          {String(projects.length).padStart(2, "0")}
        </span>

        <h2
          className="
            text-4xl
            sm:text-5xl            
            font-black
            uppercase
            leading-[0.78]
            tracking-[-0.075em]
            text-color/80
          "
        >
          Recent
          <br />
          Work
        </h2>
      </header>

      <div className="mt-8 flex flex-col gap-y-20">
        {projects.map((project, index) => {
          const item = mobileLayout[index];

          if (!item) {
            return null;
          }

          const scale =
            isSm && item.scaleSm !== undefined ? item.scaleSm : item.scale;

          return (
            <MobileProjectItem
              key={project.id}
              project={project}
              index={index}
              align={item.align}
              baseScale={scale}
              offsetX={item.offsetX ?? 0}
            />
          );
        })}
      </div>

      <TransitionLink
        href="/projects"
        transitionLabel="My work"
        className="
          group
          mt-20
          inline-block
          pb-8
        "
      >
        <MagneticComp>
          <div
            className="
              text-4xl
              uppercase
              leading-[0.95]
              tracking-[-0.04em]
              text-color/70
              transition-colors
              group-hover:text-color
            "
          >
            <p>View —</p>
            <p>Projects</p>
          </div>
        </MagneticComp>
      </TransitionLink>
    </section>
  );
}
