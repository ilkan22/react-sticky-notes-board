import { useRef } from 'react';
import StickyNote from './StickyNote';
import '../styles/sticky-note.css';

const NoteContainer = () => {
  const containerRef = useRef(null);
  return (
    <div ref={containerRef} className="note-container">
      <StickyNote containerRef={containerRef} />
      <StickyNote containerRef={containerRef} />
    </div>
  );
};

export default NoteContainer;
