import React, { useState } from 'react';
import { C } from '../constants';
import { buildInitialState } from '../utils/helpers';

const FIELD = {
  background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
  padding: '11px 14px', color: C.text, fontSize: 14, outline: 'none',
  width: '100%', fontFamily: 'inherit',
};

const LABEL = {
  fontSize: 11, fontWeight: 700, color: C.muted,
  letterSpacing: 1.5, marginBottom: 6, display: 'block',
};

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={LABEL}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>
      {children}
    </div>
  );
}

export default function SetupScreen({ onSetup }) {
  const [form, setForm] = useState({
    tripName:    '',
    destination: '',
    totalDays:   '',
    startDate:   '',
    people:      '1',
    budget:      '',
    hotelName:   '',
    hotelCost:   '',
    flightCost:  '',
  });
  const [error, setError] = useState('');

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function handleSubmit() {
    if (!form.tripName.trim())   { setError('Please enter a trip name.'); return; }
    if (!form.destination.trim()){ setError('Please enter a destination.'); return; }
    if (!form.totalDays || Number(form.totalDays) < 1 || Number(form.totalDays) > 30) {
      setError('Please enter number of days (1–30).'); return;
    }
    setError('');
    onSetup(buildInitialState(form));
  }

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✈️</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: C.text, letterSpacing: -0.5, marginBottom: 8 }}>
            Trip Expense Tracker
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
            Track every expense on your trip, day by day.<br />
            Fill in your trip details to get started.
          </p>
        </div>

        {/* Form card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '28px 24px' }}>

          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 2, marginBottom: 20 }}>TRIP DETAILS</div>

          <Field label="TRIP NAME" required>
            <input value={form.tripName} onChange={e => set('tripName', e.target.value)}
              placeholder="e.g. Goa Trip, Manali Adventure, Europe 2025"
              style={FIELD} />
          </Field>

          <Field label="DESTINATION" required>
            <input value={form.destination} onChange={e => set('destination', e.target.value)}
              placeholder="e.g. Goa, Manali, Paris"
              style={FIELD} />
          </Field>

          <div style={{ display: 'flex', gap: 14, marginBottom: 0 }}>
            <div style={{ flex: 1 }}>
              <Field label="NUMBER OF DAYS" required>
                <input value={form.totalDays} onChange={e => set('totalDays', e.target.value)}
                  type="number" min="1" max="30" placeholder="e.g. 6"
                  style={FIELD} />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="NUMBER OF PEOPLE">
                <input value={form.people} onChange={e => set('people', e.target.value)}
                  type="number" min="1" placeholder="e.g. 2"
                  style={FIELD} />
              </Field>
            </div>
          </div>

          <Field label="START DATE">
            <input value={form.startDate} onChange={e => set('startDate', e.target.value)}
              type="date" style={FIELD} />
          </Field>

          <Field label="BUDGET (optional)">
            <input value={form.budget} onChange={e => set('budget', e.target.value)}
              type="number" placeholder="e.g. 60000"
              style={FIELD} />
          </Field>

          <div style={{ height: 1, background: C.border, margin: '8px 0 20px' }} />

          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 2, marginBottom: 20 }}>FIXED COSTS (optional)</div>

          <Field label="HOTEL NAME">
            <input value={form.hotelName} onChange={e => set('hotelName', e.target.value)}
              placeholder="e.g. The Beach Resort"
              style={FIELD} />
          </Field>

          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <Field label="HOTEL COST (₹)">
                <input value={form.hotelCost} onChange={e => set('hotelCost', e.target.value)}
                  type="number" placeholder="e.g. 14750"
                  style={FIELD} />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="FLIGHTS COST (₹)">
                <input value={form.flightCost} onChange={e => set('flightCost', e.target.value)}
                  type="number" placeholder="e.g. 29000"
                  style={FIELD} />
              </Field>
            </div>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: `1px solid ${C.danger}33`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.danger, marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            style={{
              width: '100%', padding: '14px 0', background: C.accent, color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800,
              cursor: 'pointer', letterSpacing: 0.3,
              boxShadow: '0 4px 16px rgba(45,106,79,0.3)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.9'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Start Tracking →
          </button>

          <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
            All data is saved locally in your browser.<br />Nothing is sent to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
