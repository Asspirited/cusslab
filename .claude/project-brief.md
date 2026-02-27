# Heckler and Cocks — Full Project Brief
> Load this at the start of every session. It supersedes CLAUDE.md where they overlap.
> Last updated: 2026-02-27

---

## 1. What This Project Is

**Heckler's** (public name) / **Heckler and Cocks** (working name) is a comedy panel analyser.
It presents nine comedian-style AI personas who respond to user questions and argue with each other.
Hosted at: https://asspirited.github.io/cusslab

The codebase folder is also named `cusslab` — a leftover from an earlier profanity-analysis concept.
Do not confuse the folder name with the product.

**Stack:** Vanilla JS, single HTML file (`index.html`, ~8600 lines), GitHub Pages.
No build step. No npm dependencies in the app itself. No backend. Everything lives in `index.html`.

**API:** Anthropic `claude-sonnet-4-20250514` via direct browser fetch with the header
`anthropic-dangerous-direct-browser-access: true`. API key stored in localStorage.

**Pipeline tooling** uses Node.js (installed via nvm, no sudo). Run `source ~/.nvm/nvm.sh` before any `node`/`npm` command.

---

## 2. Repository

- **Remote:** `https://github.com/Asspirited/cusslab` (main branch, auto-deploys to Pages)
- **Local:** `~/cusslab/`
- **Windows downloads path:** `/mnt/c/Users/roden/Downloads/` (username is `roden`, not `rodent`)
- **Linux username:** `rodent`

---

## 3. File Structure

```
~/cusslab/
├── index.html              — Full application (~8600 lines, single file)
├── CLAUDE.md               — Project brief + Non-Negotiable Gates
├── STANDARDS.md            — Full development standards (Lean, DORA, TDD, BDD, etc.)
├── 5-WHYS.md               — Bug log with root cause analysis
├── package.json            — Pipeline scripts (npm run pipeline = node pipeline/run-all.js)
├── .gitignore              — Excludes metrics/*.jsonl, metrics/session-counter.txt, node_modules/
├── pipeline/
│   ├── run-all.js          — Orchestrator: runs all steps, times them, writes builds.jsonl, runs metrics-report
│   ├── ui-audit.js         — 10 structural checks (panel registration, nav integrity, DOM elements)
│   ├── browser-sim.js      — 15 checks (syntax, loading order, tab wiring, API connectivity)
│   ├── unit-runner.js      — Pure-function unit tests for pipeline/logic.js
│   ├── gherkin-runner.js   — Mock-based Gherkin runner for specs/*.feature files
│   ├── coverage.js         — Coverage report (scenario count × calibration formula)
│   ├── metrics-report.js   — Reads metrics/*.jsonl, prints Metrics Summary
│   └── logic.js            — Pure functions: maskKey(), isValidKey(), shouldUpdateInput()
├── specs/
│   ├── settings.feature    — API key management scenarios (4 scenarios)
│   ├── panel-init.feature  — App initialisation scenarios (4 scenarios)
│   ├── api-errors.feature  — Error message scenarios (5 scenarios)
│   └── key-lifecycle.feature — Key clear/replace lifecycle (3 scenarios)
├── tests/
│   └── stub.test.js        — Jest stub (orphaned after switch to custom runners — do not delete)
├── metrics/
│   ├── build-schema.json   — Schema for builds.jsonl records (COMMITTED)
│   ├── defect-schema.json  — Schema for defects.jsonl records (COMMITTED)
│   ├── root-cause-taxonomy.json — Full root-cause taxonomy tree (COMMITTED)
│   ├── builds.jsonl        — Build telemetry, one record per run (LOCAL ONLY, gitignored)
│   ├── defects.jsonl       — Defect records BUG-001..006 (LOCAL ONLY, gitignored)
│   └── session-counter.txt — Auto-incrementing session number (LOCAL ONLY, gitignored)
└── retrospectives/
    └── README.md           — Retro format (triggered every 5th session or after Rod-caught bug)
```

---

## 4. Pipeline

**Run:** `npm run pipeline` → `node pipeline/run-all.js`

**Steps and output format for parsing:**
| Step | Script | Summary line |
|------|--------|-------------|
| UI Audit | ui-audit.js | `UI Audit: N/10 checks passing` |
| Browser Sim | browser-sim.js | `Browser Sim: N/15 checks passing` |
| Unit Tests | unit-runner.js | `Unit Tests: 17/17 passing` |
| Gherkin | gherkin-runner.js | `Gherkin: N/N scenarios passing` |
| Coverage | coverage.js | `Statement coverage: N%` / `Branch coverage: N%` |

**Coverage minimums:** 40% statements, 30% branches (formula: `scenarios × 3` stmt, `scenarios × 2` branch).
**Current scenario count:** 16 → 48%/32% — PASS.

**After coverage:** `metrics-report.js` always runs, reads both JSONL files, prints Metrics Summary.

**GREEN = commit and push automatically. RED = stop, fix, do not push.**

---

## 5. Non-Negotiable Gates (from CLAUDE.md)

### Gherkin Scenario Review Gate
Before running the pipeline on any new or modified Gherkin scenario:
1. Output the COMPLETE literal text of every new or modified scenario to the terminal
2. Print "WAITING FOR ROD'S APPROVAL — do not proceed until Rod confirms"
3. Stop. Do not run the pipeline. Do not fix code. Do not commit.
4. Wait for Rod to explicitly type "approved" or provide feedback
5. Only proceed after explicit approval

This gate cannot be skipped, summarised, or assumed.

### Pre-Implementation Checklist (Hard Gate)
Before any implementation code, written answers to:
1. Entry points — every way this code gets invoked
2. Prerequisites — what must exist before this runs
3. User outcomes — what the user sees in every case
4. Silent failure modes
5. Failing tests written first that will fail until implementation is correct

### 5 Whys Gate
Every bug gets root cause analysis in 5-WHYS.md **before** any fix is applied.

---

## 6. Development Standards Summary

Full detail in STANDARDS.md. Summary:

**TDD:** Write the failing test first. Always. Test → Red → Green → Refactor. No exceptions.

**BDD:** Gherkin scenario committed and FAILING before any implementation. Scenarios describe
observable user behaviour (DOM state: `element.value`, `textContent`, `classList`) — never code internals.

**SOLID:** Applied within single-file constraint. API.call() is the only fetch dependency.
Every catch must log with context, show a user message, or rethrow. Empty `catch(e) {}` is forbidden.

**Clean Code:** Functions max 20 lines. No magic strings. No commented-out code.

---

## 7. Lean + DORA

**Lean 7 Wastes mapped:**
- Defects → all 6 bugs Rod-caught = 100% waste. Target: Rod-caught = 0.
- Relearning → biggest waste. This brief is the fix.
- Gherkin written reactively (after bugs) is the systemic failure. Fix: Gherkin is always first.

**DORA Elite Targets:**
- Deployment frequency: multiple times/week → daily → multiple times/day
- Lead time: under 1 hour for bugs
- Change failure rate: under 5%
- Rework rate: zero

**Retrospective:** every 5th session or immediately after any Rod-caught bug.
File: `retrospectives/session-N.md`. Format defined in STANDARDS.md section 12.

---

## 8. Bug Tracker (current state)

See `5-WHYS.md` for full analysis. Summary:

| ID | Symptom | Status | Rod-caught | False Greens |
|----|---------|--------|------------|--------------|
| BUG-001 | Bills panel crash on first API call | CLOSED | Yes | 0 |
| BUG-002 | App crash after settings changes | CLOSED | Yes | 0 |
| BUG-003 | Submit buttons not connected | CLOSED | Yes | 0 |
| BUG-004 | Empty catch swallows HTTP errors | CLOSED | Yes | 0 |
| BUG-005 | Generic API error on all failures | **OPEN** | Yes | 0 |
| BUG-006 | API key input reverts after save | CLOSED | Yes | 2 |

**Rod-caught count: 6. Target next session: ≤ 5 (via pipeline catching at least one before Rod).**

**BUG-005 fix is pending.** Gherkin scenarios written in `specs/api-errors.feature`. Fix not yet applied to panel modules. Each panel's catch clause must call `API._userMessage()` (or expose it publicly) and display the result.

**BUG-006 notes:** Root cause is `missing-scenario / dom-state-not-tested`. The Gherkin scenario
passed because the mock had the fix already embedded — actual DOM state was never asserted.
Two false-green pipeline runs. Fix committed (activeElement guard in `updateKeyStatus()`).
New scenario should test observable DOM: after clicking Save, `inp.value === masked(new key)`.

---

## 9. Key API Module Details (index.html)

```
API module: lines ~3074–3314 (IIFE, const API = (() => {...})())
  getKey()          → reads from localStorage 'hecklers_api_key'
  setKey(k)         → stores trimmed key, calls updateKeyStatus()
  updateKeyStatus() → updates header indicator + textarea + status detail + error log
                      Guard at line 3249: if (inp && document.activeElement !== inp)
  initKeyUI()       → calls updateKeyStatus() (called once from App.init())
  _logError()       → logs to console + writes to error log in localStorage
  _writeErrorLog()  → appends to 'hecklers_error_log', calls updateKeyStatus()
  call()            → async fetch to Anthropic API, calls updateKeyStatus() on success
  _userMessage()    → returns specific, actionable user-facing error strings
  clearErrorLog()   → removes error log, calls updateKeyStatus()

Global wrapper (line 8221): function setKey(k) { API.setKey(k); }
App.init() (line 3554–3572): calls API.initKeyUI(), switchTab(), all module inits
App.init() called at line 8227: App.init()

Settings panel HTML: lines 1611–1677
  textarea#settings-key-input — API key input (height:80px, monospace)
  Save Key button onclick (lines 1634–1645): reads input, calls setKey(k), sets message, sets masked value
  Clear Key button onclick (lines 1648–1655): calls setKey(''), clears input
  #settings-save-msg — feedback message element
  #settings-status-detail — connection status detail
  #settings-error-log — error log section (rendered by _renderErrorLogUI)
```

---

## 10. Gherkin Mock Architecture

`pipeline/gherkin-runner.js` uses a pure JavaScript mock (no DOM, no JSDOM).

`createContext()` provides: mock localStorage (`store`), mock DOM elements (`dom`), mock activeElement (`active`).

Key mock functions:
- `updateKeyStatus()` — mirrors real function, has the Bug 6 fix embedded (`active !== 'settings-key-input'`)
- `clickSaveKey()` — mirrors Save Key button onclick
- `openSettingsTab()` — calls updateKeyStatus()

**Known limitation:** The mock tests internal mock state, not real DOM properties. This is why
BUG-006 produced 2 false greens — the mock was written with the fix embedded before the scenario
was written to catch the absence of the fix. Future scenarios must assert `element.value`,
`element.textContent`, and `element.classList` — not mock variables.

---

## 11. Metrics System

Introduced in current session. Schema files committed; data files local only.

**builds.jsonl:** One record per `npm run pipeline` run.
Fields: timestamp, session (auto-incremented), per-step durationMs + status + detail, totalDurationMs, overallStatus (GREEN/RED), caughtBy (always "pipeline" for automated runs).

**defects.jsonl:** One record per bug. Seeded with BUG-001 through BUG-006.
Fields: id, title, discoveredBy, discoveredSession, fixedSession, criticality, rootCause.{category,subcategory}, processFailures[], falseGreens.

**root-cause-taxonomy.json:** Four top-level categories:
- `test-confirmed-code` (subcategories: written-after-implementation, happy-path-only, mock-not-dom)
- `missing-scenario` (subcategories: dom-state-not-tested, async-path-not-tested, error-path-not-tested, focus-state-not-tested)
- `defect-in-implementation` (logic-error, missing-guard, wrong-scope, race-condition)
- `process` (three-amigos-skipped, scenario-tested-mock-not-dom, no-pre-impl-checklist, gherkin-written-reactively)

**Recurrence flag:** any subcategory appearing in ≥ 3 bugs → `[recurring ▲]` in metrics report.

---

## 12. Session Start Checklist

Every session, in this order:
1. `source ~/.nvm/nvm.sh`
2. `cd ~/cusslab`
3. Read this file and STANDARDS.md
4. `npm run pipeline` → produce Pipeline Passing Report + Defect + DORA Report
5. Review `5-WHYS.md` — any open bugs? Any pending Gherkin?
6. Review `node pipeline/metrics-report.js` output
7. State the task. Apply Pre-Implementation Checklist before any code.

**Standard handoff template (Claude.ai → Claude Code):**
```
Read CLAUDE.md, STANDARDS.md, and .claude/project-brief.md.
Run npm run pipeline. Produce the Pipeline Passing Report and Defect + DORA Report.
Then: [specific task with full symptom description].
The 5 Whys is [documented in 5-WHYS.md / as follows: ...].
Answer the pre-implementation checklist explicitly before writing any code.
Write the Gherkin scenario first in specs/, show it to Rod for approval,
then fix, run the full pipeline, confirm GREEN, commit and push.
```

---

## 13. What Must Never Happen

- Writing code before the Gherkin scenario exists and is approved
- Running the pipeline before showing Rod any new/modified scenario
- Marking a bug CLOSED without a passing Gherkin scenario at Why-1 level
- Writing a Gherkin scenario that tests mock state instead of observable DOM properties
- Pushing when the pipeline is RED
- Skipping the 5 Whys before applying a fix
- Skipping the pre-implementation checklist
- Empty `catch(e) {}` in the API module
- Using `document.alert()` or non-specific error messages
- Assuming a previous session's approval is still valid in this session
