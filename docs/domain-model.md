# Domain Model — Heckler and Cox

Reference: Eric Evans — Domain-Driven Design (2003)
Principles: see .claude/principles/ddd.md

---

## Ubiquitous Language — Canonical Terms

Rod's words are law. These terms must appear verbatim in Gherkin, variable names,
function names, comments, and documentation.

| Domain Term | Meaning | Never call it |
|-------------|---------|---------------|
| Panel member | One of the AI characters | Agent, responder, bot, persona |
| Prompt | Corporate phrase the user submits | Input, query, request, message |
| Round | One complete exchange in a conversation | Turn, step, iteration, cycle |
| Trigger | Word/phrase that changes panel state | Event, signal, detector, hook |
| Intensity | Panel member's current emotional charge | Score, level, heat, anger, activation |
| Baseline | Minimum intensity — 20% of peak | Floor, minimum, reset value |
| Roast mode | Panels respond to the input laterally | Attack mode, critique mode, pile-on |
| Debate mode | Panels respond to each other longitudinally | Argument mode, discussion mode |
| Scoring dimension | One of the 12 measurable aspects | Metric, measure, attribute, criterion |
| Irony band | Named irony authenticity level | Category, tier, grade, rating |
| Cultural calibration | Regional adjustment to scoring | Localisation, regionalisation, locale |
| Event log | Record of state changes only | History, transcript, log, audit trail |
| Concession | Panel member position shifted under pressure | Defeat, update, change |

---

## Bounded Contexts

### Scoring Context
**Owns:** 12 scoring dimensions, computeF(), cultureScore(), ironyScore()
**Does not own:** panel personalities, API calls, UI rendering
**Interface:** receives (text, region) → returns ScoringResult (12 dimension scores)
**Invariant:** scoring is stateless — same input always returns same output

### Panel Context
**Owns:** panel member profiles, character state, event log, summariseFromState()
**Does not own:** scoring logic, API calls, UI rendering
**Interface:** receives (prompt, characterState) → returns (panelResponse, updatedState)
**Invariant:** state transitions follow intensity rules — intensity never below baseline

### API Context (Cloudflare Worker)
**Owns:** Anthropic API calls, credit management, API key
**Does not own:** scoring, panel personalities, UI, domain language
**Interface:** receives (prompt, panelConfig) → returns AI response
**Invariant:** API key never leaves this context — never touches frontend

### UI Context
**Owns:** rendering, user input, mode selection, tab navigation, error display
**Does not own:** scoring logic, panel state, API calls
**Interface:** calls scoring and panel contexts → renders results
**Invariant:** no business logic in the UI — only presentation decisions

---

## Core Domain Model

```
User submits Prompt
    │
    └──► Panel Context
              │
              ├── Heckler (CharacterState)
              ├── Suit (CharacterState)
              ├── Hippy (CharacterState)
              └── Realist (CharacterState)
                        │
              Each CharacterState:
              ├── current_intensity
              ├── peak_intensity
              ├── baseline_intensity (20% of peak)
              ├── trigger history (EventLog)
              ├── open_conflicts []
              ├── concessions []
              └── position_shifts []
                        │
              summariseFromState() → prompt prefix (≤500 tokens)
                        │
                        └──► API Context (Cloudflare Worker)
                                  │
                                  └──► Anthropic API
                                            │
                                  Panel response returned
                                            │
                                  ◄──────────────────────
                                            │
              ◄────────────────────────────┘
              │
              └──► Scoring Context
                        │
                        └── 12 dimensions scored
                                  │
                                  └──► UI Context (renders result)
```

---

## Domain Events

| Event | Meaning | Logged in EventLog |
|-------|---------|-------------------|
| linguistic_trigger | Trigger word fired for panel member | Yes |
| linguistic_trigger_repeat | Same trigger fires again, intensity spikes | Yes |
| grammar_trigger | Grammatical pattern triggered panel member | Yes |
| inter_panel_trigger | Panel member triggered by another's words | Yes |
| conflict_opened | Inter-panel conflict started | Yes |
| conflict_escalated | Existing conflict intensified | Yes |
| position_shifted | Panel member conceded or doubled down | Yes |
| intensity_decayed | Round passed with no trigger | Yes |

---

## Aggregates

**PanelConversation** (root aggregate)
- Owns all panel member states for a session
- Owns the EventLog
- Enforces: no state leaks between sessions
- Enforces: baseline_intensity = 20% of peak_intensity always

**ScoringResult** (value object — immutable)
- Owns all 12 dimension scores for a given phrase
- Immutable once calculated — same input always same output

**IronyAssessment** (value object — immutable)
- Owns: criterion_1_pass, criterion_2_pass, criterion_3_pass, band, explanation
- Derived from ScoringResult — never calculated independently

---

## Anti-Corruption Layer

`summariseFromState()` is the anti-corruption layer between Panel Context and API Context.
It translates domain language (intensity, triggers, conflicts) into API language (prompt prefix).
The domain never learns about tokens, roles, or API structure.
The API never learns about panel member personalities or scoring dimensions.

---

## Reference Pools — Per Character, Per Dimension

Each character has multiple sources per reference dimension.
The engine selects or rotates each round — same character, same joke structure, never quite the same twice.
Pools defined at character creation. Three to five sources per dimension minimum.

**The deeper principle:** don't hard-code "cheese and pickle" — hard-code "food from childhood, slightly wrong for the occasion." The pool instantiates the rule. The character stays true. The reference stays fresh. Intensity levels follow the same principle: don't hard-code the specific profanity — hard-code the register, the target, and the delivery mechanism.

Pools are defined in each character file (characters-boardroom.md, characters-comedy.md, characters-sports.md) and in characters-intensity.md.

---

## Character Builder Section

Users can create their own panel members using the same framework as existing characters.
Created characters join the panel alongside existing ones.
Potentially shareable — "here's my character, add them to your panel."
The character profiles in the characters-*.md files are the exact schema.

When adding a new panel member, define all of the following before writing any code:

1. **Name** — canonical name as it appears in the panel table
2. **Real reference** — the person or archetype being channelled
3. **Worldview** — one sentence. The lens through which they see everything.
4. **Voice** — how they speak. Rhythm, register, signature moves.
5. **Triggers** — what raises their intensity, with +N values
6. **Never says** — the thing they would never say, and what they say instead
7. **Inter-panel** — their relationship to every other active panel member
8. **Special state rules** — any mechanics beyond standard trigger/intensity (e.g. Radar's round-based escalation, Coltart's wound)
9. **Protocols** — named behaviours: ancestral protocol, entropy escalation, bullshit protocol, etc.
10. **Extended pool** — at least 6 sample responses covering the range of their intensity arc
11. **First-person perspectives** — what they think of every other panel member (goes in perspectives.md)

Do not commit a character to the panel until all 11 fields are complete.
A partial character is worse than no character — it produces inconsistent voice.

---

## Named Character and Panel Mechanics

These are the canonical named mechanics across all panels. When building a new character or panel, apply all general mechanics and any panel-specific ones that fit. Add to this list only when a mechanic has been applied to at least two characters or one complete panel — never name something until it has proven itself.

---

### General Mechanics (apply to every character, every panel)

**OPENER VARIETY**
Every character has a named OPENER VARIETY section in their prompt. The section defines four sub-types:
- STANDARD OPENERS — the working repertoire, rotated, never repeated back-to-back
- SIGNATURE PATTERN — a unique verbal tic or structural move (not every character has one; only name it if it's real and identifiable)
- NON-SEQUITUR OPENERS — tangent-opening moves that redirect before engaging; must feel natural to the character's worldview
- TRIGGERED OPENERS — openers that only fire when a specific condition is met (a wound is active, an intensity threshold is crossed, a specific character or topic is present)

The rule: rotate naturally, never default to the same opener twice running. Silence is a valid opener. One word is a valid opener.

**MIMIC**
Every panel's TURN_RULES includes MIMIC as reactive move 7. Three types — never named in output, never signalled:
- Type A — ECHO (affectionate): repeat their phrase in your own register, gently
- Type B — SUBSTITUTION (weaponized or comic): take their signature phrase, replace the key word/noun with something wrong or devastating
- Type C — SUSTAINED IMPRESSION (satirical): briefly become them — same cadence, wrong content; lose thread mid-sentence because they would; once only per session

Each panel's TURN_RULES MIMIC section also defines TARGET PATTERNS — the specific mimicable signatures for each character in that panel (e.g. Murray's "What. A. Shot.", Boycott's "47.72", Waddell's baroque register). Never write MIMIC without the target patterns — generic mimic instruction produces generic output.

---

### Character-Level Mechanics (per character, where applicable)

**WOUNDS**
A wound is a named personal failure, betrayal, or gap that never healed. Wounds are triggered by specific words, topics, or characters. When a wound fires, intensity spikes by a defined amount (+2 to +4). Wounds are defined in characters-*.md and needles-and-conflicts.md. Every fully-built character has at least one named wound. Multi-panel characters (Prof Cox, Wise Sir Nick) have panel-specific wounds.

**ROUND-BASED ESCALATION**
Some characters escalate on a fixed schedule tied to session rounds, independent of triggers (Radar/Wayne Riley is the canonical example). Define the round states explicitly: what changes each round in voice, content, physical behaviour, naming mechanic. The escalation arc is non-reversible within a session.

**NAMING MECHANIC**
A character referred to by different names by different panel members depending on current verdict (Radar/Wayne, where "Radar" = respect and "Wayne" = he's being a prick). The mechanic must specify: who uses which name, under what conditions, and what the name change signals to the reader.

---

### Panel-Level Mechanics (per panel, where applicable)

**WANDERING MODES**
Each panel has named wandering modes — defined in wandering-modes.md. A wandering mode is a structured drift triggered by a specific condition, with a named trajectory and a defined return path. Panels without wandering modes are not fully built.

**CONSPIRE ENGINE**
Pair-based conspiracy detection. When two characters with a pre-defined relationship are both in the session, the engine loads a pre-existing temperature and a named trigger. The conspiracy arc is: recognition → escalation → surface → resolution or irresolution. Defined in needles-and-conflicts.md under conflict matrices. Not every pair has a conspiracy — only pairs where the tension is real and documented.

**CROWD PRESSURE (Darts)**
The Alexandra Palace crowd noise bleeds into the studio. Five crowd states (QUIET / WARM / ROARING / CHAOS / BEDLAM) calibrate energy across all darts characters. Each character responds differently to crowd state — defined in their prompt. The Frankenstein Wound (Bristow/Taylor) amplifies in high crowd states.

**DEAD-IN-PANEL-WORLD (Darts)**
Bristow and Waddell are dead. They are present in the studio anyway. Other characters do not acknowledge this. The panel behaves as if this is unremarkable. Do not explain it.

---

### Ubiquitous Language Additions

| Term | Meaning |
|---|---|
| **OPENER VARIETY** | Named general trait — the set of distinct turn-opening moves a character can deploy, ensuring no two consecutive turns open identically |
| **SIGNATURE PATTERN** | A character's single most identifiable verbal tic, nameable and imitable (e.g. Murray's "What. A. Shot."); only documented where genuinely real |
| **MIMIC** | Reactive move 7 in all TURN_RULES — three-type mechanic (Echo, Substitution, Sustained Impression) with panel-specific target patterns |
| **WOUND** | A named personal failure or gap that fires on specific triggers, spiking intensity |
| **TARGET PATTERN** | The specific mimicable signature for a character — the phrase, cadence, or move that others can echo, substitute, or sustain |
| **NAMING MECHANIC** | A character referred to by different names depending on panel verdict |
| **DEAD-IN-PANEL-WORLD** | A character physically present in the studio who is, canonically, dead |

---

## Panel Feature Build Order

1. Present to the Boardroom — core feature, 7 panel members
2. The Comedy Room — second panel, 7 members
3. The 19th Hole — sports parent with Football and Golf tabs
4. Additional sports panels — Cricket first, then Tennis, Rugby, Snooker — only when real use reveals the gap

Do not build panel 4 features until panels 1-3 are at full coverage.
