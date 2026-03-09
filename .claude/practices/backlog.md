# Cusslab — Persistent Backlog

Items here survive session resets. Each entry has enough context to pick up without re-research.
New items are added here automatically as they emerge — scope enhancements, tech debt, bugs, ideas.

## CD3 Scoring (Black Swan Farming / Reinertsen)

Every open item is scored when possible:
- **UBV** — User Business Value (1–10): what it delivers to user/product
- **TC** — Time Criticality (1–10): cost of waiting; does delay compound?
- **RR** — Risk Reduction (1–10): reduces technical or business risk
- **CoD** = UBV + TC + RR
- **Dur** — Duration (1–10): relative effort/size
- **CD3** = CoD / Dur (rank descending — highest = do first)

Items are sorted by CD3 within each section. Rescore when scope changes.

## Hypothesis Card (optional — for product bets, not pure tech debt)

For items that represent a product hypothesis, add after the CD3 line:
- **Actor:** who must change behaviour
- **AARRR:** Acquisition / Activation / Retention / Referral / Revenue
- **Signal:** what moves — specific and observable
- **Falsifier:** what result means we were wrong
- **Window:** sessions or days before assessment
- Full format: see `.claude/practices/hypothesis-driven.md`

---

## OPEN — Sorted by CD3

### BL-015 — golf-adventure.html: replace raw api.anthropic.com fetch with worker
- getDaySummary() and other functions call fetch("https://api.anthropic.com/v1/messages") directly
- CORS failure in browser — Anthropic blocks cross-origin browser requests
- Fix: route through `https://cusslab-api.leanspirited.workers.dev` (same as index.html)
- 7 raw fetch calls flagged by golf-adventure-sim pipeline check
- CD3: UBV=9 TC=8 RR=7 → CoD=24, Dur=3, **CD3=8.0**
- Status: CLOSED — 2026-03-08. golfFetch() helper added; 9/9 pipeline checks passing

### BL-016 — Golf Adventure: split tournament selector into categories
- Tournament grid currently shows all tournaments in a flat list; grows unmanageable as content increases
- Split into three sections with headers: **Majors** (type=major, type=collapse) | **Ryder Cup** (type=ryder) | **Other Historic** (new type=historic)
- Each section gets a label and visual separator; only shown if the section has entries
- Examples per section in UI: Majors → Duel in the Sun, Tiger at Augusta, Trevino/Jacklin, Van de Velde; Ryder Cup → Medinah 2012; Other Historic → empty until BL-017 adds content
- Do before BL-017 — BL-017 content needs the category to land in
- CD3: UBV=8 TC=6 RR=4 → CoD=18, Dur=2, **CD3=9.0**
- Status: CLOSED 2026-03-08 — implemented alongside BL-017; CSS + rendering + Gherkin all passing

### BL-017 — Golf Adventure: more historic tournaments
- Add at least 3 new tournaments to fill the Other Historic category and expand Majors
- **Ryder Cup** (most wanted): Brookline 1999 (USA comeback, crowd invasion, Crenshaw crying); Belfry 2002 (Torrance, 9/11 delay, Curtis Strange); Valderrama 1997 (Seve as captain, rain, Olazabal); Kiawah 1991 (War on the Shore, Hoch/Irwin, Ballesteros sidelined)
- **The Open** (lots wanted): Prestwick 1860 — first Open (Young Tom Morris / Old Tom Morris, hickory shafts, no scorecards, 12-hole course, field of 8); Seve at St Andrews 1984 (fist pump, dominant wire-to-wire); Muirfield 1966 Nicklaus first Open; Turnberry 1994 Jesper Parnevik; Carnoustie 1953 Hogan only Open; St Andrews 2000 Tiger (no bunkers, 19-under)
- **Masters** (some): Seve 1980 first Masters; Faldo 1996 Norman collapse; Tiger 1997 (12-under, 18 years old)
- **US Open** (fewer): Pebble Beach 2000 Tiger (15-shot win); Medinah 1999 Payne Stewart (last putt, died weeks later)
- **US PGA** (fewer): Valhalla 2000 Tiger (Tiger Slam year)
- Each needs: players[], field[], holes[], lore, matchPlayDays if Ryder
- Depends on BL-016 (category split) being done first — new type=historic needed for Prestwick etc
- CD3: UBV=7 TC=3 RR=2 → CoD=12, Dur=5, **CD3=2.4**
- Status: CLOSED 2026-03-08 — 7 tournaments added; prestwick_1868 lands correctly in Other Historic

### BL-020 — Tiered item event consequence system (Golf Adventure)
- Replace hollow `nothing` outcomes in item events with tiered mechanical consequences: LOW / MED / HIGH / NUTS
- Both penalty (threshold +N for N holes) and bonus (threshold −N, fortune, composure) directions — equal distribution within each event
- New outcome type: `consequence` with `{tier, direction, amount, holes}` properties
- `applyOutcome` reads amount from outcome object (extend existing threshold_up/down)
- HUD indicator showing tier badge + countdown (alongside fortune/anger indicators)
- Marshal's belt specific: `nothing` (40%) → LOW PENALTY (threshold +1 for 1 shot)
- All `nothing` outcomes retire — minimum Low consequence in either direction
- Gherkin approved 2026-03-08
- CD3: UBV=7 TC=6 RR=3 → CoD=16, Dur=3, **CD3=5.3**
- Status: CLOSED 2026-03-08 — 442/442 unit tests, 11/11 Gherkin passing (3352a7b)

### BL-019 — Session log + HTML dashboard (process trend analysis)
- Append-only `.claude/reports/session-log.jsonl` — one record per session close, never overwritten
- Each record: session_date, commit, pipeline (unit/gherkin/canary), dora (failure_rate, sessions), backlog (open count, top item), shipped[], loops (tdd/bdd/ddd/hdd status)
- `session-report.html` — dashboard reading the log, served via GitHub Pages, renders trends in colour
- `write-session-log.sh` — same pattern as append-section.sh, called from session-closedown.md step 8
- Enables: failure rate trend, Ivan metric over time, Gherkin growth, DORA delta, HDD loop health
- Without this: flying blind — no way to close the HDD loop on process improvement itself
- Three artefacts ship together: jsonl store, html view, write script. Gherkin covers all three.
- CD3: UBV=7 TC=5 RR=8 → CoD=20, Dur=3, **CD3=6.7**
- Status: CLOSED 2026-03-08 — artefacts committed 7c6dc90; backlog entry was stale-open

### BL-018 — Make HCSession.logPanelRun() data observable
- HCSession.logPanelRun() is called on every panel run but data is not retrievable outside the session
- Prerequisite for all AARRR measurement — without this, no outer loop hypothesis is testable
- Minimum: expose per-panel run counts and avg discussion depth (responses per run) via a lightweight
  read endpoint or localStorage summary accessible to pipeline checks
- Enables: Activation measurement (sc vs fb avg turns), Retention (return sessions), panel popularity
- CD3: UBV=6 TC=7 RR=8 → CoD=21, Dur=3, **CD3=7.0**
- Hypothesis: [prerequisite — no product hypothesis; this is measurement infrastructure]
- Status: CLOSED 2026-03-08 — accumulatePanelStats/computeAvgDepth in logic.js, HC_PANEL_STATS key in HCSession, 454/454 unit tests, 7/7 Gherkin passing

### BL-014 — Match play leaderboard for Ryder Cup end-of-day
- buildLeaderboard() shows stroke play table for Ryder Cup — wrong format
- Should show: Europe vs USA match play points, individual match results (1UP, 2DN, halved)
- Blocked on defining per-match outcomes for field (Molinari, McIlroy, Westwood, Donald)
- CD3: UBV=8 TC=4 RR=5 → CoD=17, Dur=4, **CD3=4.25**
- Status: OPEN — HUD and buildSituation fixed; in-flight leaderboard added 2026-03-09; end-of-day leaderboard (points table format) still pending

### BL-021 — MatchPlayService: Gherkin + unit tests (tech debt, WL-080)
- MatchPlayService (golf-service/matchplay-service.js) shipped 2026-03-09 with no pipeline coverage
- Needs: unit tests in pipeline/unit-runner.js for formatLive, formatResult, buildContext, buildSituation, buildInflightLeaderboard, buildCommentaryAddendum
- Needs: Gherkin in specs/ covering match situation text, score formatting, historical result injection
- Prerequisite before any further MatchPlayService changes — see WL-080
- CD3: UBV=3 TC=8 RR=9 → CoD=20, Dur=2, **CD3=10.0**
- Status: CLOSED — 2026-03-09 (7d0e35d): 28 Gherkin scenarios written and green, 1181/1181

### BL-022 — Golf Adventure: Ryder Cup "Be Any Player" mode
- User picks any of the 24 players across all Ryder Cup tournaments and plays as them for all 3 days
- Setup screen shows all players from the selected Ryder Cup tournament, with team, role, wound
- Match schedule populates from player's actual matchPlayDays data — no new data required
- Gherkin: player picker shows all players when Ryder Cup selected; match days are correct
- CD3: UBV=8 TC=3 RR=2 → CoD=13, Dur=3, **CD3=4.3**
- Status: OPEN

### BL-023 — Golf Adventure: 1997 Valderrama Ryder Cup
- id: valderrama_1997. Europe 14.5–13.5. Seve captains, does not play.
- Player options: Andrew Coltart (Sunday singles only — never appeared Fri/Sat), Lee Westwood, Colin Montgomerie, Jesper Parnevik
- Lore focus: Seve's interventionist captaincy (infamous 18th water hole interference), Coltart's peculiar selection, rain delays, Europe's narrow win
- Era: Ceefax/late-90s BBC transitional — Alliss narrating, pre-Sky graphics
- CD3: UBV=7 TC=2 RR=1 → CoD=10, Dur=4, **CD3=2.5**
- Status: OPEN

### BL-024 — Golf Adventure: Ryder Cup rollout — Tier 1 (Europe wins)
- Add one at a time, in priority order. Each is a full tournament addition with holes, players, parallelMatches, historicalResult data.
- Priority order (comedic + historic interest, Europe-wins weighted higher):
  1. **1985 The Belfry** — Europe's first win in 28 years. Torrance on 18. Jacklin captains. Ballesteros/Woosnam/Langer.
  2. **2006 K Club** — Europe 18.5–9.5. Darren Clarke plays days after Heather's death.
  3. **1987 Muirfield Village** — Europe wins on US soil first time. Ballesteros/Olazabal pairing.
  4. **2010 Celtic Manor** — first Welsh Ryder Cup, Monday finish, McDowell decisive point.
  5. **1995 Oak Hill** — Faldo holes on 18 to beat Azinger. Gallacher's third attempt, first win.
- Each needs own eraClass CSS (see era styling note below)
- Era styling: pre-1970 monochrome BBC; 1970s–80s Ceefax/Alliss; 1991–99 ESPN/ABC; 2000s+ NBC/Sky
- CD3: UBV=8 TC=2 RR=1 → CoD=11, Dur=5 per tournament, **CD3=2.2** (per tournament; do one at a time)
- Status: OPEN

### BL-025 — Golf Adventure: Ryder Cup rollout — Tier 2 (USA wins, rich incident)
- After Tier 1. Lower priority — comedy engine weaker when player is losing cause.
  1. **2016 Hazeltine** — USA 17–11. Europe collapse. Rory visibly furious throughout.
  2. **2021 Whistling Straits** — USA 19–9. Biggest US win in 40 years. Patrick Reed/Rory dynamic.
- Kiawah 1991 and Brookline 1999 already in.
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=5 per tournament, **CD3=1.6**
- Status: OPEN

### BL-026 — Golf Adventure: Ryder Cup rollout — Tier 3 (GB&Ireland era)
- Fewer of these. Framed as historical curiosity, not partisan drama.
  1. **1969 Royal Birkdale** — Nicklaus concedes Jacklin's putt. Greatest gesture in golf. 16–16 halved.
  2. **1953 Wentworth** — Hogan's only Ryder Cup. USA win but Hogan's presence is the story.
  3. **1933 Southport & Ainsdale** — GB&I win (rare). Easterbrook holes on the last.
- CD3: UBV=5 TC=1 RR=1 → CoD=7, Dur=5 per tournament, **CD3=1.4**
- Status: OPEN

### BL-027 — Golf Adventure: Ryder Cup rollout — Tier 4 (GB only era, curiosity)
- Lowest priority. Treat as historical artefact, not competitive drama.
  1. **1927 Worcester CC** — inaugural Ryder Cup. Hagen captains USA. Ted Ray captains GB.
  2. **1929 Moortown** — GB win. Compston beats Hagen 6&4 in singles.
- CD3: UBV=4 TC=1 RR=1 → CoD=6, Dur=5 per tournament, **CD3=1.2**
- Status: OPEN

### BL-028 — Golf Adventure: Other Historic category expansion (Pro-Ams, celebrity golf, TV formats)
- Expand "Other Historic" beyond traditional tournament golf into televised oddities:
  - **Shell's Wonderful World of Golf** (1960s–70s) — head-to-head matchplay at exotic locations. Self-contained episode format. Perfect for Golf Adventure.
  - **A Round with Alliss** (BBC, 1980s–90s) — Alliss takes a celebrity around a course and narrates their suffering. Alliss as commentary character mechanic.
  - **The Skins Game** — winner-takes-all, carries over. Trevino/Player/Watson/Nicklaus ideal.
  - **Pro-Am formats** — celebrity + pro pairing. Quality gap is the comedy engine.
  - **The Dunhill Links** — St Andrews/Carnoustie/Kingsbarns, celebrities playing real links.
  - **TSL / modern exhibition formats** — big personalities, social media stakes.
- Key design question to resolve before Gherkin: does player play as celebrity or as babysitting pro?
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=6, **CD3=1.3**
- Status: OPEN — design question unresolved

### BL-001 — Wayne Riley / Radar content merge
- Claude.ai session has full Wayne Riley/Radar explanation not yet in repo
- Target file: `docs/characters-sports.md`
- Also: additional extended pools and needle definitions
- CD3: UBV=6 TC=3 RR=2 → CoD=11, Dur=2, **CD3=5.5**
- Status: CLOSED — characters/radar.md exists (139 lines, 2026-03-06); characters/roe.md also present. Content is in repo. Original concern was Claude.ai session context not persisted — resolved by character file system.

### BL-007 — Claude Code Windows install bugs (follow-up)
- "Class not registered" blocks git.exe picker + hidden file access
- CLAUDE_CODE_GIT_BASH_PATH env var ignored on restart
- Actions: check anthropics/claude-code issues, Anthropic Discord, file own issue
- CD3: UBV=4 TC=3 RR=3 → CoD=10, Dur=2, **CD3=5.0**
- Status: OPEN

### BL-009 — Mode 2 moment type expansion (Football, Golf, LongRoom)
- More named moment examples in the selector per panel
- Football: manager touchline, injury sub, captain decision, controversial tackle
- Golf: flagstick controversy, slow play warning, eagle putt, 18th ceremony
- LongRoom: DRS review, lunch interval, century milestone
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=4, **CD3=2.0**
- Status: OPEN

### BL-002 — Food pool expansion (all characters)
- Same references repeating — pool too small
- Design: three orthogonal axes: Food type / Location / Context+person
- Applies to ALL characters
- CD3: UBV=7 TC=2 RR=1 → CoD=10, Dur=5, **CD3=2.0**
- Status: OPEN — design confirmed, implementation not started

### BL-003 — Hypochondria pool expansion (all characters)
- Pool types: real ailments exaggerated, fictional, borrowed, sport-specific
- Each character has own flavour (Radar: dramatic/Australian; Faldo: biomechanical)
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=4, **CD3=2.25**
- Status: OPEN — design confirmed, pool content not written

### BL-006 — pipeline @claude skip count reduction
- 400+ scenarios @claude-tagged (manual / behavioural)
- First candidates: watching-oche-mode1 suggestion card shuffle, panel-slots cross-panel invariants
- CD3: UBV=3 TC=2 RR=5 → CoD=10, Dur=6, **CD3=1.67**
- Status: OPEN — ongoing

---

## CLOSED

### BL-004 — FOOD_WEATHER and HYPOCHONDRIA_POOL confirmed separate
- Do NOT merge — different mechanics, collision IS the mechanic
- Status: CLOSED (decision made)

### BL-005 — Character attribute count is fine at ~20
- No rationalisation needed
- Status: CLOSED (decision made)

### BL-010 — Football RelationshipState + CharacterState + WoundDetector
- Done: FOOTBALL_WOUNDS, FOOTBALL_NAMEMAP, FOOTBALL_VOICE_FMT, FOOTBALL_PRE_EXISTING
- Wired: RelationshipState.init, CharacterState, WoundDetector into Football discuss()
- LieEngine woundActivated now passed correctly
- Status: CLOSED — 2026-03-08

### BL-011 — Anchor readback + user name for Football, Darts, LongRoom
- Done: name strip + localStorage per panel, anchor readback with text-reveal animation
- Football: Gary Lineker. Darts: Sid Waddell (heroic couplets). LongRoom: Blofeld (pigeon)
- Status: CLOSED — 2026-03-08

### BL-012 — ConspireEngine for Football
- Done: Souness/Neville (contempt spiral) + Carragher/Cox (epistemological alliance)
- Status: CLOSED — 2026-03-08

### BL-013 — golf-adventure.html in pipeline
- Done: pipeline/golf-adventure-sim.js — 8/9 checks pass, warn-only
- Flags raw anthropic.com fetch (tracked as BL-015)
- Status: CLOSED — 2026-03-08
