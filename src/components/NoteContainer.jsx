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
        key: new Date().getTime() + prev.length,
        id: new Date().getTime() + prev.length,
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
  importFromJson:
  - Imports a JSON file containing notes and connections
  - Replaces the current notes and connections with the imported ones
  - Assigns a unique ID to each imported note if missing
  - Updates the note counter based on the highest existing ID
*/
  const importFromJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);

        if (json.notes && json.connections) {
          setNotes([]);
          setConnections([]);

          const updatedNotes = json.notes.map((note) => ({
            ...note,
            id: note.id || new Date().getTime(),
          }));

          setNotes(updatedNotes);
          setConnections(json.connections);

          const maxId = Math.max(...updatedNotes.map((n) => n.id), 0);
          setCounter(maxId + 1);
        } else {
          alert('Invalid format');
        }
      } catch (err) {
        alert('Error reading the file: ' + err.message);
      }
    };

    reader.readAsText(file);
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
      <div className="button-container">
        <div className="buttons-left">
          <button onClick={addHandler} className="click-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          </button>
          <button onClick={deleteHandler} className="click-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
            </svg>
          </button>
        </div>
        <div className="buttons-middle">
          <span>Connector:</span>
          <button
            className={`toggle-btn ${conntectorActive ? 'toggled' : ''}`}
            onClick={() => {
              setConntectorActive((prev) => !prev);
              setSelectedForConnection([]);
            }}
          >
            <div className="toggle-dot"></div>
          </button>
        </div>
        <div className="buttons-right">
          <button onClick={exportToJson} className="click-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg>
            <span>Export</span>
          </button>
          <input
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            id="json-upload"
            onChange={importFromJson}
          />
          <button
            className="click-btn"
            onClick={() => {
              document.getElementById('json-upload').click();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
            </svg>
            <span>Import JSON</span>
          </button>
        </div>
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
            text={note.text}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteContainer;
