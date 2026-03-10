# Session Startup — Heckler and Cox
# Read this first. Everything else is referenced from here.
# Last updated: 2026-03-10

---

## SEQUENCE — follow in order, do not skip or reorder

---

### 0. PRE-FLIGHT — prime Downloads for Claude.ai (run first, no exceptions)

```bash
export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/cusslab && cat .claude/session-startup.md .claude/shared-session-state.md .claude/practices/domain-model.md .claude/practices/backlog.md .claude/practices/ideas.md .claude/practices/waste-log.md > /mnt/c/Users/roden/Downloads/session-ref.md && echo "session-ref.md ready"
```

This creates `/mnt/c/Users/roden/Downloads/session-ref.md` — one file Claude.ai uploads to get
full context (startup sequence, shared state from last session, domain model, backlog, waste log).
If Claude.ai asks you to "run a command and upload out.txt" — this file is the answer.
**shared-session-state.md is written by session-closedown.md step 8b — always present after first close.**
Update the cat list above if new reference files are added.

---

### 1. AUTH CHECK (immediate — before pipeline, before anything)

Read `.claude/practices/auth-ops.md` in full.

Key facts (detail in auth-ops.md):
- Worker URL: `https://cusslab-api.leanspirited.workers.dev` — `cusslab.workers.dev` is WRONG
- Account ID: `ce5ebfc99d1b37a7537a039d0b09d0b6` (leanspirited@gmail.com)
- Never suggest `wrangler login` — always fails (stale cached account ID)
- If canary RED: stop. Fix before anything else. See auth-ops.md for full procedure.

---

### 2. PIPELINE (confirm green before any work)

```bash
bash .claude/scripts/pipeline-report.sh > /tmp/out.txt && cat /tmp/out.txt
```

Report the scorecard:
```
Tests:      N/N passing
Coverage:   statements N% | branches N%
Gherkin:    N/N scenarios passing
Canary:     OK / RED
```

If canary RED: fix before proceeding (auth-ops.md).
If any other check fails: root cause before proceeding.

---

### 2c. EXPLORATORY TEST (Rod — manual product check, 5 minutes max)

Before any code work: Rod opens the live product and does a quick smoke-test across panels.

```
https://cusslab-api.leanspirited.workers.dev
```

Check at minimum:
- One Boardroom prompt end-to-end (submits, response arrives)
- One Comedy Room tab works (Into The Room or Roast Room)
- One Sports panel works (Football or Golf)
- Quntum Leeks: select a Ziggy voice, leap in

Note any layout, interaction, or content issues that feel off. Log them as WL entries immediately.
**This is Rod's usability lens — Claude Code's TDD/BDD cannot substitute for eyes-on-product.**

Report: "Exploratory test: clean / N issues found (logged as WL-NNN)"

---

### 2b. NOTES DIRECTORY SCAN (mandatory)

Check for unfiled concept notes from previous sessions:
```bash
ls /home/rodent/cusslab/notes/
ls /home/rodent/risk-and-impact-assessor/notes/
```

For each file found: read it, confirm whether it has since been promoted to a proper spec or BL item. If yes, delete or archive. If no, treat as active context for this session.

Log count: "Notes pending: N" in session opening summary.

---

### 3. SHARED STATE + RECENT WASTE (cross-Claude sync — read both)

**First:** Read `.claude/shared-session-state.md` — written by whichever Claude closed last.
Report: what shipped, open WL items, protocol status, carry-forward notes.
This is the handoff from the other Claude. If file doesn't exist: note it and continue.

**Then:** Read `.claude/practices/waste-log.md` — last 5 entries only, report any with Status: OPEN.

Current open items as of 2026-03-10: WL-MODE-001 (design-session audit gap), WL-MODE-002 (darts character debt: Rod Harrington/Bobby George). Recurring: auth failures (WL-060, 066). Recurring gherkin step shadowing: WL-099, WL-100, WL-103 (lint fix is BL-098).

---

### 4. BACKLOG + OUTER LOOP CHECK (top 3 by CD3 — agree focus before any code)

Read `.claude/practices/backlog.md` — report top 3 open items by CD3 score.

For each open product-bet item, ask:
- Does it have a hypothesis card? If not, flag it.
- Which AARRR stage does it target? Are we working on the right stage?
- Is there a falsifier — something that would tell us we were wrong?
Full outer loop: `.claude/practices/hypothesis-driven.md`

Current top 3 as of 2026-03-10 (session 3 post close):
- BL-094 Self-Training: rating buttons missing from most panel outputs (CD3=3.5) — OPEN, unblocked by BL-093
- BL-098 Gherkin step namespace collision lint check (CD3=4.5) — OPEN
- BL-051 Distribution: domain + SEO + PWA (CD3=3.25) — OPEN

Recently closed (2026-03-10 session 3):
- BL-095: The Roast Room — 5 authors roast any title simultaneously (Comedy Room tab 3)
- BL-059: The Writing Room — 3 authors discuss any topic in sequence (Comedy Room tab 4)
- BL-093: Panel ratings bridge to self-training persistent store (bug fix)

Comedy Room now has 4 tabs: Into The Room / House Name Oracle / The Roast Room / The Writing Room.
AUTHORS_POOL: 7 authors (hemingway, mccarthy, tolkien, patterson, pratchett, wodehouse, austen).
Character files for all 7 authors: feature-agnostic canonical model in characters/*.md.

Agree with Rod which item is being worked this session BEFORE opening any code file.

---

### 4b. IDEAS BOARD REVIEW (promote or park — 2 minutes max)

Read `.claude/practices/ideas.md` — UNREVIEWED section only.

For each idea: has it ripened since it was captured? Ask:
- Does it now have a clear "so that" clause?
- Has it been through at least an informal Three Amigos?
- Is it session-sized, or does it need decomposition?

If yes to all three → promote: run RAISE NEW WORK SEQUENCE, assign BL-NNN, CD3 score.
If no → leave in UNREVIEWED. Do not force it.
If clearly dead or superseded → move to ARCHIVED with one-line reason.

Report: "Ideas board: N unreviewed, N promoted, N archived."
Do not spend more than 2 minutes on this step. It is a scan, not a design session.

---

### 5. LAST RETROSPECTIVE (findings carry forward until next retro)

Last retro: 2026-02-28. Read `.claude/retrospectives/session-retro-2026-02-28.md` for full detail.

Key findings that still apply:
- STOP: starting implementation before Gherkin written AND approved in this session
- KEEP: minimum implementation discipline — no gold plating
- TRY: at session start, explicitly print pending Gherkin count and agree feature group before opening code

---

### 6. PRODUCT CONTEXT (what we're building)

Read `.claude/project-brief.md` for full context. Summary:

**Heckler and Cox** — profanity-themed AI panel app. Corporate prompts get roasted by panel members with distinct voices across 5 panels:
- Boardroom: Sebastian (leads), Pint of Harold, Roy, Partridge, Prof Cox, Mystic
- Comedy Room: 6 members (Hicks is comedy only — not boardroom)
- Sports/Football, Sports/Golf (Radar = Wayne Riley), Darts (7 characters)
- Long Room (cricket): Henry Blofeld fully implemented

Canonical spellings: **Quntum Leeks** (intentional typo — never autocorrect), **Pint of Harold** (not Harold the Heckler).

---

### 7. CHARACTER RULES (read before any character work)

Never edit a character without reading the relevant file first:
- Boardroom → `docs/characters-boardroom.md`
- Comedy → `docs/characters-comedy.md`
- Sports/Golf/Darts → `docs/characters-sports.md`
- All panels summary → `docs/characters-summaries.md`

Key rules:
- Wise Sir Nick: Sports/Golf ONLY. Not Comedy Room.
- Hicks: Comedy Room ONLY. Removed from Boardroom.
- Radar = Wayne Riley. "Radar" when panel respects him, "Wayne" when he's being a prick.
- Prof Cox: full Boardroom member. Not crossover.

---

### 8. WAYS OF WORKING (delivery cycle — non-negotiable)

Full detail in `.claude/CLAUDE.md`. The integrated cycle for every change:

1. **Three Amigos** — agree behaviour in plain language before any code
2. **Gherkin gate** — write scenario, output full text, print WAITING FOR ROD'S APPROVAL, STOP
3. **Outside-in design** — SOLID interface design before test
4. **Failing test** — write test, confirm it fails for the right reason, STOP
5. **Minimum implementation** — least code to pass the test
6. **Pipeline** — must pass before commit
7. **Commit + push** — small, frequent; never end session without pushing

BDD gate: previous session approval does not count. Gherkin must be approved in this session.

---

### 9. PRINCIPLES (how to think about problems)

Read when needed — not all at session start. Reference library:

| File | When to read |
|---|---|
| `.claude/principles/ddd.md` | Before domain model changes, new concepts, bounded contexts |
| `.claude/principles/xp.md` | Before any design decision — simplicity, four rules |
| `.claude/principles/lean.md` | When deciding what to build, scope questions, waste |
| `.claude/principles/systems-thinking.md` | Before refactoring, when something has side effects |
| `.claude/principles/ux.md` | Before UI changes, new interactions, jobs-to-be-done |
| `.claude/practices/hypothesis-driven.md` | New feature scoping — outer product feedback loop |

---

### 10. PRACTICES (how to do the work)

Reference library — read the relevant file before the relevant step:

| File | When to read |
|---|---|
| `.claude/practices/auth-ops.md` | Any Cloudflare / Worker / API key operation |
| `.claude/practices/bdd.md` | Step 2 (Gherkin gate) |
| `.claude/practices/tdd.md` | Step 4 (failing test) |
| `.claude/practices/solid.md` | Step 3 (outside-in design), refactoring |
| `.claude/practices/5-whys.md` | Every bug — root cause before fix |
| `.claude/practices/ci-cd.md` | Pipeline failures, push/deploy operations |
| `.claude/practices/dora.md` | Metrics reporting, DORA scorecard |
| `.claude/practices/architecture-review.md` | Extraction decisions, seam design |
| `.claude/practices/domain-model.md` | Domain language, bounded contexts, new aggregates |
| `.claude/practices/retrospectives.md` | Session end, retro triggers |
| `.claude/practices/ux-decisions.md` | UI changes, new design decisions |
| `.claude/practices/panel-slots.md` | Panel slot mechanics |
| `.claude/practices/backlog.md` | Backlog adds, CD3 scoring, prioritisation |
| `.claude/practices/waste-log.md` | Every bug, every failure, session end |

---

### 11. PROJECT SEPARATION (know which repo before touching code)

Two projects. Wrong project = waste log entry (WL-022: 3 hours lost).

| Signal | Project |
|---|---|
| Characters, panels, comedy, banter, needles | **Cusslab** `/home/rodent/cusslab/` |
| Risks, issues, RAID, quality tools, project context | **RIA** `/home/rodent/risk-and-impact-assessor/` |
| Grey area (boardroom = project-adjacent) | Flag it, don't assume |

---

## NON-NEGOTIABLE RULES (violation = waste log entry)

- Canary RED → fix before any other work. No exceptions.
- Gherkin before code. Every time. Previous session approval does not count.
- Failing test before implementation. Every time.
- Pipeline green before commit.
- Commit + push after every change. No session ends with unpushed work.
- Waste log entry for every bug and every failure. At session end at minimum.
- Never suggest `wrangler login`.
- Quntum Leeks — intentional typo. Never autocorrect.
