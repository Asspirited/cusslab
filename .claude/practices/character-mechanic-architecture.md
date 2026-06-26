# Character Mechanic Architecture
# Established: 2026-06-26 | Source: Rod (design session — Cox napkin pattern)

## The Principle

Character mechanics are **single-responsibility, bounded functions in a shared ecosystem.**

Each named mechanic:
- Has one job (the napkin produces an equation; the prior-art pivot redirects to something better; the Comparative Diminishment situates the sport at the right scale)
- Has a clear trigger condition
- Has a defined pool (rotate — never repeat)
- Has a defined return (Cox always returns to "But yes. The question.")
- Is independently testable (does it fire at the right moment? does the pool rotate? does it return?)
- Is reusable across panels (Cox's napkin fires in Quiz AND Survival School AND Comedy Room — same mechanic, different context)

The character file is the **interface contract.** The mechanics are the **implementation.** Panel supplements are **context-specific adapters.**

---

## The Shared Ecosystem

The character bank at `/home/rodent/cusslab/characters/` is the canonical source.

All apps (Cusslab, Survival School, future apps) reference the same character definitions. When a mechanic changes in the canonical file, it changes everywhere. No drift, no divergence, no two apps running different versions of the same person.

This is what the 2026-06-26 merge session established: Cox's napkin is one function. It runs in the quiz. It runs in survival school. It runs in the comedy room. The napkin doesn't know which panel it's in. It just produces the equation.

---

## The Architecture Pattern — Applied to All New Mechanics

When designing any new mechanic for any character, apply this checklist:

**1. Single responsibility**
What is the one thing this mechanic does? Name it in a noun phrase: "The Napkin." "The Prior Art Pivot." "The Comparative Diminishment Protocol." "The Preston Ceiling." "The Perpendicular Response." If it takes more than one clause to name it, it's doing two things.

**2. Bounded trigger**
When does it fire? Be specific. "When Cox has maximum investment in the wrong answer." "When Amstell goes one step further than intended in rounds 3+." "When Faldo's Sandwich Gate wound is activated." A mechanic with no trigger condition is ambient noise. Ambient noise is not a mechanic.

**3. Rotatable pool**
The mechanic's content lives in a pool. Rotate — never repeat within a session. This is the anti-repetition principle applied to mechanics, not just filler phrases. A pool of one is a tic. A pool of four is a mechanic.

**4. Defined return**
Where does the character go after the mechanic fires? Cox returns to "But yes. The question." Amstell moves to next question without acknowledging. Ayoade delivers patient disappointment then: "Next." Every mechanic must land somewhere. A mechanic without a return is a derail.

**5. Panel-portable**
Can this mechanic fire in more than one panel context? If yes: write it once in the canonical character file, add panel-specific adapter notes in the relevant supplements. Never copy-paste a mechanic into two places. The bank is the source.

**6. Independently testable**
Can you read the mechanic definition and say "yes, that fired correctly" or "no, that didn't fire" without reference to anything else? If the answer requires knowing what happened in the previous three turns: the boundary is wrong. Make it tighter.

---

## SOLID — Applied to Character Mechanics

**S — Single Responsibility**
Each mechanic has one job. The napkin shows equations. The prior-art pivot redirects. The comparative diminishment scales. Not "the napkin and the pivot" as one mechanic. Two mechanics.

**O — Open/Closed**
Character files are open for extension (new panels, new pool entries, new supplemental mechanics) and closed for modification of core identity. You can add Cox to the Quiz panel without changing his wound, his escalation arc, or his D:Ream file. The core is stable. The adapters extend it.

**L — Liskov Substitution**
Any character appearing in a panel fulfils the expected character contract: wound, mask, escalation shape, pool rotation, return. A character who doesn't return (no defined return from ceiling) breaks the contract. Every character must be substitutable for every other character in the panel slot without the panel engine needing to know which one it got.

**I — Interface Segregation**
The character file defines the full 17-attribute interface. A panel doesn't need all 17. The quiz only needs: voice, comic mechanism, pool, wound (for the host to exploit), and panel-specific mechanic. Don't inject the whole character into a narrow context. Use the supplement as the narrow interface.

**D — Dependency Inversion**
The panel engine depends on the character contract (the interface), not on a specific character. The quiz engine asks for "a team member" — it doesn't care if it gets Cox or Keegan. Cox's napkin and Keegan's desire are different implementations of the same team-member slot. The engine runs the same way. The comedy is different because the implementations are different.

---

## What This Means for Future Development

- **New character:** write once in `/home/rodent/cusslab/characters/`, with named mechanics following the checklist above. Any app that wants the character gets the canonical version.
- **New panel:** add a supplement section to the relevant character files. The supplement is the adapter. It does not duplicate the core.
- **New mechanic for an existing character:** add to the canonical file. Name it. Give it a trigger, a pool, and a return. It is immediately available in every panel the character appears in.
- **Cross-app use:** the Survival School already references Bear, Attenborough, Faldo, Cox, Bruce Lee. When those characters update in Cusslab canonical files, the Survival School version updates (via the supplement). One source. No drift.

---

## Canonical Examples

| Mechanic | Character | Trigger | Pool | Return |
|---|---|---|---|---|
| The Napkin | Cox | Maximum investment in wrong answer | 3 variants: Show / Pre-Prepared / Committed Error | "The napkin stands" → continues |
| The Prior Art Pivot | Cox | Question touches something he talked about (always) | 5 pool items (venue + topic + partial relevance) | Returns with wrong answer |
| Comparative Diminishment | Cox | Any sport discussed in Quiz | Biological / Cosmic / Evolutionary (3 pools) | "But yes. The question." |
| The Preston Ceiling | Amstell | Rounds 3+, once per session | Single (fires once, locks) | Immediate pivot, no acknowledgement |
| The Perpendicular Response | Ayoade | Every contestant answer | Non-finite (always their words, different angle) | Patient disappointment or factual aside |
| The Factual Aside | Ayoade | Maximum team chaos | 4+ pool items | Move on without explanation |
| Filler Demolition | Souness | Any filler phrase in any turn | 11-item filler pool + 6 contempt qualifiers | "No, really — what do you mean by that?" |
| Survival Alternative | Grylls | Any physical cowardice / injury | 8-item pool, escalating extremity | "Which in the long run is the better option." |
| Nature Narration | Attenborough | Any football event | 6+ narration pool + cosmic scale pool | Silence, then next narration |
| The Be Water Analysis | Bruce Lee | Any fixed-form error | Principle → application → return | "Or don't. But the water moves." |

---

## File Location

This document: `/home/rodent/cusslab/.claude/practices/character-mechanic-architecture.md`
Character bank: `/home/rodent/cusslab/characters/`
Domain model (schema): `/home/rodent/cusslab/.claude/practices/domain-model.md`
