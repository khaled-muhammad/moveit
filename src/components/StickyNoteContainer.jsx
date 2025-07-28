import { useState, useEffect, useRef } from 'react';
import StickyNote from './StickyNote';
import { useWebSocketContext } from './WebSocketProvider';

const StickyNoteContainer = () => {
  const { sharedClipboards, setSharedClipboards, sendJsonMessage } = useWebSocketContext();
  
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cameraStart, setCameraStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleRemoveNote = (note) => {
    setSharedClipboards(prev => prev.filter((n) => n.id !== note.id));
    sendJsonMessage({
      type: 'delete_note',
      message: note.content,
    })
  };

  const getSpawnPosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const noteWidth = 256;
    const noteHeight = 200;
    
    const visibleStartX = cameraPosition.x;
    const visibleEndX = cameraPosition.x + viewportWidth;
    const visibleStartY = cameraPosition.y;
    const visibleEndY = cameraPosition.y + viewportHeight;
    
    const padding = 50;
    const spawnStartX = visibleStartX + padding;
    const spawnEndX = visibleEndX - noteWidth - padding;
    const spawnStartY = visibleStartY + padding;
    const spawnEndY = visibleEndY - noteHeight - padding;
    
    const finalSpawnStartX = Math.max(spawnStartX, spawnEndX - 100);
    const finalSpawnStartY = Math.max(spawnStartY, spawnEndY - 100);
    
    return {
      worldX: finalSpawnStartX + Math.random() * (spawnEndX - finalSpawnStartX),
      worldY: finalSpawnStartY + Math.random() * (spawnEndY - finalSpawnStartY)
    };
  };

  useEffect(() => {
    const newNotes = sharedClipboards.filter(note => !note.worldX || !note.worldY);
    if (newNotes.length > 0) {
      setSharedClipboards(prev => 
        prev.map(note => {
          if (!note.worldX || !note.worldY) {
            const spawnPos = getSpawnPosition();
            return {
              ...note,
              worldX: spawnPos.worldX,
              worldY: spawnPos.worldY
            };
          }
          return note;
        })
      );
    }
  }, [sharedClipboards, cameraPosition]);



  useEffect(() => {
    const keys = { 
      w: false, a: false, s: false, d: false, 
      ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false 
    };
    
    const handleKeyDown = (e) => {
      if (keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
      }
    };
    
    const handleKeyUp = (e) => {
      if (keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = false;
      }
    };

    const updateCamera = () => {
      const speed = 5;
      let deltaX = 0;
      let deltaY = 0;

      if (keys.w || keys.ArrowUp) deltaY -= speed;
      if (keys.s || keys.ArrowDown) deltaY += speed;
      if (keys.a || keys.ArrowLeft) deltaX -= speed;
      if (keys.d || keys.ArrowRight) deltaX += speed;

      if (deltaX !== 0 || deltaY !== 0) {
        setCameraPosition(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
      }

      animationFrameRef.current = requestAnimationFrame(updateCamera);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    animationFrameRef.current = requestAnimationFrame(updateCamera);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleMouseDown = (e) => {
    if (e.target === containerRef.current || 
        e.target.classList.contains('infinite-canvas') ||
        e.target.tagName === 'svg' ||
        e.target.tagName === 'line' ||
        e.target.tagName === 'circle') {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setCameraStart({ x: cameraPosition.x, y: cameraPosition.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setCameraPosition({
        x: cameraStart.x - deltaX,
        y: cameraStart.y - deltaY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.target === containerRef.current || 
        e.target.classList.contains('infinite-canvas') ||
        e.target.tagName === 'svg' ||
        e.target.tagName === 'line' ||
        e.target.tagName === 'circle') {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setCameraStart({ x: cameraPosition.x, y: cameraPosition.y });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches[0]) {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;
      
      setCameraPosition({
        x: cameraStart.x - deltaX,
        y: cameraStart.y - deltaY
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, cameraStart]);

  const renderGrid = () => {
    const gridSize = 50;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const startX = Math.floor((cameraPosition.x - viewportWidth) / gridSize) * gridSize;
    const endX = Math.ceil((cameraPosition.x + viewportWidth * 2) / gridSize) * gridSize;
    const startY = Math.floor((cameraPosition.y - viewportHeight) / gridSize) * gridSize;
    const endY = Math.ceil((cameraPosition.y + viewportHeight * 2) / gridSize) * gridSize;

    const lines = [];
    
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x - cameraPosition.x}
          y1={startY - cameraPosition.y}
          x2={x - cameraPosition.x}
          y2={endY - cameraPosition.y}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
        />
      );
    }
    
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={startX - cameraPosition.x}
          y1={y - cameraPosition.y}
          x2={endX - cameraPosition.x}
          y2={y - cameraPosition.y}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
        />
      );
    }

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {lines}
        <circle
          cx={-cameraPosition.x}
          cy={-cameraPosition.y}
          r="3"
          fill="rgba(255, 255, 255, 0.3)"
        />
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden z-10"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {renderGrid()}
      <div className="relative w-full h-full infinite-canvas">
        {sharedClipboards.map((note) => (
          <StickyNote
            key={note.id}
            content={note.content}
            type={note.extra}
            index={note.id}
            onRemove={() => handleRemoveNote(note)}
            constraintsRef={null}
            cameraPosition={cameraPosition}
            worldX={note.worldX}
            worldY={note.worldY}
            onMove={(newWorldX, newWorldY) => {
              setSharedClipboards(prev => 
                prev.map(n => 
                  n.id === note.id 
                    ? { ...n, worldX: newWorldX, worldY: newWorldY }
                    : n
                )
              );
            }}
          />
        ))}
      </div>

      {/* <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-3 rounded-lg pointer-events-auto z-20">
        <div className="text-sm font-semibold mb-2">Navigation</div>
        <div className="text-xs space-y-1">
          <div>• Drag background to pan</div>
          <div>• Use WASD or arrow keys</div>
          <div>• Camera: ({Math.round(cameraPosition.x)}, {Math.round(cameraPosition.y)})</div>
        </div>
      </div> */}

      <div className="absolute bottom-4 right-4 w-32 h-24 bg-black bg-opacity-50 rounded-lg pointer-events-auto z-20">
        <div className="w-full h-full relative overflow-hidden rounded-lg">
          <svg className="w-full h-full">
            {/* Mini-map notes */}
            {sharedClipboards.map((note) => {
              const miniX = ((note.worldX || 0) / 50) + 64;
              const miniY = ((note.worldY || 0) / 50) + 48;
              
              return (
                <circle
                  key={`mini-${note.id}`}
                  cx={miniX}
                  cy={miniY}
                  r="2"
                  fill="rgba(147, 51, 234, 0.8)"
                />
              );
            })}
            {/* Camera view indicator */}
            <rect
              x={(cameraPosition.x / 50) + 64}
              y={(cameraPosition.y / 50) + 48}
              width={window.innerWidth / 50}
              height={window.innerHeight / 50}
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StickyNoteContainer;