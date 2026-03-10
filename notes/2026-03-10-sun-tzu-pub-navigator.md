# Sun Tzu Pub Navigator — Design Session Notes
## 2026-03-10 (captured from Claude.ai design session)

---

## The Feature

Fighting Fantasy pub navigation game with an advisor quartet responding to situations.
Two delivery modes agreed. Build Mode A first (spike to validate voice).

---

## Mode A — Advisory Panel (spike first)

- User presented with pub situation from fixed menu (5 scenarios)
- Sun Tzu responds with: principle → application → warning
- Validates Sun Tzu voice before anything else
- No hardmen panel yet — that's a second hypothesis (BL-105)
- Spike: does the voice work? Is it funny?

---

## Mode B — Fighting Fantasy Pub Navigator

- Full FF scenario engine: scene state, choice trees, pressure accumulation, escalation
- Eight specific pub scenes (see Scene Library below)
- Advisor quartet responds to situations
- **Architectural prerequisite:** extract shared FF engine from Quntum Leeks + Golf Adventure FIRST (BL-109)
- All three games share the engine after extraction

---

## The Advisor Quartet

| Character | File | Role |
|-----------|------|------|
| Sun Tzu | `characters/sun-tzu.md` | Strategic — what to do |
| Nostradamus | `characters/nostradamus.md` | Prophetic — useless hindsight |
| Chuck Norris | `characters/chuck-norris.md` | Physical — calibrated for wrong person |
| Buddha | `characters/buddha.md` | Meta — sees beneath the question |
| Bruce Lee | NOT YET WRITTEN | Modern Sun Tzu — fifth candidate, needs spec (BL-108) |

Bruce Lee may make it five advisors or replace one. Spec first.

---

## Hardmen Reaction Panel (separate — post-Mode A validation)

- Roy Keane (`characters/roy-keane.md`)
- Vinny Jones (`characters/vinny-jones.md`)
- Nostradamus also doubles here
- BL-105: second hypothesis, only build after Mode A validates the format

---

## Mode B Scene Library — Eight Pubs

All eight ratified. Full environment spec needed per location (Gherkin before implementation).

| # | Venue | Location | Primary comedy mechanic |
|---|-------|----------|------------------------|
| 1 | The Rising Sun, Chapel Hill | Basingstoke | Known terrain / personal history layer |
| 2 | The Scotia Bar, Stockwell St (est. 1792) | Glasgow | Actually haunted — competes with Nostradamus |
| 3 | The Horseshoe Bar, Drury St (est. 1884) | Glasgow | Longest bar in Britain, multi-front ops |
| 4 | The Drunken Duck, Barngates | Lake District | Everyone already happy — Buddha at a loss |
| 5 | Slug & Lettuce / Henry Addington | Canary Wharf | Prawn sandwich culture — Roy Keane furious |
| 6 | Dave's Bar (generic English pub) | Marbella | World Cup semi-final, full advisor chaos |
| 7 | McSorley's Old Ale House (est. 1854) | New York | Light or dark only — suffering solved 1854 |
| 8 | Hofbräu Tent, Oktoberfest | Munich | Everything breaks at scale |

---

## Lederhosen State

Persistent cross-scene item flag. Canonical origin: Oktoberfest scene.

- Triggers at pressure threshold (been there long enough, enough Maß consumed)
- Player discovers it the way you would in real life — gradually, then all at once
- Cross-scene persistence: arriving at McSorley's in lederhosen is a different game
- McSorley's barman response: three-second stare. "Light or dark." No other comment.

**Advisor reactions to lederhosen discovery:**
- Sun Tzu: noted it two hours ago, already incorporated, moved on
- Nostradamus: has a quatrain. Called it. Very pleased.
- Chuck Norris: also wearing lederhosen, doesn't see the issue
- Buddha: "where were you when the lederhosen went on?" — most spiritually advanced question of the evening
- Roy Keane: not wearing lederhosen, never will, you weren't paying attention, that's how it happens
- Vinny Jones: helped you put them on, remembers exactly when, not telling

---

## BL Items Raised

- BL-104: Sun Tzu Pub Navigator — Mode A spike
- BL-105: Hardmen reaction panel (post-Mode A)
- BL-106: Sun Tzu general advisory mode (post-pub validation)
- BL-107: Nostradamus character spec / juxtaposition mechanic
- BL-108: Bruce Lee character spec (fifth advisor candidate)
- BL-109: FF shared engine extraction (prerequisite for Mode B)
- BL-110: Mode B scene library (Gherkin spec per location, 8 scenes)
- BL-111: Lederhosen state — persistent flag mechanic, cross-scene item system

---

## Status

Design complete. Character files written in Claude.ai session — pending commit.
Files: characters/sun-tzu.md, characters/nostradamus.md, characters/chuck-norris.md,
characters/buddha.md, characters/roy-keane.md, characters/vinny-jones.md
