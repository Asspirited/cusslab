# CLAUDE.md — Heckler and Cox
# Last updated: 2026-02-28

---

## Session Start (mandatory, before any code)

1. Read ALL files in .claude/standards/ before touching anything
2. Run `npm run pipeline` — report scorecard: pass/fail per step, coverage %, pending scenario count
3. Report last retrospective findings
4. Only then: work

---

## Standards Files (read all, every session)

- .claude/standards/bdd.md — BDD principles, Gherkin gate, done conditions
- .claude/standards/testing.md — TDD cycle, isolation levels, coverage minimums
- .claude/standards/lean-dora.md — DORA metrics, lean principles, SOLID, clean code, dev flow
- .claude/standards/retrospectives.md — triggers, format, output
- .claude/standards/metrics.md — build metrics, defect metrics, root cause taxonomy
- .claude/project-brief.md — architecture, panel profiles, character state, open items

---

## The Integrated Delivery Cycle
Every feature. Every bug fix. Every session. No exceptions.

### Step 1 — Three Amigos (BDD)
Rod and Claude agree the behaviour in plain language before anything is written.
What does the user see? What is the observable outcome?

### Step 2 — Gherkin (BDD Gate — enforced)
Write scenario in Given-When-Then.
Then:
1. Output COMPLETE literal text of every new or modified scenario
2. Print: "WAITING FOR ROD'S APPROVAL — do not proceed until Rod confirms"
3. STOP. Do not run pipeline. Do not fix code. Do not commit.
4. Wait for Rod to explicitly type "approved" or give feedback
5. Only proceed after explicit written approval in this session

Previous session approval does not count.
A scenario Rod has not read in this session has not been approved.

### Step 3 — Outside-In Design (SOLID)
Before writing any code or test — design the public interface.
Ask:
- SRP: does this module/function have exactly one reason to change?
- OCP: does this extend existing behaviour, or does it require modifying core?
- LSP: are panel objects interchangeable with the same interface?
- ISP: is the interface minimal — no methods the caller doesn't need?
- DIP: does this depend on abstractions, not concretions?
If any answer is wrong — redesign before proceeding.

### Step 4 — Failing Test (TDD Gate — enforced)
Write the unit test against the interface designed in Step 3.
Run it. Confirm two things:
1. It fails
2. It fails for the RIGHT reason — not an import error, not a typo, the actual missing behaviour
Do not proceed until both are confirmed.

### Step 5 — Minimum Implementation (TDD)
Write the least code required to make the test pass.
No gold plating. No "while I'm here". No future-proofing.
If it's not required by a failing test, it doesn't get written.

### Step 6 — Refactor (TDD + SOLID)
Run tests — confirm green.
Then ask:
- Does any function exceed 20 lines? Split it.
- Does anything have more than one responsibility? Split it.
- Are there magic strings? Extract to named constants.
- Are there empty catch blocks (except localStorage)? Fix them.
- Do comments explain what instead of why? Rewrite them.
Run tests again — confirm still green.

### Step 7 — Pipeline (BDD living documentation)
```bash
npm run pipeline
```
All 5 steps must pass. A partial green is a red.
The Gherkin scenario now proves the behaviour is live.
Coverage must be ≥70% statements, ≥70% branches.

### Step 8 — Push
GREEN pipeline = commit + push = auto-deploy to GitHub Pages.
Rod verifies in browser.
Never push a red pipeline.

### Step 9 — Retro Trigger Check
- Rod caught something in the browser? → 5 Whys + retro this session
- False green detected? → retro this session
- Pending scenario count increased? → explain why, get approval
- All good? → log metrics, continue

---

## Non-Negotiable Rules

### PUSH Rule
Run `npm run pipeline` after any change to index.html, pipeline/, bug fix, or feature.
GREEN = commit + push. Never push red.

### SINGLE FILE Rule
One index.html at repo root only. Before any file operation:
```bash
find . -name "index.html" | grep -v node_modules
```
More than one result = stop, flag, do not proceed.

### REVERT Rule
Before reverting any commit: check whether pipeline/ files changed in that commit.
pipeline/ and index.html must stay in sync.
Never revert one without checking the other.

---

## Architecture Rules

- Single index.html — all HTML, CSS, JS in one file
- Module pattern: `const ModuleName = (() => { ... })();`
- No framework, no build step, no bundler
- API calls go via Cloudflare Worker — never directly to api.anthropic.com from browser
- No API key ever in frontend code or browser storage
- summariseFromState() must be deterministic — same input always produces same output

---

## Approved Gherkin Awaiting Code (as of 2026-02-28)

28 scenarios approved, no code written yet. Implement in this order:

1. **Cloudflare Worker** (7 scenarios) — architectural, unblocks everything
2. **Irony Authenticity** (11 scenarios) — 12th scoring dimension + Isn't It Ironic tab
3. **Panel Character State** (10 scenarios) — event log, intensity, decay, spike

Full scenario text in retrospectives/session-retro-2026-02-28.md.

---

## Yak Shaving Rule
If current task has drifted from original goal: name it, set 20-minute limit.
If not resolved in 20 minutes: revert, ask a better question.

---

## ⛔ SESSION END — MANDATORY BEFORE CLOSING

Every session, before closing:

1. Write a retrospective per .claude/standards/retrospectives.md
2. Save to retrospectives/session-retro-YYYY-MM-DD.md
3. Commit and push
4. Add file path to Documentation Registry in MEMORY.md

No session ends without a committed retrospective. No exceptions.

---

## 📚 Documentation Registry Rule

When you create any new doc, diagram, schema, or guide — add it to the Documentation Registry in MEMORY.md immediately. Do not wait until end of session.
