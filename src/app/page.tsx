export const revalidate = 60;
import MyProjects from "@/components/MyProjects";
import MyworkMobile from "@/components/MyworkMobile";
import SmoothScroll from "@/components/SmoothScroll";
import { getProjects, getProjectsMobile } from "./actions";
import AnimDisplay from "@/components/AnimDisplay";
import Cube from "@/components/Cube";
import ScrollingImageGallery from "@/components/ScrollingImageGallery";

export default async function Home() {
  const projects = await getProjects();
  const projectsMobile = await getProjectsMobile();

  return (
    <SmoothScroll>
      <div className="bg-[#171717] p-0 relative min-h-screen w-full text-[#ecebeb]  border-b-[1px] border-white/50">
        <Cube />

        <div className="hidden md:block">
          <MyProjects projects={projects} />
        </div>

        <div className="md:hidden">
          <MyworkMobile projects={projectsMobile} />
        </div>

        <AnimDisplay />
        <ScrollingImageGallery />
      </div>
    </SmoothScroll>
  );
}
