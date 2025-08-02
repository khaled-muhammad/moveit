import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShare2,
  FiPlus,
  FiClipboard,
  FiX,
  FiCopy,
  FiLink,
  FiFileText,
} from "react-icons/fi";

const SpaceMenuPage = ({ onClose, onCreate, onPaste, onShare }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const handleCreate = () => {
    handleClose();
    onCreate?.();
  };

  const handlePaste = async () => {
    try {
      const clipboardContent = await navigator.clipboard.readText();
      onPaste?.(clipboardContent);
    } catch (error) {
        console.log(error);
    }
    handleClose();
  };

  const handleShare = () => {
    handleClose();
    onShare?.();
  };

  const menuItems = [
    {
      id: "create",
      icon: <FiPlus size={20} />,
      title: "Create",
      description: "Create a new note or content",
      color: "from-purple-500 to-indigo-600",
      action: handleCreate,
    },
    {
      id: "paste",
      icon: <FiClipboard size={20} />,
      title: "Paste",
      description: "Paste from clipboard",
      color: "from-indigo-500 to-blue-600",
      action: handlePaste,
    },
    {
      id: "share",
      icon: <FiShare2 size={20} />,
      title: "Share",
      description: "Share your workspace",
      color: "from-blue-500 to-cyan-600",
      action: handleShare,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-violet-950/50 backdrop-blur-sm z-[91474836489999999] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            onClick={handleClose}
          >
            <FiX size={24} />
          </button>

          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Space Menu</h2>
          </motion.div>

          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 group relative overflow-hidden`}
                onClick={item.action}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(127, 90, 240, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: `linear-gradient(135deg, ${item.color})`,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white group-hover:bg-white/30 transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div
            className="mt-6 pt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-500 text-xs flex items-center gap-1">
              Tap <FiX color="white" /> or click outside to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpaceMenuPage;
