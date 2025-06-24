export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

export const headerVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.5,
      ease: "easeOut",
    },
  },
};
