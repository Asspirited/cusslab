# Architecture Review — Practices
# Heckler and Cox
# Last updated: 2026-03-08
# Applies to: any extraction, refactor, or new module design
#
# References:
#   Robert C. Martin — Clean Code (2008), Clean Architecture (2017), APPP (2002)
#   Kent Beck — Test Driven Development: By Example (2002), XP Explained (2004)
#   Michael Feathers — Working Effectively with Legacy Code (2004)
#   Martin Fowler — Refactoring: Improving the Design of Existing Code (1999/2018)
#   Steve Freeman & Nat Pryce — Growing Object-Oriented Software, Guided by Tests (2009)
#   Sam Newman — Building Microservices (2015/2021)
#   Gojko Adzic, David Evans, Tom Roden — Fifty Quick Ideas to Improve Your Tests (2015)
#   Dan North — Introducing BDD (2006)
#   Don Norman — The Design of Everyday Things (2013)
#   Steve Krug — Don't Make Me Think (2014)
#   Donella Meadows — Thinking in Systems (2008)
#   Eric Evans — Domain-Driven Design (2003)
#   Vaughn Vernon — Implementing DDD (2013)

---

## The Authorities — What Each One Gives You

### Robert C. Martin — Clean Architecture + SOLID
The dependency rule: source code dependencies must point inward only.
Outer layers (UI, frameworks, APIs) depend on inner layers (use cases, entities).
Inner layers know nothing about outer layers. Ever.

```
Entities (business rules — no dependencies)
  ↑
Use Cases / Interactors (application rules — depend only on entities)
  ↑
Interface Adapters (controllers, gateways — translate between layers)
  ↑
Frameworks & Drivers (DOM, APIs, HTTP — the outermost ring)
```

Apply SOLID at every layer:
- **SRP**: one reason to change. If you can't describe it without "and", split it.
- **OCP**: extend via new objects, not by modifying existing ones. New tournament = new data entry, not a switch statement.
- **LSP**: any implementation satisfies the interface. If you need to special-case an object, your interface is wrong.
- **ISP**: expose only what the caller needs. GameEngine does not need to know about rendering. Renderer does not need to know about dice.
- **DIP**: depend on abstractions. GameEngine depends on `IAPIClient`, not on `fetch()`. UI depends on `IGameEngine`, not on `G`.

### Kent Beck — TDD + Simple Design
**The four rules of simple design (priority order):**
1. Passes the tests
2. Reveals intention
3. No duplication
4. Fewest elements

**The TDD rhythm:**
Red → Green → Refactor. Never skip the refactor. Never skip the red.

**The test writes the interface.**
Don't design the interface then write tests to fit it. Write the test you wish existed, then write the code that makes it pass. The test tells you what the interface should be.

**Fake it till you make it, then triangulate:**
Return a hardcoded value. Make the test pass. Add a second test that forces you to generalise. Generalise. That's the minimum implementation.

**Tests as living documentation:**
A failing test is a precise, executable description of missing behaviour.
If the test name doesn't tell you what the system does, rename it.

### Michael Feathers — Working Effectively with Legacy Code
**Definition of legacy code:** code without tests.
By this definition, anything in a file with no test suite is legacy code.

**The seam:**
A seam is a place where you can alter behaviour without editing in that place.
Seams are extraction points. Find them before you touch anything.

**The characterisation test:**
Before refactoring, write tests that describe what the code currently does — even if what it does is wrong. These tests protect you from breaking existing behaviour during extraction.
```js
// Characterisation test — not testing correctness, testing current behaviour
it('computeHoleScore returns current value for par 4 birdie', () => {
  expect(computeHoleScore({ par: 4, strokes: 3 })).toBe(-1); // locks in current output
});
```

**Sprout method/class:**
Don't modify untested code. Add new, tested code alongside it.
Call the new code from the old code. The old code becomes a thin shell.
When all callers use the new code, delete the old code.

**The dependency break techniques:**
- Extract and Override — subclass and override the dependency for testing
- Parameterise Constructor — pass dependencies in rather than creating them
- Replace Global Reference — wrap globals in an injectable abstraction

### Martin Fowler — Refactoring
**The refactoring contract:**
Refactoring changes the internal structure without changing external behaviour.
Tests must be green before and after every refactoring move. No exceptions.

**Key mechanics for extraction:**
1. Extract Method — identify a block with a clear purpose, give it a name
2. Extract Class — find a cluster of methods/data that belong together
3. Move Method — method is used more by another class than its own
4. Introduce Parameter Object — multiple parameters always travel together → make them an object
5. Replace Temp with Query — computed values become functions
6. Separate Query from Modifier — a function that returns a value must not change state

**The smell that triggers extraction:**
Long method, large class, divergent change (one class changes for many reasons), shotgun surgery (one change requires many class edits), feature envy (a method uses another class's data more than its own).

### Steve Freeman & Nat Pryce — Growing Object-Oriented Software
**Outside-in TDD:**
Start with an acceptance test at the boundary of the system.
Write failing unit tests that drive the design of the objects needed to satisfy it.
The acceptance test stays red until all unit tests are green.

**Tell, don't ask:**
Objects should tell other objects what to do, not ask for data to process themselves.
```js
// Ask (bad) — GameController queries state and decides
if (engine.getComposure() < 3) ui.showCriticalWarning();

// Tell (good) — engine notifies, controller reacts
engine.on('composureWarning', () => ui.showCriticalWarning());
```

**Mock roles, not objects:**
Mock the interface (the role an object plays), not the concrete class.
This keeps tests independent of implementation.

### Sam Newman — Building Microservices
**Even if you're not running microservices**, the thinking applies to module boundaries:
- Services own their data. No shared mutable state across boundaries.
- Communicate via contracts, not shared objects.
- Each service should be deployable/testable independently.
- The boundary is worth the cost only if the two sides change at different rates.

**Applied to a single-file extraction:**
The boundary between GameEngine and CommentaryService has value because:
- GameEngine changes for game rule reasons
- CommentaryService changes for API/prompt reasons
These are different rates, different teams (even if it's one person), different risk profiles.

### Consumer-Driven Contract Testing (Pact pattern)
The consumer (caller) defines the contract.
The provider (callee) verifies it can satisfy the contract.
Neither side needs to run the other to test the integration.

```js
// Consumer (GameEngine) defines what it needs from CommentaryService:
const contract = {
  given: { shot: 'driver', outcome: 'miracle', hole: { name: '17th' } },
  expected: { text: expect.any(String), character: expect.stringMatching(/^[A-Z_]+$/) }
};

// Provider (CommentaryService) verifies against the contract without GameEngine running.
```

This is how you test the seam between GameEngine and CommentaryService
without making real API calls and without running the full game.

---

## The Testing Pyramid — Applied

```
                 [ Playwright / end-to-end ]         — few, slow, expensive
             [ Contract tests at API boundaries ]    — moderate, no real API calls
         [ Integration: engine + data together ]     — moderate, no DOM
     [ Unit: pure functions, no DOM, no API ]        — many, fast, cheap
```

Most value at the bottom. Don't invert the pyramid.

**For Golf Adventure specifically:**
- Unit (Level 1): GameEngine functions — `startGame`, `playShot`, `resolveOutcome`, `endHole`
- Unit (Level 1): Data shape validation — every TOURNAMENT has players, holes, lore
- Contract (Level 2): GameEngine ↔ CommentaryService boundary
- Integration (Level 3): Engine + EventSelector together, no DOM
- Component (Level 4): SetupController with JSDOM, no real engine
- E2E: one happy path through full game (deferred)

---

## The Extraction Order — Risk-Ordered

### Step 1 — Data (lowest risk)
Extract `CHARACTERS`, `TOURNAMENTS`, `EVENTS`, `SHOTS` to `golf-data/` files.
No logic, no DOM, no API. Pure data.
Tests: shape validation — every object has required fields, correct types.
golf-adventure.html: add `<script src>` tags, remove inline data.
Behaviour: identical. Risk: near zero.

### Step 2 — Game Engine
Extract `G` state factory, `startGame`, `playShot`, `resolveOutcome`, `endHole`, `simulateField`.
Pure functions / plain objects. No DOM. No API calls.
Tests: unit tests written first (TDD). State factory pattern for test setup.
golf-adventure.html: calls `GameEngine.*` instead of directly mutating G.
Dependency inversion: engine receives data as parameters, does not import globals.

### Step 3 — Commentary Service
Extract API interaction to `CommentaryService.js`.
Implements an `IAPIClient` interface. Can be swapped for a stub in tests.
Tests: contract tests with a stub API client. No real Anthropic calls.
Anti-corruption: translates game domain → API domain → game domain.

### Step 4 — UI Controllers
Extract `SetupController.js` and `GameController.js`.
These are the only layer that touches the DOM.
Tests: Jest + JSDOM, fresh instance per test.
golf-adventure.html: becomes an orchestration shell — wires controllers to engine.

---

## The Interface Design Rule (Beck)
**The test writes the interface.**

Before writing any module, write the test you wish existed:
```js
// This test tells you exactly what GameEngine needs to look like
const session = GameEngine.start({
  tournament: TOURNAMENTS[0],
  player: TOURNAMENTS[0].players[0],
  panel: ['faldo', 'mcginley'],
  atmosphere: 'NORMAL'
});
expect(session.day).toBe(1);
expect(session.holeIdx).toBe(0);
expect(session.composure).toBe(10);
expect(session.yourScore).toBe(0);
```

Do not design the interface then write tests to match. Run it the other way.

---

## The Seam Inventory — Golf Adventure

These are the natural extraction points already present in golf-adventure.html:

| Seam | Type | Extraction target |
|------|------|-------------------|
| `const CHARACTERS = [...]` | Object seam | `golf-data/characters.js` |
| `const TOURNAMENTS = [...]` | Object seam | `golf-data/tournaments.js` |
| `const EVENTS = [...]` | Object seam | `golf-data/events.js` |
| `const SHOTS = {...}` | Object seam | `golf-data/shots.js` |
| `let G = {...}` | Global variable seam | `GameEngine.start()` factory |
| `function rollDice()` | Method seam | `DiceResolver.roll()` |
| `function simulateField()` | Method seam | `FieldSimulator.simulate()` |
| `function maybeShowEvent()` | Method seam | `EventSelector.pick()` |
| `API.call(system, prompt, ...)` | Abstraction seam | `IAPIClient` / `CommentaryService` |
| `buildSetup()` | Method seam | `SetupController.init()` |
| `loadHole()` / `updateHUD()` | Method seam | `GameController.*` |

Each seam is an extraction point. We move code to the other side of the seam one at a time.
Tests protect the seam before, during, and after each move.

---

## BDD Applied to Architecture Work (Adzic / North / Roden)

Architecture work is not exempt from the Gherkin gate. It just asks different questions.

**The Fifty Quick Ideas lens applied to architectural Gherkin:**
- *Focus on the outcome, not the mechanism.* "Given the game engine is extracted, When a shot is played, Then the score updates correctly" — not "When GameEngine.playShot() is called".
- *Use examples, not abstractions.* Specify a real tournament, a real player, a real shot type. Concrete examples reveal gaps in the model that abstractions hide.
- *Smaller is more valuable.* A scenario that covers one extraction is worth more than one that covers the whole architecture. It can be green faster and deployed sooner.
- *Acceptance criteria are the contract.* Each Gherkin scenario is a consumer-driven contract between the domain and the implementation.

**The Three Amigos for architecture work:**
- Rod (business): what behaviour must survive the refactoring?
- Dev (implementation): what seams exist? what's the extraction order?
- Test (quality): what breaks if we get this wrong? how do we detect it?

The question is not "what should the architecture look like?" — it is "what must the system still do after the architecture changes?"

---

## UX Applied to Architecture Work (Norman / Krug)

**Affordances at the module level:**
A well-named module affords its use. `GameEngine.start()` is an affordance.
`G.tournament = t; G.player = p; G.day = 1;` scattered across 12 functions is not.

**Discoverability:**
A new developer should be able to find the game rules without reading 4,700 lines.
The architecture serves discoverability. If the structure requires a guided tour, it has failed.

**Krug's Law applied to API design:**
The calling code should never have to think. If the caller has to read the implementation to know how to call it, the interface is wrong. The test reveals this: if writing the test is awkward, the interface is wrong. Fix the interface, not the test.

**Norman's Principle of Least Surprise:**
`GameEngine.playShot(shot)` should do exactly what it says. No side effects on unrelated state. No hidden dependencies. No action at a distance.

---

## Systems Thinking Applied (Meadows)

**Feedback loops:**
The test suite is a feedback loop. Green = system is behaving. Red = system has drifted.
The faster the loop, the cheaper the correction. Unit tests are faster than integration tests. Run them first.

**Emergence:**
Architectural problems don't announce themselves. They emerge from accumulation.
The 4,700-line file didn't start that way. It got there through 200 unchecked decisions.
The gate that prevents the next 200 decisions from being unchecked is the architecture review process itself.

**Unintended consequences:**
Every architectural boundary creates coupling at the boundary and decoupling inside it.
Before adding a boundary, ask: what does this make impossible? What second-order effects does this boundary create?

---

## Non-Negotiable Gates for Architectural Work

1. **Characterisation tests before any extraction.** Lock down current behaviour first.
2. **Red before green.** Every new unit has a failing test before it has an implementation.
3. **Seam inventory completed before PR opened.** Know what you're moving before you move it.
4. **Dependency rule enforced.** Inner layers must not import from outer layers. Checked in CI.
5. **Contract defined before implementation.** The interface is the test. The test comes first.
6. **Each PR independently deployable.** golf-adventure.html must work after every PR, before the next one starts.
7. **Gherkin gate applies.** Even for refactoring. The scenario describes the behaviour that must survive.
8. **UX check before each extraction.** Does the new interface afford correct use? Would Krug's law pass?
9. **Systems second-order check.** What does this extraction make impossible? Name it before proceeding.

---

## index.html Layer Taxonomy — Agreed 2026-03-08

index.html is ~14,000 lines. The agreed taxonomy for extraction is 4 layers (not 6 — "engine" and "orchestration" collapsed):

```
src/
├── data/          — static objects only (no functions, no DOM, no API)
├── logic/         — pure functions (absorbs pipeline/logic.js)
├── integration/   — API client, Worker calls, Cloudflare fetch
└── ui/            — DOM manipulation only (no business logic)
index.html         — orchestration shell (wires layers, owns no logic)
pipeline/logic.js  — thin shim re-exporting from src/logic/ (do not delete, node test runner imports it)
```

**Dependency rule (Clean Architecture applied):**
```
data/ ← logic/ ← integration/ ← ui/ ← index.html (orchestration)
```
Inner layers know nothing of outer layers. Ever.

**Load order (no bundler — static `<script src>` tags):**
```html
<script src="src/data/..."></script>      <!-- loaded first, no deps -->
<script src="src/logic/..."></script>     <!-- depends on data only -->
<script src="src/integration/..."></script> <!-- depends on logic -->
<script src="src/ui/..."></script>        <!-- depends on logic, integration -->
<!-- index.html inline script block last — orchestration only -->
```

**Extraction order (risk-ordered, lowest first):**
1. **data/** — pure objects, no side effects. Near-zero risk. Do first.
2. **logic/** — pure functions. Risk: load order only. Do second.
3. **integration/** — API client. Risk: async, error handling. Do third.
4. **ui/** — DOM. Risk: event wiring, JSDOM tests needed. Do last.

---

## The Seam Inventory — index.html

Natural extraction points already present in index.html (Feathers: seams before touching anything):

| Seam | Type | Layer | Extraction target |
|------|------|-------|-------------------|
| `const SCENARIOS = [...]` (Quntum Leeks) | Object seam | data/ | `src/data/quntum-leeks-scenarios.js` |
| `INTELLECTUAL_ATTEMPTS_CONFIG` | Object seam | data/ | `src/data/intellectual-attempts-config.js` |
| `ATTEMPT_KEYWORDS` | Object seam | data/ | `src/data/intellectual-attempts-config.js` |
| `detectIntellectualAttempt()` | Method seam | logic/ | `src/logic/intellectual-attempts.js` |
| `buildAttemptInstruction()` | Method seam | logic/ | `src/logic/intellectual-attempts.js` |
| Quntum Leeks game mechanics (roll, pick, advance) | Method seam | logic/ | `src/logic/quntum-leeks-engine.js` |
| `API.call()` / fetch to Worker | Abstraction seam | integration/ | `src/integration/api-client.js` |
| FoodWeather state | Object seam | logic/ | `src/logic/food-weather.js` (shared darts+golf) |
| CharacterState | Object seam | logic/ | `src/logic/character-state.js` (shared darts+golf) |
| RelationshipState | Object seam | logic/ | `src/logic/relationship-state.js` (shared darts+golf) |
| Panel DOM render functions (boardroom, comedy, etc.) | Method seam | ui/ | `src/ui/<panel>-ui.js` per panel |
| `_runRound()` (boardroom orchestration) | Method seam | index.html shell | stays in orchestration shell |

**Note on shared code:** FoodWeather, CharacterState, RelationshipState, TURN_RULES are shared between darts and golf panels. Do not duplicate when extracting — extract once to logic/, import from both panels. Deduplication is a separate job; flag but do not block current extraction.

---

## Proof-of-Concept Extraction — Quntum Leeks

**Quntum Leeks chosen first** because:
- Self-contained: SCENARIOS data + game mechanics logic, no panel state, no API calls
- Low coupling: used only by Quntum Leeks panel, not shared
- Low risk: extracting data first, logic second, proven pattern from golf-adventure.html
- Canonical spelling: **Quntum Leeks** — the typo is intentional, canonical, and funnier. Files: `quntum-leeks-scenarios.js`, `quntum-leeks-engine.js`. Never "Quantum".

**Extraction slice:**
```
src/data/quntum-leeks-scenarios.js   — SCENARIOS array (currently inline in index.html)
src/logic/quntum-leeks-engine.js     — pick scenario, evaluate answer, advance round
```

**Gherkin gate (mandatory before any extraction code):**
Write Gherkin scenarios for Quntum Leeks mechanics. Three Amigos complete. Scenarios approved. Pipeline green. Only then: extract.

**pipeline/logic.js shim strategy:**
When src/logic/ exists, pipeline/logic.js becomes:
```js
// pipeline/logic.js — shim only. Do not add logic here.
module.exports = require('../src/logic/index.js');
```
Unit runner imports from pipeline/logic.js. No unit runner changes needed.

**Second-order check (Meadows):**
- What does extracting SCENARIOS make impossible? Nothing — `<script src>` is already how the page loads things.
- What does it make harder? Load order errors if script tag appears after inline code that uses it. Mitigation: load order enforced by convention and checked in pipeline.
- What coupling does this create at the boundary? index.html now imports from src/data/ — that is the intended direction. No inversion.

---

## 2026-03-09 — MatchPlayService extraction + cross-Claude sync

### MatchPlayService (golf-service/matchplay-service.js)

**Decision:** Extract all Ryder Cup match-play domain logic to a dedicated service.

**Problem:** `golf-adventure.html` had `if (G.tournament.type === 'ryder')` branches scattered through `buildSituation()`, `endHole()`, `getMatchPlayCommentary()` — OCP violation. "Miracle at Medinah" was hardcoded. Match context was built inline.

**Extracted to MatchPlayService:**
- `formatLive(score)` — mid-game score display ("2 UP", "All Square")
- `formatResult(score, holesLeft)` — final result ("2&1", "1 UP", "Halved")
- `buildContext(state)` — full mpCtx from game state (null for non-Ryder)
- `buildSituation(state)` — Ryder Cup situation string (replaces inline code)
- `buildInflightLeaderboard(tournament, day, holeIdx, ...)` — live parallel match rows
- `buildCommentaryAddendum(state, mpCtx)` — match context block for AI prompt

**Pattern:** Same as GameEngine and CommentaryService — pure functions, no DOM, no API, injectable in tests. Browser loads via `<script src>`, Node requires via `module.exports`.

**Load order:** `matchplay-service.js` must load before `golf-adventure.html` inline script. Added to `<head>` after `commentary-service.js`.

**Second-order check:**
- What does this make impossible? Nothing — `buildSituation` in `game-engine.js` remains for stroke play. Ryder Cup now routes through MatchPlayService.
- What coupling is created? `golf-adventure.html` now depends on MatchPlayService. CommentaryService accepts `ctx.mpCtx` from MatchPlayService — no circular dependency.
- What does this make harder? Any MatchPlayService change requires Gherkin update (enforced by pipeline).

### Shared session state (cross-Claude sync)

**Decision:** `.claude/shared-session-state.md` written on every close, included in `session-ref.md` pre-flight.

**Problem:** Claude Code and Claude.ai start fresh each session. No handoff. Protocol violations invisible to the next Claude.

**Mechanism:**
- `session-closedown.md step 8b` writes the file (overwrite, not append)
- `session-startup.md pre-flight` cats it into `session-ref.md` (before domain model and backlog)
- Claude.ai gets it via file upload at session start
- Claude Code reads it via `session-startup.md step 3`

**Contents:** last commit, what shipped, open WL items, backlog top 3, protocol status, carry-forward notes.

**Invariant:** If the file doesn't exist (first session after this decision), Claude notes it and continues — not an error.

### BL-112: Ryder Cup 5-session model (2026-03-10)

**Decision:** Ryder Cup restructured from 3 days to 5 sessions. `matchPlayDays[3]` → `matchPlaySessions[5]`. Tournament property `days:3` → `sessions:5` + `sessionLabels:[5 labels]`.

**Session structure:**
- Session 0: Day 1 Morning — Foursomes
- Session 1: Day 1 Afternoon — Fourballs
- Session 2: Day 2 Morning — Fourballs
- Session 3: Day 2 Afternoon — Foursomes
- Session 4: Day 3 — Singles

**ABSENT format:** `{format:"ABSENT"}` marks sessions where the player is not selected. `isSessionAbsent()` checks this; `showRestScreen()` shows parallel match results instead of game.

**Game state:** `G.session` (current session 0-4) added alongside `G.day` (kept for non-Ryder stroke play). `G.teamScore:{EUR:N, USA:N}` accumulates across sessions via `addSessionToTeamScore()`.

**parallelMatches:** expanded from 3 arrays to 5 — index matches session index. Day 2 AM/PM placeholder data added to all 10 Ryder Cup tournaments.

**MatchPlayService additions:** `firstActiveSession`, `isSessionAbsent`, `addSessionToTeamScore`, `buildEndOfSessionLeaderboard`, `buildRestScreenData`. Old `buildEndOfDayLeaderboard` / `firstActiveDay` / `isDayAbsent` kept for backward compat.

**WL-109 fix:** `buildEndOfSessionLeaderboard` always adds user's match as explicit row; never relies on pm name detection.

**Invariant:** `tournament.sessions` (Ryder) or `tournament.days` (other) gives total session/day count. Code uses `tournament.sessions || tournament.days` to handle both types.
