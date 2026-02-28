# Extreme Programming — Principles
# Heckler and Cox
# Last updated: 2026-02-28
# Reference: Kent Beck — Extreme Programming Explained (2nd ed, 2004)
# Practices: see .claude/practices/tdd.md, bdd.md, ci-cd.md

---

## The Core Insight

The best way to handle uncertainty in software development is to embrace change
rather than resist it. Short feedback loops make change cheap. Cheap change makes
uncertainty manageable. The practices exist to keep feedback loops short.

---

## The Five Values

**Simplicity**
Do what is needed and no more. The simplest thing that could possibly work.
Technical debt is deferred simplicity — it compounds.
Gold plating is stolen simplicity — it is waste dressed as generosity.

**Communication**
The team shares all knowledge. No silos, no heroes, no single points of failure.
Gherkin is communication made executable. If it cannot be communicated as a scenario,
it has not been understood.

**Feedback**
Every action produces a measurable response as quickly as possible.
A test suite that takes an hour to run is a broken feedback loop.
A pipeline that catches nothing Rod doesn't catch first is a broken feedback loop.

**Courage**
Tell the truth about progress. Revert when something is broken.
Don't add complexity to avoid a hard conversation.
The courage to delete code is as important as the courage to write it.

**Respect**
Every person on the team has value. Every person's contribution matters.
Rod's domain knowledge is irreplaceable. Claude's technical capability is a tool
in service of that knowledge. Neither works without the other.

---

## The Four Rules of Simple Design (Ron Jeffries ordering)

1. Passes all tests
2. Reveals intention — code communicates what it does
3. No duplication — DRY, single source of truth
4. Fewest elements — remove everything not required by a test

In priority order. Rule 1 always beats Rule 4. Never sacrifice passing tests for brevity.

---

## Why XP Works for a Two-Person Team

XP was designed for small, co-located teams with a real customer.
Rod and Claude are that team. The "customer on site" practice is Rod approving Gherkin.
Pair programming is Rod navigating, Claude driving.
The practices are not metaphors — they apply directly.

---

## The Fundamental Tension XP Resolves

Without discipline: fast early, slow forever (technical debt accumulates).
With wrong discipline: slow always (process for process's sake).
With XP discipline: fast and safe — because feedback loops catch problems before they compound.

Our current state (change failure rate ~100%) is the "fast early, slow forever" failure mode.
The integrated delivery cycle is the correction.
