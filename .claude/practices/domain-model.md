# Domain Model — Practices
# Heckler and Cox
# Last updated: 2026-02-28
# Principles: see .claude/principles/ddd.md
# Reference: Eric Evans — Domain-Driven Design (2003)

---

## Ubiquitous Language — Canonical Terms

Rod's words are law. These terms must appear verbatim in Gherkin, variable names,
function names, comments, and documentation.

| Domain Term | Meaning | Never call it |
|-------------|---------|---------------|
| Panel member | One of the four AI characters | Agent, responder, bot, persona |
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

summariseFromState() is the anti-corruption layer between Panel Context and API Context.
It translates domain language (intensity, triggers, conflicts) into API language (prompt prefix).
The domain never learns about tokens, roles, or API structure.
The API never learns about panel member personalities or scoring dimensions.
