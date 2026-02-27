# Heckler and Cocks — Claude Code Session Instructions

**Read these files in order before every session. No exceptions.**

1. `.claude/project-brief.md`     — current state, open items, priorities
2. `.claude/standards/bdd.md`     — non-negotiable BDD rules and Gherkin gate
3. `.claude/standards/testing.md` — test standards, isolation levels, Fifty Quick Ideas
4. `.claude/standards/lean-dora.md` — Lean and DORA commitments
5. `.claude/standards/retrospectives.md` — retrospective framework
6. `.claude/history/decisions.md` — all decisions made to date
7. `.claude/history/5-WHYS.md`    — all bug root causes

**Then run:**
```bash
npm run pipeline
```

**Then produce both mandatory reports before any work:**
- Pipeline Passing Report
- Defect + DORA + Metrics Report

**Then wait for instruction.**

---

## ⛔ GHERKIN REVIEW GATE — NON-NEGOTIABLE

Before running the pipeline on any new or modified Gherkin scenario:

1. Output the COMPLETE literal text of NEW and MODIFIED scenarios only
2. Do NOT show unchanged existing scenarios — state how many were skipped
3. Format: "NEW/MODIFIED SCENARIOS FOR APPROVAL — [N] total, [N] unchanged and skipped:"
4. Print: "WAITING FOR ROD'S APPROVAL — do not proceed until Rod confirms"
5. **STOP. Do not run the pipeline. Do not fix code. Do not commit.**
6. Wait for Rod to explicitly type "approved" or provide feedback
7. Only proceed after explicit written approval in this session

Unchanged scenarios from previous sessions do not need re-approval.
A new or modified scenario Rod has not read in this session has not been approved.
If ALL scenarios are unchanged, state this and proceed without stopping.

---

## ⛔ PRE-IMPLEMENTATION CHECKLIST — answer all 5 before writing code

1. What is the exact observable behaviour that is wrong or missing?
2. What Gherkin scenario will prove it is fixed — described in Rod's language?
3. What is the root cause from the 5 Whys analysis?
4. What is the smallest change that fixes only this?
5. What existing behaviour could this change break?

Written answers required. "Yes" is not an answer.

---

## ⛔ PIPELINE MUST BE GREEN BEFORE ANY COMMIT

Zero tolerance. If any step fails, fix it before committing.
Do not push a red pipeline under any circumstances.
If green and Rod has approved the scenario — commit and push automatically.
No manual deployment steps. GREEN = ship.

---

## Session start command
```bash
cat .claude/project-brief.md && npm run pipeline
```
