import React, { useEffect, useMemo, useRef } from 'react';
import { usePdfBlob } from './usePdfBlob';

/**
 * The live CV preview.
 *
 * Shows the actual generated PDF rather than an HTML approximation of it, so
 * preview and download cannot drift apart — the file the user downloads is the
 * one they were just looking at.
 *
 * The previous preview kept the last good render on screen while a new one was
 * building, which made edits feel unresponsive and hid failures. Here the stale
 * frame stays visible but is dimmed, and errors replace it outright.
 */
export default function ResumePdfPreview({
  resume,
  template,
  zoom = 1,
  onPagesChange,
  onBlobChange,
  className = '',
  style,
}) {
  const { url, blob, pages, loading, error } = usePdfBlob(resume, template);

  // Keep the last successful URL on screen while the next render is in flight.
  const lastUrlRef = useRef(null);
  if (url) lastUrlRef.current = url;
  const displayUrl = url || lastUrlRef.current;

  useEffect(() => {
    if (!loading && !error) onPagesChange?.(pages);
  }, [pages, loading, error, onPagesChange]);

  useEffect(() => {
    if (blob) onBlobChange?.(blob);
  }, [blob, onBlobChange]);

  // The viewer chrome is hidden so the surrounding app keeps providing the
  // toolbar; zoom is handed to the viewer rather than applied as a CSS
  // transform, which would resample the page instead of re-rendering it.
  const src = useMemo(() => {
    if (!displayUrl) return null;
    const zoomPercent = Math.round(zoom * 100);
    return `${displayUrl}#toolbar=0&navpanes=0&statusbar=0&view=FitH&zoom=${zoomPercent}`;
  }, [displayUrl, zoom]);

  if (error) {
    return (
      <div className={className} style={{ ...style, display: 'grid', placeItems: 'center', padding: 32 }}>
        <div className="text-center">
          <p className="mb-1 fw-semibold text-danger">Preview could not be generated</p>
          <p className="mb-0 small text-muted">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      {src ? (
        <iframe
          // Re-key on zoom: PDF viewers only read the zoom parameter on load.
          key={`${displayUrl}-${Math.round(zoom * 100)}`}
          title="CV preview"
          src={src}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            background: '#fff',
            opacity: loading ? 0.55 : 1,
            transition: 'opacity 0.15s ease-in-out',
          }}
        />
      ) : (
        <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
          <span className="text-muted small">Building preview…</span>
        </div>
      )}

      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 14,
            background: 'rgba(17,17,17,0.78)',
            color: '#fff',
            borderRadius: 4,
            padding: '3px 9px',
            fontSize: 11,
            pointerEvents: 'none',
          }}
        >
          Updating…
        </div>
      )}
    </div>
  );
}
