import { useEffect, useState } from "react";
import MobilePage from "./routes/MobilePage";
import DesktopPage from "./routes/DesktopPage";
import { SessionProvider } from "./components/SessionProvider";
import { WebSocketProvider } from "./components/WebSocketProvider";
import { useSession } from "./components/SessionProvider";

const AppContent = () => {
  const [isMobile, setIsMobile] = useState(true);
  const { session } = useSession();

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return (
    <WebSocketProvider session={session}>
      {isMobile ? <MobilePage /> : <DesktopPage />}
    </WebSocketProvider>
  );
};

function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}

export default App
