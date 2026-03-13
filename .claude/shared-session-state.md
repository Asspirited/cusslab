# Shared Session State
# Written by session-closedown.md step 8b. Overwritten each close.
# Read at startup step 3. Included in session-ref.md for Claude.ai.
Last updated: 2026-03-13 by Claude Code
Last commit: f75a4a4 — Add The Final Furlong — horse racing panel with 7 characters

## What shipped this session
- BL-123: The Final Furlong horse racing panel (complete)
  - 7 character .md files: alan-brazil, mccririck, jim-mcgrath, alastair-down, osullevan, ruby-walsh, matt-chapman
  - Racing IIFE in index.html: Brazil hosts, 4 of 6 rotating per round
  - DEAD_IN_PANEL_WORLD: McCririck (died July 2019) + O'Sullevan (died October 2015) — present, contributing, neither death mentioned, pure bathos
  - HR_SUGGESTIONS pool (12 cards), Mode 1 Q&A, Mode 2 Race Moment (6 types: PHOTO_FINISH, STEWARDS_ENQUIRY, LAST_FENCE_FALL, SHOCK_WINNER, WITHDRAWAL, RECORD_TIME)
  - specs/final-furlong.feature: 32 scenarios, all green
  - pipeline/gherkin-runner.js: step definitions added for all racing scenarios + NAV_GROUPS.sports updated
  - Pipeline: GREEN on close

## Open waste items (WL numbers)
- WL-097: [check waste-log.md] — Status: Open
- WL-131: Character dullness (reactivity obligation making voices generic) — Status: Open — Three Amigos needed
- WL-132: Gherkin step slice window + member ID mismatch (racing step defs) — Status: Closed same session

## Backlog top 3 by CD3
- BL-007 (CD3=5.0): Claude Code Windows install bugs
- BL-102 (CD3=5.0): Feature activity report labelling
- BL-113 (CD3=5.0): Unexpected outfit mechanic

## Rod's pending requests (in order received — not yet started)
1. BL-124 (CD3=7.3): Nav group landing page — clicking a main nav group shows a sub-feature list, not immediately the top panel. Needs Three Amigos.
2. Final Furlong interaction engine port — Rod wants The Final Furlong to use "the new interaction engine we experimented with for Post Game Cunditry (football panel)". Needs Three Amigos: what does "the new interaction engine" mean? What changed in football? What to port?

## Protocol status this session
- Session startup: followed (continuation session resuming from context overflow WL-123)
- Gherkin gate: followed — Gherkin approved in previous session, specs/final-furlong.feature implemented this session
- TDD: followed
- Pipeline: GREEN on close (EXIT:0)
- Retrospective triggers: none fired (no 3+ pipeline failures, no repeated mistake, no Rod flag)

## Carry-forward notes
- Racing IIFE uses id: 'brazil' (not 'alan_brazil'). Gherkin uses 'alan_brazil'; step defs map it to 'brazil' for lookup.
- hrLoadName() called at line 17257 (end of Racing IIFE init block). Do not add a second call.
- Notes to clean up: notes/2026-03-10-author-epilogue.md and notes/2026-03-10-sun-tzu-pub-navigator.md were deleted (superseded). git status shows them as deleted-not-staged — needs a commit or restore.
- DORA: 21% pipeline failure rate (316/1485 sessions RED). Failure rate unchanged. 1 false green. 0% pipeline-caught bugs — all Rod-caught.
- BL-124 (nav landing page) and Final Furlong interaction engine port are the two active requests. Run Three Amigos before either.
