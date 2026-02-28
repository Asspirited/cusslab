# Testing Standards — Heckler and Cox
# Last updated: 2026-02-28

## TDD — Non-Negotiable (7 steps)
1. Write failing unit test
2. Confirm it fails for the right reason
3. Write minimum code to pass
4. Confirm it passes
5. Refactor
6. Confirm still passes
7. Repeat

The test must exist before the code. Always.

## Four Isolation Levels
Level 1 — Unit: pure function, no DOM (computeF, cultureScore, scoring logic)
Level 2 — Component: fresh DOM, single panel HTML only
Level 3 — Full application: full index.html, clean state, integration
Level 4 — Conversation round: stateful, multi-round, character state transitions

## Fourth Isolation Level: Conversation Round Testing
Tests: intensity accumulation/decay, repeat trigger spikes, baseline floor,
event log correctness, summariseFromState() determinism, session reset,
debate vs roast mode event patterns.

State factory pattern (makeHecklerState), round helper (advanceRound).
summariseFromState() must have 100% branch coverage — it is load-bearing.
Never setTimeout — advance state programmatically.
Always use state factories — never mutate shared state between tests.

All 10 character state Gherkin scenarios (approved 2026-02-28) must have
corresponding conversation round tests before any character state code ships.

## Then Steps Must Test Observable DOM State
BAD: assert.ok(mockStorage.setItem.called)
GOOD: assert.equal(input.value, expected)

## Coverage Minimums
Statements ≥ 70%, Branches ≥ 70%. Floors not targets.

## Test Suite Health Checks (every session)
- Pending scenario count: must decrease or hold
- False green count: must be zero
- Rod-caught count: must trend to zero
