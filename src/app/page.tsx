export const revalidate = 60;

import MyProjects from "@/components/MyProjects";
import SmoothScroll from "@/components/SmoothScroll";
import { getProjects } from "./actions";
import AnimDisplay from "@/components/AnimDisplay";
import Cube from "@/components/Cube";

export default async function Home() {
  const projects = await getProjects();

  return (
    <SmoothScroll>
      <div className="bg-dark p-0 relative min-h-screen w-full text-color border-b-[1px] border-stone-400/20">
        <Cube />

        <div>
          <MyProjects projects={projects} />
        </div>

        {/* hvis du vil bruke mobile-prosjektene også */}
        {/* <MyworkMobile projects={projectsMobile} /> */}

        <AnimDisplay />
      </div>
    </SmoothScroll>
  );
}
