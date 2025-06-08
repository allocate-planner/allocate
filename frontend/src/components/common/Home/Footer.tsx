import { motion } from "framer-motion";
import { footerVariants } from "./MotionVariants";

const Footer = () => {
  return (
    <motion.footer
      className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8 lg:px-12 py-6 md:py-8 border-t border-gray-100 space-y-4 md:space-y-0"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex items-center">
        <span className="text-sm font-medium">allocate</span>
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
        <a href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Terms of Service
        </a>
        <a href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Privacy
        </a>
        <span className="text-sm text-gray-400">© 2025 allocate. All rights reserved.</span>
      </div>
    </motion.footer>
  );
};

export default Footer;
