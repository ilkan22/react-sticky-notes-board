import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import StickyNote from './components/StickyNote';
import NoteContainer from './components/NoteContainer';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NoteContainer></NoteContainer>
  </StrictMode>
);
