import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import toast from "react-hot-toast";
import { useSession } from "../components/SessionProvider";
import { useWebSocketContext } from "../components/WebSocketProvider";
import Logo from "../components/Logo";
import { FiCopy, FiGrid, FiHome, FiUpload } from "react-icons/fi";
import UploadButton from "../components/UploadBtn";
import Footer from "../components/Footer";
import { uploadToUguu } from "../utils";


const MobilePage = () => {
  const [scanning, setScanning] = useState(false);
  const { session, setSession } = useSession();
  const { isConnected, lastJsonMessage, shareClipBoard, sharedClipboards, setShouldConnect } = useWebSocketContext();
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
        toast("Beaming");
      } else {
        // toast(lastJsonMessage.message);
      }
    }
  }, [lastJsonMessage])

  const handleStartScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())
      setScanning(true)
    } catch (error) {
      alert("Camera permission denied. Please allow camera access.");
    }
  };

  return (
    <>
        <div className="flex flex-1 flex-col justify-center items-center gap-5">
            <h1 className="text-xl font-semibold text-center mx-5">{session? "Start Sharing" : <>Open <a className="text-[#7F5AF0]" href={window.location.origin}>{window.location.host}</a> on your PC/Laptop to start beaming</>}</h1>

            {!session && (
              <button
                className="brain-boom-btn"
                onClick={handleStartScanning}
              >
                Scan QR
              </button>
            )}
            {scanning && (
              <Scanner
                onScan={(result) => {
                  setScanning(false)
                  setSession({
                    beam_id: result[0].rawValue.split('?beam_id=')[1],
                  beam_key: null,
                  })
                  setShouldConnect('auto')
                }}
                sound={false}
              />
            )}
            {session && <div className="flex gap-5 flex-wrap">
              <button className="brain-boom-btn" onClick={() => {
                navigator.clipboard.readText().then((clipboardContent) => {
                  if (!clipboardContent) {
                    toast("Your clipboard is empty!")
                    return;
                  }
                  if (sharedClipboards.filter((cb) => cb.content == clipboardContent).length == 0) {
                    shareClipBoard(clipboardContent)
                  }
                })
              }}><FiCopy /> Copy</button>
              <UploadButton selected={(files) => {
                files.forEach((f) => {
                  const type = f.type.split('/')[0];

                  toast(`Uploading ${f.name}`)
                  uploadToUguu(f).then((directLink) => {
                    if (!directLink) {
                      toast.error("Failed to upload!")
                      return;
                    }
                    toast(`Uploaded "${f.name}" Successfully!`)
                    shareClipBoard(directLink, type)
                  })
                })
              }} />
            </div>}
        </div>
    </>
  );
};

export default MobilePage