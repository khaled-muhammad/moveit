import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiGithub,
  FiArrowRight,
  FiZap,
  FiShare2,
  FiSmartphone,
  FiMail,
  FiCamera,
  FiX,
} from "react-icons/fi"
import TakingNotesAmico from "../assets/Taking notes-amico.svg"
import { NavLink, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../contexts/AuthContext"
import { convertKeysToCamelCase } from "../utils"

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [profilePicture, setProfilePicture] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [imageError, setImageError] = useState("")
  const [isImageLoading, setIsImageLoading] = useState(false)
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()

  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, or WebP)"
    }

    if (file.size > maxSize) {
      return "Image size must be less than 5MB"
    }

    return null
  }

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        const maxWidth = 400
        const maxHeight = 400

        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            // Create a new file with proper name and extension
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          "image/jpeg",
          0.8
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageError("")
    setIsImageLoading(true)

    try {
      const validationError = validateImage(file)
      if (validationError) {
        setImageError(validationError)
        setIsImageLoading(false)
        return
      }

      let processedFile = file
      if (!file.name.includes(".")) {
        processedFile = new File([file], file.name + ".jpg", {
          type: "image/jpeg",
          lastModified: file.lastModified,
        })
      }

      const compressedFile = await compressImage(processedFile)
      setProfilePicture(compressedFile)

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target.result)
        setIsImageLoading(false)
      }
      reader.onerror = () => {
        setImageError("Failed to read image file")
        setIsImageLoading(false)
      }
      reader.readAsDataURL(compressedFile)
    } catch (error) {
      setImageError("Failed to process image")
      setIsImageLoading(false)
    }
  }

  const removeProfilePicture = () => {
    setProfilePicture(null)
    setPreviewImage(null)
    setImageError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setFormErrors({})

    const errors = {}
    if (!firstName) errors.firstName = "First name is required"
    if (!lastName) errors.lastName = "Last name is required"
    if (!username) errors.username = "Username is required"
    if (!email) errors.email = "Email is required"
    if (!password) errors.password = "Password is required"
    if (password && password.length < 6)
      errors.password = "Password must be at least 6 characters"
    if (confirmPassword !== password)
      errors.confirmPassword = "Passwords do not match"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const result = await register({
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      password,
      profile_picture: profilePicture
    })

    if (result.success) {
      navigate('/')
    } else if (result.errors) {
      const convertedErrors = convertKeysToCamelCase(result.errors)
      setFormErrors(convertedErrors)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => {
          const colors = [
            "from-yellow-400/30 to-orange-400/30",
            "from-pink-400/30 to-purple-400/30",
            "from-blue-400/30 to-indigo-400/30",
            "from-green-400/30 to-teal-400/30",
          ]
          const color = colors[i % colors.length]

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
                rotate: [
                  Math.random() * 15 - 7.5,
                  Math.random() * 25 - 12.5,
                  Math.random() * 15 - 7.5,
                ],
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 7 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.2,
              }}
            >
              <div className="p-3">
                <div className="w-full h-1.5 bg-white/40 rounded mb-2"></div>
                <div className="w-4/5 h-1.5 bg-white/30 rounded mb-2"></div>
                <div className="w-2/3 h-1.5 bg-white/30 rounded mb-1"></div>
                <div className="w-1/2 h-1.5 bg-white/20 rounded"></div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => {
          const colors = [
            "from-purple-400/30 to-pink-400/30",
            "from-indigo-400/30 to-blue-400/30",
            "from-orange-400/30 to-red-400/30",
            "from-teal-400/30 to-green-400/30",
          ]
          const color = colors[i % colors.length]

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
                rotate: [
                  Math.random() * 15 - 7.5,
                  Math.random() * 25 - 12.5,
                  Math.random() * 15 - 7.5,
                ],
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5,
              }}
            >
              <div className="p-3">
                <div className="w-full h-1.5 bg-white/40 rounded mb-2"></div>
                <div className="w-4/5 h-1.5 bg-white/30 rounded mb-2"></div>
                <div className="w-2/3 h-1.5 bg-white/30 rounded mb-1"></div>
                <div className="w-1/2 h-1.5 bg-white/20 rounded"></div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
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
              Join MoveIt
            </motion.h1>
            <motion.p
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Create your account and start sharing
            </motion.p>
          </motion.div>

          <motion.div
            className="bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              boxShadow:
                "0 0 40px rgba(127, 90, 240, 0.1), inset 0 0 20px rgba(127, 90, 240, 0.05)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30 flex items-center justify-center overflow-hidden">
                    {isImageLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors">
                    <FiCamera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                  {formErrors.profilePicture && (
                    <motion.p
                      className="text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {formErrors.profilePicture}
                    </motion.p>
                  )}

                  {previewImage && (
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              </div>

              {imageError && (
                <motion.div
                  className="text-center mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-red-400 text-sm">{imageError}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full px-4 py-4 bg-[#0F0F1A]/50 backdrop-blur-md border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      formErrors.firstName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 hover:border-purple-500"
                    }`}
                    placeholder="Enter first name"
                  />
                  {formErrors.firstName && (
                    <motion.p
                      className="text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {formErrors.firstName}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full px-4 py-4 bg-[#0F0F1A]/50 backdrop-blur-md border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      formErrors.lastName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 hover:border-purple-500"
                    }`}
                    placeholder="Enter last name"
                  />
                  {formErrors.lastName && (
                    <motion.p
                      className="text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {formErrors.lastName}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 bg-[#0F0F1A]/50 backdrop-blur-md border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      formErrors.username
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 hover:border-purple-500"
                    }`}
                    placeholder="Choose a username"
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
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 bg-[#0F0F1A]/50 backdrop-blur-md border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      formErrors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 hover:border-purple-500"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {formErrors.email && (
                  <motion.p
                    className="text-red-400 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {formErrors.email}
                  </motion.p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-600 hover:border-purple-500"
                      }`}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 bg-[#0F0F1A]/50 backdrop-blur-md border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                        formErrors.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-600 hover:border-purple-500"
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <motion.p
                      className="text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {formErrors.confirmPassword}
                    </motion.p>
                  )}
                </div>
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
                      <span>Creating account...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span>Create Account</span>
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
                  <span className="px-2 bg-[#1A1B2E]/50 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <motion.button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#0F0F1A]/50 backdrop-blur-md border-2 border-gray-600 rounded-xl text-white hover:border-purple-500 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {toast("Coming soon...")}}
              >
                <FiGithub className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                <span>Continue with GitHub</span>
              </motion.button>

              <div className="text-center">
                <span className="text-gray-400">Already have an account? </span>
                <NavLink
                  to="/login"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in
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
  )
}

export default RegisterPage
