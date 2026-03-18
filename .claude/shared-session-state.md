# Shared Session State
Last updated: 2026-03-18 by Claude Code (session 16)
Last commit: bef8a42 — Session 16 closedown — TBT bowling, variation, process
Branch: through-the-biscuit-tin

## What shipped this session

- **TBT-014**: Bowling resolution — BOWLING_BANDS, resolveBowling(), applyBowlingResult(), buildBowlingNote(). 13 Gherkin scenarios. Commit 4249c24.
- **TBT-023**: Overlapping bowling bands + surprise mechanic. Thresholds 0.90 (→+1 band) and 0.95 (→+2 bands). Era flavour note prefixes. 13 variation scenarios. Commit f1e1e45.
- **TBT-017–022** raised to backlog (prizes, mini-games, venues, player type selection)
- **Process**: `tbt` added to canonical feature labels; Feature label rule added to RAISE NEW WORK SEQUENCE in insession.md; domain-model.md updated with batting + bowling resolution docs.

## FORM bands (canonical — do not change without updating all 7 files)

Nowhere(0-4) / Out-of-Form(5-8) / Scratchy(9-12) / Ticking Along(13-16) / Flying(17-20)

## Batting MATCH_BANDS (overlapping, intentional)

Flying 50-550 / Ticking Along 30-220 / Scratchy 1-120 / Out-of-Form 1-25 / Nowhere 1-10

## Bowling BOWLING_BANDS (overlapping, intentional)

Flying 2-6wkts/10-45runs / Ticking Along 1-4/20-60 / Scratchy 0-3/30-75 / Out-of-Form 0-2/40-85 / Nowhere 0-1/50-90
Wicket thresholds: Flying=0.20, Ticking Along=0.28, Scratchy=0.38, Out-of-Form=0.52, Nowhere=0.70
Surprise: roll≥0.90 → +1 band, roll≥0.95 → +2 bands (capped at Flying)
Bowling avg = null (shows as n/a) until first wicket taken.

## Open waste items (WL numbers)

- WL-041: Mobile/tablet nav — panels not findable on small screens — Low
- WL-097: Left nav focus trap — pointer-events not released — Low
- WL-MODE-002: Bobby George, Rod Harrington — no character md files — Low
- WL-123: Session context overflow mid-session — Low (ongoing mitigation)
- WL-131: Character dullness — openers bleeding across characters — Medium
- WL-136: UI audit IIFE return check missing — High
- WL-147: backlog-report.js false-positive OPEN on BL-128 — Low
- WL-149: tbt.html applyActivity diverged from engine — Low

## Backlog top 3 (TBT — next session agreed)

- TBT-016 (CD3=7.0): Batting — defensive vs attacking shot selection — Three Amigos first
- TBT-015 (CD3=6.5): Bowling — separate formulas for wickets and runs conceded — Three Amigos first
- TBT-022 (CD3=5.7): Player type at start (batting position + bowling role) — Three Amigos first

## Protocol status this session

- Session startup: followed
- Gherkin gate: followed — TBT-014 and TBT-023 both had Gherkin approved before implementation
- TDD: followed — all scenarios red → green
- Pipeline: GREEN (1941/1941 Gherkin, 823/823 unit, 6/6 E2E, 16/16 UI audit)

## Carry-forward notes

- TBT-017–022 all need Three Amigos before Gherkin — none are ready to implement yet
- Player type (TBT-022) will affect MATCH_BANDS and BOWLING_BANDS when built — batting position shifts run ranges, bowling role shifts wicket/economy expectations
- backlog-report.js does not count TBT-NNN items (only BL-NNN) — 9 open TBT items invisible to the report. Known gap, not yet a BL item.
- Rod's direction on bowling: "make it fun" — overlap + surprise mechanic confirmed. Both batting and bowling should feel variable and exciting regardless of FORM.
- Ideas board: dice attribute roll (AD&D-style) still UNREVIEWED, awaiting Three Amigos.
