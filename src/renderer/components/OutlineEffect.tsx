import React from 'react';

interface OutlineEffectProps {
  size: number;
  outlineColor: string;
  outlineWidth: number;
  outlineOffset: number;
}

export function OutlineEffect({
  size,
  outlineColor,
  outlineWidth,
  outlineOffset,
}: OutlineEffectProps) {
  // Calculate the scale factor to create the offset gap
  // When offset is 0, scale should be 1 (no gap)
  // When offset increases, scale should increase proportionally
  const scale = 1 + (outlineOffset * 2) / size;

  return (
    <div
      className="outline-effect"
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: `${outlineWidth}px solid ${outlineColor}`,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    />
  );
}
