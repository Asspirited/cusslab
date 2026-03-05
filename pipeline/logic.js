// Pure functions extracted from index.html for unit testing.
// These must remain in sync with their counterparts in index.html.

function maskKey(k) {
  if (!k) return '';
  return k.slice(0, 12) + '...' + k.slice(-4);
}

function isValidKey(k) {
  return typeof k === 'string' && k.trim().length > 20;
}

function shouldUpdateInput(inp, activeElement) {
  // Guard introduced to fix Bug 6: do not overwrite input while user has focus
  return inp != null && activeElement !== inp;
}

// ── Temperature value object ─────────────────────────────────────────────────
// Immutable. Invalid temperatures are impossible not just unlikely.
// Mirrors the Temperature const in index.html — keep in sync.

const TEMPERATURE_SCALE = ['hostile','wounded','simmering','cooling','neutral','warm','reverent'];
const TEMPERATURE_INTERRUPT_RATES = { hostile:0.45, wounded:0.30, simmering:0.20, cooling:0.08, neutral:0.04, warm:0.02, reverent:0.01 };

const Temperature = {
  SCALE: TEMPERATURE_SCALE,

  raise(current) {
    const idx = TEMPERATURE_SCALE.indexOf(current);
    if (idx === -1) throw new Error(`Invalid temperature: "${current}"`);
    return TEMPERATURE_SCALE[Math.min(idx + 1, TEMPERATURE_SCALE.length - 1)];
  },

  lower(current) {
    const idx = TEMPERATURE_SCALE.indexOf(current);
    if (idx === -1) throw new Error(`Invalid temperature: "${current}"`);
    return TEMPERATURE_SCALE[Math.max(idx - 1, 0)];
  },

  fromString(s) {
    if (!s || !TEMPERATURE_SCALE.includes(s)) throw new Error(`Invalid temperature: "${s}"`);
    return s;
  },

  interruptRate(t) {
    const rate = TEMPERATURE_INTERRUPT_RATES[t];
    if (rate === undefined) throw new Error(`Invalid temperature: "${t}"`);
    return rate;
  },

  isValid(s) {
    return TEMPERATURE_SCALE.includes(s);
  },
};

module.exports = { maskKey, isValidKey, shouldUpdateInput, Temperature };
