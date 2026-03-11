# Shared Session State
# Written by session-closedown.md step 8b. Overwritten each close.
# Read at startup step 3. Included in session-ref.md for Claude.ai.
Last updated: 2026-03-10 by Claude Code
Last commit: 855c8d0 — Session closedown 2026-03-10 — BL-109/110 Pub Crawl + WL-113/114 Golf fixes

## What shipped this session
- BL-109: FF shared engine (ff-engine.js) — initGameState, appendToHistory, incrementTurn, buildModifierBlock. 9 Gherkin + 15 unit tests.
- BL-110: Friday Pub Crawl Misadventure (Mode B) — live on GitHub Pages. 8 real pub locations, 4 advisors (Sun Tzu/Nostradamus/Chuck Norris/Buddha), pressure system, 4 outcome tiers, lederhosen easter egg. 24 Gherkin + 38 unit tests. New tab in Little Misadventure section.
- WL-113 fixed: Ryder Cup overall match score now shown prominently in leaderboard (G.teamScore as "Overall Match Score", large; session-only points in small subtitle). commit bcb1b50.
- WL-114 fixed: Commentary layout fixed — de-leaderboard moved before panel-discussion inside day-end-wrap. Outcome visible first, commentary loads below. commit bcb1b50.

## Pub Crawl architecture (new this session)
- src/logic/ff-engine.js: shared FF engine, no DOM/API, used by Pub Crawl + Quntum Leeks + Golf Adventure
- src/data/pub-crawl-scenes.js: 8 scene definitions (id, name, location, beats[4], choices[4], worstOutcome)
- src/logic/pub-navigator-engine.js: pub crawl game engine (initPubCrawl, resolveChoice, determineOutcome, getActiveAdvisor, buildAdvisorPrompt, checkLederhosen)
- Advisors: ADVISOR_VOICES with character prompts; TOPIC_TRIGGERS routes physical→chuck-norris, philosophical→buddha, strategic→sun-tzu, outcome→nostradamus
- New scripts in index.html: ff-engine.js, pub-crawl-scenes.js, pub-navigator-engine.js
- pubcrawl tab added to NAV_GROUP_MAP (misadventure) and CONSULTANT_SKIN_TABS

## Open waste items (WL numbers)
- WL-MODE-001: design-session audit gap — Status: Open
- WL-MODE-002: darts character debt (Rod Harrington/Bobby George) — Status: Open
- WL-096: open bug — Status: Open (details in waste-log.md)
- WL-097: open bug — Status: Open (details in waste-log.md)

## Backlog top 3 by CD3
- BL-107 (CD3=11.0): Nostradamus character spec: juxtaposition mechanic with Sun Tzu — OPEN
- BL-105 (CD3=7.5): Hardmen reaction panel (Roy Keane, Vinny Jones, Nostradamus) — OPEN
- BL-106 (CD3=5.5): Sun Tzu general advisory mode (post-pub validation) — OPEN

## Protocol status this session
- Session startup: followed (continuation from prior session — startup was done in prior run)
- Gherkin gate: followed — ff-engine.feature approved by Rod, friday-pub-crawl.feature approved by Rod
- TDD: followed — Gherkin failing confirmed before implementation for both BL-109 and BL-110
- Pipeline: GREEN — 707/707 units, 1488/1488 Gherkin, canary OK

## Carry-forward notes
- BL-113 OPEN: Unexpected outfit mechanic (generalise lederhosen). Needs Three Amigos before any work. No Gherkin written yet.
- BL-105, BL-106 blocked on BL-104 (Mode A voice validation). BL-104 has partial closure; advisors in pub crawl Mode B are its validation path.
- golf-data/tournaments.js.bak untracked in working directory — safe to delete next session
- BL-022 (Ryder Cup "Be Any Player") references matchPlayDays — update to matchPlaySessions when actioned
- Day 2 AM/PM parallelMatch data is placeholder (generic EUR/USA pairs) — real historical data is data-only addition, no new Gherkin needed
- DORA failure rate 22% — all confirmed flaky infrastructure, not regressions
- 8 bugs logged: 100% rod-caught, 0% pipeline-caught — instrumentation gap noted
