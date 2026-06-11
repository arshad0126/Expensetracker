import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { C } from '../constants';
import { computeTotal, fmt } from '../utils/helpers';

export default function SpendChart({ days, activeDay }) {
  const chartData = days.map(d => ({ name: d.date || d.label, total: computeTotal(d.entries) }));
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 20px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 14, letterSpacing: 2 }}>DAILY SPEND OVERVIEW</div>
      <ResponsiveContainer width="100%" height={175}>
        <BarChart data={chartData} barCategoryGap="28%">
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => '₹' + v} />
          <Tooltip formatter={v => [fmt(v), 'Spent']} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }} cursor={{ fill: `${C.accent}08` }} />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={i === activeDay ? C.accent : C.accentLight} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
