# Cusslab — Persistent Backlog

Items here survive session resets. Each entry has a status and enough context to pick up without re-research.

---

## CONTENT

### BL-001 — Wayne Riley / Radar content merge
- Claude.ai session has full Wayne Riley/Radar explanation not yet in repo
- Target file: `docs/characters-sports.md`
- Also: additional extended pools and needle definitions from same session
- Rule: merge, do not append or duplicate
- Status: OPEN

### BL-002 — Food pool expansion (all characters)
- Faldo keeps using Ginsters on A1 as his default — pool too small / same references repeating
- Design: three orthogonal axes that combine to generate a food moment:
  1. **Food type** — relevant to the character and conversation context (rotates per character)
  2. **Location** — where they had it: normal (home kitchen), mundane (petrol station), exotic (Augusta clubhouse), weird (airport vending machine), wtf (motorway hard shoulder in rain)
  3. **Context/reason/person** — what was happening, who was there, why it matters to the character
- Applies to ALL characters, not just Faldo
- Current food pools live in index.html (search `FoodWeather`, `hypoPool`, character prompt sections)
- Status: OPEN — design confirmed, implementation not started

### BL-003 — Hypochondria pool expansion (all characters)
- Same structure as BL-002 but for the HYPOCHONDRIA_POOL mechanic
- Pool types: real ailments exaggerated, completely fictional ailments, ailments borrowed from others, ailments that are suspiciously sport-specific
- Each character has their own flavour (Radar's ailments are Australian and dramatic; Faldo's are biomechanical; Dougherty's are warmly understated)
- Status: OPEN — design direction confirmed, pool content not written

---

## ARCHITECTURE / DOMAIN

### BL-004 — FOOD_WEATHER and HYPOCHONDRIA_POOL confirmed separate
- Do NOT merge. They are different mechanics:
  - FOOD_WEATHER: probabilistic, external, reactive to conversation
  - HYPOCHONDRIA_POOL: accumulative, internal, builds across session
  - The collision between them IS the mechanic — merging loses it
- Status: CLOSED (decision made, logged to prevent future revisiting)

### BL-005 — Character attribute count is fine at ~20
- Twenty attributes per character is not over-engineered
- Natural DDD clusters: static config (wound, mask, register) / weights (premonition_affinity, bathos_affinity) / behavioural (ice_breaker_style)
- No rationalisation needed
- Status: CLOSED (decision made)

---

## PIPELINE / TESTING

### BL-006 — pipeline @claude skip count target
- 394 scenarios currently @claude-tagged (manual / behavioural)
- Goal: reduce over time by writing step defs for well-defined scenarios
- First candidates: watching-oche-mode1 suggestion card shuffle (deterministic), panel-slots cross-panel invariants
- Status: OPEN — ongoing

---

## RIA PROJECT (separate repo)

### BL-007 — Claude Code Windows install bugs (follow-up)
- "Class not registered" error blocks git.exe file picker and hidden file access
- CLAUDE_CODE_GIT_BASH_PATH env var ignored on restart
- Actions: check anthropics/claude-code GitHub issues, check Anthropic Discord, file own issue if not raised
- Status: OPEN

### BL-008 — ACC framework label fix in RIA
- ACC = Attributes, Components, Capabilities (James Whittaker / Google) — NOT "Assumptions, Constraints, Concerns"
- Wrong label still in RIA UI — needs correcting
- Status: OPEN
