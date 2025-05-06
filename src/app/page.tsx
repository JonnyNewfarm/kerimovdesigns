import HeroSection from "@/components/HeroSection";
import MyProjects from "@/components/MyProjects";
import SmoothScroll from "@/components/SmoothScroll";
import { getLatestProject, getProjects } from "./actions";

export default async function Home() {
  const projects = await getProjects();

  const latestProject = await getLatestProject();
  return (
    <SmoothScroll>
      <div className="bg-[#242323] min-h-screen w-full text-[#ecebeb] overflow-clip">
        <HeroSection imgSrc={latestProject?.src!} />

        <MyProjects projects={projects} />
      </div>
    </SmoothScroll>
  );
}
