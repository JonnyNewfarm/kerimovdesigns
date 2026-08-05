"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ProjectPreview from "./ProjectPreview";
import ProjectsSidebar from "./ProjectsSidebar";
import type { ProjectListItem, ProjectsTableProps } from "./projectsTypes";
import { PROJECTS_PER_VIEW } from "./projectUtils";
import PageTransitionGate from "./PageTransitionGate";

export default function ProjectsTable({
  projects,
  children,
  startIndex,
  availableTags = [],
  activeTags = [],
}: ProjectsTableProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const queuedProjectIndex = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);

  const activeTagsKey = activeTags.join("|");

  const totalPages = Math.max(
    Math.ceil(projects.length / PROJECTS_PER_VIEW),
    1,
  );

  const visibleProjects = useMemo(() => {
    const firstProjectIndex = pageIndex * PROJECTS_PER_VIEW;
    const lastProjectIndex = firstProjectIndex + PROJECTS_PER_VIEW;

    return projects.slice(firstProjectIndex, lastProjectIndex);
  }, [projects, pageIndex]);

  const activeProject: ProjectListItem | null = projects[activeIndex] ?? null;

  const hasProjects = projects.length > 0 && activeProject !== null;

  const canGoPrevPage = hasProjects && pageIndex > 0;

  const canGoNextPage = hasProjects && pageIndex < totalPages - 1;

  const setProjectIndex = useCallback(
    (index: number) => {
      if (!projects.length) {
        return;
      }

      const safeIndex = Math.min(Math.max(index, 0), projects.length - 1);

      queuedProjectIndex.current = safeIndex;

      if (animationFrame.current !== null) {
        return;
      }

      animationFrame.current = window.requestAnimationFrame(() => {
        const nextIndex = queuedProjectIndex.current;

        if (nextIndex !== null) {
          setActiveIndex((currentIndex) => {
            if (currentIndex === nextIndex) {
              return currentIndex;
            }

            return nextIndex;
          });
        }

        queuedProjectIndex.current = null;
        animationFrame.current = null;
      });
    },
    [projects.length],
  );

  useEffect(() => {
    return () => {
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    setPageIndex(0);
    setActiveIndex(0);
    setDirection(1);
  }, [activeTagsKey]);

  useEffect(() => {
    if (!projects.length) {
      setActiveIndex(0);
      setPageIndex(0);
      return;
    }

    setActiveIndex((currentIndex) => {
      if (currentIndex > projects.length - 1) {
        return projects.length - 1;
      }

      return currentIndex;
    });
  }, [projects.length]);

  useEffect(() => {
    if (pageIndex <= totalPages - 1) {
      return;
    }

    const safePageIndex = Math.max(totalPages - 1, 0);
    const nextActiveIndex = safePageIndex * PROJECTS_PER_VIEW;

    setPageIndex(safePageIndex);
    setActiveIndex(nextActiveIndex);
  }, [pageIndex, totalPages]);

  const goToPrevPage = () => {
    if (!canGoPrevPage) {
      return;
    }

    const nextPageIndex = pageIndex - 1;
    const nextActiveIndex = nextPageIndex * PROJECTS_PER_VIEW;

    setDirection(-1);
    setPageIndex(nextPageIndex);
    setActiveIndex(nextActiveIndex);
  };

  const goToNextPage = () => {
    if (!canGoNextPage) {
      return;
    }

    const nextPageIndex = pageIndex + 1;
    const nextActiveIndex = nextPageIndex * PROJECTS_PER_VIEW;

    setDirection(1);
    setPageIndex(nextPageIndex);
    setActiveIndex(nextActiveIndex);
  };
  return (
    <section className="min-h-screen w-full bg-dark text-color">
      <PageTransitionGate className="min-h-screen">
        <div
          className="
          mx-auto
          grid
          min-h-screen
          w-full
          max-w-[1800px]
          grid-cols-1
          gap-10
          px-7
          pb-12
          pt-28
          sm:px-8
          md:grid-cols-12
          md:pt-32
          lg:px-8
          xl:px-18
        "
        >
          <ProjectsSidebar
            visibleProjects={visibleProjects}
            activeIndex={activeIndex}
            pageIndex={pageIndex}
            totalPages={totalPages}
            direction={direction}
            startIndex={startIndex}
            activeTagsKey={activeTagsKey}
            availableTags={availableTags}
            activeTags={activeTags}
            hasProjects={hasProjects}
            canGoPrevPage={canGoPrevPage}
            canGoNextPage={canGoNextPage}
            onSelectProject={setProjectIndex}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
          >
            {children}
          </ProjectsSidebar>

          <ProjectPreview
            project={activeProject}
            hasProjects={hasProjects}
            activeTagsKey={activeTagsKey}
          />
        </div>
      </PageTransitionGate>
    </section>
  );
}
