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
  Canonical labels: `golf-adventure` · `pub-navigator` · `comedy-room` · `sports-19th-hole` · `darts` · `cricket` · `quntum-leeks` · `boardroom` · `play` · `learn` · `platform` · `process` · `panel-interaction`
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
- Status: CLOSED — id:st_andrews_2000, era-2000/lb-2000, Tiger/Monty players, 3 holes (1st Burn, 17th Road Hole, 18th Valley of Sin). 19-under, no bunkers, BBC silence. tournaments.js.

### BL-041 — Golf Adventure: 2011 US Open Congressional (Rory 8-shot)
- Epic: Modern Majors Tier 2
- Rory McIlroy 8-shot win at 22. After Masters collapse. Utterly dominant. NBC. Players: Rory (protagonist), Jason Day (distant second).
- Feature: golf-adventure
- CD3: UBV=8 TC=5 RR=1 → CoD=14, Dur=3, **CD3=4.7**
- Status: CLOSED — id:congressional_2011, era-2011-us/lb-2011-us, Rory/Jason Day players, 3 holes. 8-shot win, Augusta answer. tournaments.js.

### BL-042 — Golf Adventure: 2002 Open Muirfield (Els 4-way playoff)
- Epic: Modern Majors Tier 2
- 4-man playoff (Els, Elkington, Levet, Appleby). Els wins. Thomas Levet falls over after hole-in-one celebrations. BBC. Players: Els (protagonist), Levet (comedy foil).
- Feature: golf-adventure
- CD3: UBV=7 TC=5 RR=1 → CoD=13, Dur=3, **CD3=4.3**
- Status: CLOSED — id:muirfield_2002, era-2007 reused, Els/Levet players, 3 holes (9th, 14th — the fall, 18th playoff). Levet falls over, hobbles to playoff, loses.

### BL-043 — Golf Adventure: 2011 Open Sandwich (Darren Clarke)
- Epic: Modern Majors Tier 2
- Clarke wins three weeks after anniversary of wife Heather's death. Emotional. Sky. Players: Clarke (protagonist), Phil Mickelson / Dustin Johnson (foils).
- Feature: golf-adventure
- CD3: UBV=8 TC=5 RR=1 → CoD=14, Dur=3, **CD3=4.7**
- Status: CLOSED — id:sandwich_2011, era-2011/lb-2011, Clarke/Dustin Johnson players, 3 holes (4th Suez Canal, 14th, 18th Home). Clarke weeps, cigar, pint. tournaments.js.

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
- Status: CLOSED — id:kiawah_2012_pga, era-2012 reused, Rory/David Lynn players, 3 holes (10th, 16th, 18th). Eight again. tournaments.js.

### BL-046 — Golf Adventure: 2004 Masters (Phil's first major)
- Epic: Modern Majors Tier 2
- Phil Mickelson's first major after 0-for-46. Arms in air on 18. Ernie Els misses short putt on 18 to tie. CBS.
- Feature: golf-adventure
- CD3: UBV=7 TC=4 RR=1 → CoD=12, Dur=3, **CD3=4.0**
- Status: CLOSED — id:augusta_2004, era-2005 reused, Phil/Els players, 3 holes (13th, 16th, 18th). Phil drives 18 and birdies, Bones runs 50 yards, Els misses putt. tournaments.js.

### BL-047 — Golf Adventure: 2012 Masters (Bubba Watson)
- Epic: Modern Majors Tier 2
- Bubba Watson punch hook from pine straw on 10 in playoff. Weeps at the hole. CBS. Players: Bubba (protagonist), Louis Oosthuizen (foil).
- Feature: golf-adventure
- CD3: UBV=7 TC=4 RR=1 → CoD=12, Dur=3, **CD3=4.0**
- Status: CLOSED — id:augusta_2012, era-2012 reused, Bubba/Oosthuizen players, 3 holes (2nd albatross, 10th pine straw, 18th playoff). The hook shot. Bubba weeps. tournaments.js.

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
- Status: CLOSED — already in _AUTHORS_POOL via BL-061 delivery

### BL-063 — Author Epilogue: J.R.R. Tolkien
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: mythic scope, Elvish, appendices, ancestral lineage. Structural tell: the appendix is longer
  than the summary. Wound: insists on naming the course in Elvish before describing any shots.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — already in _AUTHORS_POOL via BL-061 delivery

### BL-064 — Author Epilogue: James Patterson
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: short chapters, everything DRAMATIC, pace pace pace. Structural tell: chapter numbers for
  every sentence. Wound: novel has 94 chapters. Closing: a cliffhanger about the 19th hole.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — already in _AUTHORS_POOL via BL-061 delivery

### BL-065 — Author Epilogue: Terry Pratchett
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: footnotes, satire, truth disguised as comedy. Structural tell: *A FOOTNOTE ABOUT THE PHYSICS
  OF GOLF BALLS.* Death plays off scratch. Nobody will acknowledge this. Wound: the footnote is longer.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — already in _AUTHORS_POOL via BL-061 delivery

### BL-066 — Author Epilogue: P.G. Wodehouse
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: Jeeves, gentle chaos, upper-class incompetence. Structural tell: Bertie wanders in uninvited.
  Wound: Bertie's handicap. It is not improving. Jeeves has opinions on this that he does not share.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — already in _AUTHORS_POOL via BL-061 delivery

### BL-067 — Author Epilogue: Jane Austen
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: social comedy, manners, sly observation. Structural tell: "It is a truth universally
  acknowledged…" Wound: the club secretary's conduct. It has been noted. It will not be forgotten.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — already in _AUTHORS_POOL via BL-061 delivery

### BL-068 — Author Epilogue: Hunter S. Thompson
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: gonzo, paranoid, political, drugs. Structural tell: "We were somewhere around the 7th hole
  when the drugs began to take hold." Wound: the caddie. The caddie was no longer human.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — id:thompson added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-069 — Author Epilogue: Raymond Chandler
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: hardboiled, noir, Los Angeles similes. Structural tell: the green was as smooth as a lie told
  by a man who'd told better ones. Wound: the woman watching from the clubhouse. She knows something.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — id:chandler added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-070 — Author Epilogue: Oscar Wilde (existing character — epilogue template)
- Epic: Author Epilogue
- Depends on: BL-061
- Existing panel character. Needs epilogue prompt template only (no new character file).
- Voice: every shot is an epigram. Suffering is merely bad taste. The ball knows it's being watched.
  Structural tell: the closing epigram is better than everything that preceded it. Wound: the rough.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — id:wilde added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-071 — Author Epilogue: Agatha Christie
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: suspects everywhere, the reveal, Poirot. Structural tell: Poirot has known since the 3rd hole.
  He merely waited for the confession. Wound: the alibi for the missed putt doesn't hold up.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — id:christie added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-072 — Author Epilogue: J.K. Rowling
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: wizarding lens + extended commentary on themes. Structural tell: everyone is sorted into houses.
  Wound: the game is inadvertently problematic on several levels she would like to address at length.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — id:rowling added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-073 — Author Epilogue: Dan Brown
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: every sentence a cliffhanger, symbols, codes, the Vatican. Structural tell: the symbol on the
  scorecard was not a birdie. It was a warning. Wound: the caddie knew about the Priory of the Tee.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — id:danbrown added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-074 — Author Epilogue: Enid Blyton (existing character — epilogue template)
- Epic: Author Epilogue
- Depends on: BL-061
- Existing panel character (Slightly Squiffy Blyton). Needs epilogue prompt template only.
- Voice: Famous Five adventure. The rough is a secret passage. Everyone is jolly or a villain.
  Has had a couple. Structural tell: there is a mystery. It involves the greenkeeper.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — id:blyton added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-075 — Author Epilogue: Isaac Asimov
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: rational, systematic, Three Laws applied. Structural tell: Three Laws of Golf. The caddie is
  a robot. It cannot harm a golfer except through incorrect club selection. Wound: the First Law fails.
- Feature: comedy-room
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — id:asimov added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-076 — Author Epilogue: Leo Tolstoy
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: vast, philosophical, suffering as meaning. Structural tell: one round = 600 pages of context.
  The birdie at the 7th is a microcosm of the human condition. Wound: the character on the bench.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: CLOSED — id:tolstoy added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-077 — Author Epilogue: Charlotte Brontë
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: gothic, moors, passion, unspoken feeling. Structural tell: the rough is the moors. Someone
  brooding is in the bunker. It begins to rain with intent. Wound: Mr Rochester. He is always there.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: CLOSED — id:bronte added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-078 — Author Epilogue: John le Carré
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: paranoid, espionage, nobody is who they say. Structural tell: everyone at the club is working
  for someone else. The caddie has a past. The scorecard was a message. Wound: the mole.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: CLOSED — id:lecarre added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-079 — Author Epilogue: Wilbur Smith
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: adventure, vast scale, raw masculinity. Structural tell: impossible distances. Someone is
  hunting something. The game takes place across a continent. Wound: the lion on the 16th.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: CLOSED — id:wilbursmith added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-080 — Author Epilogue: Jeffrey Archer
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: shameless, self-aggrandising, economical with truth. Structural tell: he had never lost a round
  of golf, he told himself. This was not entirely true. It was not true at all. Wound: the scoreboard.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: CLOSED — id:archer added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

### BL-081 — Author Epilogue: Barbara Cartland
- Epic: Author Epilogue
- Depends on: BL-061
- Voice: romance, heaving bosoms, pastel, eternal love. Structural tell: her heart fluttered as he
  approached the 18th hole. His grip was masterful. Wound: his handicap. It was seven. Irresistible.
- Feature: comedy-room
- CD3: UBV=4 TC=2 RR=1 → CoD=7, Dur=2, **CD3=3.5**
- Status: CLOSED — id:cartland added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js

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
- Status: CLOSED — id:twain added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js — raised 2026-03-10

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
- Status: CLOSED — id:king added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js — raised 2026-03-10

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
- Status: CLOSED — id:shakespeare added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js — raised 2026-03-10

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
- Status: CLOSED — id:bede added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js — raised 2026-03-10

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
- Status: CLOSED — id:herbert added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js — raised 2026-03-10

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
- Status: CLOSED — id:collins added to _AUTHORS_POOL and _AUTHOR_VOICES in golf-adventure.html + logic.js — raised 2026-03-10

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
- Status: CLOSED — shipped 2026-03-14. Commit 3ce97fd. Boardroom, Roast Room, Writing Room, House Name Oracle, Ironic, Professionals. 19-scenario Gherkin. Remaining panels (roastbattle, comedylab, bills, old feedback() panels) deferred.

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
- Status: CLOSED — c31e891 (Football Author Epilogue: button in #fb-output, 27-author pool, queue management, getLastContext() API)

### BL-083 — Author Epilogue: Phase 2 — Darts integration
- Epic: Author Epilogue
- Depends on: BL-082
- Feature: comedy-room
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — dba21c1

### BL-084 — Author Epilogue: Phase 2 — Cricket Long Room integration
- Epic: Author Epilogue
- Depends on: BL-082
- Feature: comedy-room
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — dba21c1

### BL-085 — Author Epilogue: Phase 2 — Oracle conversation integration
- Epic: Author Epilogue
- Depends on: BL-082; Oracle must have a session narrative to summarise
- Feature: comedy-room
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — dba21c1

### BL-086 — Author Epilogue: Phase 2 — Boardroom session integration
- Epic: Author Epilogue
- Depends on: BL-082
- Feature: comedy-room
- CD3: UBV=6 TC=1 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — dba21c1

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
- Status: CLOSED — 2026-03-11 (910744f): feature-report.sh script, Feature: field added to BL/WL schema, 61 BL items backfilled, feature-report.feature Gherkin, closedown step 1b added.

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

### BL-140 — Spit Shelter Q&A: fix invisible suggestion cards + horizontal scroll

- Bug: suggestion cards in Q&A mode are invisible (dark text on dark background) because CSS colour rules cover categories golf/big/contemporary/absurd but HipHop uses legacy/roast/beef/craft — no matching CSS rule → transparent background.
- Second bug: cards appended directly to `hh-suggestion-tray` outer div instead of inner `gf-suggestion-scroll` div — no flex/overflow-x horizontal layout.
- Fix: (1) add `.gf-suggestion-card[data-cat="legacy"]`, `[data-cat="roast"]`, `[data-cat="beef"]`, `[data-cat="craft"]` CSS rules with distinct colours; (2) add `<div class="gf-suggestion-scroll" id="hh-suggestion-scroll">` inside `#hh-suggestion-tray` in HTML; (3) update `_buildSuggestions()` to target `hh-suggestion-scroll` inner div.
- Feature: platform
- WL: WL-136
- CD3: UBV=5 TC=4 RR=2 → CoD=11, Dur=1, **CD3=11.0**
- Status: CLOSED — 618bd9c

### BL-139 — Character audit: 6 characters with no active panel assignment

- Six character files have no `# Panel:` line and no clear active-panel wiring: `bruce-lee.md`, `buddha.md`, `chuck-norris.md`, `nostradamus.md`, `sun-tzu.md`, `vinny-jones.md`. Also: `adams.md`, `cox.md`, `alliss.md`, `souness.md`, `roy-keane.md` missing header line despite being in-panel (older format).
- Action: for each unassigned character, decide: (a) assign to a panel with a plan, (b) mark as Author Pool only, or (c) retire. For older-format panel characters: add `# Panel:` line to match current standard.
- Also: 7 `watching-oche-*.md` files intentionally different format — confirm and document.
- Feature: platform
- CD3: UBV=3 TC=1 RR=2 → CoD=6, Dur=1, **CD3=6.0**
- Status: CLOSED — 2026-03-15. # Panel: headers added to all 11 character files. watching-oche-*.md format confirmed intentional (uses ## Watching the Oche panel member — accepted variant). BL-157 raised (Vinny Jones wiring). BL-158 raised (Souness's Cat rethink).

### BL-130 — Snooker panel: The Crucible Corner

- Title: The Crucible Corner — snooker panel (Mode 1 Q&A + Mode 2 match simulation)
- Description: New sports panel for snooker, following the Final Furlong structure (Mode 1: Q&A with suggestion cards; Mode 2: match/frame simulation). Characters and Mode 2 game mechanics TBD — Three Amigos session required. Candidate characters: Steve Davis, John Virgo, Dennis Taylor, Ronnie O'Sullivan, Willie Thorne (DEAD_IN_PANEL_WORLD), Ray Reardon (DEAD_IN_PANEL_WORLD), John Parrott, Mark Williams. Mode 2 ideas: frame scoring, shot selection (safety/pot/snooker), risk vs reward, commentary from the panel. Rod raised 2026-03-13.
- Feature: sports
- CD3: UBV=7 TC=6 RR=5 → CoD=18, Dur=5, **CD3=3.6**
- Status: CLOSED — delivered 2026-03-13, commit b90da5d. 9 members (Jimmy White host, 8 rotating, 2 DEAD_IN_PANEL_WORLD), Mode 1 Q&A with 14 suggestion cards, Mode 2 Frame Simulation with 7 reds × 7 spins × 5 positions. 1662/1662 Gherkin passing.
- Epic: Sports Panels


### BL-141 — Suggestion cards: cap display at 5 + refresh button

- Title: Suggestion cards — cap display at 5, add refresh button (below tray, left-aligned)
- Description: Two UX improvements to suggestion cards across all sports panels (Football, Golf, Darts, Cricket/Long Room, Horse Racing, Snooker, Spit Shelter):
  1. **Cap display at 5**: `buildSuggestions()` and each panel's `_buildSuggestions()` currently show ALL pool cards. Limit to 5 randomly selected cards on load.
  2. **Refresh button**: Below each suggestion tray, left-aligned. Clicking clears tray and picks a fresh random 5 from the pool. Button text: "↻ More questions" or similar.
- Click behaviour unchanged: clicking a card sets input value (replacing whatever was there). No card state change needed.
- Three Amigos confirmed 2026-03-15: 5 on all panels, button below-left. Pool expansion is separate (BL-142).
- Panels in scope: Football (FB_SUGGESTIONS), Golf (GOLF_SUGGESTIONS), Darts (DT_SUGGESTIONS), Cricket (LR_SUGGESTIONS), Horse Racing (HR_SUGGESTIONS), Snooker (SNOOKER_SUGGESTIONS in crucible-corner-data.js), Spit Shelter (spit-shelter-data.js).
- Implementation: `buildSuggestions()` shared across Football/Golf/Darts/Cricket/Racing — one change covers 5 panels. Snooker and HipHop have IIFE-internal `_buildSuggestions()` — update separately. Refresh button rendered by `buildSuggestions()` / internal equivalent, inserted after the tray element.
- Feature: platform / UX
- CD3: UBV=6 TC=4 RR=3 → CoD=13, Dur=3, **CD3=4.3**
- Status: CLOSED — commit a453112 (2026-03-15). buildSuggestions() + Snooker/HipHop IIFEs all cap at 5, refresh button below tray. CSS for .suggestion-refresh-btn. Gherkin updated across 4 feature files. Pipeline green.

### BL-142 — Suggestion card pool expansion: all panels to 30 questions

- Title: Expand suggestion card question pools to 30 questions per panel
- Description: All sports panels currently have 12–14 questions. With BL-141's refresh mechanic (5 at a time), a pool of 12 only gives ~2 meaningful refreshes before repeating. Target: 30 questions per panel so a session delivers 6 unique views before cycling. Panels in scope: Football, Golf, Darts, Cricket (Long Room), Horse Racing, Snooker, Spit Shelter.
  - Football: +18 questions (match, big, contemporary, absurd categories — keep proportions)
  - Golf: +5 questions (already 25 — top up to 30)
  - Darts: +18 questions
  - Cricket: +18 questions
  - Horse Racing: +18 questions
  - Snooker: +16 questions (currently 14)
  - Spit Shelter: TBD (check current pool size first)
- Data-only change: adds entries to existing pool arrays. No new code paths. No Gherkin needed per data-addition rule.
- Depends on: BL-141 (refresh mechanic makes pool depth worthwhile)
- Feature: platform / UX / content
- CD3: UBV=5 TC=2 RR=2 → CoD=9, Dur=3, **CD3=3.0**
- Status: CLOSED — commit de7f75b (2026-03-15). All 7 panels at 30 questions. Data-only change. Pipeline green.

---

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
- Status: CLOSED — shipped 2026-03-14. Commits: c19b943 (17 character files), 8012929 (panel IIFE, HTML, nav, data file, 42 Gherkin scenarios). 1704/1704 Gherkin green.

---

### BL-132 — School Mode: cross-panel prompt convention (spec + apply to Spit Shelter launch)

- Description: School Mode is a generalised character action with four outcomes, crossing all panels. Spec the convention, document GOAT domain declarations, write School Mode language into Spit Shelter launch character files. Flag Cox, Bristow, and Faldo as backfill candidates (no immediate BL item — add when those characters are next touched). The mechanic: character attempts to educate the panel on How It's Done. Four outcomes based on GOAT status × explanation quality: SCHOOL_SUCCESS (GOAT + good explanation — room goes quiet), SCHOOL_FUMBLE (GOAT + bad explanation — "I just do it"), SCHOOL_ATTEMPT (non-GOAT + makes sense — panel unconvinced), SCHOOL_DISASTER (non-GOAT + bad explanation — canonical: Ice T attempts to school Tupac on authenticity). Dre is the canonical SCHOOL_SUCCESS — deploys maximum twice, which is what makes it land. JCC is a special case: different category entirely, predates the panel, panel cannot argue but doesn't accept his domain's authority either.
- Output: School Mode spec section added to .claude/practices/ or character file conventions. Each launch character file includes goatDomains and school mode behaviour in Character Rules.
- Feature: spit-shelter
- Epic: The Spit Shelter
- CD3: UBV=7 TC=8 RR=7 → CoD=22, Dur=1, **CD3=22.0**
- Status: CLOSED — shipped 2026-03-14. Spec written to .claude/practices/school-mode-convention.md. All 17 Spit Shelter character files include School Mode declarations in Character Rules. Backfill candidates flagged (Cox, Bristow, Faldo).

### BL-133 — Comedy Room: add Dave Chappelle

- Description: Add Dave Chappelle as a Comedy Room member. Sharp social commentary, racial honesty, the bit that lands because it's true. ConspireEngine pattern: Chappelle and Hicks — both ask the question that collapses the premise; Chappelle's version arrives from lived experience, Hicks's from philosophical rage. Tension because their conclusions often converge but their methodologies are suspicious of each other.
- Output: Character file characters/chappelle.md; Chappelle member object added to ComedyRoom MEMBERS array in index.html.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — a936cee (Chappelle added to Comedy Room MEMBERS)

### BL-134 — Comedy Room: add Richard Pryor

- Description: Add Richard Pryor as a Comedy Room member. Confessional, raw, vulnerable — comedy from personal catastrophe. Pryor is the room's open wound. Carlin filed the system's crimes; Pryor filed his own. ConspireEngine pattern: Pryor and Hicks — Pryor surfaces the personal; Hicks responds with the structural. Pryor's wound is literal (the freebase fire). Pryor and Chappelle: generational tension — the kid who inherited the tradition doesn't always acknowledge the cost.
- Output: Character file characters/pryor.md; Pryor member object added to ComedyRoom MEMBERS array in index.html.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — a936cee (Pryor added to Comedy Room MEMBERS)

### BL-135 — Comedy Room: add Louis CK

- Description: Add Louis CK as a Comedy Room member. Deadpan, observational, existential dread beneath domestic comedy. The room knows about the allegations — that's the wound. His status in the room is contested. ConspireEngine pattern: Louis and Jimmy Carr — both use darkness as a mechanism; Jimmy arrives at the punchline clean; Louis circles the thing until it's unbearable. Pryor finds Louis's self-flagellation performative. Hicks would have complicated views.
- Output: Character file characters/louisk.md; Louis CK member object added to ComedyRoom MEMBERS array in index.html.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — a936cee (Louis CK added to Comedy Room MEMBERS)

### BL-136 — Comedy Room: add Jim Jefferies

- Description: Add Jim Jefferies as a Comedy Room member. Australian, gun control as primary mission (the Bare 2008 bit), religion, crude observational. ConspireEngine pair with Carlin: both arrive at the conclusion; Jefferies arrives via blunter instrument. Pair with Hicks: Hicks asks the philosophical question; Jefferies asks the same question then swears about it for four minutes. Jefferies and Chappelle: both have done the routine that gets pulled; different contexts; different readings of that event.
- Output: Character file characters/jefferies.md; Jefferies member object added to ComedyRoom MEMBERS array in index.html.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — 5820726 (Jefferies added to Comedy Room MEMBERS)

### BL-137 — Comedy Room: add Ricky Gervais

- Description: Add Ricky Gervais as a Comedy Room member. Atheism as primary operating system, celebrity as both wound and mechanism (The Office made him famous; he's been mining that ever since), the laugh at his own jokes before the room gets there. ConspireEngine pair with Jimmy Carr: both are hyper-aware that they're performing comedy at the room; Jimmy's transaction completes clean; Gervais's always has a meta-layer about the transaction itself. Pair with Louis: both circle self-knowledge; Gervais's is more defended than Louis's.
- Output: Character file characters/gervais.md; Gervais member object added to ComedyRoom MEMBERS array in index.html.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — 5820726 (Gervais added to Comedy Room MEMBERS)

### BL-138 — Comedy Room: add Frankie Boyle

- Description: Add Frankie Boyle as a Comedy Room member. Scottish, dark political comedy that is specific to the point of forensic, works at the register ceiling by default (never warming up), targets the specific failure not the general one. ConspireEngine pair with Chappelle: both work at the wrong-laugh/right-laugh boundary; Boyle's version is more aggressive and more interested in making the room uncomfortable than correcting the laugh. Pair with Jimmy: both use darkness; Jimmy's transaction is clean; Boyle's is deliberately not; Boyle finds Jimmy's cleanliness a form of cowardice.
- Output: Character file characters/boyle.md; Boyle member object added to ComedyRoom MEMBERS array in index.html.
- Feature: comedy-room
- CD3: UBV=6 TC=2 RR=1 → CoD=9, Dur=2, **CD3=4.5**
- Status: CLOSED — 5820726 (Frankie Boyle added to Comedy Room MEMBERS)

---

### BL-143 — Narrative Move Model: Golf panel walking skeleton (NarrativeMove + MoveProfile + TURN_RULES replacement)

- Description: Introduce the NarrativeMove domain concept to the Golf panel interaction model. The current TURN_RULES RULE 2 mandates every character open by reacting to the previous speaker — this produces a transactional reaction chain with no narrative arc. The fix: replace the mandatory reaction instruction with a NarrativeMove assignment. Before each character's turn, the engine selects a move type from that character's MoveProfile (weighted distribution). The selected move type becomes a prompt instruction that governs how the character contributes. Six move types: EXTEND (push the arc further), PIVOT (sideways — new angle, same subject), CHALLENGE (raise the unmade argument), ARRIVE (come at the original question fresh, barely acknowledging what was said), DIGRESS (follow something tangentially related — where profound answers come from), UNDERMINE (question the framing not the content). Golf panel is the proof-of-concept. Three Amigos agreed 2026-03-15: Golf first, walking skeleton only — no ConversationArc accumulation yet (BL-144), no arc state guard yet (BL-145). Prompted by Rod observing that the golf panel (Nicks, Radar, Coltart, McGinley) had generative narrative arcs in early sessions that have since degraded to reaction chains.
- Output: (1) selectNarrativeMove(characterId, moveProfile, recentMoves) in pipeline/logic.js — pure function, returns a NarrativeMove; (2) MoveProfile data added to Golf character data (radar, faldo, alliss, coltart, mcginley, price, and others as needed); (3) Golf panel prompt builder: TURN_RULES RULE 2 replaced with move type instruction; (4) Gherkin scenarios covering move selection and prompt contract.
- Feature: golf-adventure
- Epic: Narrative Move Model
- CD3: UBV=9 TC=8 RR=6 → CoD=23, Dur=3, **CD3=7.7**
- Hypothesis:
  - **Actor:** Rod running the Golf panel Q&A
  - **AARRR:** Retention — Rod continues using the panel because conversation is generative
  - **Signal:** Rod's exploratory test finds narrative arcs where characters advance the story rather than react
  - **Falsifier:** After implementation, exploratory test shows same reaction-chain behaviour as before
  - **Window:** 1 exploratory session
- Depends on: none (Golf-first, independent)
- Decomposition note: BL-144 (ConversationArc accumulation), BL-145 (arc state guard) follow once walking skeleton is proven
- Status: CLOSED — 2026-03-15. Pipeline GREEN 1775/1775. TURN_RULES RULE 2 replaced in Golf (REACTIVITY OBLIGATION → YOUR OWN ANGLE FIRST). NARRATIVE POSTURE blocks added to all 9 Golf members. BDD gate: golf-narrative-posture.feature (11 scenarios, all passing). Exploratory test pending (Rod to run live).

---

### BL-144 — Narrative Move Model: ConversationArc accumulation (Golf panel)

- Description: Extend BL-143's NarrativeMove model with client-side ConversationArc accumulation. After each character response lands, the JS appends a 1-sentence summary of that contribution to an arc log string. The arc log is passed to each subsequent character's prompt alongside the original question. This replaces "react to the previous speaker's last sentence" with "here is where the story has gone — advance it." Walking skeleton (BL-143) must be proven first.
- Feature: golf-adventure
- Epic: Narrative Move Model
- CD3: UBV=8 TC=5 RR=4 → CoD=17, Dur=2, **CD3=8.5**
- Depends on: BL-143 CLOSED
- Status: CLOSED — 2026-03-15. Commit 74628f2. arcLog accumulation added to Golf discuss(). First sentence extracted per response, attributed by name, injected as NARRATIVE ARC SO FAR block for subsequent characters. 5 Gherkin scenarios. Pipeline GREEN.

---

### BL-145 — Narrative Move Model: arc state guard (prevent consecutive same move type)

- Description: Extend BL-143/BL-144 with an arc state guard. If the last N moves (e.g. 3) were all the same NarrativeMove type, the engine suppresses that type for the next character's selection — forcing a different move. Prevents conversation stalling in a single register (e.g. all CHALLENGE = debate club; all ARRIVE = characters ignoring each other). Guard logic lives in selectNarrativeMove() — takes recentMoves[] as existing parameter.
- Feature: golf-adventure
- Epic: Narrative Move Model
- CD3: UBV=6 TC=3 RR=5 → CoD=14, Dur=1, **CD3=14.0**
- Depends on: BL-143 CLOSED
- Status: CLOSED — 2026-03-15. Commit b2d15cd. postureType field added to 9 Golf members (analytical: faldo/butch/mcginley, narrative: murray/dougherty/coltart, challenge: radar/roe/henni). recentMoves[] tracked per turn. Guard checks last 3 — if same register, injects REGISTER BREAK instruction. 14 Gherkin scenarios. Pipeline GREEN.

---

### BL-146 — Golf panel: character technical knowledge enrichment (research spike)

- Description: Golf panel characters currently have strong personality and wound prompts but lack specific golf technical knowledge. The panel should feel like genuine experts who know the game, talk about mechanics, diagnose what the player did wrong, try to teach each other (and the user), and reference each other's careers accurately. Requires CHARACTER RESEARCH PROTOCOL for each panel member before writing prompts: real technical opinions, coaching philosophy, diagnostic lens, career-specific knowledge, what they know about each other's games. Members in scope: Faldo (ball flight, commitment, swing mechanics), Butch (coaching eye, TrackMan, what went wrong technically), Radar (execution vs theory, the Australian read), McGinley (course management matrix, Ryder Cup captaincy lens), Murray (historical weight of every technical decision), Dougherty (belief in improvement, his own playing experience), Coltart (what he'd have done differently, hole-by-hole diagnosis), Roe (weird technical tangent, usually accurate, always unexpected), Henni (the question nobody asked about the technical choice). Also: what each character knows about the others' careers — cross-knowledge for panel interactions. Output: enriched game knowledge block added to each character's prompt in index.html. Depends on BL-143 (narrative posture structure established first, so knowledge enrichment lands in the right shape).
- Feature: golf-adventure
- Epic: Narrative Move Model
- CD3: UBV=8 TC=6 RR=4 → CoD=18, Dur=3, **CD3=6.0**
- Depends on: BL-143 CLOSED
- Status: OPEN — raised 2026-03-15

---


### BL-147 — Football panel rename: "Post Game Cunditry" → "Post Match Cunditry"

- Description: The football panel is currently labelled "Post Game Cunditry" in the tab, panel title, and panel registry. "Post Match" is more idiomatic for football (not "Post Game" — that's American English). Simple find-replace across index.html (tab label, panel-title div, panel registry entry, module comment).
- Output: 4 occurrences in index.html updated. No new code paths.
- Feature: football
- Epic: none
- CD3: UBV=2 TC=1 RR=1 → CoD=4, Dur=0.1, **CD3=40.0**
- Hypothesis: Labelling is more idiomatic. No falsifier — cosmetic.
- Depends on: none
- Status: CLOSED — 2026-03-15. Panel renamed. Gherkin specs (nav-landing.feature, nav-restructure.feature) and gherkin-runner.js panel registry updated. Pipeline GREEN 1775/1775.

---

### BL-148 — Bruce Lee: remove from football panel; confirm literary/Boardroom/PhilsOpoly placement

- Description: Bruce Lee currently appears in Boardroom, ComedyRoom, Football, Golf, and PhilsOpoly. Rod wants him removed from Football panel. Rod also mentioned "literary" panel — no panel by this name exists; closest is WritingRoom (authors). Needs clarification on whether Bruce should be added to WritingRoom. Boardroom and PhilsOpoly already have him. Remove from Football BASE_ORDER and member definitions only.
- Output: Bruce Lee member object and BASE_ORDER entry removed from Football IIFE. WritingRoom: TBC after clarification.
- Feature: football
- Epic: none
- CD3: UBV=3 TC=1 RR=1 → CoD=5, Dur=0.2, **CD3=25.0**
- Depends on: none
- Status: CLOSED — 2026-03-15. Bruce removed from Football panel (member object + BASE_ORDER). Already present in Boardroom, ComedyRoom, PhilsOpoly. WritingRoom addition: pending Rod's clarification on "literary" panel intent.

---

### BL-149 — Add Roy Keane to football panel

- Description: Roy Keane has a character file (characters/roy-keane.md) but it is formatted as a pub-crawl guest, not a football panel pundit. Need to build a full panel member object (id, name, icon, colour, bg, system prompt as pundit) for the Football IIFE and add him to BASE_ORDER. Panel member prompt should draw from roy-keane.md: Cork accent, clipped sentences, standards, fury-under-control, key wounds.
- Output: Roy Keane member definition added to Football IIFE members array; added to BASE_ORDER.
- Feature: football
- Epic: none
- CD3: UBV=6 TC=2 RR=2 → CoD=10, Dur=1, **CD3=10.0**
- Hypothesis: Keane on the football panel brings standards-based comedy that Souness/Neville/Carragher don't have — different register.
- Depends on: BL-148 (football panel housekeeping done first)
- Status: CLOSED — 2026-03-15. Full panel member object added (id:'keane', prompt with Cork voice, wounds, narrative posture). Added to BASE_ORDER, FB_PREM_CONFIG affinities, FB_LIE_PROFILES, FOOTBALL_WOUNDS, FOOTBALL_NAMEMAP, FOOTBALL_PRE_EXISTING, FOOTBALL_VOICE_FMT, RECOVERY_STRATEGIES. Pipeline GREEN 1775/1775.

---

### BL-150 — Add Rodney Marsh to football panel (new character)

- Description: Rodney Marsh (QPR, Man City, England; pundit; famously sacked for 1973 relegation joke; "I'm 100% committed to 50% of everything I do") has no character file. Requires CHARACTER RESEARCH PROTOCOL before implementation. Will need: character identity, voice, comedy engine, wounds, panel member object.
- Output: characters/rodney-marsh.md created; member object added to Football IIFE; added to BASE_ORDER.
- Feature: football
- Epic: none
- CD3: UBV=6 TC=3 RR=3 → CoD=12, Dur=2, **CD3=6.0**
- Hypothesis: Marsh brings a different era of footballing pundit — unapologetic, irreverent, pre-Sky era directness. Contrast with modern analytics (Neville) and rage (Keane/Souness).
- Depends on: BL-149 (football housekeeping done first)
- Status: CLOSED — 2026-03-15. characters/rodney-marsh.md created. Full panel member object added (id:'marsh', QPR legend, tsunami joke wound, Soccer Saturday snub, Ramsey 9 caps, Francis Lee blame). Added to BASE_ORDER, all Football config structures. Also: Bruce Lee added to WritingRoom (WR_AUTHORS_POOL + voice signature). Pipeline GREEN 1775/1775.

---

### BL-151 — Per-character mode selector: character-level atmosphere/posture overrides

- Description: The current atmosphere/mode selectors (bloodbath, powder keg, etc.) apply panel-wide. Rod wants the ability to apply character-level posture overrides independently — turning a specific character into an antagonist, sycophant, weirdo, etc. for a session. Examples of per-character modes: ANTAGONIST (hostile to all positions), SYCOPHANT (agrees with and amplifies everything), WEIRDO (lateral, unexpected, possibly incoherent register), OVERLY_STIMULATED_EROTICALLY (everything is about something else), MUSHY (uncharacteristic warmth, may be alarming), PATERNAL (protective/disappointed, treats room as children), NOSTALGIC (everything connects to a golden past), ANGRY (volcanic, barely controlled), INFURIATED (past volcanic — actually incandescent), PERPLEXED (genuinely cannot follow what's happening, asks clarifying questions). Implementation: a per-character override selector (dropdown or toggle) in the panel UI that injects a posture modifier into that character's prompt before the main TURN_RULES. The override is session-local — resets on next submit unless held. Multiple characters can have different overrides simultaneously.
- Output: Per-character mode UI element added to each panel that supports it; character-level posture modifier injected into the relevant character prompt at discuss() time; at minimum covers Football panel as proof-of-concept.
- Feature: football (PoC), then other panels
- Epic: Character Mode Overrides
- CD3: UBV=8 TC=5 RR=4 → CoD=17, Dur=3, **CD3=5.7**
- Hypothesis:
  - **Actor:** Rod running a panel
  - **AARRR:** Engagement — Rod can craft specific tension dynamics (one antagonist, one sycophant) rather than relying on panel-wide atmosphere
  - **Signal:** Rod uses per-character overrides to create scenes that wouldn't emerge from the default character mix
  - **Falsifier:** Overrides feel forced or collapse character voice consistency
  - **Window:** First use in a session with overrides active
- Depends on: none (new layer on top of existing prompt structure)
- Status: OPEN — raised 2026-03-15

---

### BL-152 — Narrative posture roll-out: YOUR OWN ANGLE FIRST to Comedy Room, Science Convention, Darts, Long Room

- Description: Rolled out TURN_RULES RULE 2 change (YOUR OWN ANGLE FIRST) to Comedy Room (Into The Room), Science Convention (SounessCat), Darts (Watching the Oche), Long Room (Cricket). Football left unchanged as A/B test baseline. Final Furlong (Horse Racing) was already on YOUR OWN ANGLE FIRST. Snooker and Spit Shelter use array-based TURN_RULES — different structure, out of scope.
- Output: TURN_RULES RULE 2 updated in 4 panels. 5 Gherkin scenarios. Pipeline GREEN.
- Feature: platform
- Epic: Narrative Move Model
- CD3: UBV=7 TC=6 RR=4 → CoD=17, Dur=1, **CD3=17.0**
- Status: CLOSED — 2026-03-15. Commit 177b573. Pipeline GREEN.

---

### BL-153 — Golf panel: add "Howling Mad David" — David Howell

- Description: Add David Howell as a rotating Golf panel member. Character name: "Howling Mad David" (or "Howler"). David Howell — four Ryder Cup appearances, won the BMW PGA, BBC Sports presenter phase. Known for being quietly underrated, slightly intense, occasionally baffling. "Howling Mad" suggests a barely-contained quality that rarely surfaces but when it does, it does. Character voice, wounds, and NARRATIVE POSTURE block needed. postureType to be agreed at Three Amigos. Full member object added to Golf MEMBERS array and rotating BASE_ORDER. Gherkin scenarios required.
- Feature: golf-adventure
- Epic: Narrative Move Model
- CD3: UBV=5 TC=2 RR=1 → CoD=8, Dur=2, **CD3=4.0**
- Status: CLOSED — 2026-03-15. Commit ee75540. Howell member entry added to Golf MEMBERS + both baseOrder variants. 6 Gherkin scenarios. Pipeline GREEN.

---

### BL-154 — Dead Panel Mode: living members spiral into existential dread

- Description: Special game mode for sports panels with existing DEAD_IN_PANEL_WORLD members. All panel members except 1–2 are dead. Dead members behave entirely normally — fully in character, present, opinionated. The living member(s) are visibly unsettled. Their unease escalates across turns: they begin referencing the wrongness obliquely, then more directly, until by the end they genuinely can't rule out that they too are dead. The dead characters are not sinister. They simply don't see what the fuss is about. Comedy engine: the living character's existential spiral vs total dead-character indifference. Applicable panels immediately: Crucible Corner (Thorne + Reardon dead), Final Furlong (McCririck + O'Sullevan dead), Spit Shelter (Biggie + Tupac + Gil dead). Golf panel has no dead members currently — requires a dead member addition before mode applies. Needs Three Amigos on: trigger mechanism (atmosphere selector? separate mode button?), how living character's spiral escalates across turns (TURN_RULES injection?), and whether dead characters get any cue that they're being observed by the living.
- Feature: platform
- CD3: UBV=8 TC=6 RR=7 → CoD=21, Dur=4, **CD3=5.25**
- Status: OPEN — raised 2026-03-15. Three Amigos needed before Gherkin.

---

### BL-155 — Character touchstone moments: shared panel reference library

- Description: Each character has one or more canonical "touchstone moments" — a specific, nameable real-world or panel-world incident that other characters can invoke to rebuke, roast, or celebrate them. Different from a wound (internal) — a touchstone is public, known to the whole panel, and can be weaponised or used warmly. Examples: Howell's "Tommy Firewood" (said on air, everyone knows), Keane's "prawn sandwich" (what he called the corporate crowd), Keane's "Vieira in the tunnel" (aggression made explicit), Dennis Taylor's final black at 12:23am. Other characters reference them mid-panel as shorthand — "this is your Firewood moment" or "in the spirit of the prawn sandwich…". Design approach: equivalence partitioning — group characters by touchstone type (verbal gaffe / confrontation / defining moment / record etc.) and test the mechanic against one representative example per type. If a type needs fixing, add specific examples; these will likely apply across panels and characters. Design questions to resolve at Three Amigos: (1) fixed touchstone library per character (1–3 entries) vs emergent; (2) injected into other characters' prompts or panel-level TURN_RULES shared memory; (3) panel-specific or cross-panel availability. Needs research pass to identify best touchstone candidates per panel before implementation.
- Feature: platform
- CD3: UBV=8 TC=7 RR=6 → CoD=21, Dur=4, **CD3=5.25**
- Status: OPEN — raised 2026-03-15. Three Amigos needed before Gherkin.

---

### BL-158 — Souness's Cat rethink: new mechanic, character set, panel purpose

- Description: Souness's Cat is currently a Schrödinger's Cat comedy panel in Comedy Room. Rod wants a rethink of the feature: what is it actually for, who should be in it, what's the joke? Known candidates: Prof Brian Cox (Science Convention) and Douglas Adams (Science Convention / Author pool) are confirmed by Rod as fits. The feature itself may need a new name, mechanic, or placement. Full Three Amigos required before any Gherkin.
- Feature: comedy-room
- CD3: UBV=6 TC=4 RR=4 → CoD=14, Dur=3, **CD3=4.7**
- Status: OPEN — raised 2026-03-15. Three Amigos needed before any Gherkin.

---

### BL-157 — Vinny Jones: add to football panel and Boardroom

- Description: Vinny Jones has a full character file (`characters/vinny-jones.md`) but is not wired to any panel. Rod confirmed: he should be in The Pub After The Match (Football) and the Boardroom. Implementation follows BL-149 pattern (Roy Keane): full panel member object, BASE_ORDER, config structures (affinities, lie profiles, wounds, namemap, pre-existing, voice format, recovery strategies) for Football; Boardroom member object for Boardroom. Three Amigos needed to agree voice, wound, and Boardroom role.
- Feature: football
- CD3: UBV=5 TC=3 RR=3 → CoD=11, Dur=2, **CD3=5.5**
- Status: OPEN — raised 2026-03-15. Three Amigos needed.

---

### BL-156 — Test design techniques: in-session protocol (EP, BVA, and full set)

- Description: Add equivalence partitioning, boundary value analysis, and a full set of complementary test design techniques as in-session testing protocols. Architecture agreed: `.claude/practices/test-design-techniques.md` (new file, full detail) + one pointer row in session-insession.md REFERENCE FILES + one row in testing-standards.md When to Read table. Keeps insession lean; full detail available on demand. Techniques covered: EP, BVA, decision table, state transition, error guessing, pairwise/combinatorial, use case/scenario, mutation testing (Stryker), property-based (fast-check), risk-based, SBET, cause-effect graphing. Each with: definition, codebase example, layer, authority.
- Feature: platform
- CD3: UBV=4 TC=6 RR=5 → CoD=15, Dur=1, **CD3=15.0**
- Status: CLOSED — 2026-03-15. test-design-techniques.md written. Wired into session-insession.md and testing-standards.md.

### BL-159 — Snooker: expand character speech patterns and example repertoire to reduce repetition

- Description: Snooker characters (Jimmy White, Steve Davis, Ronnie O'Sullivan, Higgins, Werbeniuk et al) are falling into repetitive openers and phrase patterns. Fix: expand each snooker character's prompt with OPENER VARIETY section (6-8 named openers, each distinct), NON-SEQUITUR OPENERS, and an EXPANSION POOL note ("later in session, draw from more obscure references"). Cross-check against existing wound/voice format used in other panels (faldo.md etc as reference). Scope: crucible-corner-data.js character prompts only — data change, no Gherkin gate.
- Feature: content — snooker
- CD3: UBV=3 TC=2 RR=2 → CoD=7, Dur=2, **CD3=3.5**
- Status: OPEN — raised 2026-03-15

---

### BL-160 — Rage-O-Meter: embedded rage tracker for multi-character interaction panels

- Description: Add Rage-O-Meter as an embedded component within interaction panels (panels where named characters respond to each other, not monologue-only modes). Characters auto-populated from the panel's own character set — no manual entry. Per-round sliders let the user rate each character's rage after each response; rage history logged to sparkline bars; post-session summary shows delta-from-baseline. Prototype JS extracted to `rage-o-meter.js` (IIFE). Component shows/hides based on panel type — hidden in monologue/single-voice modes. Three Amigos still needed: (a) define the interaction vs monologue panel classification (data flag vs explicit list); (b) how characters and baseline values are sourced per panel; (c) DOM placement within the panel response area; (d) max character count (prototype caps at 4, some panels have 6+). No AI call — fully self-contained.
- Feature: tools
- Epic: New Standalone Tools
- CD3: UBV=6 TC=2 RR=3 → CoD=11, Dur=3, **CD3=3.7**
- Status: CLOSED — 2026-03-22. Engine + DOM layer shipped. Boardroom wired. All remaining interaction panels wired in same session.

---

### BL-161 — Insult Periodic Table: element selection UI + synthesis via Worker

- Description: Add `insult-periodic-table.html` (prototype complete) to the Cusslab repo. The page renders ~80 insult elements across 8 categories in a periodic-table grid. Player selects 2–4 elements, clicks Synthesise, gets a compound insult with savagery/wit/specificity ratings. Prototype currently calls `api.anthropic.com` directly without a key — must be updated to route through `https://cusslab-api.leanspirited.workers.dev`. Work: file placement, URL swap + model update to Worker-compatible model (haiku), verify Worker response format matches expected `{content:[{text}]}`, nav wiring, pipeline, push. Three Amigos needed before Gherkin: confirm Worker request/response contract, model choice, nav placement.
- Feature: tools
- Epic: New Standalone Tools
- CD3: UBV=7 TC=2 RR=3 → CoD=12, Dur=2, **CD3=6.0**
- Status: CLOSED — shipped 2026-03-22. insult-periodic-table.html at repo root, Worker URL + haiku model, nav link in PLAY group, Gherkin contracts 1808/1808 green.

---

### BL-162 — index.html SRP extraction: decompose into module files with PACT contract tests

- Description: index.html is ~19,700 lines with all JS inline. Extract into discrete responsibility modules (e.g. character data, panel logic, UI, API calls) as separate `.js` files with IIFE wrappers. Add PACT consumer-driven contract tests between modules to catch interface breakage at seams. Output: agreed module map, extraction sequence, test strategy. Start as a spike (output = decision + module map) before delivery stories are raised. Three Amigos needed before spike: agree module boundaries, PACT tooling choice, and whether extraction is file-per-panel or layer-per-concern.
- Feature: architecture
- CD3: UBV=9 TC=8 RR=8 → CoD=25, Dur=4, **CD3=6.25** (rescored 2026-05-16 — execution duration up, but now blocks cross-panel rollout of every new mechanic)
- Status: **OPEN — pulled forward 2026-05-16 by Rod's "one engine, many panels" principle** (`.claude/principles/panel-design.md` Principle 1). Becomes the gatekeeper for BL-167 cross-panel rollout, BL-168 cross-panel rollout, BL-163 (glances), and BL-169 (profani-saurus integration). Without the shared engine, every new mechanic requires per-panel duplication, which Rod has explicitly forbidden. Three Amigos still needed on module boundaries, PACT tooling, layer-vs-panel decomposition.

---

### BL-163 — Cross-character panel references (reacts_to schema field)

- Characters in all panels currently respond to the user's input independently. They do not acknowledge, contradict, or build on what another panellist just said. The relationship matrix exists in character files (wound system, pairwise RelationshipState, debtLedger) but the panel prompt has no schema slot to surface it.
- Fix: add optional `reacts_to` field to each character's response object in the JSON schema. Register options: endorsement | quiet_disagreement | silence_noted | deflation | builds_on. UI renders a subtle thread indicator (thin left-border accent in referenced character's colour, or small "↳ re: [name]" tag) when present. Backwards compatible — absent field renders identically to current.
- Prompt instruction: "Where a character has a strong established relationship with another panellist who has already spoken, they may reference that panellist directly — once, briefly, in their natural register. The relationship does not need to be explained."
- Applies to: all interaction panels (Golf, Football, Boardroom, Long Room, Darts, Comedy Room). Not monologue modes.
- SS port: same mechanic as SS-060 — the two products share the same approach. If SS builds it first, port the schema and UI pattern directly.
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=8 TC=6 RR=4 → CoD=18, Dur=2, **CD3=9.0**
- Status: OPEN — raised 2026-03-28; **Gherkin approved 2026-05-16 (11 scenarios, full text in session transcript / next retro)**; implementation deferred behind BL-167 (panel needs healthier order first); register options trimmed to four (endorsement | quiet_disagreement | silence_noted | deflation); eligibility narrowed to mutual-knowledge pairs only (matrix M7 non-neutral OR explicit known-wound lore)

---

### BL-165 — Panel triage order formalised in prompts (SS-034 port)

- All Cusslab panels currently instruct characters to respond without a defined order. All voices fire at the same weight simultaneously — flat texture, no build, no contrast. The comedy layer has nothing to land against because the authority layer hasn't established the stakes first.
- Fix: formalise a triage order per panel. AUTHORITY tier goes first (establishes the frame), COMEDY/HEAT tier second (complicates or undercuts it), CLOSER tier last (the final word — always the final word). Add `tier` property to each character's config. Prompt instruction: "Characters respond in tier order. Tier 1 establishes the frame. Tier 2 complicates it. Tier 3 closes. The closer always has the last word — not because they demanded it but because what they say is always final."
- Per-panel triage mapping: Golf → AUTHORITY: Faldo/McGinley, COMEDY: Radar/Coltart/Roe/Murray, CLOSER: Cox/Henni. Football → TACTICAL: Souness/Neville/Keane, HEAT: Carragher/Micah, CLOSER: Bigron/Ron. Boardroom → AUTHORITY: Harold/Roy, PERFORMANCE: Sebastian/Ben, OBSERVER/CLOSER: Partridge/Mystic. Long Room → KNOWLEDGE: Holding/Botham, ANECDOTE: Gower/KP, CLOSER: Blofeld.
- Relationship to BL-143/144/145 (Narrative Move Model): triage order is the minimum viable version — prompt-only, no engine changes. Narrative Move Model is the sophisticated follow-on. Both are compatible; triage order ships first.
- SS port: SS-062 is the SS-side spec. Same principle — different panels, same structural fix.
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=7 TC=6 RR=4 → CoD=17, Dur=2, **CD3=8.5**
- Status: **SUPERSEDED 2026-05-16 by BL-167** — anchor + trigger-weighted middle model collapses Tier 1/2/3 framework into a simpler "anchor opens & closes, randomised interior" shape that delivers the same structural goal (frame → complicate → land). Original three-tier prompt instruction not needed.

---

### BL-164 — Decision loop for all interaction panels (Fighting Fantasy mechanic)

- Root cause of the quality gap between Survival School and Cusslab panels: SS has stateful sequential prompting with a consequence engine. Cusslab panels are stateless one-shot — user sends input, panel responds, done. No memory, no stakes, no evolving story.
- Fix: after each panel response, generate `next_gambits` — 3 options the user can try (new insult, counter, escalation, change of tactic). Panel reacts to *which gambit was chosen*, not to a new open prompt. State accumulates. Wound system and RelationshipState fire naturally. Eventually Cracks triggers as turns progress.
- State object mirrors SS pattern: `{situation, turnCount, history:[{gambit, woundsFired}], pressureAccumulation:{perChar}}`.
- Output schema addition: `next_gambits[]`, `wounds_fired[]`, `pressure_delta:{charId:delta}`, `is_terminal:bool`.
- Terminal condition: a character's pressure hits their crack threshold (Eventually Cracks fires), or the panel has closed ranks (no viable gambits remain).
- Proof-of-concept panel: Golf (19th Hole) — tightest existing dynamic. Port to Football, Boardroom, Long Room once working.
- SS port: SS-061 is the SS-side spec of the same mechanic. If SS-061 ships first, port the state model and output schema directly. The two products converge on the same interaction pattern.
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=9 TC=7 RR=6 → CoD=22, Dur=4, **CD3=5.5**
- Hypothesis:
  - **Actor:** Rod running a panel session
  - **AARRR:** Retention — panel sessions feel like a story with stakes rather than one-shot comedy
  - **Signal:** Rod completes 3+ turns in a session rather than submitting once and moving on
  - **Falsifier:** Gambits feel forced; panel reactions don't build coherently on prior turns
  - **Window:** First session with decision loop active on Golf panel
- Status: OPEN — raised 2026-03-28


---

### BL-166 — Darts panel + Eric Bristow (SS crossover character)

- Cusslab has golf, football, boardroom, Long Room. No darts panel yet. Eric Bristow
  as anchor character opens the darts panel. Rod raised Bristow as a shared character
  between Survival School (SS-097) and Cusslab — same character file, different products.
- Bristow register: five-time World Champion, brash, Cockney, absolutely certain,
  wrong domain. Everything is a checkout. The commentary engine applies darts methodology
  to any sport/domain with total conviction. "You need to hit double top under pressure,
  son." Applied to a football match. Applied to a golf chip. Applied to a survival situation.
- Initial darts panel cast hypothesis: Bristow (anchor) + Phil Taylor (cold, methodical,
  does not share Bristow's personality) + Sid Waddell (commentary tier, supernatural
  hyperbole as a first language) + Bobby George (Happy Bobby, sequins, the opposite of
  tactical). Rod to validate cast and provide memories.
- Cross-product: Bristow character file built once at /home/rodent/survival-school/docs/
  characters/eric-bristow.md, referenced in both products. Same verbal register, different
  domain application (darts commentary in Cusslab, fish-out-of-water survival in SS).
- Feature: darts
- Epic: New Panel — Darts
- CD3: UBV=7 TC=4 RR=3 → CoD=14, Dur=3, **CD3=4.7**
- Status: OPEN — raised 2026-03-28

---

### BL-167 — Panel speaker order: trigger-weighted randomisation per round

- All panels currently use a deterministic speaker order — same characters in the same slots every round. Symptoms: pre-baked reactions land on rails (Butch's "I taught you that" always after Faldo); the same hobbyhorse surfaces in the same slot every round (Faldo → Ginsters first → everyone responds inside that frame); texture is predictable and the panel reads as a queue, not a room.
- Fix: per-round speaker selection that randomises WHICH characters speak and IN WHAT ORDER, weighted by who is most likely to be triggered by the previous comment.
- **Trigger score** for candidate speaker B given previous speaker A's turn T. Positive and negative components contribute equally — both can fire B.
  - **Negative pulls:**
    - `+w1` if T contains a trigger-word match against B's wound vocabulary (GOLF_WOUNDS or panel equivalent)
    - `+w2` if B holds an outstanding debt against A (debtLedger.owed)
    - `+w3` if B's current relationshipState temperature toward A is hostile (`simmering`/`hot`)
    - `+w4` if A's posture type just contradicted B's posture/domain (BL-143/144/145 recentMoves)
  - **Positive pulls (equal weight; engine does NOT verify accuracy — misunderstood-but-eager is a feature):**
    - `+w5` if T overlaps with B's enthusiasm primer (per-character keyword/topic list — "philosophy" for Skinner, "the work" for Butch, media-strategy lingo for Partridge, anything for Tufnell)
    - `+w6` if B's current relationshipState temperature toward A is warm (`warm`/`reverent`)
    - `+w7` if T contains a topic B claims as their territory (real expertise or imagined — accuracy irrelevant; the voice handles the misunderstanding via P9 `enthusiastic_confabulation`)
  - Positive and negative scores accumulate — a character with warm temperature toward A whose wound A just hit is BOTH eager and triggered; the trigger system just picks them, the voice surfaces which lens dominates.
  - Floor probability `pmin` so cold/disengaged candidates remain occasionally selectable — otherwise "most triggered" becomes a new deterministic pattern.
- **Anchor model (supersedes BL-165 tier framework):** each panel has one fixed **anchor** character who **opens** every round (sets the room) and **closes** every round (top-and-tails what just transpired). Anchor opener prompt ≠ anchor closer prompt — opener primes, closer reflects on the round just witnessed. Closer slot is the biggest comedy lever in the round (the anchor has heard everything before speaking again).
- **Slot structure per round:**
  - Slot 1: ANCHOR (fixed per panel — opener mode)
  - Slots 2..N-1: trigger-weighted random selection from non-anchor cast (N is panel-configurable; not every character fires every round)
  - Slot N: ANCHOR (same character — closer mode)
- **Anchor identities (settled 2026-05-16):**
  - Golf (19th Hole) → **Murray**
  - Boardroom → **Harold** (Pint of Harold)
  - Football → **Souness** (Ron stays as mid-round artillery)
  - Comedy Room → **Gervais**
  - Phil's-opoly (IDEA, panel not yet shipped) → **Tufnell** — closer slot delivers the named "Tuffers Version of Events" mechanic on whatever the philosophers just said
  - Darts (BL-166, not yet shipped) → **Mardle** (Bristow moves to mid-round chaos role, retains SS crossover)
  - Long Room → Blofeld (existing host)
  - Final Furlong → Alan Brazil (existing host)
  - Crucible Corner → Jimmy White (existing host)
  - Spit Shelter → Eminem (existing anchor)
- **Interacts with:** BL-165 SUPERSEDED — closing BL-165 in favour of this anchor model; BL-163 (glance eligibility computed against whoever actually spoke this round, especially relevant when anchor closes with full round context); WL-149 (anchor not being the perma-first speaker dilutes always-Faldo-Ginsters adoption); WL-131 (opener bleeding will lose the slot context that anchors it).
- **Lands before BL-163** — gives the glance design a healthier panel to land in.
- Open Three Amigos questions: trigger score weights (w1–w7) and `pmin`; remaining anchor identities (Football, Comedy Room, Phil's-opoly); whether anchor identity can vary across sessions (host rotation, like real TV) — out of scope for v1.
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=9 TC=7 RR=4 → CoD=20, Dur=2, **CD3=10.0**
- Status: OPEN — raised 2026-05-16; Three Amigos complete; **Gherkin approved 2026-05-16 (12 scenarios)**; BL-165 closed as superseded. **Slice 1.1 SHIPPED 2026-05-16** — Golf anchor mechanic live (Murray opens slot 1, closes slot N with ROUND SO FAR; TOPIC-DISMISSAL suppressed for anchor turns); anchor config added to all 8 shipped panels (scenario 4 passing). **Slice 1.2 (other panels' anchor wiring) deferred to BL-162** per shared-engine principle — no per-panel duplication. **Slice 2 SHIPPED** — TriggerScoreEngine integrated in selectSlots (w1-w7 trigger components: wound, debt, hostile temp, posture-contradiction, enthusiasm primer match, warm temp, claimed territory). GOLF_ENTHUSIASM data wired in Golf panel call to selectSlots. Per-slot rescoring against previous turn live. Other panels need their enthusiasm primer data + selectSlots wiring (BL-167 Slice 2 panel-propagation follow-up). **Remaining work:** other panels' enthusiasm primer data + selectSlots wiring; per-panel trigger-weight tuning (currently default w1-w7).

---

### BL-168 — Topic-dismissal moves: peers call out off-topic tangents

- When the previous speaker drifts off the user's question (Faldo's Ginsters, Tufnell's puppy analogy, Partridge's media strategy), the next speaker may lead their response with a flavoured dismissal of the drift before returning to the actual question. Stops the rest of the panel adopting one character's hobbyhorse — the prompt-layer fix to WL-149.
- **Three dismissal flavours**, selected by the speaker's current relationshipState temperature toward the drifter:
  - **Polite-but-funny** (warm / amused): "yeah, more luke warm ginsters Nick, great...........anyway as we were saying"
  - **Cold dismissal** (cool / neutral / exasperated): "No not like Ginsters Nick"
  - **Piss-take** (hostile / amused-superior / recently insulted): "yeah, exactly, like a fucking warm ginsters Nick you stupid one-exampled idiot"
- **Not every character dismisses.** Tangent-prone characters (Faldo, Sebastian, Partridge, Tufnell, MacGowan likely) are the ones being dismissed — they don't lead with dismissals themselves. Dismissal is a PEER move fired by closers / authority / piss-takers (Souness, Roy, Boyle, Diogenes, Big Ron when serious, Cox, Henni, etc.).
- **v1 (this BL — pure prompt, no engine):** add TOPIC-DISMISSAL block to the system-prompt assembly for non-anchor characters. Trusts the model to detect drift from the user question and select flavour from existing RelationshipState.temperature. Same prompt block + per-character exemption list. No new data layer, no new code paths. Roughly: one Edit to `index.html:14996–15033` plus the dismissers/dismissed list inline.
- **v2 (future BL):** proper drift-detection signal, per-character dismissal flavour profile attribute, frequency tuning, recent-mood-shift modulation.
- **Composes with:** BL-167 (the dismisser is whichever character was selected by slot order); BL-163 (response-body dismissal is the visible payload; `reacts_to.register` may carry the flavour as metadata for UI thread indicator); WL-149 (this is the prompt-layer fix Rod called for).
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=9 TC=8 RR=3 → CoD=20, Dur=1, **CD3=20.0**
- Status: **v1 SHIPPED** (TOPIC-DISMISSAL block in PanelDiscussEngine.buildSystemPrompt — exists as `topicDismissal` ctx parameter, suppressed for anchor turns per BL-167). Live on Golf 19th Hole via panel data injection. Three flavours (polite-but-funny / cold-dismissal / piss-take) selected model-side from relationshipState. v2 (proper drift-detection + per-character dismissal-flavour profile + frequency tuning) remains OPEN.

---

### BL-169 — Profani-saurus: shared character-authentic profanity dictionary

- Cross-product structured dictionary defining each character's authentic swear vocabulary, conditions of use, register types, and timing. Lives in `/home/rodent/leanspirited-standards/standards/profani-saurus.md` (canonical, like character-schema.md). Pushed to `github.com/Asspirited/leanspirited-standards`. Referenced by Cusslab, Survival School, Fallacy Finder.
- **Why now:** Cusslab is a profanity-themed product. Souness, Boyle, Diogenes, Roy Keane, Bristow, Big Ron etc. all have distinct swearing patterns in their canonical voice. Currently the model improvises profanity per character — sometimes anachronistic (Diogenes wouldn't say "twat"), sometimes off-register (Murray rarely swears at all, Faldo swears differently from Souness). A structured dictionary ties character voice to authentic vocabulary.
- **Design philosophy (Principle 5, locked 2026-05-16):** profanity is a CRAFT REGISTER, not shock value. Every entry must serve one of FIVE purposes:
  - **Off-air candour** — overheard backstage, hot-mic, mask-slip ("yeah off, get him off, what an absolute knobend")
  - **Phonetic comedy** — funny-in-the-mouth words (bollocks, knobhead, gubbins, wazzock, pillock, codswallop, plonker)
  - **Good adjective / intensifier** — comic specificity, cold/crafted ("absolute prick of a tee shot", "right royal pile of shite")
  - **Climactic landing** — one well-placed swear after restraint — the Murray model (rare = devastating)
  - **Emotional emphasis** — anger or amusement leaning on profanity for impact; FELT, near-involuntary; maps to engine state (wound_activated → anger; warm temp + recent posture build → amusement)
  - **Never:** weapon (slurs, violence-language), filler, rhythm-killer
  - **Tradition:** Viz Profanisaurus, Malcolm Tucker, Father Jack, Roger Mellie — profanity as music and wordplay
- **Per-character schema (proposed — new schema attribute, likely P11 or M10):**
  - `swears` — array of words/phrases this character uses (each must pass one of the four register criteria; filler cut)
  - `register` — terse-Glasgow / ancient-Greek-precise / Scottish-precision-cruelty / Cork-thunderous / Cockney-exuberant / English-restraint-with-rare-eruption / etc. — per-character voice signature
  - `purpose` — one or more of: off-air / phonetic / intensifier / climax / emotional-emphasis
  - `conditions` — when they fire (wound activated / temperature hostile / dismissal / closer slot / off-air aside / never)
  - `timing` — opener / mid-response / climax / closer / dismissal-beat / muttered-to-next-character
  - `never_says` — explicit blocklist for that character (Murray never c-word; Diogenes no modern profanity; some characters never swear at all)
  - `escalation_curve` — does intensity rise with round number? (Souness: yes. Murray: no — flat, occasional eruption)
  - `frequency_cap` — max swears per response, max per round (rich variety > volume)
- **Composition with other BLs:**
  - BL-168 dismissal flavours: piss-take register draws from profani-saurus for character-authentic savagery
  - BL-163 deflation register: same draw
  - BL-167 anchor closer (Souness, Harold): closer prompt can reference profani-saurus for the top-and-tail beat
  - Character-schema.md gains a new attribute layer (P9-P10 already cover lie + shadow; this is P11 or a new "Profanity Profile" section)
- **v1 scope:** dictionary file + schema attribute definition + populate for ~6 highest-profanity Cusslab characters (Souness, Roy Keane, Boyle, Bristow, Diogenes, Big Ron). Validation rule in pipeline that any character flagged as a "swearer" has the attribute populated.
- **v2:** populate all characters in the estate; prompt-side integration so BL-168 dismissal block references `${swearsFor(member.id, 'piss-take')}`.
- **Cross-product coordination:** Profani-saurus changes require BOTH Cusslab and Survival School pipelines to stay green. Treat as standards-repo change with downstream impact.
- Feature: platform / character-schema
- Epic: Panel Interaction Model (related) / Character Schema (primary)
- CD3: UBV=8 TC=6 RR=4 → CoD=18, Dur=2, **CD3=9.0**
- Status: OPEN — raised 2026-05-16; **canonical content shipped 2026-05-16 to `leanspirited-standards/standards/profani-saurus.md` (commit 4d73c62)** with 9 character profiles + 5 generative compound templates + 5-purpose criteria + engine-trigger mapping. **v1 engine integration SHIPPED 2026-05-17** — `profanityEnabled` flag + PROFANITY REGISTER block in `buildSystemPrompt`. Block instructs the 5 purposes, character-authentic register, never-weapon never-filler rule, and references canonical profani-saurus file. v2 (per-character profile data loaded by engine, swears picked + injected one-shot per turn like BL-172 voice pools) follows. Schema attribute placement still TBD when v2 lands.

---

### BL-172 — Character voice pool selection in code (extend BL-061 pattern to all character voice pools)

- Discovered 2026-05-16 in live test of BL-167 Slice 1.1: Rod flagged that Faldo defaults to "Ginsters" + "slightly warm" + "A12" / "A1" every round, despite explicit "rotate, never repeat" instructions in his prompt. Models do NOT reliably honour rotation directives — they default to salient named examples. Prior BL closed 2026-03-10 (commit `2887de2`) added more prompt rules; it did not work. Rod has flagged this variation problem multiple times across multiple sessions.
- The pattern that DOES work is established by BL-061 (Author Epilogue pool mechanics, CLOSED): pool selection done in CODE, random pick per turn, inject only the chosen item as a concrete one-shot instruction. Model has no choice — uses what's injected.
- **v1 (tactical, shipped 2026-05-16):** Faldo-only inside Golf IIFE. `FALDO_VOICE_POOLS` const with 5 pools (food / ginstersThermal / garage / cars / entertainment). `faldoVoicePoolBlock` injects one item per pool per turn as an override block placed after `member.prompt`. Logged as tactical exception (WL-150) to Principle 1 (one engine, many panels).
- **v2 (canonical, target):** Extend to all characters with pool-driven voice mechanics — Faldo, Boycott, Souness, Diogenes, Tufnell, MacGowan, etc. Per-character voice pool data lives declaratively in the character file (or a parallel data file). Shared `VoicePoolSelector` module that BL-162's engine calls per character per turn.
- **Lands inside BL-162** — shared `PanelDiscuss` engine includes a `VoicePoolSelector` module that handles pool selection for any character with declared pools. Per-character files declare pool data; engine handles random selection + injection. BL-172 v1's Faldo-specific code is removed at that point in favour of declarative pool data.
- **Composes with:** BL-061 (same mechanic pattern, proven); BL-167/168/163/169 (one engine for everything); WL-149 (Faldo Ginsters monomania — partially addressed by v1, fully by v2); WL-150 (tactical-exception ledger entry).
- Feature: panel-interaction / voice
- Epic: Panel Interaction Model
- CD3: UBV=9 TC=8 RR=5 → CoD=22, Dur=2, **CD3=11.0**
- Status: **v1 SHIPPED 2026-05-16 (Faldo-only, tactical); v2 OPEN — Three Amigos needed on per-character pool schema; depends on BL-162**

---

### BL-173 — Subset speaker selection + multi-interaction per round (relevance-driven)

- Discovered 2026-05-16 by Rod after live test of BL-167 Slice 1.1: every character speaking once per round produces broad-but-shallow texture. Better is a smaller subset (3–5 from the cast) where each chosen speaker fires multiple times (2–3 turns each), with selection driven by RELEVANCE to the user's question + current state. Result: fewer voices, more back-and-forth between them, deeper interaction texture.
- **Replaces the naive middle-slot construction from BL-167 Slice 1.1** (`[anchor, ...fullMiddle, anchor]`) with `[anchor, ...interleavedSubset, anchor]` where the subset is relevance-selected and each character appears multiple times in the middle.
- **v1 (this session, builds on BL-162 Slice 0):**
  - Subset size N (default 3–4) drawn from non-anchor cast.
  - Per-character turn count K (default 2–3).
  - Total middle slots = N × K (~6–12 per round, instead of all 9 non-anchor characters firing once).
  - Relevance signal v1: wound-trigger word match in user input + prior turns + arcLog (each match = +1 score). Tie-break random; zero-score random fill so cold characters can still appear.
  - Middle slot order: round-robin interleave (A B C A B C A B C for N=3, K=3) — keeps each character's turns spread out rather than clustered.
- **v2 (later, with BL-167 Slice 2 / BL-172 v2):** relevance signal extends to enthusiasm primers, claimed-territory keywords, posture-contradiction signals, and debtLedger. Round-robin order becomes trigger-weighted per slot.
- **Composes with:** BL-162 (engine — selectSlots becomes the home for this logic); BL-167 (anchor still bookends — only the middle changes); BL-170 (anchor mid-round interjection slots into the interleaved middle); BL-171 (cross-character questions interleave naturally with multi-interaction); BL-172 v2 (enthusiasm-primer matches feed relevance score).
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=9 TC=7 RR=4 → CoD=20, Dur=2, **CD3=10.0**
- Status: **v1 SHIPPED** — `selectSlots(panelData)` honours `subsetSize` and `turnsPerCharacter` params with relevance scoring (wound triggers v1, full TriggerScoreEngine when ctx data supplied). Round-robin interleave produces middle slot sequence A B C A B C A B C for N=3 K=3. Golf 19th Hole wired with subsetSize=3, turnsPerCharacter=3. **Remaining:** other panels' wiring (port pattern from Golf); per-panel default tuning of N and K.

---

### BL-174 — Character idiom invention: misquoted phrases + bastardised slang + character-authentic profanity

- Discovered 2026-05-16 by Rod (Slice 2 session). Characters get a third register layer on top of P5 comic mechanism + P6 tics: **idiom invention**. Three modes:
  - **Misquoted idioms** — well-known sayings used badly or wrong, in-character ("a bird in the bush is worth two in the hand"; "you can't make a silk purse out of a sour grape")
  - **Bastardised phrases / slang** — existing idioms with one word swapped for a character-authentic swear or term ("not the brightest fucking pickle in the jar"; "couldn't organise a piss-up in a putting green")
  - **Wholly invented idioms** — character constructs a brand-new phrase as if it were proverbial, delivered with full confidence ("never feed a Tuesday spaniel" — Faldo register; "you'd swallow a hedgehog backwards if it'd save you a bogey" — Souness register)
- **Why:** flatness in long sessions. Characters reach for the same construction shapes too often. Idiom invention is a high-yield way to add character-specific texture without rewriting prompts. Faldo's almost-jokes, Souness's contempt-via-folk-wisdom, Diogenes's ancient-truths-by-confabulation, Big Ron's mangled cliché — all natural homes.
- **Composes with:**
  - BL-169 (Profani-saurus) — bastardised mode draws swear words from each character's `swears` array, respects `register` / `conditions` / `never_says`
  - P5 (comic mechanism) — misquote-mode for "hollow performance" / "obliviousness"; invention-mode for "incongruity" / "compulsion"
  - BL-167 Slice 2 (this session) — idiom firings should respect trigger score; characters more likely to deploy an idiom when their primer or wound has just been hit
- **Per-character config (proposed — extends schema or panel data):**
  - `idiom_modes` — array of allowed modes for this character: `misquote` | `bastardise` | `invent`
  - `idiom_frequency` — turns between deployments (rough — e.g. Faldo every 3–4 turns; Souness every 2; Henni rarely)
  - `idiom_register` — character-voice constraints (Murray idioms must reference history; Faldo's must reference food or commitment; Diogenes's must sound antique even when invented)
  - `idiom_source_pool` — optional seed list of authentic-real-idioms the character mangles (e.g. Big Ron has a known catalogue)
- **v1 (minimum):** prompt-side. Add an IDIOM block to system prompts for characters with `idiom_modes` set. Block prescribes mode + register + frequency. Single panel first (Golf — Faldo + McGinley are natural homes).
- **v2 (engine):** the panel-discuss / trigger-score engine annotates which character should fire an idiom THIS turn based on (a) frequency cadence and (b) trigger-score state. Inject single-use idiom instruction into that turn's system prompt.
- **v3 (per-character idiom pools):** like BL-172 voice pools, code-side selection of one bastardised swap or one invented phrase per turn, injected one-shot to avoid model self-repetition.
- Feature: panel-voice
- Epic: Panel Voice & Texture
- CD3: UBV=8 TC=5 RR=3 → CoD=16, Dur=2, **CD3=8.0**
- Status: **v1 SHIPPED 2026-05-19** (`08976d9`) — IDIOM INVENTION prompt block in PanelDiscussEngine.buildSystemPrompt, wired on Golf 19th Hole. Three modes (misquote / bastardise / invent) instructed; once-per-turn cap; never-lampshade rule; composition with BL-169 profani-saurus and BL-188 invented-expert-interpretation noted. v2 (per-character `idiom_modes` / `idiom_frequency` / `idiom_register` / `idiom_source_pool` config + engine selection) remains OPEN.

---

### BL-170 — Anchor mid-round interjection

- Discovered 2026-05-16 by Rod after live test of BL-167 Slice 1.1: anchor should not be confined to start and end of round; should also be able to interject mid-round for course correction. Composes cleanly with BL-167 anchor mechanic and BL-162 engine.
- **v1 (shipped 2026-05-17):** engine decides, panel inserts.
  - `PanelDiscussEngine.shouldAnchorInterject(ctx)` returns boolean. Inputs: `woundActivated`, `recentMoves`, `baseRate`. Defaults: baseRate=0.10, wound-activation boosts to 0.75, sustained-same-posture (3+ identical recentMoves) boosts to 0.45. Final rate = max(baseRate, applicable boosts).
  - `PanelDiscussEngine.buildSystemPrompt` extended with `interjectionMode: boolean` input. When true, emits ANCHOR_INTERJECTION MODE block (distinct from opener/closer text). Suppresses TOPIC-DISMISSAL just like opener/closer modes.
  - Block instructs short redirecting steering, course-correction not takeover, one or two sentences.
- **v1.1 (follow-on):** Golf `discuss()` wires `shouldAnchorInterject` between middle slots. When true, run an extra anchor turn with `interjectionMode: true` before continuing.
- **v2:** rollout to other panels via the engine (per Principle 1, one site of change).
- **Composes with:** BL-167 (anchor mechanic), BL-162 (engine — both `shouldAnchorInterject` and the `interjectionMode` block live in `PanelDiscussEngine`), BL-168 (TOPIC-DISMISSAL suppressed for interjection turns), BL-145 (REGISTER BREAK guard pattern — same sustained-posture signal informs both mechanics).
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=7 TC=5 RR=3 → CoD=15, Dur=2, **CD3=7.5**
- Status: **v1 ENGINE SHIPPED 2026-05-17** — `shouldAnchorInterject` + `interjectionMode` in buildSystemPrompt. v1.1 (Golf wiring) pending. v2 (other panels) follows.

---

### BL-171 — Cross-character questions

- Discovered 2026-05-16 by Rod after live test of BL-167 Slice 1.1: panellists should be able to direct questions to each other, not only respond to the user. Addressed character may answer, may ignore, may hijack to make their own point.
- **v1 (shipped 2026-05-17):** engine-side prompt block.
  - `PanelDiscussEngine.buildSystemPrompt` extended with `crossCharacterQuestionsEnabled: boolean` input. When true and not an anchor turn / interjection, emits CROSS-CHARACTER QUESTIONS block.
  - Block instructs: address by name; addressed character may answer/ignore/hijack (all three valid); deploy only when something earned a follow-up; once per response max.
- **v2 (future):** selection-engine boost — addressed character gets higher score in trigger weighting, making them likely up next. Requires Slice 2 trigger-score integration to read the question target from the previous turn's content.
- **Composes with:** BL-167 (suppressed for anchor opener/closer), BL-170 (suppressed for interjection turns), BL-168 (parallel non-anchor instruction layer), BL-167 Slice 2 (v2 boost feeds trigger score).
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=7 TC=5 RR=3 → CoD=15, Dur=2, **CD3=7.5**
- Status: **v1 ENGINE SHIPPED 2026-05-17** — `crossCharacterQuestionsEnabled` flag + block in buildSystemPrompt. Panel wiring (Golf passes `crossCharacterQuestionsEnabled: true`) follows; selection-engine boost v2 follows.

---

### BL-175 — Cross-character catchphrase parody (piss-take appropriation)

- Discovered 2026-05-16 by Rod after Bruce-to-Phil's-opoly move. Mechanic: a character can deploy ANOTHER character's signature line/aphorism IRONICALLY, redirected at a THIRD party. The parody appropriation IS the joke — taking a sincere line out of context, repurposing for piss-take.
- **Canonical Rod example:** Faldo deploying Bruce's "be like water" against Radar — *"Yeah, be like water Radar, maybe try drinking it instead of whisky too!"* — takes Bruce's earnest aphorism, applies it sarcastically, twists it with a character-anchored jab (Radar's drinking is established trait).
- **Why it works:** the comedy is THREE-character (speaker × victim-of-the-quote × target-of-the-jab). It rewards the audience for knowing the canonical line. Composes with BL-167 anchor pattern, BL-168 dismissal, and Principle 5 emotional-emphasis (amusement leaning on parody).
- **Per-character config (proposed):**
  - `catchphrases` — array of this character's parody-able lines (Bruce: "be like water", "the finger pointing at the moon", "art of fighting without fighting"; Cox: "and in that context", "dead brilliant actually", any cosmic timescale; Faldo: "I've cycled back on this", "Welwyn Garden City"; Souness: "couldn't lace his boots", "fanny"; etc.)
  - `parodyLicense` — which characters this character is licensed to parody (Faldo CAN parody Bruce because he's the sort to do it without irony; Diogenes CANNOT parody anything modern because anachronism)
  - `parodyTargets` — which characters this character is licensed to redirect parodies AT (warm/cooling targets; never highly hostile because that's a different mechanic)
- **v1 (prompt-side, ship-fast):** Add a PARODY block to the system prompt when conditions fire. Block instructs: "if previous speaker [or speaker N rounds ago] used signature phrase X, you may briefly redeploy it ironically at [target] before your own angle. Once per turn maximum." Engine selects (X, target) combination from licensed pairs.
- **v2 (engine, BL-162 absorption):** PanelDiscussEngine's parody selector. Inputs: recent transcript, character `catchphrases`, this speaker's `parodyLicense` + `parodyTargets`, current relationshipState. Output: parody-payload or null per turn.
- **Composes with:** BL-168 (parody can be the dismissal vehicle — "yeah, like Bruce says, be like water, anyway"); BL-163 (`reacts_to.register = 'parody'` as new option); BL-169 profani-saurus (parodies can be sweary in the speaker's register — Boyle parodying Bruce with a darker twist); BL-167 anchor closer (anchor's closer is a natural parody slot — they've heard everyone and can recap with parody).
- **Risk:** parody requires the model to honour the canonical phrase verbatim. Without an in-code list (config) the model may mis-cite. v1 prompt-side mitigates by listing the licensed phrases inline; v2 hardens by code-injecting the phrase as a concrete one-shot.
- Feature: panel-voice / panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=8 TC=6 RR=3 → CoD=17, Dur=3, **CD3=5.7**
- Status: **v1 ENGINE SHIPPED 2026-05-17** — `parodyEnabled` flag + CROSS-CHARACTER PARODY block in buildSystemPrompt. Block instructs deploying another character's signature line ironically at a third target; addressed character may catch the parody; once per response max; return to own angle after the beat. Suppressed for anchor opener/closer/interjection. Faldo-Bruce-Radar example baked into the block text. v2 (engine selector with per-character `catchphrases` + `parodyLicense` matrix + concrete phrase injection) follows; panel wiring (Golf passes `parodyEnabled: true`) follows.

---

### BL-176 — Repetism dial-back: signature-move displacement enforcement + cross-character tic contamination

- Discovered 2026-05-17 by Rod during 19th Hole watershed analysis. Two related output-quality failures, both diagnosable as Lever 4 / M-Mech-2 violations (see `leanspirited-standards/standards/panel-voice-principles.md` Lever 4, commit `6fddb26`).
- **Failure 1 — default-tic firing (intra-character).** A character's named signature move (Alliss's "What. A. Statement.", Faldo's "Now.", etc.) fires by cadence or turn position rather than because relevance-adds-weight or incongruity-displaces-context. Result: the tic stops being recognised as the character — it becomes filler the audience tunes out. Working example of failure: Output 1 in 2026-05-17 watershed (Alliss closing two paragraphs of inflation with "What. A. Statement." as default cadence rather than as earned punctuation).
- **Failure 2 — cross-character tic bleeding (inter-character).** Multiple characters reach for the same signature phrase across the panel. Rod 2026-05-17: *"'What. A. Statement.' is overused by all characters, need to dial that back along with a few other repetisms."* Adjacent to WL-131 (opener bleeding) but at the *named-tic* layer rather than the opener layer. Adjacent to BL-175 (parody) which is the *constructive* use of cross-character phrase awareness; this BL is the *unwanted* mirror of BL-175.
- **Why it matters:** every default-fire dulls every future fire of the same tic. The asset depreciates with each unearned use. Cross-character bleeding compounds the cost — the tic becomes panel-generic rather than character-specific, which collapses Lever 0 (the reactive model: characters stop sounding like themselves).
- **Named repetisms (growing list — Rod-observed):**
  - "What. A. Statement." — overused by all characters (Rod 2026-05-17)
  - "We should mark this" — appears at opener position across multiple 19th Hole runs (suspected bleed — confirm in v0 audit)
  - "Valderrama '97" — Faldo flavour bank over-rotating on this specific Ryder Cup wound (Rod 2026-05-17). Dial back via flavour-rotation tightening on Faldo's `places` or `years` bank, or add Valderrama '97 to `never_touch` for N calls after each use.
  - **Faldo's "I've cycled back on this" / "I cycled back and thought"** (Rod 2026-05-17). FIXED character-file-side — throttled to once-per-session; new sincerity-rotation alternatives added (commit pending). Verify in live use.
  - **Faldo's "fanny always said" / "fanny hated it when I…" / "Leadbetter used to say some weird shit but…"** — class of "Faldo invokes authority of caddie/coach as setup for own opinion" tic (Rod 2026-05-17). FIXED character-file-side — entire class throttled to once-per-session combined, never as default opener (commit pending). The mechanic was inferred by the model from FANNY SUNNESON CAUTION P6 entry; needed an explicit anti-default instruction.
  - **Faldo's "in my golf school…" / "in my [absurd-modifier] golf school…" (e.g. "African ebola survivor golf school") / "When I met [random celebrity]…"** — class of "Faldo invokes own credentials/exotic anecdotes as launchpad for opinion" tic (Rod 2026-05-17). FIXED character-file-side — entire class throttled to once-per-session combined; absurd-modifier golf school can fire occasionally but defaults to filler if over-used (commit pending).
  - **Cross-character expansion of credential-anecdote throttle pattern (Rod 2026-05-17):** the third-party-authority and credential-anchored-anecdote throttle patterns added to Faldo apply more broadly. Each character has equivalents: Murray "When I was at Carnoustie '99"; Cox "When I was at CERN"; Souness "When I was at Liverpool"; Big Ron "Stretford's"; Diogenes "When Plato told me". Each character file should declare similar throttles. Track as separate items in this list as each is observed firing in live use, OR as a one-shot expansion pass on all character files (Track A item).
  - Further additions to be appended as Rod observes them in live use.
- **Tick definition (Rod 2026-05-17):** *"a tick is something someone says too much that doesn't add any comic or contextual value to the discussion and needs mixing up or thinking about how we replace."* Distinct from signature move (which earns its place by adding weight via relevance or displacing context via incongruity per Lever 4 M-Mech-2). A tick is signature-move-shape without signature-move-value — fires by default, contributes nothing, dulls the character. Every tick is a candidate for the named repetisms list above. Throttle in character file; add alternatives; verify in live use.
- **Adjacent failure mode — turn-shape collapse (Rod 2026-05-17).** Opener lands strong; middle sags; closer trails into reactive engagement with another character's nonsense. The character has a strong opening move but no escalation structure to sustain through to a strong close. Possibly its own WL item (TBD) but symptomatic of the same overall voice-debt as repetisms — the character runs out of *their own* material partway through and falls back on either tics (default-fire) or reaction-to-others (Lever 0 reactive-model over-firing). v0 audit should sample for this — score each turn opener / middle / closer separately and flag turns where middle/closer quality drops below opener.
- **Composes with proposed P11 (Topic Magnets)** — hidden character fixations (see character-schema.md draft entry, 2026-05-17 session) supply the *connecting tissue* a character can use mid-turn instead of defaulting to a tic or reacting to others. Magnets give the character somewhere to go in the middle of a turn that is still *them*. Repetism dial-back and topic-magnet engineering are two sides of the same outcome: less generic-character bleed, more character-specific texture.
- **v0 (immediate, no code) — audit pass:**
  - Grep all character files in `characters/` for `signature_phrases`, `tics`, `opener`, `closer`, `mannerisms.closers` fields.
  - Produce overlap matrix: phrase × characters-using-it. Any phrase appearing in 2+ characters is contamination candidate.
  - Sample N recent panel transcripts (Golf, Boardroom, Football preferred) and tally signature-phrase fires per character per turn. Flag any character whose tic-rate exceeds threshold (proposed: 1 in 4 turns).
  - Output: `/notes/2026-05-17-repetism-audit.md` with overlap matrix + fire-rate table + recommended re-attribution / removal list.
- **v1 (prompt-side, ship-fast) — per-character licensing:**
  - Each character file gains `signature_moves` array with two fields per move: `phrase` (the verbatim tic) and `license` (`exclusive` | `shared-with: [chars]`).
  - System prompt gains an EARNED-TIC gate block: "Your signature moves (X, Y) fire only when the line preceding them either earned the emphasis (relevance) or jars in a way that re-frames what just happened (incongruity). Never fire on cadence alone. If neither condition holds, omit the move."
  - Cross-character bleed prevented by listing each character's exclusive moves and forbidding others from using them (handled inversely by BL-175 parody: if the deploying character is licensed to parody, the appropriation fires through that mechanism instead — never as default).
- **v2 (engine, BL-162 absorption) — fire-gate scoring:**
  - PanelDiscussEngine carries a per-turn `tic_gate` evaluator. Inputs: previous slot's content, current character's `signature_moves`, recent transcript window. Output: `{phrase, allowed: bool, reason: relevance|incongruity|denied}`.
  - When gate denies, system prompt explicitly suppresses that character's tics for the turn.
  - Per-turn fire log written to session telemetry — enables pipeline-side regression check ("no signature-phrase fired more than N times across 20 sampled responses").
- **v3 (pipeline check) — regression guard:**
  - New pipeline check: `signature-move-audit.js` runs against last K transcripts. Asserts (a) no tic exceeds per-character fire-rate threshold, (b) no exclusive tic appears in another character's mouth. Fail → pipeline RED.
- **Composes with:**
  - Lever 4 M-Mech-2 — this BL is the engineering of that principle.
  - BL-175 (parody) — exclusive licensing here makes parody appropriation more potent because the canonical owner is unambiguous.
  - WL-131 (opener bleeding) — same family, different layer; v0 audit should sweep openers too.
  - BL-167 Slice 2 (trigger-weighted selection) — when a character's tics are gated off this turn, their score in the next slot should rise (they have material being saved).
- **Risk:** over-gating dulls the character entirely. Signature moves earn their existence by firing *sometimes well-placed*. The gate must permit, not throttle by default. Calibration via v0 audit before code.
- Feature: panel-voice
- Epic: Panel Voice & Texture
- CD3: UBV=8 TC=8 RR=5 → CoD=21, Dur=3, **CD3=7.0**
- Status: OPEN — raised 2026-05-17 (watershed session). Three Amigos needed before any code: agree what "earned" looks like in detectable terms, agree threshold for per-character fire rate, agree audit method (transcript sampling vs live capture). v0 audit can run independently and is recommended first move. Named-repetisms list grows in the block above as Rod observes new ones in live use.

---

### BL-177 — P11 `acknowledgement_rule = if_directly_asked` reconsideration

- Discovered 2026-05-17 in P11 design session. Rod parked the question for future reassessment after observing live use.
- **Current state:** P11 schema (committed `cd04152` to leanspirited-standards) defines three options for `acknowledgement_rule`: `never` | `denies_when_called_out` | `if_directly_asked`. The schema notes `if_directly_asked` is the weakest of the three and should be used sparingly. Rod's instinct: may not be worth keeping in the enum at all — but not enough evidence yet to drop.
- **What to watch for in live use (the signal that would resolve this):**
  - Any character with `acknowledgement_rule = if_directly_asked` who is *actually* directly asked about a magnet, and whose confirmation moment lands either as funny (keep the rule) or as flat (drop the rule).
  - Whether any character is being *forced* into the rule for narrative reasons (e.g. Murray's Prestwick obsession would be fun to have him confirm under pressure) vs the rule being a default cop-out.
  - Cross-character: do panel members ever directly ask each other about magnets? If never, the rule is decorative — drop. If yes, the rule is load-bearing — keep.
- **Reassessment trigger:** revisit after BL-178 ships and at least one character with `if_directly_asked` magnet has been in live play across 10+ sessions. Or sooner if Rod observes the rule firing/failing to fire in a memorable way.
- **Possible outcomes:**
  - Keep as-is (rule earns its place)
  - Drop entirely (rule is decorative; collapse to `never` + `denies_when_called_out` only)
  - Rename / refactor (rule needs a different condition — e.g. `if_panel_member_asks` distinct from `if_user_asks`)
  - Add a fourth option discovered through play
- Feature: panel-voice
- Epic: Panel Voice & Texture
- CD3: UBV=2 TC=1 RR=2 → CoD=5, Dur=1, **CD3=5.0**
- Status: OPEN — raised 2026-05-17. **Parked for future reassessment** — Rod explicitly asked to log so a future scan flags it. Do not work this BL until live-use evidence accumulates. Pure design-evaluation item.

---

### BL-178 — P11 Topic Magnets pilot: Murray data + engine prompt surface

- Discovered 2026-05-17 watershed session. P11 schema landed in `leanspirited-standards/standards/character-schema.md` commit `cd04152`. This BL ships the first character implementation AND the engine surface to use it.
- **v0 (data) — Murray magnets ship to character file:**
  - Three magnets per worked example in schema doc: corvids and the blackbird family (moderate / chosen_examples + over_determined_answer / never / discovered_through_play); Prestwick and pre-1900 golf history (obsessive / chosen_examples + connecting_tissue + unprompted_reference / if_directly_asked / yes_obvious); Victorian wage data (moderate / connecting_tissue + over_determined_answer / never / yes_subtle).
  - Each magnet ships with full anchor_items array (≥6 entries per schema).
  - Validation checklist (schema P11 entries) must pass.
- **v1 (engine prompt surface):**
  - `PanelDiscussEngine.buildSystemPrompt` extended with `topicMagnetsEnabled: boolean`.
  - When true and character has P11 magnets, emits **TOPIC MAGNETS** block in system prompt:
    - Lists this character's magnets for this turn (1–2 sampled per call by surface_form rotation).
    - For each: topic + 2–3 anchor items + surface_form instruction.
    - Block instruction: *"Your mind keeps returning to these. Surface them naturally — as chosen examples, as the tissue between your opener and closer, as the answer itself when it pulls — but never name them explicitly. Deny the fixation if the panel calls you on it (unless your rule allows confession)."*
  - Anti-instruction: *"Do not lecture about the magnet. Do not announce 'I'm interested in X.' The magnet must surface, not be declared."*
  - Suppressed for anchor opener/closer/interjection turns (those have their own register).
- **v2 (engine selector logic):** PanelDiscussEngine selects which magnets to surface per turn based on (a) `magnetic_strength` rotation cadence, (b) BL-167 Slice 2 trigger-score state, (c) anti-repeat check against previous turn (don't surface the same magnet twice in a row).
- **v3 (regression check):** pipeline check `magnet-presence.js` verifies across last N transcripts that each character's magnets appear at expected frequency, no magnet shared verbatim across characters, no magnet named explicitly. Fail → pipeline RED. Composes with BL-176 v3 pipeline check.
- **v4 (Faldo + Cox pilot expansion):** add P11 magnets to Faldo and Cox character files following Murray's pattern. Faldo magnets candidates: savoury pastry (Ginsters as obsessive anchor), commitment-to-position, document precision. Cox magnets candidates: cosmic timescale, "and in that context" framing, narrative inevitability. Three Amigos per character.
- **Composes with:**
  - P11 schema (the data definition)
  - M-Mech-8 (Lever 4) — magnets are the answer-generator; M-Mech-8 frames; BL-179 ships the frame
  - BL-162 / PanelDiscussEngine (where the prompt construction lives)
  - BL-167 Slice 2 (trigger scoring feeds magnet selection v2)
  - BL-176 (audit verifies magnet behaviour as part of repetism dial-back)
  - BL-175 (parody) — characters can parody another's magnet's anchor item as a deliberate piss-take (e.g. someone deploys "the rook" against Murray ironically)
- **Why ship v0+v1 together:** schema without data is theory; data without engine surface is decoration. v0+v1 prove the round-trip from schema → data → prompt → output.
- Feature: panel-voice
- Epic: Panel Voice & Texture
- CD3: UBV=9 TC=7 RR=5 → CoD=21, Dur=3, **CD3=7.0**
- Status: OPEN — raised 2026-05-17. Three Amigos partially done (Murray's magnets in worked example were sketched in chat); Gherkin needed before any code. v0 data work may proceed independently as it is pure character-file content addition (subject to P11 validation checklist).

---

### BL-179 — M-Mech-8 Reverent Absurdity: prompt-side mode block

- Discovered 2026-05-17 watershed session. M-Mech-8 (Reverent absurdity / Milligan-Python register) added to Lever 4 of panel-voice-principles, commit `22d5bab`. This BL ships the engine-side affordance — the prompt block that conditions the model to deliver M-Mech-8 when conditions hold.
- **v1 (prompt-side):**
  - `PanelDiscussEngine.buildSystemPrompt` extended with `reverentAbsurdityEnabled: boolean`.
  - When true, emits **REVERENT ABSURDITY MODE** block in system prompt:
    - *"If the question is a non-sequitur, absurd premise, or invites a sincere absurd answer, you may deliver such an answer with full conviction. Pick the answer that pulls from your topic magnets (P11). Open with address-then-noun-phrase ('Henni, the rook'). Justify with three short clauses in parallel structure, each carrying internally consistent logic within the absurd premise. Close with pomposity that mirrors any earlier inflater's frame."*
  - Anti-instruction: *"Do not wink. Do not flag the absurdity. Do not soften with 'I know this sounds odd, but…'. Do not signal that you know it is funny. Treat the answer as treasured insight you are sharing in confidence."*
  - Composes with M-Mech-2 (the closing pomposity is a signature move at displacement moment — earns its fire).
  - Suppressed for anchor opener/closer/interjection (those have their own register).
  - Suppressed if character has no P11 magnets (cannot generate connectable absurd answers).
- **v2 (engine selection logic):** engine evaluates per-turn whether REVERENT ABSURDITY conditions hold:
  - Prompt-absurdity heuristic: question contains pattern markers (replace X with Y, dangerous animal, dead celebrity, swap X for Y, what if X were Y).
  - Character has at least one P11 magnet connectable to question subject (semantic match against anchor_items).
  - Not an opener/closer/interjection turn.
  - If conditions hold, sets `reverentAbsurdityEnabled: true` for that turn's character.
- **v3 (regression check):** pipeline check `reverent-absurdity-audit.js` samples for M-Mech-8 firing patterns across last N transcripts:
  - Asserts opener follows address-then-noun-phrase form on flagged turns.
  - Asserts no winking / flagging / softening language present.
  - Asserts justification has three clauses in parallel structure.
  - Asserts answer references at least one P11 anchor item from the character's magnets.
  - Pass = the watershed mechanism is firing reliably; fail = engineering regression.
- **Calibration:** v2 selection logic must under-fire by default — M-Mech-8 every turn becomes Goon Show parody (see Lever 4 calibration risk note). Initial target: at most one M-Mech-8 fire per panel session.
- **Composes with:**
  - P11 (magnets are the answer-generator; without P11 data the block cannot connect to character voice)
  - BL-178 (depends on P11 data being present on the character)
  - M-Mech-8 Lever 4 spec
  - BL-167 (anchor turn suppression)
  - BL-168 (TOPIC-DISMISSAL coexists in non-anchor turns)
  - BL-175 (parody coexists as different mode — parody and reverent absurdity are mutually exclusive per turn)
  - BL-170 (interjection suppression)
- **Ship-fast pattern:** v1 is small (one flag + one prompt block + suppression rules), like BL-168 / BL-175 v1 / BL-170 v1 ships. Single session feasible after Gherkin gate.
- Feature: panel-voice
- Epic: Panel Voice & Texture
- CD3: UBV=9 TC=6 RR=4 → CoD=19, Dur=2, **CD3=9.5**
- Status: OPEN — raised 2026-05-17. Three Amigos done in chat (watershed analysis is the design conversation). Gherkin gate next. Order dependency: ships *after* BL-178 v0 (Murray P11 data) lands so the engine can connect the block to actual character magnets — otherwise the block has no anchor items to reference and degrades to abstract instruction.

---

### BL-180 — Hanging-in-the-air: deliberate non-response as panel mechanic

- Discovered 2026-05-17 by Rod. New panel mechanic: a statement deliberately goes unaddressed; the audience reads the absence; the silence IS the comedy.
- **Four firing conditions:**
  - **(a) Discomfort** — previous turn was too uncomfortable to address (someone said something embarrassing about someone present)
  - **(b) Rhetorical** — previous turn was rhetorical; answering misses the point
  - **(c) Cruelty** — previous turn was cruel; engaging would legitimise it (panel collectively refuses)
  - **(d) Insanity / tumbleweed** — previous turn was so unhinged engagement is impossible
- **Reaction options for the slot after a hang-trigger:**
  - `pivot_to_new_topic` — next speaker changes subject without referencing prior
  - `brief_redirect` — next speaker gently steers ("anyway...") without engaging the content
  - `tumbleweed_marker` — literal absence rendered as `[...]` / `[silence]` / beat indicator in output
  - `audible_pause_then_continue` — explicit pause, then continuation as if nothing was said
- **Per-character permission:** not every character can refuse-to-respond. Per-character config (likely P9 extension or new P12):
  - `can_leave_hanging` — boolean, default false (most characters answer everything)
  - `hang_triggers[]` — which of (a)–(d) this character honours
  - `hang_reactions[]` — which reaction options this character uses
- **Examples in cast:** Souness will always respond (cannot leave hanging — too direct). Roy may withhold (cruelty/insanity triggers). Cox would respond with anthropological neutrality (failure mode — cannot hang). Mystic might just stare (insanity → tumbleweed). Henni may pivot (rhetorical → brief redirect). Murray cannot leave hanging — ceremonial frame requires engagement.
- **Composes with:**
  - Lever 4 M-Mech-2 (signature displacement — pivot can fire signature move at displacement moment)
  - M-Mech-3 (cornered legalistic — speaker who said the cruel/uncomfortable thing gets cornered by the silence)
  - M-Mech-9 (incongruent register — performative niceness covering the panel's discomfort is a hostile-as-warm L3-L4 deployment)
  - BL-176 (turn-shape collapse audit) — this BL is the *opposite* of turn-shape collapse; deliberate elision vs accidental sag
  - Proposed Lever 5 Panel Temperature — HOSTILE panels more likely to leave cruelty hanging; WARM panels more likely to pivot gently. The hang mechanic *moves* the temperature dial toward HOSTILE for one round.
- **Engine implication:** PanelDiscussEngine needs a `hangDetected` per-turn signal that the panel slot logic reads. If hang detected, the next slot fires under hang-reaction mode rather than normal response mode. New `hangModeEnabled` flag in buildSystemPrompt + HANG MODE block instructing the chosen reaction option.
- **Risk:** over-firing turns the panel into Larry David parody. Under-firing wastes the mechanic. Initial target: at most one hang per panel session, only when conditions (a)–(d) genuinely hold.
- **v1 (prompt-side):** Add HANG MODE block. Hang trigger detection is heuristic (look for character speaking with high lie-escalation just fired, or response with cruelty markers). The chosen reaction is per-character.
- **v2 (engine):** Hang-trigger detection becomes a scored evaluator. Heuristic refinement based on live observation.
- **v3 (pipeline regression):** sample for hang fires across last N transcripts; verify reactions match character permissions; verify hang triggers are genuine (not arbitrary silences).
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=8 TC=5 RR=3 → CoD=16, Dur=3, **CD3=5.3**
- Status: OPEN — raised 2026-05-17 (watershed session — Rod live ideation). Three Amigos partial (mechanic shape sketched here); Gherkin needed; per-character permission table needs Three Amigos. v1 is small (one flag + one prompt block + reaction-mode dispatcher) like other recent v1 ships.

---

### BL-181 — Proactive moderation: shutdown-before-launch

- Discovered 2026-05-17 by Rod, immediately after BL-180. A character goes to call something out; another character interrupts to *shut it down before the topic launches* and moves on. The shutdown is for someone's benefit — speaker's, target's, panel's, or broadcast's.
- **Distinct from BL-180:** BL-180 is *reactive silence after* a statement; BL-181 is *active interruption before* the statement can fully land. Different timing, different mechanic.
- **Four firing motivations:**
  - **(a) Taste / broadcast standards** — "this can't be discussed on a golf broadcast"
  - **(b) Madness control** — "this is unhinged and doesn't belong here, move on"
  - **(c) Self-protection** — interrupter has their own reason to suppress (cover for themselves)
  - **(d) Target protection** — interrupter is sparing the target embarrassment (often gentle)
- **Mechanic shape:** the would-be-caller-out starts a sentence ("Faldo, about your..."), the interrupter cuts in with a redirect ("Anyway, what about the leaderboard"). The interrupted sentence is *visible but unfinished* — the audience knows what was about to be said.
- **Per-character permission (Three Amigos required):**
  - HIGH (regularly moderates): Henni (presenter role), Murray (ceremonial frame), Sebastian (power), McGinley (protects Faldo specifically)
  - MEDIUM: Cox (only blocks obvious garbage), Faldo (only when topic is about him), Big Ron (instinctive "we're here for the golf")
  - LOW (rarely or never moderates): Souness (engages or storms out), Boyle (would let things run for sport), Roy (attacks or silence — not moderation), Mystic (lost in own world)
- **Engine implication:** PanelDiscussEngine needs:
  - Per-turn pre-check: is the previous speaker's emerging content a "shutdown candidate" by topic markers (taste-flagged subjects, madness markers, lie-escalation in someone whose wounds are about to be aired)?
  - Per-character `shutdown_capability` config (HIGH / MEDIUM / LOW + which motivations allowed)
  - New SHUTDOWN MODE prompt block when fires: "[Previous speaker] was about to address [topic]. You are stopping that line of conversation, briefly and decisively. Cover with a redirect to [neutral subject]. Reason: [taste / madness / self-protection / target-protection]. Do not explain at length — the redirect is the whole move."
  - Optional: the unfinished sentence from the would-be caller-out renders in transcript as `"Faldo, about your—"` (em-dash truncation) so the audience sees the interrupt structurally.
- **Composes with:**
  - BL-180 (hanging-in-the-air) — sibling mechanic, opposite timing. Together they form the "panel non-engagement" mechanism family.
  - M-Mech-3 (cornered legalistic) — shutdown can be deployed as legalistic dismissal ("we don't have time today")
  - M-Mech-9 (incongruent register, hostile-as-warm) — shutdown delivered as warm support can be MORE hostile than direct dismissal; "let's not embarrass [target]" can be the cover for a power play
  - BL-167 anchor mechanics — when anchor does the shutdown, more authority weight
  - BL-170 anchor mid-round interjection — close cousin but anchor-only and not specifically shutdown-shaped
  - Proposed Lever 5 Panel Temperature — shutdowns are typically HOSTILE-coloured (suppression) but can be WARM-coloured (protection). Polarity matters for audience reading.
- **Risk:** over-firing makes the panel feel censored / scripted; under-firing wastes the mechanic when it genuinely fits. Initial target: hand-tuned per panel, possibly more frequent in Comedy Room (taste-conscious) than 19th Hole (which leaves more things hanging).
- **v1 (prompt-side):** Add SHUTDOWN MODE block. Trigger detection heuristic: previous turn started a topic in the panel's `shutdown_topics[]` config, OR previous turn's lie-escalation just triggered wound activation. The chosen reaction is per-character.
- **v2 (engine):** Scored evaluator; per-character moderator dispatch; transcript em-dash truncation for the unfinished line.
- **v3 (pipeline regression):** verify shutdown fires only for valid triggers; verify per-character capability respected; verify unfinished line renders correctly.
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=8 TC=5 RR=3 → CoD=16, Dur=3, **CD3=5.3**
- Status: OPEN — raised 2026-05-17 (watershed session — Rod live ideation). Three Amigos partial; Gherkin needed; per-character permission table needs Three Amigos. v1 small (one flag + one prompt block + transcript truncation) — same ship-fast pattern as other v1s.

---

### BL-182 — Communication Topology Framework: three-axis intent / target-reception / audience-reading

- Discovered 2026-05-17 by Rod. Extension layered on top of M-Mech-9 (Lever 4): every panel turn carries metadata describing what the speaker actually MEANT, what the target RECEIVES, and what the audience READS. The three axes vary independently, producing distinct comedy outcomes from the same surface line.
- **The three axes:**
  - `intent` — what the speaker actually meant (their underlying purpose)
  - `target_reception` — what the addressed character takes from the turn
  - `audience_reading` — what the user/listener takes from the turn
- Initial sketch: each axis Y/N or short-enum. Combinations produce distinct comedy:
  - intent=hostile / target=misses (reads warm) / audience=catches both = classic L5 performative warmth (M-Mech-9)
  - intent=hostile / target=catches / audience=catches = open piss-take (collapses to M-Mech-3 or expletive)
  - intent=warm / target=catches hostile surface / audience=catches warm intent = banter-as-affection successful
  - intent=warm / target=misses (reads as insult) / audience=catches warm = banter-FAILED comedy of misunderstanding
  - intent=sincere / target=thinks mocked / audience=catches both = M-Mech-1 unwitting register accidental-insult failure mode
  - intent=unclear-even-to-speaker / target=tries to interpret / audience=reads multiple = M-Mech-8 polysemy zone (Murray "the rook")
  - intent=encouragement / target=takes as validation / audience=catches the trap = BL-183 egging-on
- **Composes / refines:**
  - M-Mech-9 (the prime use case — currently carries polarity + level + motivation; this BL makes the underlying intent / target / audience split explicit)
  - M-Mech-8 (polysemy = high-uncertainty audience-reading topology)
  - M-Mech-1 (accidental-insult is a specific intent=sincere / target=mocked combo)
  - Lever 5 Panel Temperature (HOSTILE panels skew topology toward intent=hostile + target catches; WARM panels skew toward warm + miss-friendly)
  - BL-183 egging-on (the egger uses intent=encouragement / target=takes-it-as-validation / audience=catches the trap being set)
- **Engineering:**
  - Panel turn metadata `{intent_polarity, target_reception, audience_reading}`
  - Engine prompt block instructs the model on what split to produce ("you mean X; target should read Y; audience should read Z; deliver the line that produces this split")
  - Pipeline regression check verifies produced output achieves the intended topology (sample N transcripts, score the three axes via secondary LLM evaluation)
  - Possibly: per-character config for which topologies a character can sustain
- **Risk:** 8+ combinations may be too many for the model to reliably produce; calibration via empirical observation needed. Possibly merge with M-Mech-9 spec rather than separate BL — TBD after Three Amigos.
- Feature: panel-voice / panel-interaction
- Epic: Panel Voice & Texture
- CD3: UBV=8 TC=4 RR=4 → CoD=16, Dur=4, **CD3=4.0**
- Status: OPEN — raised 2026-05-17. Three Amigos needed. Possibly merges with M-Mech-9 spec on full design.

---

### BL-183 — Egging-on: solicited escalation toward memorable quote

- Discovered 2026-05-17 by Rod. New panel mechanic: a character (the EGGER) deliberately encourages another (the EGGEE) to commit harder to bullshit / lies / cluelessness, possibly culminating in a request to turn the bullshit into a memorable quotable phrase. Connects directly to the "as the Romans understood — a man who claims all harbours owns no ship" pattern from the 2026-05-17 watershed Turn 1 L7 — INVENTED HISTORICAL APHORISMS delivered as if real.
- **Comedy structure (the egging arc):**
  1. Eggee says something dubious / false / clueless
  2. Egger does NOT call it out — instead requests MORE ("tell us more about that"; "go on, what did you do then?")
  3. Eggee escalates per their P9 lie_style
  4. Egger suggests memorialisation: *"could you turn that into a phrase people will remember?"* / *"tell us, in the words you'll be remembered for..."* / *"if you could leave the listeners with one line about that, what would it be?"*
  5. Eggee delivers an invented-aphorism in the Roman / Confucian / famous-coach mode, fully sincere
  6. Audience watches the trap being laid and sprung
- **Per-character roles:**
  - **EGGER capable:** Sebastian, Boyle, Henni (interview mode), McGinley vs Faldo specifically, Cox in particular moods, Mark Nicholas, possibly Mystic (egging via apparent fascination)
  - **EGGEE vulnerable:** Murray (treats every prompt as historically significant — perfect mark), Big Ron (always doubles down), Sebastian (when his bullshit is solicited), Faldo (when asked to philosophise), Coltart (might over-share wounds), Diogenes (always lectures regardless — egging-on is just an excuse to monologue)
  - **Resistant to egging:** Souness (would tell them to fuck off), Roy (silence), Boyle as eggee (would mock the egger first), Bear (would actually answer the question directly)
- **Engineering — PanelDiscussEngine extensions:**
  - Per-turn detection: did the previous turn invite escalation? (Triggers: dubious claim by character with high P9 lie_baseline; clueless statement on subject outside character expertise; over-extended self-mythology)
  - Egger move: if character has EGGER capability AND prev turn had a dubious claim AND target has EGGEE vulnerability, allow turn to encode "tee up the eggee for more"
  - Eggee response: when an EGGEE detects they've been teed up, they escalate per their P9 lie_style (the escalation IS their lie_style firing under solicited-pressure rather than threat-pressure)
  - Quote-request sub-block: explicit prompt block where the egger asks for memorialisation; eggee receives instruction to deliver a sincere invented-aphorism
- **Composes with:**
  - M-Mech-9 incongruent register (egger uses warm encouragement to extract material; intent=hostile-or-amused-knowingly; target=takes-as-validation; audience=catches the trap) — BL-182 topology applies
  - P9 Lie Profile (eggee's escalation engine; `solicited_pressure` may need to be a new `lie_trigger`)
  - M-Mech-8 reverent absurdity (eggee's final aphorism delivered with conviction — M-Mech-8 framework supports it)
  - BL-175 cross-character parody (parody appropriates EXISTING quotes; this BL CREATES new ones to-be-quoted; the two are siblings — one looks back, one creates forward)
  - P11 Topic Magnets (eggee's magnets supply the *substance* of the invented aphorism — Murray's invented Roman maxim would draw from his Prestwick magnet)
- **Risk:** heavy on collaboration between two specific characters per turn — needs solid pairing logic to avoid forced setups. Over-firing turns the panel into Christopher Guest mockumentary parody.
- **v1 (prompt-side):** EGGER MODE block + EGGEE MODE block. Pairing logic in panel slot dispatcher.
- **v2 (engine):** Pre-turn evaluator scores teed-up signal; selects egger-eggee pair from licensed cast pairs; instructs both with matched topology.
- **v3 (regression):** sample for invented-aphorism delivery (P11 magnet anchored, historical-frame matched, sincerely-delivered, M-Mech-8 conditions held).
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=9 TC=5 RR=3 → CoD=17, Dur=3, **CD3=5.7**
- Status: OPEN — raised 2026-05-17. Three Amigos needed on character pairing logic (which eggers go with which eggees and why). v1 ships after pairing table locked.

---

### BL-184 — Panel voice measurement instrumentation suite

- Discovered 2026-05-17 via comparative-analysis research (`notes/2026-05-17-comparative-analysis.md`). The highest-impact gap identified: our model is theory-rich, instrumentation-poor — inverse of mainstream multi-agent LLM research (instrumentation-rich, character-poor). Neither extreme is healthy.
- **The problem:** every quality claim relies on Rod's read. Multiple specific claims in our standards are documented but never measured:
  - Lever 1: "across 20 calls, no flavour entry appears more than 3 times" — unmeasured
  - P11: magnet surface-rate vs declared `magnetic_strength` — regression check documented in schema, not implemented
  - M-Mech-9: calibration-band drift (L3 character drifting to L6 under pressure) — unmeasured
  - Lever 3: `reacts_to` coverage rate (≥50% from turn 2) — claimed, unmeasured
  - BL-176 v3: cross-character magnet collision audit — designed, not running
  - Disagreement-productivity index (does the panel stay L3-L5 or drift to L6+ or to consensus?) — no metric
- **Reference benchmarks (worth borrowing pattern from):**
  - Multi-Agent Comedy Club (arXiv 2602.14770) — A/B with rubric scoring; discussion-enabled wins 75.6% with Δ Craft/Clarity 0.440
  - MultiAgentBench (arXiv 2503.01935) — collaboration/competition with milestone KPIs
  - AgentVerse / CAMEL — token-duplication metrics (53% / 86% respectively)
  - General MAS failure-mode taxonomy: ~79% of failures = spec + coordination
- **Proposed measurement suite (six instruments):**
  - **M-1 Flavour repetition rate** — sample N=20 calls per character per panel, count flavour entries; alert if any appears >3 times. Owns Lever 1 regression check.
  - **M-2 Magnet surface-rate** — sample N transcripts per character, count magnet anchor-item appearances vs declared `magnetic_strength` expectation; alert on under-fire (magnet absent) and over-fire (magnet >2x expected). Owns P11 regression check.
  - **M-3 reacts_to coverage** — sample N transcripts per panel, count turns with `reacts_to` populated from turn 2 onward; alert if <50%. Owns Lever 3 regression check.
  - **M-4 Mechanism calibration drift** — sample N M-Mech-9 firings per character, score (via secondary LLM judge) the calibration level achieved against `allowed_levels` declared. Alert on drift outside band.
  - **M-5 Cross-character magnet collision** — across all character files, detect any magnet topic appearing verbatim in more than one character's `magnets[]`. Alert on collision. Owns BL-176 / WL-131 separation.
  - **M-6 Disagreement-productivity index** — sample N panel sessions, score (via secondary LLM judge) whether the panel stayed L3-L5 incongruence, drifted to L6+ open hostility, or drifted to consensus (failure mode). Composite metric.
- **Engineering — three artefacts:**
  - **Pipeline scripts:** `pipeline/measurement/{flavour-rate,magnet-surface,reacts-coverage,mech-calibration,magnet-collision,disagreement-index}.js`. Each runs against last K transcripts (sampled from Worker logs or session captures) and outputs PASS/FAIL + numeric measure.
  - **Transcript capture:** sample-and-store mechanism for live session transcripts so the measurement scripts have data. New `HC_TRANSCRIPT_LOG` localStorage or Worker-side sample store, retaining last K.
  - **Secondary LLM judge:** the calibration drift and disagreement-index scripts need a small Anthropic API call per sample to score subjective dimensions. Budget per audit run TBD; possibly cached against transcript hash to avoid re-scoring.
- **Phased delivery:**
  - **v1:** M-1 (flavour repetition) + M-3 (reacts_to coverage) + M-5 (magnet collision) — pure transcript-analysis scripts, no LLM judge needed, no transcript-capture infra needed beyond what already exists in HCSession (per BL-018).
  - **v2:** M-2 (magnet surface-rate) — needs transcript capture; depends on BL-178 v1 (TOPIC MAGNETS engine surface) so character magnets are observable in prompt → output mapping.
  - **v3:** M-4 (calibration drift) + M-6 (disagreement-productivity) — needs secondary LLM judge; depends on BL-181 v1 (M-Mech-9 engine block) and BL-178 v1 so the mechanisms are firing observably.
- **Composes with:**
  - BL-176 v3 (already has M-5 collision check designed as part of repetism audit)
  - BL-178 v3 (P11 regression check designed in schema)
  - BL-179 v3 (reverent-absurdity audit designed in BL-179 entry)
  - All future Lever 4 mechanism BLs (each should ship its own measurement instrument)
- **Counter-argument worth noting:** single-judge evaluation (Rod) has been working well — his feedback drives ship cadence under the experimental workflow exemption. Adding measurement could over-instrument and slow ship. Counter: measurement protects against unmeasured drift between Rod's sessions; he cannot watch every panel run.
- Feature: process / panel-voice
- Epic: Measurement & Regression
- CD3: UBV=7 TC=4 RR=8 → CoD=19, Dur=4, **CD3=4.75**
- Status: OPEN — raised 2026-05-17 from research-borrow. v1 (M-1 + M-3 + M-5) ships independently. v2/v3 depend on Track B engine surfaces. Three Amigos partial — measurement targets agreed in research analysis; calibration thresholds need tuning per panel.

### BL-185 — Shorter startup sequence for secondary (parallel) Claude Code sessions

- Discovered 2026-05-17: when Rod runs a second Claude Code session in parallel with a primary session (per `notes/2026-05-17-parallel-session-brief.md`), the full `.claude/session-startup.md` sequence is overkill. Most of it (live bug check ask, ideas board promotion, retro findings, principles/practices reference scan, project-separation reminder, backlog top 3 agreement) is owned by the primary session and should not be re-run by the secondary. The secondary just needs: auth canary, pipeline green, shared-session-state read, parallel-brief read, and a track assignment.
- **The problem:** secondary session burns ~10 minutes of context running steps that the primary owns this session — duplicates work, risks divergent decisions (e.g. promoting an idea the primary is mid-conversation about), inflates context before any real work starts.
- **Proposed artefact:** `.claude/session-startup-secondary.md` — minimal sequence:
  1. Character schema pre-flight (`leanspirited-standards/standards/character-schema.md`) — still mandatory if any character work is in scope
  2. Auth canary (curl Worker, expect 200) — non-negotiable
  3. Pipeline-report.sh GREEN — non-negotiable
  4. Read `.claude/shared-session-state.md` — primary's last close
  5. Read most recent `notes/YYYY-MM-DD-parallel-session-brief.md` if present (or whichever file the primary nominates as the handoff)
  6. Read any new `notes/` files dated today (primary may have written tracks/briefs mid-session)
  7. `git status` + `git log -10` to see what primary has already shipped since the brief was written
  8. Report ready + wait for track assignment from primary or Rod
- **Explicitly skipped vs full startup:** Downloads pre-flight cat (primary owns Claude.ai sync), notes-directory promote/archive (primary owns), live bug ask (primary will hear from Rod), ideas board review (primary owns), backlog top-3 agreement (primary owns), retro findings recap (assume primary already loaded), principles/practices reference scan (load on demand only).
- **Trigger to use secondary startup:** when Rod opens the session with language like "second session", "parallel session", "secondary", "prepare to receive instructions from primary", or names an explicit track ("pick up Track A"). Otherwise default to full startup.
- **MEMORY.md update needed alongside this:** the HARD STOP block currently says "read `.claude/session-startup.md` IN FULL" for Cusslab — add a one-line carve-out: "if Rod signals secondary session, read `.claude/session-startup-secondary.md` instead."
- Feature: process
- CD3: UBV=5 TC=4 RR=4 → CoD=13, Dur=2, **CD3=6.5**
- Status: OPEN — raised 2026-05-17 by secondary session at startup (Rod's request mid-startup). Three Amigos needed on the exact skipped/kept list before writing the file; this BL captures the proposal, not the decision.

---

### BL-186 — Murray opener variation: ancient × modern society × question depravity (attempted balance, awfully)

- Discovered 2026-05-17 by Rod (live observation). Murray's openings all reach back to origins-of-golf (Prestwick 1860 / Old Tom Morris / first iron implement). Same shape every round. Needs mix-up.
- **Three frames Murray *attempts* to juxtapose:** ancient (current default — pre-civilisation, geological); modern society (current cultural state, what we've become); depravity-of-the-question (acknowledging the question itself is awful, vulgar, outrageous).
- **The mechanic — attempted balance, awfully:** Murray earnestly tries to give a vulgar question the same ceremonial weight as the formation of the Earth's crust. Comedy is in the attempted balance failing — the juxtaposition is uncomfortable because he commits to it.
- **v1:** edit `characters/murray.md` adding OPENER FRAME ROTATION section under P6 — three frames + rotation rule + illustrative examples per frame combination. Pure data, no engine code.
- **v2 (optional):** engine `opener_frame_emphasis` hint passed when Murray opens.
- Composes with WL-131 (character dullness — direct quality fix for Murray), P3 Voice (historical frame pool), P11 magnets 1 and 2, M-Mech-8.
- Feature: panel-voice | Epic: Panel Voice & Texture
- CD3: UBV=8 TC=6 RR=3 → CoD=17, Dur=2, **CD3=8.5**
- Status: OPEN — raised 2026-05-17 (re-raised after BL-185 collision with secondary session). v1 ships fast — pure character-file edit.

---

### BL-187 — Shared Pretext Engine: cross-character opener archetypes with bias-and-context adaptation

- Discovered 2026-05-17 by Rod, generalising from Faldo tic-throttle work: *"could they all share similar pretexts like these and adapt to their bias and to the question and recent convo topics and comments?"*
- **The insight:** opener tics (Faldo's cycled-back / Fanny-said / golf-school; Murray's historical-frame; Cox's cosmic-scale) are CHARACTER-SPECIFIC SURFACES of a SHARED MECHANIC. Build the mechanic; let each character's bias shape the surface.
- **13 archetypal opener shapes (universal pool):** authority_deflection ("[X] used to say…") | credential_anchored ("When I was at [X]…") | personal_encounter ("When I met [X]…") | counterfactual_history ("If you'd asked me ten years ago…") | position_cycling ("I've cycled back on this…") | frame_establishment ("What we're witnessing here is…") | scale_situating ("In the context of [scale]…") | acknowledgement_of_question ("What a question.") | defensive_deflection ("I don't normally discuss this, but…") | generational_perspective ("Back when I was…") | industry_perspective ("In [field]…") | historical_reminder ("What this reminds me of is…") | question_depravity_acknowledgement (Murray per BL-186).
- **Per-character affinity:** each character declares 3-5 high-affinity / 3-5 low-affinity / 1-2 forbidden. Biased by P1 Wound, P5 Mechanism, P11 Magnets.
- **Per-call selection (engine):** filter by character affinity → exclude any archetype used by ANY speaker in last N turns (anti-bleed) → exclude character's own most-recent (anti-self-repeat) → weight by question content / magnet match / recent tone → select archetype + fill from character's pool.
- **Fills are character-specific:** Faldo `authority_deflection` pool [Fanny, Leadbetter, Hogan, Trevino…]; Murray `frame_establishment` pool ["we are witnessing", "what is happening here"…]; Cox `scale_situating` pool [cosmic, geological, ancestral, evolutionary].
- **v1 (prompt-side):** OPENER ARCHETYPE block in system prompt naming available archetypes (anti-bleed list excluded), instructs character to pick one and fill from own voice.
- **v2 (engine selection):** PanelDiscussEngine maintains per-session opener-archetype history; filter/weight/select per the rules.
- **v3 (per-character config):** each character file declares `opener_archetypes` map.
- **v4 (pipeline regression — BL-184 M-7):** sample N transcripts per panel, alert on any archetype firing >2x for one character or repeating across consecutive speakers.
- Composes with BL-176 (positive twin — give model rotation pool rather than throttling individuals), BL-186 (Murray is the pilot of this mechanic), P11, M-Mech-2, BL-184.
- Feature: panel-voice | Epic: Panel Voice & Texture
- CD3: UBV=9 TC=7 RR=5 → CoD=21, Dur=4, **CD3=5.25**
- Status: OPEN — raised 2026-05-17. Three Amigos partial — archetypes sketched, per-character affinity needs character-by-character pass. v1 prompt-side ships fast.

---

### BL-188 — Invented expert interpretation: "I think what [expert] meant when he said X was that [absolute bullshit]"

- Discovered 2026-05-17 by Rod: *"I think what plato meant when he said <blah> was that <absolute bullshit statement>" would be funny? not just plato — any expert for any quote on any topic they have no clue about but want to sound clever and weave credibility of others into their own weak, weak premise"*
- **Mechanic:** a character who knows nothing about a topic invokes a famous expert / quote / historical figure and then INVENTS what the expert "really meant" — twisting the quote to bolster the character's own weak premise. The audience knows the expert never said the twisted thing; the character delivers it with full conviction.
- **Distinct from BL-175 (parody):** parody RECOGNISES the canonical quote and redeploys it ironically. BL-188 MISAPPROPRIATES the expert — twisting interpretation under cover of authority. Distinct from BL-183 (egging-on to memorable quote) which has a character invent their OWN quotable; BL-188 has the character invent what SOMEONE ELSE meant.
- **Pattern shape:** *"I think what [expert] meant when [they] said [genuine quote] was actually that [character's own weak premise dressed as expert insight]."* Sometimes the quote itself is invented too (extra absurdity).
- **Examples by character:**
  - Cox-style: "I think what Einstein really meant by E=mc² was that we're all, in the end, just energy looking for a good wifi connection."
  - Murray-style: "I think what Old Tom Morris meant when he said the only good caddie is one who arrives sober was — and I cycled back on this — that the rook would have done it for nothing."
  - Faldo-style: "I think what Hogan was getting at with 'the secret is in the dirt' is really that you should commit to your sandwich filling."
  - Diogenes-style: "I think what Plato meant when he spoke of forms was that I, Diogenes, was right."
- **Per-character licence:** which experts each character can plausibly invoke (Diogenes → ancient Greek; Murray → golf history + civilisations broadly; Cox → physicists + ancestors; Faldo → coaches + champions; Sebastian → philosophers + economists). Wrong-expert pairing is its own bonus comedy (Souness quoting Plato).
- **Composes with:** P9 Lie Profile (`legalistic` and `enthusiastic_confabulation` styles fire BL-188 naturally; quality-flouting Grice maxim explicitly); M-Mech-3 cornered legalistic (BL-188 is its constructive form — invent under no pressure, just to sound clever); BL-183 egging-on (the eggee deploys BL-188 to honour the egger's invitation); P11 magnets (the invented interpretation pulls from character's magnet anchors).
- **v1 (prompt-side):** INVENTED EXPERT INTERPRETATION block: "When invoking a famous figure's quote or principle to support your view, you may briefly invent what they 'really meant' — twisting the interpretation to fit your weak premise. Deliver with full conviction. Once per turn maximum. Do not wink. The audience reads the misappropriation; you do not."
- **v2 (engine):** per-character allowed-experts pool + invocation-frequency throttle.
- Feature: panel-voice | Epic: Panel Voice & Texture
- CD3: UBV=8 TC=6 RR=3 → CoD=17, Dur=2, **CD3=8.5**
- Status: OPEN — raised 2026-05-17 by Rod live ideation. v1 prompt-side ships fast (same pattern as BL-179 / BL-175 v1).

---

### BL-189 — Collaborative panel consensus / mutual roast / pile-on agreement

- Discovered 2026-05-17 by Rod live ideation: *"where the panel have to stop and collaboratively / mutually agree on something funny, like 'the extent to which one of their colleagues is a lying prick' — shit like that we can expand and explore."*
- **Mechanic:** the panel briefly coalesces into a chorus to agree on something about one of their members. Each contributing character adds their own version of the consensus, in their voice, building momentum. The target may interject defensively, stay silent, or accept it.
- **Distinct from siblings:** not BL-180 hanging (silence); not BL-181 shutdown (moderation); not BL-183 egging-on (1-on-1 — one egger, one eggee). BL-189 is PANEL-WIDE coalescence — 2-4 characters in sequence agreeing on the same observation.
- **Trigger:** one character makes an observation about another that the panel can validate. Triggers naturally on Souness contempt, Boyle dark mock, McGinley vs Faldo achievement-comparison, Murray ceremonialising someone's flaw.
- **Build shape:**
  - Turn 1 (initiator): one character makes the observation. *"Faldo, with respect, that story is bollocks."*
  - Turn 2 (first agreement): another character pile-ons in their voice. *"It is, Tony. I cycled back and thought yes. Bollocks."*
  - Turn 3 (second agreement, possibly absurd): a third character joins differently. *"What we are witnessing here, and I say this with full ceremonial weight, is the unanimous panel assessment of a story being, in its own way, complete bollocks."*
  - Turn 4 (optional — target response): the target accepts, defends weakly, or is silent. "Yes — well — I cycled back on this — I stand by it." (Note: this composes with hangModeEnabled — target may simply pivot.)
- **Per-character role contributions:**
  - INITIATOR: direct characters (Souness, Boyle, Roy, Diogenes)
  - FIRST AGREEMENT: anyone with relationship-temperature toward target that allows it
  - SECOND AGREEMENT (escalation/ceremonial): Murray, Sebastian, Cox in his mood
  - TARGET (vulnerable to mutual roast): Faldo (most often — his stories); Sebastian (his frameworks); Cox (D:Ream activation); Murray (his perorations); McGinley (his Gleneagles)
- **Consensus topics the panel can coalesce on (sketched — character-specific):**
  - "The extent to which [character] is a lying prick" (Rod's example)
  - "How long Faldo's stories actually are"
  - "Whether Murray is going to mention Prestwick again"
  - "Whether Cox is about to mention D:Ream"
  - "Sebastian's framework"
  - "How much McGinley wants to talk about Gleneagles 2014"
- **Engineering:**
  - **v1 (prompt-side):** PANEL CONSENSUS MODE block. When previous turn made an observation about another character that lands, the next 1-2 speakers may add to it instead of pivoting to their own angle. The block instructs: "if the previous speaker made an observation about [Target] that the panel can validate from their own experience, you may add your version of the same observation in your voice, building consensus rather than challenging or changing topic. Brief — one or two sentences. Do not repeat the previous speaker's exact wording; bring your own register to the same conclusion."
  - **v2 (engine):** detect observation-about-character signal in previous turn (entity recognition); set consensus mode for next N slots; cap at 3 consecutive agreements before forcing topic change.
  - **v3 (engine target-response):** when consensus is firing, target gets boosted score in the slot AFTER the consensus chain to respond.
- **Composes with:**
  - BL-180 (target may hang — silent response after pile-on)
  - BL-181 (target may shutdown — "let's move on")
  - BL-167 anchor mechanics (anchor may close the consensus chain by summarising)
  - M-Mech-3 cornered legalistic (target's defence is M-Mech-3 firing)
  - M-Mech-9 incongruent register (some pile-on contributions can be hostile-as-warm — "no offense intended, Faldo, but it is bollocks")
- **Risk:** over-firing turns the panel into bully-the-target. Calibration: not every observation triggers consensus — only the genuinely-recognisable ones (target's known patterns). One consensus arc per session max.
- Feature: panel-interaction
- Epic: Panel Interaction Model
- CD3: UBV=9 TC=6 RR=4 → CoD=19, Dur=3, **CD3=6.3**
- Status: OPEN — raised 2026-05-17 by Rod live ideation. v1 prompt-side ships fast (same pattern as BL-180/181/183). Three Amigos partial — consensus-topic table and per-character role assignments need a pass.
