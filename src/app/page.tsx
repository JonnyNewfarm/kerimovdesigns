export const revalidate = 60;
import HeroSection from "@/components/HeroSection";
import MyProjects from "@/components/MyProjects";
import MyworkMobile from "@/components/MyworkMobile";
import SmoothScroll from "@/components/SmoothScroll";
import { getLatestProject, getProjects, getProjectsMobile } from "./actions";
import AnimDisplay from "@/components/AnimDisplay";

export default async function Home() {
  const projects = await getProjects();
  const projectsMobile = await getProjectsMobile();
  const latestProject = await getLatestProject();

  if (!latestProject) return null;

  return (
    <SmoothScroll>
      <div className="bg-[#242323] min-h-screen w-full text-[#ecebeb] overflow-clip border-b-[1px] border-white/50">
        <HeroSection id={latestProject.id} imgSrc={latestProject.src} />

        <div className="hidden md:block">
          <MyProjects projects={projects} />
        </div>

        <div className="md:hidden">
          <MyworkMobile projects={projectsMobile} />
        </div>

        <AnimDisplay />
      </div>
    </SmoothScroll>
  );
}
