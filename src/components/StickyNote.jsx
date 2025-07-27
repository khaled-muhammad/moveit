import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StickyNote = ({ content, index, onRemove, constraintsRef = null }) => {
  const colors = [
    'from-purple-400 to-indigo-500',
    'from-indigo-400 to-blue-500',
    'from-blue-400 to-cyan-500',
    'from-cyan-400 to-teal-500',
    'from-teal-400 to-green-500',
  ];

  const rotations = [-3, -2, -1, 0, 1, 2, 3];

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(index + 1); // prevent 0 stacking
  const [colorClass] = useState(colors[index % colors.length]);
  const [rotation] = useState(rotations[Math.floor(Math.random() * rotations.length)]);

  const noteRef = useRef(null);

  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const noteWidth = 256;
    const noteHeight = 200;

    const safeX = Math.random() * (viewportWidth - noteWidth - 100) + 50;
    const safeY = Math.random() * (viewportHeight - noteHeight - 100) + 50;

    setPosition({ x: safeX, y: safeY });
  }, []);

  const handleDragStart = () => {
    setZIndex(Date.now()); // ensures it's always on top during drag
  };

  const handleDragEnd = () => {
    // optionally update position if you want to save it
  };

  return (
    <motion.div
      ref={noteRef}
      className={`absolute bg-gradient-to-br ${colorClass} p-4 rounded-lg shadow-lg w-64 cursor-move pointer-events-auto`}
      style={{
        zIndex,
        rotate: `${rotation}deg`,
        boxShadow: '0 4px 20px rgba(127, 90, 240, 0.3)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        opacity: { duration: 0.3 },
      }}
      drag
      dragConstraints={constraintsRef || false}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      whileDrag={{ scale: 1.05, boxShadow: '0 10px 25px rgba(127, 90, 240, 0.5)' }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={() => {
        navigator.clipboard.writeText(content).then((res) => {
          toast("Text copied successfully!")
        });
      }}
    >
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-black hover:bg-opacity-50 transition-all pointer-events-auto cursor-pointer"
      >
        <FiX />
      </button>
      <div className="text-white break-words whitespace-pre-wrap pointer-events-none select-text">
        {content}
      </div>
    </motion.div>
  );
};

export default StickyNote;
