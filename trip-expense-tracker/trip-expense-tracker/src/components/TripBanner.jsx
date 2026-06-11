import React from 'react';
import { C } from '../constants';
import { fmt } from '../utils/helpers';

export default function TripBanner({ state, dailyTotal, grandTotal, fixedTotal }) {
  const { people, budget, tripName, destination, days } = state;
  const progressPct    = budget > 0 ? Math.min((grandTotal / budget) * 100, 100) : 0;
  const perPerson      = people > 1 ? Math.round(grandTotal / people) : null;
  const daysRecorded   = days.filter(d => d.entries.length > 0).length;
  const perDayAvg      = daysRecorded > 0 ? Math.round(dailyTotal / daysRecorded) : 0;

  return (
    <>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.accent} 0%, #1B4332 100%)`, borderRadius: 20, padding: '22px 24px', marginBottom: 14, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -16, right: -16, fontSize: 90, opacity: 0.08 }}>🗺️</div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, opacity: 0.7, marginBottom: 6 }}>
          {destination ? destination.toUpperCase() + ' · ' : ''}{days.length} DAYS
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>TOTAL SPEND SO FAR</div>
        <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1, marginBottom: 12 }}>{fmt(grandTotal)}</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {perPerson && <div><div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 1 }}>PER PERSON</div><div style={{ fontSize: 18, fontWeight: 800 }}>{fmt(perPerson)}</div></div>}
          {daysRecorded > 0 && <div><div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 1 }}>DAILY AVG</div><div style={{ fontSize: 18, fontWeight: 800 }}>{fmt(perDayAvg)}</div></div>}
          <div><div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 1 }}>DAYS LOGGED</div><div style={{ fontSize: 18, fontWeight: 800 }}>{daysRecorded}/{days.length}</div></div>
        </div>
      </div>

      {/* Progress bar (only if budget set) */}
      {budget > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 18px', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ color: C.muted }}>
              {fixedTotal > 0 && <>Fixed <strong style={{ color: C.text }}>{fmt(fixedTotal)}</strong>&nbsp;&nbsp;</>}
              Daily <strong style={{ color: C.text }}>{fmt(dailyTotal)}</strong>
            </span>
            <span style={{ color: grandTotal > budget ? C.danger : C.accentSoft, fontWeight: 700 }}>
              {grandTotal > budget ? `Over by ${fmt(grandTotal - budget)}` : `${fmt(budget - grandTotal)} left`}
            </span>
          </div>
          <div style={{ background: C.surface, borderRadius: 99, height: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, transition: 'width 0.6s ease', background: progressPct > 90 ? C.danger : progressPct > 70 ? C.warn : C.accentSoft, width: `${progressPct}%` }} />
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 5 }}>{progressPct.toFixed(1)}% of {fmt(budget)} budget</div>
        </div>
      )}
    </>
  );
}
