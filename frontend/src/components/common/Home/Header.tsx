import { Button } from "../Button";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { hamburgerVariants } from "./MotionVariants";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClickScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center w-full p-4 md:p-8 lg:p-12">
        <img src="/logo.svg" alt="Allocate Logo" className="h-8 md:h-auto" />
        <div className="hidden md:flex flex-row justify-center items-center text-center space-x-16">
          <a
            onClick={() => handleClickScroll("features")}
            className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500 transition-colors"
          >
            Features
          </a>
          <a
            onClick={() => handleClickScroll("pricing")}
            className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500 transition-colors"
          >
            Pricing
          </a>
        </div>

        <div className="hidden md:flex flex-row justify-center items-center text-center space-x-8">
          <a
            href="/login"
            className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500 transition-colors"
          >
            Login
          </a>
          <a href="/register">
            <Button className="bg-violet-500 hover:bg-violet-700 px-4 py-2">
              Sign Up
            </Button>
          </a>
        </div>
        <motion.button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="absolute top-full right-4 bg-white shadow-lg md:hidden rounded-lg"
            variants={hamburgerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col space-y-4 p-6 min-w-[200px]">
              <a
                onClick={() => handleClickScroll("features")}
                className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500 transition-colors"
              >
                Features
              </a>
              <a
                onClick={() => handleClickScroll("pricing")}
                className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500 transition-colors"
              >
                Pricing
              </a>
              <a
                href="/login"
                className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500 transition-colors"
              >
                Login
              </a>
              <a href="/register">
                <Button className="bg-violet-500 hover:bg-violet-700 px-4 py-2 w-full">
                  Sign Up
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
