# Lean & DORA Standards — Heckler and Cocks

---

## Lean Software Development — 7 Principles

*Poppendieck & Poppendieck, applied to this project.*

### 1. Eliminate Waste

Seven software wastes mapped to this project:

| Waste | Current State | Action |
|-------|--------------|--------|
| Partially done work | Open bugs = inventory waste | Close before opening new work |
| Extra features | ✅ Well-scoped | Maintain |
| Relearning | Every session rebuilds context — BIGGEST WASTE | CLAUDE.md + .claude/ structure |
| Handoffs | Manual lossy Claude.ai → Claude Code | Standardised handoff template |
| Delays | Bug fix delayed by context rebuild | Pipeline auto-runs at session start |
| Task switching | ✅ Focused sessions | Maintain |
| Defects | All 6 bugs Rod-caught = 100% defect waste | Rod-caught count must trend to zero |

### 2. Build Quality In

Quality is not bolted on by the pipeline. Quality is built in at the point of creation.
Pre-implementation checklist is a hard gate, not a guideline.
Gherkin scenario exists before code. Always.

### 3. Amplify Learning

5 Whys log is the learning mechanism. All 6 bugs share the same root cause —
tests confirmed code rather than defined contracts. Correct diagnosis.
Retrospective every 5th session reviews whether the diagnosis is changing.

### 4. Defer Commitment

Phase 1 single-file correctly defers backend until needed.
Phase 2 (AWS serverless) triggered only when Phase 1 hits limits.
Budget alert: £20/month before any AWS work begins.

### 5. Deliver Fast

Target cycle time:
- Bugs: < 1 hour from diagnosis to deployed fix
- Features: < 1 day from scenario approval to deployed feature

Manual deployment steps are waste. Pipeline GREEN = auto-push = GitHub Pages deploys.
No download, no upload, no manual git commands.

### 6. Respect People

Rod sets direction. Standards are trusted. Frustration is proportionate when
process fails. Failures are logged honestly — not hidden.

### 7. Optimise the Whole

Weakest link: Gherkin written reactively after bugs, not proactively before features.
Pipeline optimises code quality well. Context rebuilding between sessions is the
remaining systemic bottleneck.

---

## DORA Metrics — 5 Metrics with Elite Targets

*Accelerate — Forsgren, Humble, Kim. DORA 2024 research.*

| Metric | Elite Target | Current State | Trend |
|--------|-------------|---------------|-------|
| Deployment frequency | Multiple/week minimum | Irregular, manual | Improving |
| Lead time for changes | <1 hour bugs, <1 day features | Hours (context rebuild overhead) | Improving |
| Change failure rate | <5% | ~100% (all 6 bugs Rod-caught) | Must improve |
| Failed deployment recovery | <1 hour | Fast once diagnosed | OK |
| Rework rate (2024) | Zero | High — every Rod-caught = unplanned rework | Must improve |

### What DORA 2024 Research Tells Us

- Throughput and stability improve together — same practices deliver both
- AI tools correlate with **worse** performance when they increase batch size
  Risk: Claude Code generating large changes without checklist discipline
- Psychological safety is the strongest performance predictor
  The standards document acknowledges failures honestly — this is correct
- Platform engineering: automated pipelines outperform manual processes
  Pre-push hook + auto-deploy on green are the right moves

### DORA Improvement Path

**Now:** Pipeline exists, auto-push on green, conventional commits
**Next:** Pre-push hook enforces pipeline on every push automatically
**Then:** Sentry for production error detection (reduces recovery time)
**Target:** Every metric trending toward elite within 10 sessions

---

## SOLID — Within Single File Constraint

**S — Single Responsibility**
Each IIFE module does one thing.
`_applySkin` currently violates this — on open items list.

**O — Open/Closed**
New panels added by extending panel config, not modifying core scoring.

**L — Liskov Substitution**
Panel objects are interchangeable — same interface, different personalities.

**I — Interface Segregation**
Panel-facing API is minimal. Panels don't receive more than they need.

**D — Dependency Inversion**
Scoring engine doesn't depend on Claude API directly.
API wrapper is injectable — testable in isolation.

---

## Clean Code Rules

- Functions: 20 lines maximum
- No magic strings — extract to named constants
- Honest naming — names describe what things actually do
- No empty catch blocks (except localStorage — acceptable browser pattern)
- Comments explain why, not what
- If you need a comment to explain what code does, rename it instead

---

## Development Flow

```
BDD (Gherkin scenario — Rod approves)
  ↓
TDD (failing unit test)
  ↓
Implementation (minimum code to pass)
  ↓
Pipeline (all steps green)
  ↓
Auto-push → GitHub Pages deploys
  ↓
Rod verifies in browser
```

Any step that happens out of this order is a process violation.
Log it. Fix it. Don't repeat it.

---

## Retrospective Cadence

Every 5th session: review DORA trend.
If metrics are not improving, state why. Do not hide it.
Each retrospective produces at most 3 specific changes to standards files.
Output committed to `retrospectives/session-N.md`.
