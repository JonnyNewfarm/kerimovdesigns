import type { Variants } from "framer-motion";

export const DETAILS_EASE = [0.16, 1, 0.3, 1] as const;

export const detailsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.53,
      staggerChildren: 0.13,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.055,
      staggerDirection: -1,
    },
  },
};

export const detailsTextVariants: Variants = {
  hidden: { opacity: 0, y: 17, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: DETAILS_EASE },
  },
  exit: {
    opacity: 0,
    y: -9,
    filter: "blur(4px)",
    transition: { duration: 0.26, ease: "easeOut" },
  },
};
