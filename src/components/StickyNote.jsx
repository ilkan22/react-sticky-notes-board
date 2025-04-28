import { useRef, useState, useEffect } from 'react';
import '../styles/sticky-note.css';

const StickyNote = ({ containerRef, id, onClick }) => {
  const [text, setText] = useState('Note');
  const noteRef = useRef(null);
  const ref = useRef(null);

  /*
  Input handler:
  - Updates the text state
  - Restricts the text length based on the note size
*/
  const handleInput = (e) => {
    const newText = e.target.innerText;
    const oldText = text;
    setText(newText);

    const wrapHeight = parseInt(window.getComputedStyle(ref.current).height, 10);
    const noteHeight = parseInt(window.getComputedStyle(noteRef.current).height, 10);
    if (wrapHeight < noteHeight) {
      e.target.innerText = oldText;
      setText(oldText);
    }
  };

  const isClicked = useRef(false);

  const coords = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    if (!ref.current || !containerRef.current) return;

    const note = ref.current;
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
    <div ref={ref} onClick={() => onClick && onClick()} className="note-wrapper">
      <div ref={noteRef} className="sticky-note" contentEditable onInput={handleInput}></div>
    </div>
  );
};

export default StickyNote;
