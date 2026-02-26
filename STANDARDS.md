# Heckler and Cocks — Development Standards

> Read at the start of every session before any code is written.
> Claude proposes changes. Rod has final say.
> Last reviewed: 2026-02-26

---

## THE CORE PROBLEM (why this document exists)

The following disciplines were agreed early in this project: TDD, BDD, SOLID, Clean Code.

They were not followed. The result was false progress — code that appeared to work, tests written to match broken implementations, bugs that only surfaced at release. Every bug was caught by Rod, not by tests. That is the definition of a failing test strategy, and it cost Rod time and money.

This document makes these disciplines non-negotiable. Not targets. Not guidelines. The only acceptable way to work.

---

## MANDATORY REPORTS — Every Session Start and Every Build

Run these commands first, every session, no exceptions:

  cat STANDARDS.md
  npm test
  node pipeline/coverage.js
  node pipeline/ui-audit.js
  node pipeline/browser-sim.js

Then produce both reports before any implementation.

### Report 1 — Pipeline Passing Report

  ╔══════════════════════════════════════════════════════╗
  ║  PIPELINE REPORT — [date] [time]                     ║
  ╠══════════════════════════════════════════════════════╣
  ║  Step 0  UI Audit        [PASS/FAIL]   N/10 checks  ║
  ║  Step 1  Browser Sim     [PASS/FAIL]   N/15 checks  ║
  ║  Step 2  Unit Tests      [PASS/FAIL]   N/N passing  ║
  ║  Step 3  Gherkin / BDD   [PASS/FAIL]   N/N passing  ║
  ║  Step 4  Coverage        [PASS/FAIL]               ║
  ║          statements N%  (min 40%)                   ║
  ║          branches   N%  (min 30%)                   ║
  ╠══════════════════════════════════════════════════════╣
  ║  OVERALL  [GREEN - ready to ship / RED - blocked]   ║
  ╚══════════════════════════════════════════════════════╝

  Last session compliance:
    TDD followed:              Yes / No — [if No, what was skipped]
    Gherkin before code:       Yes / No — [if No, what was missing]
    Pre-impl checklist done:   Yes / No — [if No, what was skipped]
    Violations:                [list or "none"]

GREEN = all steps pass, coverage above minimums, zero failing tests, zero failing Gherkin scenarios.
RED = any step fails. Work stops. Fix the failure before anything else.
If GREEN → commit and push automatically. No manual deployment step.

### Report 2 — Defect + DORA Report

  ╔══════════════════════════════════════════════════════════════╗
  ║  DEFECT + DORA REPORT — [date] [time]                        ║
  ╠══════════════════════════════════════════════════════════════╣
  ║  DEFECTS                                                     ║
  ║  Open bugs:             N                                    ║
  ║  Pipeline-caught:       N  (caught by tests before Rod)      ║
  ║  Rod-caught:            N  (found by Rod before tests) ← KEY ║
  ╠══════════════════════════════════════════════════════════════╣
  ║  ID  | Symptom              | Status   | 5 Whys done?       ║
  ║  ----+----------------------+----------+------------------- ║
  ║  B5  | Generic API error    | OPEN     | Yes                ║
  ║  B6  | Key save reverts     | IN PROG  | Yes                ║
  ╠══════════════════════════════════════════════════════════════╣
  ║  DORA METRICS                                                ║
  ║  Deployment frequency:   N deploys this week                 ║
  ║  Lead time (last fix):   N hours from commit to live         ║
  ║  Change failure rate:    N% deploys caused Rod-caught bug    ║
  ║  Rework rate:            N unplanned fix deploys this week   ║
  ╠══════════════════════════════════════════════════════════════╣
  ║  Pending Gherkin scenarios:  N  (must decrease each session) ║
  ║  Uncovered gaps (top 3):                                     ║
  ║    1. [area]                                                 ║
  ║    2. [area]                                                 ║
  ║    3. [area]                                                 ║
  ╚══════════════════════════════════════════════════════════════╝

Rod-caught count must only ever go down.
Any increase = process failure = immediate 5 Whys before any other work.

DORA elite targets:
  Deployment frequency:  multiple times per week minimum, daily target
  Lead time:             under 1 hour for bugs, under 1 day for features
  Change failure rate:   below 5%
  Rework rate:           zero

Every 5th session: review DORA trend. If not improving, find the systemic cause. Do not hide it.

---

## 1. TDD — Non-Negotiable

Write the failing test first. Always. No exceptions.

The sequence — no deviation:
  1. Understand the requirement
  2. Write a test that will FAIL because the code does not exist yet
  3. Run it — confirm it fails for the right reason
  4. Write the MINIMUM code to make it pass — nothing more
  5. Run all tests — confirm nothing regressed
  6. Refactor — tests still pass
  7. Move to the next requirement

What has been happening instead (must stop):
Writing code, then writing tests to confirm the code works. This is transcription, not testing.
Tests written after code pass even when the code is wrong, because they were written to match it.
Every production bug in this project followed this pattern.

What counts as a test:
  - Unit test: a named suite in unit-runner.js testing a pure function
  - Browser sim check: a structural assertion in browser-sim.js
  - Gherkin scenario: an executable .feature file in /specs
  - NOT a test: "I checked it manually", "the logic looks right", "the pipeline passes"

If you cannot write the test first, you do not understand the requirement. Stop. Clarify. Do not write code.

---

## 2. BDD — Non-Negotiable

Gherkin scenario committed and failing before any implementation begins.
Gherkin is the FIRST artefact of any feature — not the last.

Scenario quality — describe observable user behaviour, not code internals:

  # Good
  Scenario: User sees actionable message when API key is rejected
    Given an invalid API key is saved
    When I click Ask The Panel
    Then I should see "API key rejected — check your key in Settings"
    And I should not see "unavailable"

  # Bad — describes code internals
  Scenario: setKey() validates key length
    When setKey() is called with a string shorter than 20 chars
    Then it should return false

A feature is not done until:
  - At least one Gherkin scenario passes
  - The happy path is covered
  - At least one failure/error path is covered
  - The scenario existed BEFORE the code

Pending is debt, not a placeholder. Pending count must decrease each session, never increase without a plan.

---

## 3. Pre-Implementation Checklist — Hard Gate

Produce written answers to all 5 before writing any implementation code.
Skipping this checklist caused Bugs 3, 4, and 5.

  1. Entry points — every way this code gets invoked
     (button click, page load, refresh, error recovery, first visit, return visit)
  2. Prerequisites — what must exist before this runs
     (modules declared? DOM ready? API key present? State initialised?)
  3. User outcomes — what does the user see in every case
     (success, failure, loading, empty state, error state)
  4. Silent failure modes
     (loading order, duplicate declarations, missing registrations, uncaught async errors, wrong scope)
  5. Failing tests — the specific tests written first that will fail until implementation is correct

If you cannot answer all five, you do not understand the requirement. Stop.

---

## 4. 5 Whys — Every Bug Gets Root Cause Analysis Before the Fix

  Bug: [what the user saw]
  Why 1: [immediate cause]
  Why 2: [what allowed it]
  Why 3: [what process failure enabled that]
  Why 4: [what discipline was not applied]
  Why 5: [root behavioural cause]
  Test added at: Why [N] level

Entry goes into 5-WHYS.md before any fix is applied.
The fix without the analysis is not acceptable.

---

## 5. Pipeline Gates — Zero Tolerance

Pipeline must pass before any file goes to Rod. No exceptions.

  Step 0: UI Audit       — panel registration, nav integrity (10 checks)
  Step 1: Browser Sim    — syntax, loading order, tab wiring, API connectivity (15 checks)
  Step 2: Unit Tests     — all suites, 0 failing
  Step 3: Gherkin / BDD  — 0 failing scenarios
  Step 4: Coverage       — must meet minimums

Coverage minimums:
  logic.js (unit):     statements 80%  branches 70%
  index.html (gherkin): statements 30%  branches 25%
  Combined:            statements 40%  branches 30%

Zero tolerance — never ships broken:
  - JS syntax valid
  - No inline <script> in body referencing app modules before declaration
  - No duplicate module declarations
  - All panels in SKIN_CONFIGS and NAV_GROUP_MAP
  - Every action button connects to a module with at least one API call

If pipeline is GREEN → commit and push immediately. No manual step.
If pipeline is RED → stop. Fix. Do not push.

---

## 6. Always Give Specific Instructions (Claude.ai → Claude Code)

Claude.ai must always provide the exact instruction to paste.
Never say "paste the instruction" without including it verbatim.

Standard handoff template:

  Read CLAUDE.md and STANDARDS.md, run npm test, node pipeline/coverage.js,
  node pipeline/ui-audit.js, node pipeline/browser-sim.js.
  Produce the Pipeline Passing Report and Defect + DORA Report.
  Then: [specific task with full symptom description].
  The 5 Whys is [documented in 5-WHYS.md / as follows: ...].
  Answer the pre-implementation checklist explicitly before writing any code.
  Write the Gherkin scenario first in specs/, then fix, run the full pipeline,
  confirm GREEN, then commit and push with a conventional commit message.

---

## 7. SOLID

Single Responsibility: One module, one job. If you need "and" to describe it, split it.
  Active violations: _applySkin (handles title+tabs+panels+slogans), embedded prompt strings.

Open/Closed: New panels addable without modifying existing logic.
  Use SKIN_CONFIGS + NAV_GROUP_MAP pattern every time.

Liskov Substitution: All API-calling modules handle errors the same way. None swallow errors silently.

Interface Segregation: Modules expose only what callers need. Internal helpers stay private.

Dependency Inversion: Modules depend on API.call, not fetch directly.

Pragmatic constraint: The app is a single HTML file. SOLID applies within this constraint —
logical separation even without physical separation. Known trade-off, not a licence to ignore the principles.

---

## 8. Clean Code

  - Functions max 20 lines — if longer, split into named sub-functions
  - One level of abstraction — orchestration or detail, not both
  - No magic strings — panel IDs, tab names, status codes defined as constants
  - Every catch must: log with context, show a user message, or rethrow with context
  - Empty catch(e) {} is forbidden
  - Every user-facing error answers: what happened, and what should the user do
  - "[This expert is unavailable.]" is a hidden failure, not an error message — forbidden
  - No commented-out code — delete it, git preserves history
  - Honest naming — a function's name must accurately describe everything it does

---

## 9. Lean Principles — Applied to This Project

Based on Poppendieck's 7 principles.

### Eliminate Waste

The 7 software wastes mapped to this project:

  Partially done work  → Close open bugs before starting new features. Unfinished work is inventory waste.
  Extra features       → Before any new feature: does this add user value? Unvalidated features are waste.
  Relearning           → Biggest current waste. Project brief + CLAUDE.md are the fix. Keep them current.
  Handoffs             → Claude.ai → Claude Code handoff is manual. Specific instruction template reduces this.
  Delays               → Caused by context rebuilding, not complexity. Automated session start reduces this.
  Task switching       → One problem per session. Protect focused work.
  Defects              → All 6 bugs Rod-caught = 100% defect waste. Pipeline catches before Rod. Target: Rod-caught = 0.

### Build Quality In

Quality cannot be tested in at the end — it must be built in from the start.
TDD and BDD are the mechanism. The pre-implementation checklist is the gate.
The pipeline is a safety net, not the primary quality mechanism.

### Amplify Learning

The 5 Whys log is the learning system. All 6 bugs trace to the same Why 5 — this means
the diagnosis is correct and compounding. Keep the log current. Review it at session start.

Retrospective every 5th session:
  - Has Rod-caught count gone down?
  - Has lead time improved?
  - Are DORA metrics trending toward elite?
  - Are standards being followed or worked around?
  If not improving, find the systemic cause. Do not paper over it.

### Defer Commitment

Phase 1 single-file approach correctly defers backend decisions until needed.
Do not over-architect prematurely. Phase 2 split happens when the single file
becomes unmanageable, not before.

### Deliver Fast

Every manual step between "code written" and "live on GitHub Pages" is Lean waste.
Target: sub-1-hour bug fixes, sub-1-day features, automated push on green pipeline.

### Respect People

Rod sets direction. Rod has final say. Disagreements are raised explicitly, not worked around silently.

### Optimise the Whole

Full value stream: idea → Gherkin → code → pipeline → deploy → Rod uses it → DORA metrics updated.
Weakest link: Gherkin written reactively after bugs, not proactively before features.
Fix: Gherkin is the first artefact. Always.

---

## 10. DORA Metrics

Based on 2024/2025 DORA State of DevOps research.

  Metric                        What it measures                    Elite target
  ────────────────────────────────────────────────────────────────────────────
  Deployment frequency          How often code reaches production   Multiple times/day
  Lead time for changes         Commit to live                      Under 1 hour
  Change failure rate           % deploys causing Rod-caught issues Under 5%
  Failed deployment recovery    Time to recover after bad deploy    Under 1 hour
  Rework rate                   Unplanned fix deploys               Zero

Key DORA findings relevant to this project:
  - Throughput and stability improve together — same practices deliver both
  - AI tools increase batch size risk — small, tested, pipeline-verified commits are correct pattern
  - Automated pipelines that don't require manual intervention outperform manual processes
  - Psychological safety (honest failure acknowledgement) is among strongest performance predictors

DORA improvement path:
  Now:     Automate push on green, track metrics in every report, get Rod-caught to zero
  Phase 2: GitHub Actions CI/CD, staging environment, Sentry error tracking
  Phase 3: Full observability, CloudWatch alarms, sub-1-hour recovery SLA

---

## 11. Approved Changes History

  Date        Change                                              Approved by
  ──────────────────────────────────────────────────────────────────────────
  2026-02-26  Initial standards document                          Rod
  2026-02-26  Zero-tolerance: action buttons must connect to      Rod
              API-calling modules
  2026-02-26  Pre-implementation checklist mandatory              Rod
  2026-02-26  Honest account of TDD failures — section 1         Rod
  2026-02-26  Lean 7 principles mapped to project                 Rod
  2026-02-26  DORA 5 metrics adopted, tracked in every report     Rod
  2026-02-26  Automated push on green pipeline — no manual steps  Rod
  2026-02-26  Retrospective every 5th session mandatory           Rod
  2026-02-26  Always give specific instructions standard          Rod
