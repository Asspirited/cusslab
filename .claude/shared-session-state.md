# Shared Session State
Last updated: 2026-03-18 by Claude Code
Last commit: 1d75459 — TBT-011: hidden attribute model composing FORM

## What shipped this session

### TBT — Through the Biscuit Tin
- **TBT-011 CLOSED**: hidden attribute model composing FORM
  - `computeForm(attrs)` — pure function, returns FORM word from 4 core attributes + 2 weekly modifiers - lifeNoise
  - `calculateLifeNoise(state)` — 0-3 penalty from Nan red, bank critical, HOME red
  - `applyActivity` extended: returns attribute deltas (physiqueδ, sharpnessδ, freshnessδ, practiceSessionsδ, skillδ) not formDelta
  - GameState extended: physique=5, skill=3, confidence=5, tenacity=5, sharpness=1, freshness=2, practiceSessionsThisCycle=0
  - skill accumulates every 4 NETS sessions (PRACTICE_SESSIONS_PER_SKILL_POINT)
  - BANK_CRITICAL_THRESHOLD = £1.00
  - 19 new Gherkin scenarios in specs/tbt-attribute-model.feature — all green
  - tbt-weekly-cycle NETS step updated to new contract
  - domain-model.md TBT section updated with full attribute model documentation

### Process
- `session-insession.md` updated: "Ship after every BL close — always, no batching" rule added

### New BL items raised
- TBT-011 (CLOSED this session) — hidden attribute model (CD3=12.5)
- TBT-012 (OPEN) — Nan quality mechanic (CD3=20.0)

### New WL items
- WL-149: tbt.html local applyActivity diverged from engine (Low, OPEN)
- WL-150: Gherkin Examples boundary values wrong — 2 rows (Low, CLOSED same session)

### Design decisions (Three Amigos)
- TBT-011 attribute model: physique×0.70 + skill×0.60 + confidence×0.40 + tenacity×0.30 (base), + sharpness + freshness − lifeNoise
- Desire is narrative, not a stat — not modelled as an attribute
- New dials brainstormed (BODY, REPUTATION, HOME) — not yet raised as BL items

### Brainstorm captured
- Full scene/event/narrative-arc brainstorm for TBT Epic 1+ in session conversation (not yet filed as notes)

## Open waste items (WL numbers)
- WL-041: Mobile/tablet nav — Low — Three Amigos needed
- WL-097: Left nav focus trap — Low — deferred
- WL-MODE-002: Bobby George, Rod Harrington missing files — Low
- WL-123: Session context overflow — Low — ongoing mitigation
- WL-131: Character dullness — Medium — Three Amigos needed
- WL-136: UI audit IIFE return check — High — pipeline gap
- WL-147: backlog-report.js false-positive regex — Low
- WL-149: tbt.html applyActivity diverged from engine — Low

## Backlog top 3 by CD3 (TBT — ignoring Cusslab items)
- TBT-012 (CD3=20.0): Nan quality mechanic — Three Amigos done, Gherkin needed
- TBT-006 (CD3=19.0): Transport choices — Three Amigos needed
- TBT-007 (CD3=13.5): First cricket match — Three Amigos needed

## Protocol status this session
- Session startup: followed in full
- Gherkin gate: followed — Gherkin approved before implementation
- TDD: followed — red before green, 823/823
- Pipeline: GREEN throughout (canary OK, all checks passing)
- Ship rule: TBT-011 committed and pushed immediately on BDD CLOSE ✓

## Carry-forward notes
- TBT-012 is agreed next session priority — Three Amigos done, Gherkin needed first
- TBT-006 after that — Three Amigos first
- tbt.html still uses local applyActivity (formDelta model) — needs wiring to engine before attribute model goes live (WL-149)
- Brainstorm of new TBT scenes/events discussed in session — should be captured as notes file if Rod wants to reference in Claude.ai
- Three new dial candidates discussed (BODY, REPUTATION, HOME) — informal Three Amigos only, not yet BL items
- formDelta is now always 0 in applyActivity delta — dead field, can be removed in a future cleanup
