/**
 * Shared design tokens for the PDF templates.
 *
 * Fonts are deliberately limited to the PDF Standard 14 (Helvetica /
 * Times-Roman / Courier). Those are guaranteed present in every PDF reader and
 * need no font file, so PDF generation never depends on a network fetch — which
 * matters because generation now happens client-side, on demand.
 *
 * To adopt a custom face later, register it in `fonts.js` and point a theme's
 * `fontFamily` at it; nothing else needs to change.
 */

export const SANS = 'Helvetica';
export const SANS_BOLD = 'Helvetica-Bold';
export const SANS_OBLIQUE = 'Helvetica-Oblique';
export const SERIF = 'Times-Roman';
export const SERIF_BOLD = 'Times-Bold';
export const SERIF_ITALIC = 'Times-Italic';

/** A4 in PostScript points, the unit react-pdf lays out in. */
export const A4 = { width: 595.28, height: 841.89 };

/**
 * Vertical space a section heading must have beneath it to stay on the current
 * page. Without this, react-pdf happily leaves a heading stranded as the last
 * line of a page with its content on the next — the "orphaned heading" bug.
 */
export const KEEP_WITH_NEXT = 56;

const base = {
  fontFamily: SANS,
  fontFamilyBold: SANS_BOLD,
  fontFamilyItalic: SANS_OBLIQUE,

  // Type scale, in points.
  nameSize: 22,
  headlineSize: 11,
  sectionSize: 10,
  bodySize: 9.5,
  metaSize: 8.5,

  lineHeight: 1.45,

  // Ink.
  ink: '#1A1A1A',
  body: '#333333',
  muted: '#6B6B6B',
  rule: '#D8D8D8',
  accent: '#1A1A1A',
  onAccent: '#FFFFFF',

  // Page geometry.
  page: { paddingTop: 40, paddingBottom: 48, paddingHorizontal: 44 },

  // Rhythm.
  sectionGap: 15,
  entryGap: 11,

  sectionStyle: 'rule', // 'rule' | 'bar' | 'plain' | 'boxed'
  uppercaseSections: true,
  letterSpacing: 0.6,
};

/**
 * One entry per design shown in the Design tab. `layout` selects which renderer
 * the template module uses; the rest is pure styling.
 */
export const THEMES = {
  Default: {
    ...base,
    fontFamily: SERIF,
    fontFamilyBold: SERIF_BOLD,
    fontFamilyItalic: SERIF_ITALIC,
    nameSize: 24,
    bodySize: 10.5,
    sectionSize: 11,
    accent: '#000000',
    ink: '#000000',
    body: '#3A3A3A',
    rule: '#CFCFCF',
    letterSpacing: 1,
    layout: 'single',
  },

  Basic: {
    ...base,
    accent: '#4A4A4A',
    ink: '#111111',
    rule: '#DDDDDD',
    sectionStyle: 'bar',
    layout: 'single',
  },

  // Dark banner masthead over a two-column body on white: employment on the
  // left, supporting detail in a narrower right-hand column.
  Professional: {
    ...base,
    accent: '#3B4351',
    bannerBackground: '#3B4351',
    bannerInk: '#FFFFFF',
    bannerMuted: '#C7CDD6',
    ink: '#2B3440',
    body: '#3F4854',
    muted: '#7A828D',
    rule: '#D8DDE3',
    nameSize: 21,
    sectionSize: 12.5,
    sectionWeight: 'regular',
    uppercaseSections: false,
    letterSpacing: 0,
    asideWidth: 166,
    asideGutter: 22,
    bannerHeight: 106,
    layout: 'banner-aside',
  },

  Unique: {
    ...base,
    accent: '#111111',
    ink: '#000000',
    rule: '#111111',
    sectionStyle: 'boxed',
    letterSpacing: 1.4,
    layout: 'single',
  },

  // Terracotta sidebar with a circular photo, icon contact rows and dot
  // ratings; dates run down a left gutter in the main column.
  Modern: {
    ...base,
    accent: '#A9503C',
    ink: '#2A2A2A',
    body: '#3A3A3A',
    muted: '#6E6E6E',
    rule: '#E2CCC6',
    sidebarWidth: 188,
    sidebarBackground: '#A9503C',
    sidebarInk: '#FFFFFF',
    sidebarMuted: '#EEC9BF',
    nameSize: 20,
    sectionSize: 12.5,
    sectionWeight: 'regular',
    uppercaseSections: false,
    letterSpacing: 0,
    dateColumn: 96,
    layout: 'sidebar',
  },

  Classic: {
    ...base,
    accent: '#2585E0',
    ink: '#111111',
    rule: '#D6E6F7',
    sectionStyle: 'plain',
    uppercaseSections: false,
    sectionSize: 11.5,
    layout: 'single',
  },

  Luxe: {
    ...base,
    fontFamily: SERIF,
    fontFamilyBold: SERIF_BOLD,
    fontFamilyItalic: SERIF_ITALIC,
    accent: '#7A1E37',
    ink: '#1A1A1A',
    rule: '#E0CBD2',
    nameSize: 26,
    bodySize: 10.5,
    sectionSize: 11,
    letterSpacing: 1.6,
    layout: 'banner',
  },

  Elegant: {
    ...base,
    accent: '#3E9DA0',
    ink: '#1F2937',
    rule: '#CCE8E9',
    bannerBackground: '#3E9DA0',
    bannerInk: '#FFFFFF',
    layout: 'banner',
  },
};

export const getTheme = (name) => THEMES[name] || THEMES.Default;

export default THEMES;
