"use client";

import { useCallback, useState } from "react";

import DesktopProjects from "./DesktopProjects";
import MobileProjects from "./MobileProjects";

import type { LandingPageProjectsProps } from "./projectTypes";

export default function LandingPageProjects({
  projects,
}: LandingPageProjectsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleHoverChange = useCallback((projectId: string | null) => {
    setHoveredId(projectId);
  }, []);

  return (
    <section
      className="
        relative
        mb-20
        min-h-screen
        w-full
        overflow-hidden
        bg-dark
        text-color
        lg:mt-10
        xl:mt-10
      "
    >
      <div className="lg:hidden">
        <MobileProjects projects={projects} />
      </div>

      <div className="hidden lg:block">
        <DesktopProjects
          projects={projects}
          hoveredId={hoveredId}
          onHoverChange={handleHoverChange}
        />
      </div>
    </section>
  );
}
