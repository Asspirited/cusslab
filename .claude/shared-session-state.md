# Shared Session State
Last updated: 2026-03-15 by Claude Code
Last commit: fa5868f — Fix snooker name prefix bug; remove Cox from football panel; log BL-159

## What shipped this session

### Structural / Process
- WL waste-log restructured: OPEN ITEMS index block at top of waste-log.md — genuinely open items only
- session-startup.md step 3 updated to read OPEN ITEMS index (not grep last 5 entries)

### Character panel assignments (BL-139 CLOSED)
- # Panel: headers added to 11 character files: bruce-lee, buddha, chuck-norris, nostradamus, sun-tzu, vinny-jones, adams, cox, alliss, souness, roy-keane
- BL-157 raised: Vinny Jones → football + Boardroom (Three Amigos needed)
- BL-158 raised: Souness's Cat rethink (Three Amigos needed)

### Football panel
- Prof Cox fully removed from football panel (12 locations)
- Football panel is now: souness, micah, neville, carragher, bigron, marsh, keane (7 members)
- souness/neville ConspireEngine reset valve changed from 'cox' to 'micah'

### Snooker
- SNOOKER_TURN_RULES: added no-name-prefix rule (stops **Name:** bold opener pattern)
- BL-159 raised: expand snooker character speech patterns/openers

### UI
- nextRound() auto-scroll (window.scrollTo(0,0)) added to all 7 panels

### Research ideas (confirmed by Rod — all 4 on ideas.md UNREVIEWED)
- Register collapse prevention in multi-agent LLM systems
- BDD for non-deterministic AI systems
- Wound-based character simulation DSL
- ConspireEngine: designed contradiction in multi-agent LLM
- Full writeup in Downloads/idea-research-writeups-2026-03-15.md

### Bugs logged
- WL-147: backlog-report.js status regex false-positive (BL-128 and BL-132 show as OPEN, both CLOSED)

## Open waste items (WL numbers)
- WL-041: Mobile/tablet nav not findable on small screens — Low — Three Amigos needed
- WL-097: Left nav focus trap — pointer-events not released — Low — deferred
- WL-MODE-002: Bobby George + Rod Harrington darts character files missing — Low
- WL-123: Session context overflow mid-session — Low — ongoing mitigation
- WL-131: Character dullness — openers bleeding across characters — Medium — Three Amigos needed
- WL-136: UI audit doesn't check IIFE return objects — High — pipeline false-green risk
- WL-147: backlog-report.js false-positive OPEN for items with "status text" in description — Low

## Backlog top 3 by CD3 (excluding parser false-positives BL-128, BL-132)
- BL-146 (CD3=6.0): Golf panel character technical knowledge enrichment
- BL-151 (CD3=5.7): Per-character mode selector: character-level atmosphere/posture override
- BL-157 (CD3=5.5): Vinny Jones → football panel + Boardroom (Three Amigos first)

## Protocol status this session
- Session startup: followed in full
- Gherkin gate: followed — no new code paths requiring new Gherkin
- TDD: N/A — character data + prompt text changes only
- Pipeline: GREEN throughout (707/707 unit, 6/6 E2E, 16/16 UI, canary OK)

## Carry-forward notes
- BL-146 is agreed next session priority. Start with Gherkin (none exists yet), then enrich character prompts.
- BL-157 (Vinny Jones) needs Three Amigos before any implementation.
- BL-158 (Souness's Cat): Cox + Adams + Souness confirmed characters; mechanic TBD. Snapshot: Downloads/idea-souness-cat-rethink-2026-03-15.md
- Phil's-opoly notes at notes/2026-03-09-phils-opoly.md — still active context.
- Football panel is now 7 members. Cox is in Science Convention + Souness's Cat (future) only.
- Session context compacted mid-session — longer sessions than usual. Consider splitting at 2h.
