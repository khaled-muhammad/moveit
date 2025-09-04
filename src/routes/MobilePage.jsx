import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import toast from "react-hot-toast";
import { useSession } from "../components/SessionProvider";
import { useWebSocketContext } from "../components/WebSocketProvider";
import Logo from "../components/Logo";
import { FiClipboard, FiCopy, FiGrid, FiHome, FiUpload, FiWifi, FiUsers, FiShare2, FiX, FiUser, FiChevronUp, FiLogIn, FiUserPlus, FiPlus } from "react-icons/fi";
import { BsQrCode } from 'react-icons/bs';
import UploadButton from "../components/UploadBtn";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { uploadToUguu } from "../utils";
import { ConnectionStatus, LoadingSpinner, UploadProgress } from "../components/LoadingStates";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import ShareModal from "../components/ShareModal";
import StaticStickyNote from "../components/StaticStickyNote";


const MobilePage = () => {
  const [scanning, setScanning] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [activeTab, setActiveTab] = useState('share'); // 'share' or 'history'
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const [showSpaceMenu, setShowSpaceMenu] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { session, setSession } = useSession();
  const { isConnected, lastJsonMessage, shareClipBoard, sharedClipboards, setShouldConnect } = useWebSocketContext();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const queryBeamId = queryParams.get('beam_id');

  useState(() => {
    if (queryBeamId != null) {
      setScanning(false)
      setSession({
        beam_id: queryBeamId,
        beam_key: null
      })
      setShouldConnect('auto')
      const url = new URL(window.location.href)
      url.searchParams.delete('beam_id')
      window.history.replaceState({}, '', url)
    }
  }, [queryBeamId])

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.type === 'auth_sucess') {
        toast("Connected to Room");
      } else {
        // toast(lastJsonMessage.message);
      }
    }
  }, [lastJsonMessage])

  // Close auth menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAuthMenu && !event.target.closest('.auth-menu-container')) {
        setShowAuthMenu(false);
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showAuthMenu])

  const handleCreateNote = () => {
    setShowSpaceMenu(false);
    setShowNoteForm(true);
  };

  const handlePasteContent = async () => {
    try {
      const clipboardContent = await navigator.clipboard.readText();
      if (clipboardContent && clipboardContent.trim()) {
        if (sharedClipboards.filter((cb) => cb.content == clipboardContent.trim()).length == 0) {
          shareClipBoard(clipboardContent.trim());
          toast.success("Content pasted successfully!");
        } else {
          toast("This content is already shared!");
        }
      } else {
        toast.error("Clipboard is empty!");
      }
    } catch (error) {
      console.log('Paste error:', error);
      toast.error("Failed to access clipboard");
    }
    setShowSpaceMenu(false);
  };

  const handleShareWorkspace = () => {
    setShowSpaceMenu(false);
    setShowShareModal(true);
  };

  const handleSaveNote = (note) => {
    shareClipBoard(note, 'lexi_note');
    setShowNoteForm(false);
    toast.success("Note created successfully!");
  };

  const handleStartScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())
      setScanning(true)
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        toast.error("Camera permission denied. Please allow camera access to scan QR codes.");
      } else if (error.name === 'NotFoundError') {
        toast.error("No camera found. Please ensure your device has a camera.");
      } else if (error.name === 'NotSupportedError') {
        toast.error("Camera not supported in this browser.");
      } else {
        toast.error("Failed to access camera. Please try again.");
      }
      console.error('Camera error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.div 
        className="sticky top-0 right-0 z-[91474836489999998]"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-end p-4">
          {session && (
            <motion.button
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              onClick={() => setShowConnectionStatus(!showConnectionStatus)}
              whileTap={{ scale: 0.95 }}
            >
              <FiWifi className={`w-5 h-5 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Connection Status Panel */}
      <AnimatePresence>
        {showConnectionStatus && session && (
          <motion.div
            className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 p-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Room Status</span>
              <button
                onClick={() => setShowConnectionStatus(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm text-gray-300">
                  {isConnected ? 'Connected to room' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  Room ID: {session.beam_id?.slice(0, 8)}...
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pb-20">
        {!session ? (
          // Welcome Screen
          <motion.div 
            className="flex-1 flex flex-col items-center justify-center p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-32 h-32 mb-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FiShare2 className="w-16 h-16 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-white mb-4">
              Join a Room
            </h1>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Open <a className="text-violet-400 font-medium" href={window.location.origin}>{window.location.host}</a> on your computer and scan the QR code to start sharing
            </p>
            
            <motion.button
              className="w-full max-w-xs bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-2xl p-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
              onClick={handleStartScanning}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
            >
              <BsQrCode className="w-6 h-6 mr-3 inline" />
              Scan QR Code
            </motion.button>
          </motion.div>
        ) : (
          // Connected Screen
          <div className="flex-1 flex flex-col">
            {/* Tab Navigation */}
            <div className="flex bg-gray-800/50 border-b border-gray-700">
              <button
                className={`flex-1 p-4 text-center font-medium transition-colors ${
                  activeTab === 'share' 
                    ? 'text-violet-400 border-b-2 border-violet-400 bg-gray-800/50' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('share')}
              >
                <FiShare2 className="w-5 h-5 mx-auto mb-1" />
                Share
              </button>
              <button
                className={`flex-1 p-4 text-center font-medium transition-colors ${
                  activeTab === 'history' 
                    ? 'text-violet-400 border-b-2 border-violet-400 bg-gray-800/50' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('history')}
              >
                <FiGrid className="w-5 h-5 mx-auto mb-1" />
                History ({sharedClipboards.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6">
              {activeTab === 'share' ? (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                  
                  {/* Paste Button */}
                  <motion.button 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6 flex items-center justify-between shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => {
                navigator.clipboard.readText().then((clipboardContent) => {
                  if (!clipboardContent) {
                    toast("Your clipboard is empty!")
                    return;
                  }
                  if (sharedClipboards.filter((cb) => cb.content == clipboardContent).length == 0) {
                    shareClipBoard(clipboardContent)
                          toast.success("Content shared!")
                        } else {
                          toast("This content is already shared!")
                        }
                      })
                    }}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center">
                      <FiClipboard className="w-8 h-8 mr-4" />
                      <div className="text-left">
                        <h3 className="text-lg font-semibold">Paste from Clipboard</h3>
                        <p className="text-blue-200 text-sm">Share text or links</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <FiShare2 className="w-4 h-4" />
                    </div>
                  </motion.button>

                  {/* Upload Button */}
                  <UploadButton 
                    selected={(files) => {
                files.forEach((f) => {
                  const type = f.type.split('/')[0];
                        const fileId = `${f.name}-${Date.now()}`;
                        
                        // Add to uploading files
                        setUploadingFiles(prev => [...prev, {
                          id: fileId,
                          name: f.name,
                          progress: 0,
                          status: 'uploading'
                        }]);

                  toast(`Uploading ${f.name}`)
                        
                  uploadToUguu(f).then((directLink) => {
                    if (!directLink) {
                            setUploadingFiles(prev => prev.map(file => 
                              file.id === fileId 
                                ? { ...file, status: 'error', progress: 100 }
                                : file
                            ));
                      toast.error("Failed to upload!")
                            return;
                          }
                          
                          setUploadingFiles(prev => prev.map(file => 
                            file.id === fileId 
                              ? { ...file, status: 'success', progress: 100 }
                              : file
                          ));
                          
                          toast.success(`Uploaded "${f.name}" successfully!`)
                          shareClipBoard(directLink, type)
                          
                          // Remove from uploading files after delay
                          setTimeout(() => {
                            setUploadingFiles(prev => prev.filter(file => file.id !== fileId));
                          }, 3000);
                        }).catch(() => {
                          setUploadingFiles(prev => prev.map(file => 
                            file.id === fileId 
                              ? { ...file, status: 'error', progress: 100 }
                              : file
                          ));
                          toast.error(`Failed to upload ${f.name}`);
                        });
                        
                        // Simulate progress (since uguu doesn't provide real progress)
                        const progressInterval = setInterval(() => {
                          setUploadingFiles(prev => prev.map(file => {
                            if (file.id === fileId && file.status === 'uploading' && file.progress < 90) {
                              return { ...file, progress: Math.min(file.progress + 10, 90) };
                            }
                            return file;
                          }));
                        }, 200);
                        
                        // Clear progress simulation when done
                        setTimeout(() => clearInterval(progressInterval), 5000);
                      })
                    }}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl p-6 flex items-center justify-between shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center">
                      <FiUpload className="w-8 h-8 mr-4" />
                      <div className="text-left">
                        <h3 className="text-lg font-semibold">Upload Files</h3>
                        <p className="text-violet-200 text-sm">Images, videos, audio</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <FiShare2 className="w-4 h-4" />
                    </div>
                  </UploadButton>

                  {/* Upload Progress */}
                  <AnimatePresence>
                    {uploadingFiles.map((file) => (
                      <UploadProgress
                        key={file.id}
                        fileName={file.name}
                        progress={file.progress}
                        status={file.status}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">Shared Content</h2>
                  
                  {sharedClipboards.length === 0 ? (
                    <div className="text-center py-12">
                      <FiGrid className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No content shared yet</p>
                      <p className="text-sm text-gray-500 mt-2">Switch to Share tab to add content</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sharedClipboards.slice().reverse().map((item, index) => (
                        <StaticStickyNote 
                          key={item.id || index}
                          content={item.content} 
                          type={item.extra} 
                          index={item.index !== undefined ? item.index : index}
                          isBeamNote={item.isBeamNote}
                          noteData={item.noteData}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between p-4 bg-gray-900">
              <h2 className="text-lg font-semibold text-white">Scan QR Code</h2>
              <button
                onClick={() => setScanning(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 relative">
              <Scanner
                onScan={(result) => {
                  try {
                    const url = result[0].rawValue;
                    if (!url.includes('beam_id=')) {
                      toast.error("Invalid QR code. Please scan a valid Airsynca room QR code.");
                      return;
                    }
                    
                    const beamId = url.split('?beam_id=')[1];
                    if (!beamId) {
                      toast.error("Invalid room ID in QR code.");
                      return;
                    }
                    
                    setScanning(false)
                    setSession({
                      beam_id: beamId,
                      beam_key: null,
                    })
                    setShouldConnect('auto')
                    toast.success("Room joined successfully!")
                  } catch (error) {
                    toast.error("Failed to process QR code. Please try again.");
                    console.error('QR scan error:', error);
                  }
                }}
                onError={(error) => {
                  console.error('QR Scanner error:', error);
                  toast.error("QR scanner error. Please try again.");
                }}
                sound={false}
                className="w-full h-full"
              />
              <div className="absolute inset-0 border-2 border-white/30 rounded-3xl m-12 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-violet-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-violet-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-violet-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-violet-400 rounded-br-lg"></div>
              </div>
            </div>
            <div className="p-6 bg-gray-900 text-center">
              <p className="text-gray-300">Point your camera at the QR code on your computer screen</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Space Menu */}
      {session && (
        <motion.div
          className="fixed bottom-26 right-6 z-40"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.button
            className="w-14 h-14 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
            onClick={() => setShowSpaceMenu(true)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <FiPlus className="w-6 h-6" />
          </motion.button>
        </motion.div>
      )}

      {/* Space Menu Modal */}
      <AnimatePresence>
        {showSpaceMenu && (
          <motion.div
            className="fixed inset-0 bg-violet-950/50 backdrop-blur-sm z-[91474836489999999] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSpaceMenu(false)}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              onClick={() => setShowSpaceMenu(false)}
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
              {[
                {
                  id: "create",
                  icon: <FiPlus size={20} />,
                  title: "Create",
                  description: "Create a new note or content",
                  color: "from-purple-500 to-indigo-600",
                  action: handleCreateNote,
                },
                {
                  id: "paste",
                  icon: <FiClipboard size={20} />,
                  title: "Paste",
                  description: "Paste from clipboard",
                  color: "from-indigo-500 to-blue-600",
                  action: handlePasteContent,
                },
                {
                  id: "share",
                  icon: <FiShare2 size={20} />,
                  title: "Share",
                  description: "Share your workspace",
                  color: "from-blue-500 to-cyan-600",
                  action: handleShareWorkspace,
                },
              ].map((item, index) => (
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

      {/* Note Form Modal */}
      {showNoteForm && (
        <div className="h-[100vh] w-[100%] overflow-y-auto purple-scrollbar fixed bg-violet-600/20 backdrop-blur-md inset-0 z-[999999999999]">
          <NoteForm
            onCancel={() => {
              setShowNoteForm(false);
            }}
            onSave={(note) => {
              shareClipBoard(note, 'lexi_note')
              setShowNoteForm(false);
            }}
          />
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        roomId={session?.beam_id}
        roomName={session?.beam_name}
      />

      {/* Auth Menu Backdrop */}
      <AnimatePresence>
        {showAuthMenu && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 auth-menu-container">
        {/* Auth Drop-up Menu */}
        <AnimatePresence>
          {showAuthMenu && (
            <motion.div
              className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                    <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.username || 'User'}</p>
                      <p className="text-xs text-gray-400">Authenticated</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowAuthMenu(false);
                      toast.success("Logged out successfully");
                    }}
                    className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <FiX className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    className="p-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium"
                    onClick={() => {
                      navigate('/login');
                      setShowAuthMenu(false);
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiLogIn className="w-5 h-5" />
                    Login
                  </motion.button>
                  <motion.button
                    className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
                    onClick={() => {
                      navigate('/register');
                      setShowAuthMenu(false);
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiUserPlus className="w-5 h-5" />
                    Register
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation Bar */}
        <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {/* Home */}
            <motion.button
              className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => navigate('/')}
              whileTap={{ scale: 0.95 }}
            >
              <FiHome className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </motion.button>

            {/* Share (only show if connected) */}
            {session && (
              <motion.button
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                  activeTab === 'share' ? 'text-violet-400' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('share')}
                whileTap={{ scale: 0.95 }}
              >
                <FiShare2 className="w-6 h-6" />
                <span className="text-xs">Share</span>
              </motion.button>
            )}

            {/* History (only show if connected) */}
            {session && (
              <motion.button
                className={`flex flex-col items-center gap-1 p-2 transition-colors relative ${
                  activeTab === 'history' ? 'text-violet-400' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('history')}
                whileTap={{ scale: 0.95 }}
              >
                <FiGrid className="w-6 h-6" />
                <span className="text-xs">History</span>
                {sharedClipboards.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {sharedClipboards.length > 9 ? '9+' : sharedClipboards.length}
                    </span>
                  </div>
                )}
              </motion.button>
            )}

            {/* Auth Menu */}
            <motion.button
              className={`flex flex-col items-center gap-1 p-2 transition-colors relative ${
                showAuthMenu ? 'text-violet-400' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setShowAuthMenu(!showAuthMenu)}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <FiUser className="w-6 h-6" />
                {showAuthMenu && (
                  <motion.div
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                    animate={{ rotate: showAuthMenu ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronUp className="w-4 h-4" />
                  </motion.div>
                )}
                {isAuthenticated && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                )}
              </div>
              <span className="text-xs">
                {isAuthenticated ? 'Account' : 'Auth'}
              </span>
            </motion.button>

            {/* Scan QR (only show if not connected) */}
            {!session && (
              <motion.button
                className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white transition-colors"
                onClick={handleStartScanning}
                whileTap={{ scale: 0.95 }}
              >
                <BsQrCode className="w-6 h-6" />
                <span className="text-xs">Scan</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePage