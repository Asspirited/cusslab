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
- **Epic** — (optional) group label for related items sharing a design theme or dependency chain.
  Set on individual items. An "epic" is not a backlog item — it is only a label.
  Example: Epic: "Modern Majors Tier 2" groups BL-036 through BL-047.

Items are sorted by CD3 within each section. Rescore when scope changes.
Every item has its own BL-NNN number. No sub-items (BL-032-1 etc.) ever.
- **Feature** — (optional) canonical label for feature-activity reporting. Set on every new item.
  Canonical labels: `golf-adventure` · `pub-navigator` · `comedy-room` · `sports-19th-hole` · `darts` · `cricket` · `quntum-leeks` · `boardroom` · `play` · `learn` · `platform` · `process`
  Script: `bash .claude/scripts/feature-report.sh`

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
- Status: CLOSED — 2026-03-09 (51b51fc): parseHistoricalResult + buildEndOfDayLeaderboard in MatchPlayService; buildLeaderboard() dispatches; Ryder points table renders EUR/USA totals + match rows; 1241/1241 Gherkin green

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
- Status: CLOSED — 2026-03-09 (93472a7): player picker, attr HUD, temperamentProfile, 16 players added, 1224 Gherkin green

### BL-023 — Golf Adventure: 1997 Valderrama Ryder Cup
- id: valderrama_1997. Europe 14.5–13.5. Seve captains, does not play.
- Player options: Andrew Coltart (Sunday singles only — never appeared Fri/Sat), Lee Westwood, Colin Montgomerie, Jesper Parnevik
- Lore focus: Seve's interventionist captaincy (infamous 18th water hole interference), Coltart's peculiar selection, rain delays, Europe's narrow win
- Era: Ceefax/late-90s BBC transitional — Alliss narrating, pre-Sky graphics
- CD3: UBV=7 TC=2 RR=1 → CoD=10, Dur=4, **CD3=2.5**
- Status: CLOSED — 2026-03-09 (c8d090a): tournament data + era-1997/1991/1999-rc CSS added

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
- Status: CLOSED — 2026-03-09 (5cecb88→9c23f7d): Belfry 1985, K Club 2006, Muirfield Village 1987, Celtic Manor 2010, Oak Hill 1995 all shipped

### BL-025 — Golf Adventure: Ryder Cup rollout — Tier 2 (USA wins, rich incident)
- After Tier 1. Lower priority — comedy engine weaker when player is losing cause.
  1. **2016 Hazeltine** — USA 17–11. Europe collapse. Rory visibly furious throughout.
  2. **2021 Whistling Straits** — USA 19–9. Biggest US win in 40 years. Patrick Reed/Rory dynamic.
- Kiawah 1991 and Brookline 1999 already in.
- Feature: golf-adventure
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=5 per tournament, **CD3=1.6**
- Status: OPEN

### BL-026 — Golf Adventure: Ryder Cup rollout — Tier 3 (GB&Ireland era)
- Fewer of these. Framed as historical curiosity, not partisan drama.
  1. **1969 Royal Birkdale** — Nicklaus concedes Jacklin's putt. Greatest gesture in golf. 16–16 halved.
  2. **1953 Wentworth** — Hogan's only Ryder Cup. USA win but Hogan's presence is the story.
  3. **1933 Southport & Ainsdale** — GB&I win (rare). Easterbrook holes on the last.
- Feature: golf-adventure
- CD3: UBV=5 TC=1 RR=1 → CoD=7, Dur=5 per tournament, **CD3=1.4**
- Status: OPEN

### BL-027 — Golf Adventure: Ryder Cup rollout — Tier 4 (GB only era, curiosity)
- Lowest priority. Treat as historical artefact, not competitive drama.
  1. **1927 Worcester CC** — inaugural Ryder Cup. Hagen captains USA. Ted Ray captains GB.
  2. **1929 Moortown** — GB win. Compston beats Hagen 6&4 in singles.
- Feature: golf-adventure
- CD3: UBV=4 TC=1 RR=1 → CoD=6, Dur=5 per tournament, **CD3=1.2**
- Status: OPEN

### BL-028 — Golf Adventure: Other Historic category expansion (Pro-Ams, celebrity golf, TV formats)
- Expand "Other Historic" beyond traditional tournament golf into televised oddities:
  - **AT&T Pebble Beach Pro-Am** — Bill Murray, Michael Jordan, Clint Eastwood, celebrities vs Pebble Beach rough
  - **Alfred Dunhill Links** (St Andrews/Carnoustie/Kingsbarns) — Hugh Grant, Samuel L Jackson, Chris Martin, Shane Warne, Terry Wogan, Jamie Redknapp, Gary Lineker
  - **Shell's Wonderful World of Golf** (1960s–70s) — head-to-head matchplay at exotic locations
  - **A Round with Alliss** (BBC, 1980s–90s) — Alliss narrates celebrity suffering
  - **The Skins Game** — winner-takes-all, Trevino/Player/Watson/Nicklaus
- **Design decision (2026-03-10):** Player plays AS the celebrity. The pro is a passenger. Incompetence is the comedy engine. Commentary reacts to celebrity chaos.
- **Character approach:** Use existing non-golfer panel members (Football/Darts/LongRoom) as celebrities — no new character research needed. Their voices, wounds, and profiles already built.
- **Celebrity research:** Research agent dispatched 2026-03-10 for Bill Murray, Michael Jordan, Hugh Grant, Samuel L Jackson, Chris Martin, Terry Wogan, Shane Warne, Gary Lineker incidents at Pebble Beach and Dunhill Links.
- **Era palette note (2026-03-10):** Shell's Wonderful World of Golf ran 1962–1970 (original series), revived 1994–2003. Era CSS should lean into 1960s–70s technicolour: oversaturated, warm, slightly garish — not the clean broadcast look of modern eras. Think Kodachrome rather than HD.
- **Format complexity (2026-03-10):** AT&T Pebble Beach Pro-Am and Alfred Dunhill Links both use special tournament formats (pro-am scoring, multi-course rotation across Kingsbarns/Carnoustie/St Andrews) that require dedicated research and design before implementation. Shell's Wonderful World, A Round with Alliss, and The Skins Game are simpler one-off formats — do those first. Pro-Am and Dunhill saved for later.
- Feature: golf-adventure
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=8, **CD3=1.1** — revised up for format research and design cost on Pro-Am/Dunhill
- Status: OPEN — celebrity research in progress; start with simpler formats (Shell's/Alliss/Skins); Pro-Am and Dunhill deferred pending format research

### BL-029 — Golf Adventure: Temperament profile archetype mechanics
- Each `temperamentProfile` (ICEBERG, STREAKY, LEVELHEADED, PEAKER, DEFENSIVE, COMBUSTIBLE) has its own
  rules for how stats change magnitude and direction in response to shot outcomes and events
- Magnitude of TEMPERAMENT movement is not fixed (+1) — it varies by archetype
  (e.g. STREAKY gets amplified runs, LEVELHEADED gets dampened swings)
- EGO interaction by archetype: ICEBERG stays stable, STREAKY and COMBUSTIBLE amplify EGO on runs
- Prerequisite: BL-022 player roster + `temperamentProfile` field must be shipped first
- Gherkin: one scenario outline per profile type, covering positive and negative pressure events
- CD3: UBV=8 TC=4 RR=5 → CoD=17, Dur=4, **CD3=4.25**
- Status: CLOSED — 2026-03-09 (08370d1): TemperamentService.applyHoleResult, 6 profiles, streak tracking, EGO amplification; 1290/1290 Gherkin green

### BL-030 — Golf Adventure: Player-specific chaos injectors
- A separate function (per player) that sits on top of the profile archetype
- Archetype defines the base mechanic; chaos injector defines the player-specific deviation
  (e.g. Poulter's STREAKY is more extreme than the generic STREAKY; Seve's recovery bonus fires
  when composure is below 4; Garcia's EGO spikes on eagle then collapses on bogey)
- Injector is a pure function: `(state, event) => statDeltas` — no DOM, no side effects
- Prerequisite: BL-029 archetype mechanics must be shipped first
- CD3: UBV=9 TC=3 RR=4 → CoD=16, Dur=5, **CD3=3.2**
- Status: CLOSED — 2026-03-09 (a0d6184): ChaosInjectorService with 5 player injectors; wired into endHole(); 1312/1312 Gherkin green

### BL-034 — Golf Adventure: Dual temperament profiles (primary + secondary)
- Each player currently has one temperamentProfile driving all composure mechanics
- Design: add `temperamentProfileSecondary` to player data — fires at half-magnitude (or with inverted counter-properties) under specific conditions (composure below threshold, or after 5+ holes played in a day)
- Example: Poulter primary=STREAKY, secondary=PEAKER — when composure drops below 4, PEAKER behaviour kicks in (hard lows get harder, but eagle recovery is explosive)
- Counter-property variant: secondary profile can invert one rule (e.g. COMBUSTIBLE secondary on a LEVELHEADED player means big shots break the dam in either direction)
- Prerequisite: BL-029 archetype mechanics shipped; BL-030 chaos injectors for implementation context
- CD3: UBV=7 TC=3 RR=5 → CoD=15, Dur=3, **CD3=5.0**
- Status: CLOSED — 2026-03-10 (0c1018c/e6b752c): applyHoleResultDual added to TemperamentService; 13 Gherkin scenarios green; temperamentProfileSecondary added to all 53 players; Ryder Cup UI decade-grouping applied (0ece07d)

### BL-031 — Golf Adventure: Modern Majors Tier 1 (post-2000, highest CD3 comedy + history)
- Add one at a time in priority order. Each is a full tournament with holes, players, historicalResult data.
- All need era CSS (2000s: NBC/CBS clean; 2010s+: Sky/ESPN/social-media saturated).
- Priority order by CD3 (comedy richness × historical weight):
  1. **2008 US Open Torrey Pines** — Tiger on broken leg + torn ACL. 91-hole playoff vs Rocco Mediate. Rocco the everyman. Tiger's last major win. NBC. Comedy: Rocco's persona, Tiger grimacing, commentators losing it. Players: Tiger (protagonist), Rocco Mediate (foil). CD3=7.0
  2. **2017 Masters** — Sergio Garcia finally wins a major. Augusta playoff vs Justin Rose. On what would have been Seve's 60th birthday. Garcia had missed 73 majors. CBS. Players: Garcia (protagonist, redemption arc), Rose (foil). CD3=6.7
  3. **2019 Masters** — Tiger's comeback. 11 years since last major. Scandal, injury, public humiliation, back surgery. Roars on 16. CBS. Players: Tiger (protagonist), Francesco Molinari (collapses from lead). CD3=6.3
  4. **2009 Open Turnberry** — Tom Watson at 59 nearly wins. Leads by 1 going to 18 in regulation, bogeys, loses to Cink in playoff. Cink as villain of history. BBC. Players: Watson (protagonist), Cink (foil), Westwood (also in contention). CD3=6.3
  5. **2016 Open Troon** — Stenson vs Phil Mickelson. Both sub-65 every round. Stenson 63 in final round, Phil 65 and loses. Greatest Open head-to-head since Duel in the Sun. Sky. Players: Stenson (protagonist), Phil (loveable foil). CD3=6.0
  6. **2016 Masters** — Jordan Spieth loses 5-shot lead. Quad bogey on 12 (water twice). Danny Willett wins from nowhere. CBS. Players: Willett (protagonist), Spieth (collapse arc), Sergio (bystander). CD3=6.0
  7. **2012 Open Lytham** — Ernie Els wins at 42. Adam Scott collapses over last 4 holes after leading by 4. Big Easy celebrates not knowing Scott has imploded. BBC/Sky. Players: Els (protagonist), Adam Scott (collapse arc). CD3=6.0
  8. **2013 Open Muirfield** — Phil Mickelson wins his first Open with a final round 66. Nick Faldo in the booth: "The finest round of golf I have ever seen." Scottish gallery goes with him. Phil's first and only Open. Sky. Players: Phil (protagonist), Lee Westwood (nearly wins again). CD3=6.0
- CD3 (bucket): UBV=9 TC=7 RR=2 → CoD=18, Dur=3 per tournament, **CD3=6.0**
- Status: CLOSED — 2026-03-09 (71b2bf5). First tournament (Torrey Pines 2008) shipped: era-2008 CSS, Tiger/Rocco players, TemperamentService + ChaosInjectorService wiring, 3 canonical holes. Remaining 7 tournaments remain in backlog for future iterations.

### BL-032 — EPIC: Modern Majors Tier 2
- Epic container only — not a work item. Individual items: BL-036 through BL-047.
- Status: CLOSED as epic definition — tracking moves to individual items

### BL-036 — Golf Adventure: Monty at US Open 1994 Oakmont
- Epic: Modern Majors Tier 2
- Monty shoots 65 in final round to tie. 3-man playoff vs Els and Loren Roberts. Els wins. US crowd notoriously hostile to Monty throughout.
- Players: Monty (protagonist), Els (foil). Era: pre-2000 but standalone iconic. NBC.
- CD3: UBV=8 TC=6 RR=1 → CoD=15, Dur=3, **CD3=5.0** (own score; not inherited from epic)
- Status: CLOSED — 2026-03-10 (852a9c4): oakmont_1994, era-1994 CSS, 3 holes; 1335/1335 green

### BL-037 — Golf Adventure: 2005 Masters (Tiger chip-in 16th)
- Epic: Modern Majors Tier 2
- Tiger chip-in on 16. "In your life, have you seen anything like that?" — Verne Lundquist. Nike ad made that night. CBS. Players: Tiger (protagonist), Chris DiMarco (foil).
- CD3: UBV=8 TC=6 RR=1 → CoD=15, Dur=3, **CD3=5.0**
- Status: CLOSED — 2026-03-10 (this session): era-2005 CSS, 3 holes (13th, 16th chip-in, 18th playoff)

### BL-038 — Golf Adventure: 2006 US Open Winged Foot (Phil collapse)
- Epic: Modern Majors Tier 2
- Phil Mickelson needs par on 18 to win. Makes double bogey. "I am such an idiot." Geoff Ogilvy wins by watching. NBC. Players: Phil (collapse), Ogilvy (accidental winner).
- CD3: UBV=8 TC=5 RR=1 → CoD=14, Dur=3, **CD3=4.7**
- Status: CLOSED — 2026-03-10 (this session): type:collapse, era-2006-us, 3 holes (9th, 16th, 18th double)

### BL-039 — Golf Adventure: 2000 US Open Pebble Beach (Tiger +15)
- Epic: Modern Majors Tier 2
- Tiger wins by 15. Untouchable performance. Sets every US Open scoring record. NBC. Players: Tiger (protagonist), Ernie Els (distant second).
- CD3: UBV=8 TC=5 RR=1 → CoD=14, Dur=3, **CD3=4.7**
- Status: CLOSED — 2026-03-10 (928d25e): pebble_beach_2000, era-2000-us CSS, 3 holes; 1335/1335 green

### BL-040 — Golf Adventure: 2000 Open St Andrews (Tiger Grand Slam)
- Epic: Modern Majors Tier 2
- Tiger completes Career Grand Slam (never visited a bunker). 19-under. Monty as great Scottish foil with crowd. BBC. Players: Tiger (protagonist), Monty (crowd favourite).
- Feature: golf-adventure
- CD3: UBV=8 TC=5 RR=1 → CoD=14, Dur=3, **CD3=4.7**
- Status: OPEN

### BL-041 — Golf Adventure: 2011 US Open Congressional (Rory 8-shot)
- Epic: Modern Majors Tier 2
- Rory McIlroy 8-shot win at 22. After Masters collapse. Utterly dominant. NBC. Players: Rory (protagonist), Jason Day (distant second).
- Feature: golf-adventure
- CD3: UBV=8 TC=5 RR=1 → CoD=14, Dur=3, **CD3=4.7**
- Status: OPEN

### BL-042 — Golf Adventure: 2002 Open Muirfield (Els 4-way playoff)
- Epic: Modern Majors Tier 2
- 4-man playoff (Els, Elkington, Levet, Appleby). Els wins. Thomas Levet falls over after hole-in-one celebrations. BBC. Players: Els (protagonist), Levet (comedy foil).
- Feature: golf-adventure
- CD3: UBV=7 TC=5 RR=1 → CoD=13, Dur=3, **CD3=4.3**
- Status: OPEN

### BL-043 — Golf Adventure: 2011 Open Sandwich (Darren Clarke)
- Epic: Modern Majors Tier 2
- Clarke wins three weeks after anniversary of wife Heather's death. Emotional. Sky. Players: Clarke (protagonist), Phil Mickelson / Dustin Johnson (foils).
- Feature: golf-adventure
- CD3: UBV=8 TC=5 RR=1 → CoD=14, Dur=3, **CD3=4.7**
- Status: OPEN

### BL-044 — Golf Adventure: 2007 Open Carnoustie (Harrington/García)
- Epic: Modern Majors Tier 2
- Harrington makes double bogey on 18, still wins. García ties, Harrington wins playoff. Players: Harrington (protagonist), García (near-miss again). era-2007 BBC/Sky indigo.
- CD3: UBV=7 TC=5 RR=1 → CoD=13, Dur=3, **CD3=4.3**
- Status: CLOSED — 2026-03-10 (this session): era-2007, 3 holes (17th, 18th Barry Burn, 18th playoff)

### BL-045 — Golf Adventure: 2012 PGA Kiawah (Rory dominant)
- Epic: Modern Majors Tier 2
- Rory McIlroy dominant. 8-shot win. Ryder Cup backdrop (Ocean Course). Players: Rory (protagonist).
- Feature: golf-adventure
- CD3: UBV=7 TC=4 RR=1 → CoD=12, Dur=3, **CD3=4.0**
- Status: OPEN

### BL-046 — Golf Adventure: 2004 Masters (Phil's first major)
- Epic: Modern Majors Tier 2
- Phil Mickelson's first major after 0-for-46. Arms in air on 18. Ernie Els misses short putt on 18 to tie. CBS.
- Feature: golf-adventure
- CD3: UBV=7 TC=4 RR=1 → CoD=12, Dur=3, **CD3=4.0**
- Status: OPEN

### BL-047 — Golf Adventure: 2012 Masters (Bubba Watson)
- Epic: Modern Majors Tier 2
- Bubba Watson punch hook from pine straw on 10 in playoff. Weeps at the hole. CBS. Players: Bubba (protagonist), Louis Oosthuizen (foil).
- Feature: golf-adventure
- CD3: UBV=7 TC=4 RR=1 → CoD=12, Dur=3, **CD3=4.0**
- Status: OPEN

### BL-048 — Golf Adventure: Round selection — play final round only OR all 4
- Option at tournament start: play the full 4 rounds or jump straight to the final round with historical scores loaded for rounds 1–3.
- Enables quick plays of the key dramatic round without replaying the whole tournament.
- CD3: UBV=7 TC=1 RR=1 → CoD=9, Dur=5, **CD3=1.8**
- Status: CLOSED — 2026-03-11 Rod decision: not required, removed from backlog

### BL-049 — Wise Sir Nick: sandwich gate wound + insult vocabulary
- Epic: Sir Nick Character Depth
- **Wound:** Sandwich gate — 2008 Ryder Cup Valhalla. Faldo was European captain. A British photographer with a zoom lens caught him showing handwritten foursomes pairings (just initials) to Henrik Stenson during the practice round. At the press conference Faldo claimed the paper was a team sandwich order: "who wants tuna, who wants the beef, who wants the ham." Flaw: only 11 initials, Jiménez missing. Reporter pointed it out. Faldo: "Put my name down, then." Every pairing on the note appeared in the actual lineup the next morning. Europe lost 16½–11½. Ian Poulter: "Faldo is talking about someone being useless at the 2008 Ryder Cup. That's the Ryder Cup where *he* was captain."
- **Comedy mechanic:** Sir Nick's insult vocabulary uses sandwich language — bad opponents/shots get "rotten filling", "mouldy bread", "soggy crust", "wrong sauce", "terrible combination", "accoutrements entirely wrong." Other panel members know about the sandwich gate and can needle him with it (tuna/beef/ham references, "what's on the menu today Nick" etc.)
- **Wound trigger:** any mention of Ryder Cup captaincy, 2008, Valhalla, Poulter, Garcia, or "pairings" fires the wound.
- CD3: UBV=7 TC=1 RR=1 → CoD=9, Dur=4, **CD3=2.3**
- Status: CLOSED — 2026-03-11: tuna/beef/ham/poulter/valhalla/2008/captaincy/pairings triggers added to GOLF_WOUNDS; FALDO_CLARIFICATION wound response; sandwich insult vocabulary (6 items); cross-panel needles for Radar/McGinley/Roe; 1496/1496 Gherkin green.

### BL-059 — The Writing Room: authors as a standalone Comedy Room panel
- Epic: Author Epilogue
- Depends on: BL-058 (author characters must exist and be voiced first)
- Once the author pool is built for BL-058, extract them into their own Comedy Room mode tab: "The Writing Room". User submits any topic, event, premise, or piece of text. A randomly selected author (or user-chosen) responds in their full literary register — same collision comedy as the epilogue but untethered from sport. A press release narrated by Cormac McCarthy. A team-building day by Jane Austen. A product roadmap by Tolkien (with appendix). Corporate prompt goes in; literary masterwork comes out.
- Natural home: third tab in Comedy Room after "Into The Room" and "The House Name Oracle"
- Author selection: either random-with-re-roll (like epilogue) or a picker dropdown (like Oracle archetype) — decide during Three Amigos
- Structural difference from Comedy Room: single author response, not a panel conversation. Longer output — 300–500 words. The author is not interrupted.
- Characters already specced in notes/2026-03-10-author-epilogue.md — just needs prompt templates and UI
- CD3: UBV=7 TC=1 RR=1 → CoD=9, Dur=5, **CD3=1.8**
- Status: CLOSED — shipped 2026-03-10 (commit e7b0c80)

---
### BL-058 decomposition — Author Epilogue delivery items (BL-060 onward)
Epic decomposition applied 2026-03-10 per user-stories.md protocol.
Walking skeleton first (BL-060), then pool mechanics (BL-061), then one author per BL item.
BL-058 remains the design/discovery item. Delivery items: BL-060 through BL-086.
---

### BL-060 — Author Epilogue: walking skeleton (Hemingway, Golf Adventure, hardcoded)
- Epic: Author Epilogue
- Walking skeleton. Thinnest end-to-end slice that proves the concept works before building the pool.
- Golf Adventure end-of-game state: "The Author's Account 📖" button appears. One click → Hemingway
  prompt fires via Worker → response rendered in UI. Hemingway hardcoded (no picker, no shuffle yet).
- Hemingway voice: short sentences, iceberg theory, masculine stoicism. Structural tell: the silence
  between sentences. Wound: nothing left unsaid that couldn't be left unsaid better.
- Delivers: proof that comedy works. Architecture proven. Prompt format established.
- SPIDR-R: no pool, no rules for selection. SPIDR-D: Golf Adventure only.
- CD3: UBV=8 TC=7 RR=8 → CoD=23, Dur=3, **CD3=7.7**
- Status: CLOSED — 2026-03-10. Shipped with BL-061 (see BL-058 note + BL-061 entry). Walking skeleton proven; delivery continues via BL-062 onward.

### BL-061 — Author Epilogue: pool mechanics (random selection + re-roll + sessionStorage shuffle)
- Epic: Author Epilogue
- Depends on: BL-060 (skeleton proven)
- Convert Hemingway from hardcoded to pool member. Build AUTHORS_POOL array. Random selection on first
  press. "Another Author 🎲" re-roll button. sessionStorage shuffle — no repeat until pool exhausted.
- Add McCarthy as second pool member to validate multi-author mechanics before full pool build.
- Delivers: the mechanics that make every subsequent author story trivially addable.
- CD3: UBV=7 TC=5 RR=6 → CoD=18, Dur=2, **CD3=9.0**
- Status: DONE — 2026-03-10. Pipeline GREEN 1388/1388. Committed with BL-060 (see git log).

### BL-062 — Author Epilogue: Cormac McCarthy
- Epic: Author Epilogue
- Depends on: BL-061 (pool mechanics)
- Voice: no punctuation, biblical register, dust, nihilism. Structural tell: the ball rolled. Everything
  was dust. The sun did not care. Wound: briefly attempts punctuation, gives up mid-summary.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-063 — Author Epilogue: J.R.R. Tolkien
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: mythic scope, Elvish, appendices, ancestral lineage. Structural tell: the appendix is longer
  than the summary. Wound: insists on naming the course in Elvish before describing any shots.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-064 — Author Epilogue: James Patterson
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: short chapters, everything DRAMATIC, pace pace pace. Structural tell: chapter numbers for
  every sentence. Wound: novel has 94 chapters. Closing: a cliffhanger about the 19th hole.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-065 — Author Epilogue: Terry Pratchett
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: footnotes, satire, truth disguised as comedy. Structural tell: *A FOOTNOTE ABOUT THE PHYSICS
  OF GOLF BALLS.* Death plays off scratch. Nobody will acknowledge this. Wound: the footnote is longer.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-066 — Author Epilogue: P.G. Wodehouse
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: Jeeves, gentle chaos, upper-class incompetence. Structural tell: Bertie wanders in uninvited.
  Wound: Bertie's handicap. It is not improving. Jeeves has opinions on this that he does not share.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-067 — Author Epilogue: Jane Austen
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: social comedy, manners, sly observation. Structural tell: "It is a truth universally
  acknowledged…" Wound: the club secretary's conduct. It has been noted. It will not be forgotten.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-068 — Author Epilogue: Hunter S. Thompson
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: gonzo, paranoid, political, drugs. Structural tell: "We were somewhere around the 7th hole
  when the drugs began to take hold." Wound: the caddie. The caddie was no longer human.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-069 — Author Epilogue: Raymond Chandler
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: hardboiled, noir, Los Angeles similes. Structural tell: the green was as smooth as a lie told
  by a man who'd told better ones. Wound: the woman watching from the clubhouse. She knows something.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-070 — Author Epilogue: Oscar Wilde (existing character — epilogue template)
- Epic: Author Epilogue
- Depends on: BL-061
- Existing panel character. Needs epilogue prompt template only (no new character file).
- Voice: every shot is an epigram. Suffering is merely bad taste. The ball knows it's being watched.
  Structural tell: the closing epigram is better than everything that preceded it. Wound: the rough.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-071 — Author Epilogue: Agatha Christie
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: suspects everywhere, the reveal, Poirot. Structural tell: Poirot has known since the 3rd hole.
  He merely waited for the confession. Wound: the alibi for the missed putt doesn't hold up.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-072 — Author Epilogue: J.K. Rowling
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: wizarding lens + extended commentary on themes. Structural tell: everyone is sorted into houses.
  Wound: the game is inadvertently problematic on several levels she would like to address at length.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-073 — Author Epilogue: Dan Brown
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: every sentence a cliffhanger, symbols, codes, the Vatican. Structural tell: the symbol on the
  scorecard was not a birdie. It was a warning. Wound: the caddie knew about the Priory of the Tee.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-074 — Author Epilogue: Enid Blyton (existing character — epilogue template)
- Epic: Author Epilogue
- Depends on: BL-061
- Existing panel character (Slightly Squiffy Blyton). Needs epilogue prompt template only.
- Voice: Famous Five adventure. The rough is a secret passage. Everyone is jolly or a villain.
  Has had a couple. Structural tell: there is a mystery. It involves the greenkeeper.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-075 — Author Epilogue: Isaac Asimov
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: rational, systematic, Three Laws applied. Structural tell: Three Laws of Golf. The caddie is
  a robot. It cannot harm a golfer except through incorrect club selection. Wound: the First Law fails.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-076 — Author Epilogue: Leo Tolstoy
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: vast, philosophical, suffering as meaning. Structural tell: one round = 600 pages of context.
  The birdie at the 7th is a microcosm of the human condition. Wound: the character on the bench.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-077 — Author Epilogue: Charlotte Brontë
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: gothic, moors, passion, unspoken feeling. Structural tell: the rough is the moors. Someone
  brooding is in the bunker. It begins to rain with intent. Wound: Mr Rochester. He is always there.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-078 — Author Epilogue: John le Carré
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: paranoid, espionage, nobody is who they say. Structural tell: everyone at the club is working
  for someone else. The caddie has a past. The scorecard was a message. Wound: the mole.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-079 — Author Epilogue: Wilbur Smith
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: adventure, vast scale, raw masculinity. Structural tell: impossible distances. Someone is
  hunting something. The game takes place across a continent. Wound: the lion on the 16th.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-080 — Author Epilogue: Jeffrey Archer
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: shameless, self-aggrandising, economical with truth. Structural tell: he had never lost a round
  of golf, he told himself. This was not entirely true. It was not true at all. Wound: the scoreboard.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-081 — Author Epilogue: Barbara Cartland
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: romance, heaving bosoms, pastel, eternal love. Structural tell: her heart fluttered as he
  approached the 18th hole. His grip was masterful. Wound: his handicap. It was seven. Irresistible.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-087 — Author Epilogue: Mark Twain
- Epic: Author Epilogue
- Depends on: BL-061 (pool mechanics)
- Voice: sardonic, aphoristic, American vernacular. Tall tales. Deadpan understatement.
  The Mississippi applied to golf. Structural tell: the parenthetical aside longer than the main
  sentence, which undercuts the premise entirely. Wound: being taken seriously as a humorist.
  He is the most serious man in the room. The comedy is an accident of observation.
  Closing register: a maxim that sounds invented but might not be. Probably is.
- "The reports of my eagle were greatly exaggerated."
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN — raised 2026-03-10

### BL-088 — Author Epilogue: Stephen King
- Epic: Author Epilogue
- Depends on: BL-061 (pool mechanics)
- Voice: horror, supernatural, Maine, specific dread. The detail that is too precise to be safe.
  Structural tell: the ordinary thing described until it becomes wrong. The golf course was fine.
  The golf course had always been fine. Something about the bunker on the 7th wasn't fine.
  Wound: the constant question of whether it is literary or genre. It is both. He is tired of this.
  Closing register: the thing you thought was resolved is still there. It is always still there.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN — raised 2026-03-10

### BL-089 — Author Epilogue: William Shakespeare
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: dramatic prose + embedded soliloquy. Stage directions. The aside. The epilogue becomes
  a short scene: "ACT V. The links. Enter [PLAYER], undone." Structural tell: the soliloquy
  arrives mid-summary and the player addresses the gallery directly. Wound: everyone quotes him
  wrong, and always the obvious ones. The good lines never get used. He has noted this.
  Closing register: "Exeunt all, pursued by a par five."
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN — raised 2026-03-10

### BL-090 — Author Epilogue: The Venerable Bede
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: ecclesiastical chronicle, Latin asides, the year of our Lord. "In the year of our Lord
  two thousand and eight, upon the links of Valhalla, there came a great calamity unto the
  captain." Structural tell: events recorded with monastic precision and complete moral gravity.
  Wound: the scribes. They keep abbreviating. The full account requires twelve volumes.
  Closing register: the illuminated manuscript note in the margin — barely legible, entirely correct.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN — raised 2026-03-10

### BL-091 — Author Epilogue: James Herbert
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: British horror, visceral, working-class dread. Very different register to King — more
  graphic, more urban, more Rats-in-the-rough. The rough isn't metaphorically dangerous.
  Structural tell: the ordinary thing described until something wrong is inside it.
  Wound: being grouped with King. He got there first, in several important respects.
  Closing register: whatever was in the bunker is still there.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN — raised 2026-03-10

### BL-092 — Author Epilogue: Jackie Collins
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: Hollywood glamour, Dynasty-era excess, big hair, power, money, erotic subtext applied
  to entirely wrong subjects. Structural tell: everyone is magnificently tanned. The grip is,
  frankly, erotic. The caddie has a past and a body. Wound: being called a guilty pleasure.
  She was a serious student of human ambition. The books were research.
  Closing register: the birdie was just the beginning.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN — raised 2026-03-10

### BL-093 — Self-Training: panel ratings disconnected from preference store
- Epic: Self-Training
- Bug. `logTurdRating()` writes to `session.turdRatings` (in-memory, lost on reload). The self-training
  preference store (`data.ratings`) is a separate persistent KV store. Panel thumbs-up/down clicks never
  reach the self-training store — so the "5 ratings required to operate" threshold can never be crossed
  from panel interactions alone. Only Workout section ratings reach `data.ratings`.
- Fix: route `logTurdRating` (or a new bridge function) to also write to the self-training persistent
  store so every rating in the app counts toward the threshold.
- CD3: UBV=7 TC=6 RR=5 → CoD=18, Dur=2, **CD3=9.0**
- Status: CLOSED — shipped 2026-03-10 (commit 615f19a)

### BL-094 — Self-Training: rating buttons missing from most panel outputs
- Epic: Self-Training
- Companion to BL-093. Rating buttons (👍 / 👎 / 😐 etc.) only appear in the Comedy Workout section.
  They are absent from panel output areas: Golf Commentary, Football Moment, Darts, Heckler outputs,
  Oracle, etc. The self-training model needs ratings from all outputs to build a meaningful preference
  profile. Without button coverage, users cannot rate even if the storage bug (BL-093) is fixed.
- Fix: audit all panel output areas; add rating row (at minimum thumbs up/down) post-output in each.
  Three Amigos needed: decide rating UI pattern before implementation to ensure consistency.
- Feature: platform
- CD3: UBV=7 TC=3 RR=4 → CoD=14, Dur=4, **CD3=3.5**
- Status: OPEN — raised 2026-03-10. BL-093 shipped 2026-03-10 — no longer blocked.

### BL-095 — The Literary Roast Room: authors roast any book / comic / magazine title you enter
- Epic: Author Epilogue
- Depends on: BL-061 (pool mechanics). Related to BL-059 (Writing Room).
- Input: any book name, comic, magazine (user-entered freetext). Output: randomly selected author
  from pool writes a roast/critique of the title in their distinctive voice. Comedy is in the
  collision — McCarthy on Hello magazine. Hemingway on Harry Potter. Wodehouse on GQ.
- Differs from BL-059 (Writing Room): roast is reactive (targets user input), not a panel conversation.
  Panel panel: single author, single roast. Extendable to multi-author round-robin.
- Natural home: Comedy Room tab (alongside Heckler, Oracle, Writing Room).
- CD3: UBV=8 TC=5 RR=5 → CoD=18, Dur=3, **CD3=6.0**
- Status: CLOSED — shipped 2026-03-10 (commit db88416)

### BL-082 — Author Epilogue: Phase 2 — Football Moment integration
- Epic: Author Epilogue
- Depends on: BL-060 + BL-061 (Phase 1 proven); blocked until Phase 1 complete
- Trigger Author Epilogue from Football Moment end state. Same pool, different context prompt.
- SPIDR-D: extending data scope from Golf Adventure to Football.
- Feature: comedy-room
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN — blocked on BL-060/061

### BL-083 — Author Epilogue: Phase 2 — Darts integration
- Epic: Author Epilogue
- Depends on: BL-082
- Feature: comedy-room
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN — blocked on BL-082

### BL-084 — Author Epilogue: Phase 2 — Cricket Long Room integration
- Epic: Author Epilogue
- Depends on: BL-082
- Feature: comedy-room
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN — blocked on BL-082

### BL-085 — Author Epilogue: Phase 2 — Oracle conversation integration
- Epic: Author Epilogue
- Depends on: BL-082; Oracle must have a session narrative to summarise
- Feature: comedy-room
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN — blocked on BL-082

### BL-086 — Author Epilogue: Phase 2 — Boardroom session integration
- Epic: Author Epilogue
- Depends on: BL-082
- Feature: comedy-room
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN — blocked on BL-082

### BL-058 — The Author's Epilogue: post-game prose summary by random literary voice
- Epic: Author Epilogue
- At the end of any sports game (Golf Adventure, Football Moment, Darts, Cricket — and potentially other outputs like Oracle conversation), a randomly selected author from the pool is summoned to write a short prose summary of events in their inimitable style. 3–5 paragraphs. The comedy is in the collision between the literary register and the subject matter.
- Trigger point: end of game (after final score / Oracle verdict / etc). Button: "The Author's Account 📖" — opt-in, one press, one author.
- Selection: random from pool each press. No repeat until pool exhausted (sessionStorage shuffle).
- Output length: 250–400 words. Enough to establish the voice. Not so long it becomes a bit.
- See notes file to be created: notes/2026-03-10-author-epilogue.md

**Author pool — existing characters (already have voice/profile):**
| Author | Panel name | Register |
|---|---|---|
| Enid Blyton | Slightly Squiffy Blyton | Famous Five adventure. The rough is a secret passage. Everyone is jolly or villainous. |
| Oscar Wilde | Wildest of Oscars | Every shot is an epigram. Suffering is merely bad taste. The ball knows it's being watched. |

**Author pool — new characters needed:**
| Author | Register | The comedy |
|---|---|---|
| Leo Tolstoy | Vast, philosophical, suffering as purpose | War and golf. The birdie at the 7th is a microcosm of the human condition. 600 pages of one round. |
| Isaac Asimov | Rational, systematic, Three Laws applied | Three Laws of Golf. The caddie is a robot who cannot harm a golfer except through poor club selection. |
| J.R.R. Tolkien | Mythic, Elvish, appendices, ancestral lineage | The course is named in Elvish. One chip shot has three pages of backstory. There is an appendix. |
| Charlotte Brontë | Gothic, moors, passion, Mr Rochester | The rough is the moors. Someone brooding is in the bunker. It begins to rain meaningfully. |
| Jane Austen | Social comedy, manners, sly observation | "It is a truth universally acknowledged that a golfer in possession of a good handicap must be in want of a birdie." |
| John le Carré | Paranoid, espionage, nobody is who they say | Everyone at the club is a spy. The caddie has a past. The scorecard was a message. |
| Wilbur Smith | Adventure, vast scale, raw masculinity | Impossible distances. Someone is hunting something. The game takes place across a continent. |
| James Patterson | Short chapters, everything DRAMATIC | Chapter 1. He lined up the putt. Chapter 2. He missed. Chapter 3. "Damn," he said. Chapter 47. |
| J.K. Rowling | Wizarding lens + extended author commentary | The course is Hogwarts. Everyone is sorted. The game is inadvertently problematic on several levels she would like to address. |
| Cormac McCarthy | No punctuation, biblical, dust, nihilism | No quotation marks. The ball rolled. Everything was dust. The sun did not care. |
| Raymond Chandler | Hardboiled, noir, Los Angeles similes | The green was as smooth as a lie told by a man who'd told better ones. He putted. |
| Ernest Hemingway | Short sentences, iceberg, masculine stoicism | He putted. He missed. The sun was hot. Tomorrow he would try again. It would be the same sun. |
| Agatha Christie | Suspects everywhere, the reveal, Poirot | Everyone in the clubhouse is a suspect. Poirot examines the divot. He already knows. |
| Terry Pratchett | Footnotes, Death plays too, satire, truth | *A FOOTNOTE ABOUT THE PHYSICS OF GOLF.* Death plays. He is annoyingly consistent off scratch. |
| Dan Brown | Every sentence a cliffhanger, symbols, codes | The symbol on the scorecard was not a birdie. It was a warning. |
| P.G. Wodehouse | Jeeves, gentle chaos, upper-class incompetence | Bertie Wooster is hopeless at golf. Jeeves, however, is not. The situation deteriorates pleasantly. |
| Hunter S. Thompson | Gonzo, paranoid, political, drugs, Las Vegas | We were somewhere around the 7th hole when the drugs began to take hold. |
| Jeffrey Archer | Shameless, self-aggrandising, economical with truth | He had never lost a round of golf, he told himself. This was not entirely true. It was not true at all. |
| Barbara Cartland | Heaving bosoms, romance, pastel | Her heart fluttered as he approached the 18th hole. His grip was masterful. His handicap even more so. |

- **Phase 1:** Golf Adventure (natural end point, score exists, narrative arc exists)
- **Phase 2:** Football Moment, Darts, Cricket
- **Phase 3:** Oracle conversation, Boardroom session — any output with a narrative arc
- Needs: author character files (docs/characters-authors.md), prompt templates per voice, UI button wiring
- CD3: UBV=8 TC=2 RR=1 → CoD=11, Dur=6, **CD3=1.83**
- Status: CLOSED — 2026-03-10. BL-061 shipped. Walking skeleton (BL-060) + pool mechanics (BL-061) both done. Delivery continues via BL-062 onward.

### BL-051 — Distribution: make Cusslab discoverable + installable
- Currently: direct URL only. No SEO, no install, no organic reach.
- **Phase 1 (low cost):** Real domain (cusslab.co.uk or similar), `<title>` + meta description per page, og:image for sharing. Makes it indexable and shareable.
- **Phase 2 (moderate cost):** PWA — manifest.json + service worker. iOS/Android "Add to Home Screen" install, offline caching. Feels native, no App Store needed.
- **Phase 3 (high cost, validate demand first):** Native app store wrapper (Capacitor/React Native). Only justified if Phase 1+2 prove audience exists.
- Recommend: discuss Phase 1 first — it costs almost nothing and unblocks organic discovery before Phase 2.
- Feature: platform
- CD3: UBV=8 TC=3 RR=2 → CoD=13, Dur=4, **CD3=3.25**
- Status: OPEN — design discussion needed before any implementation

### BL-057 — Homepage quotes: Colemanballs and real sporting gaffes pool
- Epic: Brand Polish
- Add a dedicated pool of real Colemanballs-style quotes (David Coleman, Ron Atkinson, Murray Walker, Des Lynam, Peter Alliss, John Motson, Barry Davies) plus genuine sporting howlers attributed to real people with caveats. These sit alongside the character pool or form their own rotation. Could also add famous non-sporting foot-in-mouth quotes (Ratner, Prescott, etc.).
- Feature: platform
- CD3: UBV=4 TC=1 RR=1 → CoD=6, Dur=3, **CD3=2.0**
- Status: OPEN — logged 2026-03-10, no implementation scope yet

### BL-056 — Homepage quotes: Yogi Berra pool
- Epic: Brand Polish
- Yogi Berra quotes are canonical for this app: absurd, profound, accidentally correct. Add ~8-10 to CONSULTANT_SLOGANS attributed to Yogi Berra with appropriate caveats. ("I never said most of the things I said" makes the caveat self-referential.) Interleave with existing pool.
- CD3: UBV=4 TC=1 RR=1 → CoD=6, Dur=1, **CD3=6.0**
- Status: CLOSED — done 2026-03-10

### BL-055 — Homepage quotes: attribution strategy rethink
- Epic: Brand Polish
- Remove "Heckler on X" and "— Heckler" attribution entirely. Room-voice lines stay anonymous (the room has a voice). Character-voiced quotes keep attribution to the character + caveat. Panel-description quotes ("sitting on a bench since 1973") get the character name baked into the quote body. Interleave pool so attributed and unattributed quotes alternate rather than running in blocks.
- CD3: UBV=3 TC=1 RR=1 → CoD=5, Dur=2, **CD3=2.5**
- Status: CLOSED — done 2026-03-10

### BL-054 — Expert Evolution engine: apply to sports panels, build toward panel-agnostic independent engine
- Current Expert Evolution feature applied to one context. Apply the same mechanic to Sports panels (golf, football, darts) for different attributes (technique evolution, tactical thinking, commentary style over career arc).
- Longer-term goal: extract into a standalone panel-agnostic engine that can model attribute evolution for any character across any panel, industry, or domain.
- Needs scoping conversation before CD3 can be scored properly.
- Feature: platform
- CD3: TBD — scoping required
- Status: OPEN — logged only, no implementation scope yet

### BL-053 — House Name Oracle — Comedy Room Mode 2 (postcode → research → Phil/Kirstie/Dion → house names)
- Epic: House Name Oracle
- New Comedy Room mode. Input: UK/Irish outward code + mandatory OracleVoice archetype (Elegist/Rogue/DarkOracle/Booster/Snob/Anarchist/Mystic/Local). Oracle researches the location (topography, history, IMD, famous people, wrong attribution, political stance, proximity). Phil Spencer, Kirstie Allsopp, Dion Dublin have a conversation about the research and converge (or don't) on a name. Output: three house names in three registers (Dignified/Knowing/Unhinged) each with Oracle rationale.
- See notes/2026-03-10-house-name-oracle.md for full design spec.
- CD3: UBV=8 TC=2 RR=1 → CoD=11, Dur=8, **CD3=1.375**
- Status: CLOSED — 2026-03-11: implementation already complete; 28/28 Gherkin green. Backlog status lagged.

### BL-052 — Homepage quotes: random character attribution + uncertainty disclaimer
- Epic: Brand Polish
- Quotes displayed at the top of the app should reference cusslab characters randomly. Each quote attributed to a character followed by a disclaimer in parentheses: (possibly) / (probably) / (yeah....maybe) / (almost certainly) / (according to them) etc. Rotates on load.
- Feature: platform
- CD3: UBV=3 TC=1 RR=1 → CoD=5, Dur=2, **CD3=2.5**
- Status: OPEN

### BL-050 — Golf Adventure: 2008 Ryder Cup Valhalla (Faldo's disaster)
- Epic: Ryder Cup Rollout
- Faldo's catastrophic captaincy. USA win 16½–11½. Sandwich gate, botched opening ceremony introductions (potato joke for Harrington, confused McDowell's nationality, called Hansen "Stenson"), bottom-loaded singles order, Azinger outmanoeuvred him tactically. Players: Faldo (captain/protagonist — plays as an actual character), Poulter (emotional engine of the European team despite the captaincy). Sky/NBC.
- Feature: golf-adventure
- CD3: UBV=7 TC=3 RR=1 → CoD=11, Dur=4, **CD3=2.8**
- Status: OPEN

### BL-033 — Golf Adventure: Tournament picker decade-panel UI
- Scope: Golf Adventure tournament picker only — the main panel list grows unwieldy as BL-031/032 land
- Replace flat tournament list with collapsible decade sections within Golf Adventure: 1970s, 1980s, 1990s, 2000s, 2010s + Ryder Cup (separate always-visible section, outside decades)
- Most recent decade open by default; others collapsed
- Each decade header shows era label + count e.g. "2000s (3)"
- Era styling on decade headers mirrors tournament era classes (Ceefax for 80s, NBC/Sky for 2000s+)
- Don't show decade header if count < 2 — list those solo tournaments flat
- No cross-panel scope (Football Moment / Long Room unaffected — revisit separately if needed)
- Prerequisite: at least one BL-031 tournament shipped so the volume justifies the change
- CD3: UBV=7 TC=4 RR=3 → CoD=14, Dur=3, **CD3=4.7**
- Status: CLOSED — 2026-03-09 (71b2bf5). buildSetup() refactored with makeTCard() helper + decadeMap grouping. Newest decade open by default, toggle on header click. Ryder Cup flat separate section.

### BL-001 — Wayne Riley / Radar content merge
- Claude.ai session has full Wayne Riley/Radar explanation not yet in repo
- Target file: `docs/characters-sports.md`
- Also: additional extended pools and needle definitions
- CD3: UBV=6 TC=3 RR=2 → CoD=11, Dur=2, **CD3=5.5**
- Status: CLOSED — characters/radar.md exists (139 lines, 2026-03-06); characters/roe.md also present. Content is in repo. Original concern was Claude.ai session context not persisted — resolved by character file system.

### BL-007 — Claude Code Windows install bugs (follow-up)
- "Class not registered" blocks git.exe picker + hidden file access
- CLAUDE_CODE_GIT_BASH_PATH env var ignored on restart
- **Investigated 2026-03-09 (v2.1.71 — current latest):**
  - Bug 1 ("Class not registered"): not tracked in anthropics/claude-code. No documented fix. May be
    resolved by workaround for Bug 2 (system32 in PATH). No action needed unless it resurfaces.
  - Bug 2 (CLAUDE_CODE_GIT_BASH_PATH ignored): confirmed open, 5+ months, issues #8674 and #27912.
    Root cause: `SD6()` in extension.js calls `spawnSync('where.exe', ['git'])` without `shell:true` —
    fails silently before env var is ever checked.
  - **Best workaround (durable):** Add `C:\Windows\System32` to Windows system PATH so `where.exe`
    resolves. Alternatively: set `CLAUDE_CODE_GIT_BASH_PATH` as a Windows system env var (not user,
    not VS Code settings). Using Claude Code CLI in WSL directly avoids the issue entirely.
  - No fix shipped; neither issue has a committed fix or milestone.
- CD3: UBV=4 TC=3 RR=3 → CoD=10, Dur=2, **CD3=5.0**
- Status: OPEN — no upstream fix; workarounds documented above. Revisit when fix ships.

### BL-009 — Mode 2 moment type expansion (Football, Golf, LongRoom)
- More named moment examples in the selector per panel
- Football: manager touchline, injury sub, captain decision, controversial tackle
- Golf: flagstick controversy, slow play warning, eagle putt, 18th ceremony
- LongRoom: DRS review, lunch interval, century milestone
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=4, **CD3=2.0**
- Status: CLOSED — 2026-03-10 (d4023e5): 8 new options across 3 panels; 1335/1335 Gherkin green

### BL-002 — Food pool expansion (all characters)
- Same references repeating — pool too small
- Design: three orthogonal axes: Food type / Location / Context+person
- Applies to ALL characters
- CD3: UBV=7 TC=2 RR=1 → CoD=10, Dur=5, **CD3=2.0**
- Status: CLOSED — 2026-03-10 (2887de2): FOOD_TERMS tripled across 3 axes; Faldo Ginsters adjective/garage-location variation rules added; general adjective/adverb variety principle added

### BL-003 — Hypochondria pool expansion (all characters)
- Pool types: real ailments exaggerated, fictional, borrowed, sport-specific
- Each character has own flavour (Radar: dramatic/Australian; Faldo: biomechanical)
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=4, **CD3=2.25**
- Status: CLOSED — 2026-03-10 (2887de2): HYPO_BASE 11→42 entries across 4 pools; all entries panel-agnostic

### BL-100 — Sports panels: add suggestion cards to Football, Darts, Cricket, Long Room (Q&A mode)
- Feature parity gap: Golf (19th Hole Q&A mode) has scrollable suggestion cards; Football / Darts / Cricket / Long Room (Q&A modes) do not.
- Rod-caught during exploratory test 2026-03-10 (WL-105).
- Fix: port `.gf-suggestion-card` mechanic and shuffle logic to each sports panel. Each panel needs its own question pool appropriate to domain (football punditry questions, darts commentary, cricket Long Room prompts).
- CSS classes: reuse existing `.gf-suggestion-card` styles or alias. Logic: one `buildSuggestionTray()` call per panel on page load / mode switch.
- Three Amigos needed: agree whether to reuse existing question data, create panel-specific pools, or pull from a shared suggestions data file.
- CD3: UBV=7 TC=5 RR=3 → CoD=15, Dur=2, **CD3=7.5**
- Status: CLOSED — 2026-03-10 (7c829be). FB/DT/LR suggestion trays added. Shared buildSuggestions() extracted. 14 Gherkin scenarios green.

### BL-099 — Comedy Room: promote sub-features to top-level nav items
- House Name Oracle, The Roast Room, and The Writing Room are currently nested as sub-tabs inside the Comedy Room panel.
- DDD boundary violation: each is a distinct domain concept with its own input, output, and user journey (WL-104). They should have their own `<div class="panel">` and their own nav items in the COMEDY ROOM nav group — same pattern as 19TH HOLE group containing Football / Golf / Darts / Cricket / Souness's Cat.
- Comedy Room panel reverts to single-purpose: "Into The Room" (the core comedy panel).
- Comedy Room nav group expands: The Comedy Room / The House Name Oracle / The Roast Room / The Writing Room (4 items, count=4).
- Each promoted panel: own panel div, own panel-title + panel-desc, nav entry in ni-comedy.
- Process fix accompanying this: add DDD boundary check to Three Amigos prompt in bdd.md ("does this feature have its own bounded context? If yes → new panel, not a sub-tab").
- Three Amigos needed before implementation: agree panel titles, desc copy, and nav copy for each.
- CD3: UBV=8 TC=7 RR=5 → CoD=20, Dur=4, **CD3=5.0**
- Status: CLOSED — 04ddea4, 2026-03-10. Comedy Room mode tabs removed; Oracle/Roast/Writing promoted to standalone panels; Souness's Cat moved to Comedy Room; Quntum Leeks moved to Little Misadventure. bdd.md process fix deferred (BL-110).

### BL-101 — Golf panel: recycle and expand suggestion card question pool
- Current golf suggestion cards draw from a fixed pool. Rod flagged it as needing expansion and recycling (2026-03-10).
- Fix: expand the pool with new questions across all existing categories (golf, big, contemporary, absurd). Implement a session-shuffle so the same cards don't appear in the same order every visit.
- Can combine with BL-100 work on suggestion card infrastructure.
- CD3: UBV=5 TC=3 RR=2 → CoD=10, Dur=2, **CD3=5.0**
- Status: CLOSED — 2026-03-10. GOLF_SUGGESTIONS expanded 15→26 items (9 golf, 6 big, 5 contemporary, 5 absurd). Shuffle mechanic already in place.

### BL-102 — Feature activity report: label WL/BL entries by feature; add to close protocol
- Rod identified (2026-03-10) that per-feature development stats are not available. WL and BL entries have no feature label, so "how much work has gone into Golf Adventure vs Comedy Room vs Sports" is unanswerable from the data.
- Phase 1: Add `Feature:` field to WL and BL schema. Canonical labels: `golf-adventure`, `comedy-room`, `sports-19th-hole`, `darts`, `cricket`, `quntum-leeks`, `boardroom`, `play`, `learn`, `platform`.
- Phase 2: Backfill `Feature:` on all open WL items and BL items (last 20 closed BL items minimum).
- Phase 3: Script in `.claude/scripts/feature-report.sh` — reads backlog.md and waste-log.md, counts by feature label. Outputs: open BL per feature, closed BL per feature, WL entries per feature (overall + last session). Two sections: ALL TIME and LATEST SESSION.
- Phase 4: Add to session-closedown.md step — run `feature-report.sh` and include output in session summary.
- Feature: process
- CD3: UBV=6 TC=4 RR=5 → CoD=15, Dur=3, **CD3=5.0**
- Status: OPEN — raised 2026-03-10

### BL-103 — Faldo character: add Sandwich Gate wound to canonical character file
- Sandwich Gate (2008 Ryder Cup) is the primary wound for Nick Faldo (`docs/characters-sports.md:181`) but is absent from `characters/faldo.md`. The canonical file has childhood cheese-and-pickle mechanic but not the Valhalla/pairings-note incident.
- Full wound from docs: Faldo shows handwritten pairing note (11 of 12 players) to Stenson during practice round; photographer catches it; press conference claim it's "who wants tuna, who wants the beef, who wants the ham"; Europe loses 16½–11½; Poulter's autobiography quote; McGinley captaincy comparison. Trigger words in `docs/characters-sports.md:87`: tuna / beef / ham (+8 — sandwich gate wound fires).
- Fix: copy Sandwich Gate wound section from docs into `characters/faldo.md` under Wounds block. Cross-reference `docs/needles-and-conflicts.md` for Sandwich Needle trigger mechanic.
- WL-106 raised.
- CD3: UBV=6 TC=4 RR=3 → CoD=13, Dur=1, **CD3=13.0**
- Status: CLOSED — 2026-03-10. Sandwich Gate wound added to characters/faldo.md: P1 (third wound, full incident + trigger words), P6 (trigger mechanic + cross-panel needles), P7 (Poulter and Garcia standing conflicts added).

### BL-104 — Sun Tzu Pub Navigator: Mode A spike (voice validation)
- Epic: Sun Tzu Pub Navigator
- User presented with a fixed menu of 5 pub situations. Sun Tzu responds: principle → application → warning.
- Purpose: validate that Sun Tzu's voice is funny before building anything else. Single advisor, no hardmen panel.
- Spike: if the voice lands, proceed to Mode B. If not, don't. BL-105 (hardmen panel) and BL-110 (scene library) are blocked until this validates.
- Design notes: notes/2026-03-10-sun-tzu-pub-navigator.md
- CD3: UBV=8 TC=8 RR=7 → CoD=23, Dur=2, **CD3=11.5**
- Status: CLOSED — 2026-03-10. 205a606. 5 situations, buildPubAdvicePrompt(), PubNavigator IIFE, LITTLE MISADVENTURE nav group. 1423/1423 Gherkin, 654/654 units.

### BL-105 — Hardmen reaction panel (Roy Keane, Vinny Jones, Nostradamus)
- Epic: Sun Tzu Pub Navigator
- Second hypothesis, post-Mode A. Roy Keane and Vinny Jones react to pub situations alongside Nostradamus.
- Depends on: BL-104 (Mode A validates the format). Do not build before Mode A is confirmed working.
- Character files: characters/roy-keane.md, characters/vinny-jones.md (written, pending commit)
- Feature: pub-navigator
- CD3: UBV=7 TC=5 RR=3 → CoD=15, Dur=2, **CD3=7.5**
- Status: CLOSED — b7ca2dc, 2026-03-12. Panel live in Little Misadventure (count 4→5). Keane 3-sentence assessment → Vinny sorts it (sees Keane) → Nostradamus 5-movement confirmation (sees both). Sequential API calls with prior context.

### BL-106 — Sun Tzu general advisory mode (post-pub validation)
- Epic: Sun Tzu Pub Navigator
- After pub context proven: Sun Tzu answers any question (not just pub situations). Principle → application → warning applied universally.
- Depends on: BL-104 (voice validated in pub context first)
- Feature: pub-navigator
- CD3: UBV=6 TC=3 RR=2 → CoD=11, Dur=2, **CD3=5.5**
- Status: CLOSED — 2026-03-12. Free-text panel `panel-suntzu`, `SunTzuAdvisory` IIFE, `buildSunTzuAdvisoryPrompt()`, submit gated on non-empty input. Little Misadventure nav count 5→6. 7/7 Gherkin GREEN.

### BL-107 — Nostradamus character spec: juxtaposition mechanic with Sun Tzu
- Epic: Sun Tzu Pub Navigator
- Nostradamus character file written in Claude.ai session (pending commit to characters/).
- Juxtaposition: Sun Tzu acts before the event; Nostradamus claims to have predicted it. Nostradamus is useless hindsight voiced with complete prophetic confidence.
- Design detail in notes/2026-03-10-sun-tzu-pub-navigator.md; Nostradamus also doubles in hardmen panel (BL-105).
- CD3: UBV=5 TC=4 RR=2 → CoD=11, Dur=1, **CD3=11.0**
- Status: CLOSED — 2026-03-11: characters/nostradamus.md fully written; juxtaposition mechanic with Sun Tzu codified (Sun Tzu acts before, Nostradamus confirms after); epistemological argument; five-movement response structure; three wounds; all four advisor relationships; hardmen panel dynamics with Keane/Vinny; scene-specific notes (Scotia Bar, Horseshoe, Oktoberfest); opener variety including rare "I know" opener; hard rules.

### BL-108 — Bruce Lee character spec: fifth advisor candidate
- Epic: Sun Tzu Pub Navigator
- Modern Sun Tzu — physical/philosophical, may join or replace one of the quartet.
- Not yet written. Needs spec session before any implementation.
- Depends on: BL-104 (Mode A validated — do we need a fifth?)
- Feature: pub-navigator
- CD3: UBV=5 TC=3 RR=2 → CoD=10, Dur=2, **CD3=5.0**
- Status: CLOSED — 2026-03-11 (e47daf4). characters/bruce-lee.md: Kato wound, DEAD_IN_PANEL_WORLD, Be Water mechanic, Sun Tzu/Chuck/Nostradamus/Buddha relationships, full advisor spec for pub navigator fifth seat.

### BL-109 — FF shared engine extraction (Quntum Leeks + Golf Adventure → shared module)
- Epic: Sun Tzu Pub Navigator
- Architectural prerequisite for Mode B. Quntum Leeks and Golf Adventure both implement FF-style scene state, choice trees, pressure accumulation. Extract to shared module before Mode B builds a third copy.
- All three games (Pub Navigator, Quntum Leeks, Golf Adventure) use the shared engine post-extraction.
- Must complete before BL-110 (Mode B scene library implementation).
- CD3: UBV=5 TC=7 RR=9 → CoD=21, Dur=4, **CD3=5.25**
- Status: CLOSED — 2026-03-10. 2ae8a43. src/logic/ff-engine.js: initGameState, appendToHistory, incrementTurn, buildModifierBlock. 9 Gherkin scenarios, 15 unit tests. 669/669 units GREEN.

### BL-110 — Mode B scene library: Gherkin spec per location (8 scenes)
- Epic: Sun Tzu Pub Navigator
- Eight pub scenes ratified. Full environment spec (scene state, choice trees, escalation triggers, lederhosen flag) per location. Gherkin before any implementation.
- Scenes: Rising Sun Basingstoke / Scotia Bar Glasgow / Horseshoe Bar Glasgow / Drunken Duck Lake District / Slug & Lettuce Canary Wharf / Dave's Bar Marbella / McSorley's NYC / Hofbräu Oktoberfest
- See full scene brief in notes/2026-03-10-sun-tzu-pub-navigator.md
- Depends on: BL-109 (shared engine extracted first)
- CD3: UBV=8 TC=4 RR=3 → CoD=15, Dur=6, **CD3=2.5**
- Status: CLOSED — 2026-03-10. f8cf3a1. Full Mode B delivered: 8 scenes, engine, advisors, pressure/outcomes, lederhosen, UI. 24 Gherkin scenarios, 707/707 units. Live on GitHub Pages.

### BL-111 — Lederhosen state: persistent flag mechanic, cross-scene item system
- Epic: Sun Tzu Pub Navigator
- Persistent cross-scene item: triggers at pressure threshold in Oktoberfest scene, persists to subsequent scenes (McSorley's barman: three-second stare, "Light or dark", no other comment).
- Player discovers it gradually then all at once. Each advisor reacts differently (design in notes/2026-03-10-sun-tzu-pub-navigator.md).
- Requires cross-scene state persistence — architectural question for Three Amigos.
- Depends on: BL-109 (shared engine), BL-110 (scene library)
- Feature: pub-navigator
- CD3: UBV=8 TC=3 RR=4 → CoD=15, Dur=3, **CD3=5.0**
- Status: PARTIALLY CLOSED — 2026-03-10. Lederhosen flag delivered in BL-110 (Oktoberfest pressure threshold + universal easter egg "wear/put on lederhosen"). Cross-scene persistence (McSorley's reaction etc.) and per-advisor lederhosen reactions are the remaining scope — see BL-113.

### BL-112 — Ryder Cup: 5-session structure, team score tracking, user match in totals
- Epic: Golf Misadventure
- Restructure Ryder Cup from 3 days to 5 sessions: Day 1 Morning (Foursomes), Day 1 Afternoon (Fourballs), Day 2 Morning (Fourballs), Day 2 Afternoon (Foursomes), Day 3 Singles.
- Fix WL-109: user's own match counted in EUR/USA team totals at session end.
- Fix WL-110: getMatchPlayCommentary error shows "Commentary signal lost" not blank.
- Add sessionLabels, addSessionToTeamScore, buildRestScreenData to MatchPlayService.
- Rename matchPlayDays → matchPlaySessions (5 entries per player; Day 2 data added to all 4 Ryder Cup tournaments).
- Running team score in HUD. ABSENT sessions show "You are resting" + session results.
- Gherkin approved 2026-03-10.
- CD3: UBV=7 TC=2 RR=3 → CoD=12, Dur=4, **CD3=3.0**
- Status: DONE 2026-03-10

### BL-113 — Unexpected outfit mechanic: generalised cross-scene item discovery
- Epic: Sun Tzu Pub Navigator
- Generalise lederhosen into a reusable "unexpected outfit" pattern. Like Sam Beckett in Quantum Leap — you realise gradually, then all at once, that you are wearing something. The discovery is the comedy, not the wearing.
- Pool of outfits: lederhosen, a party dress (if you're a big burly bloke), pyjamas, 70s-style tight football shorts, a referee kit, a full Santa suit (seasonal), a wedding dress (unspecified whose), a hazmat suit.
- Discovery mechanic: player doesn't know they're wearing it until the engine reveals it. Triggered by: scene-specific pressure threshold, time-in-scene, or a choice that implies movement/mirror/other character's reaction.
- Advisor reactions are outfit-specific (not generic). Nostradamus: has a quatrain specifically about this. Chuck Norris: also wearing one, doesn't see the problem. Buddha: where were you when the outfit went on? Sun Tzu: noted it. Already incorporated. Moved on.
- Lederhosen (existing) becomes one instance of this pattern.
- Requires: Three Amigos to agree outfit pool, discovery triggers, per-advisor reaction templates. Design in notes before any Gherkin.
- Depends on: BL-110 (pub crawl must exist), BL-111 partial (lederhosen already live as prototype)
- Feature: pub-navigator
- CD3: UBV=8 TC=3 RR=4 → CoD=15, Dur=3, **CD3=5.0**
- Status: OPEN — raised 2026-03-10

### BL-117 — Home page: replace Golf Adventure default with feature discovery page
- **Problem:** App opens on Golf Adventure. Users assume the app IS Golf Adventure. The hamburger nav (3 lines, top-left) is not discoverable. Users miss 30+ features.
- **Proposed solution:** Replace Golf Adventure as the landing page with a feature discovery page — all panels shown as tiles, each tile expandable to show sub-features. Clicking a tile opens the panel directly.
- **Rod's spec:** Tiles showing all panels. Click tile → open panel (or expand to show sub-features). More prominent than the 3-line hamburger.
- **Three Amigos required before any implementation.** Key questions: tile layout, sub-feature expand mechanic, what constitutes a "tile" (group vs individual panel), search/browse hybrid, mobile vs desktop.
- Feature: platform
- CD3: UBV=9 TC=8 RR=5 → CoD=22, Dur=5, **CD3=4.4**
- Status: CLOSED — commit 30517a9, 2026-03-12. 6 Gherkin scenarios passing. Mobile-first tile grid, 5 tiles, data-tile-name/desc attributes, switchTab null guard, App.init defaults to home.

### BL-118 — Pipeline: runtime browser test for external-script window globals
- Root cause of WL-124 (PubCrawl broken 6+ sessions): external scripts (ff-engine.js, pub-crawl-scenes.js, pub-navigator-engine.js) set window globals that unit tests and browser-sim cannot detect as missing. If any external script throws, window.PubNavigatorEngine is never set — pipeline stays GREEN while the feature is broken in production.
- Fix: add a pipeline check that loads index.html in a real browser context (jsdom + script execution, or playwright) and asserts that all expected window globals are set after page load: window.PubNavigatorEngine, window.PubCrawlScenes, window.FFEngine, window.QuntumLeeksEngine, etc.
- Minimum viable: extend browser-sim to inject the external script content and verify the window globals. Playwright (headless browser) is the robust option.
- Three Amigos needed: agree scope (which globals, jsdom vs playwright, CI vs local-only), then Gherkin.
- Feature: process
- CD3: UBV=7 TC=8 RR=9 → CoD=24, Dur=4, **CD3=6.0**
- Status: CLOSED — Node vm.createContext approach (zero new deps). 5 Gherkin scenarios, external-globals.feature. Executes all 5 external scripts in dependency order, asserts QuntumLeeksEngine, FFEngine, PubCrawlScenes, PubNavigatorEngine. Pipeline green (2026-03-12 session 7).

### BL-116 — Premise Interrogation feature: scientist/philosopher panel for premise validation
- New panel (or mode within Premise Engine) where scientist/philosopher characters interrogate a submitted premise using their natural framework
- Characters: Prof Cox (falsifiability + cosmic scale), Douglas Adams (inversion + Occam), Feynman (find the real variable + Five Whys), + 1 more TBD (Carl Sagan or Voss)
- **Feature shape confirmed (2026-03-11):**
  - Two modes, one panel, one premise input drives both
  - Mode 1: user selects frameworks; each produces a distinct output block
  - Mode 2: all four characters (Cox, Adams, Feynman, Russell) always run; characters interact strongly with each other (see previous responses, react/contradict/build — like Souness's Cat relationship dynamics)
  - Architecture flexible: character list will grow; select-up-to-6 pattern (like other panels) once more characters added
  - Framework calls: one API call per selected framework, sequential (cleaner focused output)
  - Panel placement: under Boardroom section, alongside "Present to the Board"
- Framework mapping: each character maps to 1-2 of the validated frameworks from research (Socratic, De Bono, Popper, Kahneman, Voss, Made to Stick, Cialdini etc.)
- Depends on BL-115 (character specs) being done first
- Feature: boardroom
- CD3: UBV=7 TC=5 RR=3 → CoD=15, Dur=5, **CD3=3.0**
- Status: CLOSED — commit f8a8e7b (2026-03-11). Full implementation: 10 frameworks (Mode 1), 4-character panel Cox/Adams/Feynman/Russell with sequential context (Mode 2). CANONICAL_CHARS, PI_FRAMEWORK_CONFIGS, PI_PANEL_MEMBERS all live. All non-@claude Gherkin passing.

### BL-115 — Deep character specs: Prof Cox and Douglas Adams (Souness's Cat depth)
- Both characters exist in the codebase but at insufficient depth for premise interrogation or any new panel role
- Cox: has timescales/equations/D:Ream wound but lacks inter-character relationships and wound treatment at Souness's Cat quality
- Adams: Bills panel prompt is decent but shallow — no wound, no relationship dynamics, no opener variety
- Deliverable: two canonical character spec objects (wound, worldview, method, relationships, opener variety) that can be dropped into any panel — BL-116, Souness's Cat extension, or standalone
- Feature: process
- CD3: UBV=6 TC=6 RR=3 → CoD=15, Dur=2, **CD3=7.5**
- Status: CLOSED — 2026-03-11 (8df9574). characters/adams.md created (full spec: Salmon of Doubt wound, DEAD_IN_PANEL_WORLD, Occam inversion, subordinate clause method, opener variety, escalation arc, bullshit protocol, all panel relationships). characters/cox.md → v2.0 (Adams/Feynman/Russell relationships added). Gates BL-116.

### BL-114 — Consolidate skin tab list: single source of truth
- **Root cause of WL-112 and WL-118 pattern:** `SKIN_CONFIGS.consultant.tabs` in `index.html` and `CONSULTANT_SKIN_TABS` in `pipeline/gherkin-runner.js` are two independent copies of the same list. Adding a new tab requires updating both. Missing either causes a pipeline failure (WL-112) or a feature gap.
- **Fix:** `gherkin-runner.js` should extract the consultant tab list from `index.html` at runtime (same approach `ui-audit.js` already uses via `skinMatch` regex) rather than maintaining its own hardcoded array.
- **Out of scope:** Do not change `SKIN_CONFIGS` in `index.html` — that remains the single source. Only the gherkin runner's copy is removed.
- **Risk:** Gherkin runner currently uses `CONSULTANT_SKIN_TABS` for test scoping. Verify all usages before removing.
- Feature: platform
- CD3: UBV=2 TC=6 RR=8 → CoD=16, Dur=2, **CD3=8.0**
- Status: CLOSED — 2026-03-11 (0e0591f). Dynamic extraction from index.html; [\w-]+ regex handles hyphenated tabs; 2 new Gherkin scenarios; stale list fixed (pubnavigator, housenameoracle, roastroom, writingroom, souness-cat, cricket were missing). 1498/1498 green.

### BL-006 — pipeline @claude skip count reduction
- 400+ scenarios @claude-tagged (manual / behavioural)
- First candidates: watching-oche-mode1 suggestion card shuffle, panel-slots cross-panel invariants
- Feature: platform
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

### BL-035 — Golf Adventure: "Watch Back" mode — sofa commentary for tournaments with player-characters
- When the user selects a tournament where one or more panel members actually played (e.g. Coltart at Valderrama, Faldo at Valhalla, Poulter at Medinah), those characters appear in a persistent sofa strip watching the round unfold.
- **Design resolved (2026-03-10):**
  - **Persistent strip** — low footprint, no performance/UI attention grab, sits quietly below the game. Updates after each hole event with 1-2 lines. TV feel, enables running gags.
  - **First-person memory** — commentators were THERE. They don't observe neutrally. Coltart was benched at Valderrama. Faldo was captain at Valhalla. Poulter made those putts at Medinah. Commentary is their personal recollection filtered through their wound and voice.
  - **Templated v1** — commentary pools pre-authored per character per tournament, using incidents[] as factual anchor. AI layer added later once mechanics proven.
  - **First implementation:** Coltart / Valderrama 1997.
- **Reaction modes (7) — fires based on divergence from historicalScores/incidents:**
  1. **Confirmation** — player matched history, commentator nods along ("yes, exactly as I remember it")
  2. **Perturbed** — slight deviation, uncomfortable, keeps returning to their version
  3. **Seeking confirmation** — "did anyone else see that? Because from where I was standing..."
  4. **Bewilderment** — clear divergence, visibly confused, can't process it
  5. **Ignorance** — refuses to acknowledge the change, describes the historical version anyway
  6. **Retroactive adoption** — insists what just happened IS exactly what they remember
  7. **Endorsement** — player did better than history, commentator claims credit or quiet approval
- **Trigger:** check `tournament.players[].id` against panel member IDs. If match → sofa strip active.
- **Phase 2:** two sofa commentators react to each other when both match.
- CD3: UBV=9 TC=2 RR=1 → CoD=12, Dur=5, **CD3=2.4**
- Status: CLOSED — 2026-03-10. Logic layer (getSofaCommentator, getHistoricalDivergence, selectReactionMode, COLTART_SOFA_POOLS) in pipeline/logic.js. Gherkin in specs/golf-adventure-watchback.feature. UI wired in golf-adventure.html: constants + functions inline, sofa strip shows on startGame, updates after each hole via updateSofaStrip(). 472/472 passing.

### BL-096 — Character files: align all pre-author files to feature-agnostic canonical model
- 30+ character files (characters/*.md) were created before the feature-agnostic convention was
  established this session. They contain "Panel-Specific Rules" sections that mix feature bindings
  (how the character is used in a specific room/panel) into the canonical character definition.
- Work: audit each file, rename "Panel-Specific Rules" → "Character Rules", extract any
  feature-specific content (prompt text, epilogue bindings, panel trigger rules) into the relevant
  feature spec or logic layer. Leave only character-intrinsic mechanics in the file.
- New standard: characters/*.md = canonical model only. Feature bindings live in feature specs
  and logic layers. Established in TEMPLATE.md 2026-03-10.
- Files in scope: all ~30 pre-author files (radar.md, faldo.md, coltart.md, souness.md, etc.)
- Author files (tolkien/patterson/pratchett/wodehouse/austen) already compliant — done this session.
- Feature: process
- CD3: UBV=4 TC=3 RR=6 → CoD=13, Dur=4, **CD3=3.25**
- Status: OPEN — raised 2026-03-10

### BL-097 — Roast Room: select authors by predicted comedy value for the material
- Currently: 5 authors selected at random from the pool.
- Enhancement: score each author's likely comedy collision value against the submitted title
  before selection. Authors with higher predicted comedy value (based on title genre/type vs
  author's known style) are weighted higher in selection.
- Example: Hello magazine → Hemingway (masculine stoicism vs celebrity gossip = high value),
  Tolkien (Elvish genealogy of a magazine = high value), Austen (social observation = high value).
  A technical manual → McCarthy (dust and nihilism vs instructions = high value), Patterson (CHAPTER 1: STEP 1).
- Requires: either a pre-scored affinity table (author × genre type) or a pre-flight LLM call
  that scores affinities before selecting the 5. Pre-scored table is cheaper and faster.
- Depends on: BL-095 (Roast Room must exist first)
- Feature: comedy-room
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=3, **CD3=2.7**
- Status: OPEN — raised 2026-03-10, blocked on BL-095

### BL-098 — Gherkin step namespace collision lint check
- Epic: Pipeline Health
- Recurring waste: WL-099, WL-100, WL-103 all caused by identical regex patterns across features silently shadowing each other. First-match wins; the wrong step fires; pipeline may appear green while behaviour is untested.
- Fix: add a lint pass to gherkin-runner.js (or a separate script) that detects duplicate regex patterns across all step definitions and fails with a clear error naming the collision. Could also enforce a naming convention: steps containing `"([^"]+)"` must be prefixed with a feature-specific noun.
- CD3: UBV=2 TC=3 RR=4 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — 2026-03-10. lintStepDuplicates() in pipeline/lint-steps.js; integrated into gherkin-runner.js startup; 6 unit tests + 4 Gherkin scenarios. First run found 11 existing duplicate patterns — now visible, not silent.

### BL-119 — Pipeline: cross-script browser-scope const collision detector
- WL-125 root cause: engine files redeclare top-level `const` names that data/config files already declared. Crashes only in browser (shared classic-script scope) — never in Node (module scope). Pipeline runs GREEN. App is broken.
- Fix: Node-based static analysis check in ui-audit.js or new script. Extract all top-level `const` declarations from every `<script src>` file. Assert uniqueness across all of them. Any duplicate name = fail.
- Implementation: read all src/ js files listed in `<script src>` tags in index.html. For each, extract `const \w+` declarations at top level (not inside functions/classes). Build a name → [files] map. Flag any name appearing in more than one file.
- This IS pipeline-runnable without a browser — pure static analysis.
- Feature: process
- CD3: UBV=8 TC=10 RR=10 → CoD=28, Dur=2, **CD3=14.0**
- Status: CLOSED — implemented as ui-audit check 15 (commit 7f1e7f0, 2026-03-12). Static analysis: reads all external JS files, extracts all-caps top-level const names, fails if any name appears in more than one file. 16/16 ui-audit checks passing.


---

### BL-120 — Left sidebar: resizable/expandable panel for truncated nav text
**Epic:** UX / Navigation
**What:** The left navigation sidebar truncates long panel names. Rod cannot read full labels. Need either a fixed wider sidebar, a user-draggable resize handle, or a tooltip on hover.
**Why:** Usability — text truncation hides navigation options. Direct barrier to product use.
**Source:** Rod (2026-03-12 session 7)
**CD3:** UBV=4 TC=2 RR=3 → CoD=9, Dur=1, **CD3=9.0**
**Status:** CLOSED — commit (next), Three Amigos: fixed wider + wrap (Option A)
**Acceptance criteria:** All tab labels readable without truncation on desktop — ✅

---

### BL-121 — Phil's-opoly: Comedy Room philosophy panel
- **Epic:** Comedy Room
- **Concept:** New Comedy Room mode. A panel of philosophers (and Tufnell) react to any topic/question the user submits. Suggestion cards + free text input. Characters engage in an interactive discussion with each other — not just responding to the user, but reacting to each other's contributions.
- **Characters at launch (priority build):**
  - **Phil Tufnell (Tuffers)** — "The Tuffers Version of Events" (named mechanic). Runs any topic through his own experience, half-remembered recent events, and tenuous analogies. Horrifically ill-informed, often inappropriate, never deliberate — pure incompetence. Delivers with full confidence and expects it to land. Puppy-who-shat-on-the-floor energy: damage done, unaware of damage, still wants the tickle. Zero self-awareness. Zero malice. Distinct from Long Room Tufnell. Full brief: `notes/2026-03-09-phils-opoly.md`
  - **Diogenes** — barrel, told Alexander to move, won't explain the barrel. Urinated on people who annoyed him. Provocateur. Self-sufficient to the point of contempt. Reacts to Tufnell by ignoring him entirely.
  - **Shane MacGowan** — most well-read person in the room. Wreckage is the mask. DEAD_IN_PANEL_WORLD mechanic (same as Waddell/Bristow — nobody mentions it, pure bathos). Finds Tufnell's wrong answers oddly resonant.
  - **Mike Skinner** — accidental philosophy. Grand Don't Come For Free as metaphysics. Wound: massively over-evaluating ordinary life — which is every philosopher's wound. Finds Tufnell's wrong answers accidentally profound.
  - **Nostradamus** — prophetic, useless hindsight, already in Pub Navigator quartet. Cross-panel character. Reacts to Tufnell: predicted it, very pleased.
  - **Bertrand Russell** — 4 marriages, jailed pacifist, Nobel for Literature (mildly insulting), wrote to Stalin with full confidence. Already specced (Premise Interrogation). Attempts to correct Tufnell with increasing despair.
- **Full roster at launch** (user selects 2–5): Tufnell, Diogenes, MacGowan, Skinner, Nostradamus, Russell, George Carlin (Curious George), Douglas Adams (Unparanoid Android), Bill Hicks (Hicks the Humanist), Oscar Wilde (Wildest of Oscars). All have full character files — no additional research needed. Future: Socrates, Plato, Nietzsche, Wittgenstein, Schrödinger. Notes: `notes/2026-03-09-phils-opoly.md`
- **Placement:** Comedy Room (new mode tab alongside Into The Room, Roast Room, etc.)
- **UX:** Suggestion cards (like 19th Hole mode 1) + free text field → interactive panel discussion
- **Three Amigos:** COMPLETE (2026-03-12 session 7)
- **Feature:** comedy
- **CD3:** UBV=7 TC=5 RR=3 → CoD=15, Dur=4, **CD3=3.75**
- **Status:** CLOSED — commit cfbbe8f, 9 Gherkin scenarios passing, pipeline green (2026-03-12 session 7)

### BL-122 — E2E browser test: Playwright pipeline step proving button→API→response
- Root cause of 20+ "good builds" with broken live site: pipeline never executed a real button click in a real browser against the live site. Unit tests, Gherkin, browser-sim, and ui-audit all run in Node — none can prove a button works.
- Fix: `pipeline/e2e-test.js` using Playwright headless Chromium. Tests: page load (no JS fatal errors), key panels present in DOM, API module available, Pub Navigator button click → real API response, Sun Tzu Advisory submit → real API response, Hardmen panel renders 5 buttons. Wired into `pipeline/run-all.js` after UI Audit as a blocking step. Reported in `pipeline-report.sh`.
- Feature: process
- CD3: UBV=9 TC=9 RR=9 → CoD=27, Dur=1, **CD3=27.0**
- Status: CLOSED — 2026-03-12. 6/6 E2E checks passing after BL-106 deployed. Catches JS crashes, API wiring failures, and button-to-logic disconnects that all other pipeline steps miss.


---

### BL-123 — The Final Furlong: horse racing panel

- Title: The Final Furlong: horse racing panel
- Description: New horse racing panel. Alan Brazil hosts (TalkSport, ex-Ipswich). 4 of 6 rotating experts per round: John McCririck, Jim McGrath, Alastair Down, Sir Peter O'Sullevan, Ruby Walsh, Matt Chapman. McCririck and O'Sullevan are DEAD_IN_PANEL_WORLD — present, contributing, neither death mentioned, pure bathos. Mode 1 Q&A with suggestion cards, Mode 2 Race Moment (6 types). 7 character .md files, Gherkin spec (32 scenarios), HR_SUGGESTIONS pool, HR_ANCHOR_BRAZIL readback.
- Feature: sports
- CD3: UBV=8 TC=8 RR=7 → CoD=23, Dur=2, **CD3=11.5**
- Status: CLOSED — 2026-03-13. Pipeline GREEN. Pushed f75a4a4.

---

### BL-125 — Final Furlong Mode 2: jockey-to-jockey rivalry interactions

- Title: Final Furlong Mode 2 — jockey rivalry: attack, defend, and steal mid-race
- Description: Extend the Race Simulation engine with jockey-to-jockey rivalry events. Rod: "some of the interactions were to either get attacked or attack back our rivals, maybe steal their whip or cap etc." Currently Mode 2 is purely riding-choice → score delta with panel commentary and random special events. Adding rivalry mechanics would mean:
  - AI rival jockeys present in the race (drawn from JOCKEY_PROFILES or a rival pool)
  - Mid-race events: rival attacks you (block, barge, intimidate), you can respond (attack back, evade, ignore)
  - Item-based interactions: steal rival's whip, knock rival's cap — both add colour/humour and affect score
  - Panel commentary reacts to the incident (McCririck particularly)
  This may share design patterns with ConspireEngine (escalation, wound words, relationship state) but is race-specific not a direct port. Needs Three Amigos before Gherkin.
- Feature: sports
- CD3: UBV=8 TC=6 RR=5 → CoD=19, Dur=4, **CD3=4.75**
- Status: OPEN — raised 2026-03-13. Needs Three Amigos before any Gherkin.
- Epic: Final Furlong Mode 2

---

### BL-124 — Nav: panel group landing page (sub-feature list before entering a panel)

- Title: Nav: panel group landing page (sub-feature list before entering a panel)
- Description: When a user clicks a main nav group (Sports, Comedy, etc.), instead of dropping immediately into the first panel in the list, show a landing page that lists all sub-features within that group. User then clicks to enter the specific panel. Replaces current behaviour of auto-selecting the first tab.
- Feature: platform
- CD3: UBV=8 TC=7 RR=7 → CoD=22, Dur=3, **CD3=7.3**
- Status: CLOSED — commit fa917de (2026-03-13)

### BL-127 — Prominent back button on every screen (return to group landing)

- Title: Prominent back button on every screen — return to group landing
- Description: Every panel/screen needs a prominent, clearly visible back button that returns the user to the group landing page (or home if no group applies). The current nav-back-bar (added in BL-124) is subtle and may not be visible enough. Applies to all panels, all modes within panels, and all sub-screens (e.g. race sim stages, golf adventure session phases). Rod: "prominent in EVERY screen".
- Feature: platform / UX
- CD3: UBV=8 TC=8 RR=7 → CoD=23, Dur=2, **CD3=11.5**
- Status: CLOSED — commit 2c7fa13 (2026-03-13)
- Epic: Navigation UX

### BL-126 — UI regression caught by Rod: nav home tiles bypass group landing (BL-124)

- Title: UI regression caught by Rod: nav home tiles bypass group landing
- Description: After implementing BL-124 (nav group landing page), the home page tiles for Sports, Comedy, Little Misadventure were still calling switchTab() directly, skipping the group landing. Rod caught this manually. Automated pipeline (Gherkin, E2E, browser sim) did not catch it. Root cause: no UI test coverage for home-tile onclick behaviour. The pipeline has a structural gap — it tests that elements exist and functions exist, but does not test onclick wiring.
- Feature: platform / testing
- CD3: UBV=7 TC=8 RR=8 → CoD=23, Dur=4, **CD3=5.75**
- Status: CLOSED — commit to follow (2026-03-13)
- Epic: UI Test Coverage
- Root cause (5-Whys): Home tiles wired to switchTab() → not updated when BL-124 changed routing. Browser sim tests existence of elements but not onclick values. Gherkin tests landing function but not that home tiles call it.
- Proposed fix: Add browser-sim or Gherkin step that verifies multi-panel group home tiles call showGroupLanding(), not switchTab(). Also add steps checking that onclick wiring matches expected function for all home tiles.

---

### BL-128 — Pub Crawl UX: pressure feedback, threshold visibility, and game-goal clarity

- Title: Pub Crawl UX — pressure delta feedback, threshold bands, and game-goal clarity
- Description: Three related usability failures (all Nielsen violations) in Pub Crawl Mode B:
  1. **No per-choice delta** — after making a choice, user sees no indication of how much pressure it added (+1/+2/+3/+4). Bar colour changes but no number shown. Nielsen #1 (visibility of system status).
  2. **No threshold markers** — pressure bar shows a number but not what it means. Outcome bands (escape ≤4, ejected ≤8, worst ≤12, legendary 13+) are invisible during play. Nielsen #6 (recognition rather than recall).
  3. **Game goal unclear** — "lower pressure = better" is never stated. Users don't know if they're winning or losing, or what they're trying to achieve. Rod: "it is very unclear what the purpose or effects of their interaction is."
  Proposed fix:
  - After each choice: show "+N pressure" delta in colour (green for 1, amber for 2-3, red for 4).
  - Add band tick marks and labels on the pressure bar (ESCAPE / EJECTED / WORST zones).
  - Add single-line explainer under the bar: "Lower = better. Stay under 5 to escape."
  - Add contextual status text after each delta: "Still in escape zone" / "Danger zone" / etc.
  Drives: WL-134 (no positive/negative feedback). Raised after Rod review 2026-03-13.
- Feature: pub-navigator
- CD3: UBV=8 TC=7 RR=6 → CoD=21, Dur=3, **CD3=7.0**
- Status: CLOSED — commit 5238677 (2026-03-13)
- Epic: Pub Crawl UX

---

### BL-129 — Pub Crawl: visible free-text action input with game effect

- Title: Pub Crawl — user can type their own action; it affects the game
- Description: Currently `#pc-input-area` is hidden and only handles the "lederhosen" easter egg. Rod wants a visible, first-class text input where users can type their own pub crawl action instead of (or in addition to) the preset choices, and have it affect game state. Design open — Three Amigos needed before implementation:
  - Does free text add fixed pressure (e.g. +2 = neutral midpoint)?
  - Does the AI judge the text and return a pressure delta?
  - Does it replace or supplement the preset choices?
  - Does the advisor respond to it like a choice (buildAdvisorPrompt)?
  Rod: "consider the effect user entries have on the game". Needs design agreement before touching engine.
- Feature: pub-navigator
- CD3: UBV=7 TC=5 RR=4 → CoD=16, Dur=4, **CD3=4.0**
- Status: OPEN — raised 2026-03-13. Needs Three Amigos before implementation.
- Epic: Pub Crawl UX

---

### BL-130 — Snooker panel: The Crucible Corner

- Title: The Crucible Corner — snooker panel (Mode 1 Q&A + Mode 2 match simulation)
- Description: New sports panel for snooker, following the Final Furlong structure (Mode 1: Q&A with suggestion cards; Mode 2: match/frame simulation). Characters and Mode 2 game mechanics TBD — Three Amigos session required. Candidate characters: Steve Davis, John Virgo, Dennis Taylor, Ronnie O'Sullivan, Willie Thorne (DEAD_IN_PANEL_WORLD), Ray Reardon (DEAD_IN_PANEL_WORLD), John Parrott, Mark Williams. Mode 2 ideas: frame scoring, shot selection (safety/pot/snooker), risk vs reward, commentary from the panel. Rod raised 2026-03-13.
- Feature: sports
- CD3: UBV=7 TC=6 RR=5 → CoD=18, Dur=5, **CD3=3.6**
- Status: CLOSED — delivered 2026-03-13, commit b90da5d. 9 members (Jimmy White host, 8 rotating, 2 DEAD_IN_PANEL_WORLD), Mode 1 Q&A with 14 suggestion cards, Mode 2 Frame Simulation with 7 reds × 7 spins × 5 positions. 1662/1662 Gherkin passing.
- Epic: Sports Panels


### BL-131 — The Spit Shelter: hip-hop panel — Mode 1 Q&A + Mode 2 Rap Battle, launch 6 characters

- Description: New panel. 14 characters across 4 batches (Anchors, Storytellers, Conscience Layer, UK Contingent). Format: corporate prompt roast (same mechanic as Boardroom/Comedy Room). Mode 1 = Q&A with suggestion cards. Mode 2 = Rap Battle — characters battle each other on the source material; School Mode fires naturally in the conflict. Launch panel: Eminem, Dr Dre, Biggie, Tupac, Missy Elliott, JCC. All other characters defined as data; added to rotation as Tiers 2 and 3 in follow-on BL items.
- Dead in panel-world: Tupac Shakur, Biggie Smalls (same mechanic as Waddell/Reardon — they exist fully, the knowledge is present in their urgency).
- School Mode mechanic (BL-132) is a prompt convention, not engine code — applies to all launch characters.
- Placement: Comedy Room (same nav group as The Roast Room, The Writing Room). Confirmed Three Amigos 2026-03-14.
- Research: Downloads/spit-shelter-characters-batch1–4.md. Three Amigos complete 2026-03-14 (session 10).
- Depends on: BL-132 (School Mode spec) — write spec first, apply to character prompts in this item.
- Feature: spit-shelter
- Epic: The Spit Shelter
- CD3: UBV=9 TC=7 RR=8 → CoD=24, Dur=5, **CD3=4.8**
- Status: OPEN — raised 2026-03-14. Gherkin required before panel code.

---

### BL-132 — School Mode: cross-panel prompt convention (spec + apply to Spit Shelter launch)

- Description: School Mode is a generalised character action with four outcomes, crossing all panels. Spec the convention, document GOAT domain declarations, write School Mode language into Spit Shelter launch character files. Flag Cox, Bristow, and Faldo as backfill candidates (no immediate BL item — add when those characters are next touched). The mechanic: character attempts to educate the panel on How It's Done. Four outcomes based on GOAT status × explanation quality: SCHOOL_SUCCESS (GOAT + good explanation — room goes quiet), SCHOOL_FUMBLE (GOAT + bad explanation — "I just do it"), SCHOOL_ATTEMPT (non-GOAT + makes sense — panel unconvinced), SCHOOL_DISASTER (non-GOAT + bad explanation — canonical: Ice T attempts to school Tupac on authenticity). Dre is the canonical SCHOOL_SUCCESS — deploys maximum twice, which is what makes it land. JCC is a special case: different category entirely, predates the panel, panel cannot argue but doesn't accept his domain's authority either.
- Output: School Mode spec section added to .claude/practices/ or character file conventions. Each launch character file includes goatDomains and school mode behaviour in Character Rules.
- Feature: spit-shelter
- Epic: The Spit Shelter
- CD3: UBV=7 TC=8 RR=7 → CoD=22, Dur=1, **CD3=22.0**
- Status: OPEN — raised 2026-03-14. Data-only (prompt convention) — no Gherkin gate.
