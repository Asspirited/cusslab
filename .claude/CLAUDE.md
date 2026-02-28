# CLAUDE.md — Heckler and Cox
# Operational rules for Claude Code sessions
# Last updated: 2026-02-28

---

## Session Start (mandatory, before any code)

1. Read this file and all files in .claude/standards/
2. Run `npm run pipeline` — produce scorecard
3. Report: pass/fail per step, coverage %, pending scenario count
4. Only then: work

---

## Non-Negotiable Rules

### SINGLE FILE RULE
There is exactly one index.html — at the repo root.
Before any file operation run:
```bash
find . -name "index.html" | grep -v node_modules
```
If more than one result: stop, flag immediately, do not proceed.

### REVERT RULE
Before reverting any commit, check whether pipeline/ files changed in that commit.
pipeline/ and index.html must always stay in sync.
A revert that touches index.html must also account for any pipeline changes in the same commit range.
Never revert one without checking the other.

### PUSH RULE
Run `npm run pipeline` after any change to:
- index.html
- Any file in pipeline/
- Any bug fix
- Any feature addition
GREEN pipeline = commit + push. Never push a red pipeline.

---

## BDD Gate (enforced, no exceptions)

The sequence is always:
1. Write Gherkin scenario
2. Rod reads it
3. Rod types "approved"
4. Write the code

No code before approval. No exceptions. No "I'll write the scenario after."
If a scenario is missing for existing behaviour — write it before touching that code.
Pending scenario count must decrease or hold. It must never increase.

---

## Pipeline (5 steps, zero tolerance)

| Step | Command | Must pass |
|------|---------|-----------|
| 0 UI Audit | pipeline/ui-audit.js | 10 structural checks |
| 1 Browser Sim | pipeline/browser-sim.js | 15 behaviour checks |
| 2 Unit Tests | pipeline/unit-runner.js | All unit tests |
| 3 Gherkin/BDD | pipeline/gherkin-runner.js | All scenarios |
| 4 Coverage | pipeline/coverage.js | Stmt ≥70%, Branch ≥70% |

All 5 must be green. A partial green is a red.

---

## TDD Cycle (7 steps, always)

1. Write failing test
2. Confirm it fails for the right reason
3. Write minimum code to pass
4. Confirm it passes
5. Refactor
6. Confirm still passes
7. Repeat

Never write implementation before a failing test exists.

---

## Clean Code Rules

- Functions: 20 lines maximum
- No magic strings — extract to named constants
- No mock-based tests for DOM state — use JSDOM for real DOM testing
- Comments explain why, not what
- Honest naming — no abbreviations that obscure intent
- Single Responsibility — one reason to change per function

---

## Architecture Rules

- Single index.html — all HTML, CSS, JS in one file
- Module pattern: `const ModuleName = (() => { ... })();`
- No framework, no build step, no bundler
- API calls go via Cloudflare Worker — never directly to api.anthropic.com from browser
- No API key ever in frontend code or browser storage
- summariseFromState() must be deterministic — same input always produces same output

---

## Character State Rules

- Event log is the single source of truth for panel character state
- summariseFromState() derives prompt prefix — no API call required
- State resets on new session — no persistence across sessions
- Intensity rules:
  - New trigger: intensity += delta
  - Round with no trigger: intensity -= decay_rate (floor: baseline = 20% of peak)
  - Repeat trigger: delta doubles, spikes above previous peak

---

## Panel Rules

- Four panel members: Heckler, Suit, Hippy, Realist
- Do not add a fifth panel member until real use reveals a perspective gap none of the four can fill
- Panel trigger sensitivity profiles live in .claude/project-brief.md
- Debate mode: panels respond to each other, track conflicts and concessions
- Roast mode: panels respond to input, no inter-panel conflict events opened

---

## Yak Shaving Rule

If the current task has drifted from the original goal, name it:
"This is yak shaving."
Set a 20-minute limit. If not resolved in 20 minutes: revert, ask a better question.

---

## DORA Metrics

Track in metrics/builds.jsonl and metrics/defects.jsonl.
The single most important ratio: caughtBy: rod vs caughtBy: pipeline.
Rod-caught bugs = pipeline failure = systemic issue = retrospective required.
Target: pipeline catches everything before Rod sees it.

---

## Retrospective Triggers

- Every session (mandatory)
- After any Rod-caught bug (mandatory)
- Any metric trending wrong 2+ sessions (triggered)
Output to: retrospectives/session-N.md (N = session number from pipeline output)

---

## ⛔ SESSION END — MANDATORY BEFORE CLOSING

Every session, before closing:

1. Write a retrospective in the format defined in `.claude/standards/retrospectives.md`
2. Save it to `retrospectives/session-N.md` where N = current session number (from pipeline output)
3. Include the date in the file header
4. Commit and push
5. Add the file path to the Documentation Registry in MEMORY.md

No session ends without a committed retrospective. No exceptions.
If Rod ends the session abruptly, write and commit it anyway.

---

## 📚 Documentation Registry Rule

When you create any new doc, diagram, schema, or guide — add it to the Documentation Registry in MEMORY.md immediately. Do not wait until end of session.

---

## Approved Gherkin Awaiting Code (as of 2026-02-28)

28 scenarios approved, no code written yet. Implement in this order:

1. **Cloudflare Worker** (7 scenarios) — architectural, unblocks everything
2. **Irony Authenticity** (11 scenarios) — 12th scoring dimension + Isn't It Ironic tab
3. **Panel Character State** (10 scenarios) — event log, intensity, decay, spike

Full scenario text in retrospectives/session-22.md and session history.
