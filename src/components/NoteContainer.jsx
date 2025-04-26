import { useRef, useEffect } from 'react';
import StickyNote from './StickyNote';
import '../styles/sticky-note.css';

const NoteContainer = () => {
  const containerRef = useRef(null);
  const noteRef = useRef(null);

  const isClicked = useRef(false);

  const coords = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    if (!noteRef.current || !containerRef.current) return;

    const note = noteRef.current;
    const container = containerRef.current;

    const onMouseDown = (e) => {
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    };
    const onMouseUp = () => {
      isClicked.current = false;
      coords.current.lastX = note.offsetLeft;
      coords.current.lastY = note.offsetTop;
    };
    const onMouseMove = (e) => {
      if (!isClicked.current) return;

      const containerRect = container.getBoundingClientRect();

      let nextX = e.clientX - coords.current.startX + coords.current.lastX;
      let nextY = e.clientY - coords.current.startY + coords.current.lastY;

      const maxX = containerRect.width - note.offsetWidth;
      const maxY = containerRect.height - note.offsetHeight;

      if (nextX < 0) nextX = 0;
      if (nextY < 0) nextY = 0;
      if (nextX > maxX) nextX = maxX;
      if (nextY > maxY) nextY = maxY;

      note.style.left = `${nextX}px`;
      note.style.top = `${nextY}px`;
    };

    note.addEventListener('mousedown', onMouseDown);
    note.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseUp);

    const cleanup = () => {
      note.removeEventListener('mousedown', onMouseDown);
      note.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseUp);
    };

    return cleanup;
  }, []);
  return (
    <div ref={containerRef} className="note-container">
      <StickyNote ref={noteRef} />
    </div>
  );
};

export default NoteContainer;
