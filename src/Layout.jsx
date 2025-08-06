import { NavLink, Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import { FiGrid, FiHome, FiUser, FiShare2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useSession } from "./components/SessionProvider";
import { WebSocketProvider } from "./components/WebSocketProvider";
import { useAuth } from "./contexts/AuthContext";

const Layout = () => {
  const [isMobile, setIsMobile] = useState(true);
  const { session } = useSession();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

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
      <div className="min-h-[100%] flex flex-col justify-between items-center gap-5">
        <Logo className="text-4xl z-[91474836489999999]" />
        {!isMobile && (
          <nav className="fixed z-[91474836489999990] top-5 right-5 flex items-center gap-4">
            <div className="bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl px-6 py-3 shadow-2xl"
                 style={{
                   boxShadow: '0 0 40px rgba(127, 90, 240, 0.1), inset 0 0 20px rgba(127, 90, 240, 0.05)'
                 }}>
              <ul className="flex gap-6 items-center">
                <li>
                  <NavLink 
                    to='/' 
                    className={({ isActive }) =>
                      `goldman-regular text-sm font-medium transition-all duration-300 hover:text-purple-400 ${
                        isActive 
                          ? 'text-purple-400 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-indigo-500' 
                          : 'text-gray-300'
                      }`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                {isAuthenticated && (
                  <li>
                    <NavLink 
                      to='/beams' 
                      className={({ isActive }) =>
                        `goldman-regular text-sm font-medium transition-all duration-300 hover:text-purple-400 ${
                          isActive 
                            ? 'text-purple-400 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-indigo-500' 
                            : 'text-gray-300'
                        }`
                      }
                    >
                      Beams
                    </NavLink>
                  </li>
                )}
                {!isAuthenticated && (
                  <li>
                    <NavLink 
                      to='/login' 
                      className={({ isActive }) =>
                        `goldman-regular text-sm font-medium transition-all duration-300 hover:text-purple-400 ${
                          isActive 
                            ? 'text-purple-400 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-indigo-500' 
                            : 'text-gray-300'
                        }`
                      }
                    >
                      Login
                    </NavLink>
                  </li>
                )}
                {!isAuthenticated && (
                  <li>
                    <NavLink 
                      to='/register' 
                      className={({ isActive }) =>
                        `goldman-regular text-sm font-medium transition-all duration-300 hover:text-purple-400 ${
                          isActive 
                            ? 'text-purple-400 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-indigo-500' 
                            : 'text-gray-300'
                        }`
                      }
                    >
                      Register
                    </NavLink>
                  </li>
                )}
                {isAuthenticated && (
                  <li>
                    <NavLink 
                      to='/profile' 
                      className={({ isActive }) =>
                        `goldman-regular text-sm font-medium transition-all duration-300 hover:text-purple-400 ${
                          isActive 
                            ? 'text-purple-400 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-indigo-500' 
                            : 'text-gray-300'
                        }`
                      }
                    >
                      Profile
                    </NavLink>
                  </li>
                )}
                {isAuthenticated && (
                  <li>
                    <NavLink 
                      to='/login' 
                      onClick={() => {
                        logout();
                      }}
                      className="goldman-regular text-sm font-medium text-gray-300 hover:text-red-400 transition-all duration-300"
                    >
                      Logout
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>

            {isAuthenticated && user?.profile_picture && (
              <div className="relative group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30 overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src={user.profile_picture} 
                    alt="User profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}
          </nav>
        )}
        <main className="flex-1 flex flex-col w-full">

        <Outlet />
        </main>

        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-[49] p-4">
            <div className="bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl px-6 py-4 shadow-2xl mx-4"
                 style={{
                   boxShadow: '0 0 40px rgba(127, 90, 240, 0.1), inset 0 0 20px rgba(127, 90, 240, 0.05)'
                 }}>
              <ul className="w-full flex justify-around items-center">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1 transition-all duration-300 ${
                        isActive 
                          ? "text-purple-400" 
                          : "text-gray-300 hover:text-purple-400"
                      }`
                    }
                  >
                    <FiHome size={24} />
                    <span className="text-xs goldman-regular">Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/space"
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1 transition-all duration-300 ${
                        isActive 
                          ? "text-purple-400" 
                          : "text-gray-300 hover:text-purple-400"
                      }`
                    }
                  >
                    <FiGrid size={24} />
                    <span className="text-xs goldman-regular">Space</span>
                  </NavLink>
                </li>
                {isAuthenticated && (
                  <li>
                    <NavLink
                      to="/beams"
                      className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-all duration-300 ${
                          isActive 
                            ? "text-purple-400" 
                            : "text-gray-300 hover:text-purple-400"
                        }`
                      }
                    >
                      <FiShare2 size={24} />
                      <span className="text-xs goldman-regular">Beams</span>
                    </NavLink>
                  </li>
                )}
                {!isAuthenticated && (
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-all duration-300 ${
                          isActive 
                            ? "text-purple-400" 
                            : "text-gray-300 hover:text-purple-400"
                        }`
                      }
                    >
                      <FiUser size={24} />
                      <span className="text-xs goldman-regular">Login</span>
                    </NavLink>
                  </li>
                )}
                {!isAuthenticated && (
                  <li>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-all duration-300 ${
                          isActive 
                            ? "text-purple-400" 
                            : "text-gray-300 hover:text-purple-400"
                        }`
                      }
                    >
                      <FiUser size={24} />
                      <span className="text-xs goldman-regular">Register</span>
                    </NavLink>
                  </li>
                )}
                {isAuthenticated && (
                  <li>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-all duration-300 ${
                          isActive 
                            ? "text-purple-400" 
                            : "text-gray-300 hover:text-purple-400"
                        }`
                      }
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-purple-500/30">
                        {user?.profile_picture ? (
                          <img 
                            src={user.profile_picture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser size={16} className="w-full h-full flex items-center justify-center" />
                        )}
                      </div>
                      <span className="text-xs goldman-regular">Profile</span>
                    </NavLink>
                  </li>
                )}
                {isAuthenticated && (
                  <li>
                    <button
                      onClick={() => logout()}
                      className="flex flex-col items-center gap-1 transition-all duration-300 text-gray-300 hover:text-red-400"
                    >
                      <FiUser size={24} />
                      <span className="text-xs goldman-regular">Logout</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </WebSocketProvider>
  );
};

export default Layout;
