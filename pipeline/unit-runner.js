// Unit test runner — tests pure functions in pipeline/logic.js
// Run: node pipeline/unit-runner.js

const { maskKey, isValidKey, shouldUpdateInput, Temperature, makeWoundDetector, GolfWoundDetector, BoardroomWoundDetector, DartsWoundDetector, DartsVoiceFmt, dartsBuildBlock, DARTS_PREMONITION_AFFINITIES, COLLECTIVE_CALL_MINIMUM, premonitionEligible, blankPremonitionLedger, assignPremonitionRC, resolvePremonitionCommits, isPremonitionTruthTeller, detectIntellectualAttempt, buildAttemptInstruction, INTELLECTUAL_ATTEMPTS_CONFIG, SOUNESS_CAT_PRE_EXISTING, SOUNESS_CAT_IDS, getAllPairs, getPairTone, allPairsHaveToneAndNote, teslaHasNoWarmOrSolidary, pairToneIsSymmetrical, noConflictingTones, CONSEQUENCE_TIERS, applyConsequence, MARSHALS_BELT_EVENT, accumulatePanelStats, computeAvgDepth, GOLF_PANEL_MEMBER_IDS, COLTART_SOFA_POOLS, getSofaCommentator, getHistoricalDivergence, selectReactionMode, validateOutwardCode, parseOutwardCode, ORACLE_VOICES, isValidOracleVoice, canSubmitOracle, ORACLE_REGISTERS, ORACLE_CHARACTERS, hasPhilTranslation, hasAllDublinDriftStages, COMEDY_ROOM_MODES, COMEDY_MODE_LABELS, getDefaultComedyMode, isValidComedyMode, AUTHOR_VOICES, buildAuthorEpiloguePrompt, AUTHORS_POOL, shufflePool, selectNextAuthorFromQueue } = require('./logic.js');

let passed = 0;
let failed = 0;
const failures = [];

function assert(description, actual, expected) {
  if (actual === expected) {
    passed++;
  } else {
    failed++;
    failures.push(`  FAIL: ${description}\n       expected: ${JSON.stringify(expected)}\n       got:      ${JSON.stringify(actual)}`);
  }
}

// ── maskKey ──────────────────────────────────────────────────────────────────

assert('maskKey: masks a standard API key',
  maskKey('sk-ant-api03-ABCDEFGHIJKLMNOPQRSTUVWXYZ12345'),
  'sk-ant-api03...2345');

assert('maskKey: masks a short-suffix key',
  maskKey('sk-ant-api03-ABCDEFGHIJKLMNOPQRSTUVWXYZ6789'),
  'sk-ant-api03...6789');

assert('maskKey: returns empty string for null',
  maskKey(null), '');

assert('maskKey: returns empty string for empty string',
  maskKey(''), '');

assert('maskKey: last 4 chars are correct',
  maskKey('sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXABCD').slice(-4),
  'ABCD');

assert('maskKey: first 12 chars are correct',
  maskKey('sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXABCD').slice(0, 12),
  'sk-ant-api03');

// ── isValidKey ───────────────────────────────────────────────────────────────

assert('isValidKey: accepts a full-length API key',
  isValidKey('sk-ant-api03-ABCDEFGHIJKLMNOPQRSTUVWXYZ12345'), true);

assert('isValidKey: rejects empty string',
  isValidKey(''), false);

assert('isValidKey: rejects null',
  isValidKey(null), false);

assert('isValidKey: rejects key of exactly 20 chars',
  isValidKey('12345678901234567890'), false);

assert('isValidKey: accepts key of 21 chars',
  isValidKey('123456789012345678901'), true);

assert('isValidKey: rejects masked display value (19 chars)',
  isValidKey('sk-ant-api03...XXXX'), false);

assert('isValidKey: rejects whitespace-only string',
  isValidKey('                     '), false);

// ── shouldUpdateInput ────────────────────────────────────────────────────────

const fakeInp = { id: 'settings-key-input' };
const otherEl = { id: 'other' };

assert('shouldUpdateInput: true when inp exists and not focused',
  shouldUpdateInput(fakeInp, otherEl), true);

assert('shouldUpdateInput: false when inp is the active element (user editing)',
  shouldUpdateInput(fakeInp, fakeInp), false);

assert('shouldUpdateInput: false when inp is null',
  shouldUpdateInput(null, otherEl), false);

assert('shouldUpdateInput: true when activeElement is null',
  shouldUpdateInput(fakeInp, null), true);

// ── Temperature.raise() ──────────────────────────────────────────────────────

assert('Temperature.raise: hostile → wounded',   Temperature.raise('hostile'),   'wounded');
assert('Temperature.raise: wounded → simmering', Temperature.raise('wounded'),   'simmering');
assert('Temperature.raise: simmering → cooling', Temperature.raise('simmering'), 'cooling');
assert('Temperature.raise: cooling → neutral',   Temperature.raise('cooling'),   'neutral');
assert('Temperature.raise: neutral → warm',      Temperature.raise('neutral'),   'warm');
assert('Temperature.raise: warm → reverent',     Temperature.raise('warm'),      'reverent');
assert('Temperature.raise: reverent → reverent (capped)', Temperature.raise('reverent'), 'reverent');

// ── Temperature.lower() ──────────────────────────────────────────────────────

assert('Temperature.lower: reverent → warm',     Temperature.lower('reverent'),  'warm');
assert('Temperature.lower: warm → neutral',      Temperature.lower('warm'),      'neutral');
assert('Temperature.lower: neutral → cooling',   Temperature.lower('neutral'),   'cooling');
assert('Temperature.lower: cooling → simmering', Temperature.lower('cooling'),   'simmering');
assert('Temperature.lower: simmering → wounded', Temperature.lower('simmering'), 'wounded');
assert('Temperature.lower: wounded → hostile',   Temperature.lower('wounded'),   'hostile');
assert('Temperature.lower: hostile → hostile (capped)', Temperature.lower('hostile'), 'hostile');

// ── Temperature.fromString() ─────────────────────────────────────────────────

['hostile','wounded','simmering','cooling','neutral','warm','reverent'].forEach(v => {
  assert(`Temperature.fromString: accepts "${v}"`, Temperature.fromString(v), v);
});

function assertThrows(description, fn) {
  try { fn(); failed++; failures.push(`  FAIL: ${description}\n       expected error but none thrown`); }
  catch(e) { passed++; }
}

assertThrows('Temperature.fromString: rejects "furious"',  () => Temperature.fromString('furious'));
assertThrows('Temperature.fromString: rejects empty string', () => Temperature.fromString(''));
assertThrows('Temperature.fromString: rejects null',        () => Temperature.fromString(null));

// ── Temperature.interruptRate() ──────────────────────────────────────────────

assert('Temperature.interruptRate: hostile → 0.45',   Temperature.interruptRate('hostile'),   0.45);
assert('Temperature.interruptRate: wounded → 0.30',   Temperature.interruptRate('wounded'),   0.30);
assert('Temperature.interruptRate: simmering → 0.20', Temperature.interruptRate('simmering'), 0.20);
assert('Temperature.interruptRate: cooling → 0.08',   Temperature.interruptRate('cooling'),   0.08);
assert('Temperature.interruptRate: neutral → 0.04',   Temperature.interruptRate('neutral'),   0.04);
assert('Temperature.interruptRate: warm → 0.02',      Temperature.interruptRate('warm'),      0.02);
assert('Temperature.interruptRate: reverent → 0.01',  Temperature.interruptRate('reverent'),  0.01);

// ── Temperature.isValid() ────────────────────────────────────────────────────

assert('Temperature.isValid: neutral → true',  Temperature.isValid('neutral'), true);
assert('Temperature.isValid: furious → false', Temperature.isValid('furious'), false);
assert('Temperature.isValid: empty → false',   Temperature.isValid(''),        false);

// ── GolfWoundDetector.check() ─────────────────────────────────────────────────

assert('GolfWoundDetector: triggered true for known wound word - faldo',
  GolfWoundDetector.check('faldo', 'he mentioned fanny sunesson').triggered, true);

assert('GolfWoundDetector: triggered false for non-wound text - faldo',
  GolfWoundDetector.check('faldo', 'great round today').triggered, false);

assert('GolfWoundDetector: triggered false for unknown character',
  GolfWoundDetector.check('unknown_character', 'Masters').triggered, false);

assert('GolfWoundDetector: returns triggered and word keys',
  typeof GolfWoundDetector.check('faldo', 'Masters').triggered, 'boolean');

assert('GolfWoundDetector: word is returned when triggered',
  typeof GolfWoundDetector.check('faldo', 'Masters').word, 'string');

assert('GolfWoundDetector: case-insensitive match - uppercase',
  GolfWoundDetector.check('faldo', 'FANNY').triggered, true);

assert('GolfWoundDetector: case-insensitive match - mixed case',
  GolfWoundDetector.check('faldo', 'Swing Change at Augusta').triggered, true);

assert('GolfWoundDetector: empty text returns triggered false',
  GolfWoundDetector.check('faldo', '').triggered, false);

assert('GolfWoundDetector: null text returns triggered false',
  GolfWoundDetector.check('faldo', null).triggered, false);

// ── BoardroomWoundDetector.check() ────────────────────────────────────────────

assert('BoardroomWoundDetector: satisfies WoundDetector interface - has check function',
  typeof BoardroomWoundDetector.check, 'function');

assert('BoardroomWoundDetector: triggered false for unknown character',
  BoardroomWoundDetector.check('unknown', 'anything').triggered, false);

assert('BoardroomWoundDetector: triggered false for non-wound text',
  BoardroomWoundDetector.check('cox', 'hello world').triggered, false);

assert('BoardroomWoundDetector: cox triggered by d:ream',
  BoardroomWoundDetector.check('cox', 'you were in d:ream').triggered, true);

assert('BoardroomWoundDetector: cox triggered by keyboards',
  BoardroomWoundDetector.check('cox', 'he played the keyboards').triggered, true);

assert('BoardroomWoundDetector: cox triggered case-insensitively by things can only get better',
  BoardroomWoundDetector.check('cox', 'Things Can Only Get Better').triggered, true);

assert('BoardroomWoundDetector: returns boolean triggered',
  typeof BoardroomWoundDetector.check('cox', 'test').triggered, 'boolean');

// ── DartsWoundDetector.check() ────────────────────────────────────────────────

assert('DartsWoundDetector: satisfies WoundDetector interface - has check function',
  typeof DartsWoundDetector.check, 'function');

assert('DartsWoundDetector: triggered false for unknown character',
  DartsWoundDetector.check('unknown', 'shepherd').triggered, false);

assert('DartsWoundDetector: triggered false for non-wound text',
  DartsWoundDetector.check('mardle', 'great throw tonight').triggered, false);

assert('DartsWoundDetector: mardle triggered by shepherd',
  DartsWoundDetector.check('mardle', 'kirk shepherd ranked 142').triggered, true);

assert('DartsWoundDetector: mardle triggered by donna',
  DartsWoundDetector.check('mardle', 'I spoke to donna from accounts').triggered, true);

assert('DartsWoundDetector: bristow triggered by dartitis',
  DartsWoundDetector.check('bristow', 'the dartitis was a problem').triggered, true);

assert('DartsWoundDetector: george triggered by six nil',
  DartsWoundDetector.check('george', 'the match finished six nil').triggered, true);

assert('DartsWoundDetector: george triggered by 6-0',
  DartsWoundDetector.check('george', 'the score was 6-0').triggered, true);

assert('DartsWoundDetector: taylor not triggered by six-nil',
  DartsWoundDetector.check('taylor', 'it finished six-nil').triggered, false);

assert('DartsWoundDetector: waddell triggered by passed away',
  DartsWoundDetector.check('waddell', 'sid passed away in 2012').triggered, true);

assert('DartsWoundDetector: case-insensitive - bristow DARTITIS',
  DartsWoundDetector.check('bristow', 'everyone knows about the DARTITIS').triggered, true);

assert('DartsWoundDetector: returns boolean triggered',
  typeof DartsWoundDetector.check('mardle', 'test').triggered, 'boolean');

assert('DartsWoundDetector: studd triggered by magnifico',
  DartsWoundDetector.check('studd', 'is that all he can say, magnifico').triggered, true);

assert('DartsWoundDetector: studd triggered by dave clark',
  DartsWoundDetector.check('studd', 'dave clark would have called that differently').triggered, true);

assert('DartsWoundDetector: studd not triggered by unrelated text',
  DartsWoundDetector.check('studd', 'great dart, nine-darter on the way').triggered, false);

assert('DartsWoundDetector: pyke triggered by minehead',
  DartsWoundDetector.check('pyke', 'they moved the whole thing to minehead').triggered, true);

assert('DartsWoundDetector: pyke triggered by nobody watches',
  DartsWoundDetector.check('pyke', 'nobody watches the bdo these days').triggered, true);

assert('DartsWoundDetector: pyke not triggered by unrelated text',
  DartsWoundDetector.check('pyke', 'great finish on double top').triggered, false);

// ── makeWoundDetector() ───────────────────────────────────────────────────────

assert('makeWoundDetector: returns object with check function',
  typeof makeWoundDetector({}).check, 'function');

assert('makeWoundDetector: custom detector - triggered true for known word',
  makeWoundDetector({ sam: ['leapt'] }).check('sam', 'he leapt in').triggered, true);

assert('makeWoundDetector: custom detector - triggered false for unknown word',
  makeWoundDetector({ sam: ['leapt'] }).check('sam', 'hello').triggered, false);

assert('makeWoundDetector: custom detector - unknown character returns false',
  makeWoundDetector({ sam: ['leapt'] }).check('al', 'leapt').triggered, false);

assert('makeWoundDetector: custom detector - returns matching word',
  makeWoundDetector({ sam: ['leapt'] }).check('sam', 'he leapt in').word, 'leapt');

assert('makeWoundDetector: custom detector - multiple wound words, first match returned',
  makeWoundDetector({ sam: ['leapt', 'quantum'] }).check('sam', 'quantum leap').triggered, true);

assert('makeWoundDetector: empty wound data - always returns false',
  makeWoundDetector({}).check('anyone', 'anything').triggered, false);

// ── DartsVoiceFmt — each entry must be a callable formatter function ──────────
// Bug: DARTS_VOICE_FMT had plain strings. buildBlock called them as functions → TypeError.
// Fix: strings replaced with formatter functions. These tests guard against regression.

const DARTS_CHAR_IDS = ['mardle','bristow','taylor','lowe','george','waddell','part','studd','pyke'];

DARTS_CHAR_IDS.forEach(id => {
  assert(`DartsVoiceFmt.${id} is a function`, typeof DartsVoiceFmt[id], 'function');
});

const _mockNn = [{ id: 'mardle', name: 'Wayne', stance: { temperature: 'cooling', trigger: 'not addressed turn 1' } }];
const _mockCs = { woundActivated: false, debtLedger: { owed: [], owes: [] } };

DARTS_CHAR_IDS.forEach(id => {
  const result = DartsVoiceFmt[id](_mockNn, _mockCs, [], [], 1);
  assert(`DartsVoiceFmt.${id} returns a string when called with non-neutral state`, typeof result, 'string');
});

assert('dartsBuildBlock: returns non-empty string for waddell with cooling state',
  typeof dartsBuildBlock('waddell', [{ id: 'mardle', name: 'Wayne', stance: { temperature: 'cooling', trigger: 'test' } }], false), 'string');

assert('dartsBuildBlock: returns empty string when no notable state',
  dartsBuildBlock('waddell', [], false), '');

assert('dartsBuildBlock: returns non-empty string when wound is active',
  typeof dartsBuildBlock('waddell', [], true), 'string');

// ── PremonitionEngine — affinities, eligibility, resolution ──────────────────

// COLLECTIVE_CALL minimum
assert('COLLECTIVE_CALL_MINIMUM is 3', COLLECTIVE_CALL_MINIMUM, 3);

// premonitionEligible — mode: premonition
assert('premonitionEligible: waddell premonition → true',  premonitionEligible('waddell', 'premonition'), true);
assert('premonitionEligible: george premonition → true',   premonitionEligible('george',  'premonition'), true);
assert('premonitionEligible: mardle premonition → true',   premonitionEligible('mardle',  'premonition'), true);
assert('premonitionEligible: lowe premonition → false',    premonitionEligible('lowe',    'premonition'), false);
assert('premonitionEligible: part premonition → false',    premonitionEligible('part',    'premonition'), false);

// premonitionEligible — mode: prediction
assert('premonitionEligible: lowe prediction → true',      premonitionEligible('lowe',    'prediction'),  true);
assert('premonitionEligible: part prediction → true',      premonitionEligible('part',    'prediction'),  true);
assert('premonitionEligible: studd prediction → true',     premonitionEligible('studd',   'prediction'),  true);
assert('premonitionEligible: waddell prediction → false',  premonitionEligible('waddell', 'prediction'),  false);

// premonitionEligible — mode: running_commentary
assert('premonitionEligible: mardle running_commentary → true',   premonitionEligible('mardle',  'running_commentary'), true);
assert('premonitionEligible: waddell running_commentary → true',  premonitionEligible('waddell', 'running_commentary'), true);
assert('premonitionEligible: lowe running_commentary → false',    premonitionEligible('lowe',    'running_commentary'), false);

// premonitionEligible — mode: retrospective_call
assert('premonitionEligible: george retrospective_call → true',  premonitionEligible('george',  'retrospective_call'), true);
assert('premonitionEligible: studd retrospective_call → false',  premonitionEligible('studd',   'retrospective_call'), false);
assert('premonitionEligible: lowe retrospective_call → false',   premonitionEligible('lowe',    'retrospective_call'), false);

// premonitionEligible — mode: collective_call
assert('premonitionEligible: george collective_call → true',   premonitionEligible('george',  'collective_call'), true);
assert('premonitionEligible: waddell collective_call → true',  premonitionEligible('waddell', 'collective_call'), true);
assert('premonitionEligible: lowe collective_call → false',    premonitionEligible('lowe',    'collective_call'), false);
assert('premonitionEligible: studd collective_call → false',   premonitionEligible('studd',   'collective_call'), false);

// isPremonitionTruthTeller
assert('isPremonitionTruthTeller: lowe → true',    isPremonitionTruthTeller('lowe'),    true);
assert('isPremonitionTruthTeller: part → true',    isPremonitionTruthTeller('part'),    true);
assert('isPremonitionTruthTeller: studd → true',   isPremonitionTruthTeller('studd'),   true);
assert('isPremonitionTruthTeller: waddell → false', isPremonitionTruthTeller('waddell'), false);
assert('isPremonitionTruthTeller: george → false',  isPremonitionTruthTeller('george'),  false);
assert('isPremonitionTruthTeller: mardle → false',  isPremonitionTruthTeller('mardle'),  false);

// resolvePremonitionCommits — CHECKOUT_HIT resolves CHECKOUT_OPPORTUNITY as GLORY
(function() {
  const ledger = blankPremonitionLedger();
  ledger.commits.push({ speakerId: 'waddell', mode: 'PREMONITION', momentType: 'CHECKOUT_OPPORTUNITY', resolved: false });
  resolvePremonitionCommits('CHECKOUT_HIT', ledger);
  assert('resolvePremonitionCommits: CHECKOUT_HIT → CHECKOUT_OPPORTUNITY → GLORY', ledger.aftermath['waddell'], 'GLORY');
  assert('resolvePremonitionCommits: CHECKOUT_HIT → commit marked resolved', ledger.commits[0].resolved, true);
})();

// resolvePremonitionCommits — CHECKOUT_HIT resolves BIG_FISH as GLORY
(function() {
  const ledger = blankPremonitionLedger();
  ledger.commits.push({ speakerId: 'mardle', mode: 'PREMONITION', momentType: 'BIG_FISH', resolved: false });
  resolvePremonitionCommits('CHECKOUT_HIT', ledger);
  assert('resolvePremonitionCommits: CHECKOUT_HIT → BIG_FISH → GLORY', ledger.aftermath['mardle'], 'GLORY');
})();

// resolvePremonitionCommits — CHECKOUT_MISS resolves CHECKOUT_OPPORTUNITY as HAUNTED
(function() {
  const ledger = blankPremonitionLedger();
  ledger.commits.push({ speakerId: 'george', mode: 'PREMONITION', momentType: 'CHECKOUT_OPPORTUNITY', resolved: false });
  resolvePremonitionCommits('CHECKOUT_MISS', ledger);
  assert('resolvePremonitionCommits: CHECKOUT_MISS → CHECKOUT_OPPORTUNITY → HAUNTED', ledger.aftermath['george'], 'HAUNTED');
})();

// resolvePremonitionCommits — CHECKOUT_MISS resolves NINE_DARTER_POSSIBLE as HAUNTED
(function() {
  const ledger = blankPremonitionLedger();
  ledger.commits.push({ speakerId: 'waddell', mode: 'RUNNING_COMMENTARY', momentType: 'NINE_DARTER_POSSIBLE', resolved: false });
  resolvePremonitionCommits('CHECKOUT_MISS', ledger);
  assert('resolvePremonitionCommits: CHECKOUT_MISS → NINE_DARTER_POSSIBLE → HAUNTED', ledger.aftermath['waddell'], 'HAUNTED');
})();

// resolvePremonitionCommits — LEG_WON resolves LEG_WON commit as GLORY
(function() {
  const ledger = blankPremonitionLedger();
  ledger.commits.push({ speakerId: 'bristow', mode: 'PREMONITION', momentType: 'LEG_WON', resolved: false });
  resolvePremonitionCommits('LEG_WON', ledger);
  assert('resolvePremonitionCommits: LEG_WON → LEG_WON → GLORY', ledger.aftermath['bristow'], 'GLORY');
})();

// resolvePremonitionCommits — MATCH_WON resolves SET_WON commit as GLORY (supersedes)
(function() {
  const ledger = blankPremonitionLedger();
  ledger.commits.push({ speakerId: 'taylor', mode: 'PREMONITION', momentType: 'SET_WON', resolved: false });
  resolvePremonitionCommits('MATCH_WON', ledger);
  assert('resolvePremonitionCommits: MATCH_WON → SET_WON → GLORY', ledger.aftermath['taylor'], 'GLORY');
})();

// resolvePremonitionCommits — unmatched commit is not resolved
(function() {
  const ledger = blankPremonitionLedger();
  ledger.commits.push({ speakerId: 'lowe', mode: 'PREDICTION', momentType: 'BIG_FISH', resolved: false });
  resolvePremonitionCommits('LEG_WON', ledger);
  assert('resolvePremonitionCommits: BIG_FISH commit not resolved by LEG_WON', ledger.commits[0].resolved, false);
  assert('resolvePremonitionCommits: no aftermath for unresolved commit', ledger.aftermath['lowe'], undefined);
})();

// resolvePremonitionCommits — RC holder resolves on CHECKOUT_HIT
(function() {
  const ledger = blankPremonitionLedger();
  ledger.rcHolder = 'mardle';
  resolvePremonitionCommits('CHECKOUT_HIT', ledger);
  assert('resolvePremonitionCommits: RC holder GLORY on CHECKOUT_HIT', ledger.aftermath['mardle'], 'GLORY');
  assert('resolvePremonitionCommits: rcHolder cleared after resolution', ledger.rcHolder, null);
})();

// resolvePremonitionCommits — RC holder HAUNTED on CHECKOUT_MISS
(function() {
  const ledger = blankPremonitionLedger();
  ledger.rcHolder = 'waddell';
  resolvePremonitionCommits('CHECKOUT_MISS', ledger);
  assert('resolvePremonitionCommits: RC holder HAUNTED on CHECKOUT_MISS', ledger.aftermath['waddell'], 'HAUNTED');
})();

// assignPremonitionRC — assigns highest running_commentary affinity in draw
(function() {
  const draw = ['lowe', 'mardle', 'george', 'bristow', 'taylor'];
  const ledger = blankPremonitionLedger();
  assignPremonitionRC(draw, 'NINE_DARTER_POSSIBLE', ledger);
  assert('assignPremonitionRC: mardle gets RC (highest running_commentary in draw)', ledger.rcHolder, 'mardle');
})();

// assignPremonitionRC — waddell wins if in draw (0.70 > mardle 0.80... wait mardle is 0.80)
(function() {
  const draw = ['waddell', 'lowe', 'george', 'bristow', 'taylor'];
  const ledger = blankPremonitionLedger();
  assignPremonitionRC(draw, 'NINE_DARTER_POSSIBLE', ledger);
  assert('assignPremonitionRC: waddell gets RC when mardle not in draw', ledger.rcHolder, 'waddell');
})();

// assignPremonitionRC — no assignment for non-nine-darter moment
(function() {
  const draw = ['mardle', 'waddell', 'george'];
  const ledger = blankPremonitionLedger();
  assignPremonitionRC(draw, 'CHECKOUT_OPPORTUNITY', ledger);
  assert('assignPremonitionRC: no RC assigned for non-nine-darter moment', ledger.rcHolder, null);
})();

// assignPremonitionRC — does not override existing holder
(function() {
  const draw = ['mardle', 'waddell', 'george'];
  const ledger = blankPremonitionLedger();
  ledger.rcHolder = 'george';
  assignPremonitionRC(draw, 'NINE_DARTER_POSSIBLE', ledger);
  assert('assignPremonitionRC: does not override existing rcHolder', ledger.rcHolder, 'george');
})();

// blankPremonitionLedger — structure
(function() {
  const l = blankPremonitionLedger();
  assert('blankPremonitionLedger: commits is empty array',    Array.isArray(l.commits),            true);
  assert('blankPremonitionLedger: aftermath is empty object', typeof l.aftermath,                   'object');
  assert('blankPremonitionLedger: rcHolder is null',          l.rcHolder,                           null);
})();

// ── detectIntellectualAttempt ─────────────────────────────────────────────────

assert('detectIntellectualAttempt: "irony" → ATTEMPT_IRONY',
  detectIntellectualAttempt('the irony of this is remarkable'), 'ATTEMPT_IRONY');

assert('detectIntellectualAttempt: "ironic" → ATTEMPT_IRONY',
  detectIntellectualAttempt('that is quite ironic'), 'ATTEMPT_IRONY');

assert('detectIntellectualAttempt: "ironically" → ATTEMPT_IRONY',
  detectIntellectualAttempt('ironically, it worked'), 'ATTEMPT_IRONY');

assert('detectIntellectualAttempt: "literally" → ATTEMPT_LITERALLY',
  detectIntellectualAttempt('he literally flew down the wing'), 'ATTEMPT_LITERALLY');

assert('detectIntellectualAttempt: "tautology" → ATTEMPT_TAUTOLOGY',
  detectIntellectualAttempt('that is a tautology'), 'ATTEMPT_TAUTOLOGY');

assert('detectIntellectualAttempt: "oxymoron" → ATTEMPT_OXYMORON',
  detectIntellectualAttempt('bit of an oxymoron'), 'ATTEMPT_OXYMORON');

assert('detectIntellectualAttempt: "metaphor" → ATTEMPT_METAPHOR',
  detectIntellectualAttempt('to use a metaphor'), 'ATTEMPT_METAPHOR');

assert('detectIntellectualAttempt: "paradox" → ATTEMPT_PARADOX',
  detectIntellectualAttempt('there is a paradox here'), 'ATTEMPT_PARADOX');

assert('detectIntellectualAttempt: "quantum" → ATTEMPT_ERUDITION',
  detectIntellectualAttempt('very quantum this'), 'ATTEMPT_ERUDITION');

assert('detectIntellectualAttempt: "Schrödinger" → ATTEMPT_ERUDITION',
  detectIntellectualAttempt("it's Schrödinger's situation"), 'ATTEMPT_ERUDITION');

assert('detectIntellectualAttempt: "Heisenberg" → ATTEMPT_ERUDITION',
  detectIntellectualAttempt('Heisenberg would have something to say'), 'ATTEMPT_ERUDITION');

assert('detectIntellectualAttempt: "Occam" → ATTEMPT_ERUDITION',
  detectIntellectualAttempt("Occam's razor applies here"), 'ATTEMPT_ERUDITION');

assert('detectIntellectualAttempt: no keyword → null',
  detectIntellectualAttempt('he played well in the second half'), null);

assert('detectIntellectualAttempt: empty string → null',
  detectIntellectualAttempt(''), null);

assert('detectIntellectualAttempt: case-insensitive — "LITERALLY" → ATTEMPT_LITERALLY',
  detectIntellectualAttempt('he LITERALLY cannot stop'), 'ATTEMPT_LITERALLY');

// ── buildAttemptInstruction ───────────────────────────────────────────────────

(function() {
  const sebastianConfig = INTELLECTUAL_ATTEMPTS_CONFIG.boardroom.sebastian;
  const instruction = buildAttemptInstruction(sebastianConfig, 'ATTEMPT_IRONY');
  assert('buildAttemptInstruction: returns a non-empty string',
    typeof instruction === 'string' && instruction.length > 0, true);
  assert('buildAttemptInstruction: includes the attempt type',
    instruction.includes('ATTEMPT_IRONY'), true);
  assert('buildAttemptInstruction: includes the degree',
    instruction.includes(sebastianConfig.default_degree), true);
  assert('buildAttemptInstruction: includes the delivery',
    instruction.includes(sebastianConfig.default_delivery), true);
})();

(function() {
  const royConfig = INTELLECTUAL_ATTEMPTS_CONFIG.boardroom.roy;
  const instruction = buildAttemptInstruction(royConfig, 'ATTEMPT_TAUTOLOGY');
  assert('buildAttemptInstruction: Roy tautology includes catastrophic_miss',
    instruction.includes('catastrophic_miss'), true);
})();

// ── INTELLECTUAL_ATTEMPTS_CONFIG structure ────────────────────────────────────

assert('INTELLECTUAL_ATTEMPTS_CONFIG: boardroom panel exists',
  typeof INTELLECTUAL_ATTEMPTS_CONFIG.boardroom, 'object');

assert('INTELLECTUAL_ATTEMPTS_CONFIG: comedyroom panel exists',
  typeof INTELLECTUAL_ATTEMPTS_CONFIG.comedyroom, 'object');

assert('INTELLECTUAL_ATTEMPTS_CONFIG: golf panel exists',
  typeof INTELLECTUAL_ATTEMPTS_CONFIG.golf, 'object');

['sebastian', 'roy', 'partridge', 'cox', 'mystic', 'harold'].forEach(id => {
  const cfg = INTELLECTUAL_ATTEMPTS_CONFIG.boardroom[id];
  assert(`INTELLECTUAL_ATTEMPTS_CONFIG: boardroom.${id} has types array`,
    Array.isArray(cfg && cfg.types), true);
  assert(`INTELLECTUAL_ATTEMPTS_CONFIG: boardroom.${id} has default_degree`,
    typeof (cfg && cfg.default_degree), 'string');
  assert(`INTELLECTUAL_ATTEMPTS_CONFIG: boardroom.${id} has default_delivery`,
    typeof (cfg && cfg.default_delivery), 'string');
});

// ── Quntum Leeks engine ──────────────────────────────────────────────────────

const {
  QUNTUM_LEEKS_SCENARIOS,
  initState,
  pickRandomScenario,
  betLeekiness,
  spendLeekiness,
  processTurnEffects,
  buildModifiers,
} = require('../src/logic/quntum-leeks-engine.js');

// Group A: data structure
const REQUIRED_FIELDS = ['name', 'period', 'host', 'mirror', 'situation', 'al_note', 'object', 'leap_questions', 'characters'];
const scenarioKeys = Object.keys(QUNTUM_LEEKS_SCENARIOS);

assert('QUNTUM_LEEKS_SCENARIOS: at least 10 scenarios', scenarioKeys.length >= 10, true);

scenarioKeys.forEach(key => {
  REQUIRED_FIELDS.forEach(field => {
    assert(`QUNTUM_LEEKS_SCENARIOS.${key}: has field "${field}"`,
      typeof QUNTUM_LEEKS_SCENARIOS[key][field], 'string');
  });
});

// Group A: random selection
for (let i = 0; i < 20; i++) {
  const picked = pickRandomScenario();
  assert(`pickRandomScenario: result "${picked}" is a valid key`,
    scenarioKeys.includes(picked), true);
}

// Group B: initState defaults
const s0 = initState();
assert('initState: history is empty array', Array.isArray(s0.history) && s0.history.length === 0, true);
assert('initState: turnCount is 0', s0.turnCount, 0);
assert('initState: leaped is false', s0.leaped, false);
assert('initState: probability is 50', s0.probability, 50);
assert('initState: samDamage is 0', s0.samDamage, 0);
assert('initState: samStats.truthiness is 70', s0.samStats.truthiness, 70);
assert('initState: samStats.bottiness is 60', s0.samStats.bottiness, 60);
assert('initState: samStats.leekiness is 3', s0.samStats.leekiness, 3);
assert('initState: samStats.swissCheeseLevel is 20', s0.samStats.swissCheeseLevel, 20);
assert('initState: leekinessSpend is false', s0.leekinessSpend, false);
assert('initState: leekinessBet is 0', s0.leekinessBet, 0);
assert('initState: selectedZiggyOpt is -1', s0.selectedZiggyOpt, -1);

// Group C: betLeekiness
const sb1 = initState();
sb1.samStats.leekiness = 3;
const r1 = betLeekiness(sb1, 2);
assert('betLeekiness: returns true when accepted', r1, true);
assert('betLeekiness: deducts leekiness', sb1.samStats.leekiness, 1);
assert('betLeekiness: sets leekinessBet', sb1.leekinessBet, 2);

const sb2 = initState();
sb2.samStats.leekiness = 3;
betLeekiness(sb2, 5);
assert('betLeekiness: capped at 3', sb2.leekinessBet, 3);

const sb3 = initState();
sb3.samStats.leekiness = 1;
const r3 = betLeekiness(sb3, 2);
assert('betLeekiness: rejected when insufficient — returns false', r3, false);
assert('betLeekiness: rejected — leekinessBet stays 0', sb3.leekinessBet, 0);
assert('betLeekiness: rejected — leekiness unchanged', sb3.samStats.leekiness, 1);

const ss1 = initState();
ss1.samStats.leekiness = 2;
spendLeekiness(ss1);
assert('spendLeekiness: sets flag when leekiness > 0', ss1.leekinessSpend, true);
assert('spendLeekiness: decrements leekiness', ss1.samStats.leekiness, 1);

const ss2 = initState();
ss2.samStats.leekiness = 0;
spendLeekiness(ss2);
assert('spendLeekiness: no-op when leekiness is 0', ss2.leekinessSpend, false);
assert('spendLeekiness: leekiness unchanged at 0', ss2.samStats.leekiness, 0);

// Group D: processTurnEffects
const pt1 = initState();
pt1.probability = 50; pt1.prevProbability = 50; pt1.samStats.leekiness = 3;
processTurnEffects(pt1, { probability: 60 }, false);
assert('processTurnEffects: prob increase awards leekiness', pt1.samStats.leekiness, 4);

const pt2 = initState();
pt2.probability = 70; pt2.prevProbability = 70; pt2.samDamage = 0;
processTurnEffects(pt2, { probability: 55 }, false);
assert('processTurnEffects: drop >10 increases samDamage', pt2.samDamage, 1);

const pt3 = initState();
pt3.probability = 70; pt3.prevProbability = 70; pt3.samDamage = 0;
processTurnEffects(pt3, { probability: 60 }, false);
assert('processTurnEffects: drop of exactly 10 does not increase samDamage', pt3.samDamage, 0);

const pt4 = initState();
pt4.samStats.swissCheeseLevel = 40; pt4.samStats.truthiness = 70; pt4.selectedZiggyOpt = 0;
pt4.prevProbability = 50;
processTurnEffects(pt4, { probability: 50 }, false);
assert('processTurnEffects: accurate Ziggy advice reduces swissCheeseLevel by 2', pt4.samStats.swissCheeseLevel, 38);

const pt5 = initState();
pt5.samStats.swissCheeseLevel = 80; pt5.prevProbability = 50;
processTurnEffects(pt5, { probability: 50 }, false);
assert('processTurnEffects: swissCheese>=80 activates deathcap', pt5.deathcapActive, true);

const pt6 = initState();
pt6.leekinessSpend = true; pt6.leekinessBet = 2; pt6.selectedZiggyOpt = 1; pt6.prevProbability = 50;
processTurnEffects(pt6, { probability: 50 }, false);
assert('processTurnEffects: resets leekinessSpend', pt6.leekinessSpend, false);
assert('processTurnEffects: resets leekinessBet', pt6.leekinessBet, 0);
assert('processTurnEffects: resets selectedZiggyOpt', pt6.selectedZiggyOpt, -1);

assert('processTurnEffects: no-op on first turn (isFirst=true)', (() => {
  const st = initState(); st.samDamage = 0; st.prevProbability = 70;
  processTurnEffects(st, { probability: 10 }, true);
  return st.samDamage;
})(), 0);

// Group E: buildModifiers
const bm0 = initState();
assert('buildModifiers: clean state returns empty string', buildModifiers(bm0), '');

const bm1 = initState();
bm1.leekinessSpend = true;
assert('buildModifiers: leekinessSpend includes "pushing his luck"',
  buildModifiers(bm1).includes('pushing his luck'), true);

const bm2 = initState();
bm2.leekinessBet = 2;
assert('buildModifiers: leekinessBet includes "2 Leekiness points"',
  buildModifiers(bm2).includes('2 Leekiness points'), true);

const bm3 = initState();
bm3.samStats.swissCheeseLevel = 85;
assert('buildModifiers: swissCheese>=80 includes "DEATHCAP MODE ACTIVE"',
  buildModifiers(bm3).includes('DEATHCAP MODE ACTIVE'), true);

const bm4 = initState();
bm4.samDamage = 4;
assert('buildModifiers: samDamage>=4 includes "4 damage events"',
  buildModifiers(bm4).includes('4 damage events'), true);

// ── IntellectualAttempts defensive guard ─────────────────────────────────────

function _makeIAModule(engine) {
  const eng = (engine !== null && engine !== undefined) ? engine : null;
  return {
    detect: eng ? eng.detectIntellectualAttempt : () => null,
    inject: eng ? eng.inject : (_panel, _id, systemPrompt) => systemPrompt,
  };
}

assert('IA guard: detect returns null when engine is absent',
  _makeIAModule(null).detect('something ironic'), null);

assert('IA guard: inject returns prompt unchanged when engine is absent',
  _makeIAModule(null).inject('golf', 'faldo', 'You are Faldo.'), 'You are Faldo.');

assert('IA guard: detect delegates to engine when present',
  _makeIAModule({ detectIntellectualAttempt: () => 'ATTEMPT_IRONY', inject: () => {} }).detect('test'),
  'ATTEMPT_IRONY');

assert('IA guard: inject delegates to engine when present',
  _makeIAModule({ detectIntellectualAttempt: () => null, inject: (_p, _id, s) => s + '[INJECTED]' })
    .inject('golf', 'faldo', 'prompt'),
  'prompt[INJECTED]');

// ─── Souness's Cat — PRE_EXISTING relationship seeds ───────────────────────

assert('SC PRE_EXISTING: all 15 pairs present',
  Object.keys(SOUNESS_CAT_PRE_EXISTING).length, 15);

assert('SC PRE_EXISTING: all pairs have tone and note',
  allPairsHaveToneAndNote(SOUNESS_CAT_PRE_EXISTING, SOUNESS_CAT_IDS), true);

assert('SC PRE_EXISTING: feynman-hawking tone is rivalry',
  getPairTone(SOUNESS_CAT_PRE_EXISTING, 'feynman', 'hawking'), 'rivalry');

assert('SC PRE_EXISTING: feynman-franklin tone is respect',
  getPairTone(SOUNESS_CAT_PRE_EXISTING, 'feynman', 'franklin'), 'respect');

assert('SC PRE_EXISTING: feynman-turing tone is kinship',
  getPairTone(SOUNESS_CAT_PRE_EXISTING, 'feynman', 'turing'), 'kinship');

assert('SC PRE_EXISTING: feynman-darwin tone is warmth',
  getPairTone(SOUNESS_CAT_PRE_EXISTING, 'feynman', 'darwin'), 'warmth');

assert('SC PRE_EXISTING: franklin-turing tone is solidarity',
  getPairTone(SOUNESS_CAT_PRE_EXISTING, 'franklin', 'turing'), 'solidarity');

assert('SC PRE_EXISTING: franklin-darwin tone is contempt',
  getPairTone(SOUNESS_CAT_PRE_EXISTING, 'franklin', 'darwin'), 'contempt');

assert('SC PRE_EXISTING: darwin-hawking tone is kinship',
  getPairTone(SOUNESS_CAT_PRE_EXISTING, 'darwin', 'hawking'), 'kinship');

assert('SC PRE_EXISTING: hawking-turing tone is attraction',
  getPairTone(SOUNESS_CAT_PRE_EXISTING, 'hawking', 'turing'), 'attraction');

assert('SC PRE_EXISTING: hawking-turing attraction is symmetrical',
  pairToneIsSymmetrical(SOUNESS_CAT_PRE_EXISTING, 'hawking', 'turing'), true);

assert('SC PRE_EXISTING: tesla has no warmth solidarity or kinship seeds',
  teslaHasNoWarmOrSolidary(SOUNESS_CAT_PRE_EXISTING), true);

assert('SC PRE_EXISTING: no conflicting directional tones',
  noConflictingTones(SOUNESS_CAT_PRE_EXISTING), true);

assert('SC PRE_EXISTING: SOUNESS_CAT_IDS contains exactly 6 members',
  SOUNESS_CAT_IDS.length, 6);

assert('SC PRE_EXISTING: getAllPairs returns 15 pairs for 6 members',
  getAllPairs(SOUNESS_CAT_IDS).length, 15);

assert('SC PRE_EXISTING: getPairTone is direction-agnostic',
  getPairTone(SOUNESS_CAT_PRE_EXISTING, 'turing', 'hawking'), 'attraction');

// ── CONSEQUENCE_TIERS ─────────────────────────────────────────────────────────

assert('CONSEQUENCE_TIERS: has exactly 4 tiers',
  Object.keys(CONSEQUENCE_TIERS).length, 4);

assert('CONSEQUENCE_TIERS: LOW penalty thresholdMod is 1',
  CONSEQUENCE_TIERS.LOW.penalty.thresholdMod, 1);

assert('CONSEQUENCE_TIERS: LOW penalty holes is 1',
  CONSEQUENCE_TIERS.LOW.penalty.holes, 1);

assert('CONSEQUENCE_TIERS: MED penalty thresholdMod is 2',
  CONSEQUENCE_TIERS.MED.penalty.thresholdMod, 2);

assert('CONSEQUENCE_TIERS: MED penalty holes is 2',
  CONSEQUENCE_TIERS.MED.penalty.holes, 2);

assert('CONSEQUENCE_TIERS: HIGH penalty thresholdMod is 3',
  CONSEQUENCE_TIERS.HIGH.penalty.thresholdMod, 3);

assert('CONSEQUENCE_TIERS: HIGH penalty holes is 3',
  CONSEQUENCE_TIERS.HIGH.penalty.holes, 3);

assert('CONSEQUENCE_TIERS: NUTS penalty thresholdMod is 4',
  CONSEQUENCE_TIERS.NUTS.penalty.thresholdMod, 4);

assert('CONSEQUENCE_TIERS: NUTS penalty holes is 4',
  CONSEQUENCE_TIERS.NUTS.penalty.holes, 4);

assert('CONSEQUENCE_TIERS: LOW bonus thresholdMod is -1',
  CONSEQUENCE_TIERS.LOW.bonus.thresholdMod, -1);

assert('CONSEQUENCE_TIERS: LOW bonus holes is 1',
  CONSEQUENCE_TIERS.LOW.bonus.holes, 1);

assert('CONSEQUENCE_TIERS: MED bonus has fortune true',
  CONSEQUENCE_TIERS.MED.bonus.fortune, true);

assert('CONSEQUENCE_TIERS: HIGH bonus composure is 2',
  CONSEQUENCE_TIERS.HIGH.bonus.composure, 2);

assert('CONSEQUENCE_TIERS: NUTS bonus composure is 2',
  CONSEQUENCE_TIERS.NUTS.bonus.composure, 2);

assert('CONSEQUENCE_TIERS: NUTS bonus has fortune true',
  CONSEQUENCE_TIERS.NUTS.bonus.fortune, true);

// ── applyConsequence ──────────────────────────────────────────────────────────

const baseState = () => ({ tempThresholdMod: 0, tempThresholdHoles: 0, fortuneActive: false, composure: 7 });

assert('applyConsequence: LOW penalty sets thresholdMod to 1',
  applyConsequence({ result: 'consequence', tier: 'LOW', direction: 'penalty' }, baseState()).tempThresholdMod, 1);

assert('applyConsequence: LOW penalty sets thresholdHoles to 1',
  applyConsequence({ result: 'consequence', tier: 'LOW', direction: 'penalty' }, baseState()).tempThresholdHoles, 1);

assert('applyConsequence: MED penalty sets thresholdMod to 2',
  applyConsequence({ result: 'consequence', tier: 'MED', direction: 'penalty' }, baseState()).tempThresholdMod, 2);

assert('applyConsequence: MED penalty sets thresholdHoles to 2',
  applyConsequence({ result: 'consequence', tier: 'MED', direction: 'penalty' }, baseState()).tempThresholdHoles, 2);

assert('applyConsequence: HIGH penalty sets thresholdMod to 3',
  applyConsequence({ result: 'consequence', tier: 'HIGH', direction: 'penalty' }, baseState()).tempThresholdMod, 3);

assert('applyConsequence: HIGH penalty sets thresholdHoles to 3',
  applyConsequence({ result: 'consequence', tier: 'HIGH', direction: 'penalty' }, baseState()).tempThresholdHoles, 3);

assert('applyConsequence: NUTS penalty sets thresholdMod to 4',
  applyConsequence({ result: 'consequence', tier: 'NUTS', direction: 'penalty' }, baseState()).tempThresholdMod, 4);

assert('applyConsequence: NUTS penalty sets thresholdHoles to 4',
  applyConsequence({ result: 'consequence', tier: 'NUTS', direction: 'penalty' }, baseState()).tempThresholdHoles, 4);

assert('applyConsequence: LOW bonus sets thresholdMod to -1',
  applyConsequence({ result: 'consequence', tier: 'LOW', direction: 'bonus' }, baseState()).tempThresholdMod, -1);

assert('applyConsequence: LOW bonus sets thresholdHoles to 1',
  applyConsequence({ result: 'consequence', tier: 'LOW', direction: 'bonus' }, baseState()).tempThresholdHoles, 1);

assert('applyConsequence: MED bonus activates fortune',
  applyConsequence({ result: 'consequence', tier: 'MED', direction: 'bonus' }, baseState()).fortuneActive, true);

assert('applyConsequence: HIGH bonus raises composure by 2',
  applyConsequence({ result: 'consequence', tier: 'HIGH', direction: 'bonus' }, baseState()).composure, 9);

assert('applyConsequence: HIGH bonus does not exceed composure 10',
  applyConsequence({ result: 'consequence', tier: 'HIGH', direction: 'bonus' }, { ...baseState(), composure: 10 }).composure, 10);

assert('applyConsequence: NUTS bonus raises composure by 2',
  applyConsequence({ result: 'consequence', tier: 'NUTS', direction: 'bonus' }, baseState()).composure, 9);

assert('applyConsequence: NUTS bonus activates fortune',
  applyConsequence({ result: 'consequence', tier: 'NUTS', direction: 'bonus' }, baseState()).fortuneActive, true);

assert('applyConsequence: does not mutate original state object',
  (() => { const s = baseState(); applyConsequence({ result: 'consequence', tier: 'LOW', direction: 'penalty' }, s); return s.tempThresholdMod; })(), 0);

let threwOnBadTier = false;
try { applyConsequence({ result: 'consequence', tier: 'EXTREME', direction: 'penalty' }, baseState()); }
catch (e) { threwOnBadTier = true; }
assert('applyConsequence: throws on unknown tier', threwOnBadTier, true);

let threwOnBadDir = false;
try { applyConsequence({ result: 'consequence', tier: 'LOW', direction: 'sideways' }, baseState()); }
catch (e) { threwOnBadDir = true; }
assert('applyConsequence: throws on unknown direction', threwOnBadDir, true);

// ── MARSHALS_BELT_EVENT ───────────────────────────────────────────────────────

assert('MARSHALS_BELT_EVENT: id is marshals_belt',
  MARSHALS_BELT_EVENT.id, 'marshals_belt');

assert('MARSHALS_BELT_EVENT: has at least 1 choice',
  MARSHALS_BELT_EVENT.choices.length >= 1, true);

assert('MARSHALS_BELT_EVENT: no outcome has result nothing',
  MARSHALS_BELT_EVENT.choices.every(c => c.outcomes.every(o => o.result !== 'nothing')), true);

assert('MARSHALS_BELT_EVENT: all outcomes have result consequence',
  MARSHALS_BELT_EVENT.choices.every(c => c.outcomes.every(o => o.result === 'consequence')), true);

assert('MARSHALS_BELT_EVENT: all consequence outcomes have a valid tier',
  MARSHALS_BELT_EVENT.choices.every(c => c.outcomes.every(o => ['LOW','MED','HIGH','NUTS'].includes(o.tier))), true);

assert('MARSHALS_BELT_EVENT: all consequence outcomes have a valid direction',
  MARSHALS_BELT_EVENT.choices.every(c => c.outcomes.every(o => ['penalty','bonus'].includes(o.direction))), true);

// ── accumulatePanelStats + computeAvgDepth ───────────────────────────────────

assert('accumulatePanelStats: first run creates entry with runs 1',
  accumulatePanelStats(null, 'boardroom', 4).boardroom.runs, 1);

assert('accumulatePanelStats: first run sets totalDepth correctly',
  accumulatePanelStats(null, 'boardroom', 4).boardroom.totalDepth, 4);

assert('accumulatePanelStats: second run increments runs to 2',
  accumulatePanelStats({ boardroom: { runs: 1, totalDepth: 4 } }, 'boardroom', 6).boardroom.runs, 2);

assert('accumulatePanelStats: second run accumulates totalDepth',
  accumulatePanelStats({ boardroom: { runs: 1, totalDepth: 4 } }, 'boardroom', 6).boardroom.totalDepth, 10);

assert('accumulatePanelStats: different panels accumulate independently — boardroom',
  accumulatePanelStats(accumulatePanelStats(null, 'boardroom', 4), 'comedy', 3).boardroom.runs, 1);

assert('accumulatePanelStats: different panels accumulate independently — comedy',
  accumulatePanelStats(accumulatePanelStats(null, 'boardroom', 4), 'comedy', 3).comedy.totalDepth, 3);

assert('accumulatePanelStats: does not mutate input object',
  (() => { const s = { boardroom: { runs: 1, totalDepth: 4 } }; accumulatePanelStats(s, 'boardroom', 2); return s.boardroom.runs; })(), 1);

assert('accumulatePanelStats: accepts empty object as existing',
  accumulatePanelStats({}, 'golf', 5).golf.runs, 1);

assert('computeAvgDepth: computes average correctly',
  computeAvgDepth({ boardroom: { runs: 2, totalDepth: 10 } }, 'boardroom'), 5.0);

assert('computeAvgDepth: rounds to one decimal place',
  computeAvgDepth({ boardroom: { runs: 3, totalDepth: 10 } }, 'boardroom'), 3.3);

assert('computeAvgDepth: returns 0 for unknown panel',
  computeAvgDepth({}, 'golf'), 0.0);

assert('computeAvgDepth: returns 0 for null existing',
  computeAvgDepth(null, 'boardroom'), 0.0);

// ── WatchBack — sofa commentary ───────────────────────────────────────────────

assert('getSofaCommentator: returns commentator id when player id matches panel member',
  getSofaCommentator({ players:[{id:'andrew_coltart'},{id:'tiger_woods'}] }, ['andrew_coltart']), 'andrew_coltart');

assert('getSofaCommentator: returns null when no player matches panel members',
  getSofaCommentator({ players:[{id:'tiger_woods_standrews'},{id:'colin_montgomerie_2000'}] }, ['andrew_coltart']), null);

assert('getSofaCommentator: returns null for empty players array',
  getSofaCommentator({ players:[] }, ['andrew_coltart']), null);

assert('getSofaCommentator: returns first match when multiple panel members present',
  getSofaCommentator({ players:[{id:'andrew_coltart'},{id:'faldo_2008'}] }, ['faldo_2008','andrew_coltart']), 'faldo_2008');

assert('getHistoricalDivergence: MATCH when scores are equal',
  getHistoricalDivergence(-5, -5), 'MATCH');

assert('getHistoricalDivergence: MATCH when both zero',
  getHistoricalDivergence(0, 0), 'MATCH');

assert('getHistoricalDivergence: BETTER when player score is lower (more under par)',
  getHistoricalDivergence(-8, -5), 'BETTER');

assert('getHistoricalDivergence: SLIGHT when player is 1 worse than historical',
  getHistoricalDivergence(-4, -5), 'SLIGHT');

assert('getHistoricalDivergence: SLIGHT when player is 2 worse than historical',
  getHistoricalDivergence(-3, -5), 'SLIGHT');

assert('getHistoricalDivergence: CLEAR when player is 3 worse than historical',
  getHistoricalDivergence(-2, -5), 'CLEAR');

assert('getHistoricalDivergence: CLEAR when player is 4 worse than historical',
  getHistoricalDivergence(-1, -5), 'CLEAR');

assert('getHistoricalDivergence: EXTREME when player is 5 or more worse than historical',
  getHistoricalDivergence(0, -5), 'EXTREME');

assert('getHistoricalDivergence: EXTREME when player is 8 worse than historical',
  getHistoricalDivergence(3, -5), 'EXTREME');

assert('selectReactionMode: CONFIRMATION for MATCH',
  selectReactionMode('MATCH'), 'CONFIRMATION');

assert('selectReactionMode: ENDORSEMENT for BETTER',
  selectReactionMode('BETTER'), 'ENDORSEMENT');

assert('selectReactionMode: PERTURBED for SLIGHT',
  selectReactionMode('SLIGHT'), 'PERTURBED');

assert('selectReactionMode: BEWILDERMENT for CLEAR',
  selectReactionMode('CLEAR'), 'BEWILDERMENT');

assert('selectReactionMode: IGNORANCE for EXTREME',
  selectReactionMode('EXTREME'), 'IGNORANCE');

// ── DartsVoiceFmt — behavioral content tests ──────────────────────────────────
// Guards against content regressions in character-specific wound/hostile/non-hostile branches.

const _noState     = { woundActivated: false, debtLedger: { owed: [], owes: [] } };
const _woundState  = { woundActivated: true,  debtLedger: { owed: [], owes: [] } };
const _hostile     = [{ id: 'x', name: 'TestPlayer', stance: { temperature: 'hostile', trigger: 'test trigger' } }];
const _nonHostile  = [{ id: 'x', name: 'TestPlayer', stance: { temperature: 'cooling', trigger: 'test trigger' } }];

// All characters: empty when no notable state
DARTS_CHAR_IDS.forEach(id => {
  assert(`DartsVoiceFmt.${id} returns empty string when no notable state`,
    DartsVoiceFmt[id]([], _noState), '');
});

// mardle — "Ha —" on hostile; wound line mentions "deserved"
assert('DartsVoiceFmt.mardle: hostile branch includes "Ha —"',
  DartsVoiceFmt.mardle(_hostile, _noState).includes('Ha —'), true);
assert('DartsVoiceFmt.mardle: wound line includes "probably deserved it"',
  DartsVoiceFmt.mardle([], _woundState).includes('probably deserved it'), true);

// bristow — no "Ha —", just straight; wound line "That's a fact"
assert('DartsVoiceFmt.bristow: hostile branch does not use "Ha —"',
  DartsVoiceFmt.bristow(_hostile, _noState).includes('Ha —'), false);
assert('DartsVoiceFmt.bristow: wound line includes "That\'s a fact"',
  DartsVoiceFmt.bristow([], _woundState).includes("That's a fact"), true);

// taylor — wound mentions "I'll deal with it"
assert('DartsVoiceFmt.taylor: wound line includes "I\'ll deal with it"',
  DartsVoiceFmt.taylor([], _woundState).includes("I'll deal with it"), true);

// lowe — wound line is "(pause)"
assert('DartsVoiceFmt.lowe: wound line includes "(pause)"',
  DartsVoiceFmt.lowe([], _woundState).includes('(pause)'), true);

// george — hostile: "Oh now, look —"; wound: "Lovely, brilliant"
assert('DartsVoiceFmt.george: hostile branch includes "Oh now, look —"',
  DartsVoiceFmt.george(_hostile, _noState).includes('Oh now, look —'), true);
assert('DartsVoiceFmt.george: wound line includes "Lovely, brilliant"',
  DartsVoiceFmt.george([], _woundState).includes('Lovely, brilliant'), true);

// waddell — non-hostile ends with ". Aye."; hostile uses "Aye —"; wound: "cathedral still stands"
assert('DartsVoiceFmt.waddell: non-hostile includes ". Aye."',
  DartsVoiceFmt.waddell(_nonHostile, _noState).includes('. Aye.'), true);
assert('DartsVoiceFmt.waddell: hostile branch includes "Aye —"',
  DartsVoiceFmt.waddell(_hostile, _noState).includes('Aye —'), true);
assert('DartsVoiceFmt.waddell: wound line includes "cathedral still stands"',
  DartsVoiceFmt.waddell([], _woundState).includes('cathedral still stands'), true);

// part — wound: "Moving on"
assert('DartsVoiceFmt.part: wound line includes "Moving on"',
  DartsVoiceFmt.part([], _woundState).includes('Moving on'), true);

// studd — non-hostile: "Magnifico"; hostile: "And listen —"; wound: "enthusiastically"
assert('DartsVoiceFmt.studd: non-hostile includes "Magnifico"',
  DartsVoiceFmt.studd(_nonHostile, _noState).includes('Magnifico'), true);
assert('DartsVoiceFmt.studd: hostile branch includes "And listen —"',
  DartsVoiceFmt.studd(_hostile, _noState).includes('And listen —'), true);
assert('DartsVoiceFmt.studd: wound line includes "enthusiastically"',
  DartsVoiceFmt.studd([], _woundState).includes('enthusiastically'), true);

// pyke — wound: "competition continues"
assert('DartsVoiceFmt.pyke: wound line includes "competition continues"',
  DartsVoiceFmt.pyke([], _woundState).includes('competition continues'), true);

// ── GOLF_PANEL_MEMBER_IDS — structural guard ──────────────────────────────────

assert('GOLF_PANEL_MEMBER_IDS is an array',
  Array.isArray(GOLF_PANEL_MEMBER_IDS), true);

assert('GOLF_PANEL_MEMBER_IDS contains coltart_97',
  GOLF_PANEL_MEMBER_IDS.includes('coltart_97'), true);

// ── COLTART_SOFA_POOLS — structural guard ─────────────────────────────────────

assert('COLTART_SOFA_POOLS has valderrama_1997 entry',
  typeof COLTART_SOFA_POOLS.valderrama_1997, 'object');

const _vPool = COLTART_SOFA_POOLS.valderrama_1997;
['CONFIRMATION','PERTURBED','BEWILDERMENT','IGNORANCE','ENDORSEMENT'].forEach(mode => {
  assert(`COLTART_SOFA_POOLS.valderrama_1997 has ${mode} pool`,
    Array.isArray(_vPool[mode]), true);
  assert(`COLTART_SOFA_POOLS.valderrama_1997.${mode} has at least one entry`,
    _vPool[mode].length >= 1, true);
  assert(`COLTART_SOFA_POOLS.valderrama_1997.${mode}[0] is a string`,
    typeof _vPool[mode][0], 'string');
});

// ── ORACLE — validateOutwardCode ──────────────────────────────────────────────

assert('validateOutwardCode: accepts SW1A',     validateOutwardCode('SW1A'), true);
assert('validateOutwardCode: accepts LS1',      validateOutwardCode('LS1'),  true);
assert('validateOutwardCode: accepts M1',       validateOutwardCode('M1'),   true);
assert('validateOutwardCode: accepts EH1',      validateOutwardCode('EH1'),  true);
assert('validateOutwardCode: accepts BT1',      validateOutwardCode('BT1'),  true);
assert('validateOutwardCode: accepts D02',      validateOutwardCode('D02'),  true);
assert('validateOutwardCode: accepts A65',      validateOutwardCode('A65'),  true);
assert('validateOutwardCode: rejects 12345',    validateOutwardCode('12345'),   false);
assert('validateOutwardCode: rejects ABCDEFG',  validateOutwardCode('ABCDEFG'), false);
assert('validateOutwardCode: rejects empty',    validateOutwardCode(''),        false);
assert('validateOutwardCode: rejects null',     validateOutwardCode(null),      false);

// ── ORACLE — parseOutwardCode ─────────────────────────────────────────────────

assert('parseOutwardCode: full postcode returns outward code',
  parseOutwardCode('SW1A 2AA'), 'SW1A');
assert('parseOutwardCode: already outward code returned as-is',
  parseOutwardCode('LS1'), 'LS1');
assert('parseOutwardCode: lowercased input uppercased',
  parseOutwardCode('m1'), 'M1');
assert('parseOutwardCode: trims whitespace',
  parseOutwardCode('  SW1A '), 'SW1A');

// ── ORACLE — ORACLE_VOICES ────────────────────────────────────────────────────

assert('ORACLE_VOICES is an array',          Array.isArray(ORACLE_VOICES), true);
assert('ORACLE_VOICES has 8 entries',        ORACLE_VOICES.length, 8);
assert('ORACLE_VOICES contains Elegist',     ORACLE_VOICES.includes('Elegist'),    true);
assert('ORACLE_VOICES contains Rogue',       ORACLE_VOICES.includes('Rogue'),      true);
assert('ORACLE_VOICES contains DarkOracle',  ORACLE_VOICES.includes('DarkOracle'), true);
assert('ORACLE_VOICES contains Booster',     ORACLE_VOICES.includes('Booster'),    true);
assert('ORACLE_VOICES contains Snob',        ORACLE_VOICES.includes('Snob'),       true);
assert('ORACLE_VOICES contains Anarchist',   ORACLE_VOICES.includes('Anarchist'),  true);
assert('ORACLE_VOICES contains Mystic',      ORACLE_VOICES.includes('Mystic'),     true);
assert('ORACLE_VOICES contains Local',       ORACLE_VOICES.includes('Local'),      true);

// ── ORACLE — isValidOracleVoice ───────────────────────────────────────────────

assert('isValidOracleVoice: Elegist is valid',    isValidOracleVoice('Elegist'),    true);
assert('isValidOracleVoice: DarkOracle is valid', isValidOracleVoice('DarkOracle'), true);
assert('isValidOracleVoice: empty string invalid', isValidOracleVoice(''),          false);
assert('isValidOracleVoice: null invalid',         isValidOracleVoice(null),        false);
assert('isValidOracleVoice: unknown voice invalid', isValidOracleVoice('Wizard'),   false);

// ── ORACLE — canSubmitOracle ──────────────────────────────────────────────────

assert('canSubmitOracle: valid code + valid voice → true',
  canSubmitOracle('SW1A', 'Elegist'), true);
assert('canSubmitOracle: empty code → false',
  canSubmitOracle('', 'Elegist'), false);
assert('canSubmitOracle: null code → false',
  canSubmitOracle(null, 'Elegist'), false);
assert('canSubmitOracle: invalid code → false',
  canSubmitOracle('12345', 'Elegist'), false);
assert('canSubmitOracle: empty voice → false',
  canSubmitOracle('SW1A', ''), false);
assert('canSubmitOracle: null voice → false',
  canSubmitOracle('SW1A', null), false);
assert('canSubmitOracle: invalid voice → false',
  canSubmitOracle('SW1A', 'Wizard'), false);

// ── ORACLE — ORACLE_REGISTERS ─────────────────────────────────────────────────

assert('ORACLE_REGISTERS is an array',           Array.isArray(ORACLE_REGISTERS), true);
assert('ORACLE_REGISTERS has exactly 3 entries', ORACLE_REGISTERS.length, 3);
assert('ORACLE_REGISTERS contains Dignified',    ORACLE_REGISTERS.includes('Dignified'), true);
assert('ORACLE_REGISTERS contains Knowing',      ORACLE_REGISTERS.includes('Knowing'),   true);
assert('ORACLE_REGISTERS contains Unhinged',     ORACLE_REGISTERS.includes('Unhinged'),  true);

// ── ORACLE — ORACLE_CHARACTERS ────────────────────────────────────────────────

assert('ORACLE_CHARACTERS is an array',          Array.isArray(ORACLE_CHARACTERS), true);
assert('ORACLE_CHARACTERS has exactly 3 entries', ORACLE_CHARACTERS.length, 3);
assert('ORACLE_CHARACTERS contains phil',        ORACLE_CHARACTERS.includes('phil'),    true);
assert('ORACLE_CHARACTERS contains kirstie',     ORACLE_CHARACTERS.includes('kirstie'), true);
assert('ORACLE_CHARACTERS contains dion',        ORACLE_CHARACTERS.includes('dion'),    true);

// ── ORACLE — hasPhilTranslation ───────────────────────────────────────────────

assert('hasPhilTranslation: detects Phil marker phrase',
  hasPhilTranslation("what we're really talking about here is the market value"), true);
assert('hasPhilTranslation: returns false without marker',
  hasPhilTranslation("This is a lovely area with good transport links."), false);
assert('hasPhilTranslation: returns false on empty string',
  hasPhilTranslation(''), false);

// ── ORACLE — hasAllDublinDriftStages ─────────────────────────────────────────

const _fullDrift = '[BRIDGE] Location is everything [DEPARTURE] reminds me of Villa [WANDER] pie in Coventry [SUMMIT] I scored a hat-trick. Anyway. Lovely kitchen.';
const _missingWander = '[BRIDGE] Location [DEPARTURE] reminds me [SUMMIT] hat-trick.';

assert('hasAllDublinDriftStages: returns true when all four stages present',
  hasAllDublinDriftStages(_fullDrift), true);
assert('hasAllDublinDriftStages: returns false when a stage is missing',
  hasAllDublinDriftStages(_missingWander), false);
assert('hasAllDublinDriftStages: returns false on empty string',
  hasAllDublinDriftStages(''), false);

// ── Comedy Room mode switcher (BL-053) ───────────────────────────────────────
assert('COMEDY_ROOM_MODES is an array',                    Array.isArray(COMEDY_ROOM_MODES), true);
assert('COMEDY_ROOM_MODES has exactly 2 entries',          COMEDY_ROOM_MODES.length, 2);
assert('COMEDY_ROOM_MODES contains into-the-room',         COMEDY_ROOM_MODES.includes('into-the-room'), true);
assert('COMEDY_ROOM_MODES contains house-name-oracle',     COMEDY_ROOM_MODES.includes('house-name-oracle'), true);

assert('COMEDY_MODE_LABELS Into The Room',                 COMEDY_MODE_LABELS['into-the-room'], 'Into The Room');
assert('COMEDY_MODE_LABELS The House Name Oracle',         COMEDY_MODE_LABELS['house-name-oracle'], 'The House Name Oracle');

assert('getDefaultComedyMode returns into-the-room',       getDefaultComedyMode(), 'into-the-room');

assert('isValidComedyMode: into-the-room is valid',        isValidComedyMode('into-the-room'), true);
assert('isValidComedyMode: house-name-oracle is valid',    isValidComedyMode('house-name-oracle'), true);
assert('isValidComedyMode: unknown mode is invalid',       isValidComedyMode('unknown'), false);
assert('isValidComedyMode: empty string is invalid',       isValidComedyMode(''), false);
assert('isValidComedyMode: null is invalid',               isValidComedyMode(null), false);

// ── Author Epilogue — BL-060 ─────────────────────────────────────────────────

assert('AUTHOR_VOICES.hemingway has voiceSignature',  typeof AUTHOR_VOICES.hemingway.voiceSignature, 'string');
assert('AUTHOR_VOICES.hemingway has structuralTell',  typeof AUTHOR_VOICES.hemingway.structuralTell, 'string');
assert('AUTHOR_VOICES.hemingway has wound',           typeof AUTHOR_VOICES.hemingway.wound, 'string');

const _hVoice = AUTHOR_VOICES.hemingway;
const _ctx1   = { player: 'Nick Faldo', outcome: '3 over par', panel: 'golf' };
const _p1     = buildAuthorEpiloguePrompt(_hVoice, _ctx1);
assert('buildAuthorEpiloguePrompt includes voice signature',   _p1.includes(_hVoice.voiceSignature), true);
assert('buildAuthorEpiloguePrompt includes player (Faldo)',    _p1.includes('Nick Faldo'), true);
assert('buildAuthorEpiloguePrompt includes outcome (3 over)',  _p1.includes('3 over par'), true);
assert('buildAuthorEpiloguePrompt includes word count lower',  _p1.includes('250'), true);
assert('buildAuthorEpiloguePrompt includes word count upper',  _p1.includes('400'), true);

const _p2 = buildAuthorEpiloguePrompt(_hVoice, { player: 'Tiger Woods', outcome: '15 under par', panel: 'golf' });
assert('buildAuthorEpiloguePrompt includes player (Tiger)',    _p2.includes('Tiger Woods'), true);
assert('buildAuthorEpiloguePrompt includes outcome (15 under)',_p2.includes('15 under par'), true);

const _p3 = buildAuthorEpiloguePrompt(_hVoice, { player: 'Rocco Mediate', outcome: 'level par playoff', panel: 'golf' });
assert('buildAuthorEpiloguePrompt includes player (Rocco)',    _p3.includes('Rocco Mediate'), true);
assert('buildAuthorEpiloguePrompt includes outcome (playoff)', _p3.includes('level par playoff'), true);

// ── Author Epilogue pool mechanics — BL-061 ──────────────────────────────────

assert('AUTHORS_POOL contains hemingway',              AUTHORS_POOL.includes('hemingway'), true);
assert('AUTHORS_POOL contains mccarthy',               AUTHORS_POOL.includes('mccarthy'), true);
assert('AUTHORS_POOL has at least 2 entries',          AUTHORS_POOL.length >= 2, true);

const _pool3     = ['hemingway', 'mccarthy', 'tolkien'];
const _poolOrig  = [..._pool3];
const _shuffled  = shufflePool(_pool3);
assert('shufflePool returns correct length',           _shuffled.length, 3);
assert('shufflePool contains all original elements',   _shuffled.slice().sort().join(','), _poolOrig.slice().sort().join(','));
assert('shufflePool does not modify original',         _pool3.join(','), _poolOrig.join(','));

assert('selectNextAuthorFromQueue returns first item', selectNextAuthorFromQueue(['mccarthy', 'hemingway']), 'mccarthy');
assert('selectNextAuthorFromQueue returns null for []', selectNextAuthorFromQueue([]), null);

// ── Results ──────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\nUnit Tests: ${passed}/${total} passing`);
if (failures.length) {
  failures.forEach(f => console.log(f));
  console.log('');
  process.exit(1);
} else {
  console.log('All unit tests passed.\n');
  process.exit(0);
}
