import React, { useState, useEffect } from 'react';
import { CursorHighlight } from '../components/CursorHighlight';

import type { Settings, MousePosition } from '../../shared/types';

export function OverlayApp() {
  const [cursorPosition, setCursorPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => { 
    (async () => { 
      const position = await window.overlayAPI.getCursorPosition();
      setCursorPosition(position);
    })();
  }, [])
  
  useEffect(() => { 
    (async () => { 
      const settings = await window.overlayAPI.getSettings();
      setSettings(settings);
    })()
  }, [])
  
  useEffect(() => {
    if (window.overlayAPI) {
      window.overlayAPI.onCursorPositionChange(setCursorPosition);
      
      window.overlayAPI.onSettingsUpdate(setSettings);
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[999999]">
      {settings && settings.enabled && (
        <CursorHighlight
          position={cursorPosition}
          settings={settings}
        />
      )}
    </div>
  );
}