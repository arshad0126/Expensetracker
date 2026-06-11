import React, { useState } from 'react';
import { C } from './constants';
import { computeTotal } from './utils/helpers';
import { useExpenseTracker } from './hooks/useExpenseTracker';

import SetupScreen  from './components/SetupScreen';
import Header       from './components/Header';
import VersionLog   from './components/VersionLog';
import TripBanner   from './components/TripBanner';
import FixedCosts   from './components/FixedCosts';
import TabBar       from './components/TabBar';
import DayTabs      from './components/DayTabs';
import EntryTable   from './components/EntryTable';
import SpendChart   from './components/SpendChart';
import SummaryTab   from './components/SummaryTab';
import BreakdownTab from './components/BreakdownTab';

export default function App() {
  const [tab,     setTab]     = useState('daily');
  const [showLog, setShowLog] = useState(false);

  const {
    state, log, savedMsg, activeDay,
    initTrip, switchDay, addEntry, deleteEntry, saveEdit, saveDayLabel, resetAll,
  } = useExpenseTracker();

  // ── Show setup screen if no trip initialized yet ──
  if (!state) {
    return <SetupScreen onSetup={initTrip} />;
  }

  const fixedTotal = (state.fixed?.hotel?.amount || 0) + (state.fixed?.flight?.amount || 0);
  const dailyTotal = state.days.reduce((s, d) => s + computeTotal(d.entries), 0);
  const grandTotal = fixedTotal + dailyTotal;

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: C.bg, minHeight: '100vh', color: C.text, maxWidth: 700, margin: '0 auto', padding: '24px 16px 60px' }}>

      <Header
        tripName={state.tripName}
        destination={state.destination}
        version={state.version}
        savedMsg={savedMsg}
        onVersionClick={() => setShowLog(v => !v)}
        onReset={resetAll}
      />

      {showLog && <VersionLog log={log} />}

      <TripBanner
        state={state}
        dailyTotal={dailyTotal}
        grandTotal={grandTotal}
        fixedTotal={fixedTotal}
      />

      {fixedTotal > 0 && <FixedCosts fixed={state.fixed} />}

      <TabBar active={tab} onChange={setTab} />

      {/* ── DAILY VIEW ── */}
      {tab === 'daily' && (<>
        <DayTabs
          days={state.days}
          activeDay={activeDay}
          currentDay={state.currentDay}
          onSwitch={switchDay}
        />
        <EntryTable
          day={state.days[activeDay]}
          activeDayIdx={activeDay}
          onAdd={addEntry}
          onDelete={deleteEntry}
          onSaveEdit={saveEdit}
          onRenameDay={saveDayLabel}
        />
        <SpendChart days={state.days} activeDay={activeDay} />
      </>)}

      {/* ── SUMMARY ── */}
      {tab === 'summary' && (
        <SummaryTab
          state={state}
          dailyTotal={dailyTotal}
          grandTotal={grandTotal}
          fixedTotal={fixedTotal}
          onDayClick={(i) => { setTab('daily'); switchDay(i); }}
        />
      )}

      {/* ── BREAKDOWN ── */}
      {tab === 'breakdown' && (
        <BreakdownTab
          state={state}
          dailyTotal={dailyTotal}
          grandTotal={grandTotal}
        />
      )}

    </div>
  );
}
