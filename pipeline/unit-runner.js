// Unit test runner — tests pure functions in pipeline/logic.js
// Run: node pipeline/unit-runner.js

const { maskKey, isValidKey, shouldUpdateInput, Temperature } = require('./logic.js');

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
