import { useRef, useState } from 'react';
import StickyNote from './StickyNote';
import '../styles/sticky-note.css';

const NoteContainer = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const containerRef = useRef(null);
  const [counter, setCounter] = useState(0);

  const colorArr = ['#feff9c', '#7afcff', '#ff7eb9', '#cdfc93', '#ce81ff', '#fff740', '#ff7eb9'];

  const addHandler = () => {
    setNotes((prev) => [
      ...prev,
      <StickyNote
        key={prev.length}
        id={prev.length}
        containerRef={containerRef}
        onClick={() => setSelectedNote(prev.length)}
        color={colorArr[counter % colorArr.length]}
      ></StickyNote>,
    ]);
    setCounter(counter + 1);
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
