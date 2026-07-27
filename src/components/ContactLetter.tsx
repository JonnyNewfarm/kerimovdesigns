"use client";

import { motion } from "framer-motion";

export default function ContactLetter() {
  const pathAnimation = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
    },
  };

  return (
    <motion.svg
      width="90"
      height="90"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Konvoluttramme */}
      <motion.path
        d="M7 12H41V36H7V12Z"
        variants={pathAnimation}
        transition={{
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      {/* Bretten fra toppen */}
      <motion.path
        d="M8 13L24 26L40 13"
        variants={pathAnimation}
        transition={{
          duration: 0.7,
          delay: 0.35,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      {/* Nederste venstre brett */}
      <motion.path
        d="M8 35L19 24"
        variants={pathAnimation}
        transition={{
          duration: 0.45,
          delay: 0.7,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      {/* Nederste høyre brett */}
      <motion.path
        d="M40 35L29 24"
        variants={pathAnimation}
        transition={{
          duration: 0.45,
          delay: 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </motion.svg>
  );
}
