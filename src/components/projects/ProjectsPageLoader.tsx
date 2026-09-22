"use client";

import { motion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";

import HeroLoadingSpinner from "../hero/HeroLoadingSpinner";

export default function ProjectsPageLoader({
  children,
}: {
  children: ReactNode;
}) {
  const [pageReady, setPageReady] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const timeout = window.setTimeout(() => {
        setPageReady(true);

        window.setTimeout(() => {
          setShowContent(true);
        }, 520);
      }, 350);

      return () => {
        window.clearTimeout(timeout);
      };
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <HeroLoadingSpinner loaderComplete={pageReady} />

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: showContent ? 1 : 0,
        }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          pointerEvents: showContent ? "auto" : "none",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
