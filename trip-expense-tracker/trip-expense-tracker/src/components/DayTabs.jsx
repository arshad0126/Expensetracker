import React from 'react';
import { C } from '../constants';
import { computeTotal, fmt } from '../utils/helpers';

export default function DayTabs({ days, activeDay, currentDay, onSwitch }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 18, overflowX: 'auto', paddingBottom: 4 }}>
      {days.map((d, i) => {
        const tot      = computeTotal(d.entries);
        const isActive = activeDay === i;
        const isFuture = i + 1 > currentDay + 1;
        const isLast   = i === days.length - 1;
        return (
          <button key={i} onClick={() => !isFuture && onSwitch(i)} style={{
            flexShrink: 0, padding: '10px 14px', borderRadius: 10,
            cursor: isFuture ? 'not-allowed' : 'pointer',
            fontSize: 12, fontWeight: 700, textAlign: 'left', transition: 'all 0.18s',
            background: isActive ? C.accent : C.card,
            color:      isActive ? '#fff' : isFuture ? C.border : C.text,
            border:     isActive ? 'none' : `1px solid ${isLast ? C.warn + '88' : C.border}`,
            opacity:    isFuture ? 0.5 : 1,
            boxShadow:  isActive ? '0 2px 10px rgba(45,106,79,0.25)' : 'none',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, marginBottom: 2 }}>
              {d.date}{isLast ? ' 🛫' : ''}
            </div>
            <div>{d.label}</div>
            <div style={{ fontWeight: 600, fontSize: 11, marginTop: 3, opacity: 0.85 }}>
              {isFuture ? '🔒' : tot > 0 ? fmt(tot) : '—'}
            </div>
          </button>
        );
      })}
    </div>
  );
}
