import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FiUser,
  FiMail,
  FiEdit3,
  FiSave,
  FiX,
  FiCamera,
  FiShield,
  FiKey,
  FiTrash2,
  FiLogOut,
  FiArrowLeft,
  FiAlertTriangle,
  FiEye,
  FiEyeOff
} from "react-icons/fi"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { api } from "../consts"

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name || '',
    username: user?.username || '',
    email: user?.email || ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await api.put('/auth/profile/', formData, {
        withCredentials: true
      })
      
      if (response.data.user) {
        updateUser(response.data.user)
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name || '',
      username: user?.username || '',
      email: user?.email || ''
    })
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = window.location.origin
    toast.success('Logged out successfully')
  }

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('profile_picture', file)
        
        const response = await api.post('/auth/profile-picture/', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        if (response.data.user) {
          updateUser(response.data.user)
          toast.success('Profile picture updated successfully!')
        }
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to update profile picture')
      }
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error('Please enter your password to confirm account deletion')
      return
    }

    setIsDeleting(true)
    try {
      const response = await api.delete('/auth/delete-account/', {
        data: { password: deletePassword },
        withCredentials: true
      })
      
      toast.success('Account deleted successfully')
      await logout()
      window.location.href = window.location.origin
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to delete account'
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setDeletePassword('')
    }
  }

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true)
    setDeletePassword('')
    setShowDeletePassword(false)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletePassword('')
    setShowDeletePassword(false)
  }

  useEffect(() => {
    setFormData({
    name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name || '',
    username: user?.username || '',
    email: user?.email || ''
  })
  }, [user])

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
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors duration-300"
            >
              <FiArrowLeft size={20} />
              <span className="goldman-regular">Back to Home</span>
            </button>
            <h1 className="text-3xl font-bold text-white goldman-regular">Profile</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl"
                   style={{
                     boxShadow: '0 0 40px rgba(127, 90, 240, 0.1), inset 0 0 20px rgba(127, 90, 240, 0.05)'
                   }}>
                
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group mb-4">
                                         <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-4 border-purple-500/30 overflow-hidden backdrop-blur-sm shadow-lg">
                       {user?.profile_picture ? (
                         <img 
                           src={user.profile_picture} 
                           alt="Profile" 
                           className="w-full h-full object-cover"
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center">
                           <FiUser size={48} className="text-purple-400" />
                         </div>
                       )}
                     </div>
                    {isEditing && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full">
                        <FiCamera size={24} className="text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold text-white goldman-regular mb-1">
                    {formData.name || (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name || 'User')}
                  </h2>
                  <p className="text-gray-400 text-sm">@{formData.username || user?.username}</p>
                </div>

                <div className="space-y-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="brain-boom-btn w-full justify-center"
                    >
                      <FiEdit3 size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
                      >
                        <FiSave size={16} />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-full flex items-center justify-center gap-2 bg-gray-600/50 text-gray-300 py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:bg-gray-600/70"
                      >
                        <FiX size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl"
                   style={{
                     boxShadow: '0 0 40px rgba(127, 90, 240, 0.1), inset 0 0 20px rgba(127, 90, 240, 0.05)'
                   }}>
                
                <h3 className="text-xl font-semibold text-white goldman-regular mb-6">Account Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={`${user.first_name} ${user.last_name}`}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full bg-[#2A2B3E]/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-white">{user?.first_name != null? `${user.first_name} ${user.last_name}` : 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="w-full bg-[#2A2B3E]/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                        placeholder="Enter your username"
                      />
                    ) : (
                      <p className="text-white">@{user?.username || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-[#2A2B3E]/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-white">{user?.email || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6 bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl"
                style={{
                  boxShadow: '0 0 40px rgba(127, 90, 240, 0.1), inset 0 0 20px rgba(127, 90, 240, 0.05)'
                }}
              >
                <h3 className="text-xl font-semibold text-white goldman-regular mb-6">Account Actions</h3>
                
                <div className="space-y-4">
                  <button
                    onClick={handleOpenDeleteModal}
                    className="w-full flex items-center justify-between p-4 bg-[#2A2B3E]/50 border border-red-500/30 rounded-xl text-left hover:bg-[#2A2B3E]/70 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <FiTrash2 size={20} className="text-red-400" />
                      <span className="text-white">Delete Account</span>
                    </div>
                    <FiArrowLeft size={16} className="text-gray-400 rotate-180" />
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl text-left hover:bg-gradient-to-r hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <FiLogOut size={20} className="text-red-400" />
                      <span className="text-white">Logout</span>
                    </div>
                    <FiArrowLeft size={16} className="text-gray-400 rotate-180" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseDeleteModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#1A1B2E] border border-red-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              style={{
                boxShadow: '0 0 40px rgba(239, 68, 68, 0.2), inset 0 0 20px rgba(239, 68, 68, 0.05)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FiAlertTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white goldman-regular">Delete Account</h3>
                  <p className="text-gray-400 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-300 text-sm">
                  <strong>Warning:</strong> This will permanently delete your account and all associated data including:
                </p>
                <ul className="text-red-300/80 text-sm mt-2 space-y-1">
                  <li>• All your notes and content</li>
                  <li>• Profile information</li>
                  <li>• Account settings</li>
                  <li>• Shared beams and collaborations</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter your password to confirm
                </label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full bg-[#2A2B3E]/50 border border-red-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors duration-300 pr-12"
                    placeholder="Enter your password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300"
                  >
                    {showDeletePassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseDeleteModal}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-600/50 text-gray-300 py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:bg-gray-600/70 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || !deletePassword.trim()}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfilePage