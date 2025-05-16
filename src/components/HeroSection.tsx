"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import rustam2 from "../../public/rustam2.jpg";
import Link from "next/link";

interface LatestProject {
  imgSrc: string;
  id: string;
}

const HeroSection = ({ imgSrc, id }: LatestProject) => {
  const firstParagraph = useRef(null);
  const secondParagraph = useRef(null);

  const slider = useRef(null);
  let xPercent = 0;
  const container = useRef(null);
  const direction = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const md = useTransform(scrollYProgress, [0.5, 1], [0, -200]);

  const [isMdScreen, setIsMdScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMdScreen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
    <div
      ref={container}
      className="h-screen relative flex w-full flex-col lg:flex-row overflow-hidden justify-center items-center px-4"
    >
      <div className="h-full absolute w-full lg:w-[60vw] px-8 left-0 top-0 flex flex-col items-center py-10 justify-between">
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
          className="relative md:top-[8vh] text-[#ecebeb] text-3xl md:ml-10 lg:ml-0"
        >
          <div className="md:absolute right-0 lg:relative">
            <h1 className="mt-5 text-lg hidden md:block">Latest project</h1>

            <div className="">
              <Link
                href={`/project/${id}`}
                className="lg:w-[450px] relative lg:h-[250px] md:w-[400px] md:h-[250px] hidden md:block"
              >
                <Image fill src={imgSrc} className="object-cover" alt="" />
                <div className="bg-black/80 hover:bg-white hover:text-black absolute bottom-0 text-sm md:text-lg text-[#ecebeb] flex justify-center items-center py-2 px-5">
                  View Project
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.6, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 1,
            times: [0, 0.4, 1],
            ease: "easeInOut",
          }}
          className="w-full overflow-x-hidden relative bottom-0"
        >
          <div
            ref={slider}
            className="relative z-50 md:z-0 lg:mb-10 flex whitespace-nowrap w-max will-change-transform"
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
        style={isMdScreen ? { y: md } : {}}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.7, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 2,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        className="absolute md:w-[40vw] md:right-0 w-full h-screen top-0 lg:h-screen"
      >
        <Image src={rustam2} className="object-cover" fill alt="" />
        <div className="absolute h-screen w-screen bg-stone-700 z-40 opacity-20 md:hidden" />
      </motion.div>
    </div>
  );
};

export default HeroSection;
