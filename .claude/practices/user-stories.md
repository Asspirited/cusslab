# User Stories — Reference Guide
# When to read: at RAISE NEW WORK, at FEATURE SEQUENCE step 1, whenever decomposing an epic
# Last updated: 2026-03-10

## Sources
- Cohn — User Stories Applied (2004)
- Wake — INVEST model (XP123, 2003)
- Jeffries — Three C's (Card, Conversation, Confirmation)
- Adzic & Evans — Fifty Quick Ideas to Improve Your User Stories (2014)

---

## The core problem this solves

Work that isn't shaped correctly costs double: once when you do it wrong, once when you fix it.
An item on the backlog that is too big, too vague, or too technically-framed delays feedback,
hides unknowns, and makes CD3 scoring unreliable. The practices below stop that at source —
at the moment of raising the work, not at the moment of implementing it.

---

## The Three C's — Jeffries

Every story is three things working together, not one thing written on a card.

**Card** — the minimal written placeholder. Small enough to fit on a 3×5 index card.
If it doesn't fit on the card, the scope is too large. The card is not the specification.
It is a memory-jogger for a conversation that has to happen.

**Conversation** — where the actual information lives. Not in documents. In dialogue.
The team, the product owner, and the user (if accessible) discuss what's needed,
what the edge cases are, what "done" looks like. This is the Three Amigos moment.

**Confirmation** — concrete, testable examples that verify the conversation produced
shared understanding. Acceptance criteria. Gherkin. Not abstract — specific examples.
These close the loop.

**The trap:** treating Card as specification and Conversation as optional.
Card is just a ticket to enter the conversation. Confirmation is what matters.

---

## INVEST — Bill Wake (applied by Cohn)

A diagnostic checklist. Run it on any BL item before assigning a number.
If it fails a criterion — fix it before it enters the backlog.

| Criterion | Question | Fail signal |
|---|---|---|
| **Independent** | Can this be built and shipped without another unfinished story blocking it? | Dependency chain longer than one known prerequisite |
| **Negotiable** | Is this a placeholder for conversation, not a fixed spec? | It reads like a requirements document |
| **Valuable** | Does the "so that" clause name a user or product outcome? | No "so that" — or "so that" describes a system state, not a user gain |
| **Estimable** | Is scope clear enough to score Dur? | Can't score Dur without more discovery |
| **Small** | Can it be completed in one session (one Gherkin → red → green → clean → push)? | It would take multiple sessions end-to-end |
| **Testable** | Can Gherkin describe the acceptance condition right now? | Too vague for a concrete scenario |

**If it fails Small → split it. See splitting patterns below.**
**If it fails Valuable → it's a task, not a story. Reframe or run Three Amigos first.**
**If it fails Estimable → it's a spike. Raise a spike story to reduce uncertainty, not a delivery story.**

Wake's caveat: "Estimable" is the weakest criterion. If you have to choose between
making a story estimable and making it genuinely valuable — choose valuable.

---

## Story template

> As a [type of user], I want [goal] so that [outcome].

The "so that" clause is non-optional. It names the value delivered.
Without it you have a task, not a story.

**For Cusslab**, the user is almost always Rod (as the product owner and primary user).
The outcome is usually: "I can experience [comedy mechanic] / [character moment] /
[game situation] that wasn't possible before."

**Technical stories** don't have a user. If you can't write the "so that" clause without
naming Rod as the user — it may be tech debt (WL entry) or a spike (discovery item),
not a feature.

---

## Story splitting patterns — Cohn's SPIDR

When a story is too big (fails Small), use one of these five patterns.
Don't split horizontally by technical layer. Each split must still deliver value end-to-end.

### S — Spike
Separate the discovery from the delivery.
If the work requires research to scope properly, raise a spike story first:
"Investigate [X] to determine [Y]" — output is knowledge, not working software.
Example: "Spike: determine whether IMD data can be fetched at postcode level" (BL-053)
→ delivers a decision. Then raise the implementation story.

### P — Paths
Split by user workflow paths through the feature.
Happy path → sad path → edge case path. Each as a separate story.
Example: "House Name Oracle — returns three names (happy path)" →
then: "House Name Oracle — handles invalid postcode" →
then: "House Name Oracle — handles no historical data found"

### I — Interface
Split by interface complexity. Simplest interaction first, enriched version later.
Example: "Oracle voice — plain text output" → then: "Oracle voice — formatted with character rationale"

### D — Data
Restrict data scope initially. Simple data first, full variance later.
Example: "Author Epilogue — Golf Adventure only" → then: "Author Epilogue — Football Moment"
→ then: "Author Epilogue — Darts, Cricket, Oracle"

### R — Rules
Core functionality first, business rules deferred to later stories.
Example: "Author Epilogue — one author, fixed (Hemingway)" →
then: "Author Epilogue — random author from pool" →
then: "Author Epilogue — sessionStorage shuffle, no repeats"

---

## Fifty Quick Ideas — key applied patterns

From Adzic & Evans. The ones most relevant to this project's workflow:

### Prioritise impacts, not features
Don't ask "which feature next?" Ask "which outcome do we most need to move?"
CD3 already does this (Cost of Delay). But the story must describe the outcome, not the mechanism.
Bad: "Add author picker dropdown." Good: "Rod can re-roll to a different author without reloading."

### Treat each story as a survivable experiment
The smallest slice that will teach you whether this is worth continuing.
Delivers early feedback before you've built the full thing.
This is why vertical slices (thin end-to-end) beat horizontal slices (all DB work, then all UI).
Example: "One author (Hemingway), hardcoded, no picker, no shuffle" ships
and tells you whether the comedy lands — before building the full 18-author pool.

### Split by examples, not by tasks
Each concrete example from the Three Amigos conversation is a candidate story.
If you have five different concrete examples — you may have five stories.
The examples are the grain of the split.

### Use story maps to see the big picture
Before decomposing an epic into individual stories, draw the user journey:
what does the user do, step by step, to get the value?
Each step in the journey is a potential story grouping.
Epic → Story Map → Individual Stories → CD3 ranking.

### Walking skeleton first
One thin slice through every layer (input → logic → output) that actually works.
Proves the architecture. Delivers minimal but real value.
Add flesh in subsequent iterations.
Example for BL-053 Oracle: "Postcode in → one hardcoded name out → displayed" is the skeleton.
Then: research integration, voice archetypes, character conversation, polish.

### Spike stories reduce estimation fog
If Dur can't be scored, it's not a delivery story — it's a discovery story.
Spike: time-boxed, delivers a decision or a prototype, not production code.
Score Dur=1 always (time-boxed). Then raise the real story with better Dur data.

---

## Epic decomposition — the right sequence

When an item is raised that is too large (fails Small):

1. **Name the outcome** the epic delivers (the "so that" clause for the whole thing)
2. **Draw the user journey** — what steps must happen for the user to get that outcome?
3. **Walking skeleton first** — what is the thinnest slice that delivers real value end-to-end?
4. **Apply SPIDR** — which splitting pattern fits the remaining work?
5. **Raise individual BL items** — one per slice, each INVEST-shaped, each session-sized
6. **Score CD3** on each decomposed item independently — not inherited from the epic
7. **Label with Epic** — keeps them visually grouped without blocking individual prioritisation

**The epic itself (e.g. BL-058)** becomes the design/discovery item.
Its children (BL-060 Author: Hemingway, BL-061 Author: McCarthy, etc.) are delivery items.
The epic is closed when the skeleton is delivered and children are raised.
It is NOT closed when all children are closed — that's just the last child closing.

---

## When to read this file

| Trigger | What to apply |
|---|---|
| RAISE NEW WORK SEQUENCE step 3b | INVEST check before writing BL entry |
| FEATURE SEQUENCE step 1 | Confirm story is INVEST-shaped; split if not |
| Epic decomposition | Epic decomposition sequence above |
| Three Amigos | Three C's — Card, Conversation, Confirmation |
| Dur scoring feels impossible | Raise a spike story instead |
| "So that" clause missing | Stop — reframe before raising |
