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

## Panel Feature Build Order

1. Present to the Boardroom — core feature, 7 panel members
2. The Comedy Room — second panel, 7 members
3. The 19th Hole — sports parent with Football and Golf tabs
4. Additional sports panels — Cricket first, then Tennis, Rugby, Snooker — only when real use reveals the gap

Do not build panel 4 features until panels 1-3 are at full coverage.
