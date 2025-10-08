import React from 'react';
import { createRoot } from 'react-dom/client';
import { SettingsLayout } from '../layouts/SettingsLayout';
import '../styles/index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error(
    'Root element not found. Did you forget to add it to your settings.html? Or maybe the id attribute got misspelled?',
  );
}

const root = createRoot(container);
root.render(<SettingsLayout />);