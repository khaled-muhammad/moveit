import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSmartphone, FiShare2, FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';

const OnboardingFlow = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Airsynca",
      subtitle: "Share content between devices instantly",
      content: (
        <div className="text-center">
          <motion.div
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FiShare2 className="w-16 h-16 text-white" />
          </motion.div>
          <p className="text-gray-300 text-lg leading-relaxed">
            The simplest way to share text, links, images, and files between your devices.
            No apps to download, no accounts to create.
          </p>
        </div>
      )
    },
    {
      title: "How It Works",
      subtitle: "Three simple steps to start sharing",
      content: (
        <div className="space-y-8">
          {[
            { icon: BsQrCode, title: "1. Scan QR Code", desc: "Open Airsynca on your phone and scan the QR code" },
            { icon: FiShare2, title: "2. Share Content", desc: "Copy text, upload files, or paste links from any device" },
            { icon: FiSmartphone, title: "3. Access Anywhere", desc: "Your content appears instantly on all connected devices" }
          ].map((step, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="bg-violet-600 p-3 rounded-full flex-shrink-0">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "Privacy & Security",
      subtitle: "Your data stays private",
      content: (
        <div className="text-center">
          <motion.div
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
            animate={{ 
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FiShare2 className="w-16 h-16 text-white" />
          </motion.div>
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Content is never stored on our servers</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Direct device-to-device sharing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">End-to-end encrypted connections</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Open source and transparent</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Start?",
      subtitle: "Begin sharing in seconds",
      content: (
        <div className="text-center">
          <motion.div
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FiArrowRight className="w-16 h-16 text-white" />
          </motion.div>
          <p className="text-gray-300 text-lg mb-6">
            You're all set! Create your first room and start sharing content between your devices.
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400">
              <strong className="text-white">Pro tip:</strong> Bookmark this page for quick access, 
              or add it to your home screen on mobile devices.
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full relative border border-gray-700 shadow-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -50 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Close Button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FiX size={24} />
        </button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
            <button 
              onClick={onSkip}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Skip Tutorial
            </button>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px] flex flex-col justify-center"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-400 text-lg">
                {steps[currentStep].subtitle}
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              {steps[currentStep].content}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <FiArrowLeft />
            Previous
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-violet-500' 
                    : index < currentStep 
                      ? 'bg-gray-600' 
                      : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-500 hover:to-blue-500 transition-all"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <FiArrowRight />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingFlow;
