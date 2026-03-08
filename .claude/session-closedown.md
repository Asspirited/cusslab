# Session Closedown — Heckler and Cox
# Run in full at every session end. No exceptions.
# Last updated: 2026-03-08

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

### 4. DECISIONS REVIEW (nothing left floating)

Check: were any design decisions made this session that are not yet in a file?
- Architecture decisions → `.claude/practices/architecture-review.md`
- UX decisions → `.claude/practices/ux-decisions.md`
- Domain model changes → `.claude/practices/domain-model.md`
- Character decisions → relevant `docs/` file

If yes: write them now. Do not carry decisions in memory across sessions.

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

### 8. DORA METRICS (30 seconds — run it)

```bash
export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/cusslab && node pipeline/metrics-report.js > /tmp/out.txt 2>&1 && cat /tmp/out.txt
```

Report: deployment frequency, lead time, pipeline failure rate vs last session.
If failure rate went up: note why in waste log.

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
