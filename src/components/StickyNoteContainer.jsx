import { useState, useEffect } from 'react';
import StickyNote from './StickyNote';
import { useWebSocketContext } from './WebSocketProvider';

const StickyNoteContainer = () => {
  const { sharedClipboards, setSharedClipboards } = useWebSocketContext();
  
  const handleRemoveNote = (index) => {
    setSharedClipboards(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      <div className="relative w-full h-full">
        {sharedClipboards.map((content, index) => (
          <StickyNote
            key={`note-${index}`}
            content={content}
            index={index}
            onRemove={() => handleRemoveNote(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default StickyNoteContainer;