"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

import TextReveal from "./TextReveal";

const BASE_COLOR = "#ecdfcc";
const FILL_COLOR = "#a3b18a";

type ScrollFillTextProps = {
  children: ReactNode;
  progress: MotionValue<number>;
  from: number;
  to: number;
};

function ScrollFillText({ children, progress, from, to }: ScrollFillTextProps) {
  const clipPath = useTransform(
    progress,
    [from, to],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );

  return (
    <span className="relative inline-block">
      <span style={{ color: BASE_COLOR }}>{children}</span>

      <motion.span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          whitespace-nowrap
          [will-change:clip-path]
        "
        style={{
          clipPath,
          color: FILL_COLOR,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function ServicesReveal() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 50%", "end 45%"],
  });

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        px-4
        py-[22vh]
        md:px-10
        lg:px-16
      "
    >
      <div className="mx-auto w-full max-w-[1800px]">
        <div
          className="
            mb-10
            flex
            items-start
            justify-between
            text-xs
            font-black
            uppercase
            tracking-[0.24em]
            md:text-sm
          "
        >
          <p aria-hidden="true" className="invisible">
            <span className="mr-4">07</span>
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

        <h2
          className="
            select-none
            text-[10vw]
            font-black
            uppercase
            leading-[0.9]
            tracking-[-0.045em]
            md:text-[8.4vw]
            lg:text-[6.45vw]
          "
        >
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

        <div
          className="
            mt-14
            grid
            grid-cols-1
            gap-8
            border-t
            border-stone-400/20
            pt-8
            md:grid-cols-[1fr_0.8fr]
            md:items-start
          "
        >
          <TextReveal
            as="p"
            mode="words"
            delay={0.2}
            className="
              max-w-[760px]
              text-[6.3vw]
              font-semibold
              uppercase
              leading-[0.96]
              tracking-[-0.035em]
              md:text-[3.45vw]
              lg:text-[2.45vw]
            "
          >
            Design is more than work — it turns imagination into something
            people can see and feel.
          </TextReveal>

          <TextReveal
            as="p"
            mode="words"
            delay={0.32}
            className="
              max-w-[500px]
              justify-self-end
              text-base
              font-bold
              leading-[1.35]
              opacity-90
              md:text-lg
            "
          >
            Inspired by art, movies and the world around me, I create visuals
            that bring ideas to life.
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
