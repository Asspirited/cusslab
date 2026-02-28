# CI/CD — Practices
# Heckler and Cox
# Last updated: 2026-02-28
# Principles: see .claude/principles/xp.md (continuous integration, small releases)
# Principles: see .claude/principles/lean.md (deliver fast, eliminate waste)

---

## The Pipeline — 5 Steps, Zero Tolerance

```bash
npm run pipeline
```

All 5 must pass. A partial green is a red. Never commit on a red pipeline.

| Step | Script | What it checks |
|------|--------|----------------|
| 0 UI Audit | pipeline/ui-audit.js | 10 structural checks — required elements present |
| 1 Browser Sim | pipeline/browser-sim.js | 15 behaviour checks — observable user flows |
| 2 Unit Tests | pipeline/unit-runner.js | All unit tests pass |
| 3 Gherkin/BDD | pipeline/gherkin-runner.js | All scenarios pass, pending count reported |
| 4 Coverage | pipeline/coverage.js | Statements ≥70%, Branches ≥70% |

GREEN = auto-commit + push = GitHub Pages deploys in ~2 minutes.

---

## When to Run the Pipeline

- After any change to index.html
- After any change to pipeline/ files
- After any bug fix
- After any feature addition
- At session start (scorecard)

Never run the pipeline to "see where we are" mid-implementation.
The pipeline runs when you believe the work is complete.

---

## SINGLE FILE Rule

One index.html at repo root. Before any file operation:

```bash
find . -name "index.html" | grep -v node_modules
```

More than one result = stop, flag, do not proceed.

---

## REVERT Rule

Before reverting any commit:
1. Check `git show <commit> --name-only` — did pipeline/ files change?
2. If yes: the revert must account for pipeline/ AND index.html staying in sync
3. Run pipeline on reverted state before doing anything else
4. Must be GREEN before any further work

```bash
git revert HEAD
npm run pipeline
# Must be green before proceeding
```

---

## PUSH Rule

GREEN pipeline = commit + push.

```bash
npm run pipeline && git add -A && git commit -m "<type>: <description>" && git push
```

Commit message types: feat, fix, docs, refactor, test, chore
Never push without a green pipeline.
Never push without a commit message that describes the change.

---

## Recovery Playbook

When Rod reports broken behaviour in the browser:

```
1. CLASSIFY — Rod-caught or false green? Log in metrics/defects.jsonl immediately.

2. REVERT
   git revert HEAD
   (follow REVERT Rule above)

3. VERIFY — pipeline must be GREEN on reverted state before anything else

4. DIAGNOSE — what scenario was missing? What test lied?
   Run 5 Whys — see .claude/practices/5-whys.md

5. WRITE SCENARIO — Gherkin for the missing behaviour
   Rod approves before any code

6. FIX — follow integrated delivery cycle from Step 4 (failing test)

7. LOG — retrospective this session if Rod-caught
```

Target: steps 1-3 complete in <30 minutes.
Steps 4-7 complete this session.
Never carry a Rod-caught bug into the next session unresolved.

---

## Pipeline Scorecard Format (session start report)

```
PIPELINE SCORECARD — [date]
Step 0 UI Audit:      PASS / FAIL
Step 1 Browser Sim:   PASS / FAIL
Step 2 Unit Tests:    PASS / FAIL (n passing, n failing)
Step 3 Gherkin:       PASS / FAIL (n passing, n pending, n failing)
Step 4 Coverage:      PASS / FAIL (statements: n%, branches: n%)

Overall: GREEN / RED
Pending scenarios: n (↑/↓/= from last session)
Last Rod-caught bug: [date or "none this session"]
Last false green: [date or "none recorded"]
```
