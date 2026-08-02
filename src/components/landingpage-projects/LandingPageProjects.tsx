"use client";

import { usePathname } from "next/navigation";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useScroll } from "framer-motion";

import DesktopProjects from "./DesktopProjects";
import MobileProjects from "./MobileProjects";

import type { LandingPageProjectsProps } from "./projectTypes";

import useResponsiveLayout from "./useResponsiveLayout";

export default function LandingPageProjects({
  projects,
}: LandingPageProjectsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const pathname = usePathname();

  const { layoutMode, breakpointWidth } = useResponsiveLayout();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const visibleProjects = useMemo(() => projects.slice(0, 6), [projects]);

  useEffect(() => {
    setHoveredId(null);
  }, [pathname]);

  const handleHoverChange = useCallback((projectId: string | null) => {
    setHoveredId(projectId);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        mb-20
        min-h-screen
        w-full
        overflow-hidden
        bg-dark
        text-color
        lg:pt-40
        xl:pt-10
      "
    >
      {layoutMode === null && (
        <>
          <div className="hidden lg:block">
            <DesktopProjects
              projects={visibleProjects}
              breakpointWidth={1024}
              scrollYProgress={scrollYProgress}
              hoveredId={hoveredId}
              onHoverChange={handleHoverChange}
            />
          </div>

          <div className="block lg:hidden">
            <MobileProjects
              projects={visibleProjects}
              breakpointWidth={0}
              scrollYProgress={scrollYProgress}
            />
          </div>
        </>
      )}

      {layoutMode === "desktop" && (
        <DesktopProjects
          projects={visibleProjects}
          breakpointWidth={breakpointWidth}
          scrollYProgress={scrollYProgress}
          hoveredId={hoveredId}
          onHoverChange={handleHoverChange}
        />
      )}

      {layoutMode === "mobile" && (
        <MobileProjects
          projects={visibleProjects}
          breakpointWidth={breakpointWidth}
          scrollYProgress={scrollYProgress}
        />
      )}
    </section>
  );
}
