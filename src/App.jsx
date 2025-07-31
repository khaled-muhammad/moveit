import { useEffect, useState } from "react";
import MobilePage from "./routes/MobilePage";
import DesktopPage from "./routes/DesktopPage";

const AppContent = () => {
  const [isMobile, setIsMobile] = useState(null);

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
    isMobile == null? <p>Loading ...</p> : isMobile ? <MobilePage /> : <DesktopPage />
  );
};

function App() {
  return (
    <AppContent />
  );
}

export default App
