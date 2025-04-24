"use client";

import { motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HeroSection = () => {
  const firstParagraph = useRef(null);
  const secondParagraph = useRef(null);
  const slider = useRef(null);
  let xPercent = 0;
  const container = useRef(null);
  const direction = useRef(-1);

  const animation = () => {
    if (xPercent < -100) xPercent = 0;
    if (xPercent > 0) xPercent = -100;

    gsap.set(firstParagraph.current, { xPercent });
    gsap.set(secondParagraph.current, { xPercent });
    requestAnimationFrame(animation);
    xPercent += 0.04 * direction.current;
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (event) => {
          direction.current = event.direction * -1;
        },
      },
      x: "-200px",
    });

    requestAnimationFrame(animation);
  }, []);
  return (
    <div className="h-screen flex w-full flex-col lg:flex-row overflow-hidden justify-center items-center px-4">
      <div className="h-full absolute w-full lg:w-[60vw] px-8 left-0  top-0 flex justify-center items-end">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.6, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 2,
            times: [0, 0.4, 1],
            ease: "easeInOut",
          }}
          className="w-full overflow-hidden relative bottom-0"
        >
          <div
            ref={slider}
            className="relative flex whitespace-nowrap w-max will-change-transform"
          >
            <p
              ref={firstParagraph}
              className="text-[clamp(6rem,8vw,8rem)] z-50 text-[#ecebeb] m-2.5 uppercase"
            >
              Graphic designer -
            </p>
            <p
              ref={secondParagraph}
              className="text-[clamp(6rem,8vw,8rem)] z-50 text-[#ecebeb] m-2.5 uppercase absolute translate-x-full left-0"
            >
              Graphic designer -
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 2,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        className="absolute w-[40vw] lg:right-0 h-[40vh] sm:h-[50vh] lg:h-screen"
      >
        <Image src="/jonny17.jpg" className="object-cover" fill alt="" />
      </motion.div>
    </div>
  );
};

export default HeroSection;
