import { motion } from 'framer-motion';
import { FiLoader, FiWifi, FiWifiOff, FiCheck, FiX, FiUpload } from 'react-icons/fi';

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <FiLoader className="w-full h-full text-violet-400" />
    </motion.div>
  );
};

// Connection Status Indicator
export const ConnectionStatus = ({ isConnected, showText = true, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
        animate={{ 
          scale: isConnected ? [1, 1.2, 1] : [1, 0.8, 1],
          opacity: isConnected ? [1, 0.7, 1] : [1, 0.5, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {showText && (
        <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      )}
    </div>
  );
};

// Upload Progress Component
export const UploadProgress = ({ fileName, progress, status = 'uploading' }) => {
  const statusConfig = {
    uploading: { icon: FiUpload, color: 'text-blue-400', bgColor: 'bg-blue-400' },
    success: { icon: FiCheck, color: 'text-green-400', bgColor: 'bg-green-400' },
    error: { icon: FiX, color: 'text-red-400', bgColor: 'bg-red-400' }
  };

  const config = statusConfig[status];

  return (
    <motion.div
      className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-lg"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full bg-gray-700 ${config.color}`}>
          {status === 'uploading' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <config.icon className="w-4 h-4" />
            </motion.div>
          ) : (
            <config.icon className="w-4 h-4" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">{fileName}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${config.bgColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs text-gray-400 font-mono">{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Skeleton Loading Component
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-gray-700/50 rounded-lg h-4"
          style={{ width: `${Math.random() * 40 + 60}%` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionButton,
  className = '' 
}) => {
  return (
    <motion.div
      className={`text-center py-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 mx-auto mb-4 text-gray-500"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon className="w-full h-full" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4 max-w-sm mx-auto">{description}</p>
      
      {actionButton && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {actionButton}
        </motion.div>
      )}
    </motion.div>
  );
};

// Success/Error Toast Components (for custom toasts)
export const ToastContent = ({ type, title, message, icon: CustomIcon }) => {
  const config = {
    success: { 
      icon: FiCheck, 
      bgColor: 'bg-green-500/20', 
      borderColor: 'border-green-500/50',
      iconColor: 'text-green-400'
    },
    error: { 
      icon: FiX, 
      bgColor: 'bg-red-500/20', 
      borderColor: 'border-red-500/50',
      iconColor: 'text-red-400'
    },
    info: { 
      icon: FiWifi, 
      bgColor: 'bg-blue-500/20', 
      borderColor: 'border-blue-500/50',
      iconColor: 'text-blue-400'
    }
  };

  const typeConfig = config[type] || config.info;
  const Icon = CustomIcon || typeConfig.icon;

  return (
    <div className={`${typeConfig.bgColor} ${typeConfig.borderColor} border rounded-lg p-3 backdrop-blur-sm`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${typeConfig.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm">{title}</h4>
          {message && (
            <p className="text-gray-300 text-sm mt-1">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Pulse Loading Animation
export const PulseLoader = ({ className = '' }) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-violet-400 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
};
