import React from 'react';
import { C } from '../constants';

export default function Header({ tripName, destination, version, savedMsg, onVersionClick, onReset, user, onCloudClick, isSyncing }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.muted, marginBottom: 4 }}>
          {destination ? `${destination.toUpperCase()} · ` : ''}EXPENSE TRACKER
        </div>
        <h1 style={{ margin: 0, fontSize: 21, fontWeight: 900, letterSpacing: -0.5, color: C.text }}>
          {tripName || 'Trip Tracker'}
        </h1>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {savedMsg && <span style={{ fontSize: 11, color: C.accentSoft, fontWeight: 700 }}>{savedMsg}</span>}
        
        {/* Cloud Sync Status Button */}
        <button onClick={onCloudClick} title={user ? `Synced as ${user.email}` : "Sync to cloud"}
          style={{
            background: user ? `${C.accent}14` : 'none',
            border: `1px solid ${user ? C.accentSoft + '55' : C.border}`,
            color: user ? C.accent : C.muted,
            borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
            fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4
          }}>
          {isSyncing ? '🔄' : user ? '☁️ ✓' : '☁️ Sync'}
        </button>

        <span onClick={onVersionClick} title="Version history"
          style={{ fontSize: 11, color: C.accent, cursor: 'pointer', padding: '4px 10px', background: C.accentLight, borderRadius: 20, fontWeight: 700, border: `1px solid ${C.accentSoft}44` }}>
          v{version}
        </span>
        <button onClick={onReset}
          style={{ background: 'none', border: `1px solid ${C.border}`, color: C.danger, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
          New Trip
        </button>
      </div>
    </div>
  );
}
