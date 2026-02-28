# DORA Metrics — Practices
# Heckler and Cox
# Last updated: 2026-02-28
# Principles: see .claude/principles/lean.md, systems-thinking.md
# Reference: Forsgren, Humble, Kim — Accelerate (2018)
# Reference: dora.dev — State of DevOps Reports

---

## The Four Metrics — How We Measure Them

### Deployment Frequency
**How:** count GREEN pipeline runs that result in a push per session
**Where:** metrics/builds.jsonl — field: timestamp
**Target:** multiple per session
**Current:** blocked by billing (2026-02-28)

### Lead Time for Changes
**How:** time from Rod identifies behaviour → pipeline GREEN
**Where:** metrics/builds.jsonl — fields: identified_at, deployed_at
**Target:** bugs <1hr, features <1 day
**Current:** approximately one session per feature

### Change Failure Rate
**How:** Rod-caught bugs ÷ total deployments × 100
**Where:** metrics/defects.jsonl — field: caughtBy (rod vs pipeline)
**Target:** <15%
**Current:** ~100%

### Time to Restore
**How:** time from Rod reports broken behaviour → pipeline GREEN on fix
**Where:** metrics/defects.jsonl — field: leadTime
**Target:** <1hr (steps 1-3 of recovery playbook)
**Current:** ~1 session

---

## The Single Most Important Ratio

```
caughtBy: pipeline
─────────────────  →  must trend toward 1.0
caughtBy: rod
```

Every session: report this ratio. If it is not improving, name the reason.

---

## metrics/builds.jsonl Format

One JSON object per line. Append only. Never edit.

```json
{
  "timestamp": "2026-02-28T14:23:00Z",
  "session": "2026-02-28",
  "result": "GREEN",
  "steps": {
    "ui_audit": "PASS",
    "browser_sim": "PASS",
    "unit_tests": "PASS",
    "gherkin": "PASS",
    "coverage": "PASS"
  },
  "coverage": { "statements": 74, "branches": 71 },
  "pending_scenarios": 28,
  "caughtBy": "pipeline"
}
```

---

## metrics/defects.jsonl Format

One JSON object per line per bug. Append only.

```json
{
  "id": "bug-7",
  "title": "Short description",
  "discoveredBy": "rod",
  "session": "2026-02-28",
  "leadTime": "2hr",
  "falseGreens": 0,
  "criticality": "blocking",
  "rootCause": "missing-scenario",
  "rootCauseSubtype": "dom-state",
  "caughtBy": "rod",
  "fixVerifiedBy": "pipeline",
  "preventedBy": "new scenario added"
}
```

---

## Root Cause Taxonomy

| Category | Subtypes |
|----------|---------|
| missing-scenario | error-path, dom-state, async-race, edge-case |
| test-confirmed-code | written-after-implementation, tested-internal-not-observable |
| process-failure | three-amigos-skipped, gherkin-not-approved, scenario-not-reviewed |
| architecture | insufficient-isolation, timing-dependency, missing-abstraction |

Recurrence >1 in any subcategory = systemic failure = retrospective required immediately.

---

## DORA Status Report (session start)

```
DORA STATUS — [date]
Deployment frequency:   n this session / n this week
Lead time (avg):        n hours
Change failure rate:    n% (n rod-caught / n total deployments)
Time to restore (avg):  n hours
caughtBy ratio:         pipeline:rod = n:n

Trend: IMPROVING / STABLE / DEGRADING
Primary constraint: [what is blocking improvement]
```
