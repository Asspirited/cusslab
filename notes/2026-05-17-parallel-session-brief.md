# Parallel Session Brief — 2026-05-17 Watershed Aftermath

For a second Claude Code session picking up work in parallel with the primary
session. Defines what's locked, what's shipped to live, what's queued for ship,
and how two sessions can work without git conflict.

---

## Context

The 2026-05-17 watershed session produced a major design lock + Track A ship
(BL-178 v0 + BL-179 v1 LIVE). This brief scopes the remaining work so it can
be parallelised across two Claude Code sessions.

Per Rod (2026-05-17): *"prepare work for another claude code session and you
to run in parallel to deliver all of this shit"*

---

## What's locked in standards (`leanspirited-standards/`)

**panel-voice-principles.md (committed 6fddb26, 22d5bab, 07f16c5):**
- Lever 4 — Comedy Mechanisms:
  - M-Mech-1 (Unwitting register)
  - M-Mech-2 (Signature move as displacement)
  - M-Mech-3 (Cornered legalistic callback)
  - M-Mech-4 (Wrong-noun deflation)
  - M-Mech-8 (Reverent absurdity — Milligan-Python register)
  - M-Mech-9 (Incongruent register — the disguise move)

**character-schema.md (committed cd04152, 07f16c5):**
- P11 — Topic Magnets (runtime generative; 3-5 per character; 6-12 anchors each)
- P9 lie_style extension: `incongruent_register` option with sub-fields
  `polarities[]`, `allowed_levels[]` (subset of 3,4,5), `motivations[]`

---

## What's shipped to live (cusslab/, as of brief write)

- `ecfa861` — BL-178 v0: Murray P11 magnet data (corvids, Prestwick, wages)
- `5ac6c29` — BL-179 v1: M-Mech-8 REVERENT ABSURDITY MODE engine block + Golf 19th Hole wired

**Rod can test in live now:** open Golf 19th Hole, ask a non-sequitur question.
M-Mech-8 should fire more reliably; "Henni, the [noun]" pattern should land
with Murray pulling toward corvid / Prestwick / wage answers.

---

## Backlog raised this session (`cusslab/.claude/practices/backlog.md`)

- BL-176 — Repetism dial-back (named: Valderrama '97, "We should mark this", default-tic firing, turn-shape collapse)
- BL-177 — P11 `if_directly_asked` rule reconsideration (parked, future)
- BL-178 — P11 Topic Magnets pilot (v0 SHIPPED for Murray; v1 pending for engine surface; v4 pending for Faldo/Cox)
- BL-179 — M-Mech-8 reverent absurdity (v1 SHIPPED)
- BL-180 — Hanging-in-the-air (collective non-response)
- BL-181 — Proactive moderation (shutdown before launch)
- BL-182 — Communication topology framework (3-axis intent/target/audience)
- BL-183 — Egging-on: solicited escalation toward memorable quote

---

## Two parallel tracks — file-disjoint

The split is engineered so two sessions cannot collide on the same file.

### Track A — Pure character data work (`cusslab/characters/*.md` only)

Adds P11 magnets and P9 incongruent_register sub-fields to character files.
**No engine or wiring code.** Pure declarative content. Pipeline-safe.

| # | Item | File(s) |
|---|------|---------|
| A1 | Faldo P11 magnets (sandwich pastry obsessive, commitment-to-position, document precision) | `characters/faldo.md` |
| A2 | Cox P11 magnets (cosmic timescale, "and in that context", narrative inevitability) | `characters/cox.md` |
| A3 | Sebastian P9 incongruent_register data (polarities=[hostile_as_warm], allowed_levels=[3,4,5], motivations=[status_undercut, discomfort_creation]) | `characters/sebastian.md` (find/create) |
| A4 | McGinley P9 incongruent_register data (polarities=[hostile_as_warm], allowed_levels=[3,4,5], motivations=[achievement_over_exaggeration] — Faldo-specific target) | `characters/mcginley.md` (find/create) |
| A5 | Partridge P9 incongruent_register data (polarities=[hostile_as_warm], allowed_levels=[3,4], motivations=[self-exposure via excessive praise]) | `characters/partridge.md` (find/create) |
| A6 | Boyle P9 incongruent_register data (polarities=[hostile_as_warm, warm_as_hostile], allowed_levels=[4,5], motivations=[banter_as_affection, status_undercut]) | `characters/boyle.md` (find/create) |

Each item: read character file, add new section in same prose-with-bold-labels
style as Murray's P11 (see `characters/murray.md` for canonical example), commit,
push. Pipeline green required.

Sequence A1-A6 is independent — can ship in any order. Each is a standalone commit.

### Track B — Engine and wiring (`src/logic/panel-discuss-engine.js` + `index.html`)

Adds engine prompt blocks and Golf panel wiring. **No character file edits.**
Touches code paths so pipeline must be watched.

| # | Item | Files | Depends on |
|---|------|-------|------------|
| B1 | BL-178 v1 — TOPIC MAGNETS engine prompt block. Reads character P11 magnets, samples per turn, emits block instructing surface forms. Wire Golf with `topicMagnetsEnabled: true`. | `panel-discuss-engine.js` + `index.html` | None (Murray data already shipped) |
| B2 | BL-181 v1 — M-Mech-9 INCONGRUENT REGISTER MODE prompt block. Reads P9 incongruent_register data, selects polarity/level/motivation per turn. Wire Golf. | `panel-discuss-engine.js` + `index.html` | A3+A4+A5+A6 (needs character P9 data to reference) |
| B3 | BL-180 v1 — HANG MODE prompt block. Hang trigger heuristic + per-character `can_leave_hanging` config. | `panel-discuss-engine.js` + `index.html` | None |
| B4 | BL-181 v1 (shutdown) — SHUTDOWN MODE prompt block. Trigger detection + per-character `shutdown_capability`. Transcript em-dash truncation. | `panel-discuss-engine.js` + `index.html` (transcript renderer) | None |
| B5 | Lever 5 — Panel Temperature engine integration. `panelTemperature: number` config + 2-axis bias on mechanism scoring. Hardcoded panel defaults (19th Hole -0.6, Comedy Room +0.4, Boardroom -0.2). | `panel-discuss-engine.js` + `index.html` | None for v0; B1-B4 for v1 bias table |

Pattern for each: follow the BL-179 v1 commit (`5ac6c29`) as template.
- Add `<feature>Block` const computation in `buildSystemPrompt`
- Concatenate into return string (suppression for anchor turns where appropriate)
- Wire Golf 19th Hole at `index.html` ~line 15497-15503 alongside existing flags
- Pipeline green
- Commit + push to live

---

## Conflict avoidance protocol

1. **Track A and Track B work on different files.** Track A is
   `characters/*.md`; Track B is `src/logic/panel-discuss-engine.js` +
   `index.html`. No git merge conflict possible on these.

2. **Both tracks `git pull origin main` before pushing.** If one session
   has pushed in between, the other pulls (likely fast-forward, no merge),
   then pushes.

3. **Per the experimental workflow exemption** (cusslab CLAUDE.md committed
   `fd3598f`): pipeline-green is required before every commit. Auth canary
   OK before any work. Both tracks follow the same protocol.

4. **Coordinate on shared design decisions through Rod or via the
   `.claude/shared-session-state.md` file at session boundaries.** If
   Track B needs Track A's data BEFORE shipping a feature block (e.g. B2
   references Sebastian's P9 data from A3), B2 waits until A3 has shipped.

---

## How to pick up a track in a fresh Claude Code session

1. Read `/home/rodent/cusslab/.claude/session-startup.md` IN FULL — mandatory.
2. Read `/home/rodent/cusslab/.claude/CLAUDE.md` — note the experimental
   workflow exemption (Rod 2026-05-17).
3. Read this brief (`notes/2026-05-17-parallel-session-brief.md`).
4. Pick a track (A or B); commit to one for the session.
5. `cd /home/rodent/cusslab && git pull origin main`
6. Run `bash .claude/scripts/pipeline-report.sh` — confirm GREEN before
   touching anything.
7. Work the track's queued items in listed order (dependencies noted).
8. Pipeline green + commit + push to live after each item.
9. At session close: update `.claude/shared-session-state.md` with what
   shipped, what's queued, any new issues.

---

## What still needs design (not in either track yet)

- **BL-182 — Communication Topology** — Three Amigos needed. Possibly merges
  with M-Mech-9 spec.
- **BL-183 — Egging-on mechanic** — Three Amigos on character pairing table
  (which eggers with which eggees and why) needed before v1.
- **Lever 5 — Panel Temperature full draft** — sketch exists in primary
  session chat history (CD3 framing, two-axis intent/congruence). Needs
  full draft into `panel-voice-principles.md` before B5 can ship to engine.
  May happen in primary session or as separate Track C "Standards
  Completion" track.

---

## Background work in flight (primary session)

A general-purpose Agent is running a **comparative analysis** of our
panel-voice / character-schema model against academic CA, politeness theory,
improv theory, sketch / sitcom writing, British surreal tradition, and
recent multi-agent LLM research. Output target:
`cusslab/notes/2026-05-17-comparative-analysis.md`. Notifies when complete.
If you find that file already populated when picking up, read it for
context — it shapes which gaps and overlaps to prioritise.

---

## Validation per ship

After A1+A2 ships (Faldo + Cox P11 magnets) — Rod tests:
- Open Golf 19th Hole; ask Faldo a non-sequitur; verify pull toward
  Ginsters / pastry / commitment
- Same for Cox; verify pull toward cosmic-timescale / "and in that context"

After B1 ships (TOPIC MAGNETS engine block):
- Verify the block appears in system prompt when Murray's turn fires
  (debug via Worker logs or browser network panel)
- "Henni, the rook"-class answers should land at least as often as
  before, more consistently

After B2-B5 ship:
- Rod's feedback validates per experimental workflow

---

## Active session at brief-write time

Primary session (this one): shipped BL-178 v0 + BL-179 v1, raised
BL-180/181/182/183, drafted this brief, background research agent running.
Next directive from Rod determines whether primary session continues on
Track A, Track B, or stays in design-discussion mode while the parallel
session ships.
