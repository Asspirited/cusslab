# Shared Session State
# Written by session-closedown.md step 8b. Overwritten each close.
# Read at startup step 3. Included in session-ref.md for Claude.ai.
Last updated: 2026-03-11 by Claude Code
Last commit: 3b4821a — Fix PubCrawl engine not loading: guard + runtime lookup

## What shipped this session
- Bruce Lee added to all 6 panels (Boardroom, Comedy Room, Football, Golf, Darts, Cricket) as TEST character. docs/characters-bruce-lee.md created.
- WL-096 (Bespoke Material): SentenceBuilder.run() completely rewritten to read existing form fields; bespoke-material.feature with 8 Gherkin scenarios — all passing. Logic functions in pipeline/logic.js; step defs in gherkin-runner.js.
- WL-120: PubCrawl cascade crash fixed (unguarded window.PubCrawlScenes.PUB_CRAWL_SCENES in inline script)
- WL-121: Quntum Leeks scenario overwrite fixed (initState() then assignment, not assignment then initState())
- WL-122: UI audit checks 11+12 added (unguarded window.X.Y pattern detection)
- WL-124: PubCrawl ENGINE.initPubCrawl recurring bug FIXED — 3 changes: (1) guard in pub-navigator-engine.js line 9, (2) ENGINE replaced with getEngine() runtime lookup in index.html, (3) hardcoded ?v= cache busters removed from script tags

## Open waste items (WL numbers)
- WL-097: [check waste-log.md for detail] — Status: Open
- WL-122: UI audit gap partially mitigated — open for runtime browser tests — Status: Open
- WL-123: Context overflow session break — Status: Open (process habit)

## Backlog top 3 by CD3
- BL-118 (CD3=6.0): Pipeline — runtime browser test for external-script window globals
- BL-117 (CD3=4.4): Home page — feature discovery page replacing Golf Adventure default
- BL-116 (CD3=TBD): Premise Interrogation — scientist/philosopher panel

## Protocol status this session
- Session startup: followed (continuation session — startup done in prior context)
- Gherkin gate: followed — bespoke-material.feature written and approved before implementation
- TDD: followed
- Pipeline: GREEN — 707/707 unit tests, 13/13 audit, 7/7 browser-sim, Gherkin passing

## Carry-forward notes
- Bruce Lee is TEST ONLY — Rod needs to test him across all panels and decide: keep, specialise, or remove. See docs/characters-bruce-lee.md.
- PubCrawl fix deployed (3b4821a). Rod needs a hard-refresh once (Ctrl+Shift+R) to clear old cached pub-navigator-engine.js?v=2 from browser cache.
- BL-118 is the priority process item — 0% pipeline-caught bugs (all Rod-caught) is the pattern to break. Three Amigos needed before implementation.
- WL-097 still open — check waste-log.md for details.
- comedy-room has 32 open BL items, 0 closed this session — no comedy work done in session 6.
- DORA: 21% pipeline failure rate, 1 false green. Flaky steps: uiAudit, browserSim, unitTests, gherkin.
- UI testing rethink: BL-118 is the backlog item. Three Amigos before any code.
