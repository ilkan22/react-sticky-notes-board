import { useRef, useState } from 'react';
import StickyNote from './StickyNote';
import '../styles/sticky-note.css';

const NoteContainer = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const containerRef = useRef(null);
  const [counter, setCounter] = useState(0);

  const [conntectorActive, setConntectorActive] = useState(false);
  const [connections, setConnections] = useState([]);
  const [selectedForConnection, setSelectedForConnection] = useState([]);

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
        text: '',
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
  exportToJson:
  - Creates a JSON object containing all current notes and connections
  - Converts it into a downloadable file
  - Triggers an automatic download in the browser
*/
  const exportToJson = () => {
    const data = {
      notes,
      connections,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes-and-connections.json';
    a.click();
    URL.revokeObjectURL(url);
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
        <button
          onClick={() => {
            setConntectorActive((prev) => !prev);
            setSelectedForConnection([]);
          }}
        >
          {conntectorActive ? 'Connector: On' : 'Connector: Off'}
        </button>
        <button onClick={exportToJson}>Export</button>
      </div>
      <div ref={containerRef} className="note-container">
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            /*pointerEvents: 'none',*/
          }}
        >
          {(() => {
            const noteMap = Object.fromEntries(notes.map((n) => [n.id, n]));
            return connections.map((conn, index) => {
              const fromNote = noteMap[conn.from];
              const toNote = noteMap[conn.to];
              if (!fromNote || !toNote) return null;

              const fromX = fromNote.x + 75;
              const fromY = fromNote.y + 75;
              const toX = toNote.x + 75;
              const toY = toNote.y + 75;

              return (
                <line
                  key={index}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="black"
                  strokeWidth="2"
                  onClick={() => {
                    setConnections((prev) =>
                      prev.filter(
                        (c) =>
                          !(
                            (c.from === conn.from && c.to === conn.to) ||
                            (c.from === conn.to && c.to === conn.from)
                          )
                      )
                    );
                  }}
                />
              );
            });
          })()}
        </svg>
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            id={note.id}
            containerRef={containerRef}
            onClick={() => {
              if (conntectorActive) {
                if (selectedForConnection.some((n) => n.id === note.id)) return;

                const updated = [...selectedForConnection, note];

                if (updated.length === 2) {
                  setConnections((prev) => {
                    const from = updated[0].id;
                    const to = updated[1].id;

                    const exists = prev.some(
                      (conn) =>
                        (conn.from === from && conn.to === to) ||
                        (conn.from === to && conn.to === from)
                    );

                    if (exists) return prev;

                    return [...prev, { from, to }];
                  });
                  setSelectedForConnection([]);
                } else {
                  setSelectedForConnection(updated);
                }
              } else {
                setSelectedNote(note.id);
              }
            }}
            x={note.x}
            y={note.y}
            color={note.color}
            onPosChange={(id, newX, newY) => {
              setNotes((prev) =>
                prev.map((note) => (note.id === id ? { ...note, x: newX, y: newY } : note))
              );
            }}
            onTextChange={(id, newText) => {
              setNotes((prev) =>
                prev.map((note) => (note.id === id ? { ...note, text: newText } : note))
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteContainer;
