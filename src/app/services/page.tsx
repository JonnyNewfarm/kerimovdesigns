import ScrollSection from "@/components/SmoothScroll";

import ServicesIntro from "@/components/services/ServicesIntro";
import ServicesShowcase from "@/components/services/ServicesShowcase";
import ServicesContact from "@/components/services/ServicesContact";
import ServicesFooter from "@/components/services/ServicesFooter";

export default function ServicesPage() {
  return (
    <ScrollSection>
      <main className="min-h-screen bg-dark text-color">
        <ServicesIntro />

        <ServicesShowcase />

        <ServicesContact />

        <ServicesFooter />
      </main>
    </ScrollSection>
  );
}
