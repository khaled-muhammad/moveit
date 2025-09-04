import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy, FiShare2, FiMail, FiMessageCircle, FiTwitter, FiLinkedin, FiCheck } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';
import QRCodeDisplay from './QRCodeDisplay';
import Button, { IconButton } from './Button';
import Card from './Card';
import toast from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, roomId, roomName }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('link'); // 'link', 'qr', 'social'
  
  const shareUrl = `${window.location.origin}?beam_id=${roomId}`;
  const shareTitle = `Join my Airsynca Room${roomName ? ` - ${roomName}` : ''}`;
  const shareText = `Join my room on Airsynca to share content instantly! Scan the QR code or click the link to get started.`;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const shareVia = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(shareTitle);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Share error:", error);
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl max-w-lg w-full border border-gray-700 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -50 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-white">Share Room</h2>
              <p className="text-sm text-gray-400 mt-1">
                Invite others to join your room
              </p>
            </div>
            <IconButton
              icon={FiX}
              onClick={onClose}
              variant="ghost"
              size="sm"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            {[
              { id: 'link', label: 'Link', icon: FiCopy },
              { id: 'qr', label: 'QR Code', icon: BsQrCode },
              { id: 'social', label: 'Social', icon: FiShare2 }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 p-4 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-violet-400 border-b-2 border-violet-400 bg-gray-800/50'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-5 h-5 mx-auto mb-1" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'link' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm font-mono"
                    />
                    <IconButton
                      icon={copied ? FiCheck : FiCopy}
                      onClick={() => copyToClipboard(shareUrl)}
                      variant={copied ? "success" : "ghost"}
                      size="md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room ID
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={roomId}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm font-mono"
                    />
                    <IconButton
                      icon={FiCopy}
                      onClick={() => copyToClipboard(roomId)}
                      variant="ghost"
                      size="md"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  icon={FiShare2}
                  onClick={nativeShare}
                  fullWidth
                >
                  Share via System
                </Button>
              </motion.div>
            )}

            {activeTab === 'qr' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center space-y-4"
              >
                <div className="bg-white p-4 rounded-xl inline-block">
                  <QRCodeDisplay session={shareUrl} size={200} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Scan to Join
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Have others scan this QR code with their mobile device to instantly join your room.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  icon={FiCopy}
                  onClick={() => copyToClipboard(shareUrl)}
                  fullWidth
                >
                  Copy Link Instead
                </Button>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Card
                    hover
                    onClick={() => shareVia('twitter')}
                    className="p-4 text-center cursor-pointer"
                  >
                    <FiTwitter className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <span className="text-sm text-white">Twitter</span>
                  </Card>

                  <Card
                    hover
                    onClick={() => shareVia('linkedin')}
                    className="p-4 text-center cursor-pointer"
                  >
                    <FiLinkedin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm text-white">LinkedIn</span>
                  </Card>

                  <Card
                    hover
                    onClick={() => shareVia('whatsapp')}
                    className="p-4 text-center cursor-pointer"
                  >
                    <FiMessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <span className="text-sm text-white">WhatsApp</span>
                  </Card>

                  <Card
                    hover
                    onClick={() => shareVia('email')}
                    className="p-4 text-center cursor-pointer"
                  >
                    <FiMail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-white">Email</span>
                  </Card>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 text-center">
                    Share your room link on social media or via email to invite others
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareModal;
