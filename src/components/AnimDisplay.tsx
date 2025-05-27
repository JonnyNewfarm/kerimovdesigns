"use client";
import React from "react";
import { motion } from "framer-motion";

const AnimDisplay = () => {
  return (
    <div className="min-h-[30vh] pb-10 bg-[#24232] mt-14 lg:mt-0 w-full flex flex-col lg:flex-row items-center justify-center gap-x-10 gap-y-14">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{
          scale: [0.8, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 2,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
        className="lg:w-[40vw] w-[80vw]"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-contain"
          src="/bylarm-anim.mp4"
        />
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{
          scale: [0.8, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 2.2,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="lg:w-[40vw] w-[80vw] hidden lg:block"
          src="bbs-anim.mp4"
        />
      </motion.div>
    </div>
  );
};

export default AnimDisplay;
