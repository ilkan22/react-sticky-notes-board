import { useRef, useState } from 'react';
import StickyNote from './StickyNote';
import '../styles/sticky-note.css';

const NoteContainer = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const containerRef = useRef(null);
  const [counter, setCounter] = useState(0);

  const colorArr = ['#feff9c', '#7afcff', '#ff7eb9', '#cdfc93', '#ce81ff', '#fff740', '#ff7eb9'];

  /*
  addHandler:
  - Adds a new sticky note to the list
  - Sets position and color for the new note
  - Increments the note counter
*/
  const addHandler = () => {
    const col = colorArr[counter % colorArr.length];
    setNotes((prev) => [
      ...prev,
      {
        key: prev.length,
        id: prev.length,
        x: 0 + counter * 10,
        y: 0,
        color: col,
      },
    ]);
    setCounter(counter + 1);
    console.log(notes);
  };

  /*
  deleteHandler:
  - Deletes the selected sticky note from the list
  - Clears the selected note
*/
  const deleteHandler = () => {
    if (selectedNote != null) {
      console.log('hier');
      setNotes((prev) => prev.filter((note) => note.id !== selectedNote));
      setSelectedNote(null);
    }
  };

  /*
  StickyNote component inside .map():
  - Renders all notes
  - Passes position, color, and drag behavior
  - Sets selected note on click
  - Updates note position using onPosChange
*/
  return (
    <div>
      <div>
        <button onClick={addHandler}>+</button>
        <button onClick={deleteHandler}>-</button>
      </div>
      <div ref={containerRef} className="note-container">
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            id={note.id}
            containerRef={containerRef}
            onClick={() => setSelectedNote(note.id)}
            x={note.x}
            y={note.y}
            color={note.color}
            onPosChange={(id, newX, newY) => {
              setNotes((prev) =>
                prev.map((note) => (note.id === id ? { ...note, x: newX, y: newY } : note))
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteContainer;
