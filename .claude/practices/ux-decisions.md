# UX Decisions — Practices
# Heckler and Cox
# Last updated: 2026-02-28
# Principles: see .claude/principles/ux.md
# Reference: Don Norman — The Design of Everyday Things (2013)

---

## Design Decisions Log

Every significant UX decision is logged here with the principle that drove it.
This prevents revisiting settled decisions and surfaces the reasoning for new contributors.

| Date | Decision | Principle | Rationale |
|------|----------|-----------|-----------|
| 2026-02-27 | Remove API key input from UI entirely | Norman: Constraints | Users entering API keys is confusing, insecure, and breaks when credits run out. "Absolutely horrific." (Rod) |
| 2026-02-27 | Hide settings panel entirely | Krug: Don't make me think | No credentials to configure = nothing to show. Visible but unusable is worse than absent. |
| 2026-02-27 | Credit exhaustion message replaces silent failure | Norman: Feedback | Silent failure when credits run out gives users no recovery path. Clear message does. |
| 2026-02-28 | Irony bands named not numbered | Krug: Don't make me think | "Meatloaf Zone" is self-explanatory and on-brand. "Score: 2/3" requires mental translation. |
| 2026-02-28 | Profanity modes: Boardroom/Water Cooler/Unhinged | Jobs to Be Done | Maps directly to the three social contexts where the product is used. No translation required. |

---

## Open UX Decisions

### Should character state intensity be visible to users?
**Options:**
1. Hidden — panels feel more intense without the user being told why (more natural)
2. Visible — "Heckler intensity: 8/10" (more game-like, more explicit)
3. Partial — intensity shown only when it spikes above a threshold

**Principle to apply:** Norman's Feedback vs Krug's Don't Make Me Think
**Decision:** test both in real use. Default to hidden. Surface if user testing reveals confusion.

### What is the error message when credits are exhausted?
**Current (wrong):** "Out of API credits — add billing at console.anthropic.com"
**Problems:** exposes implementation detail, not our voice, user has no action to take
**Candidate:** "The panels need feeding. Back soon." — on brand, no jargon, sets expectation
**Decision:** pending — implement with Cloudflare Worker feature

### How does the user choose Debate vs Roast mode?
**Options:**
1. Explicit toggle — user selects before submitting
2. Inferred from context — product decides based on prompt type
3. Progressive — starts as Roast, user can shift to Debate

**Principle:** explicit choice sets expectations (Norman: Mapping)
**Decision:** explicit toggle. The choice itself tells the user what to expect.

---

## Personas (draft — validate against real users)

### The Corporate Survivor (primary)
Works in a large organisation. Surrounded by jargon daily.
Uses the product to vent, laugh, and occasionally steal a line for a presentation.
Needs: fast, funny, shareable output.
Fear: being caught using it in a meeting.
Job: "Help me feel sane when the meeting is unbearable."

### The Facilitator (secondary)
Runs workshops and retrospectives.
Uses the product to warm up a room or name a dynamic safely.
Needs: culturally calibrated output, adjustable profanity level.
Fear: offending someone in the room.
Job: "Give me a safe way to say the unsafe thing."

### The Language Nerd (tertiary)
Interested in how words work across cultures and contexts.
Uses Irony Authenticity and Profani-historian more than the core panels.
Needs: depth, accuracy, references.
Fear: being wrong about what irony actually means.
Job: "Show me something genuinely interesting about language."

---

## UX Review Checklist (before shipping any new feature)

- [ ] Does it serve a named job from the Jobs to Be Done?
- [ ] Does it have a clear affordance — does it look like what it does?
- [ ] Does every action produce immediate, observable feedback?
- [ ] Does it add a constraint that prevents a class of errors?
- [ ] Can a new user discover it in under 60 seconds without instruction?
- [ ] Is the error state handled with a message in our voice?
- [ ] Has the decision been logged in this file?
