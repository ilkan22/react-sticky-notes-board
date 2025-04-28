import { useRef, useState } from 'react';
import StickyNote from './StickyNote';
import '../styles/sticky-note.css';

const NoteContainer = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const containerRef = useRef(null);

  const addHandler = () => {
    setNotes((prev) => [
      ...prev,
      <StickyNote
        key={prev.length}
        id={prev.length}
        containerRef={containerRef}
        onClick={() => setSelectedNote(prev.length)}
      ></StickyNote>,
    ]);
  };
  const deleteHandler = () => {
    if (selectedNote != null) {
      console.log('hier');
      setNotes((prev) => prev.filter((note) => note.props.id !== selectedNote));
      setSelectedNote(null);
    }
  };
  return (
    <div>
      <div>
        <button onClick={addHandler}>+</button>
        <button onClick={deleteHandler}>-</button>
      </div>
      <div ref={containerRef} className="note-container">
        {notes}
      </div>
    </div>
  );
};

export default NoteContainer;
