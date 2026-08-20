/**
 * Minimal HTML -> block model converter for CKEditor content.
 *
 * Custom sections are authored in CKEditor, so they arrive as HTML. react-pdf
 * has no HTML renderer, and `dangerouslySetInnerHTML` obviously does not exist
 * there, so we parse to a small block model that the templates render with
 * plain <Text>/<View> primitives.
 *
 * Deliberately hand-rolled rather than DOM-based: this runs identically in the
 * browser and in Node (the PDF snapshot tests), and the supported subset is
 * exactly what CKEditor's classic build can emit.
 */

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  bull: '•',
  middot: '·',
};

function decodeEntities(value) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const code =
        entity[1] === 'x' || entity[1] === 'X'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    const key = entity.toLowerCase();
    return key in ENTITIES ? ENTITIES[key] : match;
  });
}

// Tags that begin a new block rather than styling inline text.
const BLOCK_TAGS = new Set(['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre']);
const LIST_TAGS = new Set(['ul', 'ol']);

const MARK_BY_TAG = {
  b: 'bold',
  strong: 'bold',
  i: 'italic',
  em: 'italic',
  u: 'underline',
  s: 'strike',
  strike: 'strike',
  del: 'strike',
  a: 'link',
};

/**
 * Parse into: { type: 'paragraph'|'heading'|'listItem', level?, ordered?, runs }
 * where each run is `{ text, bold, italic, underline, strike, href }`.
 */
export function parseHtml(html) {
  if (!html) return [];

  // Content that was never HTML: treat newlines as paragraph breaks.
  if (!/<[a-z!/][\s\S]*>/i.test(html)) {
    return String(html)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({ type: 'paragraph', runs: [{ text: line }] }));
  }

  const blocks = [];
  const marks = []; // active inline formatting, innermost last
  const listStack = []; // active <ul>/<ol> nesting
  let current = null;
  let href = null;

  const activeMarks = () => {
    const applied = {};
    for (const mark of marks) applied[mark] = true;
    return applied;
  };

  const startBlock = (type, extra = {}) => {
    flush();
    current = { type, runs: [], ...extra };
  };

  const flush = () => {
    if (!current) return;
    // Collapse whitespace-only runs so empty <p></p> does not create a gap.
    const runs = current.runs.filter((run) => run.text !== '');
    if (runs.length) blocks.push({ ...current, runs });
    current = null;
  };

  const pushText = (value) => {
    if (!value) return;
    if (!current) current = { type: 'paragraph', runs: [] };
    const run = { text: value, ...activeMarks() };
    if (href) run.href = href;

    // Merge with the previous run when formatting is identical, so a sentence
    // split across tags still measures and wraps as one string.
    const previous = current.runs[current.runs.length - 1];
    if (previous && sameFormatting(previous, run)) previous.text += run.text;
    else current.runs.push(run);
  };

  const pattern = /<!--[\s\S]*?-->|<\/?([a-z][a-z0-9]*)\b([^>]*)>|([^<]+)/gi;
  let match;

  while ((match = pattern.exec(html)) !== null) {
    const [raw, tagName, attributes, textChunk] = match;

    if (textChunk != null) {
      // Whitespace between block tags is layout noise, not content.
      const value = decodeEntities(textChunk).replace(/\s+/g, ' ');
      if (value.trim() === '' && !current) continue;
      pushText(value);
      continue;
    }

    if (!tagName) continue; // comment
    const tag = tagName.toLowerCase();
    const isClosing = raw[1] === '/';
    const selfClosing = /\/>$/.test(raw);

    if (tag === 'br') {
      pushText('\n');
      continue;
    }

    if (LIST_TAGS.has(tag)) {
      flush();
      if (isClosing) listStack.pop();
      else listStack.push(tag === 'ol' ? { ordered: true, index: 0 } : { ordered: false });
      continue;
    }

    if (tag === 'li') {
      if (isClosing) {
        flush();
        continue;
      }
      const list = listStack[listStack.length - 1] || { ordered: false };
      if (list.ordered) list.index = (list.index || 0) + 1;
      startBlock('listItem', {
        ordered: Boolean(list.ordered),
        marker: list.ordered ? `${list.index}.` : '•',
        depth: Math.max(0, listStack.length - 1),
      });
      continue;
    }

    if (BLOCK_TAGS.has(tag)) {
      if (isClosing) flush();
      else if (/^h[1-6]$/.test(tag)) startBlock('heading', { level: Number(tag[1]) });
      else startBlock('paragraph');
      continue;
    }

    const mark = MARK_BY_TAG[tag];
    if (mark) {
      if (mark === 'link') {
        if (isClosing) href = null;
        else href = extractHref(attributes);
        continue;
      }
      if (isClosing) {
        const index = marks.lastIndexOf(mark);
        if (index !== -1) marks.splice(index, 1);
      } else if (!selfClosing) {
        marks.push(mark);
      }
    }
    // Unknown tags (span, font, table…) are transparent: their text still flows.
  }

  flush();
  return blocks;
}

function sameFormatting(a, b) {
  return (
    Boolean(a.bold) === Boolean(b.bold) &&
    Boolean(a.italic) === Boolean(b.italic) &&
    Boolean(a.underline) === Boolean(b.underline) &&
    Boolean(a.strike) === Boolean(b.strike) &&
    a.href === b.href
  );
}

function extractHref(attributes = '') {
  const match = /href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attributes);
  if (!match) return null;
  return decodeEntities(match[2] ?? match[3] ?? match[4] ?? '') || null;
}

/** Flatten HTML to plain text — used for ATS output and text measurement. */
export function htmlToText(html) {
  return parseHtml(html)
    .map((block) => block.runs.map((run) => run.text).join(''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default parseHtml;
