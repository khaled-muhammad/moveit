import { useState, useEffect } from "react";
import { FiGithub } from "react-icons/fi";
import { useSession } from "../components/SessionProvider";
import { useWebSocketContext } from "../components/WebSocketProvider";
import QRCodeDisplay from "../components/QRCodeDisplay";
import Logo from "../components/Logo";
import StickyNoteContainer from "../components/StickyNoteContainer";
import toast from "react-hot-toast";

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
        <button className="brain-boom-btn">Know More</button>
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
  );
};

export default DesktopPage;
