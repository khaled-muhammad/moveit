import { useState, useEffect } from "react";
import { FiGithub, FiInfo, FiPlus, FiX } from "react-icons/fi";
import { useSession } from "../components/SessionProvider";
import { useWebSocketContext } from "../components/WebSocketProvider";
import QRCodeDisplay from "../components/QRCodeDisplay";
import Logo from "../components/Logo";
import StickyNoteContainer from "../components/StickyNoteContainer";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import useDeviceType from "../hooks/deviceType"
import { isValidUUIDv4 } from "../utils";
import StaticStickyNote from "../components/StaticStickyNote";
import { Outlet, useNavigate } from "react-router-dom";
import SpaceMenuPage from "./SpaceMenuPage";
import { CloseButton } from "../components/closeBtn";
import NoteForm from "../components/NoteForm";

const SpacePage = () => {
  const { session, newSession, setSession } = useSession();
  const { isConnected, connectedDevices, lastJsonMessage, sharedClipboards, setShouldConnect, shareClipBoard} = useWebSocketContext();
  const { deviceType } = useDeviceType();
  const [isJoinBeamOpen, setIsSetJoinBeamOpen] = useState(false);
  const [isSpaceMenuOpen, setIsSpaceMenuOpen] = useState(false);
  const [isNoteEditorFullScreen, setIsNoteEditorFullScreen] = useState(false);

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.type === 'auth_sucess') {
        toast("Beaming");
      } else {
        // toast(lastJsonMessage.message);
      }
    }
  }, [lastJsonMessage])

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

  const handleCreateNote = () => {
    setIsNoteEditorFullScreen(true)
  };

  const handlePasteContent = (content) => {
    if (content && content.trim()) {
      if (sharedClipboards.filter((cb) => cb.content == content.trim()).length == 0) {
        shareClipBoard(content);
      }
      toast.success("Content pasted successfully!");
    } else {
      toast.error("Clipboard is empty!")
    }
  };

  const handleShareWorkspace = () => {
    handleShareBeam();
  };

  return (
    <>
      <section
        id="main"
        className="flex flex-1 justify-center items-center gap-5 flex-col overflow-hidden"
      >
        {/* <div className="fixed top-0 right-0 mt-8 mr-8 bg-white rounded-md">
          {connectedDevices.length > 1 && session && (
            <QRCodeDisplay session={`${window.location.origin}?beam_id=${session.beam_id}`} size={100} />
          )}
        </div> */}

        {connectedDevices.length <= 1 && session && (
          <QRCodeDisplay session={`${window.location.origin}?beam_id=${session.beam_id}`} size={200} className="mb-10" />
        )}

        {['mobile', 'tablet'].includes(deviceType) && sharedClipboards.length == 0? <>
            <div className="flex gap-8">
                {sharedClipboards.length == 0 && session? <button className="brain-boom-btn" onClick={handleShareBeam}>Share</button> : <><button className="brain-boom-btn" onClick={newSession}>New Beam</button>
                <button className="brain-boom-btn" onClick={() => setIsSetJoinBeamOpen(true)}>Join Beam</button></>}
            </div>
        </> : ''}
        {sharedClipboards.length == 0 && <h4 className="text-center">Share Clipboards / Links / Pictures / Videos</h4>}
        {sharedClipboards.length == 0 && <div className="flex flex-col sm:flex-row gap-8 mt-2 brain-boom-btns">
          {/* <KnowMoreButton /> */}
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
        {sharedClipboards.length > 0 && (
          <div className="md:hidden w-full flex flex-col flex-1 overflow-hidden mt-20 relative z-10">
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-4 pb-24">
              {sharedClipboards.map((clip) => (
                <StaticStickyNote key={clip.id} content={clip.content} type={clip.extra} index={clip.id} />
              ))}
            </div>
          </div>
        )}
        {session && <div className="absolute top-4 right-5 z-[900000000000]">
          <button
            className="from-purple-500 to-[#7F5AF0] drop-shadow-xl drop-shadow-purple-500/50 bg-gradient-to-b p-2 rounded-full hover:scale-110 transition-transform duration-200"
            onClick={() => setIsSpaceMenuOpen(true)}
          >
            <FiPlus size={25} />
          </button>
        </div>}
        {/* {sharedClipboards.length > 0 && <StickyNoteContainer />} */}
      </section>
      <Outlet />
      <AnimatePresence>
        {isJoinBeamOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/10 bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSetJoinBeamOpen(false)}
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
                onClick={() => setIsSetJoinBeamOpen(false)}
              >
                <FiX size={24} />
              </button>
              
              <motion.h2 
                className="text-3xl font-bold mb-6 text-center goldman-regular text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 know-more-title"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                Join Beam
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input type="text" placeholder="Enter Beam ID" className="outline-0" onChange={(value) => {
                    if (isValidUUIDv4(value.target.value)) {
                        setSession({
                            beam_id: value.target.value,
                            beam_key: null
                        })
                        setShouldConnect('auto')
                        setIsSetJoinBeamOpen(false)
                        toast('Joined Beam successfully')
                    }
                }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSpaceMenuOpen && (
        <SpaceMenuPage
          onClose={() => setIsSpaceMenuOpen(false)}
          onCreate={handleCreateNote}
          onPaste={handlePasteContent}
          onShare={handleShareWorkspace}
        />
      )}

      {isNoteEditorFullScreen && <div className="h-[100vh] w-[100%] overflow-y-auto purple-scrollbar fixed bg-violet-600/20 backdrop-blur-md inset-0 z-[999999999999]"><NoteForm
        onCancel={() => {
          setIsNoteEditorFullScreen(false);
        }}
        onSave={(note) => {
          shareClipBoard(note, 'lexi_note')
          setIsNoteEditorFullScreen(false);
        }}
      /></div>}
    </>
  );
};

export default SpacePage;