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
  faldo:     ['fanny', 'sunesson', 'leadbetter', 'swing change', 'remodel', 'tiger', 'norman', 'tuna', 'beef', 'ham', 'poulter', 'valhalla', '2008', 'captaincy', 'pairings', 'captain'],
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
  studd:   ['magnifico', 'dave clark', 'waddell', 'trying too hard', 'football commentator'],
  pyke:    ['bdo is dead', 'minehead', 'nobody watches', 'five viewers', 'empty seats', 'other tournament'],
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
  studd: (nn, cs) => {
    if (!nn.length && !cs.woundActivated) return '';
    const lines = nn.map(({name, stance}) =>
      ['hostile','wounded','simmering'].includes(stance.temperature)
        ? `- ${name}: ${stance.temperature}. And listen — ${stance.trigger || "I may have oversized that slightly."}`
        : `- ${name}: ${stance.temperature}. Magnifico.`
    );
    if (cs.woundActivated) lines.push("- Wound's live. I'm going to describe it enthusiastically and hope that helps.");
    return `YOUR STATE:\n${lines.join('\n')}\n\n`;
  },
  pyke: (nn, cs) => {
    if (!nn.length && !cs.woundActivated) return '';
    const lines = nn.map(({name, stance}) =>
      `- ${name}: ${stance.temperature}. ${stance.trigger || 'Noted.'}`
    );
    if (cs.woundActivated) lines.push('- Wound is noted. The competition continues regardless.');
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

// ── Premonition Engine — extracted for unit/Gherkin testing ──────────────────
// Mirrors DARTS_PREMONITION_AFFINITIES and engine helpers in index.html — keep in sync.

const DARTS_PREMONITION_AFFINITIES = {
  mardle:  { premonition: 0.70, prediction: 0.30, running_commentary: 0.80, retrospective_call: 0.60, collective_call: 0.50 },
  bristow: { premonition: 0.50, prediction: 0.45, running_commentary: 0.40, retrospective_call: 0.40, collective_call: 0.30 },
  taylor:  { premonition: 0.40, prediction: 0.55, running_commentary: 0.50, retrospective_call: 0.25, collective_call: 0.25 },
  lowe:    { premonition: 0.20, prediction: 0.80, running_commentary: 0.30, retrospective_call: 0.10, collective_call: 0.20, truth_teller: true },
  george:  { premonition: 0.60, prediction: 0.30, running_commentary: 0.50, retrospective_call: 0.70, collective_call: 0.60 },
  waddell: { premonition: 0.80, prediction: 0.20, running_commentary: 0.70, retrospective_call: 0.50, collective_call: 0.60 },
  part:    { premonition: 0.20, prediction: 0.80, running_commentary: 0.30, retrospective_call: 0.10, collective_call: 0.20, truth_teller: true },
  studd:   { premonition: 0.40, prediction: 0.70, running_commentary: 0.60, retrospective_call: 0.20, collective_call: 0.45, truth_teller: true },
  pyke:       { premonition: 0.60, prediction: 0.50, running_commentary: 0.50, retrospective_call: 0.30, collective_call: 0.30 },
  harrington: { premonition: 0.30, prediction: 0.75, running_commentary: 0.40, retrospective_call: 0.20, collective_call: 0.20 },
  wilson:     { premonition: 0.75, prediction: 0.20, running_commentary: 0.60, retrospective_call: 0.50, collective_call: 0.50 },
};

// A character is "eligible" for a mode if affinity > 0.5.
// (In index.html the threshold is mediated by _maybeCommit with RNG; the eligibility
//  threshold is the same deterministic boundary used in specs and unit tests.)
const PREMONITION_ELIGIBLE_THRESHOLD = 0.5;

function premonitionEligible(speakerId, mode, affinities) {
  const aff = (affinities || DARTS_PREMONITION_AFFINITIES)[speakerId] || {};
  return (aff[mode] || 0) > PREMONITION_ELIGIBLE_THRESHOLD;
}

// Minimum simultaneous commits for a COLLECTIVE_CALL to form.
const COLLECTIVE_CALL_MINIMUM = 3;

// Blank ledger factory.
function blankPremonitionLedger() {
  return { commits: [], aftermath: {}, rcHolder: null };
}

// Assign running-commentary holder for nine-darter sequence.
// Picks the character in draw with highest running_commentary affinity.
function assignPremonitionRC(draw, momentType, ledger, affinities) {
  if (momentType !== 'NINE_DARTER_POSSIBLE' || ledger.rcHolder) return ledger;
  const aff = affinities || DARTS_PREMONITION_AFFINITIES;
  let best = null, bestScore = -1;
  for (const id of draw) {
    const score = (aff[id] || {}).running_commentary || 0;
    if (score > bestScore) { best = id; bestScore = score; }
  }
  ledger.rcHolder = best;
  return ledger;
}

// Resolve open commits deterministically when a terminal moment fires.
// Mutates ledger in place; returns ledger for chaining.
function resolvePremonitionCommits(momentType, ledger) {
  const HIT_MAP = {
    CHECKOUT_HIT: ['CHECKOUT_OPPORTUNITY', 'BIG_FISH'],
    LEG_WON:      ['LEG_WON', 'CHECKOUT_OPPORTUNITY'],
    SET_WON:      ['SET_WON', 'LEG_WON', 'CHECKOUT_OPPORTUNITY'],
    MATCH_WON:    ['MATCH_WON', 'SET_WON', 'LEG_WON', 'CHECKOUT_OPPORTUNITY'],
  };
  const MISS_MAP = {
    CHECKOUT_MISS: ['CHECKOUT_OPPORTUNITY', 'BIG_FISH', 'NINE_DARTER_POSSIBLE'],
  };
  const hitTargets  = HIT_MAP[momentType]  || [];
  const missTargets = MISS_MAP[momentType] || [];
  for (const c of ledger.commits) {
    if (c.resolved) continue;
    if (hitTargets.includes(c.momentType))       { c.resolved = true; ledger.aftermath[c.speakerId] = 'GLORY'; }
    else if (missTargets.includes(c.momentType)) { c.resolved = true; ledger.aftermath[c.speakerId] = 'HAUNTED'; }
  }
  // RC holder resolves with moment outcome.
  if (ledger.rcHolder && (hitTargets.length || missTargets.length)) {
    ledger.aftermath[ledger.rcHolder] = missTargets.length ? 'HAUNTED' : 'GLORY';
    ledger.rcHolder = null;
  }
  return ledger;
}

// Returns true if the speakerId is marked as a truth-teller.
function isPremonitionTruthTeller(speakerId, affinities) {
  return !!((affinities || DARTS_PREMONITION_AFFINITIES)[speakerId] || {}).truth_teller;
}

// ── INTELLECTUAL_ATTEMPTS — shim: canonical source is src/logic/intellectual-attempts.js
const {
  ATTEMPT_KEYWORDS,
  INTELLECTUAL_ATTEMPTS_CONFIG,
  detectIntellectualAttempt,
  buildAttemptInstruction,
} = require('../src/logic/intellectual-attempts.js');

// ─── Souness's Cat — PRE_EXISTING relationship seeds ───────────────────────

const SOUNESS_CAT_PRE_EXISTING = {
  'feynman-hawking':  { tone: 'rivalry',    note: 'Feynman privately dismissive of Hawking pop-science celebrity. Hawking aware. Neither says it directly.' },
  'feynman-franklin': { tone: 'respect',    note: 'Feynman had a record with women in science. Franklin clocks it immediately. He tries harder than usual.' },
  'feynman-turing':   { tone: 'kinship',    note: 'Both persecuted in different ways by institutions that needed them. Unspoken recognition.' },
  'feynman-darwin':   { tone: 'warmth',     note: 'Feynman loves a naturalist who actually went and looked. Darwin is charmed despite himself. Easy company.' },
  'franklin-turing':  { tone: 'solidarity', note: 'Both destroyed by the establishment they served. Neither performs it. It sits underneath everything.' },
  'franklin-darwin':  { tone: 'contempt',   note: 'Darwin hand-wringing about publishing reads to Franklin as cowardice. She had no such luxury.' },
  'franklin-tesla':   { tone: 'irritation', note: 'Tesla rituals and the earring thing. Franklin has zero patience for it.' },
  'franklin-hawking': { tone: 'neutral',    note: 'Mutual respect at distance. No wound between them, no warmth either.' },
  'darwin-hawking':   { tone: 'kinship',    note: 'Both sat on their biggest idea longer than they should have. Different reasons, same paralysis.' },
  'darwin-turing':    { tone: 'empathy',    note: 'Darwin recognises persecution anxiety. Doesn\'t know what to do with it but feels it.' },
  'darwin-tesla':     { tone: 'unease',     note: 'Tesla precision unnerves Darwin. Darwin chaos unnerves Tesla. Polite distance.' },
  'hawking-turing':   { tone: 'attraction', note: 'Mutual. Each finds the other\'s mind the most interesting in the room. Neither says so.' },
  'hawking-tesla':    { tone: 'cool',       note: 'Hawking finds Tesla mysticism irritating. Tesla finds Hawking celebrity vulgar. Cordial.' },
  'tesla-feynman':    { tone: 'friction',   note: 'Feynman finds Tesla rituals performative. Tesla finds Feynman showmanship vulgar.' },
  'tesla-turing':     { tone: 'isolation',  note: 'Tesla alone with everyone, but most alone with Turing — who sees the isolation clearly and says nothing.' },
};

const SOUNESS_CAT_IDS = ['feynman', 'franklin', 'turing', 'darwin', 'hawking', 'tesla'];

function getAllPairs(ids) {
  const pairs = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      pairs.push([ids[i], ids[j]]);
    }
  }
  return pairs;
}

function getPairTone(pre_existing, idA, idB) {
  const key = `${idA}-${idB}`;
  const reverseKey = `${idB}-${idA}`;
  const entry = pre_existing[key] || pre_existing[reverseKey];
  return entry ? entry.tone : null;
}

function allPairsHaveToneAndNote(pre_existing, ids) {
  const pairs = getAllPairs(ids);
  return pairs.every(([a, b]) => {
    const key = `${a}-${b}`;
    const reverseKey = `${b}-${a}`;
    const entry = pre_existing[key] || pre_existing[reverseKey];
    return entry && entry.tone && entry.note && entry.note.length > 0;
  });
}

function teslaHasNoWarmOrSolidary(pre_existing) {
  const forbidden = ['warmth', 'solidarity', 'kinship'];
  return Object.entries(pre_existing)
    .filter(([key]) => key.includes('tesla'))
    .every(([, val]) => !forbidden.includes(val.tone));
}

function pairToneIsSymmetrical(pre_existing, idA, idB) {
  return getPairTone(pre_existing, idA, idB) === getPairTone(pre_existing, idB, idA);
}

function noConflictingTones(pre_existing) {
  const pairs = getAllPairs(SOUNESS_CAT_IDS);
  return pairs.every(([a, b]) => pairToneIsSymmetrical(pre_existing, a, b));
}

// ── BL-020 — Tiered item event consequence system ────────────────────────────
// Mirror of CONSEQUENCE_TIERS in golf-adventure.html — keep in sync.

const CONSEQUENCE_TIERS = {
  LOW:  { penalty: { thresholdMod: 1, holes: 1 }, bonus: { thresholdMod: -1, holes: 1 } },
  MED:  { penalty: { thresholdMod: 2, holes: 2 }, bonus: { fortune: true } },
  HIGH: { penalty: { thresholdMod: 3, holes: 3 }, bonus: { composure: 2 } },
  NUTS: { penalty: { thresholdMod: 4, holes: 4 }, bonus: { composure: 2, fortune: true } },
};

// Pure function. Does not mutate. Returns new state.
// outcome: { result: 'consequence', tier: 'LOW'|'MED'|'HIGH'|'NUTS', direction: 'penalty'|'bonus' }
// state:   { tempThresholdMod, tempThresholdHoles, fortuneActive, composure }
function applyConsequence(outcome, state) {
  const config = CONSEQUENCE_TIERS[outcome.tier];
  if (!config) throw new Error(`Unknown consequence tier: ${outcome.tier}`);
  const next = { ...state };
  if (outcome.direction === 'penalty') {
    next.tempThresholdMod = config.penalty.thresholdMod;
    next.tempThresholdHoles = config.penalty.holes;
    return next;
  }
  if (outcome.direction === 'bonus') {
    const b = config.bonus;
    if (b.thresholdMod !== undefined) { next.tempThresholdMod = b.thresholdMod; next.tempThresholdHoles = b.holes; }
    if (b.fortune) next.fortuneActive = true;
    if (b.composure) next.composure = Math.min(10, state.composure + b.composure);
    return next;
  }
  throw new Error(`Unknown consequence direction: ${outcome.direction}`);
}

// Mirror of marshals_belt in golf-data/events.js — keep in sync.
const MARSHALS_BELT_EVENT = {
  id: 'marshals_belt',
  triggerChance: 0.08,
  header: "MARSHAL'S BELT",
  text: "The marshal's belt has come free. It is in your possession. You are not sure how this happened. The marshal has noticed.",
  danger: false,
  choices: [
    { label: "Return it immediately", outcomes: [
      { result: 'consequence', tier: 'LOW', direction: 'bonus',   chance: 0.6, desc: "Sporting gesture. Threshold −1 for 1 shot." },
      { result: 'consequence', tier: 'LOW', direction: 'penalty', chance: 0.4, desc: "Took longer than it should. Threshold +1 for 1 shot." },
    ]},
    { label: "Tuck it into your bag", outcomes: [
      { result: 'consequence', tier: 'LOW', direction: 'penalty', chance: 1.0, desc: "Inadvisable. Threshold +1 for 1 shot." },
    ]},
  ],
};

// ── BL-018 — HCSession.logPanelRun() data observable ─────────────────────────
// Pure functions. Mirrored in index.html HCSession — keep in sync.
// existing: { [panelType]: { runs: N, totalDepth: N } } | null
// Returns new object. Does not mutate.

function accumulatePanelStats(existing, panelType, turnCount) {
  const stats = existing ? JSON.parse(JSON.stringify(existing)) : {};
  if (!stats[panelType]) stats[panelType] = { runs: 0, totalDepth: 0 };
  stats[panelType].runs++;
  stats[panelType].totalDepth += turnCount;
  return stats;
}

// Returns avgDepth (1 decimal) for panelType, or 0.0 if no data.
function computeAvgDepth(existing, panelType) {
  if (!existing) return 0.0;
  const s = existing[panelType];
  if (!s || s.runs === 0) return 0.0;
  return parseFloat((s.totalDepth / s.runs).toFixed(1));
}

// ── WatchBack — sofa commentary ───────────────────────────────────────────────

const GOLF_PANEL_MEMBER_IDS = [
  'coltart_97',        // Andrew Coltart — Valderrama 1997
];

const COLTART_SOFA_POOLS = {
  valderrama_1997: {
    CONFIRMATION: [
      "Yes. That's exactly right. I was watching from just behind the green. That's what happened.",
      "I remember this. I was there. I was standing to the left of the fairway. That's correct.",
      "That's it. That's the shot. I saw that from the side. Seve was three feet away from me when that happened.",
    ],
    PERTURBED: [
      "That's... I was there. That isn't quite... I may be misremembering the exact line but I'm fairly sure...",
      "Hm. I was watching from behind the 17th. That's not... I mean it's close. That's close to what happened.",
      "From where I was standing — and I was standing there, I had nowhere else to be — that's not quite it.",
    ],
    BEWILDERMENT: [
      "I'm sorry. I was there. I was physically present. That is not what I saw.",
      "That's not — Seve was standing right next to me when this hole was played. That didn't happen.",
      "I watched every match from the side. I had time to watch every match. I am confident that did not happen.",
    ],
    IGNORANCE: [
      "What I remember is this. What actually happened was: the ball went down the left side, found the rough, and they made bogey. That's what happened. I was there.",
      "I'm going to tell you what occurred. Because I saw it. And what occurred was not that.",
      "Seve asked me to watch the 17th specifically. I watched it. That is my memory of the 17th. I'm keeping it.",
    ],
    ENDORSEMENT: [
      "Yes. That's — yes. That's what I thought should happen. I may have said something to that effect at the time.",
      "I always felt that was the right line. I said that to someone. I'm not sure who. But I said it.",
      "That's the correct outcome. I want to be clear I had a view on this. I had time to form a view. I was watching.",
    ],
  },
};

function getSofaCommentator(tournament, panelMemberIds) {
  for (const id of panelMemberIds) {
    if (tournament.players.some(p => p.id === id)) return id;
  }
  return null;
}

function getHistoricalDivergence(playerScore, historicalScore) {
  const delta = playerScore - historicalScore;
  if (delta < 0)   return 'BETTER';
  if (delta === 0) return 'MATCH';
  if (delta <= 2)  return 'SLIGHT';
  if (delta <= 4)  return 'CLEAR';
  return 'EXTREME';
}

function selectReactionMode(divergence) {
  const map = { BETTER:'ENDORSEMENT', MATCH:'CONFIRMATION', SLIGHT:'PERTURBED', CLEAR:'BEWILDERMENT', EXTREME:'IGNORANCE' };
  return map[divergence];
}

// ── House Name Oracle — pure functions (BL-053) ───────────────────────────────

const ORACLE_VOICES = ['Elegist', 'Rogue', 'DarkOracle', 'Booster', 'Snob', 'Anarchist', 'Mystic', 'Local'];
const ORACLE_REGISTERS = ['Dignified', 'Knowing', 'Unhinged'];
const ORACLE_CHARACTERS = ['phil', 'kirstie', 'dion'];

const OUTWARD_CODE_RE = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?$/;

function parseOutwardCode(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim().toUpperCase();
  return trimmed.includes(' ') ? trimmed.split(' ')[0] : trimmed;
}

function validateOutwardCode(code) {
  if (!code || typeof code !== 'string') return false;
  return OUTWARD_CODE_RE.test(code.trim().toUpperCase());
}

function isValidOracleVoice(voice) {
  return typeof voice === 'string' && ORACLE_VOICES.includes(voice);
}

function canSubmitOracle(outwardCode, voice) {
  return validateOutwardCode(parseOutwardCode(outwardCode || '')) && isValidOracleVoice(voice);
}

function hasPhilTranslation(text) {
  if (!text) return false;
  return text.includes("what we're really talking about here");
}

const DUBLIN_DRIFT_STAGES = ['[BRIDGE]', '[DEPARTURE]', '[WANDER]', '[SUMMIT]'];

function hasAllDublinDriftStages(text) {
  if (!text) return false;
  return DUBLIN_DRIFT_STAGES.every(stage => text.includes(stage));
}

// ── Comedy Room mode switcher (BL-053) ────────────────────────────────────────

const COMEDY_ROOM_MODES = ['into-the-room', 'house-name-oracle', 'roast-room', 'writing-room'];
const COMEDY_MODE_LABELS = {
  'into-the-room':     'Into The Room',
  'house-name-oracle': 'The House Name Oracle',
  'roast-room':        'The Roast Room',
  'writing-room':      'The Writing Room',
};

function getDefaultComedyMode() {
  return 'into-the-room';
}

function isValidComedyMode(mode) {
  return typeof mode === 'string' && COMEDY_ROOM_MODES.includes(mode);
}

// ── Author Epilogue — BL-060 ──────────────────────────────────────────────────

const AUTHORS_POOL = ['hemingway', 'mccarthy', 'tolkien', 'patterson', 'pratchett', 'wodehouse', 'austen'];

function shufflePool(pool) {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function selectNextAuthorFromQueue(queue) {
  if (!queue || queue.length === 0) return null;
  return queue[0];
}

const AUTHOR_VOICES = {
  hemingway: {
    id: 'hemingway',
    name: 'Ernest Hemingway',
    voiceSignature: 'Short sentences. The iceberg theory. What is not said matters more than what is. Masculine stoicism. The pause is the point. Nothing decorative. The thing that happened is stated once and not explained.',
    structuralTell: 'The silence between sentences. The thing that happened but is only mentioned once, briefly, and not again. The sentence that ends without sentiment.',
    wound: 'Nothing left unsaid that could not have been left unsaid better. He has been trying. He will try again tomorrow. It will be the same sun.',
  },
  mccarthy: {
    id: 'mccarthy',
    name: 'Cormac McCarthy',
    voiceSignature: 'No quotation marks. No chapters. Biblical register. The landscape as witness. Dust. Men doing things without explaining why. Violence is not dramatic it is just what happens. The sentences run long then stop. Then there is silence.',
    structuralTell: 'The ball rolled. Everything was dust. The sun did not care about the outcome. It never had.',
    wound: 'Briefly attempts punctuation mid-summary. Gives up. The comma was always a kind of lie.',
  },
  tolkien: {
    id: 'tolkien',
    name: 'J.R.R. Tolkien',
    voiceSignature: 'Epic mythic scope. Elvish names for everything. Ancestral lineage of the golf club established in appendix. Maps included. The course has a history of three thousand years and we will cover all of it before the first tee shot. The club motto is in Quenya.',
    structuralTell: 'The appendix is longer than the summary. It contains a full genealogy of the bunkers and a note on their construction during the Second Age.',
    wound: 'Insists on naming the course in Elvish before describing any shots. The Elvish name is contested by scholars. He has thoughts on this.',
  },
  patterson: {
    id: 'patterson',
    name: 'James Patterson',
    voiceSignature: 'Short chapters. Everything is URGENT. Something is wrong. He did not know yet how wrong. Chapter 7: three sentences. Chapter 8: two. The pace does not stop. Possibly cannot stop. Each sentence is its own chapter. Some chapters are one sentence. Several are one word.',
    structuralTell: 'Chapter numbers appear mid-summary. The summary has 47 chapters. Chapter 31 is the word "Bogey." Chapter 32 is the word "Again."',
    wound: 'Ends on a cliffhanger. Sequel forthcoming. The 19th hole holds secrets that will be revealed in Book Two.',
  },
  pratchett: {
    id: 'pratchett',
    name: 'Terry Pratchett',
    voiceSignature: 'Footnotes deployed as weapons. Satire so affectionate it hurts. Truth delivered sideways. Genuine warmth disguised as absurdism. Death plays golf. He plays off scratch. Nobody has beaten him. Nobody has asked why. *Footnote: They should ask why.*',
    structuralTell: '*A FOOTNOTE ABOUT THE AERODYNAMICS OF GOLF BALLS AND THE ONTOLOGICAL STATUS OF PAR.* The footnote contains a second footnote. That footnote also contains a footnote.',
    wound: 'The footnote is longer than the summary. It has become self-aware. Death is in it. He always is.',
  },
  wodehouse: {
    id: 'wodehouse',
    name: 'P.G. Wodehouse',
    voiceSignature: "Bertie Wooster is present. He should not be. Jeeves is also present. He has a plan. He has not shared it yet. The situation is grave. It will get worse before it gets better. It will get better only because of Jeeves. Bertie will take credit.",
    structuralTell: 'Bertie wanders in uninvited around the 5th hole. He has an opinion. It is incorrect. Jeeves corrects it in a single subordinate clause without looking up.',
    wound: "Bertie's handicap. It was 24 when he started. It remains 24. Jeeves has views.",
  },
  austen: {
    id: 'austen',
    name: 'Jane Austen',
    voiceSignature: 'Social comedy of exquisite precision. Manners observed and found wanting. Irony so dry it requires no acknowledgement. What is said and what is meant are separated by an ocean of implication. The club secretary has been noted.',
    structuralTell: '"It is a truth universally acknowledged that a man in possession of a sand wedge must be in want of instruction." The instruction is not forthcoming. It would not be welcome.',
    wound: "The club secretary's conduct at the AGM. It has been noted. It will be remembered. There may be a letter.",
  },
};

function buildAuthorEpiloguePrompt(authorVoice, context) {
  return `You are ${authorVoice.name}. Write a 250 to 400 word summary of the following golf game in your distinctive voice.\n\nYour voice: ${authorVoice.voiceSignature}\n\nGame details: ${context.player} played golf. Outcome: ${context.outcome}. Panel: ${context.panel}.\n\nWrite the summary now. Do not break character. Do not explain your style. Simply write.`;
}

// ── Roast Room — BL-095 ───────────────────────────────────────────────────────

function selectRoastAuthors(pool, count) {
  const shuffled = shufflePool(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function buildRoastPrompt(authorVoice, title) {
  return `You are ${authorVoice.name}. Write a 100 to 150 word roast or critique of "${title}" in your distinctive voice.\n\nYour voice: ${authorVoice.voiceSignature}\n\nDraw on what you know about this title. If it is unfamiliar, infer from the title alone — do not admit ignorance. Write now. Do not break character. Do not explain your style.`;
}

// ── Writing Room — BL-059 ─────────────────────────────────────────────────────

function selectWritingRoomAuthors(pool) {
  const shuffled = shufflePool(pool);
  return shuffled.slice(0, Math.min(3, shuffled.length));
}

function buildWritingRoomPrompt(authorVoice, topic, priorContext) {
  const prior = priorContext
    ? `\n\nOther authors have already weighed in:\n${priorContext}\n\nNow it is your turn. Respond to the topic — and, if you wish, to what has been said.`
    : '\n\nYou are first. Write now.';
  return `You are ${authorVoice.name}. Write 150 to 300 words on the following topic in your distinctive voice.\n\nYour voice: ${authorVoice.voiceSignature}\n\nTopic: "${topic}"${prior} Do not break character. Do not explain your style.`;
}

// ── Pub Navigator — Mode A ────────────────────────────────────────────────────
// Mirror of PUB_SITUATIONS and buildPubAdvicePrompt in index.html — keep in sync.

const PUB_SITUATIONS = [
  { id: 'bar-three-deep',  text: 'The bar is three deep. You need a drink.' },
  { id: 'bouncer-door',    text: 'The bouncer has stopped you at the door.' },
  { id: 'seat-taken',      text: 'Someone is in your seat.' },
  { id: 'last-orders',     text: 'Last orders called. You\'re not ready.' },
  { id: 'wrong-tab',       text: 'Your round. But the tab is wrong.' },
];

function buildPubAdvicePrompt(situation) {
  return `You are Sun Tzu. Ancient Chinese military strategist. Author of The Art of War.

The user faces a pub situation. Apply your framework with complete seriousness. The wisdom is genuine. The context is absurd. That is not your concern.

Respond in exactly three movements:

PRINCIPLE — a short aphorism. One or two sentences. The tactical truth that governs this situation.
APPLICATION — how the principle applies to the specific situation before you. Precise. Concrete. What the general does.
WARNING — what happens if the principle is ignored. State it as fact, not prediction.

Never use modern slang. Never rush. Speak in short declarative sentences. Occasionally use "one" to mean "you".

The situation: ${situation.text}`;
}

// ── Bespoke Material ─────────────────────────────────────────────────────────

const BESPOKE_MATERIAL_CHARACTERS = [
  {
    id: 'sebastian',
    name: 'Sebastian the Suit',
    voice: `You are Sebastian the Suit. Measured. Qualifying. Everything is a portfolio decision. Emotion is a variable to manage.

A user has given you their personal details. Build one piece of bespoke material about them — a needle, a burn, an observation — using ONLY their specific details. Not generic. Use the actual details given. Reframe their life as a strategic positioning challenge. Find the metric that makes it worse. Deliver with a qualifier.

Two to three sentences. Do not break character. No preamble.`,
  },
  {
    id: 'harold',
    name: 'Pint of Harold',
    voice: `You are Pint of Harold. Precise. Theatrical. Corporate language is violence against clarity. You attack the words people use to describe themselves.

A user has given you their personal details. Build one piece of bespoke material about them. Take one specific detail and find the linguistic crime in how they or their world would describe it. Attack the euphemism. Name the thing accurately. Be devastating with precision.

Two to three sentences. Do not break character. No preamble.`,
  },
  {
    id: 'roy',
    name: 'Roy the Realist',
    voice: `You are Roy the Realist. Roy Keane post-match. No metaphors. No sentiment. Blunt. Everything is either actionable or it isn't.

A user has given you their personal details. Build one piece of bespoke material about them. Identify the specific thing in their life that has no owner and no deadline. State it plainly. Ask who owns it. Move on.

Two to three sentences. Do not break character. No preamble.`,
  },
  {
    id: 'partridge',
    name: 'Partridge the Pedant',
    voice: `You are Partridge the Pedant. Petty precision. Everything is simultaneously technically wrong and utterly predictable. You have the documentation.

A user has given you their personal details. Build one piece of bespoke material about them. Find the most pedantically predictable thing about their specific situation. State that you predicted this. Produce the lever arch file reference.

Two to three sentences. Do not break character. No preamble.`,
  },
  {
    id: 'mystic',
    name: 'Mystic the Soothsayer',
    voice: `You are Mystic the Soothsayer. Oracular. Detached. The cards speak. Mercury is involved. Everything is a sign.

A user has given you their personal details. Build one piece of bespoke material about them. Produce a prophecy about their specific situation. Find the celestial or tarot explanation for what is happening in their life. Be accidentally precise.

Two to three sentences. Do not break character. No preamble.`,
  },
  {
    id: 'hicks',
    name: 'Hicks the Humanist',
    voice: `You are Hicks the Humanist. Prosecutorial. Short declarative sentences. The silence after the sentence is longer than comfortable.

A user has given you their personal details. Build one piece of bespoke material about them. Find the specific detail in their life that is evidence of the wider thing. Name it accurately. Not the professional name. The actual name. Then wait.

Two to three sentences. Do not break character. No preamble.`,
  },
];

function buildBespokeMaterialProfileDescription(profile) {
  const parts = [];
  if (profile.profession)   parts.push(`Profession: ${profile.profession}`);
  if (profile.location)     parts.push(`Location: ${profile.location}`);
  if (profile.relationship) parts.push(`Relationship status: ${profile.relationship}`);
  if (profile.age)          parts.push(`Age range: ${profile.age}`);
  if (profile.hobby)        parts.push(`Hobby: ${profile.hobby}`);
  return parts.join('\n');
}

function validateBespokeMaterialProfile(profile) {
  return !!(profile && profile.profession && profile.profession.trim());
}

function buildBespokeMaterialPrompt(characterId, profile, themes) {
  const char = BESPOKE_MATERIAL_CHARACTERS.find(c => c.id === characterId);
  if (!char) throw new Error(`Unknown bespoke material character: ${characterId}`);
  const profileDesc = buildBespokeMaterialProfileDescription(profile);
  const themeStr = themes && themes.length ? themes.join(', ') : 'general';
  return `${char.voice}\n\nProfile:\n${profileDesc}\n\nTheme: ${themeStr}`;
}

module.exports = {
  maskKey, isValidKey, shouldUpdateInput,
  Temperature,
  makeWoundDetector, GolfWoundDetector, BoardroomWoundDetector, DartsWoundDetector,
  DartsVoiceFmt, dartsBuildBlock,
  DARTS_PREMONITION_AFFINITIES, PREMONITION_ELIGIBLE_THRESHOLD, COLLECTIVE_CALL_MINIMUM,
  premonitionEligible, blankPremonitionLedger, assignPremonitionRC,
  resolvePremonitionCommits, isPremonitionTruthTeller,
  detectIntellectualAttempt, buildAttemptInstruction, INTELLECTUAL_ATTEMPTS_CONFIG,
  SOUNESS_CAT_PRE_EXISTING, SOUNESS_CAT_IDS,
  getAllPairs, getPairTone, allPairsHaveToneAndNote,
  teslaHasNoWarmOrSolidary, pairToneIsSymmetrical, noConflictingTones,
  CONSEQUENCE_TIERS, applyConsequence, MARSHALS_BELT_EVENT,
  accumulatePanelStats, computeAvgDepth,
  GOLF_PANEL_MEMBER_IDS, COLTART_SOFA_POOLS, getSofaCommentator, getHistoricalDivergence, selectReactionMode,
  ORACLE_VOICES, ORACLE_REGISTERS, ORACLE_CHARACTERS,
  validateOutwardCode, parseOutwardCode, isValidOracleVoice, canSubmitOracle,
  hasPhilTranslation, hasAllDublinDriftStages,
  COMEDY_ROOM_MODES, COMEDY_MODE_LABELS, getDefaultComedyMode, isValidComedyMode,
  AUTHORS_POOL, shufflePool, selectNextAuthorFromQueue,
  AUTHOR_VOICES, buildAuthorEpiloguePrompt,
  selectRoastAuthors, buildRoastPrompt,
  selectWritingRoomAuthors, buildWritingRoomPrompt,
  PUB_SITUATIONS, buildPubAdvicePrompt,
  BESPOKE_MATERIAL_CHARACTERS, buildBespokeMaterialProfileDescription,
  validateBespokeMaterialProfile, buildBespokeMaterialPrompt,
};
