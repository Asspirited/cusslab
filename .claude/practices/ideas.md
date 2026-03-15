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
