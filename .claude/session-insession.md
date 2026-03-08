# In-Session Protocol — Heckler and Cox
# Trigger map and delivery discipline
# Last updated: 2026-03-08
# Sources: Evans (DDD), Martin (Clean Code, SOLID), Fowler (Refactoring),
#          Meszaros (xUnit Patterns), Smart (BDD in Action),
#          Adzic/Evans (Fifty Quick Ideas to Improve Your Tests),
#          Nielsen (10 Usability Heuristics), SUS, WCAG 2.1 AA,
#          DORA metrics, OWASP

## TRIGGER MAP

### TRIGGER: "new feature" / "new panel" / "new mechanic" / "new character"
→ Run: FEATURE SEQUENCE

### TRIGGER: "write the tests" / "unit tests" / "make it fail"
→ Run: TDD SEQUENCE

### TRIGGER: "implement" / "wire it up" / "build it"
→ Check: Gherkin approved? Unit tests red? DDD RED done? If not — stop and say why.
→ If yes: Run: IMPLEMENTATION SEQUENCE

### TRIGGER: "commit" / "push" / "ship it"
→ Run: COMMIT SEQUENCE

### TRIGGER: "character file" / "write the character" / "build [name]"
→ Check: domain-model.md read this session? If not — fetch it first.
→ Check: Gherkin approved for this character? If not — Gherkin first.
→ Run: CHARACTER SEQUENCE

### TRIGGER: "run the panel" / "let's hear them" / "test it live"
→ Check: domain-model.md read this session? If not — stop.
→ Check: pipeline green? If not — stop.
→ Proceed.

### TRIGGER: "research" / "find out about" / "who is"
→ Run: CHARACTER RESEARCH PROTOCOL

---

## THE THREE LOOPS — how they nest

DDD is the outer loop (design coherence, outside-in).
BDD is the contract loop (behaviour specification).
TDD is the inner loop (implementation discipline).
DDD RED ──────────────────────────────────────────────────► DDD CLEAN
│                                                               ▲
▼                                                               │
BDD (Gherkin written + approved)                      BDD CLOSE ─┘
│                                                       ▲
▼                                                       │
TDD RED → TDD GREEN → TDD CLEAN ───────────────────────►─┘

DDD RED fires before Gherkin and before implementation.
BDD CLOSE fires after TDD CLEAN — Gherkin retrospective against real implementation.
DDD CLEAN fires after BDD CLOSE — harvest new concepts into domain model.

---

## SEQUENCES

### FEATURE SEQUENCE — DDD RED + BDD first gate
1. Confirm scope — what behaviour are we specifying?
2. DDD RED — run before writing a single line of Gherkin:
   - Fetch and read domain-model.md if not read this session
   - Check: does this feature introduce new domain concepts?
   - Check: does anything conflict with existing bounded contexts?
   - Check: is the ubiquitous language defined for all new terms?
   - Flag: any ambiguity or conflict to Rod before proceeding
   - Flag: any business/product AND technical conflicts — they are the same thing
   - Source: Evans — Domain-Driven Design, bounded contexts + ubiquitous language
3. PRE-IMPLEMENTATION REVIEW — run checklist (see below)
4. Draft Gherkin to specs/ — apply 6-point BDD quality gate (see CLAUDE.md)
5. Present for approval — do not proceed until Rod says yes
6. On approval → TDD SEQUENCE

### PRE-IMPLEMENTATION REVIEW CHECKLIST
Run before any implementation. Report findings. Propose design. Await Rod approval.

**DDD:**
- [ ] All new concepts named in ubiquitous language
- [ ] No bounded context violations
- [ ] Single responsibility per new function/module
- [ ] Gold standard pattern exists? If yes — copy, don't invent
- Source: Evans — Domain-Driven Design

**SOLID:**
- [ ] Single Responsibility — one reason to change per module
- [ ] Open/Closed — extend, don't modify existing working code
- [ ] Liskov — no surprises when substituting implementations
- [ ] Interface Segregation — no forced dependencies on unused interfaces
- [ ] Dependency Inversion — depend on abstractions not concretions
- Source: Martin — Agile Software Development

**Clean Code:**
- [ ] Names reveal intent — no abbreviations, no mystery variables
- [ ] Functions do one thing
- [ ] No dead code, no commented-out code
- [ ] No magic numbers — named constants only
- Source: Martin — Clean Code

**DevOps / DORA:**
- [ ] Change is small and deployable independently
- [ ] Pipeline will stay green
- [ ] No new environment dependencies without flagging
- [ ] Trunk-based — no long-lived branches
- Source: DORA metrics; .claude/STANDARDS.md

**Usability & UX:**
- [ ] Nielsen Heuristic 1: Visibility of system status
- [ ] Nielsen Heuristic 4: Consistency and standards
- [ ] Nielsen Heuristic 6: Recognition over recall
- [ ] Nielsen Heuristic 8: Aesthetic and minimalist design
- [ ] SUS implications considered for any new UI element
- Source: Nielsen 10 Usability Heuristics; System Usability Scale

**Non-functional:**
- [ ] Accessibility: WCAG 2.1 AA — any new UI element keyboard navigable?
- [ ] Security: no API keys client-side, no secrets in code
- [ ] Performance: no synchronous blocking in UI thread
- [ ] Source: WCAG 2.1 AA; OWASP; .claude/STANDARDS.md

### TDD SEQUENCE — red → green → clean
1. Identify unit assertions from approved Gherkin
2. Write unit tests to pipeline/unit-runner.js — red, do not implement yet
   (logic under test lives in pipeline/logic.js)
3. Run pipeline — confirm tests failing for the right reason
4. Report which tests are red and why
5. On Rod's go → IMPLEMENTATION SEQUENCE

### IMPLEMENTATION SEQUENCE — green the tests
1. Write minimum implementation to green the unit tests
2. Run pipeline — confirm unit tests green
3. Write Gherkin step definitions to pipeline/gherkin-runner.js — red
4. Wire implementation to steps — Gherkin green
5. Run pipeline — full green
6. TDD CLEAN — run refactor checklist (see below)
7. → BDD CLOSE

### TDD CLEAN — REFACTOR CHECKLIST
Run after unit tests green, before BDD CLOSE. Report findings. Only write when
something real needs changing — forced refactor every cycle is noise.

- [ ] Does any function do more than one thing? Extract it.
- [ ] Are any names unclear or inconsistent with ubiquitous language? Rename.
- [ ] Is there duplication? Extract to shared function in logic.js.
- [ ] Are there magic numbers or hardcoded strings? Extract to named constants.
- [ ] Is any module longer than it needs to be? Single responsibility check.
- [ ] Does the gold standard pattern still apply? If we've drifted — align.
- [ ] Are tests testing behaviour or implementation? If implementation — rewrite.
- [ ] Are all new exports in logic.js pure functions? If not — extract.
- Source: Fowler — Refactoring (2nd ed); Martin — Clean Code
- Source: Meszaros — xUnit Patterns (behaviour not implementation)

### BDD CLOSE — Gherkin retrospective
Run after TDD CLEAN. Closes the BDD loop against real implementation.

1. All Gherkin scenarios passing against real implementation — not stubs,
   not mocks, not hardcoded step returns
2. Step definitions are calling real logic — verify
3. Scenario drift check: does each scenario description still accurately
   describe the actual behaviour? If not — update the spec consciously,
   never silently
4. Redundancy check: did any scenarios become redundant during implementation?
   Flag for removal with reason
5. Coverage check: did implementation reveal missing scenarios? Add and get
   approval before closing
6. Run pipeline — full green
7. → DDD CLEAN

### DDD CLEAN — domain model harvest
Run after BDD CLOSE. Closes the DDD outer loop. Only when something real has emerged.

1. Review all new concepts introduced this cycle
2. Are any new concepts not yet in domain-model.md? Add them.
3. Are any new patterns general enough to serve other panels/features? Name them.
4. Are any new functions candidates for single-responsibility extraction? Flag.
5. Raise backlog items for any generalisation opportunities identified
6. Update domain-model.md — ubiquitous language section first, then model
7. → COMMIT SEQUENCE
- Source: Evans — Domain-Driven Design, strategic and tactical patterns

### COMMIT SEQUENCE — never skip
1. Run pipeline — must be green
2. Write to file if any output > 20 lines — never paste to chat
3. git add → git commit (descriptive message) → git push
4. Confirm origin/main updated — report hash
5. Append waste log entry if anything went wrong this session

### CHARACTER SEQUENCE — research → Gherkin → file
1. Run CHARACTER RESEARCH PROTOCOL
2. Draft character summary — wounds, voice, comedy engine
3. Gherkin for character behaviour if needed — apply BDD quality gate
4. Write character .md to docs/ — never inline in index.html
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
Source: .claude/practices/domain-model.md — character builder section

---

## DESIGN PRINCIPLES SUMMARY — one-line per principle

DDD: domain model is the bounded context — Evans
SOLID: single responsibility first, always — Martin
Clean Code: names reveal intent, functions do one thing — Martin
Refactoring: improve structure without changing behaviour — Fowler
Test design: test behaviour not implementation — Meszaros / Smart / Adzic
Usability: recognition over recall, consistency, visibility — Nielsen / SUS
Accessibility: WCAG 2.1 AA minimum — every new UI element
Security: no keys client-side, ever — OWASP
DevOps: small changes, pipeline green, trunk-based — DORA

---

## REFERENCE FILES — fetch when trigger fires, not before
.claude/practices/domain-model.md  — character/panel work + ubiquitous language
.claude/CLAUDE.md                  — ways of working, BDD quality gate
.claude/practices/waste-log.md     — append after mistakes
.claude/practices/auth-ops.md      — auth/deploy work
specs/                             — all Gherkin lives here
docs/                              — all character files live here
pipeline/unit-runner.js            — all unit tests (403 assertions)
pipeline/logic.js                  — pure functions under test
pipeline/gherkin-runner.js         — Gherkin step definitions
