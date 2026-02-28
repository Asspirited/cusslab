# TDD — Practices
# Heckler and Cox
# Last updated: 2026-02-28
# Principles: see .claude/principles/xp.md
# Reference: Kent Beck — Test Driven Development: By Example (2002)

---

## The 7-Step TDD Cycle — Non-Negotiable

1. Write a failing unit test
2. Confirm it fails — and for the RIGHT reason (not an import error, not a typo)
3. Write minimum code to make it pass
4. Confirm it passes
5. Refactor
6. Confirm still passes
7. Repeat

**The test must exist before the code. Always. No exceptions.**

Step 2 is the most commonly skipped. A test that fails for the wrong reason
gives false confidence. Confirm the failure message describes the missing behaviour.

---

## Four Isolation Levels

**Level 1 — Unit**
Pure function. No DOM. No API. No side effects.
Examples: computeF(), cultureScore(), ironyScore(), intensity calculations
Test with: plain Jest, no setup required

**Level 2 — Component**
Fresh DOM. Single panel HTML only. Isolated from other panels.
Examples: one panel rendering, one panel responding to input
Test with: JSDOM, fresh instance per test

**Level 3 — Full Application**
Full index.html loaded. Clean state. All panels. All tabs.
Examples: end-to-end user flows, tab switching, mode changes
Test with: JSDOM with full document, state reset between tests

**Level 4 — Conversation Round**
Stateful. Multi-round. Character state transitions across rounds.
Examples: intensity accumulation, decay, repeat trigger spikes, session reset
Test with: state factories + round helpers, no DOM required

---

## Level 4 — Conversation Round Testing Patterns

```js
// State factory — always start from known state
const makeHecklerState = (overrides = {}) => ({
  panel: 'heckler',
  current_intensity: 0,
  peak_intensity: 0,
  baseline_intensity: 0,
  rounds_since_trigger: 0,
  decay_rate: 1,
  triggers: [],
  open_conflicts: [],
  concessions: [],
  position_shifts: [],
  ...overrides
});

// Round helper — advance state by one round
const advanceRound = (state, trigger = null) => applyRound(state, trigger);
```

**Rules for Level 4 tests:**
- Never setTimeout — advance state programmatically
- Always use state factories — never mutate shared state between tests
- Assert state object properties — not function call counts
- summariseFromState() must have 100% branch coverage — it is load-bearing

---

## Then Steps Must Test Observable State

**BAD — tests internal implementation:**
```js
assert.ok(mockStorage.setItem.called)
assert.ok(apiModule.fetch.calledWith(expected))
```

**GOOD — tests what the user or system observes:**
```js
assert.equal(input.value, expectedMaskedKey)
assert.equal(state.current_intensity, expectedIntensity)
```

This was the root cause of Bug 6. Mock-based Then steps produced false greens.
JSDOM exists to make real DOM assertion possible.

---

## Coverage Minimums

Statements ≥ 70%. Branches ≥ 70%.
These are floors, not targets. Hitting 70% and stopping is not the goal.
summariseFromState() requires 100% branch coverage — it is the anti-corruption layer.

---

## Test Suite Health Checks (every session start)

Report these before any code:
- Pending scenario count — must decrease or hold
- False green count — must be zero
- Rod-caught count — must trend to zero
- Coverage % statements and branches

---

## After Hooks — Guaranteed Cleanup

Every test that touches DOM or shared state must have an after hook.
No test should be able to poison the next test's starting state.

```js
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});
```

---

## Wait for Events, Not Time

Never use setTimeout in tests.
If behaviour depends on timing, the architecture is wrong — fix the architecture.
Use event-driven patterns: dispatch an event, assert the response.
