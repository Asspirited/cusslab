# CLAUDE.md — Heckler and Cox
# Last updated: 2026-02-28

---

## Session Start (mandatory, before any code)

1. Read ALL files in .claude/principles/ and .claude/practices/
2. Run `cd /home/rodent/cusslab && node pipeline/metrics-report.js && npm test` — report DORA stats and coverage numbers before doing anything else
3. Report last retrospective findings
4. Read .claude/practices/waste-log.md and report any open items
5. Only then: work

---

## Session End (mandatory, before closing)

1. Review session for any insights flagged "worth a conversation" or "unactioned"
2. Run `cd /home/rodent/cusslab && node pipeline/metrics-report.js && npm test` — report final DORA stats and coverage. Flag any regression from session-start numbers.
3. Review for any decisions made but not yet implemented
4. Review for any regression or unexpected behaviour observed
5. Review for any friction that cost tokens or time
6. Commit any new entries to .claude/practices/waste-log.md
7. Push — no session ends without waste-log committed and pushed

---

## Principles Files (read to think about problems correctly)

These files govern HOW to think before designing or implementing anything.

- .claude/principles/ddd.md — bounded contexts, ubiquitous language, domain events, aggregates
- .claude/principles/xp.md — simplicity, feedback, courage, four rules of simple design
- .claude/principles/lean.md — eliminate waste, optimise the whole, defer commitment
- .claude/principles/systems-thinking.md — feedback loops, emergence, unintended consequences
- .claude/principles/ux.md — jobs to be done, Norman's principles, Krug's law

---

## Practices Files (read to implement correctly)

These files govern HOW to do the work at each step of the cycle.

- .claude/practices/bdd.md — Gherkin gate, Given-When-Then, done conditions
- .claude/practices/tdd.md — 7-step cycle, four isolation levels, state factories
- .claude/practices/solid.md — SOLID applied to our codebase, clean code rules, refactoring triggers
- .claude/practices/5-whys.md — root cause analysis procedure, our bug log
- .claude/practices/ci-cd.md — pipeline steps, push rule, recovery playbook, scorecard format
- .claude/practices/dora.md — four metrics, how to measure, metrics file formats
- .claude/practices/retrospectives.md — triggers, format, lenses, anti-patterns
- .claude/practices/domain-model.md — our domain model, bounded contexts, ubiquitous language
- .claude/practices/ux-decisions.md — design decisions log, personas, UX review checklist
- .claude/practices/architecture-review.md — extraction order, seam inventory, testing pyramid, SOLID/Feathers/Beck/Newman applied

---

## Standards Files

- .claude/standards/references.md — all authoritative sources

---

## The Integrated Delivery Cycle
Every feature. Every bug fix. Every session. No exceptions.

### Step 1 — Three Amigos (BDD)
Read: principles/ddd.md, principles/ux.md
Rod and Claude agree the behaviour in plain language.
What does the user see? What job does this serve? What domain concept does this touch?

### Step 2 — Gherkin (BDD Gate — enforced)
Read: practices/bdd.md
Write scenario in Given-When-Then. Then:
1. Output COMPLETE literal text of every new or modified scenario
2. Print: "WAITING FOR ROD'S APPROVAL — do not proceed until Rod confirms"
3. STOP. Do not run pipeline. Do not fix code. Do not commit.
4. Wait for Rod to explicitly type "approved" or give feedback
5. Only proceed after explicit written approval in this session

Previous session approval does not count.

### Step 3 — Outside-In Design (SOLID)
Read: principles/ddd.md, practices/solid.md, principles/systems-thinking.md
Design the public interface before writing any code or test.
- SRP: one reason to change?
- OCP: extends or modifies?
- LSP: interchangeable?
- ISP: minimal interface?
- DIP: depends on abstraction?
- Second-order effects: what does this make impossible?

### Step 4 — Failing Test (TDD Gate — enforced)
Read: practices/tdd.md
Write the unit test against the interface from Step 3.
Run it. Confirm: (1) it fails, (2) it fails for the RIGHT reason.
Do not proceed until both confirmed.

### Step 5 — Minimum Implementation (TDD)
Read: practices/solid.md (clean code rules)
Write least code required to pass the test.
No gold plating. No future-proofing. No "while I'm here".

### Step 6 — Refactor (TDD + SOLID)
Read: practices/solid.md (refactoring triggers), principles/xp.md (four rules)
Run tests — confirm green. Then apply refactoring checklist.
Run tests again — must still be green.

### Step 7 — Pipeline (BDD living documentation)
Read: practices/ci-cd.md
Run npm run pipeline. All 5 steps must pass. A partial green is a red.
Coverage ≥70% statements, ≥70% branches.

### Step 8 — Push
Read: practices/ci-cd.md (push rule)
GREEN = commit + push = auto-deploy. Rod verifies in browser.

### Step 9 — Retro Trigger Check
Read: practices/retrospectives.md, practices/5-whys.md, practices/dora.md
- Rod caught something? → 5 Whys + retro this session
- False green? → retro this session
- Pending count increased? → explain, get approval
- All good? → log metrics, continue

---

## Non-Negotiable Rules

### PUSH Rule
npm run pipeline after any change to index.html, pipeline/, bug fix, or feature.
GREEN = commit + push. Never push red.

### SINGLE FILE Rule
One index.html at repo root only. Before any file operation:
```bash
find . -name "index.html" | grep -v node_modules
```
More than one result = stop, flag, do not proceed.

### REVERT Rule
Before reverting: check if pipeline/ changed in the commit.
pipeline/ and index.html must stay in sync.
See practices/ci-cd.md for full procedure.

---

## Architecture Rules

- Single index.html — all HTML, CSS, JS in one file
- Module pattern: `const ModuleName = (() => { ... })();`
- No framework, no build step, no bundler
- API calls via Cloudflare Worker only — never directly to api.anthropic.com
- No API key ever in frontend code or browser storage
- summariseFromState() must be deterministic — same input, same output, always

---

## Approved Gherkin Awaiting Code (as of 2026-02-28)

31 scenarios approved. Implement in this order:
1. Cloudflare Worker (9 scenarios) — includes brand error messages and Magnus loading state
2. Irony Authenticity (11 scenarios) — 12th dimension + Isn't It Ironic tab
3. Panel Character State (10 scenarios) — event log, intensity, decay, spike
4. Six panel member profiles (1 scenario) — Harold, Sebastian, Roy, Hicks, Partridge, Mystic

NOTE: Panel character state scenarios written for 4 panels. Need new scenarios for Hicks,
Partridge, and Mystic before implementation. Three Amigos required next session.

Full scenario text: retrospectives/session-retro-2026-02-28.md

---

## Yak Shaving Rule
Current task drifted from original goal? Name it. 20-minute limit.
Not resolved in 20 minutes: revert, ask a better question.
