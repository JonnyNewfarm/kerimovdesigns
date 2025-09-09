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
      className="w-full px-6 md:px-20 lg:px-1 py-16 bg-dark flex flex-col gap-y-32"
    >
      <div className="w-full flex flex-col lg:flex-row items-center justify-between lg:px-20 gap-6 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-color lg:w-1/2 text-left"
        >
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-semibold uppercase mb-4">
            Hi, I’m Rustam — a 27-year-old passionate graphic designer.{" "}
          </h2>
          <p className="text-md md:text-lg lg:text-xl leading-relaxed">
            I specialize in creating visual identities, animations, and logos
            that bring ideas to life. Design, for me, is more than work — it’s a
            way of turning imagination into something people can see and feel.
            My inspiration comes from everywhere: art, movies, and the world
            around me.
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

      <div className="w-full lg:px-20  flex flex-col lg:flex-row-reverse items-center justify-between  lg:gap-12">
        <motion.div
          style={isLg ? { y } : {}}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-color lg:w-1/2 text-left lg:text-right"
        >
          <h2 className="text-3xl uppercase md:text-4xl px-4 lg:text-4xl font-semibold mb-4">
            Creative & Aspirational
          </h2>
          <p className="text-md md:text-lg px-4 lg:text-xl leading-relaxed">
            I design with the purpose of giving each client a unique identity
            that speaks to who they are. Whether it’s a complete brand system or
            a simple logo, my focus is on creating work that connects, stands
            out, and lasts.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="relative w-full lg:w-1/2 mt-6 md:mt-0 md:aspect-[3/4]"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
            src="/echo-vid.mp4"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AnimDisplay;
