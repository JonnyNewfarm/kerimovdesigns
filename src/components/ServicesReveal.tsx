"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import TextReveal from "./TextReveal";

const baseColor = "#ecdfcc";
const fillColor = "#a3b18a";
function ScrollFillText({
  children,
  progress,
  from,
  to,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  from: number;
  to: number;
}) {
  const width = useTransform(progress, [from, to], ["0%", "100%"]);

  return (
    <span className="relative inline-block">
      <span style={{ color: baseColor }}>{children}</span>

      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap"
        style={{
          width,
          color: fillColor,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function ServicesReveal() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 50%", "end 45%"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-dark px-4 py-[22vh] text-color md:px-10 lg:px-16"
    >
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="mb-10 flex items-start justify-between text-xs font-black uppercase tracking-[0.24em] text-color/50 md:text-sm">
          <p className="invisible">
            <span className="mr-4 text-color">07</span>
            About
          </p>

          <TextReveal
            as="p"
            mode="words"
            delay={0.05}
            className="hidden text-right md:block"
          >
            Visual Identity / Animation / Logos
          </TextReveal>
        </div>

        <h2 className="select-none text-[10vw] font-black uppercase leading-[0.9] tracking-[-0.045em] text-color md:text-[8.4vw] lg:text-[6.45vw]">
          <span className="block">Hi, I’m Rustam —</span>
          <span className="block">a graphic designer</span>

          <span className="block">
            creating{" "}
            <ScrollFillText progress={scrollYProgress} from={0.12} to={0.34}>
              visual identities,
            </ScrollFillText>
          </span>

          <span className="block">
            <ScrollFillText progress={scrollYProgress} from={0.26} to={0.46}>
              logos
            </ScrollFillText>{" "}
            and{" "}
            <ScrollFillText progress={scrollYProgress} from={0.36} to={0.62}>
              animations.
            </ScrollFillText>
          </span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-stone-400/20 pt-8 md:grid-cols-[1fr_0.8fr] md:items-start">
          <TextReveal
            as="p"
            mode="words"
            delay={0.2}
            className="max-w-[760px] text-[6.3vw] font-black uppercase leading-[0.96] tracking-[-0.055em] text-color md:text-[3.45vw] lg:text-[2.45vw]"
          >
            Design is more than work — it turns imagination into something
            people can see and feel.
          </TextReveal>

          <TextReveal
            as="p"
            mode="words"
            delay={0.32}
            className="max-w-[500px] justify-self-end text-base font-bold leading-[1.35] text-color/60 md:text-lg"
          >
            Inspired by art, movies and the world around me, I create visuals
            that bring ideas to life.
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
