# Test Design Techniques — Heckler and Cox
# Informed by: Myers, Beizer, Kaner, Copeland, Bach, Bolton, ISTQB FL Syllabus v4.0
# Last updated: 2026-03-15
# Read when: designing test cases, choosing Gherkin examples, reviewing coverage gaps

---

## How to use this file

Each technique is a tool. The question is always: **which tool fits this decision?**

Use the Quick-Reference table at the bottom to match signal to technique.
Use the detail sections when you need to know how to apply it.

---

## 1. Equivalence Partitioning (EP)

**What it is.** Divides input data into groups (partitions) where all values are expected to be processed identically. Test one representative value per partition — if one fails, all will.

**Applied here.** For a user prompt sent to a panel:
- Valid non-empty text → one test representative
- Empty string → one test
- Null / undefined → one test
- Input exceeding max length → one test

You do not need 50 different valid sentences. One covers the valid partition.

**Layer.** Unit (input validation), BDD scenario (one scenario per partition class).

**Authority.** Glenford J. Myers, *The Art of Software Testing* (Wiley, 1979/2011); ISTQB FL Syllabus v4.0, §4.3.

---

## 2. Boundary Value Analysis (BVA)

**What it is.** Extension of EP that tests at the exact edges of partitions. Defects cluster at boundaries. Test: minimum, minimum+1, maximum-1, maximum of a range.

**Applied here.** If prompt input has a 500-character limit:
- 0 chars (boundary of invalid partition)
- 1 char (first valid)
- 499 chars
- 500 chars (last valid)
- 501 chars (first invalid)

Also: number of panel members responding (if 1–5 expected, test 0, 1, 5, 6).

**Layer.** Unit (character counting, panel count guards), integration (API payload size).

**Authority.** Myers, *The Art of Software Testing*; ISTQB FL Syllabus v4.0, §4.3.

---

## 3. Decision Table Testing

**What it is.** Models combinations of conditions and their resulting actions in a table. Each column is a rule (unique combination of inputs); each row is a condition or expected action. One scenario per column.

**Applied here.** Conditions: `prompt non-empty (Y/N)` × `AI service available (Y/N)` × `API key set (Y/N)` → 8 rules mapping to: show response / show error / show settings gate / show empty state.

**Layer.** BDD scenario (each rule → scenario outline row), integration.

**Authority.** Boris Beizer, *Software Testing Techniques* (Van Nostrand Reinhold, 2nd ed. 1990); ISTQB FL Syllabus v4.0, §4.5.

---

## 4. State Transition Testing

**What it is.** Models the system as a finite state machine — states, events that trigger transitions, expected outcomes. Tests cover valid transitions (happy path), invalid transitions (should be rejected), and recovery.

**Applied here.** Panel states: `idle → loading → responding → error | idle`. Events: `prompt submitted`, `AI responds`, `AI times out`, `user resets`. A "0-switch" test covers every state once; "1-switch" covers every consecutive pair.

Also strong for: pub crawl game state (choice made → outcome shown → next scene), Golf Adventure shot sequence, panel busy flag (_snBusy, _gfBusy etc.).

**Layer.** Integration, BDD scenario (happy path and edge transitions).

**Authority.** Beizer, *Software Testing Techniques*; ISTQB FL Syllabus v4.0, §4.6.

---

## 5. Error Guessing / Fault Attack

**What it is.** Experience-based. Use knowledge of past bugs, typical defects, and domain intuition to devise tests not derivable from spec. "Fault attack" is the structured variant — build an explicit fault model (list of likely error types) before testing.

**Applied here.** High-value guesses for this codebase:
- `<script>alert(1)</script>` in a prompt (XSS in rendered character response)
- Unicode right-to-left override characters in prompts
- Rapid fire-submit (10 prompts in 2 seconds) — race condition in busy flag
- Prompt that is only whitespace (passes non-empty check, is semantically empty)
- A prompt that names the character speaking (self-reference loop risk)
- Clicking "Ask" before API key is set

**Layer.** Exploratory (primary), unit (harden specific guards), BDD scenario (when a guess becomes a regression).

**Authority.** ISTQB FL Syllabus v4.0, §4.4; James Bach & Michael Bolton, "Exploratory Testing 3.0" (StickyMinds, 2012).

---

## 6. Pairwise / Combinatorial Testing (All-Pairs)

**What it is.** When the system has many independent parameters, full combinatorial coverage is infeasible. Pairwise generates the smallest test set that covers every *pair* of parameter values at least once — empirically, most defects are triggered by interactions between two variables. PICT (Microsoft) is the standard tool.

**Applied here.** Parameters: `character` (10 options) × `prompt length` (short/medium/long) × `atmosphere` (NORMAL/HEATED/CHAOS) × `panel` (Golf/Football/Snooker). Full = 10×3×3×4 = 360. Pairwise ≈ 18–25 tests covering every pair. Useful for cross-panel regression after changes to shared mechanics (arcLog, recentMoves, ConspireEngine).

**Layer.** Integration, regression.

**Authority.** Rick D. Craig & Stefan P. Jaskiel, *Systematic Software Testing* (Artech House, 2002); Jacek Czerwonka, "Pairwise Testing in the Real World" (2006).

---

## 7. Use Case / Scenario-Based Testing

**What it is.** Tests derived from end-to-end user journeys, including main flow, alternate flows, and exception flows. The conceptual parent of BDD. The distinction: use case testing explicitly traces every alternate and exception path, not just the happy path.

**Applied here.** Use case: "User asks three snooker pundits a question." Main flow: prompt submitted, three distinct responses rendered. Alternate: user submits, edits prompt before AI responds — what happens? Exception: one of three AI calls fails — partial result or full error?

**Layer.** BDD scenario (maps directly to Gherkin), integration (multi-character orchestration).

**Authority.** Alistair Cockburn, *Writing Effective Use Cases* (Addison-Wesley, 2001); Lee Copeland, *A Practitioner's Guide to Software Test Design* (Artech House, 2004).

---

## 8. Mutation Testing

**What it is.** Introduces small deliberate code changes ("mutants" — flip `>` to `>=`, delete a condition) and runs the test suite against each. If a mutant survives (no test fails), there is a coverage gap. Mutation score = mutants killed / total mutants. Stryker is the standard JavaScript tool.

**Applied here.** In `if (prompt.length > 0)`, a mutant changes it to `>= 0`. If BVA for empty string is missing, this mutant survives — revealing the boundary is untested. Validates whether Gherkin scenarios exercise the right code paths.

Run Stryker against `pipeline/logic.js` and input validation functions. Do not run against index.html inline scripts — too large; target extracted pure functions.

**Layer.** Unit and integration (measures suite quality, not system behaviour).

**Authority.** Richard DeMillo, Richard Lipton & Fred Sayward, "Hints on Test Data Selection" (IEEE Computer, 1978); Stryker: stryker-mutator.io.

---

## 9. Property-Based Testing

**What it is.** Instead of specific examples, define properties (invariants) that must always hold. The framework generates hundreds of random inputs to try to falsify them. If a failing case is found, it shrinks to a minimal reproducer. fast-check is the standard JavaScript library.

**Applied here.** Property: "For any non-empty string prompt, the API response object always has a non-empty `text` field." fast-check generates thousands of random strings — unicode, emoji, control characters, 5000-char inputs — and verifies the invariant. Second property: "Panel busy flag is always false after discuss() resolves, regardless of input."

**Layer.** Unit (pure functions with clear invariants), integration (API response shape guarantees).

**Authority.** John Hughes, "QuickCheck" (ICFP, 2000); fast-check by Nicolas Dubien (github.com/dubzzz/fast-check).

---

## 10. Risk-Based Testing

**What it is.** Prioritises test effort by risk: likelihood of failure × impact of failure. Not a test design technique per se — a prioritisation framework for choosing which other techniques to apply first and most deeply.

**Applied here.** Risk matrix:
- AI prompt → character response: HIGH likelihood (nondeterministic) × HIGH impact → deepest coverage, mutation testing
- Input sanitisation (XSS in rendered output): LOW likelihood × HIGH impact → fault-attack tests prioritised
- CSS layout: LOW × LOW → smoke test only
- API key guard: MEDIUM × HIGH → state transition + boundary value

**Layer.** Applies across all layers as a prioritisation lens.

**Authority.** James Bach, "Risk and Requirements-Based Testing" (Computer, 1999); Rex Black, *Managing the Testing Process* (Wiley, 3rd ed. 2009); ISTQB Advanced Test Manager syllabus.

---

## 11. Session-Based Exploratory Testing (SBET)

**What it is.** Structures exploratory testing into time-boxed sessions (60–90 min) with a written charter defining mission, scope, and focus area. Tester takes notes in a session sheet. Findings feed directly into Gherkin scenarios or WL items. Invented by Jonathan Bach.

**Applied here.** Rod's step 2c exploratory test is already SBET in practice. Making it explicit:

Charter template:
```
Mission: Explore [panel or feature]
Scope: [what's included / excluded]
Time box: 60 minutes
Focus: [specific risk or question]
Log: anomalies → WL-NNN immediately; missing scenarios → BL-NNN
```

Example charter: "Explore how the Golf panel handles prompts that name a character directly, mix languages, or exceed 300 characters. Note any persona break, error, or duplicate content."

**Layer.** Exploratory (by definition). Findings feed all other layers.

**Authority.** Jonathan Bach, "Session-Based Test Management" (StickyMinds, 2000); James Bach & Michael Bolton, Rapid Software Testing methodology.

---

## 12. Cause-Effect Graphing

**What it is.** Translates requirements into a boolean logic graph linking causes (inputs/conditions) to effects (outputs/behaviours), then derives a minimal decision table. Primarily a decision-table derivation tool. In practice, decision table testing (above) produces the same outcome more accessibly.

**Applied here.** Causes: `prompt contains profanity` × `character persona is family-safe` × `user has content warnings enabled`. Effect: response is filtered. The graph encodes AND/OR/NOT relationships and generates the decision table automatically — useful when the conditions are interdependent in non-obvious ways.

**Layer.** BDD scenario derivation; decision table entry generation.

**Authority.** Myers, *The Art of Software Testing* (ch.5); Beizer, *Software Testing Techniques*.

---

## Quick-Reference Table

| Signal | Technique to apply |
|---|---|
| Designing Gherkin examples for input validation | EP + BVA — one scenario per partition class, plus boundary rows |
| Multiple conditions interact to produce a result | Decision Table |
| Feature has clear states (loading, responding, error, idle) | State Transition |
| Cross-panel regression after a shared mechanic changes | Pairwise / Combinatorial |
| "What might go wrong?" with a new character or panel | Error Guessing / Fault Attack |
| Verifying Gherkin actually exercises the right code paths | Mutation Testing (Stryker) |
| AI response object shape must hold for all inputs | Property-Based (fast-check) |
| Deciding which tests to write first | Risk-Based prioritisation |
| Session start step 2c / end-of-feature verification | SBET charter |
| Use case has alternate and exception flows not in Gherkin | Use Case / Scenario-Based |
| Conditions are interdependent in complex ways | Cause-Effect Graphing → Decision Table |
