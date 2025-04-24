import HeroSection from "@/components/HeroSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#161515] h-screen w-full text-[#ecebeb]">
      <HeroSection />

      <div className="h-screen bg-[#161515]"></div>
    </div>
  );
}
