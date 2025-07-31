import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { FiX } from "react-icons/fi";

export const CloseButton = ({ onClick = null }) => {
  const orbitControls = useAnimation();

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => {
        orbitControls.start({
          rotate: 360,
          transition: {
            repeat: Infinity,
            duration: 4,
            ease: "linear",
          },
        });
      }}
      onHoverEnd={() => {
        orbitControls.stop();
        // orbitControls.set({ rotate: 0 });
      }}
      className="absolute top-5 right-5 group p-2 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 backdrop-blur-sm border border-violet-400/30 hover:from-violet-500/40 hover:to-purple-600/40 transition-all duration-300 shadow-lg hover:shadow-violet-500/25"
      whileHover={{ scale: 1.1, cursor: "pointer" }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300" />

      <motion.div
        className="absolute inset-0"
        animate={orbitControls}
        // initial={{ rotate: 0 }}
      >
        <div className="absolute -top-1 right-1 w-2 h-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full shadow-sm group-hover:shadow-violet-400/50 transition-all duration-300" />
      </motion.div>

      <FiX
        size={18}
        className="relative z-10 text-violet-200 group-hover:text-white transition-colors duration-300"
      />
    </motion.button>
  );
};