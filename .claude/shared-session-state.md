# Shared Session State
# Written by session-closedown.md step 8b. Overwritten each close.
# Read at startup step 3. Included in session-ref.md for Claude.ai.
Last updated: 2026-03-10 by Claude Code
Last commit: 34f12ae — BL-035: WatchBack sofa commentary strip — UI wiring complete

## What shipped this session
- BL-043: 2011 Open Sandwich (Darren Clarke) — "The Long Wait" — tournament data + era-2011 CSS
- BL-041: 2011 US Open Congressional (Rory McIlroy) — "Eight" — tournament data + era-2011-us CSS
- BL-040: 2000 Open St Andrews (Tiger) — "The Tiger Slam" — tournament data + era-2000 CSS
- BL-049: Sir Nick Faldo — Sandwich Gate wound + insult vocabulary (Pool 6, cross-panel needling)
- BL-035: WatchBack sofa commentary strip — FULL FEATURE COMPLETE
  - Logic layer: getSofaCommentator, getHistoricalDivergence, selectReactionMode, COLTART_SOFA_POOLS (pipeline/logic.js)
  - Gherkin: specs/golf-adventure-watchback.feature (4 scenarios incl. outline with 5 examples)
  - UI: sofa strip HTML div + CSS in golf-adventure.html
  - Inline JS: constants + functions + startGame detection + endHole update after each hole
- BL-028: Era palette note (Shell's 60s-70s Kodachrome), format complexity note for Pro-Am/Dunhill
- BL-048 raised: Round selection (final round only OR all 4), CD3=1.8
- BL-050 raised: 2008 Ryder Cup Valhalla (Faldo's disaster), CD3=2.8
- Process: "Fix order — impact first, cosmetic last" rule added to INVESTIGATE AND RESOLVE

## Open waste items (WL numbers)
- WL-MODE-001: design-session audit gap — Status: Open
- WL-MODE-002: darts character debt (Rod Harrington/Bobby George) — Status: Open

## Backlog top 3 by CD3
- BL-050 (CD3=2.8): 2008 Ryder Cup Valhalla (Faldo's disaster) — OPEN
- BL-048 (CD3=1.8): Round selection — final round only OR all 4 — OPEN
- BL-028 (CD3=1.1): Shell's Wonderful World + Pro-Am/Dunhill formats — OPEN (design refined, deferred)

## Protocol status this session
- Session startup: followed
- Gherkin gate: followed — WatchBack Gherkin written and approved before TDD
- TDD: followed
- Pipeline: GREEN — 472/472 unit tests, all Gherkin passing

## Carry-forward notes
- BL-035 Phase 2 not started: two sofa commentators reacting to each other when both match (Faldo + Poulter at Valhalla will need this when BL-050 is built)
- COLTART_SOFA_POOLS only has valderrama_1997 — next sofa commentator needs BL-050 tournament data first
- tournaments.js: check tournament-level id field is consistent (used by updateSofaStrip as G.tournament.id)
- Unit test count: 472
