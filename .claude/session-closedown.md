# Session Closedown — Heckler and Cox
# Run in full at every session end. No exceptions.
# Last updated: 2026-03-09

---

## SEQUENCE — follow in order

---

### 1. PIPELINE (final green before closing)

```bash
bash .claude/scripts/pipeline-report.sh > /tmp/out.txt && cat /tmp/out.txt
```

Report final scorecard. If RED: fix before closing. No session ends on a red pipeline.

---

### 2. WASTE LOG (mandatory — append before closing)

Read `.claude/practices/waste-log.md` — last entry number.
For every failure, bug, wrong turn, or friction point this session:
- Add a new WL entry with correct next number
- Include: Item, Symptom, Suspected cause, Session date, Time lost, Cost impact, Tags, Status
- If fixed this session: Status = Closed. If not: Status = Open with next action.

If nothing went wrong: write one line confirming that. Do not skip the step.

---

### 3. BACKLOG (capture anything that surfaced)

Read `.claude/practices/backlog.md`.
For every scope idea, tech debt item, bug, or enhancement that came up this session:
- Add a BL entry with correct next number
- Score CD3 immediately: UBV + TC + RR → CoD / Dur = CD3
- Insert in CD3 order — do not append to bottom without resorting

---

### 3b. HYPOTHESIS REVIEW (outer loop — 60 seconds)

For any feature shipped this session that has a hypothesis card:
- Did the falsifier condition become testable? If yes — when will we check the signal?
- If the hypothesis window has passed — assess: confirmed, falsified, or inconclusive?
  Record the outcome on the BL item. Update domain model and BDD specs if learning warrants it.
- If no hypothesis card exists for a shipped product bet — add one now for next assessment.

For measurement gaps surfaced this session:
- Add a BL item for any instrumentation needed before a hypothesis can be tested.

Nothing to review? Write one line confirming that. Do not skip the step.
Source: .claude/practices/hypothesis-driven.md

---

### 4. DECISIONS REVIEW (nothing left floating)

Check: were any design decisions made this session that are not yet in a file?
- Architecture decisions → `.claude/practices/architecture-review.md`
- UX decisions → `.claude/practices/ux-decisions.md`
- Domain model changes → `.claude/practices/domain-model.md`
- Character decisions → relevant `docs/` file

If yes: write them now. Do not carry decisions in memory across sessions.

---

### 4b. STANDARDS REVIEW (before writing any update to process files)

Before writing any change to `.claude/` files, `MEMORY.md`, `session-startup.md`, `session-closedown.md`, `CLAUDE.md`, `project-brief.md`, or any `practices/` or `principles/` doc — stop and run this review.

**The lens checklist — apply to each proposed update:**

| Lens | Question |
|---|---|
| **Lean / Muda** | Does this rule add value or add steps? Would the project be worse without it? |
| **PDCA** | Is this Plan, Do, Check, or Act? Is it the right phase to write this? |
| **SMART** | Is the rule Specific, Measurable, Achievable, Relevant, and observable? Vague reminders are not rules. |
| **DDD / Ubiquitous language** | Does it use domain language correctly? Does it align with the domain model? |
| **Clean code (Fowler / Beck)** | Is this the simplest version of the rule? Would it pass the four rules of simple design? |
| **Tech debt (Fowler / Beck / Poppendiecks)** | Does it eliminate a class of future waste — or does it add queue and interrupt flow? |
| **Reinertsen / Cost of Delay** | Does it reduce cycle time, shrink queue, or make CoD observable — or does it slow delivery? |
| **Dev-Test maturity** | Does it add an observable checkpoint? Remove reliance on memory? Strengthen the pipeline? |
| **Design Thinking (jobs-to-be-done)** | Who is served by this rule (Claude Code, Claude.ai, Rod)? Does it make their job clearer? |
| **DORA metrics** | Does it improve Deployment Frequency, Lead Time, Change Failure Rate, or MTTR? Or does it introduce friction that degrades them? |
| **DevOps principles (Accelerate)** | Does it support fast flow, fast feedback, or continuous learning? Does it reduce batch size or handoff? |
| **Agile Manifesto** | Working software over process? Individuals and interactions over tools? Does this rule serve delivery or serve itself? |
| **Removal of future WL items** | Would this rule have prevented a past WL entry? Is there evidence it will prevent a future one? |

**Output required — one line per proposed change:**

```
[ ] <what the change is> — <lens that most strongly justifies or rejects it> — WRITE / SKIP
```

Only WRITE changes that pass the review. SKIP changes that are vague, add steps without removing waste, or lack an observable success condition.

If no process changes were proposed: write one line confirming that. Do not skip the step.

---

### 5. GHERKIN INVENTORY (pending scenarios)

Check `specs/` for any feature files with scenarios not yet implemented.
Report: how many pending scenarios exist at session end vs session start.
If the number went up: explain why (new scope, not regression).

---

### 6. SESSION-STARTUP UPDATE (if anything changed)

If any of the following changed this session, update `.claude/session-startup.md`:
- Backlog top 3 (new items, closed items, rescored items)
- Last retrospective (if a retro ran this session)
- Product context (new panels, new characters added)
- Character rules (new canonical rules established)
- Open waste items

Keep session-startup.md current. It is the entry point for the next session.

---

### 7. COMMIT AND PUSH (nothing unpushed at close)

```bash
cd /home/rodent/cusslab && git status
```

If anything is unstaged or uncommitted: commit it now.
No session ends with unpushed work. Ever.

```bash
git add -p  # review before staging
git commit -m "Session closedown — [date]"
git push
```

Report final commit hash.

---

### 8. DORA METRICS + SESSION LOG (run both)

```bash
export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/cusslab && node pipeline/metrics-report.js > /tmp/out.txt 2>&1 && cat /tmp/out.txt
```

Report: deployment frequency, lead time, pipeline failure rate vs last session.
If failure rate went up: note why in waste log.

Then append session record and regenerate dashboard:

```bash
cd /home/rodent/cusslab && bash .claude/scripts/write-session-log.sh && node pipeline/generate-session-report.js && cp .claude/reports/session-report.html /mnt/c/Users/roden/Downloads/session-report.html && echo "Dashboard ready: Downloads/session-report.html"
```

This appends one line to `.claude/reports/session-log.jsonl` (append-only, never overwritten)
and regenerates the HTML trend dashboard in Downloads.

---

### 8b. SHARED SESSION STATE (cross-Claude sync — write before closing)

Write `.claude/shared-session-state.md` so the other Claude (Code ↔ .ai) starts next session with full context.

Format — overwrite the file completely each close:

```
# Shared Session State
Last updated: [DATE] by Claude [Code|.ai]
Last commit: [HASH] — [message]

## What shipped this session
- [brief list]

## Open waste items (WL numbers)
- WL-NNN: [one line] — Status: Open

## Backlog top 3 by CD3
- BL-NNN (CD3=N): [title]
- BL-NNN (CD3=N): [title]
- BL-NNN (CD3=N): [title]

## Protocol status this session
- Session startup: [followed / skipped steps N,N]
- Gherkin gate: [followed / bypassed on: feature name]
- TDD: [followed / bypassed on: feature name]
- Pipeline: [GREEN / RED — reason]

## Carry-forward notes
- [anything the next Claude must know that isn't in a file yet]
```

Then add to session-ref.md pre-flight so Claude.ai gets it on upload:
The session-startup.md pre-flight command already cats multiple files — ensure
`.claude/shared-session-state.md` is included in that cat list.

---

### 9. RETROSPECTIVE TRIGGER (check — do not skip)

Read `.claude/practices/retrospectives.md` for trigger conditions.
Ask: does this session meet any retro trigger?
- 3+ pipeline failures this session
- Same mistake made twice
- Significant time lost to process (not feature) work
- Rod flagged something as "this keeps happening"

If yes: run the retrospective now. Write to `retrospectives/session-retro-[date].md`. Commit.
If no: state which triggers were checked and why none fired.

---

## NON-NEGOTIABLE

- Pipeline must be green before closing.
- Waste log must have an entry (even "nothing went wrong").
- Nothing unpushed at close.
- session-startup.md updated if anything changed.
- Decisions not in files do not exist next session.
