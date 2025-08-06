import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiGrid,
  FiShare2,
  FiUsers,
  FiUser,
  FiSettings,
  FiTrash2,
  FiEdit3,
  FiPlus,
  FiArrowLeft,
  FiCopy,
  FiEye,
  FiEyeOff,
  FiX,
  FiCheck,
  FiAlertTriangle
} from "react-icons/fi"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { api } from "../consts"

const BeamsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [beams, setBeams] = useState([])
  const [sharedBeams, setSharedBeams] = useState([])
  const [myShares, setMyShares] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('my-beams')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showUnshareModal, setShowUnshareModal] = useState(false)
  const [selectedBeam, setSelectedBeam] = useState(null)
  const [shareData, setShareData] = useState({
    username: '',
    share_type: 'read'
  })
  const [selectedShare, setSelectedShare] = useState(null)

  useEffect(() => {
    fetchBeams()
  }, [])

  const fetchBeams = async () => {
    setIsLoading(true)
    try {
      const beamsResponse = await api.get('beams/', {
        withCredentials: true
      })
      setBeams(beamsResponse.data.beams || [])

      const sharedResponse = await api.get('beams/shared-with-me/', {
        withCredentials: true
      })
      setSharedBeams(sharedResponse.data.shared_beams || [])

      const mySharesResponse = await api.get('beams/my-shares/', {
        withCredentials: true
      })
      setMyShares(mySharesResponse.data.my_shared_beams || [])

    } catch (error) {
      toast.error('Failed to fetch beams')
      console.error('Error fetching beams:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShareBeam = async () => {
    if (!shareData.username.trim()) {
      toast.error('Please enter a username')
      return
    }

    try {
      const response = await api.post('beams/share/', {
        beam_id: selectedBeam.beam_id,
        username: shareData.username,
        share_type: shareData.share_type
      }, {
        withCredentials: true
      })

      toast.success(`Beam shared successfully with ${shareData.username}`)
      setShowShareModal(false)
      setShareData({ username: '', share_type: 'read' })
      setSelectedBeam(null)
      fetchBeams() // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to share beam')
    }
  }

  const handleUnshareBeam = async () => {
    try {
      await api.delete(`beams/unshare/${selectedShare.id}/`, {
        withCredentials: true
      })

      toast.success('Beam share removed successfully')
      setShowUnshareModal(false)
      setSelectedShare(null)
      fetchBeams() // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to remove share')
    }
  }

  const handleUpdateSharePermissions = async (shareId, newShareType) => {
    try {
      await api.put(`beams/update-share/${shareId}/`, {
        share_type: newShareType
      }, {
        withCredentials: true
      })

      toast.success('Share permissions updated successfully')
      fetchBeams()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update permissions')
    }
  }

  const copyBeamId = (beamId) => {
    navigator.clipboard.writeText(beamId)
    toast.success('Beam ID copied to clipboard')
  }

  const getShareTypeColor = (shareType) => {
    switch (shareType) {
      case 'read': return 'text-blue-400'
      case 'write': return 'text-green-400'
      case 'admin': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getShareTypeLabel = (shareType) => {
    switch (shareType) {
      case 'read': return 'Read Only'
      case 'write': return 'Read & Write'
      case 'admin': return 'Admin'
      default: return shareType
    }
  }

  const renderBeamCard = (beam, isShared = false) => (
    <motion.div
      key={beam.beam_id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl"
      style={{
        boxShadow: '0 0 40px rgba(127, 90, 240, 0.1), inset 0 0 20px rgba(127, 90, 240, 0.05)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white goldman-regular mb-2">
            {beam.beam_name || 'Untitled Beam'}
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            Created {new Date(beam.created_at).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
              {beam.beam_id.slice(0, 8)}...
            </span>
            <button
              onClick={() => copyBeamId(beam.beam_id)}
              className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
            >
              <FiCopy size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/?beam_id=${beam.beam_id}`)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
        >
          Open Beam
        </button>
        
        {!isShared && (
          <button
            onClick={() => {
              setSelectedBeam(beam)
              setShowShareModal(true)
            }}
            className="bg-[#2A2B3E]/50 border border-purple-500/30 text-purple-400 py-2 px-4 rounded-xl transition-all duration-300 hover:bg-[#2A2B3E]/70"
          >
            <FiShare2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  )

  const renderShareCard = (share) => (
    <motion.div
      key={share.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl"
      style={{
        boxShadow: '0 0 40px rgba(127, 90, 240, 0.1), inset 0 0 20px rgba(127, 90, 240, 0.05)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white goldman-regular mb-2">
            {share.beam.beam_name || 'Untitled Beam'}
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            Shared with {share.shared_with.username}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
              {share.beam.beam_id.slice(0, 8)}...
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getShareTypeColor(share.share_type)} bg-opacity-20`}>
              {getShareTypeLabel(share.share_type)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/?beam_id=${share.beam.beam_id}`)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
        >
          Open Beam
        </button>
        
        <div className="relative group">
          <button className="bg-[#2A2B3E]/50 border border-purple-500/30 text-purple-400 py-2 px-4 rounded-xl transition-all duration-300 hover:bg-[#2A2B3E]/70">
            <FiSettings size={16} />
          </button>
          
          <div className="absolute right-0 top-full mt-2 bg-[#1A1B2E] border border-purple-500/30 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 min-w-48">
            <div className="p-2">
              <div className="text-xs text-gray-400 px-3 py-2">Permissions</div>
              {['read', 'write', 'admin'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleUpdateSharePermissions(share.id, type)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-300 ${
                    share.share_type === type 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'text-gray-300 hover:bg-[#2A2B3E]/50'
                  }`}
                >
                  {getShareTypeLabel(type)}
                </button>
              ))}
              <div className="border-t border-purple-500/30 my-2"></div>
              <button
                onClick={() => {
                  setSelectedShare(share)
                  setShowUnshareModal(true)
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
              >
                Remove Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-[#0F0F1A] relative overflow-hidden pt-20">
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

      <div className="relative z-10 min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors duration-300"
            >
              <FiArrowLeft size={20} />
              <span className="goldman-regular">Back to Home</span>
            </button>
            <h1 className="text-3xl font-bold text-white goldman-regular">My Beams</h1>
            <button
              onClick={() => navigate('/')}
              className="brain-boom-btn"
            >
              <FiPlus size={16} />
              New Beam
            </button>
          </div>

          <div className="flex gap-2 mb-8">
            {[
              { id: 'my-beams', label: 'My Beams', count: beams.length },
              { id: 'shared-with-me', label: 'Shared With Me', count: sharedBeams.length },
              { id: 'my-shares', label: 'My Shares', count: myShares.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-[#2A2B3E]/50 text-gray-300 hover:bg-[#2A2B3E]/70'
                }`}
              >
                {tab.label}
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === 'my-beams' && beams.map(renderBeamCard)}
              {activeTab === 'shared-with-me' && sharedBeams.map((share) => renderBeamCard(share.beam, true))}
              {activeTab === 'my-shares' && myShares.map(renderShareCard)}
              
              {activeTab === 'my-beams' && beams.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <FiGrid size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Beams Yet</h3>
                  <p className="text-gray-400 mb-6">Create your first beam to get started</p>
                  <div className="flex justify-center">
                    <button
                    onClick={() => navigate('/')}
                    className="brain-boom-btn"
                  >
                    Create Beam
                  </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'shared-with-me' && sharedBeams.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <FiUsers size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Shared Beams</h3>
                  <p className="text-gray-400">No one has shared any beams with you yet</p>
                </div>
              )}
              
              {activeTab === 'my-shares' && myShares.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <FiShare2 size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Shared Beams</h3>
                  <p className="text-gray-400">You haven't shared any beams with others yet</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showShareModal && selectedBeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#1A1B2E] border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              style={{
                boxShadow: '0 0 40px rgba(127, 90, 240, 0.2), inset 0 0 20px rgba(127, 90, 240, 0.05)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <FiShare2 size={24} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white goldman-regular">Share Beam</h3>
                  <p className="text-gray-400 text-sm">{selectedBeam.beam_name || 'Untitled Beam'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={shareData.username}
                    onChange={(e) => setShareData({ ...shareData, username: e.target.value })}
                    className="w-full bg-[#2A2B3E]/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                    placeholder="Enter username to share with"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Permission Level</label>
                  <select
                    value={shareData.share_type}
                    onChange={(e) => setShareData({ ...shareData, share_type: e.target.value })}
                    className="w-full bg-[#2A2B3E]/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors duration-300"
                  >
                    <option value="read">Read Only</option>
                    <option value="write">Read & Write</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 bg-gray-600/50 text-gray-300 py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:bg-gray-600/70"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareBeam}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  Share Beam
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUnshareModal && selectedShare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUnshareModal(false)}
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
                  <h3 className="text-xl font-semibold text-white goldman-regular">Remove Share</h3>
                  <p className="text-gray-400 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-300 text-sm">
                  Are you sure you want to remove access for <strong>{selectedShare.shared_with.username}</strong>?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUnshareModal(false)}
                  className="flex-1 bg-gray-600/50 text-gray-300 py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:bg-gray-600/70"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnshareBeam}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                >
                  Remove Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BeamsPage