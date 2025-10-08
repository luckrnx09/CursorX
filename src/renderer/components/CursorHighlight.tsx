import React, { useEffect, useRef } from 'react';
import { Settings, MousePosition } from '../../shared/types';
import { OutlineEffect } from './OutlineEffect';

interface CursorHighlightProps {
  position: MousePosition;
  settings: Settings;
}

export function CursorHighlight({ position, settings }: CursorHighlightProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      const { x, y } = position;
      const { size } = settings;
      
      elementRef.current.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
    }
  }, [position, settings.size]);

  // Helper function to convert hex color to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(255, 255, 255, ${alpha})`;
  };
  
  // Convert both background and outline colors to rgba with their respective opacities
  const backgroundColorWithOpacity = hexToRgba(settings.background.color, settings.background.opacity);
  const outlineColorWithOpacity = hexToRgba(settings.outline.color, settings.outline.opacity);

  return (
    <div
      ref={elementRef}
      className="rounded-full"
      style={{
        width: `${settings.size}px`,
        height: `${settings.size}px`,
        backgroundColor: backgroundColorWithOpacity,
        animationDuration: `.3s`,
        position: 'relative',
      }}
    >
      <OutlineEffect
        size={settings.size}
        outlineColor={outlineColorWithOpacity}
        outlineWidth={settings.outline.width}
        outlineOffset={settings.outline.offset}
      />
    </div>
  );
}