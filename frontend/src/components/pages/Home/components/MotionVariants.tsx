export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

export const heroContentVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.3,
    },
  },
};

export const heroImageVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 3,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.3,
    },
  },
};
