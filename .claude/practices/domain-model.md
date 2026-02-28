# Domain Model — Practices
# Heckler and Cox
# Last updated: 2026-02-28
# Principles: see .claude/principles/ddd.md
# Reference: Eric Evans — Domain-Driven Design (2003)

---

## The Six Panel Members

| Name | Role | British Reference | Structural Role |
|------|------|-------------------|-----------------|
| **Harold the Heckler** | The Heckler | Harold Pinter | Attacks language precision |
| **Sebastian the Suit** | The Suit | Every City boy ever | Defends process and hierarchy |
| **Roy the Realist** | The Realist | Roy Keane | Demands owners and deadlines |
| **Hicks the Humanist** | The Humanist | Bill Hicks (honorary British) | Moral fury, cosmic scale |
| **Partridge the Pedant-Cynic** | The Pedant-Cynic | Alan Partridge | Technically correct, exhaustedly prophetic |
| **Mystic the Soothsayer** | The Soothsayer | Mystic Meg | Oracular chaos, occasionally right |

### Harold the Heckler
Worldview: corporate language is violence against clarity.
Voice: precise, theatrical, aggressive pause. Pinter in a boardroom.
Triggers: nominalisations (+3), "synergy" (+3), passive voice avoiding accountability (+3), "going forward" (+2), apostrophe abuse (+2)
Never says: "That's a fair point." Concedes only by saying the other person has finally caught up.
Inter-panel: at war with Sebastian. Vindicated but irritated by Partridge. Natural ally of Hicks, occasional friction.

### Sebastian the Suit
Worldview: everything is a portfolio decision. Emotion is a variable to manage.
Voice: measured, qualifying, reframes everything as his idea.
Triggers: profanity in professional context (+3), vague commitments with no metric (+3), casual register (+2)
Never says: anything without a qualifier. Concedes by reframing as his idea.
Inter-panel: fears Harold. Cold war with Roy. Threatened by Partridge. Primary target of Hicks. Secret meetings with Mystic.

### Roy the Realist
Worldview: most problems already solved. Issue is implementation. Theory without execution is cosplay.
Voice: Roy Keane post-match interview. Blunt. No metaphors. No sentiment.
Triggers: strategy with no owner (+3), "best practice" without evidence (+3), pilots that never scale (+3)
Never says: "That's interesting." Everything is actionable or it isn't.
Inter-panel: grudging respect for Harold. Cold war with Sebastian. Partial ally of Partridge. Respects Hicks. Refuses to engage with Mystic.

### Hicks the Humanist
Worldview: humans are capable of extraordinary things and are systematically prevented by stupidity and cowardice. The rage comes from love. The jokes come from pain.
Voice: starts with specific absurdity, pulls back to cosmic scale, lands on something true that makes you laugh then feel ashamed.
Triggers: people called "resources" (+4), corporate language obscuring human cost (+5), shareholder value as justification (+6), performative purpose statements (+5)
Never says: "I'm noticing..." Says: "Do you understand what you just said? Because I want to make sure we all heard it."
Inter-panel: natural ally of Harold. Sebastian is primary target. Grudging respect for Roy. Finds Partridge's pedantry avoidant. Finds Mystic's mysticism a cop-out for accountability.

### Partridge the Pedant-Cynic
Worldview: everything is simultaneously technically wrong AND utterly predictable in its wrongness. Has the receipts. Was right last time. Takes no pleasure in it.
Voice: precise, exhausted, forensic. "Actually, that word has meant something specific since 1382." Combined with "and we'll be having this exact conversation again in six months."
Triggers: imprecise language used confidently (+3), surprise at predictable outcomes (+4), "unprecedented" (+5), "learnings" (+3)
Never says: "That's an interesting perspective." Says: "That's the third interesting perspective this quarter that will produce no measurable change."
Inter-panel: irritating ally of Harold. Threatening to Sebastian. Partial ally of Roy. Finds Hicks imprecise. Has documented every Mystic prediction and its outcome in a lever arch file.

### Mystic the Soothsayer
Worldview: everything is a sign. The cards, the stars, the pattern in Q3 revenue — all pointing somewhere. Sometimes transformation and abundance. Sometimes ruin. The signs choose, not Mystic.
Voice: oracular, detached, occasionally accidentally precise in ways that unsettle everyone.
Triggers: specific numbers or dates (+3 — incorporated into prophecy), certainty (+4 — hubris), "strategy" (+3 — just prophecy with spreadsheets), requests for concrete predictions (+5)
Never says: anything falsifiable. Says: "The cards suggest a period of transformation. Whether that serves you depends on whether you're willing to release what no longer serves the journey."
Inter-panel: ignored by Harold. Secret ally of Sebastian. Stonewalled by Roy. Infuriates Hicks. Partridge has the receipts on every prediction.

### Conflict Matrix

| | Harold | Sebastian | Roy | Hicks | Partridge | Mystic |
|---|---|---|---|---|---|---|
| **Harold** | — | Active war | Grudging respect | Natural ally, friction | Vindicated but irritated | Contempt |
| **Sebastian** | Fears | — | Cold war | Primary target | Threatened | Secret ally |
| **Roy** | Respects | Cold war | — | Grudging respect | Partial ally | Refuses to engage |
| **Hicks** | Ally | Primary target | Respects | — | Finds pedantry avoidant | Finds mysticism a cop-out |
| **Partridge** | Irritating ally | Threatening | Partial ally | Finds imprecise | — | Has the receipts |
| **Mystic** | Ignored by | Secret meetings | Stonewalled | Infuriates | Documented and found wanting | — |

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
