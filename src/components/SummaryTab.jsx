import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { C, CATEGORIES } from '../constants';
import { fmt, computeTotal } from '../utils/helpers';

export default function SummaryTab({ state, dailyTotal, grandTotal, fixedTotal, onDayClick }) {
  const { days, fixed, people } = state;
  const dayTotals  = days.map(d => computeTotal(d.entries));
  const highestDay = dayTotals.indexOf(Math.max(...dayTotals.filter(t => t > 0)));
  const chartData  = days.map(d => ({ name: d.date || d.label, total: computeTotal(d.entries) }));
  const perPerson  = people > 1 ? Math.round(grandTotal / people) : null;

  const fixedRows = [
    fixed.hotel.amount  > 0 && { label: fixed.hotel.name  || 'Hotel',   sub: 'Fixed cost', val: fixed.hotel.amount,  icon: '🏨' },
    fixed.flight.amount > 0 && { label: fixed.flight.name || 'Flights', sub: 'Fixed cost', val: fixed.flight.amount, icon: '✈️' },
  ].filter(Boolean);

  return (<>
    {/* Day-by-day table */}
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 14, letterSpacing: 2 }}>{days.length}-DAY RECORD</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 10, letterSpacing: 1.5 }}>
            <th style={TH}>DAY</th><th style={TH}>ITEMS</th><th style={TH}>TOP CAT</th><th style={TH}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d, i) => {
            const tot    = computeTotal(d.entries);
            const topCat = CATEGORIES.map(c => ({ c, amt: d.entries.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0) })).sort((a, b) => b.amt - a.amt)[0];
            const isHigh = i === highestDay && tot > 0;
            return (
              <tr key={i} onClick={() => onDayClick(i)} style={{ borderBottom: `1px solid ${C.surface}`, cursor: 'pointer', background: isHigh ? 'rgba(45,106,79,0.04)' : 'transparent' }}>
                <td style={{ ...TD, fontWeight: 700 }}>
                  <div style={{ fontSize: 10, color: C.muted }}>{d.date}{i === days.length - 1 ? ' 🛫' : ''}</div>
                  {d.label}
                  {isHigh && <span style={{ fontSize: 9, background: C.accentLight, color: C.accent, borderRadius: 4, padding: '1px 5px', fontWeight: 700, marginLeft: 6 }}>HIGHEST</span>}
                </td>
                <td style={{ ...TD, color: C.muted }}>{d.entries.length}</td>
                <td style={TD}>{topCat && topCat.amt > 0 ? <span style={{ background: C.accentLight, borderRadius: 5, padding: '2px 8px', fontSize: 10, color: C.accent, fontWeight: 600 }}>{topCat.c}</span> : <span style={{ color: C.border }}>—</span>}</td>
                <td style={{ ...TD, fontWeight: 800 }}>{tot > 0 ? fmt(tot) : '—'}</td>
              </tr>
            );
          })}
          <tr style={{ borderTop: `1px solid ${C.border}` }}>
            <td colSpan={3} style={{ ...TD, fontWeight: 700, color: C.muted, textAlign: 'right', fontSize: 10, letterSpacing: 1.5 }}>DAILY SUBTOTAL</td>
            <td style={{ ...TD, fontWeight: 900, fontSize: 15 }}>{fmt(dailyTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Cost breakdown */}
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 14, letterSpacing: 2 }}>COMPLETE COST BREAKDOWN</div>
      {[
        ...fixedRows,
        { label: 'Daily Expenses', sub: `${days.reduce((s, d) => s + d.entries.length, 0)} items · ${days.filter(d => d.entries.length > 0).length} days`, val: dailyTotal, icon: '💸' },
      ].map((row, i, arr) => (
        <div key={i} style={{ padding: '13px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.surface}` : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{row.icon} {row.label}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{row.sub}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{fmt(row.val)}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{grandTotal > 0 ? ((row.val / grandTotal) * 100).toFixed(1) + '%' : ''}</div>
            </div>
          </div>
          {grandTotal > 0 && (
            <div style={{ background: C.surface, borderRadius: 99, height: 5 }}>
              <div style={{ background: C.accentSoft, height: 5, borderRadius: 99, width: `${(row.val / grandTotal) * 100}%`, transition: 'width 0.6s' }} />
            </div>
          )}
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: `2px solid ${C.border}` }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Grand Total</div>
          {people > 1 && <div style={{ fontSize: 11, color: C.muted }}>{people} people</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 900, fontSize: 26, color: C.accent }}>{fmt(grandTotal)}</div>
          {perPerson && <div style={{ fontSize: 11, color: C.muted }}>{fmt(perPerson)} / person</div>}
        </div>
      </div>
    </div>

    {/* Chart */}
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 20px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 14, letterSpacing: 2 }}>DAILY SPEND PATTERN</div>
      <ResponsiveContainer width="100%" height={175}>
        <BarChart data={chartData} barCategoryGap="28%">
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => '₹' + v} />
          <Tooltip formatter={v => [fmt(v), 'Spent']} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }} cursor={{ fill: `${C.accent}08` }} />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={i === highestDay && dayTotals[i] > 0 ? C.accent : C.accentLight} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </>);
}

const TH = { textAlign: 'left', padding: '8px 10px', fontWeight: 700 };
const TD = { padding: '11px 10px', verticalAlign: 'middle' };
