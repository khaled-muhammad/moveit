import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StickyNote = ({ content, type, index, onRemove, constraintsRef = null, onMove, cameraPosition, worldX, worldY }) => {
  const colors = [
    'from-purple-400 to-indigo-500',
    'from-indigo-400 to-blue-500',
    'from-blue-400 to-cyan-500',
    'from-cyan-400 to-teal-500',
    'from-teal-400 to-green-500',
  ];

  const rotations = [-3, -2, -1, 0, 1, 2, 3];

  const [zIndex, setZIndex] = useState(index + 1);
  const [colorClass] = useState(colors[index % colors.length]);
  const [rotation] = useState(rotations[Math.floor(Math.random() * rotations.length)]);

  const noteRef = useRef(null);

  const screenPosition = {
    x: (worldX || 0) - cameraPosition.x,
    y: (worldY || 0) - cameraPosition.y
  };

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartWorld, setDragStartWorld] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    setZIndex(Date.now());
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartWorld({ x: worldX || 0, y: worldY || 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newWorldX = dragStartWorld.x + deltaX;
    const newWorldY = dragStartWorld.y + deltaY;
    
    if (onMove) {
      onMove(newWorldX, newWorldY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, dragStartWorld]);

  return (
    <motion.div
      ref={noteRef}
      className={`absolute bg-gradient-to-br ${colorClass} p-4 rounded-lg shadow-lg w-64 cursor-move pointer-events-auto`}
      style={{
        zIndex,
        rotate: `${rotation}deg`,
        boxShadow: isDragging ? '0 10px 25px rgba(127, 90, 240, 0.5)' : '0 4px 20px rgba(127, 90, 240, 0.3)',
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: screenPosition.x,
        y: screenPosition.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        opacity: { duration: 0.3 },
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => {
        if (type === "audio") {
          const audio = noteRef.current.querySelector('audio');
          if (audio) {
            if (audio.paused) {
              audio.play();
              const playBtn = noteRef.current.querySelector('.play-pause-btn');
              if (playBtn) {
                playBtn.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                  </svg>
                `;
              }
            } else {
              audio.pause();
              const playBtn = noteRef.current.querySelector('.play-pause-btn');
              if (playBtn) {
                playBtn.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                  </svg>
                `;
              }
            }
          }
        } else {
          navigator.clipboard.writeText(content).then(() => {
            toast("Text copied successfully!");
          });
        }
      }}
    >
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-black hover:bg-opacity-50 transition-all pointer-events-auto cursor-pointer"
      >
        <FiX />
      </button>
      <div className="text-white break-words whitespace-pre-wrap select-text">
        {type == "text" && <div className="pointer-events-none">{content}</div>}
        {type == "image" && <img src={content} className="rounded-2xl pointer-events-none" />}
        {type == "audio" && (
          <div className="audio-player-container pointer-events-auto">
            <div className="audio-player">
              <div className="audio-info">
                <div className="audio-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="audio-details">
                  <div className="audio-title">Audio File</div>
                  <div className="audio-duration">00:00</div>
                </div>
              </div>
              <div className="audio-controls">
                <button className="play-pause-btn" onClick={(e) => {
                  e.stopPropagation();
                  const audio = e.target.closest('.audio-player').querySelector('audio');
                  if (audio.paused) {
                    audio.play();
                    e.target.innerHTML = `
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                        <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                      </svg>
                    `;
                  } else {
                    audio.pause();
                    e.target.innerHTML = `
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                      </svg>
                    `;
                  }
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                  </svg>
                </button>
                <div className="audio-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              </div>
              <audio 
                src={content} 
                onLoadedMetadata={(e) => {
                  const audio = e.target;
                  const duration = Math.floor(audio.duration);
                  const minutes = Math.floor(duration / 60);
                  const seconds = duration % 60;
                  const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                  audio.closest('.audio-player').querySelector('.audio-duration').textContent = durationText;
                }}
                onTimeUpdate={(e) => {
                  const audio = e.target;
                  const progress = (audio.currentTime / audio.duration) * 100;
                  const progressFill = audio.closest('.audio-player').querySelector('.progress-fill');
                  if (progressFill) {
                    progressFill.style.width = `${progress}%`;
                  }
                }}
                onEnded={(e) => {
                  const playBtn = e.target.closest('.audio-player').querySelector('.play-pause-btn');
                  playBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                    </svg>
                  `;
                }}
              />
            </div>
          </div>
        )}
        {type == "video" && <video autoPlay loop className="rounded-2xl max-w-full h-auto pointer-events-none"><source src={content} type="video/mp4" />Your browser does not support the video tag.</video>}
      </div>
    </motion.div>
  );
};

export default StickyNote;
