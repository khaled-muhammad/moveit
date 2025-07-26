import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import toast from "react-hot-toast";
import useWebSocket from "react-use-websocket";

const MobilePage = () => {
  const [scanning, setScanning] = useState(false)
  const [session, setSession] = useState(null)
  const [isConnected, setIsConnected] = useState(false);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(session ? `ws://${window.location.host}/ws/beam/${session.beam_id}/` : null, {
    onOpen: () => sendJsonMessage({type: 'auth', message: session.beam_key}),
    shouldReconnect: (closeEvent) => true,
    shouldConnect: !!session,
  });
  
  useEffect(() => {
    if (lastJsonMessage != null) {
        if (lastJsonMessage.type == 'auth_sucess') {
          setIsConnected(true)
          toast("Beaming")
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
    <section className="flex flex-col justify-center items-center min-h-[100vh] gap-5">
      <h1 className='text-4xl goldman-regular logo-animate-container'>
        <span className='logo-animate-text'>MoveIt</span>
      </h1>

      <h1 className="text-xl font-semibold text-center mx-5">Open moveit.khaled.hackclub.app on your PC/Laptop to start beaming</h1>

      {!scanning && (
        <button
          className="brain-boom-btn"
          onClick={handleStartScanning}
        >
          Scan QR
        </button>
      )}
      {session && (
        <p className="text-green-500 font-mono">Scanned: {session.beam_id}</p>
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
    </section>
  );
};

export default MobilePage