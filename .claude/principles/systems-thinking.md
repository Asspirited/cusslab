# Systems Thinking — Principles
# Heckler and Cox
# Last updated: 2026-02-28
# Reference: Donella Meadows — Thinking in Systems (2008)
# Reference: Peter Senge — The Fifth Discipline (1990)
# Practices: see .claude/practices/retrospectives.md, 5-whys.md

---

## The Core Insight

Most failures are not caused by bad people or bad luck.
They are produced by systems. The system is perfectly designed to produce the results it gets.
To change the results, change the system — not the people, not the symptoms.

---

## Stocks and Flows

A stock is anything that accumulates or depletes over time.
A flow is the rate of change of a stock.

You cannot change a stock instantly. You can only change the flows.
This is why quick fixes that ignore flows produce temporary results.

**Our key stocks:**
- Technical debt (flows in: skipped steps; flows out: refactoring)
- Rod's trust in the pipeline (flows in: pipeline catches bugs; flows out: Rod catches bugs)
- Product quality (flows in: shipped features with green pipeline; flows out: Rod-caught bugs)

---

## Feedback Loops

**Reinforcing (amplifying) loops:** deviation compounds.
More bugs → less trust in pipeline → less rigorous testing → more bugs.
This is our current state.

**Balancing (stabilising) loops:** deviation corrects.
Pipeline catches bug → trust increases → more tests written → fewer bugs escape.
This is our target state.

Every system has both. The question is which loop dominates.
The integrated delivery cycle is designed to activate the balancing loop.

---

## Delays

The gap between cause and effect is a delay.
Long delays make systems hard to manage — feedback arrives too late to be useful.
Short delays make systems self-correcting.

The pipeline compresses the delay between writing a bug and discovering it.
Rod catching bugs in browser = delay of hours. Expensive.
Pipeline catching bugs = delay of seconds. Cheap.

---

## Emergence

Emergent properties cannot be predicted from individual components.
They arise from the interactions between components.

The panel conversation system produces emergent behaviour.
The irony framework produces emergent meaning from three simple criteria.
Character state across rounds produces emergent personality.

Design for emergence by making rules simple and interactions rich.
Complicated rules produce complicated, brittle systems.
Simple rules produce complex, robust behaviour.

---

## Unintended Consequences

Every intervention has second and third-order effects.
The intended effect is rarely the only effect.

Before implementing any architectural decision, ask:
- What does this make easier?
- What does this make harder?
- What does this make impossible?
- What does this incentivise that we don't want?

The mock-based test runner was intended to make testing faster.
Unintended consequence: false greens that hid real bugs.
The system was optimised for test speed at the cost of test truth.

---

## The Meta-System Insight

This project is a system. Rod, Claude, codebase, pipeline, standards are components.
The standards files are a balancing loop — they encode lessons and prevent recurrence.
The retrospectives are a delayed feedback mechanism.
The metrics are stock measurements.

When the system is healthy: Rod thinks about product, Claude implements, pipeline validates.
When the system is broken: everyone thinks about process, nothing ships.
The goal is always: return to healthy state as fast as possible.
