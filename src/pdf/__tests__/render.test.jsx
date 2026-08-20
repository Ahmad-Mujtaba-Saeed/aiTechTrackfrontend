/**
 * Render every design and assert the PDF actually contains every piece of input
 * text.
 *
 * This is the regression guard for the bug that motivated the rewrite: the old
 * html2canvas pipeline rasterised the CV and sliced the image at fixed offsets,
 * so text fell off page boundaries. Checking page count alone would not have
 * caught that, so we extract the text back out of the generated PDF and diff it
 * against the tokens we know went in.
 *
 * Run with: npm run test:pdf
 */

import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { renderToBuffer } from '@react-pdf/renderer';

import ResumeDocument from '../ResumeDocument';
import { PDF_TEMPLATES } from '../templates';
import {
  LONG_RESUME,
  EMPTY_RESUME,
  OVERSIZED_BULLET_RESUME,
  REQUIRED_TOKENS,
  FORBIDDEN_TOKENS,
} from './fixture';

const OUT_DIR = process.env.PDF_OUT_DIR || path.join(process.cwd(), '.pdf-test-output');

/* --------------------------------------------------------- pdf plumbing -- */

/** Number of pages, read from the page tree. */
function countPages(buffer) {
  const matches = buffer.toString('latin1').match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 0;
}

/**
 * Pull visible text out of a PDF without a parser dependency.
 *
 * Inflates every FlateDecode stream, then collects the string literals that are
 * arguments to the text-showing operators (Tj / TJ / ' / "). Good enough to
 * assert presence or absence of a token.
 */
function extractText(buffer) {
  const raw = buffer.toString('latin1');
  const chunks = [];

  // Deliberately loose: the exact newline convention after `stream` varies, and
  // being strict about it silently matched nothing.
  const streamPattern = /stream([\s\S]*?)endstream/g;
  let match;
  while ((match = streamPattern.exec(raw)) !== null) {
    const body = Buffer.from(match[1].replace(/^\r?\n/, '').replace(/\r?\n$/, ''), 'latin1');
    let content;
    try {
      content = zlib.inflateSync(body).toString('latin1');
    } catch {
      content = body.toString('latin1'); // uncompressed stream
    }
    chunks.push(content);
  }

  const content = chunks.join('\n');
  const out = [];

  // react-pdf emits kerned runs as `[ <41> -41 <6c> ... ] TJ`, i.e. hex strings
  // inside a TJ array rather than a single Tj literal. Handle both string forms
  // in both positions.
  const collect = (segment) => {
    const items = /\(((?:\\.|[^\\()])*)\)|<([0-9A-Fa-f\s]*)>/g;
    let piece;
    while ((piece = items.exec(segment)) !== null) {
      if (piece[1] !== undefined) out.push(unescapePdf(piece[1]));
      else out.push(decodeHexString(piece[2]));
    }
  };

  // Kerned arrays: [ ... ] TJ
  const arrays = /\[([\s\S]*?)\]\s*TJ/g;
  while ((match = arrays.exec(content)) !== null) collect(match[1]);

  // Single strings: (...) Tj  or  <...> Tj  (also ' and " show-text operators)
  const singles = /(\((?:\\.|[^\\()])*\)|<[0-9A-Fa-f\s]*>)\s*(?:Tj|'|")/g;
  while ((match = singles.exec(content)) !== null) collect(match[1]);

  return out.join('');
}

/** Standard-14 fonts encode one byte per glyph, so decode in pairs. */
function decodeHexString(value) {
  const clean = String(value).replace(/\s+/g, '');
  let decoded = '';
  for (let i = 0; i + 1 < clean.length; i += 2) {
    const code = parseInt(clean.slice(i, i + 2), 16);
    if (Number.isFinite(code) && code > 0) decoded += String.fromCharCode(code);
  }
  return decoded;
}

function unescapePdf(value) {
  return value
    .replace(/\\([nrtbf])/g, (_, ch) => ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' })[ch])
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\(.)/g, '$1');
}

/* ------------------------------------------------------------------ run -- */

let failures = 0;
const report = [];

async function checkTemplate(name) {
  const line = { name, pages: 0, missing: [], leaked: [], error: null };

  try {
    const buffer = await renderToBuffer(
      <ResumeDocument resume={LONG_RESUME} template={name} />,
    );

    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, `${name}.pdf`), buffer);

    line.pages = countPages(buffer);
    line.bytes = buffer.length;

    // Strip whitespace on both sides: the extractor loses inter-run spacing,
    // and our tokens are deliberately single words with no spaces in them.
    const text = extractText(buffer).replace(/\s+/g, '');

    line.missing = REQUIRED_TOKENS.filter((token) => !text.includes(token));
    line.leaked = FORBIDDEN_TOKENS.filter((token) => text.includes(token));

    // A rasterised PDF has no extractable text at all — assert we are not that.
    if (text.length < 500) line.error = `only ${text.length} chars of text extracted (not a text PDF?)`;
  } catch (error) {
    line.error = error.message;
  }

  if (line.error || line.missing.length || line.leaked.length) failures += 1;
  report.push(line);
}

/**
 * A bullet too tall for one page must still render end to end. If the atomic
 * bullet rule were applied unconditionally, the tail would be silently clipped.
 */
async function checkOversized(name) {
  try {
    const buffer = await renderToBuffer(
      <ResumeDocument resume={OVERSIZED_BULLET_RESUME} template={name} />,
    );
    const text = extractText(buffer).replace(/\s+/g, '');
    const missing = ['GIANTSTART', 'GIANTEND'].filter((token) => !text.includes(token));
    return missing.length ? `missing ${missing.join(', ')}` : null;
  } catch (error) {
    return error.message;
  }
}

async function checkEmpty(name) {
  try {
    const buffer = await renderToBuffer(<ResumeDocument resume={EMPTY_RESUME} template={name} />);
    if (countPages(buffer) < 1) throw new Error('produced no pages');
    return null;
  } catch (error) {
    return error.message;
  }
}

async function main() {
  const names = Object.keys(PDF_TEMPLATES);

  for (const name of names) {
    // Sequential: react-pdf shares a font store, and parallel renders make the
    // failure output impossible to attribute.
    await checkTemplate(name);
  }

  console.log('\n  Long CV (6 roles x 6 bullets, 2 custom sections)\n');
  console.log('  design         pages   size     text tokens');
  console.log('  ' + '-'.repeat(58));
  for (const line of report) {
    if (line.error) {
      console.log(`  ${line.name.padEnd(14)} ERROR   ${line.error}`);
      continue;
    }
    const status = line.missing.length
      ? `MISSING ${line.missing.length}: ${line.missing.slice(0, 4).join(', ')}`
      : line.leaked.length
        ? `LEAKED: ${line.leaked.join(', ')}`
        : `all ${REQUIRED_TOKENS.length} present`;
    const size = `${Math.round(line.bytes / 1024)}kb`;
    console.log(`  ${line.name.padEnd(14)} ${String(line.pages).padEnd(7)} ${size.padEnd(8)} ${status}`);
  }

  console.log('\n  Bullet taller than a page (must split, not clip)\n');
  for (const name of names) {
    const error = await checkOversized(name);
    if (error) {
      failures += 1;
      console.log(`  ${name.padEnd(14)} FAIL   ${error}`);
    } else {
      console.log(`  ${name.padEnd(14)} ok     both ends present`);
    }
  }

  console.log('\n  Empty CV (crash guard)\n');
  for (const name of names) {
    const error = await checkEmpty(name);
    if (error) {
      failures += 1;
      console.log(`  ${name.padEnd(14)} ERROR  ${error}`);
    } else {
      console.log(`  ${name.padEnd(14)} ok`);
    }
  }

  console.log(`\n  PDFs written to ${OUT_DIR}`);
  console.log(failures ? `\n  ${failures} check(s) FAILED\n` : '\n  All checks passed\n');
  process.exit(failures ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
