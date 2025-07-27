import { useState, useEffect } from "react";
import { FiGithub, FiInfo, FiX } from "react-icons/fi";
import { useSession } from "../components/SessionProvider";
import { useWebSocketContext } from "../components/WebSocketProvider";
import QRCodeDisplay from "../components/QRCodeDisplay";
import Logo from "../components/Logo";
import StickyNoteContainer from "../components/StickyNoteContainer";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const KnowMoreButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const features = [
    {
      title: "Instant Sharing",
      description: "Share text, links, images, audio, and videos between devices instantly.",
      color: "from-purple-400 to-indigo-500"
    },
    {
      title: "No Login Required",
      description: "Just scan the QR code with your mobile device and start sharing.",
      color: "from-indigo-400 to-blue-500"
    },
    {
      title: "Drag & Drop",
      description: "Organize your shared content with interactive sticky notes.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      title: "Privacy First",
      description: "Your data stays on your devices and is never stored on servers.",
      color: "from-cyan-400 to-teal-500"
    },
    {
      title: "Open Source",
      description: "MoveIt is completely open source and free to use.",
      color: "from-teal-400 to-green-500"
    }
  ];

  return (
    <>
      <button 
        className="brain-boom-btn group relative" 
        onClick={() => setIsOpen(true)}
      >
        <FiInfo className="mr-2" />
        Know More
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/10 bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              className="bg-[#1A1B2E] rounded-xl p-6 max-w-2xl w-full relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, rotateX: 30 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: -30 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: '0 0 20px rgba(127, 90, 240, 0.5), inset 0 0 10px rgba(127, 90, 240, 0.2)',
                border: '1px solid rgba(127, 90, 240, 0.3)',
              }}
            >
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiX size={24} />
              </button>
              
              <motion.h2 
                className="text-3xl font-bold mb-6 text-center goldman-regular text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 know-more-title"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                About MoveIt
              </motion.h2>
              
              <motion.p 
                className="text-gray-300 mb-8 text-center leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                MoveIt is a modern web application that allows you to easily share content between your devices.
                <br />
                <span className="text-purple-400">No downloads, no accounts, no hassle.</span> Just scan and share!
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className={`bg-gradient-to-br ${feature.color} p-4 rounded-lg shadow-lg know-more-feature-card`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        delay: index * 0.1,
                        duration: 0.1
                      }
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: Math.random() < 0.5 ? -1 : 1,
                      boxShadow: '0 10px 25px rgba(127, 90, 240, 0.5)'
                    }}
                    style={{}}
                  >
                    <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                    <p className="text-white text-opacity-90">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  className="brain-boom-btn mx-auto relative group"
                  whileHover={{ 
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="relative z-10">Got it!</span>
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl z-0 opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const DesktopPage = () => {
  const { session } = useSession();
  const { isConnected, connectedDevices, lastJsonMessage, sharedClipboards} = useWebSocketContext();

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.type === 'auth_sucess') {
        toast("Beaming");
      } else {
        // toast(lastJsonMessage.message);
      }
    }
  }, [lastJsonMessage])

  return (
    <>
      <section
        id="main"
        className="flex justify-center items-center gap-5 flex-col min-h-[100vh]"
      >
        <div className="fixed top-0 right-0 mt-8 mr-8 bg-white rounded-md">
          {connectedDevices.length > 1 && session && (
            <QRCodeDisplay session={`${window.location.origin}?beam_id=${session.beam_id}`} size={100} />
          )}
        </div>
        <Logo className="text-4xl" />

        {connectedDevices.length <= 1 && session && (
          <QRCodeDisplay session={`${window.location.origin}?beam_id=${session.beam_id}`} size={300} className="mb-10" />
        )}
        {sharedClipboards.length == 0 && <h1 className="text-3xl">
          {connectedDevices.length > 1? "Start Sharing" : "Scan the QR Code with your mobile phone to start sharing."}
        </h1>}
        {sharedClipboards.length == 0 && <h4>Share Clipboards / Links / Pictures / Videos</h4>}
        {sharedClipboards.length == 0 && <div className="flex gap-8 mt-2 brain-boom-btns">
          <KnowMoreButton />
          <a
            href="https://github.com/khaled-muhammad/moveit"
            target="_blank"
            rel="noopener noreferrer"
            className="brain-boom-btn"
          >
            <FiGithub />
            GitHub Repo
          </a>
        </div>}
        {sharedClipboards.length > 0 && <StickyNoteContainer />}
        {sharedClipboards.length > 0 && <p className="fixed bottom-0 mb-10 font-medium opacity-60">Double Click a note to copy</p>}
      </section>
      <Footer />
    </>
  );
};

export default DesktopPage;
