"use client";

import { useState } from "react";

import ContactFormPanel from "@/components/contact/ContactFormPanel";
import ContactHero from "@/components/contact/ContactHero";

export default function ContactPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <ContactHero onOpenForm={() => setIsFormOpen(true)} />

      <ContactFormPanel
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  );
}
