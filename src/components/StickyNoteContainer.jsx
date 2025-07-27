import { useState, useEffect } from 'react';
import StickyNote from './StickyNote';
import { useWebSocketContext } from './WebSocketProvider';

const StickyNoteContainer = () => {
  const { sharedClipboards, setSharedClipboards } = useWebSocketContext();
  
  const handleRemoveNote = (id) => {
    setSharedClipboards(prev => prev.filter((note) => note.id !== id));
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      <div className="relative w-full h-full">
        {sharedClipboards.map((note) => (
          <StickyNote
            key={note.id}
            content={note.content}
            index={note.id}
            onRemove={() => handleRemoveNote(note.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StickyNoteContainer;