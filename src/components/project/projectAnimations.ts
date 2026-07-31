export const projectEase = [0.22, 1, 0.36, 1] as const;

export const projectLayoutEase = [0.16, 1, 0.3, 1] as const;

export const fieldVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.85,
      ease: projectEase,
    },
  },
};