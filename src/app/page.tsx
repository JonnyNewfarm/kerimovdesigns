export const revalidate = 60;

import MyProjects from "@/components/MyProjects";
import SmoothScroll from "@/components/SmoothScroll";
import { getProjects } from "./actions";
import { getLatestProject } from "./actions";
import AnimDisplay from "@/components/AnimDisplay";
import Cube from "@/components/hero/Cube";
import ServicesReveal from "@/components/ServicesReveal";

export default async function Home() {
  const projects = await getProjects();
  const latestProject = await getLatestProject();

  return (
    <SmoothScroll>
      <div className="relative min-h-screen w-full bg-dark p-0 text-color">
        <Cube title={latestProject?.title!} href={latestProject?.id!} />
        <ServicesReveal />

        <MyProjects projects={projects} />

        <AnimDisplay />
      </div>
    </SmoothScroll>
  );
}
