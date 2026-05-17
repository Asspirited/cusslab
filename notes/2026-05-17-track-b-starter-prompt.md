# Track B Starter Prompt — paste into the second Claude Code session

Copy everything below the `---` line and send as the first message to the
second Claude Code session. Adjust the bracketed line at the end if you want
to scope to fewer items.

---

You are the second Claude Code session, working in parallel with another
session on the Cusslab project (`/home/rodent/cusslab/`). You own **Track B
— engine and wiring work**. The other session owns Track A (character data
files). The two tracks are file-disjoint by design so we cannot conflict.

**Read first, in this order, before any code:**

1. `/home/rodent/cusslab/.claude/session-startup.md` — full mandatory startup
   sequence (auth canary, pipeline, waste log, backlog).
2. `/home/rodent/cusslab/.claude/CLAUDE.md` — note the **experimental
   workflow exemption** (Rod 2026-05-17): Gherkin gate is relaxed for
   Cusslab; pipeline-green still required; commit + push to live after every
   change; Rod's feedback is the validation.
3. `/home/rodent/cusslab/notes/2026-05-17-parallel-session-brief.md` — full
   context on what's locked, what's shipped, and the Track A/B split.
4. `/home/rodent/cusslab/notes/2026-05-17-comparative-analysis.md` — research
   context. Optional but useful — names the gaps Track B partly addresses.

**Then verify your starting state:**

```bash
cd /home/rodent/cusslab && git pull origin main
bash .claude/scripts/pipeline-report.sh > /tmp/out.txt && cat /tmp/out.txt
```

Pipeline must report `EXIT=0` and canary `OK` before you touch anything.

**What's already live (do NOT re-do):**

- BL-178 v0: Murray + Faldo + Cox character files have P11 magnets
  (commits `ecfa861`, `6e5c766`, `41628b2`).
- BL-179 v1: M-Mech-8 REVERENT ABSURDITY MODE engine block + Golf 19th Hole
  wired with `reverentAbsurdityEnabled: true` (commit `5ac6c29`).
- Standards locked: Lever 4 M-Mech-1..4 + M-Mech-8 + M-Mech-9 in
  `leanspirited-standards/standards/panel-voice-principles.md`; P11 + P9
  incongruent_register + P5 gricean_violation in
  `leanspirited-standards/standards/character-schema.md`.

**Your queue (Track B — ship in this order):**

| # | Item | Files you own | Pattern to follow | Depends on |
|---|------|---------------|-------------------|------------|
| B1 | **BL-178 v1** — TOPIC MAGNETS engine prompt block. Read character P11 magnet data; sample per turn by surface_form + magnetic_strength; emit block instructing surface use. Wire Golf 19th Hole with `topicMagnetsEnabled: true`. | `src/logic/panel-discuss-engine.js` + `index.html` (Golf wire around line 15497-15503) | BL-179 v1 commit `5ac6c29` — same shape: const block computation, suppression for anchor turns, concatenate into return string, wire Golf flag. | Nothing — Murray/Faldo/Cox P11 data already shipped |
| B2 | **BL-180 v1** — HANG MODE prompt block (deliberate non-response). Per-character `can_leave_hanging` config + reaction options (pivot/redirect/tumbleweed/pause). | `panel-discuss-engine.js` + `index.html` | Same as B1 | Nothing |
| B3 | **BL-181 v1 (shutdown)** — SHUTDOWN MODE prompt block (interrupt before topic launches). Per-character `shutdown_capability` config. Optional transcript em-dash truncation. | `panel-discuss-engine.js` + `index.html` (transcript renderer if doing truncation) | Same as B1 | Nothing |
| B4 | **BL-181 v1 (M-Mech-9)** — INCONGRUENT REGISTER MODE prompt block. Reads P9 `incongruent_register` sub-fields. | `panel-discuss-engine.js` + `index.html` | Same as B1 | Track A must first ship Sebastian/McGinley/Partridge/Boyle P9 incongruent_register data — coordinate with Rod or check character files before shipping B4 |
| B5 | **Lever 5 — Panel Temperature** v0: `panelTemperature: number` config (range -1.0 to +1.0) + bias 2 mechanism scoring functions (M-Mech-3 and M-Mech-7 are the obvious testbeds). Hardcoded panel defaults: 19th Hole -0.6, Comedy Room +0.4, Boardroom -0.2. | `panel-discuss-engine.js` + `index.html` | New shape (no prior template) — engine integration not just prompt block | Spec drafted in primary session chat; full Lever 5 doc not yet committed to standards |

**Constraints — non-negotiable:**

- **Do not edit any `cusslab/characters/*.md` file.** Track A owns those.
- **Do not edit `leanspirited-standards/` files.** Standards work happens in primary session or by explicit Rod direction.
- **`git pull origin main` before every push.** If the primary session has
  pushed in between, fast-forward and re-push.
- **Pipeline-green required before commit.** Run
  `bash .claude/scripts/pipeline-report.sh > /tmp/out.txt && cat /tmp/out.txt`.
  `EXIT=0` and canary `OK`. If RED, fix root cause before commit.
- **Commit + push to live after every shipped item.** Rod tests against live.
  Unpushed work is invisible.
- **Auth canary OK before any work.** Already verified in startup sequence.
  If it goes RED mid-session, stop and run the auth-ops.md procedure.

**Ship pattern per item (follow BL-179 v1 commit `5ac6c29` as canonical):**

1. Add `const <feature>Block = (ctx.<feature>Enabled && !isAnchorTurn) ? '\n\n<NAME> MODE:\n...' : '';` in `buildSystemPrompt` after the other block computations.
2. Concatenate into the return string in the right position.
3. Add the flag to the Golf 19th Hole `buildSystemPrompt` ctx call in `index.html` (search for `parodyEnabled: true` to find the wiring section).
4. Run pipeline. Green required.
5. Commit + push. Use the BL-179 v1 commit message as template — list flags
   added, files changed, pipeline result, Co-Authored-By line.
6. Tell me (or Rod) what shipped and what's next.

**Status checkpoint after each ship.** Report what shipped, commit hash,
pipeline result. Then move to the next item in the queue unless Rod
redirects.

**Stop conditions:** complete the queue, hit a hard blocker (specifically:
need Track A data not yet shipped), or Rod tells you to stop.

[Optional scope override: if you want to ship only specific items, replace
the queue with the items you choose, e.g. "ship B1 and B5 only".]
