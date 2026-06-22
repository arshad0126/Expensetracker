import { useState, useEffect, useCallback, useRef } from 'react';
import { STORAGE_KEY } from '../constants';
import { bumpVersion, persistToStorage, loadFromStorage, clearStorage } from '../utils/helpers';

export function useExpenseTracker() {
  const [tripData, setTripData] = useState({ state: null, log: [] });
  const [savedMsg, setSavedMsg] = useState('');
  const [activeDay, setActiveDay] = useState(0);
  const flashTimeoutRef = useRef(null);
  
  // Track if initial load is completed to prevent overwriting storage on mount
  const isLoadedRef = useRef(false);

  // Load on mount
  useEffect(() => {
    const stored = loadFromStorage(STORAGE_KEY);
    if (stored?.state) {
      setTripData({
        state: stored.state,
        log: stored.log || []
      });
      setActiveDay(stored.state.currentDay - 1);
    }
    isLoadedRef.current = true;
    // If nothing stored → App.jsx will show Setup screen
  }, []);

  // Save to localStorage when state or log changes (after initial load)
  useEffect(() => {
    if (isLoadedRef.current && tripData.state) {
      persistToStorage(STORAGE_KEY, tripData.state, tripData.log);
    }
  }, [tripData]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
    };
  }, []);

  const flash = useCallback(() => {
    setSavedMsg('Saved ✓');
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
    }
    flashTimeoutRef.current = setTimeout(() => {
      setSavedMsg('');
      flashTimeoutRef.current = null;
    }, 1800);
  }, []);

  // Called once after setup screen is filled
  const initTrip = useCallback((initialState) => {
    const l = [{ version: '1.0', note: 'Trip created 🎉', ts: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) }];
    setTripData({ state: initialState, log: l });
    setActiveDay(0);
  }, []);

  const switchDay = useCallback((idx) => {
    setActiveDay(idx);
    setTripData(prev => {
      if (!prev.state) return prev;
      const dayNum = idx + 1;
      if (dayNum > prev.state.currentDay) {
        const version = `${dayNum}.0`;
        const ns = { ...prev.state, currentDay: dayNum, editCount: 0, version };
        const entry = { version, note: `Moved to Day ${dayNum}`, ts: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) };
        const nl = [entry, ...prev.log];
        return { state: ns, log: nl };
      }
      return prev;
    });
  }, []);

  const addEntry = useCallback((newItem, activeDayIdx) => {
    if (!newItem.desc.trim() || newItem.amount === '' || isNaN(newItem.amount) || Number(newItem.amount) < 0) return false;
    setTripData(prev => {
      if (!prev.state) return prev;
      const newDays = prev.state.days.map((d, i) =>
        i !== activeDayIdx ? d : { ...d, entries: [...d.entries, { id: Date.now(), desc: newItem.desc.trim(), amount: Number(newItem.amount), category: newItem.category }] }
      );
      const { newState, newLog } = bumpVersion({ ...prev.state, days: newDays }, activeDayIdx, `Added "${newItem.desc.trim()}" → Day ${activeDayIdx + 1}`, prev.log);
      return { state: newState, log: newLog };
    });
    flash();
    return true;
  }, [flash]);

  const deleteEntry = useCallback((entryId, activeDayIdx) => {
    setTripData(prev => {
      if (!prev.state) return prev;
      const entry   = prev.state.days[activeDayIdx].entries.find(e => e.id === entryId);
      const newDays = prev.state.days.map((d, i) => i !== activeDayIdx ? d : { ...d, entries: d.entries.filter(e => e.id !== entryId) });
      const { newState, newLog } = bumpVersion({ ...prev.state, days: newDays }, activeDayIdx, `Deleted "${entry?.desc}"`, prev.log);
      return { state: newState, log: newLog };
    });
    flash();
  }, [flash]);

  const saveEdit = useCallback((editingId, editVal, activeDayIdx) => {
    if (!editVal.desc.trim() || editVal.amount === '' || isNaN(editVal.amount) || Number(editVal.amount) < 0) return false;
    setTripData(prev => {
      if (!prev.state) return prev;
      const newDays = prev.state.days.map((d, i) =>
        i !== activeDayIdx ? d : { ...d, entries: d.entries.map(e => e.id === editingId ? { ...e, desc: editVal.desc.trim(), amount: Number(editVal.amount), category: editVal.category } : e) }
      );
      const { newState, newLog } = bumpVersion({ ...prev.state, days: newDays }, activeDayIdx, `Edited entry in Day ${activeDayIdx + 1}`, prev.log);
      return { state: newState, log: newLog };
    });
    flash();
    return true;
  }, [flash]);

  const saveDayLabel = useCallback((newLabel, activeDayIdx) => {
    if (!newLabel.trim()) return;
    setTripData(prev => {
      if (!prev.state) return prev;
      const newDays = prev.state.days.map((d, i) => i === activeDayIdx ? { ...d, label: newLabel.trim() } : d);
      const { newState, newLog } = bumpVersion({ ...prev.state, days: newDays }, activeDayIdx, `Renamed Day ${activeDayIdx + 1}`, prev.log);
      return { state: newState, log: newLog };
    });
  }, []);

  const resetAll = useCallback(() => {
    if (!window.confirm('Reset everything and start a new trip? This cannot be undone.')) return;
    clearStorage(STORAGE_KEY);
    setTripData({ state: null, log: [] });
    setActiveDay(0);
  }, []);

  return {
    state: tripData.state,
    log: tripData.log,
    savedMsg,
    activeDay,
    initTrip,
    switchDay,
    addEntry,
    deleteEntry,
    saveEdit,
    saveDayLabel,
    resetAll,
  };
}
