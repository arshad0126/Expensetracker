import { useState, useEffect, useCallback, useRef } from 'react';
import { STORAGE_KEY } from '../constants';
import { bumpVersion, persistToStorage, loadFromStorage, clearStorage } from '../utils/helpers';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export function useExpenseTracker() {
  const [tripData, setTripData] = useState({ state: null, log: [] });
  const [savedMsg, setSavedMsg] = useState('');
  const [activeDay, setActiveDay] = useState(0);
  const flashTimeoutRef = useRef(null);
  
  // Auth and Sync state
  const [user, setUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudTripId, setCloudTripId] = useState(null);

  // Track if initial load is completed to prevent overwriting storage on mount
  const isLoadedRef = useRef(false);

  // Keep latest tripData in a ref to prevent stale closures in async effects
  const tripDataRef = useRef(tripData);
  useEffect(() => {
    tripDataRef.current = tripData;
  }, [tripData]);

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
  }, []);

  // Sync with Supabase Auth state
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchRemoteTrip = async (u) => {
      setIsSyncing(true);
      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const remote = data[0];
          setTripData({ state: remote.state_data, log: remote.log_data });
          setActiveDay(remote.state_data.currentDay - 1);
          setCloudTripId(remote.id);
        } else if (tripDataRef.current.state) {
          // Sync local trip to cloud if no remote trip exists
          const local = tripDataRef.current;
          const { data: inserted, error: insertError } = await supabase
            .from('trips')
            .insert({
              user_id: u.id,
              trip_name: local.state.tripName,
              state_data: local.state,
              log_data: local.log
            })
            .select();

          if (insertError) throw insertError;
          if (inserted && inserted.length > 0) {
            setCloudTripId(inserted[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching remote trip:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    // Get active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user || null;
      setUser(u);
      if (u) fetchRemoteTrip(u);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user || null;
      setUser(u);
      if (event === 'SIGNED_IN' && u) {
        fetchRemoteTrip(u);
      } else if (event === 'SIGNED_OUT') {
        setCloudTripId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save to localStorage and Supabase when state or log changes (after initial load)
  useEffect(() => {
    if (isLoadedRef.current && tripData.state) {
      persistToStorage(STORAGE_KEY, tripData.state, tripData.log);

      // Upload changes to Supabase if logged in
      if (isSupabaseConfigured && user) {
        const syncToCloud = async () => {
          setIsSyncing(true);
          try {
            if (cloudTripId) {
              const { error } = await supabase
                .from('trips')
                .update({
                  trip_name: tripData.state.tripName,
                  state_data: tripData.state,
                  log_data: tripData.log
                })
                .eq('id', cloudTripId);
              if (error) throw error;
            } else {
              const { data, error } = await supabase
                .from('trips')
                .insert({
                  user_id: user.id,
                  trip_name: tripData.state.tripName,
                  state_data: tripData.state,
                  log_data: tripData.log
                })
                .select();
              if (error) throw error;
              if (data && data.length > 0) {
                setCloudTripId(data[0].id);
              }
            }
          } catch (err) {
            console.error('Real-time cloud sync failed:', err);
          } finally {
            setIsSyncing(false);
          }
        };
        syncToCloud();
      }
    }
  }, [tripData, user, cloudTripId]);

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

  const resetAll = useCallback(async () => {
    if (!window.confirm('Reset everything and start a new trip? This cannot be undone.')) return;
    clearStorage(STORAGE_KEY);

    if (isSupabaseConfigured && user && cloudTripId) {
      setIsSyncing(true);
      try {
        await supabase.from('trips').delete().eq('id', cloudTripId);
      } catch (err) {
        console.error('Failed to delete cloud trip:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    setTripData({ state: null, log: [] });
    setCloudTripId(null);
    setActiveDay(0);
  }, [user, cloudTripId]);

  return {
    state: tripData.state,
    log: tripData.log,
    savedMsg,
    activeDay,
    user,
    isSyncing,
    initTrip,
    switchDay,
    addEntry,
    deleteEntry,
    saveEdit,
    saveDayLabel,
    resetAll,
    setUser,
  };
}
