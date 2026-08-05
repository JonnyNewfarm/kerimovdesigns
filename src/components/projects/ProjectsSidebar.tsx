"use client";

import type { ReactNode } from "react";

import TextReveal from "@/components/TextReveal";

import ProjectsList from "./ProjectsList";
import ProjectsPagination from "./ProjectsPagination";
import ProjectsTagFilter from "./ProjectsTagFilter";
import type { ProjectListItem } from "./projectsTypes";

type ProjectsSidebarProps = {
  visibleProjects: ProjectListItem[];
  activeIndex: number;
  pageIndex: number;
  totalPages: number;
  direction: 1 | -1;
  startIndex: number;
  activeTagsKey: string;
  availableTags: string[];
  activeTags: string[];
  hasProjects: boolean;
  canGoPrevPage: boolean;
  canGoNextPage: boolean;
  children?: ReactNode;
  onSelectProject: (index: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export default function ProjectsSidebar({
  visibleProjects,
  activeIndex,
  pageIndex,
  totalPages,
  direction,
  startIndex,
  activeTagsKey,
  availableTags,
  activeTags,
  hasProjects,
  canGoPrevPage,
  canGoNextPage,
  children,
  onSelectProject,
  onPrevPage,
  onNextPage,
}: ProjectsSidebarProps) {
  return (
    <aside
      className="
        flex
        min-h-0
        flex-col
        md:col-span-5
        md:h-[calc(100vh-9rem)]
        md:pr-6
        xl:col-span-4
      "
    >
      <div
        className="
          relative
          z-[200]
          mb-6
          flex
          min-h-[calc(clamp(3rem,5vw,5.4rem)*1.76+1.5rem)]
          shrink-0
          flex-col
          justify-end
          gap-5
        "
      >
        <ProjectsTagFilter
          availableTags={availableTags}
          activeTags={activeTags}
        />
      </div>
      <TextReveal
        as="p"
        mode="words"
        viewport={false}
        delay={0.02}
        duration={0.65}
        y="80%"
        className="
    mb-2
    mt-5
    text-[10px]
    font-black
    uppercase
    tracking-[0.35em]
    text-white/80
    sm:text-xs
  "
      >
        Selected Work
      </TextReveal>

      <ProjectsList
        projects={visibleProjects}
        activeIndex={activeIndex}
        pageIndex={pageIndex}
        startIndex={startIndex}
        direction={direction}
        activeTagsKey={activeTagsKey}
        hasProjects={hasProjects}
        onSelectProject={onSelectProject}
      />

      <ProjectsPagination
        pageIndex={pageIndex}
        totalPages={totalPages}
        hasProjects={hasProjects}
        canGoPrevPage={canGoPrevPage}
        canGoNextPage={canGoNextPage}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />

      {children ? <div className="mt-8 shrink-0">{children}</div> : null}
    </aside>
  );
}
