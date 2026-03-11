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

## 2026-03-09 — Tournament chooser section headers

**Decision:** Category headers (MAJORS / RYDER CUP / SPECIAL GAMES) use `.tc-category-hdr` — 32px Bebas Neue, accent underline, 32px top margin. Decade sub-headers use `.tc-decade-hdr` — 16px, no text-transform, flex row with arrow pinned right. Entry counts removed from decade headers.

**Rationale:** Old 11px `.tc-section-header` was unreadable and "MAJORS" label was absent entirely. Section labels need to be dominant landmarks, not muted annotations.

## 2026-03-09 — Era CSS naming convention

**Decision:** Era classes named `era-YYYY` by year. Where two tournaments share a year but different broadcasters, use `era-YYYY-suffix` (e.g. `era-2006` = K Club Sky, `era-2006-us` = Winged Foot NBC). Do not reuse era classes across fundamentally different aesthetic contexts.

**Rationale:** era-2005 (Augusta CBS) already existed and is appropriate for the 2005 Masters. era-2006-us is distinct (NBC greens/gold vs Sky blue). Suffix pattern avoids class name collisions without year duplication.

## 2026-03-10 — Comedy Room mode tabs (Into The Room / The House Name Oracle)

**Decision:** Comedy Room uses the same two-tab mode switcher pattern as Football, Golf, Darts, Cricket. Tab IDs: `cr-tab-standard` / `cr-tab-oracle`. View wrappers: `cr-standard-view` / `cr-oracle-view`. Active tab highlighted with `border-color:var(--accent);color:var(--accent)`. `ComedyRoom.switchMode(mode)` is the single entry point — mirrors `Football.switchMode`.

**Rationale:** Consistency with every other multi-mode panel. `switchMode` pattern is the gold standard — no reason to invent an alternative.

## 2026-03-10 — Quote attribution strategy

**Decision:** "— Heckler, on X" and "— Heckler" attribution removed entirely from slogan pools. Room-voice lines stay anonymous — the room has a voice; it does not need a byline. Panel character descriptions have the character name baked into the quote body ("Hicks. You'll want to agree with everything he says..."). Character-voiced quotes keep attribution to the character + uncertainty caveat. Pool interleaved so attributed and anonymous quotes alternate.

**Rationale:** "Heckler on X" read as a brand congratulating itself. If a line is strong enough it doesn't need a name attached. If it isn't strong enough, attribution won't save it.

## 2026-03-10 — Ryder Cup day-end screen layout: outcome before commentary

**Decision:** On the Ryder Cup day-end screen, the match score leaderboard (`de-leaderboard`) appears BEFORE the commentary panel (`panel-discussion`). Previously the leaderboard was after `day-end-wrap`, placing commentary above scores in the DOM flow. The new order inside `day-end-wrap` is: (1) day-end-header, (2) de-leaderboard, (3) panel-discussion.

**Rationale:** Leaderboard renders synchronously; commentary loads asynchronously. User saw an empty commentary area first, then scores below — unintuitive. Outcome (scores) should be the first thing the user reads; commentary is supplementary colour. The "job to be done" at session end is "what happened in the match" not "what did the panel say."

## 2026-03-10 — Ryder Cup overall score prominence

**Decision:** `buildRyderEndOfSessionLeaderboard()` and `buildRyderRestLeaderboard()` show `G.teamScore.EUR`/`G.teamScore.USA` (cumulative running total) as the primary large display in `ryd-totals`, labelled "Overall Match Score". Session-only points appear as a secondary small line below (`ryd-session-pts`). Previously only session points were shown at that size; running total was buried in 11px muted `de-sub` text.

**Rationale:** Users read the largest number as the score. Session-only points in large type caused "3-2 after 3 days" confusion (WL-113). Overall score is the meaningful number; session breakdown is context.
