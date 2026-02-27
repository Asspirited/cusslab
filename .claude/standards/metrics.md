# Metrics Standards — Heckler and Cocks

---

## Build Metrics — collected automatically every pipeline run

Append to `metrics/builds.jsonl` (one JSON object per line):

```json
{
  "timestamp": "ISO8601",
  "session": "integer",
  "steps": {
    "uiAudit":    { "durationMs": 0, "status": "pass|fail", "violations": 0 },
    "browserSim": { "durationMs": 0, "status": "pass|fail", "violations": 0 },
    "unitTests":  { "durationMs": 0, "status": "pass|fail", "passed": 0, "failed": 0 },
    "gherkin":    { "durationMs": 0, "status": "pass|fail", "passed": 0, "failed": 0 },
    "coverage":   { "durationMs": 0, "status": "pass|fail", "statements": 0.0, "branches": 0.0 }
  },
  "totalDurationMs": 0,
  "overallStatus": "GREEN|RED",
  "caughtBy": "pipeline|rod"
}
```

`caughtBy` is always "pipeline" for automated runs.
Changed to "rod" manually when Rod finds a bug in the browser.
This ratio is the single most important metric.

---

## Defect Metrics — one entry per bug

Append to `metrics/defects.jsonl`:

```json
{
  "id": "BUG-XXX",
  "title": "description",
  "discoveredBy": "rod|pipeline",
  "discoveredSession": 0,
  "fixedSession": 0,
  "leadTimeHours": 0.0,
  "falseGreens": 0,
  "criticality": "blocking|high|medium|low",
  "criticalityReason": "why this criticality",
  "userImpact": "blocking|degraded|cosmetic",
  "rootCause": {
    "category": "see taxonomy",
    "subcategory": "see taxonomy",
    "description": "specific description",
    "whyMissed": "why the pipeline didn't catch it",
    "recurrence": 0
  },
  "processFailures": ["list of process steps that failed"],
  "fixVerifiedBy": "rod-browser-test|pipeline",
  "preventedBy": "what process change prevents recurrence"
}
```

### Criticality levels
- `blocking` — product unusable for core journey
- `high` — feature broken, workaround exists but poor UX
- `medium` — cosmetic or edge case, main journey unaffected
- `low` — minor, no user impact

---

## Root Cause Taxonomy

```
missing-scenario
  ├── error-path-not-covered
  ├── dom-state-not-tested          ← Bug 6
  ├── async-race-not-covered
  └── edge-case-not-covered

test-confirmed-code                 ← Bugs 1-5
  ├── written-after-implementation
  └── tested-internal-not-observable

process-failure
  ├── three-amigos-skipped          ← Bug 6 false greens
  ├── checklist-not-answered
  └── scenario-not-reviewed-before-pipeline

architecture
  ├── insufficient-isolation
  └── timing-dependency
```

Recurrence > 1 in any subcategory = systemic failure = retrospective action required.
Add new subcategories when a bug genuinely doesn't fit existing ones.
Never force-fit.

---

## Metrics Report Format (every session)

```
METRICS SUMMARY — Session [N]
──────────────────────────────────────────────────────────
BUILD STABILITY (last 5 sessions):
  Avg total build time:    Xs  (trend: ↓ / → / ↑)
  Slowest step:            [step] (Xs avg)
  Pipeline failure rate:   N%   (target <5%)
  Flaky steps:             none / [step name]

DEFECT TRENDS:
  Total bugs to date:      N
  Rod-caught:              N (N%)   ← must trend down
  Pipeline-caught:         N (N%)   ← must trend up
  False greens to date:    N        ← must be 0
  Currently open:          N
  Avg lead time (fix):     Xh

CRITICALITY BREAKDOWN:
  Blocking: N  |  High: N  |  Medium: N  |  Low: N

ROOT CAUSE PATTERNS:
  test-confirmed-code:     N bugs
  missing-scenario:        N bugs
  process-failure:         N bugs
  [recurrence > 1 = flag for retrospective]
──────────────────────────────────────────────────────────
```

False greens are tracked separately from Rod-caught bugs:
- Rod-caught = pipeline had no scenario for it
- False green = pipeline had a scenario and it lied
The second is the worse failure. Track them separately.
