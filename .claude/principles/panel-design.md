# Panel Design Principles (Cusslab)
# Canonical principles governing every panel-mechanic change.
# Last updated: 2026-05-16

Read before designing, implementing, or refactoring any cross-cutting panel mechanic
(anchor, TOPIC-DISMISSAL, cross-character glances, trigger-weighted ordering,
profani-saurus, future mechanics).

---

## Principle 1 — One engine, many panels (Rod 2026-05-16)

**Rule.** Make changes to panel mechanics via a shared engine, not by per-panel
duplication. Per-panel files own DATA only (config, members, wounds, enthusiasm
primers, host identity). Cross-cutting mechanics live in a shared engine and
are implemented once.

**Why.** Cusslab has 8+ panel IIFEs (Golf, Boardroom, Football, Comedy Room, Long
Room, Final Furlong, Crucible Corner, Spit Shelter, plus Phil's-opoly under
construction). Per-panel duplication of mechanics multiplies test surface,
multiplies bug fix locations, multiplies the cost of every new principle. The
correct shape is: shared engine + per-panel data. New mechanics get one
implementation, all panels gain them automatically.

**How to apply.** When a new mechanic is needed, the default question is "where
does this live in the shared engine?" not "how do I copy it across 8 panels?"
If the engine doesn't yet exist, the engine extraction (BL-162) is a prerequisite
to the mechanic. Apply the mechanic in one panel as proof-of-concept; defer the
rollout to other panels behind the engine extraction. Don't ship per-panel
duplication unless explicitly authorised as a tactical exception, and log the
exception as a WL item to be undone when the engine lands.

---

## Principle 2 — React to the person, not the topic (Rod 2026-05-16)

**Rule.** When a character references something another character just said,
the reference is to the person, not to the topic. A glance, then a pivot back
to the speaker's own angle. Never adopt the previous speaker's subject. Never
extend it past the dismissal beat. The glance is a bridge back, not a doorway in.

**Why.** Sequential multi-agent harmonisation flattens panel texture — when one
character introduces a topic, the rest adopt it and lose their own voice. The
Faldo Ginsters failure mode is the canonical example (WL-149): Faldo locks
onto Ginsters and the rest of the panel responds inside that frame. The fix is
structural: glances and dismissals reference the PERSON who drifted, then the
speaker returns to their own angle on the user's question.

**How to apply.** This rule informs:
- BL-163 `reacts_to` schema field — registers express stance toward the person;
  no `builds_on` register because it would invite topic adoption.
- BL-168 TOPIC-DISMISSAL block — dismissal is a beat, then return to the user's
  original question.
- BL-167 trigger-weighted selection — score candidates by who is most lit up by
  the previous turn (positive or negative); engine does not verify accuracy
  so misunderstood-but-eager characters can fire.

In prompt instructions: "glance at the person, not the topic", "pursue your own
angle first", "never extend the previous speaker's subject past the beat".

---

## Principle 3 — Engine ignorance, voice expression (Rod 2026-05-16)

**Rule.** The selection / scoring / orchestration engine does not verify
accuracy, register, or fitness of a character's output. The engine picks who
fires and provides context. The CHARACTER VOICE handles correctness, register,
register-mismatch, and any comedic wrongness.

**Why.** The comedy depends on characters being unreliable narrators — P9
`enthusiastic_confabulation`, P10 shadows, P3 status register mismatches. If
the engine pre-filters for accuracy or fitness, it kills the wrongness the
voice depends on. Tufnell's puppy mechanic, Faldo's monomania, Partridge with
strategy — all rely on the engine giving them the floor without checking
whether they should have it.

**How to apply.** Trigger-score engine has no fact-check or accuracy routine.
Character-specific enthusiasm primers fire on keyword match alone; misreading
is allowed and welcomed. The closer's reflection on what just transpired
expresses their voice, not a corrected summary.

---

## Where this file lives

`/home/rodent/cusslab/.claude/principles/panel-design.md` — referenced from
`session-startup.md` step 9 (Principles), `CLAUDE.md` ways-of-working, and
any BL/WL touching panel mechanics.

Cross-product principles (cross-Cusslab/SS/FF) live at
`/home/rodent/leanspirited-standards/standards/` instead. This file is
Cusslab-local.
