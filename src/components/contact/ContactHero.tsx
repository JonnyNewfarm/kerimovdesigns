"use client";

import { motion } from "framer-motion";

import SmoothScroll from "@/components/SmoothScroll";
import TextReveal from "@/components/TextReveal";

import MagneticComp from "@/components/MagneticComp";
import { contactEase } from "./contactAnimations";

type ContactHeroProps = {
  onOpenForm: () => void;
};

export default function ContactHero({ onOpenForm }: ContactHeroProps) {
  return (
    <SmoothScroll>
      <main
        className="
          min-h-[100svh]
          bg-[#181c14]
          px-4
          pb-20
          pt-10
          text-[#ecdfcc]
          md:px-12
          lg:px-18
          xl:px-20
        "
      >
        <section
          className="
            flex
            min-h-[100svh]
            flex-col
            gap-y-20
            md:gap-y-8
          "
        >
          <div className="w-full">
            <TextReveal
              as="h1"
              mode="lines"
              viewport={false}
              delay={0.08}
              stagger={0.12}
              duration={1}
              y="110%"
              rotate={2}
              className="
                mt-24
                max-w-[950px]
                text-[clamp(3rem,7vw,7.5rem)]
                font-semibold
                uppercase
                leading-[0.82]
                tracking-[-0.025em]
                md:text-[clamp(2rem,6vw,6.5rem)]
              "
            >
              {"Let's work\ntogether."}
            </TextReveal>
          </div>

          <div className="flex w-full flex-col">
            <div
              className="
                mb-8
                ml-auto
                flex
                flex-col
                items-end
                gap-y-6
                text-right
                md:mb-10
                md:gap-y-8
              "
            >
              <div className="flex flex-col items-end text-right">
                <TextReveal
                  as="p"
                  viewport={false}
                  delay={0.25}
                  duration={0.65}
                  y="100%"
                  className="
                    mb-1.5
                    text-[11px]
                    uppercase
                    opacity-50
                  "
                >
                  Details
                </TextReveal>

                <div
                  className="
                    flex
                    flex-col
                    items-end
                    gap-y-1
                    text-right
                    text-sm
                    leading-[1.4]
                    md:text-base
                  "
                >
                  <TextReveal
                    as="p"
                    viewport={false}
                    delay={0.31}
                    duration={0.7}
                    y="100%"
                  >
                    Rustam Kerimov
                  </TextReveal>

                  <a
                    href="mailto:rustam-98@hotmail.com"
                    className="
                      w-fit
                      transition-opacity
                      duration-300
                      hover:opacity-50
                    "
                  >
                    <TextReveal
                      as="span"
                      viewport={false}
                      delay={0.35}
                      duration={0.7}
                      y="100%"
                    >
                      rustam-98@hotmail.com
                    </TextReveal>
                  </a>

                  <a
                    href="tel:+4745268163"
                    className="
                      w-fit
                      transition-opacity
                      duration-300
                      hover:opacity-50
                    "
                  >
                    <TextReveal
                      as="span"
                      viewport={false}
                      delay={0.39}
                      duration={0.7}
                      y="100%"
                    >
                      +47 45 26 81 63
                    </TextReveal>
                  </a>

                  <TextReveal
                    as="p"
                    viewport={false}
                    delay={0.43}
                    duration={0.7}
                    y="100%"
                  >
                    Oslo, Norway
                  </TextReveal>
                </div>
              </div>

              <div className="flex flex-col items-end text-right">
                <TextReveal
                  as="p"
                  viewport={false}
                  delay={0.47}
                  duration={0.65}
                  y="100%"
                  className="
                    mb-1.5
                    text-[11px]
                    uppercase
                    opacity-50
                  "
                >
                  Socials
                </TextReveal>

                <div
                  className="
                    flex
                    flex-col
                    items-end
                    gap-y-1
                    text-right
                    text-sm
                    leading-[1.4]
                    md:text-base
                  "
                >
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="
                      w-fit
                      transition-opacity
                      duration-300
                      hover:opacity-50
                    "
                  >
                    <TextReveal
                      as="span"
                      viewport={false}
                      delay={0.51}
                      duration={0.7}
                      y="100%"
                    >
                      Instagram
                    </TextReveal>
                  </a>

                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="
                      w-fit
                      transition-opacity
                      duration-300
                      hover:opacity-50
                    "
                  >
                    <TextReveal
                      as="span"
                      viewport={false}
                      delay={0.55}
                      duration={0.7}
                      y="100%"
                    >
                      LinkedIn
                    </TextReveal>
                  </a>
                </div>
              </div>
            </div>

            <div
              className="
                flex
                w-full
                flex-col
                items-start
                justify-between
                gap-x-5
                gap-y-8
                pt-5
                text-left
                md:flex-row
                md:gap-x-12
                md:gap-y-0
              "
            >
              <div className="min-w-0 max-w-[400px]">
                <TextReveal
                  as="p"
                  viewport={false}
                  delay={0.61}
                  duration={0.65}
                  y="100%"
                  className="
                    mb-3
                    text-[11px]
                    uppercase
                    opacity-50
                  "
                >
                  Availability
                </TextReveal>

                <TextReveal
                  as="p"
                  viewport={false}
                  delay={0.66}
                  stagger={0.025}
                  duration={0.75}
                  y="100%"
                  className="text-sm leading-[1.4] md:text-base"
                >
                  Available for visual identities, motion pieces, logos and
                  selected design projects.
                </TextReveal>
              </div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.72,
                  duration: 0.7,
                  ease: contactEase,
                }}
                className="shrink-0"
              >
                <MagneticComp>
                  <button
                    type="button"
                    onClick={onOpenForm}
                    className="
                      group
                      relative
                      flex
                      cursor-pointer
                      items-center
                      justify-center
                      overflow-hidden
                      border
                      border-[#ecdfcc]
                      px-3
                      py-3
                      text-xs
                      hover:border-[#667a6c]
                      sm:px-4
                      sm:text-sm
                      md:px-5
                      md:text-lg
                    "
                  >
                    <span
                      className="
                        absolute
                        inset-0
                        origin-bottom
                        scale-y-0
                        bg-[#48544c]
                        transition-transform
                        duration-500
                        ease-[cubic-bezier(0.76,0,0.24,1)]
                        group-hover:scale-y-100
                      "
                    />

                    <TextReveal
                      as="span"
                      viewport={false}
                      delay={0.78}
                      duration={0.7}
                      y="100%"
                      className="
                        relative
                        z-10
                        whitespace-nowrap
                        uppercase
                      "
                    >
                      Send message
                    </TextReveal>
                  </button>
                </MagneticComp>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </SmoothScroll>
  );
}
