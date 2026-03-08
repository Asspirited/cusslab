# In-Session Protocol — Heckler and Cox
# Trigger map: what Claude does when work reaches each gate
# Last updated: 2026-03-08

## TRIGGER MAP

### TRIGGER: "new feature" / "new panel" / "new mechanic" / "new character"
→ Run: FEATURE SEQUENCE (see below)

### TRIGGER: "write the tests" / "unit tests" / "make it fail"
→ Run: TDD SEQUENCE (see below)

### TRIGGER: "implement" / "wire it up" / "build it"
→ Check: Gherkin approved? Unit tests red? If not — stop and say why.
→ If yes: Run: IMPLEMENTATION SEQUENCE (see below)

### TRIGGER: "commit" / "push" / "ship it"
→ Run: COMMIT SEQUENCE (see below)

### TRIGGER: "character file" / "write the character" / "build [name]"
→ Check: domain-model.md read this session? If not — fetch it first.
→ Check: Gherkin approved for this character? If not — Gherkin first.
→ Run: CHARACTER SEQUENCE (see below)

### TRIGGER: "run the panel" / "let's hear them" / "test it live"
→ Check: domain-model.md read this session? If not — stop.
→ Check: pipeline green? If not — stop.
→ Proceed.

### TRIGGER: "research" / "find out about" / "who is"
→ Run: CHARACTER RESEARCH PROTOCOL (see below)

---

## SEQUENCES

### FEATURE SEQUENCE — BDD first gate
1. Confirm scope — what behaviour are we specifying?
2. Check domain-model.md is current — fetch if not read this session
3. Draft Gherkin to specs/ — apply 6-point quality gate before presenting
4. Present for approval — do not proceed until Rod says yes
5. On approval → TDD SEQUENCE

### TDD SEQUENCE — red before green
1. Identify unit assertions from approved Gherkin
2. Write unit tests to pipeline/unit-runner.js — red, do not implement yet
   (logic lives in pipeline/logic.js — tests assert against it)
3. Run pipeline — confirm tests are failing for the right reason
4. Report which tests are red and why
5. On Rod's go → IMPLEMENTATION SEQUENCE

### IMPLEMENTATION SEQUENCE — green the tests
1. Write minimum implementation to green the unit tests
2. Run pipeline — confirm unit tests green
3. Write Gherkin step definitions — red
4. Wire implementation to steps — Gherkin green
5. Run pipeline — full green
6. → COMMIT SEQUENCE

### COMMIT SEQUENCE — never skip
1. Run pipeline — must be green
2. Write to file if any output > 20 lines — never paste to chat
3. git add → git commit (descriptive message) → git push
4. Confirm origin/main updated — report hash
5. Append waste log entry if anything went wrong this session

### CHARACTER SEQUENCE — research → Gherkin → file
1. Run CHARACTER RESEARCH PROTOCOL
2. Draft character summary — wounds, voice, comedy engine
3. Gherkin for character behaviour if needed
4. Write character .md to docs/characters/ — never inline in index.html
5. Wire into MEMBERS array
6. → COMMIT SEQUENCE

### CHARACTER RESEARCH PROTOCOL
Search in order:
  1. "[name] controversy"
  2. "[name] quotes"
  3. "[name] feud"
  4. "[name] incident"
  5. "[name] [co-panellist] relationship"
Real incidents always funnier than invented ones.
Compile: wounds, voice, comedy engine, panel fit before writing anything.

---

## DESIGN PRINCIPLES — applied at each gate

### DDD (Domain-Driven Design) — at FEATURE SEQUENCE step 2
- domain-model.md is the bounded context
- No new patterns without checking gold standard first
- SOLID: single responsibility per function, no invention

### BDD (Behaviour-Driven Design) — at FEATURE SEQUENCE steps 3-4
- Gherkin defines the contract
- 6-point quality gate: outlines, merge opportunities, Examples scope,
  scenario count, Background audit, no scenarios for constants
- Approval required before any code

### TDD (Test-Driven Development) — at TDD SEQUENCE
- Unit tests written before implementation, always
- Red before green, always
- Unit tests enable Gherkin steps — not the other way round

### SOLID — at IMPLEMENTATION SEQUENCE step 1
Read: .claude/practices/solid.md before writing any implementation.
- SRP: one reason to change per function. discuss() does not do two things.
- OCP: extend via config/data, not by modifying existing functions.
- DIP: depend on shared modules (FoodWeather, LieEngine etc), not on panel-specific internals.
If implementation requires modifying a shared module, stop and design the seam first.

### CLEAN CODE — at IMPLEMENTATION SEQUENCE step 1
- Minimum code to green the tests. No gold plating. No future-proofing.
- No comments on self-evident code. Only comment where logic is genuinely non-obvious.
- No dead code. No backwards-compat shims. Delete what is unused.
- Function names say what they do. Variables say what they hold.

### UX — at IMPLEMENTATION SEQUENCE and TEST DESIGN
Read: .claude/principles/ux.md before any UI change or new interaction.
- Does the user know what to do without being told?
- Does feedback arrive before frustration does? (progressive rendering, toast on error)
- Does disabling the button during processing prevent double-submission?
- Does the output area clear before new responses render? (no stale state confusion)

---

## REFERENCE FILES — fetch when trigger fires, not before
.claude/practices/domain-model.md  — character/panel work
.claude/CLAUDE.md                  — ways of working, quality gates
.claude/practices/waste-log.md     — append after mistakes
.claude/practices/auth-ops.md      — auth/deploy work
specs/                             — all Gherkin lives here
docs/                              — all character files live here (not docs/characters/)
pipeline/unit-runner.js            — all unit tests live here (387 assertions)
pipeline/logic.js                  — pure functions under test
pipeline/gherkin-runner.js         — Gherkin step definitions
