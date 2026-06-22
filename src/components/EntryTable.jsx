import React, { useState } from 'react';
import { C, CATEGORIES, CATEGORY_COLORS } from '../constants';
import { fmt } from '../utils/helpers';

const IS  = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '9px 12px', color: C.text, fontSize: 13, outline: 'none' };
const ISS = { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '5px 8px', color: C.text, fontSize: 12, outline: 'none', width: '100%' };
const BS  = { background: C.accent, color: '#fff', border: 'none', borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: 12 };
const TH  = { textAlign: 'left', padding: '8px 10px', fontWeight: 700 };
const TD  = { padding: '11px 10px', verticalAlign: 'middle' };

export default function EntryTable({ day, activeDayIdx, onAdd, onDelete, onSaveEdit, onRenameDay }) {
  const [newItem,   setNewItem]   = useState({ desc: '', amount: '', category: 'Food' });
  const [editingId, setEditingId] = useState(null);
  const [editVal,   setEditVal]   = useState({ desc: '', amount: '', category: 'Food' });
  const [editLabel, setEditLabel] = useState(false);
  const [labelVal,  setLabelVal]  = useState('');

  const { entries } = day;
  const dayTotal = entries.reduce((s, e) => s + e.amount, 0);

  function handleAdd() {
    const ok = onAdd(newItem, activeDayIdx);
    if (ok) setNewItem({ desc: '', amount: '', category: 'Food' });
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditVal({ desc: entry.desc, amount: String(entry.amount), category: entry.category });
  }

  function handleSaveEdit() {
    const ok = onSaveEdit(editingId, editVal, activeDayIdx);
    if (ok !== false) setEditingId(null);
  }

  const catBreakdown = CATEGORIES
    .map(c => ({ cat: c, amt: entries.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0) }))
    .filter(c => c.amt > 0).sort((a, b) => b.amt - a.amt);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 18 }}>

      {/* Day header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        {editLabel ? (
          <>
            <input value={labelVal} onChange={e => setLabelVal(e.target.value)} style={IS}
              placeholder="Rename day…" autoFocus
              onKeyDown={e => { if (e.key === 'Enter') { onRenameDay(labelVal, activeDayIdx); setEditLabel(false); } }} />
            <button onClick={() => { onRenameDay(labelVal, activeDayIdx); setEditLabel(false); }} style={BS}>Save</button>
            <button onClick={() => setEditLabel(false)} style={{ ...BS, background: C.surface, color: C.text }}>✕</button>
          </>
        ) : (
          <>
            <div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: 1 }}>{day.date}</div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 900 }}>{day.label}</h2>
            </div>
            <button onClick={() => { setLabelVal(day.label); setEditLabel(true); }}
              style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14 }}>✏️</button>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1 }}>DAY TOTAL</div>
              <div style={{ color: C.accent, fontWeight: 900, fontSize: 22 }}>{fmt(dayTotal)}</div>
            </div>
          </>
        )}
      </div>

      {/* Add row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        <input value={newItem.desc} onChange={e => setNewItem({ ...newItem, desc: e.target.value })}
          placeholder="What did you spend on?" style={{ ...IS, flex: 2, minWidth: 120 }}
          onKeyDown={e => e.key === 'Enter' && handleAdd()} />
        <input value={newItem.amount} onChange={e => setNewItem({ ...newItem, amount: e.target.value })}
          placeholder="Amount" type="number" style={{ ...IS, flex: 1, minWidth: 80 }}
          onKeyDown={e => e.key === 'Enter' && handleAdd()} />
        <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
          style={{ ...IS, flex: 1, minWidth: 100 }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={handleAdd}
          style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
          + Add
        </button>
      </div>

      {/* Table */}
      {entries.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 10, letterSpacing: 1.5 }}>
              <th style={TH}>#</th><th style={TH}>DESCRIPTION</th><th style={TH}>CAT</th><th style={TH}>AMOUNT</th><th style={TH}></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, j) => (
              <tr key={entry.id} style={{ borderBottom: `1px solid ${C.surface}` }}>
                {editingId === entry.id ? (
                  <>
                    <td style={TD}>{j + 1}</td>
                    <td style={TD}><input value={editVal.desc} onChange={e => setEditVal({ ...editVal, desc: e.target.value })} style={ISS} /></td>
                    <td style={TD}><select value={editVal.category} onChange={e => setEditVal({ ...editVal, category: e.target.value })} style={ISS}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></td>
                    <td style={TD}><input value={editVal.amount} type="number" onChange={e => setEditVal({ ...editVal, amount: e.target.value })} style={{ ...ISS, width: 76 }} /></td>
                    <td style={TD}>
                      <button onClick={handleSaveEdit} style={{ ...BS, padding: '4px 10px', marginRight: 4 }}>✓</button>
                      <button onClick={() => setEditingId(null)} style={{ ...BS, background: C.surface, color: C.text, padding: '4px 10px' }}>✕</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ ...TD, color: C.muted, fontSize: 11 }}>{j + 1}</td>
                    <td style={{ ...TD, fontWeight: 500 }}>{entry.desc}</td>
                    <td style={TD}>
                      {(() => {
                        const catIdx = CATEGORIES.indexOf(entry.category);
                        const catColor = catIdx !== -1 ? CATEGORY_COLORS[catIdx] : C.accent;
                        return (
                          <span style={{ background: `${catColor}1c`, borderRadius: 5, padding: '2px 7px', fontSize: 10, color: catColor, fontWeight: 600 }}>
                            {entry.category}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ ...TD, fontWeight: 700, color: entry.amount === 0 ? C.muted : C.text }}>{fmt(entry.amount)}</td>
                    <td style={TD}>
                      <button onClick={() => startEdit(entry)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', marginRight: 4, fontSize: 13 }}>✏️</button>
                      <button onClick={() => onDelete(entry.id, activeDayIdx)} style={{ background: 'none', border: 'none', color: C.danger, cursor: 'pointer', fontSize: 13 }}>🗑</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            <tr>
              <td colSpan={3} style={{ ...TD, textAlign: 'right', color: C.muted, fontWeight: 700, paddingTop: 14, fontSize: 10, letterSpacing: 1.5 }}>DAY TOTAL</td>
              <td style={{ ...TD, color: C.accent, fontWeight: 900, fontSize: 18, paddingTop: 14 }}>{fmt(dayTotal)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: 'center', color: C.muted, padding: '28px 0', fontSize: 13 }}>
          No expenses yet — add above ↑
        </div>
      )}

      {catBreakdown.length > 0 && (
        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {catBreakdown.map(c => (
            <div key={c.cat} style={{ background: C.accentLight, borderRadius: 8, padding: '5px 12px', fontSize: 11 }}>
              <span style={{ color: C.accent, fontWeight: 600 }}>{c.cat}</span>
              <span style={{ color: C.text, fontWeight: 700, marginLeft: 6 }}>{fmt(c.amt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
