import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import toast from "react-hot-toast";
import { useSession } from "../components/SessionProvider";
import { useWebSocketContext } from "../components/WebSocketProvider";
import Logo from "../components/Logo";
import { FiCopy, FiUpload } from "react-icons/fi";
import UploadButton from "../components/UploadBtn";

import axios from 'axios';
import { api } from "../consts";

const uploadToUguu = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Uploaded File Info:', response.data);
    return response.data;
  } catch (error) {
    console.log('Upload failed:', error);
    return null;
  }
};

const MobilePage = () => {
  const [scanning, setScanning] = useState(false);
  const { session, setSession } = useSession();
  const { isConnected, lastJsonMessage, shareClipBoard, sharedClipboards } = useWebSocketContext();
  const queryParams = new URLSearchParams(window.location.search);
  const queryBeamId = queryParams.get('beam_id');

  useState(() => {
    if (queryBeamId != null) {
      setScanning(false)
      setSession({
        beam_id: queryBeamId,
        beam_key: null
      })
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
            setSession({
              beam_id: result[0].rawValue.split('?beam_id=')[1],
              beam_key: null,
            });
          }}
          sound={false}
        />
      )}
      {session && <div className="flex gap-5 flex-wrap">
        <button className="brain-boom-btn" onClick={() => {
          navigator.clipboard.readText().then((clipboardContent) => {
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
    </section>
  );
};

export default MobilePage