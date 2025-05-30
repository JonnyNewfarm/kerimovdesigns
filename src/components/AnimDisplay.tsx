"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const AnimDisplay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsLg(window.innerWidth >= 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-200, 250]);

  return (
    <div
      ref={containerRef}
      className="w-full px-6 md:px-20 lg:px-1 py-16 bg-[#242323] flex flex-col gap-y-32"
    >
      <div className="w-full flex flex-col lg:flex-row items-center justify-between lg:px-20 gap-6 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-white lg:w-1/2 text-left"
        >
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-semibold uppercase mb-4">
            Smooth visuals, bold impact
          </h2>
          <p className="text-md md:text-lg lg:text-xl leading-relaxed">
            I create animations that bring rhythm and emotion to design. From
            subtle transitions to expressive motion — every detail adds life.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="relative w-full lg:w-1/2 aspect-[16/9]"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
            src="/bylarm-anim.mp4"
          />
        </motion.div>
      </div>

      <div className="w-full lg:px-20  flex flex-col lg:flex-row-reverse items-center justify-between gap-6 lg:gap-12">
        <motion.div
          style={isLg ? { y } : {}}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-white lg:w-1/2 text-left lg:text-right"
        >
          <h2 className="text-3xl uppercase md:text-4xl px-4 lg:text-4xl font-semibold mb-4">
            Visual identity that sticks
          </h2>
          <p className="text-md md:text-lg px-4 lg:text-xl leading-relaxed">
            Whether it’s a logo or a full brand system, I build identities that
            are memorable, clear, and uniquely yours. Always tailored, never
            templated.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="relative w-full lg:w-1/2 aspect-[3/4]"
        >
          <Image
            src="/identity2.jpg"
            alt="Brand Identity"
            fill
            className="object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AnimDisplay;
