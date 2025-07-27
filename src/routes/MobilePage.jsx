import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import toast from "react-hot-toast";
import { useSession } from "../components/SessionProvider";
import { useWebSocketContext } from "../components/WebSocketProvider";
import Logo from "../components/Logo";

const MobilePage = () => {
  const [scanning, setScanning] = useState(false);
  const { session, setSession } = useSession();
  const { isConnected, lastJsonMessage, shareClipBoard, sharedClipboards } = useWebSocketContext();
  
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
    <section className="flex flex-col justify-center items-center min-h-screen gap-5">
      <Logo className="text-4xl" />

      <h1 className="text-xl font-semibold text-center mx-5">{session? "Start Sharing" : "Open moveit.khaled.hackclub.app on your PC/Laptop to start beaming"}</h1>

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
            setSession(JSON.parse(result[0].rawValue));
          }}
          sound={false}
        />
      )}

      <button className="brain-boom-btn" onClick={() => {
        navigator.clipboard.readText().then((clipboardContent) => {
          if (sharedClipboards.indexOf(clipboardContent) == -1) {
            shareClipBoard(clipboardContent)
          }
        })
      }}>Copy</button>
    </section>
  );
};

export default MobilePage