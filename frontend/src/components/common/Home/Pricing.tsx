import { motion } from "framer-motion";
import {
  containerVariants,
  headerVariants,
  cardVariants,
} from "./MotionVariants";
import PricingCard from "./PricingCard";

const Pricing = () => {
  return (
    <motion.div
      className="w-full flex flex-col justify-center items-center px-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="flex flex-col text-center"
        variants={headerVariants}
      >
        <div className="flex flex-col md:flex-row items-center justify-center md:space-x-12 mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Pricing Plans
          </h1>
          <motion.img
            src="/dollar.svg"
            alt="Dollar Sign"
            className="hidden md:block md:mt-8"
          />
        </div>
        <p className="text-base md:text-lg font-light max-w-md px-4">
          No surprises, no hidden fees. Just simple, transparent pricing.
        </p>
      </motion.div>

      <motion.div
        className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3 grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 lg:p-12 gap-8 md:gap-12 lg:gap-24"
        variants={containerVariants}
      >
        <motion.div variants={cardVariants}>
          <PricingCard
            title="Free"
            subtitle="Plan for Regular Users"
            point_1="Import Calendar events"
            point_2="Limited AI voice commands (5 per day)"
            point_3="Psychology techniques & tricks"
            point_4="Clean + Intuitive UI"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <PricingCard
            title="Pro"
            subtitle="Plan for Power"
            point_1="Import Calendar events"
            point_2="Unlimited AI voice commands"
            point_3="Psychology techniques & tricks"
            point_4="Cross-Sync with other Calendar"
            pricing="5"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Pricing;
