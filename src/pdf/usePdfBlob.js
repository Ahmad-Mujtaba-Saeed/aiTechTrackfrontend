import { useEffect, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import ResumeDocument from './ResumeDocument';
import { normalizeResume } from './normalize';

/**
 * Count pages without a PDF parser.
 *
 * The page tree is plain ASCII in the file body, so a regex over the bytes is
 * enough and avoids pulling in pdf.js purely to display "page 2 of 3".
 */
export function countPdfPages(bytes) {
  try {
    const text = new TextDecoder('latin1').decode(bytes);
    const matches = text.match(/\/Type\s*\/Page[^s]/g);
    return matches ? Math.max(1, matches.length) : 1;
  } catch {
    return 1;
  }
}

/**
 * Generate the resume PDF as an object URL, regenerating as the user edits.
 *
 * Generation is debounced because it runs on every keystroke's worth of state
 * change, and a stale-run guard means a slow render can never overwrite the
 * result of a newer one. Object URLs are revoked on replacement so a long
 * editing session does not leak blobs.
 */
export function usePdfBlob(resume, template, { debounceMs = 600, enabled = true } = {}) {
  const [state, setState] = useState({
    url: null,
    blob: null,
    pages: 1,
    loading: Boolean(enabled),
    error: null,
  });

  // Identifies the newest requested render; older ones discard their results.
  const runIdRef = useRef(0);
  const urlRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const runId = ++runIdRef.current;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    const timer = setTimeout(async () => {
      try {
        const model = normalizeResume(resume);
        const blob = await pdf(
          React.createElement(ResumeDocument, { resume: model, template }),
        ).toBlob();

        if (runId !== runIdRef.current) return; // superseded by a newer edit

        const bytes = await blob.arrayBuffer();
        const url = URL.createObjectURL(blob);

        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = url;

        setState({ url, blob, pages: countPdfPages(bytes), loading: false, error: null });
      } catch (error) {
        if (runId !== runIdRef.current) return;
        // Surface the failure rather than leaving a stale preview on screen.
        setState((previous) => ({ ...previous, loading: false, error }));
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [resume, template, debounceMs, enabled]);

  // Revoke the final URL when the editor unmounts.
  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    },
    [],
  );

  return state;
}

/**
 * Build the PDF on demand, bypassing the debounce.
 *
 * Used by the download action so the saved file always reflects the very latest
 * edits even if the preview has not caught up yet.
 */
export async function buildPdfBlob(resume, template) {
  const model = normalizeResume(resume);
  return pdf(React.createElement(ResumeDocument, { resume: model, template })).toBlob();
}

/** Trigger a browser download for a generated blob. */
export function savePdfBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoke on the next tick: revoking synchronously can cancel the download in
  // some browsers before it has read the blob.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** `Ada Lovelace` -> `Ada-Lovelace-CV.pdf`, safe for every filesystem. */
export function resumeFilename(resume, suffix = 'CV') {
  const model = resume && resume.labels ? resume : normalizeResume(resume);
  const base = model.name.full || 'Resume';
  const safe = base
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
  return `${safe || 'Resume'}-${suffix}.pdf`;
}

export default usePdfBlob;
