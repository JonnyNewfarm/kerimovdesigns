"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
  overlayColor?: string;
  duration?: number;
}

export default function ViewTransitionWrapper({
  children,
  overlayColor = "#fff",
  duration = 0.75,
}: Props) {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);
  const [showOverlay, setShowOverlay] = useState(false);

  // client dimensions
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setViewport({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  // sequence overlay animation on route change
  useEffect(() => {
    if (pathname === currentPath) return;

    // show overlay (expand)
    setShowOverlay(true);

    // after expand duration, swap page
    const swapTimeout = setTimeout(() => {
      setCurrentPath(pathname);
      // then hide overlay (shrink)
      const hideTimeout = setTimeout(() => {
        setShowOverlay(false);
      }, duration * 1000);
      return () => clearTimeout(hideTimeout);
    }, duration * 1000);

    return () => clearTimeout(swapTimeout);
  }, [pathname, currentPath, duration]);

  const maxRadius =
    Math.sqrt(viewport.w * viewport.w + viewport.h * viewport.h) + 50;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPath}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* overlay */}
      {viewport.w > 0 && viewport.h > 0 && (
        <motion.svg
          className="fixed inset-0 z-[9999] w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id="reveal-clip">
              <motion.circle
                cx="92"
                cy="50"
                r={showOverlay ? (maxRadius / viewport.w) * 100 : 0}
                initial={{ r: 0 }}
                animate={{
                  r: showOverlay ? (maxRadius / viewport.w) * 100 : 0,
                }}
                transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
              />
            </clipPath>
          </defs>
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            clipPath="url(#reveal-clip)"
            fill={overlayColor}
          />
        </motion.svg>
      )}
    </div>
  );
}
