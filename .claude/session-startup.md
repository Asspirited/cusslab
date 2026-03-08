# Session Startup — Heckler and Cox
# Read this first. Everything else is referenced from here.
# Last updated: 2026-03-08

---

## SEQUENCE — follow in order, do not skip or reorder

---

### 0. PRE-FLIGHT — prime Downloads for Claude.ai (run first, no exceptions)

```bash
export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/cusslab && cat .claude/session-startup.md .claude/practices/domain-model.md .claude/practices/backlog.md .claude/practices/waste-log.md > /mnt/c/Users/roden/Downloads/session-ref.md && echo "session-ref.md ready"
```

This creates `/mnt/c/Users/roden/Downloads/session-ref.md` — one file Claude.ai uploads to get
full context (startup sequence, domain model, backlog, waste log) without needing to run commands.
If Claude.ai asks you to "run a command and upload out.txt" — this file is the answer.
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

### 3. RECENT WASTE (last 5 entries — read, report open items)

Read `.claude/practices/waste-log.md` — last 5 entries only, report any with Status: OPEN.

Current open items as of 2026-03-08: none (WL-063 through WL-067 all closed).
Recurring pattern to watch: auth failures (WL-060, 066) — if auth waste recurs, escalate to retro.

---

### 4. BACKLOG (top 3 by CD3 — agree focus before any code)

Read `.claude/practices/backlog.md` — report top 3 open items by CD3 score.

Current top 3 as of 2026-03-08:
- BL-016 Golf Adventure: tournament category split (CD3=9.0) — OPEN
- BL-008 RIA: ACC label fix (CD3=8.0) — OPEN (RIA project, not Cusslab)
- BL-015 Golf Adventure: worker fetch routing (CD3=8.0) — CLOSED 2026-03-08

Agree with Rod which item is being worked this session BEFORE opening any code file.

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
