import { useEffect, useState } from "react";
import MobilePage from "./routes/MobilePage";
import DesktopPage from "./routes/DesktopPage";


function App() {
  const [isMobile, setIsMobile] = useState(true)


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

  return isMobile? <MobilePage /> : <DesktopPage />
}

export default App
