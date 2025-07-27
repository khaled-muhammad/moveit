import { useState, useEffect } from 'react';
import StickyNote from './StickyNote';
import { useWebSocketContext } from './WebSocketProvider';

const StickyNoteContainer = () => {
  const { sharedClipboards, setSharedClipboards, sendJsonMessage } = useWebSocketContext();
  
  const handleRemoveNote = (note) => {
    setSharedClipboards(prev => prev.filter((n) => n.id !== note.id));
    sendJsonMessage({
      type: 'delete_note',
      message: note.content,
    })
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      <div className="relative w-full h-full">
        {sharedClipboards.map((note) => (
          <StickyNote
            key={note.id}
            content={note.content}
            type={note.extra}
            index={note.id}
            onRemove={() => handleRemoveNote(note)}
          />
        ))}
      </div>
    </div>
  );
};

export default StickyNoteContainer;