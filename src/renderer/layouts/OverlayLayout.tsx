import React, { useState, useEffect, useRef } from 'react';
import { CursorHighlight } from '../components/CursorHighlight';

import { Settings, MousePosition } from '../../shared/types';

export function OverlayLayout() {
  const [cursorPosition, setCursorPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [settings, setSettings] = useState<Settings | null>(null);
  const [visible, setVisible] = useState(true);
  const lastMoveTimeRef = useRef(Date.now());

  useEffect(() => {
    (async () => {
      const position = await window.overlayAPI.getCursorPosition();
      setCursorPosition(position);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const settings = await window.overlayAPI.getSettings();
      setSettings(settings);
    })();
  }, []);

  useEffect(() => {
    if (window.overlayAPI) {
      window.overlayAPI.onCursorPositionChange((position: MousePosition) => {
        setCursorPosition(position);
        setVisible(true);
        lastMoveTimeRef.current = Date.now();
      });

      window.overlayAPI.onSettingsUpdate(setSettings);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const hiddenAfterMs = settings?.hiddenAfterMs ?? 5;
      if (hiddenAfterMs > 0 && Date.now() - lastMoveTimeRef.current >= hiddenAfterMs * 1000) {
        setVisible(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [settings?.hiddenAfterMs]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[999999]">
      {settings && settings.enabled && (
        <CursorHighlight position={cursorPosition} settings={settings} visible={visible} />
      )}
    </div>
  );
}
