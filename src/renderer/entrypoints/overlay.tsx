import React from 'react';
import { createRoot } from 'react-dom/client';
import { OverlayLayout } from '../layouts/OverlayLayout';
import '../styles/index.css';

const container = document.getElementById('overlay-root');

if (!container) {
  throw new Error('Overlay root element not found. Did you forget to add it to your overlay.html?');
}

const root = createRoot(container);
root.render(<OverlayLayout />);
