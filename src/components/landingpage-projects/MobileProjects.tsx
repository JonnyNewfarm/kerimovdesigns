"use client";

import { useMemo } from "react";

import type { MotionValue } from "framer-motion";

import MagneticComp from "@/components/MagneticComp";
import TransitionLink from "@/components/TransitionLink";

import MobileProjectItem from "./MobileProjectItem";

import { MOBILE_CONTAINER_MAX_WIDTH, mobileLayout } from "./projectLayouts";

import type { ProjectListItem } from "./projectTypes";

import {
  getMobileCardHeight,
  getResponsiveMobileLeft,
  getResponsiveMobileScale,
  getResponsiveMobileTop,
} from "./projectutils";

type MobileProjectsProps = {
  projects: ProjectListItem[];
  breakpointWidth: number;
  scrollYProgress: MotionValue<number>;
};

export default function MobileProjects({
  projects,
  breakpointWidth,
  scrollYProgress,
}: MobileProjectsProps) {
  const usedLayout = mobileLayout.slice(0, projects.length);

  const sectionHeight = useMemo(() => {
    const contentHeight = Math.max(
      ...usedLayout.map((item) => {
        const resolvedTop = getResponsiveMobileTop(item, breakpointWidth);

        const resolvedScale = getResponsiveMobileScale(item, breakpointWidth);

        const imageHeight = getMobileCardHeight(resolvedScale);

        const textBlockHeight = 110;

        return resolvedTop + imageHeight + textBlockHeight;
      }),
      1700,
    );

    return contentHeight + 60;
  }, [breakpointWidth, usedLayout]);

  return (
    <div
      className="relative w-full"
      style={{
        maxWidth: MOBILE_CONTAINER_MAX_WIDTH,
        height: sectionHeight,
      }}
    >
      <div className="absolute -top-3 left-[8%] z-30">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-color/45
            "
          >
            06
          </span>

          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.22em]
              text-color/45
            "
          >
            Latest projects
          </span>
        </div>

        <p
          className="
            text-4xl
            font-black
            uppercase
            leading-[0.82]
            tracking-[-0.07em]
            text-color/80
          "
        >
          Recent
          <br />
          Work
        </p>
      </div>

      {projects.map((project, index) => {
        const item = mobileLayout[index % mobileLayout.length];

        const resolvedLeft = getResponsiveMobileLeft(item, breakpointWidth);

        const resolvedTop = getResponsiveMobileTop(item, breakpointWidth);

        const resolvedScale = getResponsiveMobileScale(item, breakpointWidth);

        return (
          <MobileProjectItem
            key={project.id}
            project={project}
            index={index}
            left={resolvedLeft}
            top={resolvedTop}
            baseScale={resolvedScale}
            drift={item.drift}
            driftDirection={item.driftDirection}
            scrollYProgress={scrollYProgress}
          />
        );
      })}

      <TransitionLink
        href="/projects"
        transitionLabel="My work"
        className="
          group
          absolute
          left-[8%]
          z-40
        "
        style={{
          top: sectionHeight - 90,
        }}
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
              Projects
            </p>
          </div>
        </MagneticComp>
      </TransitionLink>
    </div>
  );
}
