import { useRef, useState, forwardRef } from 'react';
import '../styles/sticky-note.css';

const StickyNote = forwardRef((props, ref) => {
  const [text, setText] = useState('Note');
  const noteRef = useRef(null);

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

  return (
    <div ref={ref} className="note-wrapper">
      <div ref={noteRef} className="sticky-note" contentEditable onInput={handleInput}></div>
    </div>
  );
});

export default StickyNote;
