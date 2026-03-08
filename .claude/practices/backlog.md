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

### BL-009 — Mode 2 game examples expansion (all sports panels)
- Football, Golf, LongRoom mode 2 (ingame) currently have basic moment types
- Need: more named moment examples in the selector (more variety, more specific)
- Football: add more granular moments (manager touchline reaction, injury substitution, captain decision, controversial tackle, post-goal celebration incident)
- Golf: add (flag stick controversy, slow play warning, embedded ball ruling, eagle putt, 18th green ceremony)
- LongRoom: add (DRS review, lunch interval, century milestone, caught behind appeal, last wicket partnership)
- Darts: already richest (9-darter protocol, crowd escalation, era engine) — no immediate need
- Status: OPEN — design direction confirmed, implementation not started

### BL-010 — Football mode 1 RelationshipState + CharacterState + WoundDetector
- Football discuss() still missing these vs Golf/Darts/LongRoom (all have them)
- Needs: FOOTBALL_WOUNDS map, FOOTBALL_NAMEMAP, FOOTBALL_VOICE_FMT
- Then: wire RelationshipState.init, CharacterState.create, WoundDetector into the loop
- Characters: Souness, Neville, Carragher, Micah, Ron, Cox — inter-character wounds defined in docs/characters-sports.md
- Status: OPEN — gap identified in session 2026-03-08

### BL-011 — Anchor readback + user name for Football, Darts, LongRoom
- Golf has: user name input (required), Murray/Dougherty anchor reads question back
- Other sports panels have neither
- Football anchor candidate: Gary Lineker reads the question (Match of the Day cadence)
- Darts anchor candidate: Waddell narrates the question in heroic couplets
- LongRoom anchor candidate: Blofeld introduces it as if it arrived by pigeon
- Status: OPEN — Golf pattern exists as reference, needs adapting per panel

### BL-012 — ConspireEngine for Football
- Golf has ConspireEngine (Roe/Coltart pair profile)
- Football has no ConspireEngine — Souness/Neville, Carragher/Cox, Ron/anyone are obvious pair candidates
- Needs: pair profiles defined in needles-and-conflicts.md, then wired in
- Status: OPEN

### BL-013 — golf-adventure.html in pipeline
- golf-adventure.html is entirely outside the pipeline (no Gherkin, no unit tests, no audit)
- Minimum viable: add browser-sim check for state machine init (G.tournament, G.player, G.matchPlayScore)
- Also: match play score calculation is logic — extract to src/ and unit-test
- Status: OPEN

### BL-014 — Match play leaderboard for Ryder Cup end-of-day
- buildLeaderboard() currently shows stroke play table for Ryder Cup — wrong format
- Should show: Europe vs USA match play points, individual match results (1UP, 2DN, halved)
- Blocked on defining per-match outcomes for field (Molinari, McIlroy, Westwood, Donald)
- Status: OPEN — HUD and buildSituation fixed in session 2026-03-08; leaderboard still pending

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
