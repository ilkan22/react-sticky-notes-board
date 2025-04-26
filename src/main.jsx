import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import StickyNote from './components/StickyNote';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StickyNote />
  </StrictMode>
);
