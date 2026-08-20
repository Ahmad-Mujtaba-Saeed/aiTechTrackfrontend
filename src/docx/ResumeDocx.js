import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ExternalHyperlink,
  TabStopType,
  TabStopPosition,
} from 'docx';

import { normalizeResume, contactEntries, formatRange } from '../pdf/normalize';
import { getTheme } from '../pdf/theme';
import { parseHtml } from '../pdf/html';

/**
 * DOCX export, built from the same normalised model as the PDF templates.
 *
 * Deliberately single-column even for the two-column designs. A Word file is
 * usually wanted for one of two reasons — editing it, or feeding it to an ATS —
 * and both are hurt by the text-boxes or nested tables it would take to fake a
 * sidebar. Column layout is dropped; the design's identity is carried by its
 * accent colour, font and heading treatment.
 *
 * Everything is real Word content (styled paragraphs, a table for the details
 * block, native bullet lists), so the document stays editable rather than
 * arriving as a picture of a CV.
 */

/* --------------------------------------------------------------- helpers -- */

/** docx wants hex without the leading '#'. */
const hex = (value) => String(value || '').replace('#', '').toUpperCase() || '000000';

/** docx sizes are half-points; our themes are in points. */
const pt = (value) => Math.round(value * 2);

/**
 * Word has no Helvetica/Times-Roman by default; map the PDF's Standard-14
 * faces onto the equivalents every Word install ships with.
 */
function fontFor(theme) {
  return theme.fontFamily && theme.fontFamily.startsWith('Times') ? 'Times New Roman' : 'Calibri';
}

/* ---------------------------------------------------------------- blocks -- */

function heading(text, theme, font) {
  const style = theme.sectionStyle;
  const label = theme.uppercaseSections ? text.toUpperCase() : text;

  const run = new TextRun({
    text: label,
    bold: theme.sectionWeight !== 'regular',
    color: style === 'bar' || style === 'chip' ? 'FFFFFF' : hex(theme.accent),
    size: pt(theme.sectionSize + 1),
    font,
  });

  const base = {
    children: [run],
    spacing: { before: 260, after: 120 },
    keepNext: true, // keep the heading with the content that follows it
  };

  if (style === 'bar' || style === 'chip') {
    return new Paragraph({
      ...base,
      shading: { fill: hex(theme.barBackground || theme.chipBackground || theme.accent) },
      spacing: { before: 260, after: 140 },
    });
  }

  if (style === 'plain') return new Paragraph(base);

  // 'rule' and 'boxed' both read as a heading over a hairline.
  return new Paragraph({
    ...base,
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: hex(theme.rule), space: 2 },
    },
  });
}

function body(text, theme, font, extra = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: pt(theme.bodySize), color: hex(theme.body), font })],
    spacing: { after: 80, line: 276 },
    ...extra,
  });
}

function bullets(items, theme, font) {
  return (items || []).map(
    (item) =>
      new Paragraph({
        children: [new TextRun({ text: item, size: pt(theme.bodySize), color: hex(theme.body), font })],
        bullet: { level: 0 },
        spacing: { after: 60, line: 276 },
      }),
  );
}

/**
 * Role/date line. The date is pushed to the right margin with a right-aligned
 * tab stop rather than a table, so the line reflows correctly if the user edits
 * the title or changes the page size.
 */
function entryHeading({ title, date, org }, theme, font) {
  const out = [];

  const runs = [new TextRun({ text: title || '', bold: true, size: pt(theme.bodySize + 0.5), color: hex(theme.ink), font })];
  if (date) {
    runs.push(new TextRun({ text: `\t${date}`, size: pt(theme.metaSize), color: hex(theme.muted), font }));
  }

  out.push(
    new Paragraph({
      children: runs,
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      spacing: { before: 140, after: 20 },
      keepNext: true,
      keepLines: true,
    }),
  );

  if (org) {
    out.push(
      new Paragraph({
        children: [new TextRun({ text: org, italics: true, size: pt(theme.bodySize), color: hex(theme.accent), font })],
        spacing: { after: 60 },
        keepNext: true,
      }),
    );
  }

  return out;
}

/** Personal details as a borderless two-column table. */
function detailsTable(entries, theme, font) {
  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const borders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { ...borders, insideHorizontal: noBorder, insideVertical: noBorder },
    rows: entries.map(
      ({ label, value }) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 26, type: WidthType.PERCENTAGE },
              borders,
              margins: { top: 20, bottom: 20, right: 120 },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: label, bold: true, size: pt(theme.bodySize), color: hex(theme.ink), font })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 74, type: WidthType.PERCENTAGE },
              borders,
              margins: { top: 20, bottom: 20 },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: value, size: pt(theme.bodySize), color: hex(theme.body), font })],
                }),
              ],
            }),
          ],
        }),
    ),
  });
}

/** CKEditor HTML -> Word paragraphs, reusing the PDF's parser. */
function richText(html, theme, font) {
  return parseHtml(html).map((block) => {
    const runs = block.runs.map((run) => {
      const props = {
        text: run.text,
        bold: Boolean(run.bold),
        italics: Boolean(run.italic),
        underline: run.underline ? {} : undefined,
        strike: Boolean(run.strike),
        size: pt(theme.bodySize),
        color: hex(run.href ? theme.accent : theme.body),
        font,
      };
      if (run.href) {
        return new ExternalHyperlink({ link: run.href, children: [new TextRun({ ...props, style: 'Hyperlink' })] });
      }
      return new TextRun(props);
    });

    if (block.type === 'listItem') {
      return new Paragraph({ children: runs, bullet: { level: Math.min(block.depth || 0, 4) }, spacing: { after: 60 } });
    }

    if (block.type === 'heading') {
      return new Paragraph({
        children: block.runs.map(
          (run) =>
            new TextRun({
              text: run.text,
              bold: true,
              size: pt(theme.bodySize + 1),
              color: hex(theme.ink),
              font,
            }),
        ),
        spacing: { before: 120, after: 60 },
        keepNext: true,
      });
    }

    return new Paragraph({ children: runs, spacing: { after: 80, line: 276 } });
  });
}

/* ------------------------------------------------------------------ build -- */

export function buildResumeDocx(rawResume, templateName = 'Default') {
  const resume = rawResume && rawResume.labels ? rawResume : normalizeResume(rawResume);
  const theme = getTheme(templateName);
  const font = fontFor(theme);

  const children = [];

  // ------------------------------------------------------------- masthead --
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resume.name.full || 'Curriculum Vitae',
          bold: true,
          size: pt(theme.nameSize),
          color: hex(theme.ink),
          font,
        }),
      ],
      spacing: { after: resume.headline ? 40 : 140 },
    }),
  );

  if (resume.headline) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: resume.headline, italics: true, size: pt(theme.headlineSize), color: hex(theme.accent), font }),
        ],
        spacing: { after: 140 },
      }),
    );
  }

  // --------------------------------------------------------------- details --
  const contacts = contactEntries(resume, { includeName: true });
  if (resume.labels.personal.enabled && contacts.length) {
    children.push(heading(resume.labels.personal.title, theme, font));
    children.push(detailsTable(contacts, theme, font));
    children.push(new Paragraph({ text: '', spacing: { after: 60 } }));
  }

  // --------------------------------------------------------------- profile --
  if (resume.labels.profile.enabled && resume.summary) {
    children.push(heading(resume.labels.profile.title, theme, font));
    children.push(body(resume.summary, theme, font, { alignment: AlignmentType.JUSTIFIED }));
  }

  // ------------------------------------------------------------ employment --
  if (resume.labels.employment.enabled && resume.work.length) {
    children.push(heading(resume.labels.employment.title, theme, font));
    for (const job of resume.work) {
      children.push(...entryHeading({ title: job.title, date: formatRange(job), org: job.org }, theme, font));
      if (job.description) children.push(body(job.description, theme, font));
      children.push(...bullets(job.bullets, theme, font));
    }
  }

  // ------------------------------------------------------------- education --
  if (resume.labels.education.enabled && resume.education.length) {
    children.push(heading(resume.labels.education.title, theme, font));
    for (const edu of resume.education) {
      children.push(...entryHeading({ title: edu.degree, date: formatRange(edu), org: edu.org }, theme, font));

      const facts = [
        edu.majors.length ? `Subjects: ${edu.majors.join(', ')}` : '',
        edu.areaOfStudy,
        edu.grade ? `Grade: ${edu.grade}` : '',
        edu.accreditation,
      ].filter(Boolean);

      for (const fact of facts) children.push(body(fact, theme, font));
      children.push(...bullets(edu.bullets, theme, font));
    }
  }

  // ---------------------------------------------------------------- skills --
  if (resume.labels.skills.enabled && resume.skills.length) {
    children.push(heading(resume.labels.skills.title, theme, font));
    // One per line: ATS parsers key off discrete lines far more reliably than
    // a comma-separated run.
    children.push(...bullets(resume.skills.map((skill) => skill.name), theme, font));
  }

  if (resume.labels.languages.enabled && resume.languages.length) {
    children.push(heading(resume.labels.languages.title, theme, font));
    children.push(
      ...bullets(
        resume.languages.map((lang) => (lang.level ? `${lang.name} — ${lang.level}` : lang.name)),
        theme,
        font,
      ),
    );
  }

  if (resume.qualities.length) {
    children.push(heading('Qualities', theme, font));
    children.push(...bullets(resume.qualities, theme, font));
  }

  if (resume.labels.hobbies.enabled && resume.hobbies.length) {
    children.push(heading(resume.labels.hobbies.title, theme, font));
    children.push(body(resume.hobbies.join(' · '), theme, font));
  }

  for (const custom of resume.custom) {
    children.push(heading(custom.title || 'Additional Information', theme, font));
    children.push(...richText(custom.content, theme, font));
  }

  return new Document({
    creator: resume.name.full || 'PathForge',
    title: resume.name.full ? `${resume.name.full} — CV` : 'Curriculum Vitae',
    description: resume.headline || undefined,
    styles: {
      default: {
        document: { run: { font, size: pt(theme.bodySize), color: hex(theme.body) } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            // Twips: 1440 per inch. Roughly 2cm all round.
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        children,
      },
    ],
  });
}

/** Build the .docx and hand back a Blob ready to save. */
export async function buildDocxBlob(rawResume, templateName) {
  return Packer.toBlob(buildResumeDocx(rawResume, templateName));
}

/** `Ada Lovelace` -> `Ada-Lovelace-CV.docx`. */
export function docxFilename(rawResume) {
  const resume = rawResume && rawResume.labels ? rawResume : normalizeResume(rawResume);
  const safe = (resume.name.full || 'Resume')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
  return `${safe || 'Resume'}-CV.docx`;
}

export default buildResumeDocx;
