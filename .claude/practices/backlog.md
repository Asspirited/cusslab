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
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-063 — Author Epilogue: J.R.R. Tolkien
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: mythic scope, Elvish, appendices, ancestral lineage. Structural tell: the appendix is longer
  than the summary. Wound: insists on naming the course in Elvish before describing any shots.
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-064 — Author Epilogue: James Patterson
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: short chapters, everything DRAMATIC, pace pace pace. Structural tell: chapter numbers for
  every sentence. Wound: novel has 94 chapters. Closing: a cliffhanger about the 19th hole.
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-065 — Author Epilogue: Terry Pratchett
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: footnotes, satire, truth disguised as comedy. Structural tell: *A FOOTNOTE ABOUT THE PHYSICS
  OF GOLF BALLS.* Death plays off scratch. Nobody will acknowledge this. Wound: the footnote is longer.
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-066 — Author Epilogue: P.G. Wodehouse
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: Jeeves, gentle chaos, upper-class incompetence. Structural tell: Bertie wanders in uninvited.
  Wound: Bertie's handicap. It is not improving. Jeeves has opinions on this that he does not share.
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-067 — Author Epilogue: Jane Austen
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: social comedy, manners, sly observation. Structural tell: "It is a truth universally
  acknowledged…" Wound: the club secretary's conduct. It has been noted. It will not be forgotten.
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-068 — Author Epilogue: Hunter S. Thompson
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: gonzo, paranoid, political, drugs. Structural tell: "We were somewhere around the 7th hole
  when the drugs began to take hold." Wound: the caddie. The caddie was no longer human.
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-069 — Author Epilogue: Raymond Chandler
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: hardboiled, noir, Los Angeles similes. Structural tell: the green was as smooth as a lie told
  by a man who'd told better ones. Wound: the woman watching from the clubhouse. She knows something.
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: OPEN

### BL-070 — Author Epilogue: Oscar Wilde (existing character — epilogue template)
- Epic: Author Epilogue
- Depends on: BL-061
- Existing panel character. Needs epilogue prompt template only (no new character file).
- Voice: every shot is an epigram. Suffering is merely bad taste. The ball knows it's being watched.
  Structural tell: the closing epigram is better than everything that preceded it. Wound: the rough.
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-071 — Author Epilogue: Agatha Christie
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: suspects everywhere, the reveal, Poirot. Structural tell: Poirot has known since the 3rd hole.
  He merely waited for the confession. Wound: the alibi for the missed putt doesn't hold up.
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-072 — Author Epilogue: J.K. Rowling
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: wizarding lens + extended commentary on themes. Structural tell: everyone is sorted into houses.
  Wound: the game is inadvertently problematic on several levels she would like to address at length.
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-073 — Author Epilogue: Dan Brown
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: every sentence a cliffhanger, symbols, codes, the Vatican. Structural tell: the symbol on the
  scorecard was not a birdie. It was a warning. Wound: the caddie knew about the Priory of the Tee.
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-074 — Author Epilogue: Enid Blyton (existing character — epilogue template)
- Epic: Author Epilogue
- Depends on: BL-061
- Existing panel character (Slightly Squiffy Blyton). Needs epilogue prompt template only.
- Voice: Famous Five adventure. The rough is a secret passage. Everyone is jolly or a villain.
  Has had a couple. Structural tell: there is a mystery. It involves the greenkeeper.
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-075 — Author Epilogue: Isaac Asimov
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: rational, systematic, Three Laws applied. Structural tell: Three Laws of Golf. The caddie is
  a robot. It cannot harm a golfer except through incorrect club selection. Wound: the First Law fails.
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN

### BL-076 — Author Epilogue: Leo Tolstoy
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: vast, philosophical, suffering as meaning. Structural tell: one round = 600 pages of context.
  The birdie at the 7th is a microcosm of the human condition. Wound: the character on the bench.
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-077 — Author Epilogue: Charlotte Brontë
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: gothic, moors, passion, unspoken feeling. Structural tell: the rough is the moors. Someone
  brooding is in the bunker. It begins to rain with intent. Wound: Mr Rochester. He is always there.
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-078 — Author Epilogue: John le Carré
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: paranoid, espionage, nobody is who they say. Structural tell: everyone at the club is working
  for someone else. The caddie has a past. The scorecard was a message. Wound: the mole.
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-079 — Author Epilogue: Wilbur Smith
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: adventure, vast scale, raw masculinity. Structural tell: impossible distances. Someone is
  hunting something. The game takes place across a continent. Wound: the lion on the 16th.
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-080 — Author Epilogue: Jeffrey Archer
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: shameless, self-aggrandising, economical with truth. Structural tell: he had never lost a round
  of golf, he told himself. This was not entirely true. It was not true at all. Wound: the scoreboard.
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN

### BL-081 — Author Epilogue: Barbara Cartland
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: romance, heaving bosoms, pastel, eternal love. Structural tell: her heart fluttered as he
  approached the 18th hole. His grip was masterful. Wound: his handicap. It was seven. Irresistible.
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
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN — blocked on BL-060/061

### BL-083 — Author Epilogue: Phase 2 — Darts integration
- Epic: Author Epilogue
- Depends on: BL-082
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN — blocked on BL-082

### BL-084 — Author Epilogue: Phase 2 — Cricket Long Room integration
- Epic: Author Epilogue
- Depends on: BL-082
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN — blocked on BL-082

### BL-085 — Author Epilogue: Phase 2 — Oracle conversation integration
- Epic: Author Epilogue
- Depends on: BL-082; Oracle must have a session narrative to summarise
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: OPEN — blocked on BL-082

### BL-086 — Author Epilogue: Phase 2 — Boardroom session integration
- Epic: Author Epilogue
- Depends on: BL-082
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
- CD3: UBV=8 TC=3 RR=2 → CoD=13, Dur=4, **CD3=3.25**
- Status: OPEN — design discussion needed before any implementation

### BL-057 — Homepage quotes: Colemanballs and real sporting gaffes pool
- Epic: Brand Polish
- Add a dedicated pool of real Colemanballs-style quotes (David Coleman, Ron Atkinson, Murray Walker, Des Lynam, Peter Alliss, John Motson, Barry Davies) plus genuine sporting howlers attributed to real people with caveats. These sit alongside the character pool or form their own rotation. Could also add famous non-sporting foot-in-mouth quotes (Ratner, Prescott, etc.).
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
- CD3: UBV=7 TC=5 RR=3 → CoD=15, Dur=2, **CD3=7.5**
- Status: OPEN — blocked on BL-104

### BL-106 — Sun Tzu general advisory mode (post-pub validation)
- Epic: Sun Tzu Pub Navigator
- After pub context proven: Sun Tzu answers any question (not just pub situations). Principle → application → warning applied universally.
- Depends on: BL-104 (voice validated in pub context first)
- CD3: UBV=6 TC=3 RR=2 → CoD=11, Dur=2, **CD3=5.5**
- Status: OPEN — blocked on BL-104

### BL-107 — Nostradamus character spec: juxtaposition mechanic with Sun Tzu
- Epic: Sun Tzu Pub Navigator
- Nostradamus character file written in Claude.ai session (pending commit to characters/).
- Juxtaposition: Sun Tzu acts before the event; Nostradamus claims to have predicted it. Nostradamus is useless hindsight voiced with complete prophetic confidence.
- Design detail in notes/2026-03-10-sun-tzu-pub-navigator.md; Nostradamus also doubles in hardmen panel (BL-105).
- CD3: UBV=5 TC=4 RR=2 → CoD=11, Dur=1, **CD3=11.0**
- Status: OPEN — character file pending commit (waiting on file transfer from Claude.ai)

### BL-108 — Bruce Lee character spec: fifth advisor candidate
- Epic: Sun Tzu Pub Navigator
- Modern Sun Tzu — physical/philosophical, may join or replace one of the quartet.
- Not yet written. Needs spec session before any implementation.
- Depends on: BL-104 (Mode A validated — do we need a fifth?)
- CD3: UBV=5 TC=3 RR=2 → CoD=10, Dur=2, **CD3=5.0**
- Status: OPEN — spec not yet written

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
- CD3: UBV=8 TC=3 RR=4 → CoD=15, Dur=3, **CD3=5.0**
- Status: OPEN — raised 2026-03-10

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
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=3, **CD3=2.7**
- Status: OPEN — raised 2026-03-10, blocked on BL-095

### BL-098 — Gherkin step namespace collision lint check
- Epic: Pipeline Health
- Recurring waste: WL-099, WL-100, WL-103 all caused by identical regex patterns across features silently shadowing each other. First-match wins; the wrong step fires; pipeline may appear green while behaviour is untested.
- Fix: add a lint pass to gherkin-runner.js (or a separate script) that detects duplicate regex patterns across all step definitions and fails with a clear error naming the collision. Could also enforce a naming convention: steps containing `"([^"]+)"` must be prefixed with a feature-specific noun.
- CD3: UBV=2 TC=3 RR=4 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — 2026-03-10. lintStepDuplicates() in pipeline/lint-steps.js; integrated into gherkin-runner.js startup; 6 unit tests + 4 Gherkin scenarios. First run found 11 existing duplicate patterns — now visible, not silent.
