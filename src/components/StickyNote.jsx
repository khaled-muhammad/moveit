import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import {
  ParagraphNode,
  TextNode,
} from 'lexical';
import ExampleTheme from './ExampleTheme';
import { ImageNode } from './plugins/ImageNode.jsx';


const readerConfig = {
  namespace: 'StickyNote Reader',
  nodes: [ParagraphNode, TextNode, ImageNode],
  onError(error) {
    console.error('Lexical reader error:', error);
  },
  theme: ExampleTheme,
  editable: false,
};

const LexicalReader = ({ editorState }) => {
  return (
    <LexicalComposer initialConfig={{ ...readerConfig, editorState }}>
      <div className="editor-container">
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                readOnly={true}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};

const StickyNote = ({ content, type, index, onRemove, constraintsRef = null, onMove, cameraPosition, worldX, worldY, isBeamNote, noteData, user }) => {
  const colors = [
    'from-purple-400 to-indigo-500',
    'from-indigo-400 to-blue-500',
    'from-blue-400 to-cyan-500',
    'from-cyan-400 to-teal-500',
    'from-teal-400 to-green-500',
  ];

  const rotations = [-3, -2, -1, 0, 1, 2, 3];

  const getColorIndex = () => {
    if (typeof index === 'number') {
      return index;
    } else if (typeof index === 'string') {
      const hash = index.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return Math.abs(hash);
    }
    return 0;
  };

  const [zIndex, setZIndex] = useState(typeof index === 'number' ? index + 1 : Date.now());
  const [colorClass] = useState(colors[getColorIndex() % colors.length]);
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
        {/* User information display */}
        {user && (
          <div className="mb-2 pb-2 border-b border-white border-opacity-20">
            <div className="flex items-center gap-2 text-sm">
              {user.profile_picture ? (
                <img 
                  src={user.profile_picture} 
                  alt={`${user.first_name || user.username}'s profile`}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback to initial if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-xs font-semibold ${user.profile_picture ? 'hidden' : ''}`}>
                {user.first_name ? user.first_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user.username}
                </div>
                {user.first_name && user.last_name && (
                  <div className="text-xs opacity-80">@{user.username}</div>
                )}
              </div>
            </div>
          </div>
        )}
        
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
        {type == "lexi_note" && <div>
          <h3 className="text-lg font-semibold mb-2">{isBeamNote ? noteData?.title : content.title}</h3>
          <div className="lexical-content-reader scrollbar-on-purple">
            <LexicalReader editorState={JSON.stringify(isBeamNote ? noteData?.json_content : content.content)} />
          </div>
        </div>}
      </div>
    </motion.div>
  );
};

export default StickyNote;
