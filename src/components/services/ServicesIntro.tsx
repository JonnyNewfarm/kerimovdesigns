"use client";

import TextReveal from "../TextReveal";
import { INTRO } from "./servicesData";

export default function ServicesIntro() {
  return (
    <section
      className="
        mx-auto
        flex
        min-h-svh
        w-full
        max-w-[1700px]
        items-center
        px-5
        py-28
        md:px-8
        lg:px-10
      "
    >
      <TextReveal
        as="p"
        mode="words"
        stagger={0.008}
        duration={0.75}
        delay={0.1}
        className="
          max-w-[1220px]
          text-2xl
          md:text-[clamp(30px,3.1vw,54px)]
          font-normal
          leading-[1.16]
          tracking-normal
        "
      >
        {INTRO}
      </TextReveal>
    </section>
  );
}
