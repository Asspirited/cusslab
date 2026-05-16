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

## Principle 4 — Pool entries: specific anchor + visceral truth + implied history (Rod 2026-05-16)

**Rule.** When writing pool entries — food, thermal, garage, cars,
entertainment, swears, openers, signature-move variants, any character
voice pool — every entry follows this shape:

1. **Specific cultural anchor.** Era / brand / road / programme / place,
   not abstract. "Ford Cortina", not "a car". "Brookline", not "a tournament".
   "A Pork Farms scotch egg", not "a snack".
2. **Visceral physical or emotional truth.** A heat you can feel, a cold
   you've experienced, a smell, a sound, an image with sensory cue. "Hot
   enough to require a witness statement" lands; "very hot" does not.
3. **Implied speaker history.** The character was THERE. The entry implies
   biography. "A Cortina in a Spanish car park" implies the speaker was in
   that car, in that car park, in that era — a working-class British
   package-holiday memory in one phrase.

**Why.** Abstract escalation ("extremely cold", "very warm", "really hot")
reads as filler and the model defaults to the same abstract phrasing every
turn. Anchored entries are individually memorable AND disambiguate the
character — Murray's pool cannot sound like Faldo's if both are anchored
properly. The gold-standard examples Rod called out in BL-172 v1.1
("hotter than the steering wheel of a Cortina in a Spanish car park",
"colder than my second wife's farewell text") all carry era-anchored class
signal + sensory cue + biography in one short phrase.

**How to apply.** When writing or accepting a new pool entry, check the
three boxes explicitly. If any is missing, the entry is filler — revise.
Pool size matters less than pool *quality*: 15 anchored entries beat 50
abstract ones because the anchored ones don't blur. Applies to:
- BL-172 (Faldo voice pools v1, all-character pools v2 via engine)
- BL-169 (profani-saurus — each character swear anchored to class/era/biography)
- Any future opener variety, signature-move pool, mechanic pool

---

## Principle 5 — Profanity as craft, not weapon (Rod 2026-05-16)

**Rule.** Profanity in character voice is a craft register, not shock value.
Every swear that fires earns its place through one of five purposes:

1. **Off-air candour.** Overheard backstage. Hot-mic. The panellist
   momentarily forgetting they're on telly. The crack between the public
   mask and the private register — "yeah, off, get him off, what an
   absolute knobend", muttered to the next character.
2. **Phonetic comedy.** Words that are funny in the mouth regardless of
   meaning. Bollocks, knobhead, gubbins, plonker, wazzock, pillock,
   codswallop, gobshite. The phonemes do the work.
3. **Good adjective / intensifier.** Profanity as comic specificity —
   "absolute prick of a tee shot", "fuckin' brilliant", "right royal pile
   of shite". The swear sharpens an image.
4. **Climactic landing.** One well-placed swear after a long restrained
   build, not five strung together. The Murray model: barely ever swears,
   so when it happens the room stops.
5. **Emotional emphasis.** Anger or amusement wells up and the profanity
   is the release valve or the lever that lands a point or joke harder.
   Distinct from #3 (cold adjective) and #4 (structural placement) — this
   one is FELT, involuntary or near-involuntary. Wound activation, recent
   insult, banter spike, genuine delight at someone else's failure — all
   plausible drivers. Map to existing engine state: wound_activated →
   anger; warm temperature + posture build → amusement.

**Why.** Cusslab is a profanity-themed product, but the gold standard is
the British comedic tradition: Viz's Profanisaurus, The Thick of It's
Malcolm Tucker poetry, Father Ted's Father Jack, Roger Mellie. Profanity
as music, wordplay, character reveal. NEVER as weapon (cruelty, slurs,
violence-language). NEVER as filler ("fucking" five times in a paragraph
for no purpose). NEVER as rhythm-killer (overdone profanity destroys the
beat faster than no profanity at all). Rich variety > volume.

**How to apply.** When designing per-character swear vocabulary (BL-169
profani-saurus), every entry must pass at least one of the four register
criteria. Filler swears get cut. Vocabulary differs sharply per character —
Souness terse-Glasgow-direct, Diogenes ancient-Greek-precise, Boyle
Scottish-precision-cruelty, Roy Keane Cork-thunderous, Bristow Cockney-
exuberant, Faldo English-restraint-with-rare-eruption, Murray almost-never-
swears-which-makes-each-instance-devastating. Pool size matters less than
appropriateness — five well-chosen swears per character beat fifty generic.
Composes with Principle 4 (pool entries: specific anchor + visceral truth
+ implied history) — a swear without character anchoring is filler.

---

## Where this file lives

`/home/rodent/cusslab/.claude/principles/panel-design.md` — referenced from
`session-startup.md` step 9 (Principles), `CLAUDE.md` ways-of-working, and
any BL/WL touching panel mechanics.

Cross-product principles (cross-Cusslab/SS/FF) live at
`/home/rodent/leanspirited-standards/standards/` instead. This file is
Cusslab-local.
