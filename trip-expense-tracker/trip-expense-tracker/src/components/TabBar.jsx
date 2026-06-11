import React from 'react';
import { C } from '../constants';

const TABS = [['daily', 'Daily View'], ['summary', 'Summary'], ['breakdown', 'Breakdown']];

export default function TabBar({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: C.surface, borderRadius: 10, padding: 4 }}>
      {TABS.map(([key, label]) => (
        <button key={key} onClick={() => onChange(key)} style={{
          flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: 11, fontWeight: 700,
          background: active === key ? C.card : 'transparent',
          color:      active === key ? C.text : C.muted,
          boxShadow:  active === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.2s',
        }}>{label}</button>
      ))}
    </div>
  );
}
