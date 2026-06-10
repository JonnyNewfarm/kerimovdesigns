"use client";

import { motion } from "framer-motion";

const bigText = [
  "Hi, I’m Rustam —",
  "a graphic designer",
  "creating visual identities,",
  "logos and animations.",
];

export default function ServicesReveal() {
  return (
    <section className="relative w-full overflow-hidden  bg-dark px-4 py-[22vh] text-color md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="mb-10 flex items-start justify-between text-xs font-black uppercase tracking-[0.24em] text-color/50 md:text-sm">
          <p className="invisible">
            <span className="mr-4 text-color">07</span>
            About
          </p>

          <p className="hidden text-right md:block">
            Visual Identity / Animation / Logos
          </p>
        </div>

        <h2 className="select-none text-[10vw] font-black uppercase leading-[0.9] tracking-[-0.075em] text-color md:text-[8.4vw] lg:text-[6.45vw]">
          {bigText.map((line, index) => (
            <motion.span
              key={line}
              initial={{
                y: 34,
                opacity: 0,
                filter: "blur(6px)",
              }}
              whileInView={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              viewport={{
                once: true,
                amount: 0.35,
              }}
              transition={{
                duration: 1.05,
                delay: index * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="block will-change-transform"
            >
              {line}
            </motion.span>
          ))}
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-stone-400/20 pt-8 md:grid-cols-[1fr_0.8fr] md:items-start">
          <motion.p
            initial={{
              y: 24,
              opacity: 0,
              filter: "blur(5px)",
            }}
            whileInView={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.95,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-[760px] text-[6.3vw] font-black uppercase leading-[0.96] tracking-[-0.055em] text-color md:text-[3.45vw] lg:text-[2.45vw]"
          >
            Design is more than work — it turns imagination into something
            people can see and feel.
          </motion.p>

          <motion.p
            initial={{
              y: 20,
              opacity: 0,
              filter: "blur(4px)",
            }}
            whileInView={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.95,
              delay: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-[500px] justify-self-end text-base font-bold leading-[1.35] text-color/60 md:text-lg"
          >
            Inspired by art, movies and the world around me, I create visuals
            that bring ideas to life.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
