import ContactClient from "@/components/ContactClient";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Contact Me – Let’s Connect",
  description:
    "Get in touch to discuss collaborations, projects, or any questions you may have.",
  icons: {
    icon: "/favicon.ico",
  },
};
const page = () => {
  return <ContactClient />;
};

export default page;
