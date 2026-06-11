import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEY } from '../constants';
import { bumpVersion, persistToStorage, loadFromStorage, clearStorage } from '../utils/helpers';

export function useExpenseTracker() {
  const [state,    setState]    = useState(null);
  const [log,      setLog]      = useState([]);
  const [savedMsg, setSavedMsg] = useState('');
  const [activeDay,setActiveDay]= useState(0);

  // Load on mount
  useEffect(() => {
    const stored = loadFromStorage(STORAGE_KEY);
    if (stored?.state) {
      setState(stored.state);
      setLog(stored.log || []);
      setActiveDay(stored.state.currentDay - 1);
    }
    // If nothing stored → App.jsx will show Setup screen
  }, []);

  function flash() {
    setSavedMsg('Saved ✓');
    setTimeout(() => setSavedMsg(''), 1800);
  }

  const commit = useCallback((s, l) => {
    setState(s); setLog(l);
    persistToStorage(STORAGE_KEY, s, l);
    flash();
  }, []);

  // Called once after setup screen is filled
  const initTrip = useCallback((initialState) => {
    const l = [{ version: '1.0', note: 'Trip created 🎉', ts: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) }];
    setState(initialState); setLog(l); setActiveDay(0);
    persistToStorage(STORAGE_KEY, initialState, l);
  }, []);

  const switchDay = useCallback((idx) => {
    setActiveDay(idx);
    setState(prev => {
      if (!prev) return prev;
      const dayNum = idx + 1;
      if (dayNum > prev.currentDay) {
        const version = `${dayNum}.0`;
        const ns = { ...prev, currentDay: dayNum, editCount: 0, version };
        const entry = { version, note: `Moved to Day ${dayNum}`, ts: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) };
        const nl = [entry, ...log];
        setLog(nl);
        persistToStorage(STORAGE_KEY, ns, nl);
        return ns;
      }
      return prev;
    });
  }, [log]);

  const addEntry = useCallback((newItem, activeDayIdx) => {
    if (!newItem.desc.trim() || newItem.amount === '' || isNaN(newItem.amount) || Number(newItem.amount) < 0) return false;
    setState(prev => {
      const newDays = prev.days.map((d, i) =>
        i !== activeDayIdx ? d : { ...d, entries: [...d.entries, { id: Date.now(), desc: newItem.desc.trim(), amount: Number(newItem.amount), category: newItem.category }] }
      );
      const { newState, newLog } = bumpVersion({ ...prev, days: newDays }, activeDayIdx, `Added "${newItem.desc.trim()}" → Day ${activeDayIdx + 1}`, log);
      setLog(newLog); persistToStorage(STORAGE_KEY, newState, newLog); flash();
      return newState;
    });
    return true;
  }, [log]);

  const deleteEntry = useCallback((entryId, activeDayIdx) => {
    setState(prev => {
      const entry   = prev.days[activeDayIdx].entries.find(e => e.id === entryId);
      const newDays = prev.days.map((d, i) => i !== activeDayIdx ? d : { ...d, entries: d.entries.filter(e => e.id !== entryId) });
      const { newState, newLog } = bumpVersion({ ...prev, days: newDays }, activeDayIdx, `Deleted "${entry?.desc}"`, log);
      setLog(newLog); persistToStorage(STORAGE_KEY, newState, newLog); flash();
      return newState;
    });
  }, [log]);

  const saveEdit = useCallback((editingId, editVal, activeDayIdx) => {
    if (!editVal.desc.trim() || editVal.amount === '' || isNaN(editVal.amount)) return;
    setState(prev => {
      const newDays = prev.days.map((d, i) =>
        i !== activeDayIdx ? d : { ...d, entries: d.entries.map(e => e.id === editingId ? { ...e, desc: editVal.desc.trim(), amount: Number(editVal.amount), category: editVal.category } : e) }
      );
      const { newState, newLog } = bumpVersion({ ...prev, days: newDays }, activeDayIdx, `Edited entry in Day ${activeDayIdx + 1}`, log);
      setLog(newLog); persistToStorage(STORAGE_KEY, newState, newLog); flash();
      return newState;
    });
  }, [log]);

  const saveDayLabel = useCallback((newLabel, activeDayIdx) => {
    if (!newLabel.trim()) return;
    setState(prev => {
      const newDays = prev.days.map((d, i) => i === activeDayIdx ? { ...d, label: newLabel.trim() } : d);
      const { newState, newLog } = bumpVersion({ ...prev, days: newDays }, activeDayIdx, `Renamed Day ${activeDayIdx + 1}`, log);
      setLog(newLog); persistToStorage(STORAGE_KEY, newState, newLog);
      return newState;
    });
  }, [log]);

  const resetAll = useCallback(() => {
    if (!window.confirm('Reset everything and start a new trip? This cannot be undone.')) return;
    clearStorage(STORAGE_KEY);
    setState(null); setLog([]); setActiveDay(0);
  }, []);

  return {
    state, log, savedMsg, activeDay,
    initTrip, switchDay, addEntry, deleteEntry, saveEdit, saveDayLabel, resetAll,
  };
}
