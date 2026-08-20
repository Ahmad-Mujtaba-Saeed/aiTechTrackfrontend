import React from 'react';
import { Svg, Path, Circle, Rect, G } from '@react-pdf/renderer';

/**
 * Small vector icons for contact lines.
 *
 * Drawn as SVG paths rather than an icon font: react-pdf would need a font file
 * registered and loaded for glyph icons, and that reintroduces a load-time
 * dependency we deliberately removed. These are plain geometry, so they render
 * offline and scale cleanly at any size.
 *
 * All paths are authored on a 24x24 grid.
 */

const ICONS = {
  mail: (color) => (
    <>
      <Rect x="2.5" y="5" width="19" height="14" rx="2" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M3 7l9 6 9-6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  phone: (color) => (
    <Path
      d="M6.6 3h3l1.5 4-2.2 1.4a13 13 0 006.7 6.7L17 12.9l4 1.5v3a2 2 0 01-2.2 2A17.5 17.5 0 013.1 5.2 2 2 0 015.1 3z"
      fill={color}
    />
  ),
  pin: (color) => (
    <>
      <Path d="M12 22s7-6.4 7-12a7 7 0 10-14 0c0 5.6 7 12 7 12z" fill={color} />
      <Circle cx="12" cy="10" r="2.6" fill="#FFFFFF" />
    </>
  ),
  // Drawn as an outline with the glyph in the same ink rather than a filled
  // tile with a white knockout: these sit on both white and coloured grounds,
  // and a knockout would show as a solid blob on anything but white.
  linkedin: (color) => (
    <>
      <Rect x="2.5" y="2.5" width="19" height="19" rx="3" stroke={color} strokeWidth="1.8" fill="none" />
      <Circle cx="7.3" cy="7.4" r="1.5" fill={color} />
      <Rect x="6.1" y="10.2" width="2.4" height="7.6" fill={color} />
      <Path
        d="M11 10.2h2.3v1.1c.5-.85 1.45-1.4 2.65-1.4 2 0 3.05 1.25 3.05 3.6v4.3h-2.45v-3.9c0-1.15-.4-1.8-1.35-1.8s-1.8.65-1.8 1.9v3.8H11z"
        fill={color}
      />
    </>
  ),
  github: (color) => (
    <Path
      d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10 10 0 0012 2z"
      fill={color}
    />
  ),
  globe: (color) => (
    <>
      <Circle cx="12" cy="12" r="9.2" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M2.8 12h18.4M12 2.8a15 15 0 010 18.4M12 2.8a15 15 0 000 18.4" stroke={color} strokeWidth="2" fill="none" />
    </>
  ),
  user: (color) => (
    <>
      <Circle cx="12" cy="8" r="4" fill={color} />
      <Path d="M4 21a8 8 0 0116 0z" fill={color} />
    </>
  ),
};

export default function Icon({ name, size = 9, color = '#000000' }) {
  const draw = ICONS[name];
  if (!draw) return null;
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <G>{draw(color)}</G>
    </Svg>
  );
}
