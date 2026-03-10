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
- CD3: UBV=8 TC=5 RR=1 → CoD=14, Dur=3, **CD3=4.7**
- Status: OPEN

### BL-041 — Golf Adventure: 2011 US Open Congressional (Rory 8-shot)
- Epic: Modern Majors Tier 2
- Rory McIlroy 8-shot win at 22. After Masters collapse. Utterly dominant. NBC. Players: Rory (protagonist), Jason Day (distant second).
- CD3: UBV=8 TC=5 RR=1 → CoD=14, Dur=3, **CD3=4.7**
- Status: OPEN

### BL-042 — Golf Adventure: 2002 Open Muirfield (Els 4-way playoff)
- Epic: Modern Majors Tier 2
- 4-man playoff (Els, Elkington, Levet, Appleby). Els wins. Thomas Levet falls over after hole-in-one celebrations. BBC. Players: Els (protagonist), Levet (comedy foil).
- CD3: UBV=7 TC=5 RR=1 → CoD=13, Dur=3, **CD3=4.3**
- Status: OPEN

### BL-043 — Golf Adventure: 2011 Open Sandwich (Darren Clarke)
- Epic: Modern Majors Tier 2
- Clarke wins three weeks after anniversary of wife Heather's death. Emotional. Sky. Players: Clarke (protagonist), Phil Mickelson / Dustin Johnson (foils).
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
- CD3: UBV=7 TC=4 RR=1 → CoD=12, Dur=3, **CD3=4.0**
- Status: OPEN

### BL-046 — Golf Adventure: 2004 Masters (Phil's first major)
- Epic: Modern Majors Tier 2
- Phil Mickelson's first major after 0-for-46. Arms in air on 18. Ernie Els misses short putt on 18 to tie. CBS.
- CD3: UBV=7 TC=4 RR=1 → CoD=12, Dur=3, **CD3=4.0**
- Status: OPEN

### BL-047 — Golf Adventure: 2012 Masters (Bubba Watson)
- Epic: Modern Majors Tier 2
- Bubba Watson punch hook from pine straw on 10 in playoff. Weeps at the hole. CBS. Players: Bubba (protagonist), Louis Oosthuizen (foil).
- CD3: UBV=7 TC=4 RR=1 → CoD=12, Dur=3, **CD3=4.0**
- Status: OPEN

### BL-048 — Golf Adventure: Round selection — play final round only OR all 4
- Option at tournament start: play the full 4 rounds or jump straight to the final round with historical scores loaded for rounds 1–3.
- Enables quick plays of the key dramatic round without replaying the whole tournament.
- CD3: UBV=7 TC=1 RR=1 → CoD=9, Dur=5, **CD3=1.8**
- Status: OPEN

### BL-049 — Wise Sir Nick: sandwich gate wound + insult vocabulary
- Epic: Sir Nick Character Depth
- **Wound:** Sandwich gate — 2008 Ryder Cup Valhalla. Faldo was European captain. A British photographer with a zoom lens caught him showing handwritten foursomes pairings (just initials) to Henrik Stenson during the practice round. At the press conference Faldo claimed the paper was a team sandwich order: "who wants tuna, who wants the beef, who wants the ham." Flaw: only 11 initials, Jiménez missing. Reporter pointed it out. Faldo: "Put my name down, then." Every pairing on the note appeared in the actual lineup the next morning. Europe lost 16½–11½. Ian Poulter: "Faldo is talking about someone being useless at the 2008 Ryder Cup. That's the Ryder Cup where *he* was captain."
- **Comedy mechanic:** Sir Nick's insult vocabulary uses sandwich language — bad opponents/shots get "rotten filling", "mouldy bread", "soggy crust", "wrong sauce", "terrible combination", "accoutrements entirely wrong." Other panel members know about the sandwich gate and can needle him with it (tuna/beef/ham references, "what's on the menu today Nick" etc.)
- **Wound trigger:** any mention of Ryder Cup captaincy, 2008, Valhalla, Poulter, Garcia, or "pairings" fires the wound.
- CD3: UBV=7 TC=1 RR=1 → CoD=9, Dur=4, **CD3=2.3**
- Status: OPEN

### BL-051 — Distribution: make Cusslab discoverable + installable
- Currently: direct URL only. No SEO, no install, no organic reach.
- **Phase 1 (low cost):** Real domain (cusslab.co.uk or similar), `<title>` + meta description per page, og:image for sharing. Makes it indexable and shareable.
- **Phase 2 (moderate cost):** PWA — manifest.json + service worker. iOS/Android "Add to Home Screen" install, offline caching. Feels native, no App Store needed.
- **Phase 3 (high cost, validate demand first):** Native app store wrapper (Capacitor/React Native). Only justified if Phase 1+2 prove audience exists.
- Recommend: discuss Phase 1 first — it costs almost nothing and unblocks organic discovery before Phase 2.
- CD3: UBV=8 TC=3 RR=2 → CoD=13, Dur=4, **CD3=3.25**
- Status: OPEN — design discussion needed before any implementation

### BL-054 — Expert Evolution engine: apply to sports panels, build toward panel-agnostic independent engine
- Current Expert Evolution feature applied to one context. Apply the same mechanic to Sports panels (golf, football, darts) for different attributes (technique evolution, tactical thinking, commentary style over career arc).
- Longer-term goal: extract into a standalone panel-agnostic engine that can model attribute evolution for any character across any panel, industry, or domain.
- Needs scoping conversation before CD3 can be scored properly.
- CD3: TBD — scoping required
- Status: OPEN — logged only, no implementation scope yet

### BL-053 — House Name Oracle — Comedy Room Mode 2 (postcode → research → Phil/Kirstie/Dion → house names)
- Epic: House Name Oracle
- New Comedy Room mode. Input: UK/Irish outward code + mandatory OracleVoice archetype (Elegist/Rogue/DarkOracle/Booster/Snob/Anarchist/Mystic/Local). Oracle researches the location (topography, history, IMD, famous people, wrong attribution, political stance, proximity). Phil Spencer, Kirstie Allsopp, Dion Dublin have a conversation about the research and converge (or don't) on a name. Output: three house names in three registers (Dignified/Knowing/Unhinged) each with Oracle rationale.
- See notes/2026-03-10-house-name-oracle.md for full design spec.
- CD3: UBV=8 TC=2 RR=1 → CoD=11, Dur=8, **CD3=1.375**
- Status: OPEN — Gherkin approved 2026-03-10, TDD in progress

### BL-052 — Homepage quotes: random character attribution + uncertainty disclaimer
- Epic: Brand Polish
- Quotes displayed at the top of the app should reference cusslab characters randomly. Each quote attributed to a character followed by a disclaimer in parentheses: (possibly) / (probably) / (yeah....maybe) / (almost certainly) / (according to them) etc. Rotates on load.
- CD3: UBV=3 TC=1 RR=1 → CoD=5, Dur=2, **CD3=2.5**
- Status: OPEN

### BL-050 — Golf Adventure: 2008 Ryder Cup Valhalla (Faldo's disaster)
- Epic: Ryder Cup Rollout
- Faldo's catastrophic captaincy. USA win 16½–11½. Sandwich gate, botched opening ceremony introductions (potato joke for Harrington, confused McDowell's nationality, called Hansen "Stenson"), bottom-loaded singles order, Azinger outmanoeuvred him tactically. Players: Faldo (captain/protagonist — plays as an actual character), Poulter (emotional engine of the European team despite the captaincy). Sky/NBC.
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
