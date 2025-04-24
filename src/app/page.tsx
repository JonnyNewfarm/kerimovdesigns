import HeroSection from "@/components/HeroSection";
import MyProjects from "@/components/MyProjects";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="bg-[#242323] min-h-screen w-full text-[#ecebeb]">
        <HeroSection />

        <MyProjects />
      </div>
    </SmoothScroll>
  );
}
