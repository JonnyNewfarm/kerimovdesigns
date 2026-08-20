"use client";

import MagneticComp from "@/components/MagneticComp";
import TextReveal from "@/components/TextReveal";
import TransitionLink from "@/components/TransitionLink";

import DesktopProjectItem from "./DesktopProjectItem";

import { desktopLayout } from "./projectLayouts";

import type { ProjectListItem } from "./projectTypes";

type DesktopProjectsProps = {
  projects: ProjectListItem[];
  hoveredId: string | null;
  onHoverChange: (projectId: string | null) => void;
};

export default function DesktopProjects({
  projects,
  hoveredId,
  onHoverChange,
}: DesktopProjectsProps) {
  return (
    <div
      className="
        relative
        mx-auto
        w-full
        max-w-[1800px]
        overflow-hidden
        px-6 py-6
        
      "
    >
      <header
        className="
    relative
    mt-10
    z-30
    ml-[8%]
    w-fit
  "
      >
        <TextReveal
          as="span"
          mode="lines"
          delay={0.2}
          className="
      absolute
      bottom-full
      right-0
      mb-2
      text-[18px]
      uppercase
      tracking-[0.18em]
      text-color/45
    "
        >
          05
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
      </header>

      <div className="mt-20 flex flex-col gap-y-24">
        {projects.map((project, index) => {
          const item = desktopLayout[index % desktopLayout.length];

          return (
            <DesktopProjectItem
              key={project.id}
              project={project}
              index={index}
              align={item.align}
              offsetX={item.offsetX ?? 0}
              baseScale={item.scale}
              isActive={hoveredId === project.id}
              isDimmed={hoveredId !== null && hoveredId !== project.id}
              onHoverChange={onHoverChange}
            />
          );
        })}
      </div>

      <TransitionLink
        href="/projects"
        transitionLabel="My Work"
        className="
          group
          ml-[8%]
          mt-32
          inline-block
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
    </div>
  );
}
