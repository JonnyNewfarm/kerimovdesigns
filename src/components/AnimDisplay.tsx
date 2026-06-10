"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const animations = [
  {
    title: "Echo",
    type: "Animated graphics",
    description:
      "A high-energy visual piece built around movement, contrast and bold screen composition.",
    video: "/echo-new.mp4",
  },
  {
    title: "By:Larm",
    type: "Motion identity",
    description:
      "A playful animated direction with sharp pacing, graphic rhythm and a strong visual mood.",
    video: "/bylarm-new.mp4",
  },
];

export default function AnimDisplay() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsLg(window.innerWidth >= 1024);

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const firstY = useTransform(scrollYProgress, [0, 1], [-30, 45]);
  const secondY = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const titleY = useTransform(scrollYProgress, [0, 1], [25, -25]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-dark px-4 py-24 text-color md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_0.7fr] md:items-end">
          <motion.div
            style={isLg ? { y: titleY } : undefined}
            initial={{ opacity: 0, y: 24, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-color/45 md:text-sm">
              Animation work
            </p>

            <h2 className="max-w-[1100px] text-[14vw] font-black uppercase leading-[0.88] tracking-[-0.05em] md:text-[8vw] lg:text-[5.8vw]">
              Motion with visual attitude.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-[460px] text-base font-bold leading-[1.35] text-color/55 md:justify-self-end md:text-right md:text-lg"
          >
            Animated visuals shaped through rhythm, graphic detail and
            expressive motion.
          </motion.p>
        </div>

        <div className="flex flex-col gap-20 lg:gap-28">
          {animations.map((item, index) => {
            const videoY = index === 0 ? firstY : secondY;

            return (
              <motion.article
                key={item.title}
                style={isLg ? { y: videoY } : undefined}
                initial={{ opacity: 0, y: 34, filter: "blur(7px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{
                  duration: 0.95,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`grid grid-cols-1 gap-5 ${
                  index === 1 ? "lg:ml-auto lg:w-[65%]" : "lg:w-[65%]"
                }`}
              >
                <div className="group relative aspect-video w-full overflow-hidden bg-color/[0.04]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                    src={item.video}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.45fr_1fr] md:items-start">
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-color/40">
                      0{index + 1} / {item.type}
                    </p>

                    <h3 className="text-[6vw] font-black uppercase leading-[0.86] tracking-[-0.04em] text-color md:text-[5vw] lg:text-[3.6vw]">
                      {item.title}
                    </h3>
                  </div>

                  <p className="max-w-[620px] text-base font-bold leading-[1.35] text-color/55 md:justify-self-end md:text-right md:text-lg">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.95,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-24 md:mt-32 lg:mt-40"
        >
          <h2 className="max-w-[1300px] text-[12vw] font-semibold uppercase leading-[0.9] tracking-[-0.075em] md:text-[6.4vw] lg:text-[5vw]">
            Designed to move with rhythm, weight and character.
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
