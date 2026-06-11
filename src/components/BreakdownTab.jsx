import React from 'react';
import { C, CATEGORIES, CATEGORY_COLORS } from '../constants';
import { fmt, computeTotal } from '../utils/helpers';

export default function BreakdownTab({ state, dailyTotal, grandTotal }) {
  const { days, fixed, people } = state;
  const allEntries = days.flatMap(d => d.entries);
  const dayTotals  = days.map(d => computeTotal(d.entries));
  const highestDay = dayTotals.indexOf(Math.max(...dayTotals.filter(t => t > 0)));
  const perDayAvg  = days.filter(d => d.entries.length > 0).length > 0
    ? Math.round(dailyTotal / days.filter(d => d.entries.length > 0).length) : 0;

  const catAll = CATEGORIES
    .map((c, ci) => ({ cat: c, amt: allEntries.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0), color: CATEGORY_COLORS[ci] }))
    .filter(c => c.amt > 0).sort((a, b) => b.amt - a.amt);

  const fixedSplitRows = [
    fixed.hotel.amount  > 0 && { label: fixed.hotel.name  || 'Hotel',   total: fixed.hotel.amount  },
    fixed.flight.amount > 0 && { label: fixed.flight.name || 'Flights', total: fixed.flight.amount },
    dailyTotal > 0           && { label: 'Daily Expenses',               total: dailyTotal           },
  ].filter(Boolean);

  return (<>
    {/* Category bars */}
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 16, letterSpacing: 2 }}>SPEND BY CATEGORY</div>
      {catAll.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>No expenses yet.</div>}
      {catAll.map(c => (
        <div key={c.cat} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color }} />
              <span style={{ fontWeight: 600 }}>{c.cat}</span>
            </div>
            <span style={{ fontWeight: 700 }}>
              {fmt(c.amt)}&nbsp;
              <span style={{ color: C.muted, fontWeight: 400, fontSize: 11 }}>
                ({dailyTotal > 0 ? ((c.amt / dailyTotal) * 100).toFixed(0) : 0}%)
              </span>
            </span>
          </div>
          <div style={{ background: C.surface, borderRadius: 99, height: 8 }}>
            <div style={{ background: c.color, height: 8, borderRadius: 99, width: dailyTotal > 0 ? `${(c.amt / dailyTotal) * 100}%` : '0%', transition: 'width 0.5s', opacity: 0.85 }} />
          </div>
        </div>
      ))}
    </div>

    {/* Per person split */}
    {people > 1 && fixedSplitRows.length > 0 && (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 16, letterSpacing: 2 }}>{people}-PERSON SPLIT</div>
        {fixedSplitRows.map((row, i, arr) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.surface}` : 'none' }}>
            <span style={{ fontWeight: 500, fontSize: 13 }}>{row.label}</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{fmt(row.total)} total</div>
              <div style={{ fontSize: 11, color: C.muted }}>{fmt(Math.round(row.total / people))} / person</div>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: `2px solid ${C.border}` }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Each Person Paid</div>
          <div style={{ fontWeight: 900, fontSize: 24, color: C.accent }}>{fmt(Math.round(grandTotal / people))}</div>
        </div>
      </div>
    )}

    {/* Insights */}
    {allEntries.length > 0 && (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 16, letterSpacing: 2 }}>TRIP INSIGHTS</div>
        {[
          catAll[0] && { emoji: '🏆', fact: `Biggest spend category: ${catAll[0].cat} — ${fmt(catAll[0].amt)} (${dailyTotal > 0 ? ((catAll[0].amt / dailyTotal) * 100).toFixed(0) : 0}% of daily spend)` },
          highestDay >= 0 && dayTotals[highestDay] > 0 && { emoji: '📅', fact: `Highest spending day: ${days[highestDay].label} (${days[highestDay].date}) — ${fmt(dayTotals[highestDay])}` },
          perDayAvg > 0 && { emoji: '💰', fact: `Daily average: ${fmt(perDayAvg)} / day${people > 1 ? ` (${people} people combined)` : ''}` },
          people > 1 && { emoji: '👥', fact: `Per person total: ${fmt(Math.round(grandTotal / people))} (${people} people, ${days.length} days)` },
        ].filter(Boolean).map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 13, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{f.emoji}</span>
            <span style={{ color: C.text, lineHeight: 1.5 }}>{f.fact}</span>
          </div>
        ))}
      </div>
    )}
  </>);
}
