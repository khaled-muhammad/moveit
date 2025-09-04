import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'rounded-xl border transition-all duration-200';
  
  const variants = {
    default: 'bg-gray-800/50 border-gray-700 backdrop-blur-sm',
    elevated: 'bg-gray-800/80 border-gray-600 shadow-lg backdrop-blur-md',
    glass: 'bg-white/5 border-white/10 backdrop-blur-xl',
    gradient: 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600 backdrop-blur-sm',
    highlight: 'bg-violet-500/10 border-violet-500/30 backdrop-blur-sm'
  };
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };
  
  const hoverEffects = hover ? 'hover:shadow-lg hover:border-gray-600 hover:bg-gray-800/70' : '';
  const clickable = onClick ? 'cursor-pointer' : '';
  
  const cardClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverEffects}
    ${clickable}
    ${className}
  `.trim();

  const CardComponent = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  } : {};

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

// Card Header Component
export const CardHeader = ({ 
  title, 
  subtitle, 
  action,
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

// Card Content Component
export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`text-gray-300 ${className}`}>
      {children}
    </div>
  );
};

// Card Footer Component
export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

// Feature Card Component
export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  active = false,
  onClick,
  className = '' 
}) => {
  return (
    <Card
      variant={active ? 'highlight' : 'default'}
      hover={!!onClick}
      onClick={onClick}
      className={className}
    >
      <div className="text-center">
        <motion.div
          className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
            active ? 'bg-violet-500/20 text-violet-400' : 'bg-gray-700 text-gray-400'
          }`}
          animate={active ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
        <h3 className="font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </Card>
  );
};

// Stats Card Component
export const StatsCard = ({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  className = '' 
}) => {
  return (
    <Card variant="elevated" className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-violet-400" />
          </div>
        )}
      </div>
    </Card>
  );
};

// Action Card Component
export const ActionCard = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  gradient = 'from-violet-600 to-blue-600',
  className = '' 
}) => {
  return (
    <Card
      variant="glass"
      className={`bg-gradient-to-r ${gradient} p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </Card>
  );
};

// Content Card Component (for shared content)
export const ContentCard = ({ 
  content, 
  type = 'text',
  timestamp,
  onCopy,
  onDelete,
  className = '' 
}) => {
  const getContentPreview = () => {
    if (type === 'image' || type === 'video' || type === 'audio') {
      return (
        <div className="flex items-center space-x-2 text-gray-400">
          <span className="text-xs uppercase font-medium">{type}</span>
          <span className="text-xs">•</span>
          <span className="text-xs">Click to view</span>
        </div>
      );
    }
    
    return (
      <p className="text-white text-sm break-words">
        {content?.length > 100 ? `${content.substring(0, 100)}...` : content}
      </p>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <Card hover className={className}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {getContentPreview()}
            {timestamp && (
              <p className="text-xs text-gray-500 mt-2">
                {new Date(timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-3">
            {onCopy && (
              <button
                onClick={onCopy}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Card;
