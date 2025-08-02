import { NavLink, Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import { FiGrid, FiHome } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useSession } from "./components/SessionProvider";
import { WebSocketProvider } from "./components/WebSocketProvider";

const Layout = () => {
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
      <div className="h-[100%] flex flex-col justify-between items-center gap-5">
        <Logo className="text-4xl z-[91474836489999999]" />
        <main className="flex-1 flex flex-col">

        <Outlet />
        </main>

        {isMobile && (
          <div className="nav-bar py-5 border-t-3 border-t-[#7F5AF0] w-full">
            <ul className="w-full flex justify-around">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex gap-1 flex-col items-center ${
                      isActive ? "text-[#7F5AF0]" : ""
                    }`
                  }
                >
                  <FiHome size={28} />
                  <span>Home</span>
                </NavLink>
              </li>
              <li className="flex gap-1 flex-col items-center">
                <NavLink
                  to="/space"
                  className={({ isActive }) =>
                    `flex gap-1 flex-col items-center ${
                      isActive ? "text-[#7F5AF0]" : ""
                    }`
                  }
                >
                  <FiGrid size={28} />
                  <span>Space</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </WebSocketProvider>
  );
};

export default Layout;
