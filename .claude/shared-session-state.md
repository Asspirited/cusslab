# Shared Session State
Last updated: 2026-03-15 by Claude Code
Last commit: db3f4b6 — Backlog: close BL-145, raise BL-153

## What shipped this session
- BL-152: YOUR OWN ANGLE FIRST rolled out to Comedy Room, Science Convention, Darts (DARTS_TURN_RULES), Long Room. Football left as A/B test baseline. 5 Gherkin scenarios. Commit 177b573.
- BL-144: ConversationArc accumulation (Golf panel). arcLog[] tracks first sentence per character, attributed by name. NARRATIVE ARC SO FAR block injected into subsequent characters' system prompts. 5 Gherkin scenarios. Commit 74628f2.
- BL-145: Arc state guard (Golf panel). postureType field added to 9 Golf members (analytical: faldo/butch/mcginley, narrative: murray/dougherty/coltart, challenge: radar/roe/henni). recentMoves[] tracked per turn. Guard fires when last 3 share same register → injects REGISTER BREAK. 14 Gherkin scenarios. Commit b2d15cd.
- BL-153 raised: David Howell ("Howling Mad David" / "Howler") for Golf panel — CD3=4.0 — OPEN.

## Open waste items (WL numbers)
- WL-136: UI audit does not check IIFE return objects — Open (pipeline false-green risk)
- WL-131: Character dullness — Open (Three Amigos needed)
- WL-134: Pub Crawl — no outcome feedback — Open (Nielsen review needed)
- WL-145: sed -i wiped backlog.md — Closed (recovered from git; rule: use Edit tool not sed)

## Backlog top 3 by CD3 (actual — BL-132 is CLOSED despite parser bug)
- BL-128 (CD3=7.0): Pub Crawl UX — pressure feedback, threshold visibility, game-goal clarity
- BL-139 (CD3=6.0): Character audit — 6 characters with no active panel assignment
- BL-146 (CD3=6.0): Golf panel — character technical knowledge enrichment

## Protocol status this session
- Session startup: followed in full
- Gherkin gate: followed for all 3 BL items (BL-144, BL-145, BL-152)
- Pipeline: GREEN at close
- Checkpoint: fired at 3 BL items closed — Rod called stop

## Carry-forward notes
- BL-153 (Howling Mad David — David Howell) is FIRST priority next session — Rod confirmed
- WL prune is SECOND priority — check all open WL for anything closeable
- Then: BL-128, BL-139, BL-146 by CD3
- backlog-report.js shows BL-132 as OPEN — this is a parser bug. BL-132 is CLOSED (shipped 2026-03-14). Do not work on it.
- Golf panel now has: arcLog (NARRATIVE ARC SO FAR), recentMoves (arc state guard), postureType per member. All in Golf discuss() loop. See domain-model.md for concepts.
- Football panel: YOUR OWN ANGLE FIRST already in place — A/B test ongoing vs other panels being compared
- Notes to archive: 2026-03-10-house-name-oracle.md (BL-053 CLOSED), 2026-03-13-gherkin-external-data-pattern.md (WL-137 CLOSED) — Rod hasn't actioned yet
