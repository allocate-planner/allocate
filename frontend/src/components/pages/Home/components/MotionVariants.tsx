export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

export const heroContentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.5,
      ease: "easeOut",
    },
  },
};

export const heroImageVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: "easeOut",
      delay: 0.3,
    },
  },
};
