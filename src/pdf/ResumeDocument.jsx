import React from 'react';
import { Document } from '@react-pdf/renderer';
import { getTemplate } from './templates';
import { getTheme } from './theme';
import { normalizeResume } from './normalize';

/**
 * The single source of truth for both the on-screen preview and the download.
 *
 * Because the preview renders this exact document, what the user sees is what
 * they get — there is no second HTML rendering path that can drift out of sync.
 */
export default function ResumeDocument({ resume, template = 'Default' }) {
  const model = React.useMemo(
    // Accept either a raw parsedResume or an already-normalised model.
    () => (resume && resume.labels ? resume : normalizeResume(resume)),
    [resume],
  );
  const theme = getTheme(template);
  const Template = getTemplate(template);

  return (
    <Document
      title={model.name.full ? `${model.name.full} — CV` : 'Curriculum Vitae'}
      author={model.name.full || undefined}
      subject={model.headline || undefined}
      creator="PathForge"
      producer="PathForge"
      // Keywords help ATS keyword extraction pick up skills reliably.
      keywords={model.skills.map((skill) => skill.name).join(', ') || undefined}
    >
      <Template resume={model} theme={theme} />
    </Document>
  );
}
