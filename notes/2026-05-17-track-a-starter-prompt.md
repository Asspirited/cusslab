# Track A Starter Prompt — paste into the second Claude Code session

Copy everything below the `---` line and send as the first message to the
second Claude Code session.

(Swap rationale: primary session is taking Track B engine work; this
starter hands the second session Track A — pure character data work on
character files. Cold-start friendly, file-disjoint from engine work,
ships fast.)

---

You are the second Claude Code session, working in parallel with another
session on the Cusslab project (`/home/rodent/cusslab/`). You own **Track A
— character data work**. The other session owns Track B (engine and
wiring). The two tracks are file-disjoint by design so we cannot conflict.

**Read first, in this order, before any code:**

1. `/home/rodent/cusslab/.claude/session-startup.md` — full mandatory startup
   sequence (auth canary, pipeline, waste log, backlog).
2. `/home/rodent/cusslab/.claude/CLAUDE.md` — note the **experimental
   workflow exemption** (Rod 2026-05-17): Gherkin gate is relaxed for
   Cusslab; pipeline-green still required; commit + push to live after
   every change; Rod's feedback is the validation.
3. `/home/rodent/cusslab/notes/2026-05-17-parallel-session-brief.md` — full
   context on what's locked, what's shipped, and the Track A/B split.
4. `/home/rodent/leanspirited-standards/standards/character-schema.md` —
   the canonical character schema. Pay particular attention to:
   - **P5 — Comic Mechanism** (gricean_violation sub-field is new, optional but recommended)
   - **P9 — Lie Profile** (incongruent_register lie_style option is new with sub-fields polarities[], allowed_levels[], motivations[])
   - **P11 — Topic Magnets** (3-5 per character; full sub-field spec)
5. `/home/rodent/cusslab/characters/murray.md`, `faldo.md`, `cox.md` — canonical examples of P11 magnets already shipped. Match this style and depth.

**Then verify your starting state:**

```bash
cd /home/rodent/cusslab && git pull origin main
bash .claude/scripts/pipeline-report.sh > /tmp/out.txt && cat /tmp/out.txt
```

Pipeline must report `EXIT=0` and canary `OK` before you touch anything.

**Your queue (Track A — ship in this order — each is a standalone commit):**

| # | Item | File | Notes |
|---|------|------|-------|
| A1 | **Sebastian P9 incongruent_register** sub-fields | `cusslab/characters/sebastian.md` (find or create) | polarities=[hostile_as_warm], allowed_levels=[3,4,5], motivations=[status_undercut, discomfort_creation]. Sebastian is the primary M-Mech-9 user — most important pilot. |
| A2 | **McGinley P9 incongruent_register** sub-fields | `cusslab/characters/mcginley.md` (find or create) | polarities=[hostile_as_warm], allowed_levels=[3,4,5], motivations=[achievement_over_exaggeration]. Specifically vs Faldo — McGinley's M-Mech-9 firings target Faldo. |
| A3 | **Partridge P9 incongruent_register** sub-fields | `cusslab/characters/partridge.md` (find or create) | polarities=[hostile_as_warm], allowed_levels=[3,4], motivations=[self_exposure-via-excessive-praise]. Partridge exposes himself through his praise — classic L4. |
| A4 | **Boyle P9 incongruent_register** sub-fields | `cusslab/characters/boyle.md` (find or create) | polarities=[hostile_as_warm, warm_as_hostile], allowed_levels=[4,5], motivations=[banter_as_affection, status_undercut]. Boyle is rare — holds both polarities. |
| A5 | **Add P5 gricean_violation field to Murray, Faldo, Cox** existing files | `cusslab/characters/murray.md`, `faldo.md`, `cox.md` | Per the new P5 sub-field (committed `e39b249` to standards). Murray = `relation` + `quantity-over`. Faldo = `manner` + `quality`. Cox = `relation` + `quantity-over` (different shape — cosmic frame applied to local question). |
| A6 | **Additional character P11 magnet pilots** (optional — Rod-prioritised order): Souness, Roy Keane, Henni Zuel, Diogenes, Big Ron. Read each character file first, identify implicit magnets, formalise 3-5 per character following Murray's pattern. | `cusslab/characters/*.md` | Each is a separate commit. |

**Constraints — non-negotiable:**

- **Do not edit `cusslab/src/logic/panel-discuss-engine.js` or
  `cusslab/index.html`.** Track B owns those.
- **Do not edit `leanspirited-standards/` files.** Standards work happens
  in primary session or by explicit Rod direction.
- **`git pull origin main` before every push.** If the primary session has
  pushed in between, fast-forward and re-push.
- **Pipeline-green required before commit.** Run
  `bash .claude/scripts/pipeline-report.sh > /tmp/out.txt && cat /tmp/out.txt`.
  `EXIT=0` and canary `OK`. If RED, fix root cause before commit.
- **Commit + push to live after every shipped item.** Rod tests against
  live. Unpushed work is invisible.
- **Auth canary OK before any work.** Already verified in startup
  sequence. If it goes RED mid-session, stop and run the auth-ops.md
  procedure.

**Ship pattern per item (follow Murray P11 commit `ecfa861` as canonical
for P11 magnets; follow the relevant character files for P9 / P5):**

1. Read the character file in full to understand the existing voice.
2. For P11: identify 3-5 topic magnets that the character's mind genuinely
   returns to (not what others bring up — what the *character* gravitates
   toward). Use the schema's worked example (Murray) for the format. Each
   magnet needs: anchor_items (≥6), magnetic_strength, surface_form,
   acknowledgement_rule, audience_recognition, composes_with. Include the
   wound-displacement explanation at end.
3. For P9 incongruent_register: declare polarities, allowed_levels (subset
   of 3, 4, 5), motivations. Validate that motivations compose with
   declared polarities (banter_as_affection requires warm_as_hostile, etc).
4. For P5 gricean_violation: add a one-line array under P5 naming which of
   the four maxims (quantity, quality, relation, manner) this character
   specialises in flouting. One to three maxims per character; four reads
   as broken.
5. Run pipeline (`bash .claude/scripts/pipeline-report.sh`). Green required.
6. Commit + push. Use Murray P11 commit `ecfa861` (or Faldo `6e5c766`, Cox
   `41628b2`) as message template — name what was added, list the new
   sub-field values, pipeline result, Co-Authored-By line.
7. Tell me (or Rod) what shipped and what's next.

**Status checkpoint after each ship.** Report what shipped, commit hash,
pipeline result. Then move to the next item in the queue unless Rod
redirects.

**Stop conditions:** complete the queue, hit a hard blocker, or Rod tells
you to stop.

[Optional scope override: if you want to ship only specific items, replace
the queue with the items you choose, e.g. "ship A1 only".]
