import React from 'react';
import { C } from '../constants';

export default function VersionLog({ log }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 18, maxHeight: 200, overflowY: 'auto' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 10, letterSpacing: 2 }}>VERSION HISTORY</div>
      {log.length === 0 && <div style={{ fontSize: 12, color: C.muted }}>No changes yet.</div>}
      {log.map((l, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 7, fontSize: 12, alignItems: 'baseline' }}>
          <span style={{ color: C.accent, fontWeight: 800, minWidth: 65, fontFamily: 'monospace', fontSize: 11 }}>v{l.version}</span>
          <span style={{ color: C.text, flex: 1 }}>{l.note}</span>
          <span style={{ color: C.muted, fontSize: 10, whiteSpace: 'nowrap' }}>{l.ts}</span>
        </div>
      ))}
    </div>
  );
}
