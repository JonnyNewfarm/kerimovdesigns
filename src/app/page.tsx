import ServicesReveal from "@/components/ServicesReveal";
import CubeHero from "@/components/hero/CubeHero";
import LandingPageProjects from "@/components/landingpage-projects/LandingPageProjects";
import AnimAndVisualDisplay from "@/components/AnimAndVisualDisplay";
import Smoothscroll from "@/components/SmoothScroll";

import { getLandingProjects } from "./actions";

export default async function Home() {
  const projects = await getLandingProjects();
  const latestProject = projects[0];

  return (
    <Smoothscroll>
      <div className="relative min-h-screen w-full bg-dark text-color">
        {latestProject && (
          <CubeHero title={latestProject.title} href={latestProject.id} />
        )}

        <ServicesReveal />

        <LandingPageProjects projects={projects} />

        <AnimAndVisualDisplay />
      </div>
    </Smoothscroll>
  );
}
