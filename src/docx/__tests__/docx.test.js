/**
 * Verify the DOCX export for every design.
 *
 * A .docx is a ZIP of XML parts, so the checks here are structural: the archive
 * must contain the parts Word requires, and the text the user typed must appear
 * in the document body. That catches silent content loss, which a "did it throw"
 * check would miss entirely.
 *
 * Run with: npm run test:docx
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { Packer } from 'docx';

import { buildResumeDocx } from '../ResumeDocx';
import { PDF_TEMPLATES } from '../../pdf/templates';
import {
  LONG_RESUME,
  EMPTY_RESUME,
  REQUIRED_TOKENS,
  FORBIDDEN_TOKENS,
} from '../../pdf/__tests__/fixture';

const OUT_DIR = process.env.DOCX_OUT_DIR || path.join(process.cwd(), '.docx-test-output');

/* ------------------------------------------------------------ zip reading -- */

/**
 * Minimal ZIP reader — enough to pull named entries out of a .docx.
 *
 * Walks the central directory rather than scanning for local headers, so it
 * reports the real entry list instead of guessing.
 */
function readZipEntries(buffer) {
  // End of central directory record: signature 0x06054b50.
  let eocd = -1;
  for (let i = buffer.length - 22; i >= 0; i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) throw new Error('not a zip archive (no end-of-central-directory record)');

  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries = new Map();

  for (let i = 0; i < count; i += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) break; // central file header
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString('utf8', offset + 46, offset + 46 + nameLength);

    // Local header: name and extra lengths differ from the central copy.
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const raw = buffer.subarray(dataStart, dataStart + compressedSize);

    let content;
    if (method === 0) content = raw; // stored
    else content = zlib.inflateRawSync(raw); // deflate

    entries.set(name, content.toString('utf8'));
    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

/** Visible text of the document body, with XML tags stripped. */
function documentText(entries) {
  const xml = entries.get('word/document.xml') || '';
  return xml
    .replace(/<w:instrText[\s\S]*?<\/w:instrText>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/** Parts Word will not open the file without. */
const REQUIRED_PARTS = [
  '[Content_Types].xml',
  '_rels/.rels',
  'word/document.xml',
  'word/_rels/document.xml.rels',
  'word/styles.xml',
];

/* -------------------------------------------------------------------- run -- */

let failures = 0;

async function checkTemplate(name) {
  const line = { name, missing: [], leaked: [], parts: [], bytes: 0, bullets: 0, error: null };

  try {
    const buffer = await Packer.toBuffer(buildResumeDocx(LONG_RESUME, name));
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, `${name}.docx`), buffer);
    line.bytes = buffer.length;

    const entries = readZipEntries(buffer);
    line.parts = REQUIRED_PARTS.filter((part) => !entries.has(part));

    const text = documentText(entries).replace(/\s+/g, '');
    line.missing = REQUIRED_TOKENS.filter((token) => !text.includes(token));
    line.leaked = FORBIDDEN_TOKENS.filter((token) => text.includes(token));

    // Bullets must be real Word list paragraphs, not "•" typed into the text.
    const xml = entries.get('word/document.xml') || '';
    line.bullets = (xml.match(/<w:numPr>/g) || []).length;
    if (line.bullets === 0) line.error = 'no native list paragraphs found';
    if (!entries.has('word/numbering.xml')) line.error = 'numbering.xml missing (bullets will not render)';
  } catch (error) {
    line.error = error.message;
  }

  if (line.error || line.missing.length || line.leaked.length || line.parts.length) failures += 1;
  return line;
}

async function main() {
  const names = Object.keys(PDF_TEMPLATES);
  const report = [];

  for (const name of names) report.push(await checkTemplate(name));

  console.log('\n  DOCX export — long CV\n');
  console.log('  design         size     bullets  content');
  console.log('  ' + '-'.repeat(60));
  for (const line of report) {
    if (line.error) {
      console.log(`  ${line.name.padEnd(14)} ERROR    ${line.error}`);
      continue;
    }
    const status = line.parts.length
      ? `INVALID: missing ${line.parts.join(', ')}`
      : line.missing.length
        ? `MISSING ${line.missing.length}: ${line.missing.slice(0, 3).join(', ')}`
        : line.leaked.length
          ? `LEAKED: ${line.leaked.join(', ')}`
          : `all ${REQUIRED_TOKENS.length} tokens present`;
    console.log(
      `  ${line.name.padEnd(14)} ${`${Math.round(line.bytes / 1024)}kb`.padEnd(8)} ${String(line.bullets).padEnd(8)} ${status}`,
    );
  }

  console.log('\n  Empty CV (crash guard)\n');
  for (const name of names) {
    try {
      const buffer = await Packer.toBuffer(buildResumeDocx(EMPTY_RESUME, name));
      readZipEntries(buffer);
      console.log(`  ${name.padEnd(14)} ok`);
    } catch (error) {
      failures += 1;
      console.log(`  ${name.padEnd(14)} ERROR  ${error.message}`);
    }
  }

  console.log(`\n  Files written to ${OUT_DIR}`);
  console.log(failures ? `\n  ${failures} check(s) FAILED\n` : '\n  All checks passed\n');
  process.exit(failures ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
