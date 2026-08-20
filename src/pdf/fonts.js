import { Font } from '@react-pdf/renderer';

/**
 * Font and text-shaping setup, applied once at import time.
 *
 * The templates use the PDF Standard 14 faces (Helvetica / Times-Roman), which
 * every reader already has. That keeps generation entirely offline — no font
 * file to fetch, nothing to fail at download time.
 *
 * To adopt a custom face, drop the .ttf files in `public/fonts/` and register
 * them here, then point a theme's `fontFamily` at the registered name. Prefer
 * bundled files over a remote URL so PDF generation keeps working offline.
 */

let applied = false;

export function setupPdfFonts() {
  if (applied) return;
  applied = true;

  // react-pdf hyphenates by default. On a CV that is actively harmful: it
  // splits surnames across lines ("Whitfield-Bar- rington") and litters body
  // text with mid-word breaks. Returning the word unchanged disables it.
  Font.registerHyphenationCallback((word) => [word]);
}

export default setupPdfFonts;
