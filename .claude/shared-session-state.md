# Shared Session State
# Written by session-closedown.md step 8b. Overwritten each close.
# Read at startup step 3. Included in session-ref.md for Claude.ai.
Last updated: 2026-03-09 (session 2 — clean stop requested by Rod) by Claude Code
Last commit: 26e5928 — chore: session closedown

## What shipped this session
- WL-085: nav scroll bleed fix — overscroll-behavior: contain on nav (desktop + mobile)
- Decade header display bugs fixed ("2000S2" → "'00s", text-transform override, count removed)
- Tournament chooser section headers: MAJORS / RYDER CUP / SPECIAL GAMES via .tc-category-hdr (32px)
- Era CSS: era-1991, era-1997, era-1999-rc, era-1985, era-1987, era-1995, era-2006, era-2010, era-2016, era-2006-us, era-2007 — all added to golf-adventure.html
- BL-023: Valderrama 1997 (Coltart/Monty/Westwood/Parnevik — Seve's interference, the waterfall)
- BL-024 #1–5: Belfry 1985, K Club 2006, Muirfield Village 1987, Celtic Manor 2010, Oak Hill 1995
- BL-025 #1: Hazeltine 2016 (McIlroy furious, Reed, Pieters rookie 4-1)
- BL-035 added: Watch Back mode (sofa commentary from player-characters watching their own games)
- Backlog audit done: full open/closed list in this conversation

## Open waste items
- None this session. Last waste: WL-085 (closed).

## Backlog top 3 by CD3 (Cusslab)
- BL-034 (CD3=5.0): Dual temperament profiles — OPEN — do this session
- BL-032 items 2,3,9 (CD3=5.0 bucket): 2005 Masters Tiger chip-in, Winged Foot Phil, Carnoustie 2007 Harrington — OPEN
- BL-025 (CD3=1.6): Whistling Straits 2021 — remaining from Ryder Cup Tier 2

## Rod's stated next-session plan
- BL-034 (dual temperament profiles) — explicitly requested
- BL-032 items 2, 3, 9 (2005 Masters, Winged Foot, Carnoustie 2007) — explicitly requested
- "Then 34 and 24-32" — suggesting a range of BL items after that
- BL-035 (Watch Back): design question unresolved — strip vs modal — resolve before Gherkin

## Protocol status this session
- Session startup: FOLLOWED
- Gherkin gate: N/A — all work was data additions to existing code paths (no new behaviour)
- Pipeline: GREEN at close — 454/454, canary OK
- All commits pushed, nothing dangling

## Carry-forward notes
- era-2006-us (Winged Foot NBC) and era-2007 (Carnoustie BBC/Sky) CSS stubs already written — ready for tournament data
- era-2005 (Augusta CBS) already exists — reuse for 2005 Masters
- BL-024 fully closed (all 5 Tier 1 Europe wins)
- BL-025 partially done (Hazeltine done, Whistling Straits 2021 remaining)
- BL-026/027/028 untouched — lower priority Ryder Cups
- Watch Back (BL-035): discuss strip vs modal at next session start before touching code
