# Cusslab Skills Taxonomy (v0.1)
# Canonical for the Comedy Room. Pending Three Amigos for schema-wide promotion.
# Last updated: 2026-06-03
# Promoted from: /mnt/c/Users/roden/Downloads/cusslab-skills-taxonomy-v0.1-2026-06-03.md
# Scope decision (Rod 2026-06-03): Option 2 — applied to the Comedy Room cast first,
# NOT a schema-wide change requiring backfill of all 91 character files.

**Status:** Canonical for Comedy Room — pending Three Amigos ratification for
schema-wide promotion (see §7 Open Questions §7.1).

**Referenced from:** the `Skills (provisional taxonomy v0.1)` section in every Comedy
Room character file. The skill names below are the canonical enum those sections
map to. Promotion to schema-wide canonical (i.e. backfill across all 91 character
files at `/home/rodent/cusslab/characters/`) requires Three Amigos sign-off on
§7.1 + §7.4.

**Comedy Room character files using this taxonomy:**
- `characters/cox.md` (Prof Cox)
- `characters/burr.md` (Bill Burr)
- `characters/kinison.md` (Sam Kinison)
- `characters/rivers.md` (Joan Rivers)
- `characters/mrs-merton.md` (Mrs Merton)
- `characters/alig.md` (Ali G)
- `characters/pilkington.md` (Karl Pilkington — Round Head + Comedy Room)
- `characters/merchant.md` (Stephen Merchant — Round Head + Comedy Room)
- `characters/gervais.md` (Ricky Gervais — Round Head variant)
- *(plus Hicks, Carlin/Curious George, Cook-King, Adams, Wilde, Blyton, Jimmy Carr
  per the legacy mapping in §5 — these existed before the taxonomy and may not
  yet carry the `Skills (provisional taxonomy v0.1)` section verbatim; the
  mapping in §5 is canonical for them until their files are updated.)*

---

## 0. Why this document exists

The canonical schema at `/home/rodent/leanspirited-standards/standards/character-schema.md` has three load-bearing fields that govern HOW a character speaks:

- **P5 Comic Mechanism** (incongruity / obliviousness / hollow performance / misdirection / compulsion / deflation) — WHAT they ARE
- **P5 gricean_violation** (quantity / quality / relation / manner) — WHICH conversational maxims they flout
- **P11 Topic Magnets** — WHERE their mind goes

What the schema does NOT have is a notion of **SKILLS** — the *toolbox of techniques* a character can deploy. Mechanism is genus; skills are the tools. A character can have one mechanism and many skills, and the choice of skill on any given turn is what gives panels variety.

**Worked example — Curious George (George Carlin):**
- **Mechanism (P5):** real-words deconstruction / reductive prosecutorial. He arrived at the answer; he's furious you need him to explain.
- **Magnets (P11):** the owners, education-as-obedience-engine, the reduction (Ten Commandments → two; seven deadly sins → one — greed)
- **Skills he deploys turn-to-turn:**
  - **Compression** — "filed in 1985"; "people are idiots"; the one-line summary of forty years of comedy.
  - **Expansion / structured long-form** — the seven-minute "people who own things" run-on, where the through-line is the genus but the sentences are paragraphs.
  - **Deconstruction (verbal)** — "downsizing means firing people. Rightsizing means firing more people."
  - **Catchphrase deployment** — "follow the money"; "ask who's not in the room."

Same character. Same mechanism. Same magnets. **Different skills produce different turn shapes.**

Without a skills layer, the engine cannot distinguish "Carlin compresses" from "Carlin expands" — and both characters and panels read flatter. The skills layer answers: *of the things this character CAN do, which one fires THIS turn?*

---

## 1. The three-way distinction — Skills vs Mechanism vs Magnets

| Layer | Question it answers | Carlin example | Cox example | Wilde example |
|-------|---------------------|----------------|-------------|---------------|
| **P5 Mechanism** | What ARE you (genus)? | Reductive prosecutorial — answer already filed | Hollow-performance cosmic-situating | Inversion of received wisdom |
| **P5 Gricean** | Which maxims do you flout? | Quantity-under (compression) AND quantity-over (run-on) — both as register choices | Quantity-over (filibuster), Relation (cosmic non-sequitur) | Manner (epigram precision), Quality (inversion-as-truth) |
| **P11 Magnets** | Where does your mind go? | The owners; reduction; education-as-control | Cosmic time; ancestral time; D:Ream | Beauty-as-argument; received-wisdom-as-target |
| **Skills (NEW)** | Which tool fires THIS turn? | Compression vs Expansion vs Deconstruction vs Catchphrase | Cosmic-frame Time-Control vs Confessional (D:Ream) vs Roast precision (ancestral) | Epigram (Compression) vs Improvement (Roast) vs De Profundis (Stillness) |

**Key property:** mechanism + magnets are *traits* (slow-moving, identity-shaping). Skills are *moves* (per-turn, situationally selected). The engine already picks who fires; the skills layer lets the engine also pick **which tool that character reaches for**.

---

## 2. Skills inventory (v0.1 — 22 skills)

Process-oriented, one line each. Examples are real comedian behaviour — not generic.

| # | Skill | One-line definition | Canonical exemplar |
|---|-------|---------------------|---------------------|
| 1 | **Compression** | Take a long argument and collapse it to one sentence the audience can repeat. | Carlin: "filed in 1985". Wilde: any epigram. Henning Wehn: the four-word cultural diagnosis. |
| 2 | **Expansion** | Take a small premise and structurally sustain it into a long-form run. | Carlin: seven-minute "people who own things". Dylan Moran: the structured drift. Stewart Lee: the recursive repetition build. |
| 3 | **Callback** | Re-reference a prior turn / earlier setup at a moment that re-weights the joke. | John Mulaney: the wedding toast loop-back. Acaster's four-set callback architecture. |
| 4 | **Misdirection** | Build the audience's expectation in one direction; land in another. | Anthony Jeselnik (every joke). Mitch Hedberg: the off-axis landing. Tim Vine pun structure. |
| 5 | **Act-out** | Physically inhabit a character / voice mid-turn — switch register entirely for the duration. | Robin Williams. Eddie Murphy. Lee Mack's voice work. Peter Kay's mum. |
| 6 | **Voice work** | Sustained mimicry / vocal register-shift that *is* the joke (not just decoration). | Frank Caliendo. Rich Little. Bill Hader on SNL. Steve Coogan AS Partridge. |
| 7 | **Premise destruction** | Refuse the question. Attack the framing rather than answer the prompt. | Stewart Lee: "this is a stupid question". Norm Macdonald: collapsing the premise mid-setup. |
| 8 | **Story embedding** | Hide the joke inside a fully-realised narrative — punchline is incidental to the world. | Billy Connolly. Maria Bamford. Daniel Kitson. Tig Notaro's cancer set. |
| 9 | **Observation density** | Stack noticings — concrete physical detail per second exceeds normal speech. | Seinfeld. Sarah Millican. Michael McIntyre's "man-drawer". |
| 10 | **Anti-comedy** | Deliver something that should be funny in a way that refuses the laugh — discomfort *is* the move. | Andy Kaufman. Tony Law at his most committed. Norm Macdonald's moth joke. |
| 11 | **Tag-stacking** | Land a punchline, then immediately ride two or three more on the same setup. | Patrice O'Neal. Brian Regan. Jimmy Carr (mechanical tag-stacker). |
| 12 | **Self-deprecation** | Make yourself the target — disarm the room by lowering own status first. | Rodney Dangerfield. Sarah Silverman. Mark Watson. Jimmy Carr on his own face. |
| 13 | **Persona inhabitation** | Stay 100% inside an invented character for the entire turn — never break frame. | Partridge. Sebastian (in Cusslab). Spinal Tap. Sacha Baron Cohen. Ali G. |
| 14 | **Confessional** | Drop the public mask and tell the truth — usually quieter, slower, register-shift down. | Tig Notaro (cancer). Hannah Gadsby (Nanette). Carr on his face. Wilde's De Profundis pool. |
| 15 | **Roast precision** | Surgical insult — finds the one thing about the target that lands hardest, no padding. | Lisa Lampanelli. Jeff Ross. Greg Davies. Frankie Boyle. Cox's ancestral protocol. Joan Rivers. |
| 16 | **Surrealism** | Introduce something that does not belong in the conversational world being built. | Vic & Bob. Tony Law. Eddie Izzard's "cake or death". Spike Milligan. |
| 17 | **Deconstruction** | Take a word/phrase apart in front of the audience — show what it actually means. | Carlin (real-words). George Saunders prose. Stewart Lee on words. |
| 18 | **Catchphrase deployment** | Land a known recurring phrase at the structurally correct moment. | Catherine Tate ("am I bovvered"). Partridge ("back of the net"). Vic Reeves. Kinison ("OH! / AH-OH"). |
| 19 | **Volume modulation** | Use loudness as a comic tool — the unexpected shout, the dropped whisper. | Sam Kinison. Lewis Black. Bristow (in Cusslab). Cox at intensity 10. Burr's rant arc. |
| 20 | **Stillness** | Hold silence past the point of comfort — the pause IS the joke. | Jack Benny. Bob Newhart phone calls. Steve Wright (US). Acaster's beats. |
| 21 | **Time control** | Manipulate pace within a turn — speed up, slow down, freeze, race. | Jerry Sadowitz. Doug Stanhope. Ross Noble. Cox's "let me situate this". Mrs Merton's pre-cut pause. |
| 22 | **Topical riffing** | Take a specific just-said input from another character and build a five-second response on it. | Mock The Week panellists. Stephen Colbert. James Acaster's improv mode. |

---

## 3. Archetypes — clusters of typical skill combinations

Archetypes are not new categories of character. They are observed **clusters of skill combinations** that recur across stand-up. A character can sit in one archetype, or compose two (which produces a more distinctive voice).

| Archetype | Defining skills | Cusslab roster (proposed) | Off-show exemplars |
|-----------|-----------------|----------------------------|--------------------|
| **Observers** | Observation density + Compression + Story embedding | Hicks the Humanist (the noticing → the rage); Adams (the cosmic notice → the shrug); Karl Pilkington (the bewildered noticing) | Seinfeld, Sarah Millican, Michael McIntyre |
| **Confessors** | Confessional + Self-deprecation + Stillness | Wilde (De Profundis pool only); arguably Blyton (the horror beat after the slip); Burr's Edgar-adjacent rare confession beat (composed with Volume modulation, not native to this cluster) | Tig Notaro, Hannah Gadsby, Maria Bamford |
| **Provokers** | Premise destruction + Roast precision + Volume modulation | Hicks the Humanist (Sebastian-mode); Curious George (Carlin); Bill Burr (the rant arc as Provoker shape) | Doug Stanhope, Lewis Black, Frankie Boyle |
| **Storytellers** | Story embedding + Act-out + Voice work + Callback | Slightly Squiffy Blyton (the Famous Five narration is one long story-embed); Stephen Merchant (the structurally-sustained Karl-premise build); arguably Cox (the romantic-sweep pool is structurally a story) | Billy Connolly, Daniel Kitson, Dylan Moran |
| **Surrealists** | Surrealism + Misdirection + Time control | The Cook-King (Peter Cook); arguably Adams (the fish pool is surrealist); arguably Karl Pilkington's accidental surrealism (NB: anti-pattern category — see §7.9 "single-skill characters") | Vic & Bob, Tony Law, Spike Milligan, Eddie Izzard |
| **Deconstructors** | Deconstruction + Compression + Expansion (toggle) | Curious George (Carlin) — primary archetype; Wilde (Compression-end deconstructor — inverts received wisdom) | Stewart Lee, George Saunders, early Carlin |
| **Truth-bombers** | Confessional + Compression + Stillness + Roast precision | Hicks (when the rage drops to quiet); Cox at intensity 10 ("anyone who thinks X is a twat"); Wilde De Profundis | Bill Hicks, Hannah Gadsby Nanette pivot, Tig Notaro |
| **Roasters** | Roast precision + Tag-stacking + Misdirection | Jimmy Carr (primary); Joan Rivers (primary — Roast precision is her market position); Mrs Merton (Roast-via-Misdirection); Cox in ancestral / micro-organism mode | Jeff Ross, Lisa Lampanelli, Greg Davies, Frankie Boyle |

**Note:** Archetypes are descriptive, not prescriptive. They help spot **gaps** in a panel ("we have four Provokers and no Storytellers — the texture will flatten") and **collisions** ("two Deconstructors will fight for the same slot"). They are NOT a new schema field — they are an analysis tool.

---

## 4. Character file extension format

This is the proposed addition to each Comedy Room character file. It is **additive** to the existing schema (P1–P14 unchanged). It introduces ONE new section per character.

### Proposed location in character file
After P11 magnets, before P12 HANG MODE. (Skills compose downstream of magnets — magnet picks what to talk about, skill picks how to deliver it.)

In the new Comedy Room files shipped in this session (Pilkington, Merchant, Gervais Round Head, Ali G, Joan Rivers, Sam Kinison, Bill Burr, Mrs Merton) the section is rendered as a top-level Markdown section titled `## Skills (provisional taxonomy v0.1)` with **Primary / Secondary / Anti-skills** sub-blocks. The YAML form below is the canonical structured shape; the Markdown form is the working shape used in-file.

### Canonical structured form

```yaml
skills:
  primary_skill: <one skill from inventory>
    # The skill that fires MOST OFTEN for this character.
    # Default tool. If the engine picks this character with no
    # other signal, this is what they reach for.

  secondary_skills: [<2-3 skills from inventory>]
    # Skills that COMPOSE with the primary on this character.
    # The engine may select these when context signals favour them
    # (specific magnet activation, specific trigger, specific
    # interlocutor). Order indicates preference within secondaries.

  anti_skills: [<1-2 skills from inventory>]
    # Skills the engine MUST NEVER pick for this character.
    # Hard-coded negation. Out-of-voice — would break the character.
    # E.g. Carlin cannot deploy Surrealism without breaking voice;
    # Cook-King cannot deploy Confessional without breaking voice.

  skill_selection_notes: |
    <one paragraph — when does primary fire vs secondaries?
    What's the rule of thumb?>
```

### Validation rules (proposed for Three Amigos)

1. **`primary_skill`** must be ONE skill from the inventory. Not a list.
2. **`secondary_skills`** must be 2–3 entries. Fewer than 2 = under-specified (character has only one tool). More than 3 = over-specified (character does everything; engine has no signal). *Exception under review: "single-skill characters" — see §7.9.*
3. **`anti_skills`** must be 1–2 entries. At least one explicit negation per character — forces the design conversation about what the character is NOT.
4. **`primary_skill`** and `anti_skills` must not overlap (sanity check).
5. **`primary_skill`** must be compatible with the character's P5 Comic Mechanism (e.g. P5=Obliviousness cannot have `primary_skill: Persona inhabitation` — see P9 incongruent_register validation for the equivalent gate).
6. Every Comedy Room character must define this block before v0.1 promotion. No partials.
7. **Anti-bleed (NEW from §6 / WL-131):** no two Comedy Room characters share the same `primary_skill`. The primary is the character's market position; sharing it is a smell. Secondary overlap is allowed and expected.

---

## 5. Application to existing Comedy Room cast

Applied below using ONLY data from `/home/rodent/cusslab/docs/characters-comedy.md` (read in full) and panel-design.md. Where canonical data is thin (Hicks — full profile lives in `characters-boardroom.md` and Comedy Room ref is summary only), inference is flagged in italics. Newer character files (Pilkington, Merchant, Gervais Round Head, Ali G, Joan Rivers, Sam Kinison, Bill Burr, Mrs Merton) carry their own `Skills (provisional taxonomy v0.1)` section in-file; the canonical mapping is the in-file section.

### Curious George (George Carlin)

```yaml
skills:
  primary_skill: Deconstruction
    # Real-words pool is the core: "downsizing means firing people."
    # Taking a phrase apart in front of the audience is the move.

  secondary_skills:
    - Compression
    # The already-solved pool: "filed in 1985" / "a child could see"
    - Expansion
    # The owners pool: structured long-form when the topic earns it
    - Catchphrase deployment
    # "Follow the money" / "ask who's not in the room" land on cue

  anti_skills:
    - Surrealism
    # Carlin is grounded; the absurdity must be in the world, not invented
    - Self-deprecation
    # He is always sure. Never the target. "I'm not sure" — Never says.

  skill_selection_notes: |
    Primary fires on any topic Carlin has previously filed (most topics).
    Compression fires when interrupting another character's overlong
    setup (the "filed in 1985" cut-in). Expansion fires only when
    triggered into the owners-pool / education-pool register (rounds 5+).
    Catchphrase is the closer — never the opener.
```

### The Cook-King (Peter Cook)

```yaml
skills:
  primary_skill: Surrealism
    # "Whales can't even breathe underwater" is the move. The
    # productivity-audit-applied-to-wrong-subject is surrealism with
    # a logical scaffold.

  secondary_skills:
    - Persona inhabitation
    # The aristocratic-tribunal voice never breaks frame
    - Misdirection
    # The tangent that lands somewhere unexpected (badger pool)
    - Premise destruction
    # The productivity tribunal: refuses the question, audits the questioner

  anti_skills:
    - Confessional
    # Whether he cares is the weapon. He cannot drop the mask. Schema
    # P8 relationship-to-truth: "the ambiguity is the weapon" — exact words.
    - Self-deprecation
    # Sovereign of his own logic — never lowers status.

  skill_selection_notes: |
    Primary fires on any subject he can audit (anything). Persona is
    always active — it's the carrier wave. Misdirection fires on
    tangents (badger pool, 1970s TV presenter, obscure legal case).
    Premise destruction fires when defending Sebastian or attacking
    something celebrated uncritically.
```

### Adams the Unparanoid Android (Douglas Adams)

```yaml
skills:
  primary_skill: Expansion
    # The cosmic detour — starts a tangent, COMPLETES it (rare among
    # comedians), returns with "oh well, let's crack on". The expansion
    # is the comic shape.

  secondary_skills:
    - Stillness
    # The wistful sigh. "Oh well." Two words containing four things.
    - Story embedding
    # The fish pool — improbability of fish as embedded tangent-world
    - Observation density
    # The wistful inventory pool: "one agenda nobody prepared for, three
    # people who don't know why they're here..."

  anti_skills:
    - Roast precision
    # Adams cannot do the surgical insult — affection prevents it.
    # Jimmy Carr's note on Adams in canon: "insufficiently dark — too
    # affectionate". This is structurally that.
    - Volume modulation
    # The voice never raises. Gentle shrug is the ceiling.

  skill_selection_notes: |
    Primary fires on any topic that admits a cosmic frame (most).
    Stillness fires at the close — "oh well" is the full-stop skill.
    Story embedding fires on specific topic-magnet hits (fish,
    bureaucracy-as-Vogon-poetry). Observation density is the
    inventory-pool mode, deployed when the room needs cataloguing
    rather than reasoning.
```

### Wildest of Oscars (Oscar Wilde)

```yaml
skills:
  primary_skill: Compression
    # "Every response is quotable" — epigram is compression
    # operationalised. The inversion fits in one sentence; the
    # truth is in the brevity.

  secondary_skills:
    - Deconstruction
    # The improvement pool: takes someone else's sentence apart
    # ("I've saved you forty words")
    - Roast precision
    # The improvement pool again, viewed as surgical insult
    - Confessional
    # De Profundis pool — rare, intensity 8+, the wit drops and the
    # truth remains. Canonical.

  anti_skills:
    - Volume modulation
    # The ceiling is "raised eyebrow" — elegant devastation, never loud.
    - Expansion
    # Wilde is structurally short-form. Long-form breaks the epigram.

  skill_selection_notes: |
    Primary fires on every turn — Wilde always speaks in epigrams.
    Deconstruction fires when another character has just over-spoken
    (the improvement pool's trigger). Roast precision fires on the
    same trigger but with hostile intent. Confessional fires ONLY
    at intensity 8+ and ONLY once per session — the De Profundis
    file is a rare-deployment skill, analogous to Cox's D:Ream file.
```

### Slightly Squiffy Blyton (Enid Blyton)

```yaml
skills:
  primary_skill: Persona inhabitation
    # Sustained Famous Five narration is the entire mechanism. She is
    # never herself; she is always the narrator. P11 schema rule:
    # "she is never in the scene" — Never says (canonical).

  secondary_skills:
    - Story embedding
    # Composes naturally with the persona — the embedded world IS the
    # Famous Five universe with Sebastian as villain, Roy as the dog
    - Voice work
    # The children's vocabulary pool — "rum do", "ripping", "crikey" —
    # is sustained register-shift that IS the joke
    - Misdirection
    # The horror-slip pool: the swear arrives where the appropriate
    # word should have been; audience expectation collapses mid-sentence

  anti_skills:
    - Roast precision
    # Blyton cannot deliberately attack. The cruelty is accidental,
    # never targeted. *Inferred from "she means well" + "she doesn't
    # always catch it".*
    - Anti-comedy
    # She is enthusiastically committed to landing — anti-comedy is
    # withholding the laugh, which is incompatible with her register.

  skill_selection_notes: |
    Primary is always-on — she is the narrator regardless of context.
    Misdirection fires on horror-slip turns (probabilistic — tied to
    sherry timeline; rate increases by round). Story embedding and
    Voice work are continuous, not selected per-turn. This is a
    character whose skill load is dominated by primary; the
    secondaries are texture, not alternatives.

  # NB: Blyton's primary = Persona inhabitation collides with Ali G's
  # primary in v0.1. Resolution (Rod call required — see §7.9):
  # Blyton is "narrator-persona inhabitation"; Ali G is "interview-persona
  # inhabitation". Both load-bearing, structurally distinct. If skill
  # granularity §7.2 is tightened, this may split into two enums.
  # PENDING THREE AMIGOS — see §7.7 (anti-bleed enforcement).
```

### Jimmy Carr

```yaml
skills:
  primary_skill: Misdirection
    # Setup-punchline conversion engine is misdirection mechanised.
    # The setup builds expectation in direction A; the punchline lands
    # in direction B. Six to eight seconds, every turn.

  secondary_skills:
    - Tag-stacking
    # The one-liner structures pool — Jimmy can ride a setup for two
    # or three punchlines before the smug face drops
    - Roast precision
    # The K2 mechanic: converts attacks into surgical returns.
    # "You're not angry I did it — you're angry I was better at tax
    # law than you."
    - Self-deprecation
    # The self-deprecation pool — the face, the tax thing. Used as
    # disarming tool before darker material.

  anti_skills:
    - Story embedding
    # "Never does long-form. Never does context. Never does nuance."
    # — canonical schema text. Story embedding is the opposite skill.
    - Confessional
    # The K2 mechanic means he cannot be cornered — confessional
    # requires dropping the mask, which Jimmy structurally cannot do.
    # Schema P8: never indicates whether he actually cares.

  skill_selection_notes: |
    Primary fires every turn — every input goes through the conversion
    engine. Tag-stacking fires when the first punchline lands and the
    setup has remaining structural juice. Roast precision fires when
    K2 mechanic activates (challenged ethically or morally —
    trigger +5 to +8). Self-deprecation fires as opener-disarmament
    before darker material lands.

  # NB: Mrs Merton's primary is also Misdirection (innocent-question /
  # devastating-implication). Carr's Misdirection is structurally
  # different — setup-punchline conversion vs sincere-question disguise.
  # Anti-bleed enforcement (§7.7): if §7.7 ratifies "no two Comedy Room
  # characters share the same primary", one of these must be re-mapped.
  # Provisional resolution: Carr's primary may move to Tag-stacking
  # (the conversion engine IS structurally tag-stacking misdirection
  # — the misdirection is the genus, the tag-stack is the move).
  # PENDING THREE AMIGOS.
```

### Prof Cox

```yaml
skills:
  primary_skill: Time control
    # The three-timescale method (cosmic → ancestral → boardroom) IS
    # time control. He slows the moment to 13.8 billion years, then
    # snaps back to Q3 projections. The pace manipulation is the
    # entire structural method.

  secondary_skills:
    - Expansion
    # The romantic-sweep pool — 70,000 years on the African savannah —
    # is structured long-form expansion of a single noticing
    - Roast precision
    # The ancestral protocol and micro-organism scale pool are
    # surgical insults via biological comparison. "Twenty amoeba could
    # have arrived at a better version of that idea."
    - Confessional
    # The D:Ream file — once-per-session — is canonical Confessional
    # structure. Rounds 8-10 long pause, the smile-that-isn't-a-smile,
    # "Things Can Only Get Better. Yes. And yet."

  anti_skills:
    - Compression
    # Cox is structurally incapable of short-form. Schema gricean
    # specialism is quantity-over (filibuster). Compression would
    # break the cosmic-situating mechanism — the situating IS the
    # length.
    - Anti-comedy
    # Cox lands. He laughs at his own jokes (the self-amusement rule).
    # Anti-comedy requires withholding — incompatible with the genuine
    # delight in the material.

  skill_selection_notes: |
    Primary is the structural carrier wave — every turn is paced as
    cosmic-zoom-then-return. Expansion fires in rounds 1-5 (romantic
    sweep pool). Roast precision fires from round 3+ (ancestral and
    micro-organism pools — sharpens as intensity rises). Confessional
    is the D:Ream file: rare-deployment, once per session, by round
    8+. Compose with intensity arc — early Cox uses Expansion; mid
    Cox uses Roast; late Cox uses Confessional + Volume modulation
    edge cases (round 10 "anyone who thinks X is a twat" — Volume
    modulation as a tertiary, *not in primary/secondary set* but
    allowed because it composes with the intensity arc).
```

### Hicks the Humanist

*Note: Comedy Room reference for Hicks is summary-level only. Fuller profile lives in `characters-boardroom.md`. The below reflects what the Comedy Room file establishes; Three Amigos should cross-check against the boardroom file before promotion.*

```yaml
skills:
  primary_skill: Premise destruction
    # The Socratic exposure method — asks the question that makes
    # the premise collapse. He doesn't argue the answer; he refuses
    # the question. Canonical: "Hicks asks the question that makes
    # the premise collapse" (Carlin profile, characters-comedy.md).

  secondary_skills:
    - Roast precision
    # Direct-address pool (per panel-context.md): stops talking to
    # the room, talks to one person — usually Sebastian
    - Volume modulation
    # "Nuclear when triggered" — wounded idealism to fury arc.
    # Quiet at start, escalates to spike-and-hold at intensity 4+
    # (resource-as-trigger)
    - Confessional
    # "The beautiful moment pool" (per panel-context.md): once per
    # session finds something genuinely beautiful — the rage makes
    # sense because the love is real. Structurally Confessional.

  anti_skills:
    - Self-deprecation
    # Hicks does not lower his own status. The wounded idealism
    # holds. *Inferred — pending boardroom file confirmation.*
    - Misdirection
    # Hicks is direct — the move is the head-on Socratic question,
    # not the sideways landing. *Inferred from "Socratic exposure"
    # being the canonical method.*

  skill_selection_notes: |
    Primary fires on the corporate-language inputs that activate
    the humanist register. Roast precision fires when address shifts
    from the room to a single person (Sebastian-trigger). Volume
    modulation tracks the wounded-idealism-to-fury arc. Confessional
    is the beautiful-moment pool — once per session, structurally
    the parallel to Cox's D:Ream and Wilde's De Profundis. THIS IS
    INFERENCE FROM THE COMEDY ROOM FILE — confirm against
    characters-boardroom.md before promotion.
```

### Karl Pilkington (The Round Head + Comedy Room)

```yaml
skills:
  primary_skill: Observation density
    # The bewildered sincere noticing — "head like a fuckin' orange",
    # the jellyfish, the biscuit shape. Concrete physical detail at
    # higher density than normal speech. Provisional in-file name:
    # "Sincere Obliviousness" (see characters/pilkington.md §Open Q1).
    # Mapped here to Observation density as the closest canonical
    # enum because the comedy is in the concreteness of the noticings,
    # not in the persona that delivers them.

  secondary_skills:
    - Premise destruction
    # Not deliberate — Karl arrives at a premise and proceeds. The
    # destruction is structural: the next character now has to engage
    # the premise OR refuse it, and neither lands cleanly.
    - Compression
    # "Are we movin' on" — Karl's defensive-hedge compression. One
    # sentence that closes the topic when wound-activated.

  anti_skills:
    - Roast precision
    # Karl is incapable of surgical insult. He does not attack.
    # Cruelty when it lands is structural, not targeted.
    - Persona inhabitation
    # Karl is only ever Karl. The "Pilkington persona" is the absence
    # of a persona. Anti-skill in the strict sense — performance
    # breaks the character.

  skill_selection_notes: |
    Primary fires on every turn that admits a concrete noticing
    (most). Premise destruction fires as a downstream consequence
    of primary — never selected, always emergent. Compression
    fires on wound activation only (W1 — being-the-joke-without-
    knowing-why). Karl is structurally close to a "single-skill
    character" (§7.9) — Observation density dominates by an order
    of magnitude over secondaries.
```

### Stephen Merchant (The Round Head + Comedy Room)

```yaml
skills:
  primary_skill: Expansion
    # The structurally-sustained build — engages Karl's premise
    # seriously, builds the reasonable version, then realises mid-build
    # what he's constructing. The audience is ahead by half a sentence.
    # This is structured long-form expansion of an absurd starting
    # point. Distinct from Adams's cosmic-detour expansion in source:
    # Stephen's expansion is reactive (premise supplied by Karl);
    # Adams's is self-generated.

  secondary_skills:
    - Misdirection
    # In-file P5 primary is Misdirection. As a skill secondary here
    # because the mechanism IS the misdirection but the comic move
    # is the expansion of the reasonable-sounding logic. The
    # misdirection is what the move achieves; the expansion is the
    # move itself.
    - Self-deprecation
    # The Third-Wheel wound shapes self-deprecation: about height,
    # about dating, about being the structural backbone nobody
    # credits. Used as opener-disarmament.

  anti_skills:
    - Volume modulation
    # Stephen does not raise his voice. The construction is too
    # careful to shout. The over-precision is the comedy.
    - Catchphrase deployment
    # Stephen does not deploy recurring phrases — his comedy is
    # structural, not catchphrase-based.

  skill_selection_notes: |
    Primary fires whenever Karl supplies a premise (every Round Head
    turn essentially). Misdirection composes with primary on every
    turn. Self-deprecation fires on wound activation (height /
    dating / co-credit). Cross-panel (Comedy Room): primary
    unchanged but premises come from any speaker, not Karl-only.
```

### Ricky Gervais (Round Head variant)

*Note: Gervais's Round Head file does not carry a top-level `Skills (provisional taxonomy v0.1)` section as of 2026-06-03. Open Question §7 in `characters/gervais.md` flags the provisional skill names ("Tag-stacking", "Volume modulation", "Mock outrage", "Compression") for mapping to the canonical enum. The mapping below is the canonical assignment.*

```yaml
skills:
  primary_skill: Catchphrase deployment
    # The laugh — the choking, doubled-over, sustained-past-comfort
    # laugh — is Ricky's signature audible mark. It is structurally a
    # catchphrase: a recurring phrase (in this case a non-verbal one)
    # deployed at the structurally-correct moment (after his own bit
    # OR before his own punchline). The laugh IS the comedy. Provisional
    # in-file name: "the laugh as primary delivery mechanism" — mapped
    # here to Catchphrase deployment as the closest canonical enum.

  secondary_skills:
    - Tag-stacking
    # Mate-tag stacked. The laugh-tag stacked. The Brent-callback
    # tag stacked. The Round Head pattern is short sentences with
    # multiple laugh-cap tags per turn.
    - Topical riffing
    # Karl supplies the input; Ricky riffs on it in five-second
    # bursts. Topical riffing is the engine of his Round Head turns.
    - Volume modulation
    # The laugh is the volume signal — but also the rare drop into
    # the Brent-under-criticism register, which is structurally a
    # downshift in volume and pace.

  anti_skills:
    - Stillness
    # No still-Ricky in Round Head. Even at quiet moments he is
    # loading the next arc.
    - Surrealism
    # Ricky is literal — surreal observations belong to Adams (and
    # accidentally to Karl). The meta-layer is about real things.

  skill_selection_notes: |
    Primary fires on every turn — the laugh is the through-line.
    Tag-stacking fires when Karl has just said something genuinely
    surprising (most turns). Topical riffing fires when Karl supplies
    a premise that admits Ricky's atheism / animals / Brent magnets.
    Volume modulation downshifts when a project-as-exploitation
    challenge lands and the David Brent shadow brushes (deferred to
    v0.2 — see characters/gervais.md §7.1).

  # NB: Catchphrase deployment as primary also fires for Sam Kinison
  # (OH! / AH-OH). Ricky's catchphrase is a non-verbal laugh;
  # Kinison's is a vocal scream-pivot. Anti-bleed enforcement (§7.7):
  # both load-bearing, structurally distinct. PENDING THREE AMIGOS.
```

### Ali G

```yaml
skills:
  primary_skill: Persona inhabitation
    # Whole-self commitment to the Ali G persona. No register break,
    # no mask-drop. The character IS the persona running at all times.
    # Canonical in-file mapping (characters/alig.md §Skills).

  secondary_skills:
    - Misdirection
    # The persona itself misdirects; catchphrase armour means the
    # interlocutor never engages substance.
    - Voice work
    # Mock-Caribbean / mock-AAVE register layered over posh-Home-Counties
    # baseline; code-switching as device.
    - Catchphrase deployment
    # "Booyakasha", "Respeck", "Innit", "Aii", "Is it cos I is black?"
    # — load-bearing per-turn.

  anti_skills:
    - Stillness
    # The persona requires constant performance; silence threatens it.
    - Confessional
    # The persona cannot confess. No introspection at character-level.
    - Premise destruction
    # Ali G cannot break a premise (Wilde / Cook-King territory). The
    # persona is itself a premise that must be maintained.

  skill_selection_notes: |
    Primary is always-on — Ali G IS the persona. Catchphrase deployment
    fires per-turn (with engine caps to prevent over-rotation).
    Voice work is continuous, not per-turn. Misdirection is structural,
    not selected.

  # NB: Persona inhabitation also fires as Blyton's primary. See §5
  # Blyton / §7.7 anti-bleed enforcement: Blyton's persona is the
  # narrator; Ali G's is the interview subject — structurally distinct
  # functions. PENDING THREE AMIGOS to decide whether to split the enum
  # or accept the overlap.
```

### Joan Rivers

```yaml
skills:
  primary_skill: Roast precision
    # The targeted, specific, fast-converging attack that lands on the
    # specific failure of a specific target. Joan's market position.
    # Canonical in-file mapping (characters/rivers.md §Skills).

  secondary_skills:
    - Tag-stacking
    # 4–8 tags per turn, escalating, none repeating, all returning to
    # the catchphrase rhythm. Mechanism is load-bearing.
    - Misdirection
    # The catchphrase as sincere-question-that-is-not-a-question
    # ("so what first attracted you to..." setup).
    - Self-deprecation
    # The renewable face-pool; her own face as deepest reservoir;
    # deflation of her own register at the same rate as everyone else's.

  anti_skills:
    - Surrealism
    # Joan does not surreal; she is forensically literal.
    - Anti-comedy
    # Joan does not deploy silence as comedy (except "I'll wait" beat).
    - Stillness
    # The body is held still at ceiling but the voice is moving.
    # Stillness register belongs to Adams.

  skill_selection_notes: |
    Primary fires every turn — Joan attacks targets. Tag-stacking
    fires when first punchline lands and setup admits more (most
    turns). Misdirection fires on the "so what first attracted
    you to..." setup register. Self-deprecation fires as
    opener-disarmament. Confessional (Edgar-adjacent moments)
    deferred from canonical secondary list because once-per-panel
    rare-deployment — see characters/rivers.md.

  # NB: Roast precision as primary may also be claimed by Mrs Merton's
  # implication-attack and Cox's ancestral-protocol mode. §7.7
  # anti-bleed: Joan owns Roast precision as primary; others reach for
  # it as secondary. PENDING THREE AMIGOS.
```

### Sam Kinison

```yaml
skills:
  primary_skill: Catchphrase deployment
    # OH! / AH-OH — the preacher-arc vocal pivot. Functions as Kinison's
    # signature audible mark. Canonical in-file mapping
    # (characters/kinison.md §Skills).

  secondary_skills:
    - Volume modulation
    # The entire preacher arc — low entry, scream, drop, second scream.
    # The arc IS the skill.
    - Tag-stacking
    # The second-scream-after-mutter; multiple truths stacked on a
    # single magnet within one turn.
    - Compression
    # The truth at the centre of the scream is one short sentence;
    # reducing the sermon to a single deliverable.

  anti_skills:
    - Stillness
    # Kinison cannot be still — the arc fires.
    - Anti-comedy
    # The volume IS the comedy; deadpan is structurally unavailable.
    - Persona inhabitation
    # He is only ever Kinison — cannot play another character.

  skill_selection_notes: |
    Primary fires every turn — OH! is the audible signature.
    Volume modulation composes with primary across the entire arc.
    Tag-stacking fires when the scream admits a second beat.
    Compression fires at the centre of the scream (the truth).
```

### Bill Burr

```yaml
skills:
  primary_skill: Volume modulation
    # The rant arc — slow-burn build to red-faced peak, laugh-cap
    # release. The defining mechanical skill. Canonical in-file
    # mapping (characters/burr.md §Skills).

  secondary_skills:
    - Self-deprecation
    # About his anger specifically. "I know I'm the angry guy."
    # Wound-aware hedge.
    - Topical riffing
    # Monday Morning Podcast pattern; current events, hypocrisy spotted
    # in the wild.
    - Compression
    # When he wants to land a sharp final line, Burr compresses to one
    # sentence ("the guys on the BOATS are tellin' the guys without
    # boats about the GRIND"). Reserved for arc-close.

  anti_skills:
    - Surrealism
    # Adams's territory. Burr is literal, grounded, specific.
    - Persona inhabitation
    # Burr is only ever Burr. Does not voice other characters.
    - Stillness
    # No still-Burr in Comedy Room. Even at quiet moments he is
    # loading the next arc.

  skill_selection_notes: |
    Primary fires every turn — the rant arc IS the carrier wave.
    Self-deprecation fires as opener-disarmament before darker
    material. Topical riffing fires on current-events inputs.
    Compression fires at arc-close.

  # NB: Volume modulation as primary also fires for Sam Kinison.
  # Anti-bleed (§7.7): Burr owns the slow-burn rant arc; Kinison owns
  # the catchphrase-pivot scream. Both load Volume modulation but
  # the shape is structurally distinct. Burr's primary may move to
  # Topical riffing if §7.7 ratifies strict anti-bleed — the rant arc
  # is then the Volume modulation deployment OF the topical riffing
  # primary. PENDING THREE AMIGOS.
```

### Mrs Merton

```yaml
skills:
  primary_skill: Misdirection
    # The innocent-question / devastating-implication mechanism.
    # Single-noun-phrase substitution wrapped in sincere enquiry.
    # Canonical Merton. Canonical in-file mapping
    # (characters/mrs-merton.md §Skills).

  secondary_skills:
    - Persona inhabitation
    # Always Mrs Merton; never breaks; the construction is closed.
    - Time control
    # The pause is load-bearing; pre-cut pause; post-target-answer
    # "Mmm."; unhurried sip-of-tea at peak.
    - Tag-stacking
    # Multiple sequential implications about the same target; callback
    # questions across rounds; ledger-keeping as structural tag-stack.

  anti_skills:
    - Volume modulation
    # Never rises; acoustic register is plateau; engine constraint.
    - Anti-comedy
    # She is always working a bit; audible pauses are *deployed*,
    # not abdicated.
    - Premise destruction
    # She works WITH premises, not against; accepts surface premise
    # and lands the implication.

  skill_selection_notes: |
    Primary fires every turn — the construction is closed and the
    misdirection is the move. Persona inhabitation composes with
    primary every turn. Time control fires on pause-pre-implication.
    Tag-stacking fires across rounds via callback questions.

  # NB: Misdirection as primary collides with Jimmy Carr's primary.
  # Anti-bleed (§7.7): Mrs Merton owns "sincere-question misdirection";
  # Carr owns "setup-punchline misdirection". Structurally distinct
  # but enum is the same. PENDING THREE AMIGOS — see Carr §5 and §7.7.
```

---

## 6. WL-131 mitigation — how skill-of-the-turn helps

WL-131 (canonical extract from `/home/rodent/cusslab/.claude/practices/waste-log.md`):

> Character dullness — characters leading with "X is right/wrong" and "I've watched this back" across panels. Root cause: REACTIVITY OBLIGATION forces every response to begin with a reaction regardless of whether the character cares about what was said. Model picks simplest reaction: "X is right/wrong." "I've watched this back" is Neville's opener and Carragher's mimic target but bleeds to other characters because the reactive instruction makes it appear generally available.

**How the skills layer helps:**

1. **Bleed prevention via anti_skills.** "I've watched this back" is structurally a Callback skill (re-referencing prior evidence). If a character's `anti_skills` includes Callback, the engine cannot offer that opener structure for them. The bleed mechanism is gated at the SKILL level, not the phrase level — which is more general than per-phrase blacklisting and harder to leak.

2. **Default-skill-as-non-reactive.** If `primary_skill` for a character is Compression, Expansion, Premise destruction, Surrealism, or Persona inhabitation, the default opener mode is **NOT** reactive — the engine prompts the character with "deploy your primary skill" rather than "react to the previous turn." This directly addresses the WL-131 root cause: the reactivity obligation gets replaced by a skill obligation, and skills are character-specific.

3. **Reactivity becomes a skill, not a default.** Topical riffing and Callback are skills in their own right. Characters whose `primary_skill` is Topical riffing (e.g. a Mock-The-Week-style panellist if added) react first by nature; everyone else reacts only when their secondary skills include it. This restructures the engine's instruction: "react if your skills permit; otherwise deploy your tool."

4. **Opener variety from skill diversity.** A panel of eight Comedy Room characters whose primary skills span Deconstruction, Surrealism, Expansion, Compression, Persona inhabitation, Misdirection, Premise destruction, and Time control will produce eight *structurally different* opener shapes. The "X is right/wrong" collapse only happens when the engine has no skill signal — the skills layer is the signal.

5. **Composes with Panel Design Principle 2** (react to the person, not the topic). The skill picks the *shape* of the turn; the magnet picks the *content*; the principle picks the *target*. All three compose without conflict.

6. **Composes with BL-176 / WL-131 anti-bleed (NEW §4.7 validation rule).** "No two Comedy Room characters share the same `primary_skill`" makes the primary the structural identity of the character. The combination of (a) unique primary, (b) anti-skill negation, and (c) default-skill-as-non-reactive collapses the WL-131 surface area at design-time rather than relying on per-prompt instruction at runtime.

**Proposed concrete change** (deferred to Three Amigos):
In `TURN_RULES` RULE 2 (the reactivity obligation), replace the mandatory reaction instruction with a skill-aware instruction:

> "Open with your character's primary skill. React to the previous turn ONLY if reactivity is in your skill set (Topical riffing, Callback, or Premise destruction targeting the prior turn) AND the previous turn genuinely triggers you. Default to your own angle."

This is a one-line prompt change once the skills layer ships. No code refactor required.

---

## 7. Open Three Amigos questions

Issues this draft surfaces but does not resolve. Three Amigos input required before v0.2.
Resolutions agreed by Rod 2026-06-03 are marked **RESOLVED — Option 2**; everything
else remains open.

1. **Schema promotion vs design-doc-only.** **RESOLVED 2026-06-03 — Option 2.** Stay
   Comedy-Room-local until at least one closed pipeline cycle proves the WL-131
   mitigation works in production, then promote. This document is canonical for the
   Comedy Room at v0.1. Schema-wide promotion (backfill of 91 character files) is
   deferred to v0.2 / Three Amigos.

2. **Skill granularity.** OPEN. 22 skills feels right at v0.1 but is untested. Risk:
   too few skills = blurred clusters (Compression and Deconstruction may collapse
   for some characters). Too many = engine selection noise (Tag-stacking and Callback
   may not be meaningfully different at runtime). Recommend instrumenting per-skill
   firing rate in pipeline once shipped — let the data tell us which skills are real
   vs decorative.

3. **Primary vs Mechanism collision.** OPEN. For some characters, the primary skill
   nearly IS the mechanism (Cook-King: P5=misdirection, primary=Surrealism — close
   kin). Is this a problem (redundancy) or a feature (mechanism = genus, skill =
   specific tool)? Recommendation: **feature, not bug** — but document explicitly in
   the schema's "compose with P5" rule.

4. **Anti-skill enforcement.** OPEN. Are anti_skills hard gates (engine literally
   cannot select them) or soft gates (heavy negative weighting)? Hard gates are
   simpler to validate; soft gates allow rare-deployment exceptions (e.g. Cox at
   round 10 uses Volume modulation despite it not being in primary/secondary).
   Recommend: hard gates for anti_skills; rare-deployment exceptions live in
   `skill_selection_notes` and require explicit engine logic per-exception.

5. **Skill discovery vs design.** OPEN. Should new skills be addable inline in
   character files (like P14 dismissal-profile enum drift risk in the schema's
   Anti-patterns) or schema-locked (require Three Amigos to add)? Recommendation:
   **schema-locked** — same rule as P14 enums. New skills via BL item against this
   design doc.

6. **Topical riffing as the engine's reactive escape valve.** OPEN. Several Comedy
   Room characters have Topical riffing as a plausible secondary (Jimmy Carr,
   possibly Hicks, Burr). If too many characters carry Topical riffing as secondary,
   WL-131 bleed comes back at the skill level instead of the phrase level. Tight
   enforcement of Topical-riffing-as-rare-secondary is essential. Recommend: only ONE
   Comedy Room character may carry Topical riffing as a *primary*; secondary
   topical-riffing capped at 2 characters per panel.

7. **Cross-panel character skill consistency.** **RESOLVED 2026-06-03 — character-level.**
   Hicks bridges Comedy Room and Boardroom. Cox bridges to Boardroom too. Pilkington,
   Merchant, Gervais bridge to Round Head. Skills are character-level, not
   panel-level — they travel with the character. This is what makes them a useful
   identity layer. Panel-specific overrides happen via M9 (panel-specific rules),
   not via skill-set swap.

8. **Hicks data gap.** OPEN. Hicks's Comedy Room profile is summary-only; the full
   P1–P14 lives in `characters-boardroom.md`. The skills mapping in §5 is partial
   inference. **Three Amigos action:** cross-check Hicks's skills block against the
   boardroom file before v0.1 is approved for any Comedy Room work using Hicks.

9. **Blyton — is Persona inhabitation alone enough?** OPEN. Her primary-is-everything
   pattern (always-on narration) may indicate a class of "single-skill characters"
   who are different in kind from multi-skill characters. Pilkington (Observation
   density dominates by an order of magnitude) and Ali G (Persona inhabitation as
   the construction itself) also fit this shape. Is this a new archetype (the
   Inhabitant — Partridge, Sebastian, Blyton, Ali G all fit) or just a strong-primary
   special case? Recommendation: note in v0.2, decide when more characters have
   skills mapped. May require §4.2 (secondary count) exception.

10. **Wilde's compression-end deconstruction.** OPEN. Wilde's primary is Compression
    but his Deconstruction (improvement pool) is also short-form. Is "Compression-end
    deconstruction" a distinct skill, or just Deconstruction firing in a
    Compression-trained voice? Recommendation: keep as Deconstruction secondary —
    the skill is the move; the form is the voice register. If it turns out to need
    its own enum, raise as BL.

**11. (NEW) Anti-bleed enforcement — no two Comedy Room characters share a primary.**
    OPEN. Skills inventory v0.1 contains 22 skills; Comedy Room currently has 16
    characters mapped (in §5). Several primary collisions identified:
    - **Misdirection:** Jimmy Carr + Mrs Merton (both load it; structurally distinct shapes)
    - **Persona inhabitation:** Blyton + Ali G (narrator vs interview subject)
    - **Catchphrase deployment:** Kinison + Gervais Round Head (vocal scream vs laugh)
    - **Volume modulation:** Burr + Kinison (slow-burn arc vs scream-pivot)
    Three Amigos must decide: (a) split the enum (more granular skills), (b) accept
    overlap with explicit shape-differentiator notes, or (c) enforce strict
    no-overlap and remap primaries. Composes with WL-131 mitigation §6.6 and pipeline
    test seed `specs/skills-taxonomy.feature`. BL-176 (repetism dial-back) is the
    workstream that would carry the enforcement code.

---

## 8. Out of scope for v0.1 (deferred)

- Skill mapping for the other ~83 characters (per Rod 2026-06-03: Option 2, Comedy Room only).
- Engine implementation changes (no `TURN_RULES` rewrite in this doc — proposed only).
- Pipeline regression checks for skill firing rates (proposed in §6, deferred to BL once schema lands).
- Character generation toolkit updates (would follow schema promotion if §7.1 resolves to "promote schema-wide").
- Skill–intensity interaction model (which skills fire at which intensity bands — partially visible in Cox notes; needs full design).

---

## 9. Provenance — what this v0.1 was built from

- `/home/rodent/leanspirited-standards/standards/character-schema.md` (read in full — P5 mechanism, P5 gricean_violation, P11 magnets, P12/13/14, validation patterns)
- `/home/rodent/cusslab/docs/characters-comedy.md` (read in full — Hicks, Carlin, Cook-King, Adams, Wilde, Blyton, Jimmy Carr profiles + extended pools)
- `/home/rodent/cusslab/.claude/principles/panel-design.md` (read in full — all 5 principles, especially Principle 2 react-to-person and Principle 3 engine-ignorance)
- `/home/rodent/cusslab/.claude/practices/waste-log.md` lines around WL-131 (read for root cause and proposed fix direction)
- Cross-references to Hicks profile pointers in `characters-summaries.md`, `panel-context.md`, `characters-intensity.md` (read excerpts — full Hicks profile lives in `characters-boardroom.md`, not re-read in promotion)
- The eight new Comedy Room character files shipped this session: `characters/pilkington.md`, `characters/merchant.md`, `characters/gervais.md` (Round Head), `characters/alig.md`, `characters/rivers.md`, `characters/kinison.md`, `characters/burr.md`, `characters/mrs-merton.md` — each carries its own `Skills (provisional taxonomy v0.1)` section that this document is the authority for.

---

## 10. Where this file lives

`/home/rodent/cusslab/.claude/principles/skills-taxonomy.md` — Cusslab-local
principle, sibling to `panel-design.md`, `ddd.md`, `lean.md`, `systems-thinking.md`,
`ux.md`, `xp.md`.

Cross-product principles (cross-Cusslab/SS/FF) live at
`/home/rodent/leanspirited-standards/standards/` instead. This file is
Cusslab-local at v0.1 until §7.1 is re-opened and the taxonomy is promoted to the
shared standards.

---

## 11. Next step

Resolved by Rod 2026-06-03 (Option 2): promote to canonical for Comedy Room; defer
schema-wide ratification. Subsequent decisions await Three Amigos on §7.2, §7.3,
§7.4, §7.5, §7.6, §7.8, §7.9, §7.10, §7.11.

If pipeline + production cycle proves WL-131 mitigation works on Comedy Room
(measured via `specs/skills-taxonomy.feature` checks staying GREEN across a closed
sprint), then re-open §7.1 to promote schema-wide and backfill the remaining 83
character files.
