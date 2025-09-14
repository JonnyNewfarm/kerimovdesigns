"use client";
import React, { useRef } from "react";
import LogoRow from "./LogoRow";
import { MotionValue, useScroll, useTransform, motion } from "framer-motion";

const LogoParallax = () => {
  const firstRow = [
    "/logos/logo1.jpg",
    "/logos/logo2.jpg",
    "/logos/logo3.jpg",
    "/logos/logo4.jpg",
  ];
  const secondRow = [
    "/logos/logo5.jpg",
    "/logos/logo6.jpg",
    "/logos/logo7.jpg",
    "/logos/logo8.jpg",
  ];

  const thirdRow = [
    "/logos/logo6.jpg",
    "/logos/logo1.jpg",
    "/logos/logo8.jpg",
    "/logos/logo4.jpg",
  ];
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  return (
    <div className="flex mb-16 flex-col relative text-left  overflow-hidden w-full items-center justify-center gap-y-5">
      <div className="relative w-full text-left  px-5">
        <h1 className="text-left font-semibold text-xl md:text-3xl">
          Logos that get you noticed
        </h1>
        <p className="text-lg md:text-xl mb-3">
          Simple, fresh, and made to stick with your vibe.
        </p>
      </div>
      <div className="space-y-16">
        <Slider
          direction="left"
          progress={scrollYProgress}
          left="10%"
          src={firstRow}
        />
        <Slider
          direction="right"
          progress={scrollYProgress}
          left="-15%"
          src={thirdRow}
        />
      </div>
    </div>
  );
};

export default LogoParallax;

interface sliderProps {
  src: string[];
  left: string;
  progress: MotionValue<number>;
  direction: string;
}
const Slider = ({ src, left, progress, direction }: sliderProps) => {
  const dir = direction == "left" ? -1 : 1;
  const x = useTransform(progress, [0, 1], [-250 * dir, 250 * dir]);

  return (
    <motion.div
      style={{ left, x }}
      className="flex gap-x-10 md:gap-x-20 relative whitespace-nowrap w-max"
    >
      <LogoRow src={src} />
      <LogoRow src={src} />
      <LogoRow src={src} />
    </motion.div>
  );
};
