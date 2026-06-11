import React from 'react';
import { C } from '../constants';
import { fmt } from '../utils/helpers';

export default function FixedCosts({ fixed }) {
  const items = [
    fixed.hotel.amount  > 0 && { icon: '🏨', label: 'HOTEL',   name: fixed.hotel.name  || 'Hotel',   amt: fixed.hotel.amount  },
    fixed.flight.amount > 0 && { icon: '✈️', label: 'FLIGHTS', name: fixed.flight.name || 'Flights', amt: fixed.flight.amount },
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
      {items.map(f => (
        <div key={f.label} style={{ flex: 1, minWidth: 160, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>{f.icon} {f.label}</div>
          <div style={{ fontWeight: 900, fontSize: 20, color: C.text }}>{fmt(f.amt)}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{f.name}</div>
        </div>
      ))}
    </div>
  );
}
