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
      if (!text) return { triggered: false, word: '' };
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
  faldo:     ['fanny', 'sunesson', 'leadbetter', 'swing change', 'remodel', 'tiger', 'norman'],
  dougherty: ["can't improve", 'give up', 'defeatist', 'never get better'],
  murray:    ["doesn't matter", 'not important', 'move on', 'insignificant'],
  henni:     ["don't answer that", 'skip that', 'ignore that question'],
  roe:       ['scorecard', 'disqualified', 'parnevik', 'royal st george', '2003', 'painkillers', 'wedge game', 'norgaard', 'belfry'],
};

const BOARDROOM_WOUNDS_DATA = {
  cox: ['d:ream', 'things can only get better', 'keyboards'],
};

const DARTS_WOUNDS_DATA = {
  mardle:  ['shepherd', 'treble five', 'treble 5', 'mardle drift', 'mumps', 'donna'],
  bristow: ['dartitis', 'twitter', 'wimps', 'sixteen titles', '16 titles'],
  taylor:  ['luck', 'fortunate', '2016', 'drink', '2014'],
  lowe:    ['stoneface', 'bdo split', 'pdc split', 'nine dart', '9 dart'],
  george:  ['six nil', '6-0', '1994 final', 'six-nil'],
  waddell: ['just entertainment', 'just commentary', '2012', 'passed away'],
  part:    ['no one knows', 'unknown in canada', "canada doesn't"],
};

const GolfWoundDetector     = makeWoundDetector(GOLF_WOUNDS_DATA);
const BoardroomWoundDetector = makeWoundDetector(BOARDROOM_WOUNDS_DATA);
const DartsWoundDetector     = makeWoundDetector(DARTS_WOUNDS_DATA);

// ── DartsVoiceFmt — character-congruent YOUR STATE formatters ────────────────
// Mirrors DARTS_VOICE_FMT in index.html — keep in sync.
// buildBlock calls fmt(nonNeutral, charState, owed, owes, turn) → string.
// These MUST be functions. Strings cause TypeError when buildBlock executes.

const DartsVoiceFmt = {
  mardle: (nn, cs) => {
    if (!nn.length && !cs.woundActivated) return '';
    const lines = nn.map(({name, stance}) =>
      ['hostile','wounded','simmering'].includes(stance.temperature)
        ? `- ${name}: ${stance.temperature}. Ha — ${stance.trigger || "I probably said something, didn't I."}`
        : `- ${name}: ${stance.temperature}.`
    );
    if (cs.woundActivated) lines.push("- Wound's live. You know what? I probably deserved it.");
    return `YOUR STATE:\n${lines.join('\n')}\n\n`;
  },
  bristow: (nn, cs) => {
    if (!nn.length && !cs.woundActivated) return '';
    const lines = nn.map(({name, stance}) =>
      ['hostile','wounded','simmering'].includes(stance.temperature)
        ? `- ${name}. ${stance.temperature}. ${stance.trigger || 'Straight up.'}`
        : `- ${name}. ${stance.temperature}.`
    );
    if (cs.woundActivated) lines.push("- Wound's live. That's a fact.");
    return `YOUR STATE:\n${lines.join('\n')}\n\n`;
  },
  taylor: (nn, cs) => {
    if (!nn.length && !cs.woundActivated) return '';
    const lines = nn.map(({name, stance}) =>
      `- ${name}: ${stance.temperature}. ${stance.trigger || "I'm aware of that."}`
    );
    if (cs.woundActivated) lines.push("- Wound's live. I'll deal with it. That's what I do.");
    return `YOUR STATE:\n${lines.join('\n')}\n\n`;
  },
  lowe: (nn, cs) => {
    if (!nn.length && !cs.woundActivated) return '';
    const lines = nn.map(({name, stance}) =>
      `- Toward ${name}: ${stance.temperature}. ${stance.trigger || 'Noted.'}`
    );
    if (cs.woundActivated) lines.push('- Wound is live. (pause)');
    return `YOUR STATE:\n${lines.join('\n')}\n\n`;
  },
  george: (nn, cs) => {
    if (!nn.length && !cs.woundActivated) return '';
    const lines = nn.map(({name, stance}) =>
      ['hostile','wounded','simmering'].includes(stance.temperature)
        ? `- ${name}: ${stance.temperature}. Oh now, look — ${stance.trigger || 'Bobby remembers.'}`
        : `- ${name}: ${stance.temperature}.`
    );
    if (cs.woundActivated) lines.push("- Wound's live. Lovely, brilliant — that's what it is.");
    return `YOUR STATE:\n${lines.join('\n')}\n\n`;
  },
  waddell: (nn, cs) => {
    if (!nn.length && !cs.woundActivated) return '';
    const lines = nn.map(({name, stance}) =>
      ['hostile','wounded','simmering'].includes(stance.temperature)
        ? `- ${name}: ${stance.temperature}. Aye — ${stance.trigger || 'the cathedral has a crack in it.'}`
        : `- ${name}: ${stance.temperature}. Aye.`
    );
    if (cs.woundActivated) lines.push("- Wound's live. The cathedral still stands. The references do not pause.");
    return `YOUR STATE:\n${lines.join('\n')}\n\n`;
  },
  part: (nn, cs) => {
    if (!nn.length && !cs.woundActivated) return '';
    const lines = nn.map(({name, stance}) =>
      `- Toward ${name}: ${stance.temperature}. ${stance.trigger || 'Filed.'}`
    );
    if (cs.woundActivated) lines.push('- Wound is active. I have noted it. Moving on.');
    return `YOUR STATE:\n${lines.join('\n')}\n\n`;
  },
};

// Thin wrapper for unit testing the buildBlock path without full RelationshipState.
function dartsBuildBlock(speakerId, nonNeutral, woundActivated) {
  const cs = { woundActivated, debtLedger: { owed: [], owes: [] } };
  const fmt = DartsVoiceFmt[speakerId];
  if (!fmt) return '';
  return fmt(nonNeutral, cs, [], [], 1);
}

module.exports = { maskKey, isValidKey, shouldUpdateInput, Temperature, makeWoundDetector, GolfWoundDetector, BoardroomWoundDetector, DartsWoundDetector, DartsVoiceFmt, dartsBuildBlock };
