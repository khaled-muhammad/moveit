import { FiGithub, FiHeart, FiCoffee } from "react-icons/fi";
import { motion } from "framer-motion";

import logo from "../assets/logo.png"

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      className="w-full bg-gradient-to-t from-[#0F0F1A] to-[#1A1B2E] border-t border-[#7F5AF0]/20 backdrop-blur-sm relative z-50 shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div 
            className="flex flex-col items-center md:items-start text-center md:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <img src={logo} width={50} alt="logo" />
              <span className="text-2xl font-bold goldman-regular text-transparent bg-clip-text bg-gradient-to-r from-[#7F5AF0] to-[#9B6DFF]">
                MoveIt
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Instant content sharing between devices. No accounts, no hassle.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center gap-6">
              <motion.a
                href="https://github.com/khaled-muhammad/moveit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#7F5AF0] transition-colors duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiGithub className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium">GitHub</span>
              </motion.a>
              
              <motion.a
                href="#"
                className="flex items-center gap-2 text-gray-400 hover:text-[#7F5AF0] transition-colors duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCoffee className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium">Support</span>
              </motion.a>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FiHeart className="text-[#7F5AF0] text-xs" />
              </motion.div>
              <span>by Khaled Muhammad</span>
            </div>
          </motion.div>

          <motion.div 
            className="text-center md:text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-gray-500 text-sm">
              © {currentYear} MoveIt. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Open source & free forever
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 pt-6 border-t border-[#7F5AF0]/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span>Privacy First</span>
              <span>•</span>
              <span>No Data Collection</span>
              <span>•</span>
              <span>End-to-End Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Built with React & Django</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;