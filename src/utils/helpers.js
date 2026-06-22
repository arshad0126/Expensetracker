/**
 * Format a number as currency string with ₹ symbol.
 * Falls back gracefully for non-INR usage too.
 */
export function fmt(value, symbol = '₹') {
  return symbol + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 0 });
}

/** Sum amount fields of an entries array. */
export function computeTotal(entries) {
  return entries.reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Bump version string on every change.
 * Format: {currentDay}.{editCount}.{editedDayNumber}
 */
export function bumpVersion(state, editedDayIdx, note, log) {
  const dayNum  = editedDayIdx + 1;
  const ec      = state.editCount + 1;
  const version = `${state.currentDay}.${ec}.${dayNum}`;
  const entry   = {
    version,
    note,
    ts: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }),
  };
  return {
    newState: { ...state, editCount: ec, version },
    newLog:   [entry, ...log],
  };
}

/** Save to localStorage. */
export function persistToStorage(key, state, log) {
  try { localStorage.setItem(key, JSON.stringify({ state, log })); }
  catch (e) { console.warn('Storage write failed:', e); }
}

/** Load from localStorage. Returns null if nothing found. */
export function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Storage read failed:', e);
    return null;
  }
}

/** Clear localStorage entry. */
export function clearStorage(key) {
  try { localStorage.removeItem(key); } catch (e) {}
}

/** Build a fresh state from user's trip setup. */
export function buildInitialState(setup) {
  const { tripName, destination, totalDays, startDate, people, budget, hotelName, hotelCost, flightCost } = setup;

  // Generate day labels + dates
  const days = Array.from({ length: totalDays }, (_, i) => {
    let dateLabel = `Day ${i + 1}`;
    if (startDate) {
      const [year, month, day] = startDate.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      d.setDate(d.getDate() + i);
      dateLabel = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
    return { label: `Day ${i + 1}`, date: dateLabel, entries: [] };
  });

  return {
    version:    '1.0',
    currentDay: 1,
    editCount:  0,
    tripName:   tripName   || 'My Trip',
    destination:destination || '',
    people:     Number(people) || 1,
    budget:     Number(budget) || 0,
    fixed: {
      hotel:  { name: hotelName  || '', amount: Number(hotelCost)  || 0 },
      flight: { name: 'Flights',         amount: Number(flightCost) || 0 },
    },
    days,
  };
}
