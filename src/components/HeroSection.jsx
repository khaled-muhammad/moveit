import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSmartphone, FiMonitor, FiShare2, FiArrowRight, FiZap, FiShield, FiUsers, FiWifi } from 'react-icons/fi';

const HeroSection = ({ onGetStarted }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Share in 3 Seconds",
      description: "Instant content sharing between any devices"
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your data stays on your devices, never stored"
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "No Sign-up Required",
      description: "Just scan and start sharing immediately"
    },
    {
      icon: <FiWifi className="w-8 h-8" />,
      title: "Works Everywhere",
      description: "Any browser, any device, any platform"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const AnimatedDeviceFlow = () => (
    <div className="relative w-full max-w-4xl mx-auto h-64 flex items-center justify-center">
      {/* Desktop Device */}
      <motion.div
        className="absolute left-0 flex flex-col items-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 shadow-2xl border border-gray-700">
          <FiMonitor className="w-16 h-16 text-violet-400" />
        </div>
        <span className="text-sm text-gray-400 mt-2">Desktop</span>
      </motion.div>

      {/* Content Flow Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {/* Animated content particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-violet-400 rounded-full"
              animate={{
                x: [0, 200, 400],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        
        {/* Share icon in center */}
        <motion.div
          className="absolute bg-violet-600 p-3 rounded-full shadow-lg"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FiShare2 className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Mobile Device */}
      <motion.div
        className="absolute right-0 flex flex-col items-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-2xl border border-gray-700">
          <FiSmartphone className="w-16 h-16 text-violet-400" />
        </div>
        <span className="text-sm text-gray-400 mt-2">Mobile</span>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-blue-900/20" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-blue-200 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Share Anything
            <br />
            <span className="text-violet-400">In 3 Seconds</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            The fastest way to share text, links, images, and files between your devices. 
            No apps, no accounts, no hassle.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={onGetStarted}
              className="group brain-boom-btn text-lg px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-300 shadow-2xl hover:shadow-violet-500/25"
            >
              Get Started Now
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-2 text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full border-2 border-gray-800" />
                ))}
              </div>
              <span className="text-sm">Join 10,000+ users sharing daily</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Animated Device Flow */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <AnimatedDeviceFlow />
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl border transition-all duration-500 ${
                currentFeature === index 
                  ? 'bg-violet-600/20 border-violet-500 shadow-lg shadow-violet-500/25' 
                  : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              animate={currentFeature === index ? { scale: 1.05 } : { scale: 1 }}
            >
              <div className={`mb-3 ${currentFeature === index ? 'text-violet-400' : 'text-gray-400'}`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500"
        >
          <div className="flex items-center gap-2">
            <FiShield className="w-5 h-5" />
            <span className="text-sm">100% Private</span>
          </div>
          <div className="flex items-center gap-2">
            <FiZap className="w-5 h-5" />
            <span className="text-sm">Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUsers className="w-5 h-5" />
            <span className="text-sm">No Registration</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
