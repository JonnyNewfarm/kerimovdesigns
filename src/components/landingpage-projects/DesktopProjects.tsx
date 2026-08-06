"use client";

import { useMemo } from "react";

import type { MotionValue } from "framer-motion";

import MagneticComp from "@/components/MagneticComp";
import TextReveal from "@/components/TextReveal";
import TransitionLink from "@/components/TransitionLink";

import DesktopProjectItem from "./DesktopProjectItem";

import { BASE_HEIGHT, desktopLayout } from "./projectLayouts";

import type { ProjectListItem } from "./projectTypes";

import {
  getResponsiveDesktopLeft,
  getResponsiveDesktopTop,
} from "./projectutils";

type DesktopProjectsProps = {
  projects: ProjectListItem[];
  breakpointWidth: number;
  scrollYProgress: MotionValue<number>;
  hoveredId: string | null;
  onHoverChange: (projectId: string | null) => void;
};

export default function DesktopProjects({
  projects,
  breakpointWidth,
  scrollYProgress,
  hoveredId,
  onHoverChange,
}: DesktopProjectsProps) {
  const usedLayout = desktopLayout.slice(0, projects.length);

  const sectionHeight = useMemo(() => {
    const contentHeight = Math.max(
      ...usedLayout.map((item) => {
        const resolvedTop = getResponsiveDesktopTop(item, breakpointWidth);

        const imageHeight = BASE_HEIGHT * item.scale;
        const textBlockHeight = 120;

        return resolvedTop + imageHeight + textBlockHeight;
      }),
      2200,
    );

    return contentHeight + 80;
  }, [breakpointWidth, usedLayout]);

  return (
    <div
      className="relative w-full"
      style={{
        height: sectionHeight,
      }}
    >
      <div
        className="
          absolute
          left-[12%]
          top-[-80px]
          z-30
          max-w-[760px]
          xl:left-[8%]
          xl:top-[210px]
        "
      >
        <div className="flex w-full items-end justify-end ">
          <span
            className="
              text-[18px]
              uppercase
              tracking-[0.18em]
              text-color/45
            "
          >
            06
          </span>
        </div>

        <TextReveal
          as="h2"
          mode="lines"
          delay={0.1}
          className="
            text-[clamp(40px,5.4vw,100px)]
            font-black
            uppercase
            leading-[0.82]
            tracking-[-0.045em]
            text-color
          "
        >
          Recent
        </TextReveal>

        <TextReveal
          as="h2"
          mode="lines"
          delay={0.1}
          className="
            text-[clamp(40px,5.4vw,100px)]
            font-black
            uppercase
            leading-[0.82]
            tracking-[-0.045em]
            text-color
          "
        >
          Work
        </TextReveal>
      </div>

      {projects.map((project, index) => {
        const item = desktopLayout[index % desktopLayout.length];

        const resolvedTop = getResponsiveDesktopTop(item, breakpointWidth);

        const resolvedLeft = getResponsiveDesktopLeft(item, breakpointWidth);

        return (
          <DesktopProjectItem
            key={project.id}
            project={project}
            index={index}
            left={resolvedLeft}
            top={resolvedTop}
            baseScale={item.scale}
            drift={item.drift}
            driftDirection={item.driftDirection}
            scrollYProgress={scrollYProgress}
            isActive={hoveredId === project.id}
            isDimmed={hoveredId !== null && hoveredId !== project.id}
            onHoverChange={onHoverChange}
          />
        );
      })}

      <TransitionLink
        href="/projects"
        transitionLabel="My Work"
        className="
          group
          absolute
          left-[8%]
          top-[2580px]
          z-40
          lg:top-[2950px]
          xl:top-[2580px]
        "
      >
        <MagneticComp>
          <div
            className="
              uppercase
              leading-[0.8]
              tracking-[-0.04em]
            "
          >
            <p
              className="
                flex
                items-center
                gap-x-2
                text-4xl
                text-color/70
                transition
                group-hover:text-color
              "
            >
              view —
            </p>

            <p
              className="
                text-4xl
                text-color/70
                transition
                group-hover:text-color
              "
            >
              projects
            </p>
          </div>
        </MagneticComp>
      </TransitionLink>
    </div>
  );
}
