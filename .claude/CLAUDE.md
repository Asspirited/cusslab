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

## Non-Negotiable Gates

### BDD Gate
Sequence is always: Gherkin written → Rod reads it → Rod types "approved" → code written.
No code before approval. No exceptions.
Previous session approval does not count — Rod must approve in this session.
See .claude/standards/bdd.md for full gate procedure.

### Pipeline Gate
All 5 steps must be green before any commit or push.
A partial green is a red.
See .claude/project-brief.md for step definitions.

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
Never revert one without checking one another.

---

## Development Flow
BDD → TDD → Implementation → Pipeline → Auto-push → Rod verifies
Any step out of order = process violation. Log it. Fix it. Don't repeat it.

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
