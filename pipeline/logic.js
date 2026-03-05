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

// ── WoundDetector — shared interface (R2) ────────────────────────────────────
// WoundDetector.check(characterId, text) → { triggered: bool, word: string }
// Each panel provides its own wound data. Orchestrator never touches it directly.
// Mirror of WoundDetector in index.html — keep in sync.

function makeWoundDetector(woundData) {
  return {
    check(characterId, text) {
      const triggers = woundData[characterId];
      if (!triggers) return { triggered: false, word: '' };
      const lower = text.toLowerCase();
      for (const word of triggers) {
        if (lower.includes(word.toLowerCase())) return { triggered: true, word };
      }
      return { triggered: false, word: '' };
    },
  };
}

const GOLF_WOUNDS_DATA = {
  coltart:   ['valderrama', 'seve', 'westwood', 'cameraman', 'three and two', '3 and 2', 'brookline'],
  mcginley:  ['gobshite', 'wheelhouse'],
  faldo:     ['d:ream', 'things can only get better', 'keyboards'],
  dougherty: ["can't improve", 'give up', 'defeatist', 'never get better'],
  murray:    ["doesn't matter", 'not important', 'move on', 'insignificant'],
  henni:     ["don't answer that", 'skip that', 'ignore that question'],
  roe:       ['scorecard', 'disqualified', 'parnevik', 'royal st george', '2003', 'painkillers', 'wedge game', 'norgaard', 'belfry'],
};

const BOARDROOM_WOUNDS_DATA = {
  // Populated when Boardroom wounds are defined — interface is ready
};

const GolfWoundDetector     = makeWoundDetector(GOLF_WOUNDS_DATA);
const BoardroomWoundDetector = makeWoundDetector(BOARDROOM_WOUNDS_DATA);

module.exports = { maskKey, isValidKey, shouldUpdateInput, Temperature, makeWoundDetector, GolfWoundDetector, BoardroomWoundDetector };
