"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function SafePageTransition({ children }: Props) {
  const pathname = usePathname();
  const [displayPath, setDisplayPath] = useState(pathname);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (pathname !== displayPath) {
      setExiting(true);
    }
  }, [pathname, displayPath]);

  const handleExitComplete = () => {
    setDisplayPath(pathname);
    setExiting(false);
  };

  const slideUp = {
    initial: { y: 80, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 30, // softer spring
        damping: 20, // slightly less damping for smoother motion
        mass: 1.5, // heavier mass = slower
        delay: 0.1, // optional small delay
      },
    },
    exit: {
      y: -80,
      opacity: 0,
      transition: {
        duration: 1.2, // longer exit
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      <motion.div
        key={displayPath}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slideUp}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
