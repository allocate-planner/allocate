import { motion } from "motion/react";
import { containerVariants, headerVariants, imageVariants, textVariants } from "./MotionVariants";
import { Button } from "../Button";

const PrimaryContent = () => {
  return (
    <motion.div
      className="h-5/6 w-full flex flex-col 2xl:flex-row space-y-8 2xl:space-y-0 2xl:space-x-24 2xl:pr-12 justify-center items-center px-4 md:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-topography justify-center items-center w-full 2xl:w-2/5 h-5/6 space-y-4"
        variants={headerVariants}
      >
        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-4xl md:text-5xl 2xl:text-7xl font-light p-4 sm:p-8 2xl:p-12 text-center 2xl:text-left 2xl:w-full"
        >
          Increase your productivity ten-fold with the help of a voice controlled AI-powered day
          planner.
        </motion.h1>
        <div className="flex-grow relative hidden 2xl:block">
          <motion.img
            src="/stroke.svg"
            alt="Arrow"
            className="scale-80 ml-80 -mt-12"
            variants={headerVariants}
          />
        </div>
        <div className="flex justify-center 2xl:justify-start 2xl:pl-14 pb-8">
          <Button className="bg-violet-500 hover:bg-violet-700 rounded-2xl font-light w-[500px] text-sm sm:text-base px-6 py-3">
            <span className="font-semibold">Introductory Offer&nbsp;</span> — only&nbsp;
            <span className="underline">$3</span>&nbsp;a month!
          </Button>
        </div>
      </motion.div>
      <motion.div className="w-full 2xl:w-3/5 hidden lg:block" variants={imageVariants}>
        <motion.img
          src="/calendar.png"
          alt="An image showcasing the Allocate Calendar"
          className="w-full h-auto"
        />
      </motion.div>
    </motion.div>
  );
};

export default PrimaryContent;
