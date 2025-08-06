import { useState, useEffect } from "react";
import { FiClipboard, FiCopy, FiGithub, FiInfo, FiPlus, FiShare2, FiX, FiSend, FiMaximize, FiMaximize2 } from "react-icons/fi";
import { useSession } from "../components/SessionProvider";
import { useWebSocketContext } from "../components/WebSocketProvider";
import QRCodeDisplay from "../components/QRCodeDisplay";
import Logo from "../components/Logo";
import StickyNoteContainer from "../components/StickyNoteContainer";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CloseButton } from "../components/closeBtn";
import NoteForm from "../components/NoteForm";
import { useAuth } from "../contexts/AuthContext";

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
            className="fixed inset-0 bg-black/10 bg-opacity-70 backdrop-blur-sm z-9999999999 flex items-center justify-center p-4 overflow-hidden"
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
  const { session, setSession } = useSession();
  const { isConnected, connectedDevices, lastJsonMessage, sharedClipboards, shareClipBoard, setShouldConnect, saveBeam } = useWebSocketContext();
  const queryParams = new URLSearchParams(window.location.search);
  const queryBeamId = queryParams.get('beam_id');
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const [isNoteEditorFullScreen, setIsNoteEditorFullScreen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [beamName, setBeamName] = useState('');

  useEffect(() => {
    if (queryBeamId != null && (!session || session.beam_id !== queryBeamId)) {
      console.log("Setting session from URL beam_id:", queryBeamId)
      setSession({
        beam_id: queryBeamId,
        beam_key: null,
        beam_name: 'Untitled Beam'
      })
      const url = new URL(window.location.href)
      window.history.replaceState({}, '', url)
    }
  }, [queryBeamId, session?.beam_id])

  useEffect(() => {
    if (session != null) {
      console.log("Session beam_id:", session.beam_id)
      console.log(session)
      setShouldConnect('auto')
    }
  }, [session?.beam_id, setShouldConnect])

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.type === 'auth_sucess') {
        toast("Beaming");
      } else {
        // toast(lastJsonMessage.message);
      }
    }
  }, [lastJsonMessage])

  useEffect(() => {
    if (isNoteEditorFullScreen) {
      document.body.style.overflowY = 'hidden';
      setTimeout(() => {
        document.body.scrollTo({top:0})
      }, 500)
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [isNoteEditorFullScreen])

  const pasteClipboard = () => {
    navigator.clipboard.readText().then((clipboardContent) => {
      if (!clipboardContent) {
        toast("Your clipboard is empty!")
        return;
      }
      if (sharedClipboards.filter((cb) => cb.content == clipboardContent).length == 0) {
        shareClipBoard(clipboardContent)
      }
    })
  }

  const handleAddMessage = () => {
    if (messageInput.trim()) {
      shareClipBoard(messageInput.trim());
      setMessageInput('');
      setIsToolbarExpanded(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddMessage();
    }
  };

  const handleShareBeam = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Moveit Beam",
          text: `Join my Beam on Moveit!`,
          url: `${window.location.origin}?beam_id=${session.beam_id}`,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported on this device/browser.");
    }
  };

  const handleSaveBeam = () => {
    if (beamName.trim()) {
      saveBeam(beamName.trim());
      setShowSaveModal(false);
      setBeamName('');
      toast.success('Beam saved successfully!');
    } else {
      toast.error('Please enter a beam name');
    }
  }

  const handleSaveClick = () => {
    setShowSaveModal(true);
  }

  return (
    <>
      <section
        id="main"
        className="flex justify-center items-center gap-5 flex-col min-h-[100vh]"
      >
        <div className={`fixed bottom-0 left-0 mb-8 ml-8 bg-white rounded-md z-[11]`}>
          {connectedDevices.length > 1 && session && (
            <div className="relative group hover:cursor-pointer" onClick={() => {
            navigator.clipboard.writeText(session.beam_id)
              .then(() => {
                toast("Beam ID copied successfully");
              })
              .catch((err) => {
                toast("Failed to copy beam ID!");
              });
            }}>
              <QRCodeDisplay session={`${window.location.origin}?beam_id=${session.beam_id}`} size={100} className="group" />
              <div className="absolute inset-0 bg-purple-400/70 z-[9999] rounded-md flex justify-center items-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                <span className="font-bold text-white pointer-events-none">Copy</span>
              </div>
            </div>
          )}
        </div>

        {connectedDevices.length <= 1 && session && (
          <QRCodeDisplay session={`${window.location.origin}?beam_id=${session.beam_id}`} size={300} className="mb-10 transition-all duration-300 hover:scale-125" />
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
          <button className="brain-boom-btn" onClick={() => {
            navigator.clipboard.writeText(session.beam_id).then(() => {
              toast("Beam ID copied successfully")
            }).catch((err) => {
              toast.error("Failed to copy Beam ID!")
            })
          }}><FiCopy /> Copy</button>
        </div>}
        {sharedClipboards.length > 0 && <StickyNoteContainer />}
        
        {sharedClipboards.length > 0 && isAuthenticated && session.beam_name == null && <motion.div
          className={`fixed ${isNoteEditorFullScreen ? 'z-[100]' : 'z-[11]'}`}
          animate={{
            bottom: isNoteEditorFullScreen ? "20px" : sharedClipboards.length > 0 ? "80px" : "20px",
            left: isNoteEditorFullScreen ? "auto" : "calc(50% + 120px)",
          }}
          transition={{
            type: "spring", 
            stiffness: 200, 
            damping: 25,
            duration: 0.4
          }}
        >
          <motion.button
            className="bg-violet-600/20 backdrop-blur-md ring-2 ring-violet-700 p-4 rounded-2xl cursor-pointer hover:bg-violet-500/30 transition-colors shadow-lg"
            whileTap={{ scale: 0.9 }}
            onClick={handleSaveClick}
          >
            Save
          </motion.button>
        </motion.div>}
        
        {
          <motion.div
            className={`toolbar fixed ${isNoteEditorFullScreen? 'z-[100]' : 'z-[11]'} px-6 py-3 bg-violet-600/20 backdrop-blur-md ring-2 ring-violet-700 flex gap-10 justify-center items-center`}
            animate={{
              width: isNoteEditorFullScreen ? "100%" : isToolbarExpanded ? "400px" : "200px",
              minWidth: isNoteEditorFullScreen ? "100%" : isToolbarExpanded ? "400px" : "200px",
              height: isNoteEditorFullScreen ? "100%" : isToolbarExpanded ? "80px" : "60px",
              minHeight: isNoteEditorFullScreen ? "100%" : isToolbarExpanded ? "80px" : "60px",
              bottom: isNoteEditorFullScreen ? "0" : sharedClipboards.length > 0 ? "80px" : "20px",
              borderRadius: isNoteEditorFullScreen ? "0" : "16px",
              left: isNoteEditorFullScreen ? "0" : "auto",
              right: isNoteEditorFullScreen ? "0" : "auto",
              top: isNoteEditorFullScreen ? "0" : "auto",
            }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 25,
              duration: 0.4
            }}
            style={{
              width: isToolbarExpanded ? "400px" : "200px",
              minWidth: isToolbarExpanded ? "400px" : "200px",
              height: isToolbarExpanded ? "80px" : "60px",
              minHeight: isToolbarExpanded ? "80px" : "60px",
            }}
          >
            {
              isNoteEditorFullScreen && <CloseButton
                  onClick={() => {
                    setIsToolbarExpanded(false)
                    setIsNoteEditorFullScreen(false)
                  }}
                />
            }
            {isNoteEditorFullScreen? '' : !isToolbarExpanded ? (
              <motion.div
                className="flex gap-10 justify-center items-center w-full"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className="toolbar-btn"
                  onClick={pasteClipboard}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiClipboard size={22} />
                </motion.button>
                <motion.button
                  className="toolbar-btn"
                  onClick={() => setIsToolbarExpanded(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiPlus size={22} />
                </motion.button>
                <motion.button
                  className="toolbar-btn"
                  onClick={handleShareBeam}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiShare2 size={22} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center gap-3 w-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <motion.button
                  onClick={() => setIsToolbarExpanded(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={20} />
                </motion.button>
                <motion.input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm"
                  autoFocus
                />
                <motion.button
                  onClick={handleAddMessage}
                  disabled={!messageInput.trim()}
                  className={`p-2 rounded-full transition-all ${
                    messageInput.trim() 
                      ? 'bg-violet-500 hover:bg-violet-600 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={messageInput.trim() ? { scale: 1.1 } : {}}
                  whileTap={messageInput.trim() ? { scale: 0.9 } : {}}
                >
                  <FiSend size={16} />
                </motion.button>
              </motion.div>
            )}
            {isToolbarExpanded && !isNoteEditorFullScreen && (
              <motion.button
                className="absolute -top-7 -right-7 bg-violet-600/20 backdrop-blur-md ring-2 ring-violet-700 p-2 rounded-full cursor-pointer hover:bg-violet-500/30 transition-colors"
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: 0.2
                }}
                whileHover={{ rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsNoteEditorFullScreen(true)
                }}
              >
                <FiMaximize2 size={16} />
              </motion.button>
            )}
            {isNoteEditorFullScreen && <div className="h-[90vh] w-[100%] mt-15 overflow-y-auto purple-scrollbar"><NoteForm
              onCancel={() => {
                setIsNoteEditorFullScreen(false);
              }}
              onSave={(note) => {
                shareClipBoard(note, 'lexi_note')
                setIsNoteEditorFullScreen(false);
                setIsToolbarExpanded(false);
              }}
            /></div>}
          </motion.div>
        }
        {sharedClipboards.length > 0 && <p className="fixed bottom-0 mb-10 font-medium opacity-60">Double Click a note to copy</p>}
      </section>

      {/* Save Beam Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div 
              className="bg-[#1A1B2E] rounded-xl p-6 max-w-md w-full relative"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: '0 0 20px rgba(127, 90, 240, 0.5), inset 0 0 10px rgba(127, 90, 240, 0.2)',
                border: '1px solid rgba(127, 90, 240, 0.3)',
              }}
            >
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                onClick={() => setShowSaveModal(false)}
              >
                <FiX size={24} />
              </button>
              
              <h2 className="text-2xl font-bold mb-4 text-center text-white">
                Save Beam
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Beam Name
                </label>
                <input
                  type="text"
                  value={beamName}
                  onChange={(e) => setBeamName(e.target.value)}
                  placeholder="Enter beam name..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveBeam();
                    }
                  }}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBeam}
                  disabled={!beamName.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    beamName.trim() 
                      ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DesktopPage;
