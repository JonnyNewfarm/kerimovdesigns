export const revalidate = 60;

import MyProjects from "@/components/MyProjects";
import SmoothScroll from "@/components/SmoothScroll";
import { getProjects } from "./actions";
import AnimDisplay from "@/components/AnimDisplay";
import Cube from "@/components/Cube";
import ServicesReveal from "@/components/ServicesReveal";

export default async function Home() {
  const projects = await getProjects();

  return (
    <SmoothScroll>
      <div className="relative min-h-screen w-full bg-dark p-0 text-color">
        <Cube />
        <ServicesReveal />

        <MyProjects projects={projects} />

        <AnimDisplay />
      </div>
    </SmoothScroll>
  );
}
