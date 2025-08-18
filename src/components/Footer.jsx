import { FiGithub, FiHeart, FiCoffee, FiFileText, FiShield, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
                Airsynca
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Instant content sharing between devices with persistent sessions and collaborative workspaces.
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
                href="mailto:support@airsynca.com"
                className="flex items-center gap-2 text-gray-400 hover:text-[#7F5AF0] transition-colors duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCoffee className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium">Customer Support</span>
              </motion.a>
              
              <motion.a
                href="/pricing"
                className="flex items-center gap-2 text-gray-400 hover:text-[#7F5AF0] transition-colors duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDollarSign className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium">Pricing</span>
              </motion.a>
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <motion.div className="flex items-center gap-4">
                <Link 
                  to="/terms"
                  className="text-gray-500 hover:text-[#7F5AF0] transition-colors duration-300 flex items-center gap-1"
                >
                  <FiFileText className="text-xs" />
                  Terms
                </Link>
                <Link 
                  to="/privacy"
                  className="text-gray-500 hover:text-[#7F5AF0] transition-colors duration-300 flex items-center gap-1"
                >
                  <FiShield className="text-xs" />
                  Privacy
                </Link>
                <Link 
                  to="/refund"
                  className="text-gray-500 hover:text-[#7F5AF0] transition-colors duration-300 flex items-center gap-1"
                >
                  <FiDollarSign className="text-xs" />
                  Refund
                </Link>
              </motion.div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Trusted by thousands of users worldwide</span>
            </div>
          </motion.div>

          <motion.div 
            className="text-center md:text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-gray-500 text-sm">
              © {currentYear} Airsynca. All rights reserved.
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
              <span>Instant Sharing</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span>30-Day Money Back Guarantee</span>
              <span>•</span>
              <span>Secure & Reliable</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;