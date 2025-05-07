import HeroSection from "@/components/HeroSection";
import MyProjects from "@/components/MyProjects";
import MyworkMobile from "@/components/MyworkMobile";
import SmoothScroll from "@/components/SmoothScroll";
import {
  getLatestProject,
  getProjects,
  getProjectsMobile,
  getProjectsPagnation,
} from "./actions";

export default async function Home() {
  const projects = await getProjects();

  const projectsMobile = await getProjectsMobile();

  const latestProject = await getLatestProject();
  return (
    <SmoothScroll>
      <div className="bg-[#242323]  min-h-screen w-full text-[#ecebeb] overflow-clip">
        <HeroSection id={latestProject?.id!} imgSrc={latestProject?.src!} />
        <div className="hidden md:block">
          <MyProjects projects={projects} />
        </div>

        <div className="md:hidden">
          <MyworkMobile projects={projectsMobile} />
        </div>
      </div>
    </SmoothScroll>
  );
}
