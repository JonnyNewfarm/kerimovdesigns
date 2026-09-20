import Smoothscroll from "@/components/SmoothScroll";

import { getLandingProjects } from "./actions";
import RingHero from "@/components/hero/hero";

export default async function Home() {
  const projects = await getLandingProjects();
  const latestProject = projects[0];

  return (
    <Smoothscroll>
      <div className="relative min-h-screen w-full bg-dark text-color">
        {latestProject && (
          <RingHero title={latestProject.title} href={latestProject.id} />
        )}
      </div>
    </Smoothscroll>
  );
}
