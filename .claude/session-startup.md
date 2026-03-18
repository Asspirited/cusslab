# Session Startup — Heckler and Cox
# Read this first. Everything else is referenced from here.
# Last updated: 2026-03-15

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

### 1b. LIVE BUG CHECK (before any feature work — ask Rod)

Ask Rod: **"Any live bugs since last session? Anything broken or wrong in the product right now?"**

If yes: treat as a live bug — run INVESTIGATE AND RESOLVE SEQUENCE before any planned feature work. Log a WL entry immediately.
If no: proceed.

Do not skip this step. A broken live product outranks all backlog CD3 scores.

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

**Then:** Read `.claude/practices/waste-log.md` — read the `## OPEN ITEMS` index block at the top of the file. Report all items listed there.

Current open items as of 2026-03-15 (session 13 close): WL-131 (character dullness — Three Amigos needed), WL-136 (UI audit doesn't check IIFE return completeness — pipeline gap), WL-147 (backlog-report.js false-positive OPEN for items whose description contains "status text" — fix: tighten regex).

---

### 4. BACKLOG + OUTER LOOP CHECK (top 3 by CD3 — agree focus before any code)

Read `.claude/practices/backlog.md` — report top 3 open items by CD3 score.

For each open product-bet item, ask:
- Does it have a hypothesis card? If not, flag it.
- Which AARRR stage does it target? Are we working on the right stage?
- Is there a falsifier — something that would tell us we were wrong?
Full outer loop: `.claude/practices/hypothesis-driven.md`

Current top 3 as of 2026-03-15 (session 13 close) — Cusslab only:
- BL-146 Golf panel: character technical knowledge enrichment (CD3=6.0) — OPEN
- BL-151 Per-character mode selector (CD3=5.7) — OPEN
- BL-157 Vinny Jones → football + Boardroom (CD3=5.5) — Three Amigos needed

NOTE: backlog-report.js shows BL-128 (CD3=7.0) and BL-132 (CD3=22.0) as OPEN — parser bug (WL-147). Both are CLOSED. Ignore them. Real top item is BL-146.

TBT top 3 as of 2026-03-18 (session 15 close):
- TBT-012 Nan quality mechanic (CD3=20.0) — Three Amigos done, Gherkin needed
- TBT-006 Transport choices (CD3=19.0) — Three Amigos needed
- TBT-007 First cricket match (CD3=13.5) — Three Amigos needed

Recently closed (2026-03-18 session 15 — TBT branch):
- TBT-011 Hidden attribute model: computeForm, calculateLifeNoise, attribute deltas in applyActivity, GameState extended (commit 1d75459)

New BL items raised this session:
- TBT-011 (CLOSED) — hidden attribute model
- TBT-012 (OPEN) — Nan quality mechanic (CD3=20.0)

New WL items this session:
- WL-149 OPEN: tbt.html applyActivity diverged from engine (Low)
- WL-150 CLOSED: Gherkin Examples boundary values wrong (Low)

WL-136 (IIFE return check in UI audit) still OPEN — pipeline false-green risk.
WL-131 (character dullness) still OPEN — Three Amigos needed.

Agreed next session (from 2026-03-18 session 16 close):
- TBT-016: Batting — defensive vs attacking shot selection (CD3=7.0) — Three Amigos first, then Gherkin
- TBT-015: Bowling — separate formulas for wickets and runs conceded (CD3=6.5) — Three Amigos first, then Gherkin
- TBT-022: Player type at start — batting position + bowling role (CD3=5.7) — Three Amigos first, then Gherkin
Note: all three need Three Amigos before any Gherkin. Start with TBT-016.

Agreed next session (from 2026-03-18 session 15 close):
- TBT-012: Nan quality mechanic — Gherkin first (Three Amigos done this session)
- TBT-006: Transport choices — Three Amigos first
- TBT-007: First cricket match — Three Amigos first

NOTES FILE: notes/2026-03-18-tbt-scenes-brainstorm.md — full scene/event/arc brainstorm from session 15. Includes new dial candidates (BODY, REPUTATION, HOME) not yet raised as BL items.

BL-153 raised: David Howell ("Howling Mad David") for Golf panel (CD3=4.0).

Agreed next session (from 2026-03-15 session 12 closedown):
- BL-153: David Howell ("Howling Mad David") — Golf panel character — FIRST — Three Amigos + Gherkin needed
- WL prune: check all open WL items, close or action anything clearable — SECOND
- BL-128: Pub Crawl UX (pressure feedback, threshold, game-goal clarity) — CD3=7.0 — Gherkin needed
- BL-139: Character audit (6 unassigned characters) — CD3=6.0 — Three Amigos needed
- BL-146: Golf technical knowledge enrichment — CD3=6.0 — research spike, Three Amigos needed

Open product bets under discussion:
- BL-125 Final Furlong Mode 2 jockey rivalry (Three Amigos needed)
- BL-129 Pub Crawl free-text input (Three Amigos needed on design)
- WL-131 Character dullness (Three Amigos needed)
- WL-136 UI audit IIFE return completeness check (pipeline gap — open)
- WL-134 Pub Crawl: no positive/negative outcome feedback (Nielsen gap — open)

Sports panels: Football, Golf, Darts (Watching the Oche), Cricket (The Long Room), Horse Racing (The Final Furlong), Snooker (The Crucible Corner), Hip-Hop (The Spit Shelter).
The Spit Shelter: Eminem anchors, 4 of 13 rotating: Dre, Biggie, Tupac, Gil Scott-Heron, Lauryn Hill, Ice Cube, Ice-T, Skepta, Dave, Stormzy, Mike Skinner, JCC, Plan B. Biggie/Tupac/Gil are DEAD_IN_PANEL_WORLD. Data: src/data/spit-shelter-data.js.
The Final Furlong: Alan Brazil hosts, 4 of 6 rotating: McCririck, McGrath, Alastair Down, O'Sullevan, Walsh, Chapman. McCririck + O'Sullevan are DEAD_IN_PANEL_WORLD.
The Crucible Corner: Jimmy White hosts, 4 of 8 rotating: Steve Davis, John Virgo, Dennis Taylor, Ronnie O'Sullivan, Willie Thorne, Ray Reardon, John Parrott, Mark Williams. Thorne + Reardon are DEAD_IN_PANEL_WORLD. Data: src/data/crucible-corner-data.js.
Comedy Room: 4 panels: Into The Room (15 members incl. Chappelle/Pryor/LouisK/Jefferies/Gervais/Boyle) / House Name Oracle / The Roast Room / The Writing Room.
Author Epilogue: 27-author pool (_FB_AUTHORS_POOL + _FB_AUTHOR_VOICES) shared across Football, Golf, Darts, Cricket, Oracle, Boardroom. Each panel has getLastContext(), request/reroll global functions.
Golf Adventure: Ryder Cup 5-session model with leaderboard + overall match score.
Little Misadventure: Friday Pub Crawl, Pub Navigator, Quntum Leeks. External scripts use ETag caching.

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

### 4c. COMBINED OPEN ITEMS — BL + WL, sorted by CD3

Read open BL items from `.claude/practices/backlog.md` and open WL items from `.claude/practices/waste-log.md`.

Produce one combined table:

**BL items** — extract all `Status: OPEN` entries, sort descending by CD3.
Format each row: `CD3 | BL-NNN — title | blocker or note`

**WL items** — extract all `Status: Open` entries (case-insensitive), list after BL items.
Format each row: `WL-NNN — title | urgency (High/Medium/Low)`

Flag any blockers that have since been resolved (blocked item's dependency now CLOSED → mark **now unblocked**).

Output the table, then confirm the session top 3 BL by CD3 and the highest-urgency open WL.

Do not spend more than 3 minutes on this step — scan and report, do not analyse or design.

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
| `.claude/practices/testing-standards.md` | Before designing any new test, adding external scripts, or writing API calls |
| `.claude/practices/backlog.md` | Backlog adds, CD3 scoring, prioritisation |
| `.claude/practices/waste-log.md` | Every bug, every failure, session end |

---

### 11. PROJECT SEPARATION (know which repo before touching code)

⚠️ **THREE PROJECTS NOW EXIST.** Wrong project = waste log entry (WL-022: 3 hours lost).

| Signal | Project | Path |
|---|---|---|
| Characters, panels, comedy, banter, needles, Heckler and Cox | **Cusslab** | `/home/rodent/cusslab/` |
| Risks, issues, RAID, quality tools, project context | **RIA** | `/home/rodent/risk-and-impact-assessor/` |
| Deception, detection, negotiation, LieProfile, Veritas, Voigt-Kampff, scoring panels | **Fallacy Finder** | `/home/rodent/fallacy-finder/` |
| Grey area (boardroom = project-adjacent) | Flag it — do not assume | |

**TBT — Through the Biscuit Tin** lives in the Cusslab repo on branch `through-the-biscuit-tin` but is a **separate bounded context**. Non-negotiable rules:
- Entry point: `tbt/tbt.html` — standalone, no link from `index.html`. Ever.
- Domain logic: `src/logic/tbt-engine.js` — no imports from Cusslab domain logic.
- No TBT nav tabs added to Cusslab's NAV_GROUPS. No crossover.
- When TBT forks to its own repo: zero surgery needed. The boundary is the point.

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
