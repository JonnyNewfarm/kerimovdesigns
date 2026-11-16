import ScrollSection from "@/components/SmoothScroll";

import ServicesIntro from "@/components/services/ServicesIntro";
import ServicesShowcaseResponsive from "@/components/services/ServicesShowcaseResponsive";
import ServicesContact from "@/components/services/ServicesContact";
import ServicesFooter from "@/components/services/ServicesFooter";

export default function ServicesPage() {
  return (
    <ScrollSection>
      <main className="min-h-screen bg-dark text-color">
        <ServicesIntro />

        <ServicesShowcaseResponsive />

        <ServicesContact />

        <ServicesFooter />
      </main>
    </ScrollSection>
  );
}
