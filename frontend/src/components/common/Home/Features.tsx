import {
  BoltIcon,
  MicrophoneIcon,
  SparklesIcon,
  ArrowPathIcon,
  StarIcon,
  CloudArrowDownIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  containerVariants,
  headerVariants,
  cardVariants,
} from "./MotionVariants";
import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <motion.div
      className="w-full flex flex-col justify-center items-center space-y-8 px-4 py-12 md:py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="flex flex-col space-y-2 md:-space-y-4 text-center"
        variants={headerVariants}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
          Only the features you want
        </h1>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center justify-center">
          <p className="text-base md:text-lg font-light">
            Everything you need to manage your schedule efficiently and
            effortlessly.
          </p>
          <motion.img
            src="/scribble.svg"
            alt="Scribble"
            className="hidden md:block md:mt-8"
          />
        </div>
      </motion.div>

      <motion.div
        className="bg-wiggle w-full md:w-4/5 lg:w-3/4 xl:w-2/3 grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 lg:p-12 rounded-3xl gap-4 md:gap-6 lg:gap-8"
        variants={containerVariants}
      >
        <motion.div
          variants={cardVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <FeatureCard
            Icon={BoltIcon}
            title="Psychology"
            description="Let us build your daily schedule using science-backed productivity patterns with the use of AI."
          />
        </motion.div>
        <motion.div
          variants={cardVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <FeatureCard
            Icon={MicrophoneIcon}
            title="Dialogue"
            description="Simply talk to your calendar to schedule your entire day - no manual actions needed."
          />
        </motion.div>
        <motion.div
          variants={cardVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <FeatureCard
            Icon={SparklesIcon}
            title="Simplicity"
            description="A clean, minimalist interface that helps you focus on your day without distractions."
          />
        </motion.div>
        <motion.div
          variants={cardVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <FeatureCard
            Icon={ArrowPathIcon}
            title="Universal"
            description="Import your schedules from Google Calendar, Proton Calendar and others in just one click."
          />
        </motion.div>
        <motion.div
          variants={cardVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <FeatureCard
            Icon={StarIcon}
            title="Priorities"
            description="Got certain goals? Our AI will keep those in mind, and create a perfect day for you."
          />
        </motion.div>
        <motion.div
          variants={cardVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <FeatureCard
            Icon={CloudArrowDownIcon}
            title="Integration"
            description="Need to use Google Calendar? We have cross-sync enabled, making it a breeze."
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Features;
