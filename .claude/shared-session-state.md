# Shared Session State
# Written by session-closedown.md step 8b. Overwritten each close.
# Read at startup step 3. Included in session-ref.md for Claude.ai.
Last updated: 2026-03-13 by Claude Code (session 9 — context continuation)
Last commit: ecd00a2 — BL-130: Add 9 Crucible Corner character sheets

## What shipped this session

- **BL-130 The Crucible Corner** (snooker panel) — FULLY CLOSED
  - 9 panel members: Jimmy White (host), Steve Davis, John Virgo, Dennis Taylor, Ronnie O'Sullivan, Willie Thorne (DEAD_IN_PANEL_WORLD), Ray Reardon (DEAD_IN_PANEL_WORLD), John Parrott, Mark Williams
  - Mode 1 Q&A: 14 suggestion cards (match/player/technique/absurd)
  - Mode 2 Frame Simulation: 7 reds × 7 spins × 5 positions × colour phase
  - Data file: src/data/crucible-corner-data.js (module.exports guard for Node)
  - Gherkin: 47 scenarios in crucible-corner.feature, all passing
  - Character sheets: characters/*.md (all 9, following alan-brazil.md structure)
  - commits b90da5d (code) + ecd00a2 (character sheets)

- **WL-137** raised and closed: step defs searched IIFE HTML slice for data in external file — caught at pipeline, zero user impact

- Previous session also shipped: BL-128 (Pub Crawl pressure feedback), BL-126 (nav onclick test coverage), WL-133/WL-135 (Racing bugs)

## Open waste items (WL numbers)

- WL-131: Character dullness — characters leading with "X is right/wrong" — Status: Open (Three Amigos needed)
- WL-136: UI audit doesn't check IIFE return completeness — Status: Open (pipeline gap)

## Backlog top 3 by CD3

- BL-007 (CD3=5.0): Claude Code Windows install bugs
- BL-102 (CD3=5.0): Feature activity report labelling
- BL-113 (CD3=5.0): Unexpected outfit mechanic (cross-scene item discovery)

Notable open items needing Three Amigos before Gherkin:
- BL-125 (CD3=4.75): Final Furlong Mode 2 jockey rivalry (attack/defend/steal)
- BL-129 (CD3=4.0): Pub Crawl free-text input

## Protocol status this session

- Session startup: context continuation — startup run in prior session
- Gherkin gate: followed
- Pipeline: GREEN — 1662/1662 Gherkin passing, all checks clean

## Carry-forward notes

- The Crucible Corner step defs use `require('../src/data/crucible-corner-data.js')` — NOT the IIFE HTML slice pattern. Any future external-data panels must follow this. See notes/2026-03-13-gherkin-external-data-pattern.md
- Sports nav group now has 2 panels: The Final Furlong (horse racing) + The Crucible Corner (snooker). Both under sports nav tab.
- characters/ directory now has 9 Crucible Corner .md files
- Next likely work: BL-125 (jockey rivalry Three Amigos first) or BL-129 (pub crawl free text Three Amigos first)
