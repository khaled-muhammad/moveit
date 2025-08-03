import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLock, FiEye, FiEyeOff, FiGithub, FiArrowRight, FiZap, FiShare2, FiSmartphone } from "react-icons/fi";
import TakingNotesAmico from '../assets/Taking notes-amico.svg';
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext"

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    
    setFormErrors({});
    
    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    login(username,password).then((state) => {
        if (state) {
            navigate('/')
        }
    })
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => {
          const colors = [
            'from-yellow-400/30 to-orange-400/30',
            'from-pink-400/30 to-purple-400/30', 
            'from-blue-400/30 to-indigo-400/30',
            'from-green-400/30 to-teal-400/30'
          ];
          const color = colors[i % colors.length];
          
          return (
            <motion.div
              key={`left-${i}`}
              className={`absolute w-24 h-32 bg-gradient-to-br ${color} backdrop-blur-sm rounded-lg shadow-lg border border-white/10`}
              style={{
                left: `${5 + i * 8}%`,
                top: `${15 + i * 15}%`,
                transform: `rotate(${Math.random() * 15 - 7.5}deg)`,
              }}
              animate={{ 
                y: [0, -50, 0],
                x: [0, Math.random() * 15 - 7.5, 0],
                rotate: [Math.random() * 15 - 7.5, Math.random() * 25 - 12.5, Math.random() * 15 - 7.5],
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                duration: 7 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.2
              }}
            >
              <div className="p-3">
                <div className="w-full h-1.5 bg-white/40 rounded mb-2"></div>
                <div className="w-4/5 h-1.5 bg-white/30 rounded mb-2"></div>
                <div className="w-2/3 h-1.5 bg-white/30 rounded mb-1"></div>
                <div className="w-1/2 h-1.5 bg-white/20 rounded"></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => {
          const colors = [
            'from-purple-400/30 to-pink-400/30',
            'from-indigo-400/30 to-blue-400/30',
            'from-orange-400/30 to-red-400/30',
            'from-teal-400/30 to-green-400/30'
          ];
          const color = colors[i % colors.length];
          
          return (
            <motion.div
              key={`right-${i}`}
              className={`absolute w-24 h-32 bg-gradient-to-br ${color} backdrop-blur-sm rounded-lg shadow-lg border border-white/10`}
              style={{
                right: `${5 + i * 8}%`,
                top: `${20 + i * 12}%`,
                transform: `rotate(${Math.random() * 15 - 7.5}deg)`,
              }}
              animate={{ 
                y: [0, -60, 0],
                x: [0, Math.random() * 15 - 7.5, 0],
                rotate: [Math.random() * 15 - 7.5, Math.random() * 25 - 12.5, Math.random() * 15 - 7.5],
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                duration: 8 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5
              }}
            >
              <div className="p-3">
                <div className="w-full h-1.5 bg-white/40 rounded mb-2"></div>
                <div className="w-4/5 h-1.5 bg-white/30 rounded mb-2"></div>
                <div className="w-2/3 h-1.5 bg-white/30 rounded mb-1"></div>
                <div className="w-1/2 h-1.5 bg-white/20 rounded"></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl font-bold goldman-regular text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Welcome Back
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Sign in to continue your journey
            </motion.p>
          </motion.div>

          <motion.div
            className="bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              boxShadow: '0 0 40px rgba(127, 90, 240, 0.1), inset 0 0 20px rgba(127, 90, 240, 0.05)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={username}
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 bg-[#0F0F1A]/50 backdrop-blur-md border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      formErrors.username 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 hover:border-purple-500'
                    }`}
                    placeholder="Enter your username"
                  />
                </div>
                {formErrors.username && (
                  <motion.p 
                    className="text-red-400 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {formErrors.username}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 bg-[#0F0F1A]/50 backdrop-blur-md border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      formErrors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 hover:border-purple-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <motion.p 
                    className="text-red-400 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {formErrors.password}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  onClick={() => {
                    toast("Coming soon!")
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full brain-boom-btn justify-center relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span>Sign In</span>
                      <FiArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#1A1B2E]/50 text-gray-400">Or continue with</span>
                </div>
              </div>

              <motion.button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#0F0F1A]/50 backdrop-blur-md border-2 border-gray-600 rounded-xl text-white hover:border-purple-500 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiGithub className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                <span>Continue with GitHub</span>
              </motion.button>

              <div className="text-center">
                <span className="text-gray-400">Don't have an account? </span>
                <NavLink
                  to="/register"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign up
                </NavLink>
              </div>
            </form>
          </motion.div>

          <motion.div 
            className="mt-8 grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="text-center p-4 bg-[#1A1B2E]/30 backdrop-blur-md rounded-xl border border-purple-500/20">
              <FiZap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Lightning Fast</p>
            </div>
            <div className="text-center p-4 bg-[#1A1B2E]/30 backdrop-blur-md rounded-xl border border-purple-500/20">
              <FiShare2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Easy Sharing</p>
            </div>
            <div className="text-center p-4 bg-[#1A1B2E]/30 backdrop-blur-md rounded-xl border border-purple-500/20">
              <FiSmartphone className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Cross Platform</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;