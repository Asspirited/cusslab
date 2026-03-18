# Ideas Board — Heckler and Cox
# Raw concepts. Zero barrier to entry. Judge nothing at capture time.
# Last updated: 2026-03-10

---

## What lives here

An idea belongs here when it is interesting enough to record but not yet ready for the backlog.
It has not been through Three Amigos. It has not been INVEST-checked. It may not have a clear
"so that" clause. It may be Rod's intuition, something spotted in the code, a passing observation,
or a concept from a Claude.ai design session.

**Both Rod and Claude Code add ideas here.** Either can spot one. Neither should let it evaporate.

**The capture bar is zero.** If it feels interesting, it goes here. No CD3 required. No format required.
A single sentence is enough. The purpose is capture, not specification.

---

## What does NOT live here

- Anything that already has clear scope, a "so that" clause, and can be INVEST-checked → **backlog.md**
- Bugs, broken flows, quality gaps → **waste-log.md** (those are problems, not ideas)
- Notes from a design session that have been properly captured → **notes/YYYY-MM-DD-[topic].md**

---

## Promotion to backlog

An idea is ready to become a BL item when it can answer:
1. **Who gets the value?** (the user / Rod / product outcome)
2. **What changes for them?** ("so that…")
3. **Is it session-sized, or does it need decomposition first?**
4. **Has it been through Three Amigos** (even informally — agreed in conversation)?

If yes to all four: run RAISE NEW WORK SEQUENCE (session-insession.md).
If not yet: leave it here. It will ripen or be discarded at the next session start review.

---

## Session review

**At session start (step 4b):** scan this board. Ask: has any idea ripened?
  - If yes → promote to backlog (run RAISE NEW WORK SEQUENCE, assign BL-NNN, CD3 score)
  - If stale / dead → move to ARCHIVED below with a one-line reason

**In-session:** any new idea (from Rod or from Claude) → add to UNREVIEWED immediately.
  Do not interrupt current work. One line is enough. Return to what you were doing.

**At session close:** confirm any in-session ideas were captured. Nothing lost.

---

## Format

Minimal. One line to several lines. Date and source are the only mandatory fields.

```
### IDEA: [short name]
Added: YYYY-MM-DD | Source: Rod / Claude Code / Claude.ai design session
[One sentence to a paragraph. What's the concept? Why is it interesting?]
[Optional: related BL items, dependencies, open questions]
```

---

## UNREVIEWED — not yet discussed

### IDEA: Phil's-opoly — philosopher panel
Added: 2026-03-09 | Source: Claude.ai design session
Philosophers as guests in a cricket/general commentary format. 9 characters identified:
Diogenes, Socrates, Plato, Nietzsche, Wittgenstein, Russell, MacGowan, Skinner, Schrödinger.
Priority build order: Tufnell + Diogenes + MacGowan + Skinner.
Schrödinger also candidate for Science Convention alongside Feynman, Cox, Darwin.
Cross-panel note: DEAD_IN_PANEL_WORLD mechanic for MacGowan flagged (same as Waddell/Bristow).
Full notes: notes/2026-03-09-phils-opoly.md
Open question: what panel does this belong to? New panel or extension of existing?
Placement decision needed before any BL item can be raised.

### IDEA: House Name Oracle
Added: 2026-03-10 | Source: Claude.ai design session
Postcode research → comedy house name generator. Three characters: Phil Spencer (market value translator), Kirstie Allsopp (The Kirstie Reframe — finds aspirational angle in any grim reality), Dion Dublin (The Dublin Drift — four-stage digression ending in accidental boast). Oracle researches topography, history, deprivation index, spurious heritage, wrong attributions. Outputs three names per query (The Dignified / The Knowing / The Unhinged) each with one-line rationale. Comedy engine: gap between aspiration and reality. Non-agreement ending: Oracle overrides all three.
Open questions: standalone product or new cusslab section? Shared Worker + character framework feasible.
Needs Three Amigos + placement decision before any BL item can be raised.
Full design notes archived from: notes/2026-03-10-house-name-oracle.md

### IDEA: Snooker panel — add Alex Higgins, Bill Werbeniuk
Added: 2026-03-15 | Source: Rod
Add to The Crucible Corner: Bill Werbeniuk (FIRST — prescribed beer intake, billed to DHSS, DEAD_IN_PANEL_WORLD), Alex Higgins (Hurricane — two world titles, chaos, confrontation, DEAD_IN_PANEL_WORLD 2010). Steve Davis already in panel. Priority: Werbeniuk first, then Higgins.
Full snapshot: Downloads/idea-snooker-new-members-2026-03-15.md

### IDEA: Research write-up — Register collapse prevention in multi-agent LLM systems
Added: 2026-03-15 | Source: Claude Code review
The problem: sequential multi-agent LLM systems harmonise — agents read previous responses and conforming pressure flattens all voices to one cautious register. The solution built in BL-143/144/145: postureType per character (analytical/narrative/challenge), recentMoves[] tracking, REGISTER BREAK injection after 3 consecutive same-register turns. YOUR OWN ANGLE FIRST replaces mandatory reactivity. This is an empirical, working solution to a real and under-documented problem. Worth writing up as a pattern or short paper.
Open question: is there existing research on register collapse? Is this worth a blog post, a pattern document, or a formal write-up?

### IDEA: Research write-up — BDD for non-deterministic AI systems
Added: 2026-03-15 | Source: Claude Code review
The problem: Gherkin/BDD assumes deterministic systems. AI outputs are not deterministic. Solution used here: assert structural and contextual constraints (REGISTER BREAK instruction present, arcLog accumulated, character posture type matches) rather than content. 104 feature files of working examples. This is a genuine gap in the BDD literature — no documented practice exists for specifying non-deterministic AI behaviour in Gherkin. Worth writing up with concrete examples from this codebase.
Open question: write as blog post, pattern document, or conference paper?

### IDEA: Research write-up — Wound-based character simulation DSL
Added: 2026-03-15 | Source: Claude Code review
The wound system (specific historical embarrassments/failures that can be triggered by keywords) + comedy engine (the structural reason why the character is funny) + voice format constraints + relationship network = a prompt engineering DSL for consistent AI character behaviour. 91 character files all following the same schema. Could be written up as a reusable pattern for anyone building AI characters at scale: wound → trigger → escalation arc → panel-specific rules.
Open question: generalise as a prompt schema or keep codebase-specific? Could this be a small open source tool?

### IDEA: Research write-up — ConspireEngine: designed contradiction in multi-agent LLM
Added: 2026-03-15 | Source: Claude Code review
Most multi-agent LLM research targets consensus and agreement. ConspireEngine is the opposite: characters are explicitly designed to contradict, exaggerate, lie, and call each other out — and the product value is the gap between what they claim and what happened. This is designed unreliability as a product mechanic. Worth studying: what does it take to sustain productive contradiction in a multi-agent system? What prompt engineering makes disagreement feel authentic rather than chaotic?
Open question: is this worth a blog post, or is there enough here for a more formal paper on adversarial multi-agent comedy systems?

### IDEA: Nostradamus as Author Epilogue voice
Added: 2026-03-10 | Source: Rod
The comedy IS the quatrain format applied to golf — which is why it's here and not in backlog.
Nostradamus writes in four-line prophecies, not prose. The epilogue mechanic currently specifies
250-400 word prose. Nostradamus breaks that in a way that might be funnier but needs a
design decision: (a) author pool allows author-specific output formats; (b) Nostradamus outputs
4–6 quatrains with a straight-faced "interpretation" appended; (c) he goes on the ideas board
until pool mechanics (BL-061) are proven and we revisit the format question.
Open question: is this a special-format author, or a different mechanic entirely?
Needs Three Amigos before BL item can be raised.

---

## REVIEWED — discussed, not yet promoted

*(empty)*

---

## ARCHIVED — considered and parked

*(empty — items moved here with a one-line reason when they won't be pursued)*

### IDEA: TBT — Pub scenes (pint, pie, darts)
Added: 2026-03-17 | Source: Rod
Recurring pub scenes as distinct scene type. The Likely Lads dynamic. Darts as FORTUNE spend mechanic. The pub that changes as career advances (local → hotel bar → sponsors' hospitality → back to local at career end). Full snapshot: Downloads/idea-tbt-pub-scenes-2026-03-17.md

### IDEA: TBT — Cultural texture library
Added: 2026-03-17 | Source: Rod + Claude Code
Milk float, full English, Test Card F, Milkybar Kid, Minder, The Professionals, Only Fools, sheepskin coats, Bullseye, Ceefax, Blue Peter, Subbuteo, Chopper bike. Period-accurate working class Britain. Full snapshot: Downloads/idea-tbt-cultural-texture-2026-03-17.md

### IDEA: TBT — Transport choices (getting to the game)
Added: 2026-03-17 | Source: Rod
Bus/bike/run/walk/cadge a lift. 20p bus fare is 10% of everything early game. Cycling in rain = late + cold. Full snapshot: Downloads/idea-tbt-transport-choices-2026-03-17.md
