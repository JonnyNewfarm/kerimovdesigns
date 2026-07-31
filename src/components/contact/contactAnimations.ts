export const contactEase = [0.76, 0, 0.24, 1] as const;

export const panelVariants = {
  hidden: {
    y: "100%",
  },

  visible: {
    y: "0%",
    transition: {
      duration: 0.9,
      ease: contactEase,
    },
  },

  exit: {
    y: "100%",
    transition: {
      duration: 0.75,
      ease: contactEase,
    },
  },
};

export const backdropVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: contactEase,
    },
  },

  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: contactEase,
    },
  },
};