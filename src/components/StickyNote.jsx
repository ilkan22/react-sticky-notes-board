import { useRef, useState, useEffect } from 'react';
import '../styles/sticky-note.css';

const StickyNote = ({ containerRef, id, onClick, color, x, y, onPosChange, onTextChange }) => {
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
    } else {
      onTextChange(id, newText);
    }
  };

  const isClicked = useRef(false);

  const coords = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

  /*
  useEffect:
  - Adds mouse event listeners for dragging the note
  - Calculates new position while dragging
  - Restricts movement within the container
  - Calls onPosChange to update parent with new position
  - Cleans up all event listeners when component unmounts
*/
  useEffect(() => {
    if (!ref.current || !containerRef.current) return;

    const note = ref.current;
    const container = containerRef.current;

    /*
    onMouseDown:
    - Called when the mouse is pressed on the note
    - Starts the drag by storing the current mouse position
  */
    const onMouseDown = (e) => {
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    };

    /*
    onMouseUp:
    - Called when mouse is released
    - Ends the drag
    - Stores the final position of the note
    - Notifies the parent component of the new position
  */
    const onMouseUp = () => {
      isClicked.current = false;
      coords.current.lastX = note.offsetLeft;
      coords.current.lastY = note.offsetTop;

      /*if (onPosChange) {
        onPosChange(id, coords.current.lastX, coords.current.lastY);
      }*/
    };

    /*
    onMouseMove:
    - Called when the mouse moves while dragging
    - Calculates the new position of the note
    - Makes sure the note stays within the container
    - Updates the position of the note on the screen
  */
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

      if (onPosChange) {
        onPosChange(id, nextX, nextY);
      }
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
    <div
      ref={ref}
      onClick={() => onClick && onClick()}
      className="note-wrapper"
      style={{
        background: color,
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div ref={noteRef} className="sticky-note" contentEditable onInput={handleInput}></div>
    </div>
  );
};

export default StickyNote;
