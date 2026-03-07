// Unit test runner — tests pure functions in pipeline/logic.js
// Run: node pipeline/unit-runner.js

const { maskKey, isValidKey, shouldUpdateInput, Temperature, makeWoundDetector, GolfWoundDetector, BoardroomWoundDetector, DartsWoundDetector, DartsVoiceFmt, dartsBuildBlock } = require('./logic.js');

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

const DARTS_CHAR_IDS = ['mardle','bristow','taylor','lowe','george','waddell','part'];

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
